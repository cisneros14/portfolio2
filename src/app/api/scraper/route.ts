
import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

const GOOGLE_PLACES_ENDPOINT = 'https://places.googleapis.com/v1/places:searchText';

export async function POST(request: Request) {
  try {
    const { search_keyword, pageToken } = await request.json();

    if (!search_keyword) {
      return NextResponse.json({ error: 'Search keyword is required' }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.error('GOOGLE_MAPS_API_KEY is missing');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // 1. Call Google Places API
    const requestBody: any = {
      textQuery: search_keyword,
      pageSize: 20
    };
    if (pageToken) {
      requestBody.pageToken = pageToken;
    }

    const googleResponse = await fetch(GOOGLE_PLACES_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        // Include nextPageToken in the mask if we want to receive it? 
        // Actually field mask applies to the FIELDS of the resource (Place). 
        // nextPageToken is a top-level field in the response, not inside 'places'.
        // BUT for Places API (New), using FieldMask header ONLY returns those fields for the places.
        // It DOES NOT affect top level fields like nextPageToken.
        'X-Goog-FieldMask': 'places.id,places.displayName,places.businessStatus,places.formattedAddress,places.nationalPhoneNumber,places.websiteUri,places.userRatingCount,places.primaryType,nextPageToken', 
      },
      body: JSON.stringify(requestBody),
    });

    if (!googleResponse.ok) {
      const errorText = await googleResponse.text();
      console.error('Google API Error:', errorText);
      return NextResponse.json({ error: `Google API Error: ${googleResponse.statusText}` }, { status: googleResponse.status });
    }

    const data = await googleResponse.json();
    const places = data.places || [];
    const nextPageToken = data.nextPageToken;

    // Stats counters
    let rejected_status = 0;
    let rejected_website = 0;
    let rejected_rating = 0;

    // 2. Filter Leads
    const validLeads = places.filter((place: any) => {
      // Log for debugging
      const name = place.displayName?.text;
      const status = place.businessStatus;
      const web = place.websiteUri;
      const rating = place.userRatingCount;
      
      console.log(`Checking: ${name} | Status: ${status} | Web: ${web} | Rating: ${rating}`);

      // Filtro de Estado: Only OPERATIONAL
      if (place.businessStatus !== 'OPERATIONAL') {
        console.log(`-> Rejected ${name}: Not OPERATIONAL (${status})`);
        rejected_status++;
        return false;
      }

      // Filtro de Web: Discard if websiteUri exists and is not empty
      if (place.websiteUri && place.websiteUri.trim() !== '') {
        console.log(`-> Rejected ${name}: Has Website (${web})`);
        rejected_website++;
        return false;
      }

      // Filtro de Calidad: Rating >= 5
      const ratingCount = place.userRatingCount || 0;
      if (ratingCount < 5) { 
         console.log(`-> Rejected ${name}: Low Rating (${ratingCount})`);
         rejected_rating++;
         return false;
      }

      console.log(`-> ACCEPTED ${name}`);
      return true;
    });

    // 3. Insert into Database
    let insertedCount = 0;
    
    // We process sequentially or in parallel? Parallel is fine for DB inserts usually but let's be safe.
    // Using simple loop for clarity.
    for (const lead of validLeads) {
      const google_place_id = lead.id;
      const business_name = lead.displayName?.text || 'Unknown';
      const phone_number = lead.nationalPhoneNumber || null;
      const address = lead.formattedAddress || null;
      const rating_count = lead.userRatingCount || 0;
      const business_type = lead.primaryType || null;
      const business_status = lead.businessStatus;
      
      const query = `
        INSERT INTO leads_sin_web 
        (google_place_id, business_name, phone_number, address, rating_count, business_type, business_status, search_keyword)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
          rating_count = VALUES(rating_count),
          business_name = VALUES(business_name),
          phone_number = VALUES(phone_number),
          address = VALUES(address)
      `;

      try {
        await pool.execute(query, [
          google_place_id, 
          business_name, 
          phone_number, 
          address, 
          rating_count, 
          business_type, 
          business_status, 
          search_keyword
        ]);
        insertedCount++;
      } catch (err) {
        console.error(`Error inserting lead ${google_place_id}:`, err);
        // Continue with next one
      }
    }

    return NextResponse.json({
      success: true,
      found: places.length,
      filtered_valid: validLeads.length,
      inserted: insertedCount,
      nextPageToken: nextPageToken,
      rejection_stats: {
        status: rejected_status,
        website: rejected_website,
        rating: rejected_rating
      }
    });

  } catch (error: any) {
    console.error('Scraper Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const status = searchParams.get('status');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const rating = searchParams.get('rating');
    const country = searchParams.get('country');
    const meta = searchParams.get('meta'); // If true, return only metadata (like countries)

    // Helper to identify country from phone
    const getCountryFromPhoneSQL = () => `
      CASE 
        WHEN phone_number LIKE '+593%' OR phone_number LIKE '09%' OR phone_number LIKE '(02)%' OR phone_number LIKE '02%' THEN 'Ecuador'
        WHEN phone_number LIKE '+1%' OR phone_number REGEXP '^\\\\([0-9]{3}\\\\)' OR phone_number LIKE '1-%' THEN 'USA/Canadá'
        WHEN phone_number LIKE '+34%' THEN 'España'
        WHEN phone_number LIKE '+52%' THEN 'México'
        WHEN phone_number LIKE '+57%' THEN 'Colombia'
        WHEN phone_number LIKE '+51%' THEN 'Perú'
        WHEN phone_number LIKE '+54%' THEN 'Argentina'
        WHEN phone_number LIKE '+56%' THEN 'Chile'
        WHEN phone_number LIKE '+44%' THEN 'Reino Unido'
        WHEN phone_number LIKE '+61%' THEN 'Australia'
        WHEN phone_number LIKE '+64%' THEN 'Nueva Zelanda'
        ELSE 'Otro'
      END
    `;

    // Mode 1: Metadata (Available Countries)
    if (meta === 'countries') {
      const query = `
        SELECT DISTINCT ${getCountryFromPhoneSQL()} as country
        FROM leads_sin_web
        WHERE phone_number IS NOT NULL AND phone_number != ''
        HAVING country != 'Otro'
        ORDER BY country ASC
      `;
      const [rows] = await pool.query<RowDataPacket[]>(query);
      return NextResponse.json(rows);
    }

    // Pagination Params
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '15', 10); // user requested 15
    const offset = (page - 1) * limit;

    // Mode 2: Filtering (Paginated)
    // Base WHERE clause
    let whereClause = 'WHERE 1=1';
    const params: any[] = [];

    // 1. General Search (q)
    if (q) {
      whereClause += ` AND (
        business_name LIKE ? OR 
        address LIKE ? OR 
        phone_number LIKE ? OR 
        search_keyword LIKE ? OR
        admin_notes LIKE ?
      )`;
      const likeQ = `%${q}%`;
      params.push(likeQ, likeQ, likeQ, likeQ, likeQ);
    }

    // 2. Status
    if (status) {
      // If user explicitly asks for "ALL", we might want to show everything including rejected?
      // But UI sends "ALL" as empty string or checks logic?
      // In the UI: value="ALL" -> params.append("status", filterStatus) is NOT called if filterStatus === "ALL"
      // So if status is present, it is a specific status (including RECHAZADO).
      if (status !== 'ALL') {
          whereClause += ' AND lead_status = ?';
          params.push(status);
      }
    } else {
      // Default view: Exclude RECHAZADO
      whereClause += " AND lead_status != 'RECHAZADO'";
    }

    // 3. Date Range
    if (dateFrom) {
      whereClause += ' AND scrapped_at >= ?';
      params.push(dateFrom); // Assuming format YYYY-MM-DD
    }
    if (dateTo) {
      whereClause += ' AND scrapped_at <= ?';
      params.push(dateTo + ' 23:59:59');
    }

    // 4. Rating
    if (rating) {
      whereClause += ' AND rating_count >= ?';
      params.push(Number(rating));
    }

    // 5. Country
    if (country) {
       if (country === 'Ecuador') {
         whereClause += " AND (phone_number LIKE '+593%' OR phone_number LIKE '09%' OR phone_number LIKE '(02)%' OR phone_number LIKE '02%')";
       } else if (country === 'USA/Canadá') {
         whereClause += " AND (phone_number LIKE '+1%' OR phone_number REGEXP '^\\\\([0-9]{3}\\\\)' OR phone_number LIKE '1-%')";
       } else if (country === 'España') {
         whereClause += " AND phone_number LIKE '+34%'";
       } else if (country === 'México') {
         whereClause += " AND phone_number LIKE '+52%'";
       } else if (country === 'Colombia') {
         whereClause += " AND phone_number LIKE '+57%'";
       } else if (country === 'Perú') {
         whereClause += " AND phone_number LIKE '+51%'";
       } else if (country === 'Argentina') {
         whereClause += " AND phone_number LIKE '+54%'";
       } else if (country === 'Chile') {
         whereClause += " AND phone_number LIKE '+56%'";
       } else if (country === 'Reino Unido') {
         whereClause += " AND phone_number LIKE '+44%'";
       } else if (country === 'Australia') {
         whereClause += " AND phone_number LIKE '+61%'";
       } else if (country === 'Nueva Zelanda') {
         whereClause += " AND phone_number LIKE '+64%'";
       } else {
         // Generic fallback or 'Otro'
         whereClause += " AND phone_number NOT LIKE '+593%' AND phone_number NOT LIKE '09%' AND phone_number NOT LIKE '+1%' AND phone_number NOT REGEXP '^\\\\([0-9]{3}\\\\)'"; 
       }
    }

    // Query 1: Get Data
    const dataQuery = `SELECT *, ${getCountryFromPhoneSQL()} as detected_country FROM leads_sin_web ${whereClause} ORDER BY scrapped_at DESC LIMIT ? OFFSET ?`;
    const dataParams = [...params, limit, offset];
    const [rows] = await pool.query<RowDataPacket[]>(dataQuery, dataParams);

    // Query 2: Get Total Count
    const countQuery = `SELECT COUNT(*) as total FROM leads_sin_web ${whereClause}`;
    const [countRows] = await pool.query<RowDataPacket[]>(countQuery, params);
    const total = countRows[0]?.total || 0;

    return NextResponse.json({
        leads: rows,
        total: total,
        page: page,
        limit: limit,
        totalPages: Math.ceil(total / limit)
    });
  } catch (error: any) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Database Error: ' + error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, status, admin_notes, phone_number } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (status !== undefined) {
      updates.push('lead_status = ?');
      values.push(status);
    }

    if (admin_notes !== undefined) {
      updates.push('admin_notes = ?');
      values.push(admin_notes);
    }

    if (phone_number !== undefined) {
      updates.push('phone_number = ?');
      values.push(phone_number);
    }

    if (updates.length === 0) {
       return NextResponse.json({ success: true, message: 'Nothing to update' });
    }

    values.push(id);
    const query = `UPDATE leads_sin_web SET ${updates.join(', ')} WHERE id = ?`;

    await pool.execute(query, values);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Update Error:', error);
    return NextResponse.json({ error: error.message || 'Update Error' }, { status: 500 });
  }
}
