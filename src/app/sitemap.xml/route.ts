import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { generateSitemapXml, SimpleBlogPost } from '@/lib/seo-utils';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // 1. Obtener posts publicados de la base de datos
    // Se seleccionan solo los campos necesarios para el sitemap
    const [rows] = await pool.query(`
      SELECT blog_slug, blog_creado_en 
      FROM tbl_blog 
      WHERE blog_estado = 'publicado'
      ORDER BY blog_creado_en DESC
    `);
    
    // 2. Generar sitemap XML combinando estáticas y dinámicas
    const sitemap = generateSitemapXml(rows as SimpleBlogPost[]);
    
    return new NextResponse(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        // Cache por 1 hora
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}
