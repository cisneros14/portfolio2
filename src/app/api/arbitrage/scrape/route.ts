import { NextResponse } from 'next/server';
import { scrapeGoogleMaps } from '@/lib/scraper';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query, maxResults } = body;

    if (!query) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
    }

    // Run scraper
    // Note: In a production environment, this should be offloaded to a background job queue (e.g., BullMQ, Inngest)
    // because Vercel/Next.js serverless functions have timeouts (usually 10-60s).
    // For this local/VPS setup, we'll await it, but be aware of potential timeouts for large scrapes.
    
    const result = await scrapeGoogleMaps(query, parseInt(maxResults) || 20);

    return NextResponse.json({ 
      message: 'Scraping completed successfully', 
      data: result 
    });

  } catch (error: any) {
    console.error('Scraping failed:', error);
    return NextResponse.json({ error: error.message || 'Scraping failed' }, { status: 500 });
  }
}
