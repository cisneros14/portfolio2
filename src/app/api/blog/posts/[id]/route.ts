import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const [rows]: any = await pool.query('SELECT * FROM tbl_blog WHERE blog_id = ?', [params.id]);
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json({ error: 'Error fetching post' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { 
      blog_titulo, 
      blog_slug, 
      blog_cat_id, 
      blog_extracto, 
      blog_contenido, 
      blog_imagen_portada, 
      blog_estado,
      blog_seo_keywords,
      blog_seo_description
    } = body;

    if (!blog_titulo || !blog_slug || !blog_contenido) {
      return NextResponse.json({ error: 'Title, Slug and Content are required' }, { status: 400 });
    }

    await pool.query(
      `UPDATE tbl_blog SET 
        blog_titulo = ?, blog_slug = ?, blog_cat_id = ?, 
        blog_extracto = ?, blog_contenido = ?, blog_imagen_portada = ?, 
        blog_estado = ?, blog_seo_keywords = ?, blog_seo_description = ?
      WHERE blog_id = ?`,
      [
        blog_titulo, blog_slug, blog_cat_id || null,
        blog_extracto, blog_contenido, blog_imagen_portada,
        blog_estado, blog_seo_keywords, blog_seo_description,
        params.id
      ]
    );

    return NextResponse.json({ message: 'Post updated successfully' });
  } catch (error: any) {
    console.error('Error updating post:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Error updating post' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await pool.query('DELETE FROM tbl_blog WHERE blog_id = ?', [params.id]);
    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Error deleting post' }, { status: 500 });
  }
}
