import { pool } from '@/lib/db';
import chromium from '@sparticuz/chromium';
import playwright from 'playwright-core';

interface ScrapeResult {
  businessName: string;
  address: string | null;
  phone: string | null;
  website: string | null;
  rating: number | null;
  reviews: number | null;
  googleMapsUrl: string | null;
  googleId: string | null;
}

export async function scrapeGoogleMaps(query: string, maxResults: number = 20) {
  console.log(`Starting scraper for: ${query} (Max: ${maxResults})`);
  
  let browser;
  
  try {
    // Conditional launch logic
    if (process.env.NODE_ENV === 'production') {
      // Production (Vercel)
      // @sparticuz/chromium provides the path to the chromium binary
      browser = await playwright.chromium.launch({
        args: chromium.args,
        executablePath: await chromium.executablePath(),
        headless: true,
      });
    } else {
      // Local Development
      // Dynamically import standard playwright to avoid bundling it in production if possible,
      // or just use it since it's in dependencies.
      const { chromium: localChromium } = await import('playwright');
      browser = await localChromium.launch({ headless: true });
    }

    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });
    const page = await context.newPage();
  
    const scrapedLeads: ScrapeResult[] = [];

    await page.goto('https://www.google.com/maps');

    // Handle cookies if present (simple attempt)
    try {
        const acceptBtn = page.getByRole('button', { name: 'Accept all' });
        if (await acceptBtn.isVisible()) {
            await acceptBtn.click();
        }
    } catch (e) {
        // Ignore cookie errors
    }

    // Search
    // Try multiple selectors for the search box to handle different locales/versions
    const searchInput = page.locator('#searchboxinput').or(page.locator('input[name="q"]'));
    
    try {
        await searchInput.waitFor({ state: 'visible', timeout: 10000 });
        await searchInput.fill(query);
        await searchInput.press('Enter');
    } catch (e) {
        console.error('Could not find search box:', e);
        throw new Error('Could not find search input field on Google Maps.');
    }

    // Wait for results
    await page.waitForSelector('div[role="feed"]', { timeout: 15000 });

    // Scroll loop
    const feed = page.locator('div[role="feed"]');
    let previousCount = 0;
    let retries = 0;

    while (scrapedLeads.length < maxResults) {
        // Scroll
        await feed.evaluate((el) => el.scrollTop = el.scrollHeight);
        await page.waitForTimeout(2000);

        const cards = page.locator('div.Nv2PK');
        const count = await cards.count();

        if (count === previousCount) {
            retries++;
            if (retries > 3) break;
        } else {
            retries = 0;
        }
        previousCount = count;
        
        if (count >= maxResults) break;
    }

    // Extract Data
    const cards = await page.locator('div.Nv2PK').all();
    const limit = Math.min(cards.length, maxResults);

    for (let i = 0; i < limit; i++) {
        const card = cards[i];
        try {
            // Click to load details
            await card.click();
            await page.waitForTimeout(1000);

            let name = await card.getAttribute('aria-label') || 'Unknown';
            // Try to get better name from H1
            try {
                const h1 = page.locator('h1.DUwDvf').first();
                if (await h1.isVisible()) {
                    name = await h1.innerText();
                }
            } catch (e) {}

            // Address
            let address = null;
            try {
                const addrBtn = page.locator('button[data-item-id="address"]');
                if (await addrBtn.count() > 0) {
                    const addrText = await addrBtn.getAttribute('aria-label');
                    if (addrText) address = addrText.replace('Address: ', '').trim();
                }
            } catch (e) {}

            // Phone
            let phone = null;
            try {
                const phoneBtn = page.locator('button[data-item-id^="phone"]');
                if (await phoneBtn.count() > 0) {
                    const phoneText = await phoneBtn.getAttribute('aria-label');
                    if (phoneText) phone = phoneText.replace('Phone: ', '').trim();
                }
            } catch (e) {}

            // Website
            let website = null;
            try {
                const webLink = page.locator('a[data-item-id="authority"]');
                if (await webLink.count() > 0) {
                    website = await webLink.getAttribute('href');
                }
            } catch (e) {}

            // Rating & Reviews
            let rating = null;
            let reviews = null;
            try {
                const ratingDiv = page.locator('div.F7nice').first();
                if (await ratingDiv.isVisible()) {
                    const text = await ratingDiv.innerText();
                    const ratingMatch = text.match(/(\d\.\d)/);
                    const reviewsMatch = text.match(/\((\d+)\)/);
                    if (ratingMatch) rating = parseFloat(ratingMatch[1]);
                    if (reviewsMatch) reviews = parseInt(reviewsMatch[1]);
                }
            } catch (e) {}

            // Google ID (data-item-id)
            const googleId = await card.getAttribute('data-item-id');

            scrapedLeads.push({
                businessName: name,
                address,
                phone,
                website,
                rating,
                reviews,
                googleMapsUrl: page.url(),
                googleId
            });

        } catch (e) {
            console.error(`Error scraping card ${i}:`, e);
        }
    }

    // Save to DB
    console.log(`Saving ${scrapedLeads.length} leads to DB...`);
    let savedCount = 0;
    
    // Create a batch for this search
    const [batchResult]: any = await pool.query(
        'INSERT INTO search_batches (search_term_used, total_results) VALUES (?, ?)',
        [query, scrapedLeads.length]
    );
    const batchId = batchResult.insertId;

    for (const lead of scrapedLeads) {
        try {
            // Use INSERT IGNORE or ON DUPLICATE KEY UPDATE to handle duplicates by google_id
            await pool.query(
                `INSERT INTO leads (
                    batch_id, business_name, address, phone_number, 
                    google_maps_url, rating, review_count, 
                    has_website, website_url, status, google_id
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE 
                    business_name = VALUES(business_name),
                    rating = VALUES(rating),
                    review_count = VALUES(review_count),
                    updated_at = NOW()`,
                [
                    batchId,
                    lead.businessName,
                    lead.address,
                    lead.phone,
                    lead.googleMapsUrl,
                    lead.rating,
                    lead.reviews,
                    lead.website ? true : false,
                    lead.website,
                    'NEW',
                    lead.googleId
                ]
            );
            savedCount++;
        } catch (e) {
            console.error('Error inserting lead:', e);
        }
    }

    return { success: true, total: scrapedLeads.length, saved: savedCount };

  } catch (error) {
    console.error('Scraper error:', error);
    throw error;
  } finally {
    if (browser) {
        await browser.close();
    }
  }
}
