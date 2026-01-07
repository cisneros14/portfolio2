import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM niches ORDER BY created_at DESC');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching niches:', error);
    return NextResponse.json({ error: 'Error fetching niches' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, avg_ticket_value } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const [result]: any = await pool.query(
      'INSERT INTO niches (name, description, avg_ticket_value) VALUES (?, ?, ?)',
      [name, description, avg_ticket_value || null]
    );

    return NextResponse.json({ id: result.insertId, message: 'Niche created successfully' });
  } catch (error: any) {
    console.error('Error creating niche:', error);
    return NextResponse.json({ error: 'Error creating niche' }, { status: 500 });
  }
}
