import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      publi_caption,
      publi_imagen_url,
      publi_imagen_prompt,
      publi_estado_aprobacion,
      publi_estado_publicacion,
      publi_plataformas,
      publi_fecha_programada
    } = body;

    // Convert platforms array to JSON string if it's an array
    const platformsJson = Array.isArray(publi_plataformas) 
      ? JSON.stringify(publi_plataformas) 
      : publi_plataformas;

    await pool.query(
      `UPDATE tbl_publicaciones SET 
        publi_caption = ?,
        publi_imagen_url = ?,
        publi_imagen_prompt = ?,
        publi_estado_aprobacion = ?,
        publi_estado_publicacion = ?,
        publi_plataformas = ?,
        publi_fecha_programada = ?
       WHERE publi_id = ?`,
      [
        publi_caption,
        publi_imagen_url,
        publi_imagen_prompt,
        publi_estado_aprobacion,
        publi_estado_publicacion,
        platformsJson,
        publi_fecha_programada,
        id
      ]
    );

    return NextResponse.json({ message: 'Post updated successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Error updating post' }, { status: 500 });
  }
}
