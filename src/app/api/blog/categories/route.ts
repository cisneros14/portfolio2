import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM tbl_categoria_blog ORDER BY cat_creado_en DESC');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Error fetching categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cat_nombre, cat_slug, cat_descripcion } = body;

    if (!cat_nombre || !cat_slug) {
      return NextResponse.json({ error: 'Name and Slug are required' }, { status: 400 });
    }

    const [result]: any = await pool.query(
      'INSERT INTO tbl_categoria_blog (cat_nombre, cat_slug, cat_descripcion) VALUES (?, ?, ?)',
      [cat_nombre, cat_slug, cat_descripcion]
    );

    return NextResponse.json({ id: result.insertId, message: 'Category created successfully' });
  } catch (error: any) {
    console.error('Error creating category:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Error creating category' }, { status: 500 });
  }
}
