import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM tbl_proyectos ORDER BY pro_creado_en DESC');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Error fetching projects' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pro_titulo, pro_subtitulo, pro_imagen, pro_link } = body;

    if (!pro_titulo) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const [result]: any = await pool.query(
      'INSERT INTO tbl_proyectos (pro_titulo, pro_subtitulo, pro_imagen, pro_link) VALUES (?, ?, ?, ?)',
      [pro_titulo, pro_subtitulo, pro_imagen, pro_link]
    );

    return NextResponse.json({ id: result.insertId, message: 'Project created successfully' });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Error creating project' }, { status: 500 });
  }
}
