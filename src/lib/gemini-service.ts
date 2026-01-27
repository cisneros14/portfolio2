import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Asegurar que la clave API esté presente
if (!GEMINI_API_KEY) {
  console.warn('GEMINI_API_KEY no está definida en las variables de entorno.');
}

/**
 * Genera el texto del post usando Gemini 1.5 Pro o 2.0 Flash
 */
export async function generatePostText(topic: string): Promise<string> {
  if (!GEMINI_API_KEY) throw new Error('Falta GEMINI_API_KEY');

  const prompt = `You are an expert Direct Response Copywriter and Neuromarketing Strategist specializing in viral social media content.

Your task is to write a highly engaging Facebook/Instagram post based on the following TOPIC.

TOPIC: "${topic}"

### GUIDELINES:

1.  **THE HOOK (Stop the Scroll):**
    * Do NOT start with "Did you know?" or "Hello friends."
    * Start with a controversial statement, a surprising question, or a short story that creates an "open loop" in the reader's brain.
    * The first sentence must make it impossible to stop reading.

2.  **ZERO JARGON (The "Grandma Test"):**
    * Strictly NO technical terms.
    * Explain the concept as if you were talking to a friend at a bar or explaining it to a 10-year-old.
    * If the topic is complex, use a simple real-life analogy.

3.  **NEUROMARKETING & DESIRE:**
    * Focus entirely on the *transformation* and the *feeling*.
    * Don't sell the "process" (the math/code/logic); sell the "result" (freedom, peace of mind, profit, status).
    * Agitate the problem slightly before offering the solution.

4.  **FORMATTING:**
    * Write in short, punchy sentences.
    * Use line breaks frequently to create white space (easy to scan).
    * Use 2-3 emojis maximum, only to emphasize emotion.

5.  **CALL TO ACTION (Lead Magnet):**
    * Do not ask them to "buy".
    * Ask them to comment a specific keyword or send a DM to get more info/help. Make it feel like an exclusive invitation, not a sales pitch.

### OUTPUT RULES:
* **Language:** Spanish (Latin American, natural and conversational).
* **Tone:** Empathetic, intriguing, and confident.
* **Output:** Return ONLY the post text. No preamble.`;

  // Usamos gemini-2.0-flash por ser rápido y eficiente
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    if (!response.ok) {
        // Fallback to gemini-1.5-flash if 2.0 is not available/stable
        const fallbackUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
        console.warn('Error con gemini-2.0-flash, intentando fallback...', response.status);
        const fbResponse = await fetch(fallbackUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        if (!fbResponse.ok) throw new Error(`Gemini API Error: ${fbResponse.statusText}`);
        const fbData = await fbResponse.json();
        return fbData.candidates[0].content.parts[0].text;
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error generando texto con Gemini:', error);
    throw error;
  }
}

/**
 * Genera una imagen usando Imagen 3 (via Gemini API) y le superpone el logo.
 * Retorna la imagen en base64 lista para subir o guardar.
 */
export async function generatePostImage(topic: string): Promise<Buffer> {
  if (!GEMINI_API_KEY) throw new Error('Falta GEMINI_API_KEY');

  // Prompt para imagen: minimalista, profesional, relacionada al tema
  // Prompt mejorado para evitar texto: Enfasis en simbología abstracta y prohibición estricta de elementos tipográficos
  const imagePrompt = `Create a simple, abstract, flat vector icon representing '${topic}'. 
      Style: Minimalist, Corporate Memphis, Tech Vector. 
      Composition: Single central symbolic element. Geometric shapes.
      Colors: White background, Electric Purple (#8750fc) foreground. 
      STRICTLY FORBIDDEN: Text, letters, numbers, words, charts, graphs, UI elements, signage. 
      This must be a pure art illustration, not an infographic.`;

  // Opción B: Endpoint Imagen 4 Standard (Más estable para ilustraciones planas que el Ultra)
  const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${GEMINI_API_KEY}`;

  let imageBuffer: Buffer;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        instances: [{ prompt: imagePrompt }],
        parameters: {
            sampleCount: 1,
            aspectRatio: "1:1",
            includeSafetyAttributes: true
        }
      })
    });

    if (!response.ok) {
        throw new Error(`Imagen 3 API Error: ${response.status} ${response.statusText} - ${await response.text()}`);
    }

    const data = await response.json();
    // La respuesta de Imagen suele ser { predictions: [ { bytesBase64Encoded: "..." } ] }
    const base64Image = data.predictions?.[0]?.bytesBase64Encoded;
    
    if (!base64Image) {
        throw new Error('No se recibió imagen en la respuesta de Gemini/Imagen');
    }

    imageBuffer = Buffer.from(base64Image, 'base64');

  } catch (error) {
    console.error('Error generando imagen directa, probando endpoint alternativo (Gemini GenerateContent)...', error);
    // Intento de fallback a generateContent si predict falla (depende de la cuenta/región)
    imageBuffer = await fallbackImageGeneration(imagePrompt, error);
  }

  // Superponer Logo
  try {
    const logoRelPath = 'public/logoBlanco.png'; // Usamos logoBlanco.png como solicitó el usuario
    const logoPath = path.resolve(process.cwd(), logoRelPath);
    
    if (fs.existsSync(logoPath)) {
        console.log('Superponiendo logo...');
        
        // Obtenemos dimensiones de la imagen generada
        const metadata = await sharp(imageBuffer).metadata();
        const width = metadata.width || 1024;
        const height = metadata.height || 1024;

        // Redimensionar logo al 15% del ancho de la imagen
        const logoWidth = Math.round(width * 0.15);
        
        const logoBuffer = await sharp(logoPath)
            .resize({ width: logoWidth })
            .toBuffer();

        // Componer: Esquina inferior derecha con margen
        const margin = Math.round(width * 0.05);
        const logoMetadata = await sharp(logoBuffer).metadata();
        const finalLogoHeight = logoMetadata.height || logoWidth;

        const compositeImage = await sharp(imageBuffer)
            .composite([{
                input: logoBuffer,
                top: height - finalLogoHeight - margin,
                left: width - logoWidth - margin
            }])
            .toBuffer();
            
        return compositeImage;
    } else {
        console.warn('Logo no encontrado en', logoPath, 'se devuelve imagen sin logo.');
        return imageBuffer;
    }

  } catch (error) {
    console.error('Error procesando imagen con sharp:', error);
    return imageBuffer; // Devuelve imagen sin logo si falla sharp
  }
}

async function fallbackImageGeneration(prompt: string, originalError?: any): Promise<Buffer> {
   // Fallback simple: Si falla Imagen, retornamos un error o una imagen placeholder
   // Realmente no hay un fallback fácil de "texto a imagen" en Gemini si no es el modelo específico.
   // Podríamos intentar el modelo experimental 'gemini-2.0-flash-exp-image-generation'
   // usando generateContent.
   
   /* 
    Nota: El formato para gemini-2.0-flash-exp-image-generation podría ser diferente 
    o simplemente devolver un link. Asumimos fallo si el principal falla.
   */
   const technicalDetails = originalError ? ` (Error técnico: ${originalError.message || JSON.stringify(originalError)})` : '';
   throw new Error(`No se pudo generar la imagen con el método principal.${technicalDetails}`);
}
