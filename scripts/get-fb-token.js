const path = require('path');
const fs = require('fs');

// Cargar .env.local manualmente
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, '');
        if (!process.env[key]) process.env[key] = value;
      }
    });
  }
}

async function checkFacebookToken() {
  loadEnv();
  
  const token = process.env.FB_PAGE_ACCESS_TOKEN;
  if (!token) {
    console.error('Error: No FB_PAGE_ACCESS_TOKEN found in .env.local');
    return;
  }

  console.log('Testing Token:', token.substring(0, 10) + '...');

  try {
    // 1. Check "Me"
    console.log('\n--- Checking /me ---');
    const meRes = await fetch(`https://graph.facebook.com/v19.0/me?access_token=${token}`);
    const meData = await meRes.json();
    console.log('Identity:', meData);

    if (meData.error) {
        console.error('Token Error:', meData.error.message);
        return;
    }

    // 2. Check "Accounts" (Pages)
    console.log('\n--- Checking /me/accounts (Pages) ---');
    const pagesRes = await fetch(`https://graph.facebook.com/v19.0/me/accounts?access_token=${token}`);
    const pagesData = await pagesRes.json();
    
    if (pagesData.data && pagesData.data.length > 0) {
        console.log('Pages found:');
        pagesData.data.forEach(page => {
            console.log(`- Name: ${page.name}`);
            console.log(`  ID: ${page.id}`);
            console.log(`  Page Token: ${page.access_token.substring(0, 15)}...`); 
            console.log('  (Use this Page Token for posting directly to this page)\n');
        });
    } else {
        console.log('No pages found using this token. If this is a User Token, reliable permissions might be missing (pages_show_list, pages_manage_posts).');
        console.log('If "Identity" above matches the Page Name directly, then this IS a Page Token already.');
    }

    // 3. Check App Info (Debug Token)
    // Needs App Access Token usually, or just user token
    const appId = process.env.FB_APP_ID;
    const appSecret = process.env.FB_APP_SECRET;
    if(appId && appSecret) {
        console.log('\n--- Debugging Token ---');
        const debugRes = await fetch(`https://graph.facebook.com/v19.0/debug_token?input_token=${token}&access_token=${appId}|${appSecret}`);
        const debugData = await debugRes.json();
        console.log('Token Debug Info:', JSON.stringify(debugData.data, null, 2));
    }

  } catch (error) {
    console.error('Script error:', error);
  }
}

checkFacebookToken();
