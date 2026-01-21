const fs = require('fs');
const path = require('path');

async function listModels() {
  try {
    // Try to read .env or .env.local to find GEMINI_API_KEY
    let apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      const envPath = path.resolve(process.cwd(), '.env');
      if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        const match = envContent.match(/GEMINI_API_KEY=(.*)/);
        if (match) apiKey = match[1].trim();
      }
    }
    
    if (!apiKey) {
      const envLocalPath = path.resolve(process.cwd(), '.env.local');
       if (fs.existsSync(envLocalPath)) {
        const envContent = fs.readFileSync(envLocalPath, 'utf8');
        const match = envContent.match(/GEMINI_API_KEY=(.*)/);
        if (match) apiKey = match[1].trim();
      }
    }

    if (!apiKey) {
      console.error('Could not find GEMINI_API_KEY in environment or .env files');
      return;
    }

    console.log('Using API Key ending in:', apiKey.slice(-4));

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    
    if (data.models) {
      console.log('Available Models:');
      data.models.forEach(m => {
        if (m.name.includes('flash') || m.name.includes('pro')) {
            console.log(`- ${m.name} (${m.supportedGenerationMethods.join(', ')})`);
        }
      });
    } else {
      console.log('Error listing models:', data);
    }
  } catch (error) {
    console.error('Script error:', error);
  }
}

listModels();
