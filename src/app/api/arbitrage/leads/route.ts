import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    let query = 'SELECT * FROM leads';
    const params: any[] = [];

    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC LIMIT 100'; // Limit for performance

    const [rows] = await pool.query(query, params);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({ error: 'Error fetching leads' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      batch_id, business_name, address, phone_number, 
      google_maps_url, rating, review_count, 
      has_website, website_url, status 
    } = body;

    if (!business_name) {
      return NextResponse.json({ error: 'Business Name is required' }, { status: 400 });
    }

    const [result]: any = await pool.query(
      `INSERT INTO leads (
        batch_id, business_name, address, phone_number, 
        google_maps_url, rating, review_count, 
        has_website, website_url, status, google_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        batch_id || null, business_name, address, phone_number,
        google_maps_url, rating, review_count,
        has_website || 'UNKNOWN', website_url, status || 'NEW',
        body.google_id || null
      ]
    );

    return NextResponse.json({ id: result.insertId, message: 'Lead created successfully' });
  } catch (error: any) {
    console.error('Error creating lead:', error);
    return NextResponse.json({ error: 'Error creating lead' }, { status: 500 });
  }
}
