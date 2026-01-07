import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM target_locations ORDER BY created_at DESC');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching locations:', error);
    return NextResponse.json({ error: 'Error fetching locations' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { city, country, language_code, currency_symbol } = body;

    if (!city || !country) {
      return NextResponse.json({ error: 'City and Country are required' }, { status: 400 });
    }

    const [result]: any = await pool.query(
      'INSERT INTO target_locations (city, country, language_code, currency_symbol) VALUES (?, ?, ?, ?)',
      [city, country, language_code || 'EN', currency_symbol || '$']
    );

    return NextResponse.json({ id: result.insertId, message: 'Location created successfully' });
  } catch (error: any) {
    console.error('Error creating location:', error);
    return NextResponse.json({ error: 'Error creating location' }, { status: 500 });
  }
}
