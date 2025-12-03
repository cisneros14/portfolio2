import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { cat_nombre, cat_slug, cat_descripcion } = body;

    if (!cat_nombre || !cat_slug) {
      return NextResponse.json({ error: 'Name and Slug are required' }, { status: 400 });
    }

    await pool.query(
      'UPDATE tbl_categoria_blog SET cat_nombre = ?, cat_slug = ?, cat_descripcion = ? WHERE cat_id = ?',
      [cat_nombre, cat_slug, cat_descripcion, id]
    );

    return NextResponse.json({ message: 'Category updated successfully' });
  } catch (error: any) {
    console.error('Error updating category:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Error updating category' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await pool.query('DELETE FROM tbl_categoria_blog WHERE cat_id = ?', [id]);
    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Error deleting category' }, { status: 500 });
  }
}
