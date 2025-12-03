import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const [rows]: any = await pool.query(`
      SELECT b.*, c.cat_nombre, u.usu_nombre 
      FROM tbl_blog b
      LEFT JOIN tbl_categoria_blog c ON b.blog_cat_id = c.cat_id
      LEFT JOIN tbl_usuarios u ON b.blog_autor_id = u.usu_id
      WHERE b.blog_slug = ? AND b.blog_estado = 'publicado'
    `, [params.slug]);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    return NextResponse.json({ error: 'Error fetching post' }, { status: 500 });
  }
}
