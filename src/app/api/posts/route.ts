import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM tbl_publicaciones ORDER BY publi_creado_en DESC');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Error fetching posts' }, { status: 500 });
  }
}
