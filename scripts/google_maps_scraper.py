import re
import time
import pandas as pd
from playwright.sync_api import sync_playwright

# --- CONFIGURATION ---
SEARCH_QUERY = "Plumbers in Miami"  # Change this to your desired niche + location
OUTPUT_FILE = "leads_results.xlsx"
MAX_RESULTS = 30  # Number of results to try and fetch

def extract_business_info(page, locator):
    """Extracts data from a single business listing card."""
    try:
        # Click the card to open details (sometimes needed for full info, 
        # but for list view we try to grab what's visible or click if needed)
        # For this robust version, we will iterate the list items.
        
        # Note: Google Maps structure changes often. This selector strategy 
        # targets the common container attributes.
        
        text_content = locator.inner_text()
        lines = text_content.split('\n')
        
        business_name = lines[0] if lines else "Unknown"
        
        # Rating and Reviews (e.g., "4.8(150)")
        rating = None
        reviews = 0
        
        # Try to find rating/reviews in text
        # Regex for "4.5(100)" or "4.5 (100)"
        rating_match = re.search(r"(\d\.\d)\s*\((\d+)\)", text_content)
        if rating_match:
            rating = float(rating_match.group(1))
            reviews = int(rating_match.group(2))
            
        # Website
        # We need to check if a website button exists within this card or if we need to click it.
        # Strategy: Click the card, wait for detail panel, extract info, go back? 
        # Better Strategy for speed: Scroll list, extract from list items if possible.
        # However, website link is often hidden in list view unless it's an ad.
        # Reliable Strategy: Click each result.
        
        locator.click()
        time.sleep(2) # Wait for details panel to load
        
        # Extract from Details Panel
        # Business Name (H1)
        try:
            business_name = page.locator('h1.DUwDvf').first.inner_text()
        except:
            pass # Keep list name if fail
            
        # Address
        address = "N/A"
        try:
            # Look for button with data-item-id="address"
            address = page.locator('button[data-item-id="address"]').get_attribute("aria-label")
            if address:
                address = address.replace("Address: ", "").strip()
        except:
            pass

        # Phone
        phone = "N/A"
        try:
            phone = page.locator('button[data-item-id^="phone"]').get_attribute("aria-label")
            if phone:
                phone = phone.replace("Phone: ", "").strip()
        except:
            pass
            
        # Website
        website = ""
        try:
            # Look for website button (usually has data-item-id="authority")
            website_btn = page.locator('a[data-item-id="authority"]')
            if website_btn.count() > 0:
                website = website_btn.get_attribute("href")
        except:
            pass
            
        return {
            "Business Name": business_name,
            "Address": address,
            "Phone Number": phone,
            "Website": website if website else "NO WEBSITE",
            "Rating": rating,
            "Reviews": reviews,
            "Search Query": SEARCH_QUERY
        }
        
    except Exception as e:
        print(f"Error extracting info: {e}")
        return None

def main():
    with sync_playwright() as p:
        # Launch browser (headless=False to see it working)
        browser = p.chromium.launch(headless=False)
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )
        page = context.new_page()

        print(f"Navigating to Google Maps for query: {SEARCH_QUERY}")
        page.goto("https://www.google.com/maps")
        
        # Handle Cookie Consent (EU) - Try to click "Accept all" or "Reject all"
        try:
            page.get_by_role("button", name="Accept all").click(timeout=3000)
            print("Accepted cookies.")
        except:
            pass # No cookie banner or different text

        # Search
        page.get_by_role("searchbox", name="Search Google Maps").fill(SEARCH_QUERY)
        page.get_by_role("searchbox", name="Search Google Maps").press("Enter")
        
        print("Waiting for results...")
        # Wait for the results panel to appear (role="feed" is often the list container)
        try:
            page.wait_for_selector('div[role="feed"]', timeout=10000)
        except:
            print("Could not find results feed. Check selector.")
            browser.close()
            return

        # Scroll to load more results
        feed = page.locator('div[role="feed"]')
        
        print(f"Scrolling to load {MAX_RESULTS} results...")
        items_found = 0
        last_count = 0
        retries = 0
        
        while items_found < MAX_RESULTS:
            # Scroll down
            feed.evaluate("element => element.scrollTop = element.scrollHeight")
            time.sleep(2) # Wait for lazy load
            
            # Count items (a.hfpxzc is the invisible link covering the card in recent Maps versions)
            # Or div.Nv2PK is the card container
            cards = page.locator('div.Nv2PK')
            count = cards.count()
            
            if count == last_count:
                retries += 1
                if retries > 3:
                    print("No more results loading.")
                    break
            else:
                retries = 0
            
            last_count = count
            items_found = count
            print(f"Loaded {items_found} results...")
            
            if items_found >= MAX_RESULTS:
                break

        # Extract Data
        print("Extracting data...")
        results = []
        cards = page.locator('div.Nv2PK').all()
        
        # Limit to MAX_RESULTS
        cards = cards[:MAX_RESULTS]
        
        for i, card in enumerate(cards):
            print(f"Processing {i+1}/{len(cards)}...")
            try:
                # We need to click each card to get details
                card.click()
                time.sleep(1.5) # Wait for details to slide in
                
                # Extract details from the main page context (since details panel updates)
                data = {
                    "Business Name": "",
                    "Address": "",
                    "Phone Number": "",
                    "Website": "NO WEBSITE",
                    "Rating": None,
                    "Reviews": 0,
                    "Google Maps URL": page.url
                }
                
                # Name
                try:
                    data["Business Name"] = page.locator('h1.DUwDvf').first.inner_text()
                except:
                    # Fallback to aria-label of the card if H1 fails
                    data["Business Name"] = card.get_attribute("aria-label") or "Unknown"

                # Address
                try:
                    data["Address"] = page.locator('button[data-item-id="address"]').get_attribute("aria-label").replace("Address: ", "").strip()
                except:
                    pass
                
                # Phone
                try:
                    data["Phone Number"] = page.locator('button[data-item-id^="phone"]').get_attribute("aria-label").replace("Phone: ", "").strip()
                except:
                    pass
                
                # Website
                try:
                    website_loc = page.locator('a[data-item-id="authority"]')
                    if website_loc.count() > 0:
                        data["Website"] = website_loc.first.get_attribute("href")
                except:
                    pass
                    
                # Rating/Reviews
                try:
                    # Look for the star icon and text next to it in the details panel
                    rating_text = page.locator('div.F7nice').first.inner_text()
                    # Format: "4.8(150)" or "4.8\n(150)"
                    match = re.search(r"(\d\.\d)", rating_text)
                    if match:
                        data["Rating"] = float(match.group(1))
                    
                    match_rev = re.search(r"\((\d+)\)", rating_text.replace("\n", ""))
                    if match_rev:
                        data["Reviews"] = int(match_rev.group(1))
                except:
                    pass

                results.append(data)
                
            except Exception as e:
                print(f"Error processing card {i}: {e}")
                
        browser.close()
        
        # Save to Excel
        if results:
            df = pd.DataFrame(results)
            
            # Sort: No Website first
            df['HasWebsite'] = df['Website'].apply(lambda x: 0 if x == "NO WEBSITE" or not x else 1)
            df = df.sort_values(by='HasWebsite', ascending=True).drop(columns=['HasWebsite'])
            
            df.to_excel(OUTPUT_FILE, index=False)
            print(f"Successfully saved {len(df)} leads to {OUTPUT_FILE}")
        else:
            print("No results found.")

if __name__ == "__main__":
    main()
