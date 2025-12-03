import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT 
        b.*,
        c.cat_nombre,
        u.usu_nombre
      FROM tbl_blog b
      LEFT JOIN tbl_categoria_blog c ON b.blog_cat_id = c.cat_id
      LEFT JOIN tbl_usuarios u ON b.blog_autor_id = u.usu_id
      ORDER BY b.blog_creado_en DESC
    `);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json({ error: 'Error fetching blog posts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
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

    // TODO: Get actual user ID from session. For now using 1 or NULL if not available.
    // In a real app, you'd extract this from the session/token.
    const blog_autor_id = 1; 

    const [result]: any = await pool.query(
      `INSERT INTO tbl_blog (
        blog_titulo, blog_slug, blog_cat_id, blog_autor_id, 
        blog_extracto, blog_contenido, blog_imagen_portada, 
        blog_estado, blog_seo_keywords, blog_seo_description
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        blog_titulo, blog_slug, blog_cat_id || null, blog_autor_id,
        blog_extracto, blog_contenido, blog_imagen_portada,
        blog_estado || 'borrador', blog_seo_keywords, blog_seo_description
      ]
    );

    return NextResponse.json({ id: result.insertId, message: 'Post created successfully' });
  } catch (error: any) {
    console.error('Error creating post:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Error creating post' }, { status: 500 });
  }
}
