import { pool } from '@/lib/db';
import chromium from '@sparticuz/chromium-min';
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
      // @sparticuz/chromium-min requires a remote binary
      browser = await playwright.chromium.launch({
        args: [
            ...chromium.args,
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu",
            "--no-first-run",
            "--no-zygote",
            "--single-process", // Critical for Vercel
        ],
        executablePath: await chromium.executablePath(
          "https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar"
        ),
        headless: true,
      });
    } else {
      // Local Development
      const { chromium: localChromium } = await import('playwright');
      browser = await localChromium.launch({ headless: true });
    }

    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });
    const page = await context.newPage();
  
    const scrapedLeads: ScrapeResult[] = [];
    const seenGoogleIds = new Set<string>();

    console.log('Navigating to Google Maps...');
    await page.goto('https://www.google.com/maps?hl=es'); // Force Spanish
    
    // Handle cookies if present (robust attempt)
    try {
        const acceptBtn = page.getByRole('button', { name: /((accept|aceptar|consent).*(all|todo)|agreed)/i });
        if (await acceptBtn.count() > 0 && await acceptBtn.first().isVisible()) {
            await acceptBtn.first().click();
            await page.waitForTimeout(1000);
        }
    } catch (e) {
        // Ignore cookie errors
    }

    // Search
    console.log(`Searching for: ${query}`);
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
    console.log('Waiting for results feed...');
    try {
        await page.waitForSelector('div[role="feed"]', { timeout: 15000 });
        console.log('Feed found!');
    } catch(e) {
        console.log("Feed selector not found, trying to find results directly...");
    }

    const feed = page.locator('div[role="feed"]');
    let processedCards = 0;
    let consecutiveNoNewLeads = 0;

    // Main Loop: Scroll -> Extract -> Repeat until maxResults met
    while (scrapedLeads.length < maxResults) {
        // Try multiple selectors for cards
        let cards = await page.locator('div.Nv2PK').all();
        if (cards.length === 0) {
             cards = await page.locator('div[role="article"]').all();
        }
        if (cards.length === 0) {
             // Fallback: look for links to places
             const links = await page.locator('a[href*="/maps/place/"]').all();
             // Get parents (approximate card) - this is a bit hacky but a good fallback
             // We'll just use the link itself as the interaction point if needed, 
             // but for now let's stick to the article role which is standard.
             if (links.length > 0) console.log("Found links but no card containers. Layout might have changed.");
        }

        const currentTotalCards = cards.length;
        
        console.log(`Found ${currentTotalCards} cards total. Processed so far: ${processedCards}. Leads found: ${scrapedLeads.length}`);

        // Process new cards only
        for (let i = processedCards; i < currentTotalCards; i++) {
            // Check if we have enough leads mid-loop
            if (scrapedLeads.length >= maxResults) break;

            const card = cards[i];
            try {
                // Scroll card into view to ensure it's interactive
                await card.scrollIntoViewIfNeeded();
                
                // Click to load details (with random delay)
                await card.click();
                await page.waitForTimeout(500 + Math.random() * 500); // 500-1000ms delay

                let name = await card.getAttribute('aria-label') || 'Unknown';
                
                // Google ID (data-item-id) - Check EARLY
                let googleId = await card.getAttribute('data-item-id');
                
                // Fallback: Check anchor tag for data-item-id or use href
                if (!googleId) {
                    const link = card.locator('a').first();
                    if (await link.count() > 0) {
                        googleId = await link.getAttribute('data-item-id');
                        if (!googleId) {
                            const href = await link.getAttribute('href');
                            if (href) {
                                // Extract something unique from URL or just use the whole URL
                                googleId = href; 
                            }
                        }
                    }
                }

                if (!googleId || seenGoogleIds.has(googleId)) {
                    console.log(`Skipping duplicate or missing ID. Name: ${name}, ID: ${googleId}`);
                    continue;
                }

                // Website - Check EARLY to avoid expensive processing if it has one
                let website = null;
                try {
                    const webLink = page.locator('a[data-item-id="authority"]');
                    if (await webLink.count() > 0) {
                        website = await webLink.getAttribute('href');
                    }
                } catch (e) {}

                // FILTER: Skip if website exists
                if (website) {
                    console.log(`Skipping ${name} - Has website: ${website}`);
                    continue;
                }

                // If we got here, it's a valid lead! Extract the rest.
                
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

                seenGoogleIds.add(googleId);
                scrapedLeads.push({
                    businessName: name,
                    address,
                    phone,
                    website,
                    rating,
                    reviews,
                    googleMapsUrl: page.url(),
                    googleId: googleId! // Assert non-null as we checked it above
                });
                console.log(`✅ Added lead: ${name}`);

            } catch (e) {
                console.error(`Error scraping card ${i}:`, e);
            }
        }

        processedCards = currentTotalCards;

        // Scroll to load more - IMPROVED
        console.log('Scrolling to load more results...');
        
        // Method 1: Scroll to last card
        if (cards.length > 0) {
            const lastCard = cards[cards.length - 1];
            await lastCard.scrollIntoViewIfNeeded();
        }

        // Method 2: Scroll feed container
        await feed.evaluate((el) => el.scrollTop = el.scrollHeight);
        
        await page.waitForTimeout(2000 + Math.random() * 1000);

        // Check if we are stuck (no new cards loaded)
        const newTotalCards = await page.locator('div.Nv2PK').count();
        if (newTotalCards === currentTotalCards) {
            consecutiveNoNewLeads++;
            console.log(`No new cards loaded. Retry ${consecutiveNoNewLeads}/10`);
            
            // Method 3: Force keyboard scroll if stuck
            if (consecutiveNoNewLeads > 2) {
                 console.log('Trying keyboard scroll...');
                 await feed.focus();
                 await page.keyboard.press('PageDown');
                 await page.waitForTimeout(1000);
            }

            if (consecutiveNoNewLeads >= 10) {
                console.log("Max retries reached (10), stopping search.");
                break;
            }
        } else {
            consecutiveNoNewLeads = 0;
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
