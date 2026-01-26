const FB_PAGE_ACCESS_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN;
const FB_PAGE_ID = process.env.FB_PAGE_ID || 'me'; // 'me' suele funcionar si el token es de página

export async function postToFacebook(message: string, imageBuffer: Buffer) {
  if (!FB_PAGE_ACCESS_TOKEN) throw new Error('Falta FB_PAGE_ACCESS_TOKEN');

  try {
    // Para subir una imagen, usamos form-data endpoint:
    // POST https://graph.facebook.com/v19.0/{page-id}/photos
    
    const formData = new FormData();
    formData.append('message', message);
    formData.append('access_token', FB_PAGE_ACCESS_TOKEN);
    
    // El buffer debe ser convertido a Blob/File para fetch FormData en Node
    // Node.js Buffer es compatible con Uint8Array, que Blob acepta.
    const blob = new Blob([new Uint8Array(imageBuffer)], { type: 'image/png' });
    formData.append('source', blob, 'image.png');
    formData.append('published', 'true');

    const url = `https://graph.facebook.com/v19.0/${FB_PAGE_ID}/photos`;

    const response = await fetch(url, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Facebook API Error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return data; // { id: '...', post_id: '...' }

  } catch (error) {
    console.error('Error publicando en Facebook:', error);
    throw error;
  }
}
