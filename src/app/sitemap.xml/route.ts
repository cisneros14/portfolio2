import { NextResponse } from 'next/server';
import { generateGhostSlugs } from '@/lib/ghost-content-generator';
import { generateGhostSitemap } from '@/lib/seo-utils';

export async function GET() {
  try {
    // Generar slugs para páginas fantasma
    const slugs = generateGhostSlugs(1000);
    
    // Generar sitemap XML
    const sitemap = generateGhostSitemap(slugs);
    
    return new NextResponse(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}
