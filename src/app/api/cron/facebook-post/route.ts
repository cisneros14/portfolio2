import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { generatePostText, generatePostImage } from '@/lib/gemini-service';
import { postToFacebook } from '@/lib/facebook-service';
import { RowDataPacket } from 'mysql2/promise';

export const maxDuration = 300; // 5 minutos timeout para generación de imágenes

export async function GET(request: Request) {
  // Verificación de seguridad simple (opcional pero recomendada)
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    // Permitemos también acceso si es localhost para pruebas, o si no hay secreto configurado (riesgoso)
    const url = new URL(request.url);
    if (!url.searchParams.get('dry_run') && process.env.NODE_ENV !== 'development') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  try {
    // 1. Buscar idea no publicada
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT post_id, post_idea FROM tbl_ideas_post WHERE post_publicado = 0 ORDER BY created_at ASC LIMIT 1'
    );

    if (rows.length === 0) {
      return NextResponse.json({ message: 'No hay ideas pendientes de publicar.' });
    }

    const start = Date.now();
    const idea = rows[0];
    const ideaId = idea.post_id;
    const ideaText = idea.post_idea;

    console.log(`Procesando idea ID ${ideaId}: ${ideaText}`);

    // 2. Generar Contenido
    // Ejecutamos en paralelo para ahorrar tiempo, aunque Gemini tiene rate limits.
    const [generatedText, generatedImageBuffer] = await Promise.all([
        generatePostText(ideaText),
        generatePostImage(ideaText)
    ]);

    // 3. Publicar en Facebook
    console.log('Contenido generado. Publicando en Facebook...');
    const fbResponse = await postToFacebook(generatedText, generatedImageBuffer);
    console.log('Publicado en Facebook:', fbResponse);

    // 4. Actualizar Base de Datos
    await pool.execute(
        `UPDATE tbl_ideas_post 
         SET post_publicado = 1, 
             post_fecha_publicacion = NOW(), 
             post_contenido_generado = ?, 
             post_meta_data = ? 
         WHERE post_id = ?`,
        [
            generatedText,
            JSON.stringify(fbResponse),
            ideaId
        ]
    );

    const duration = (Date.now() - start) / 1000;

    return NextResponse.json({
        success: true,
        message: 'Publicación realizada con éxito',
        idea_id: ideaId,
        duration: `${duration}s`,
        fb_response: fbResponse
    });

  } catch (error: unknown) {
    console.error('Error en Cron Job Facebook:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ 
        success: false, 
        error: errorMessage 
    }, { status: 500 });
  }
}
