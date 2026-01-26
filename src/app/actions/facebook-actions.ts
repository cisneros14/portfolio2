'use server';

import { pool } from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { revalidatePath } from 'next/cache';

export async function getIdeas() {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM tbl_ideas_post ORDER BY created_at DESC'
    );
    // Serializar fechas para pasar al cliente
    return rows.map(row => ({
      ...row,
      created_at: row.created_at.toISOString(),
      post_fecha_publicacion: row.post_fecha_publicacion ? row.post_fecha_publicacion.toISOString() : null,
      post_publicado: Boolean(row.post_publicado) // Asegurar booleano
    }));
  } catch (error) {
    console.error('Error fetching ideas:', error);
    return [];
  }
}

export async function addIdea(formData: FormData) {
  const idea = formData.get('idea') as string;
  
  if (!idea || idea.trim() === '') {
    return { success: false, message: 'La idea no puede estar vacía' };
  }

  try {
    await pool.execute<ResultSetHeader>(
      'INSERT INTO tbl_ideas_post (post_idea) VALUES (?)',
      [idea]
    );
    revalidatePath('/[locale]/admin/ideas', 'page');
    revalidatePath('/es/admin/ideas', 'page'); // Fallback para locales comunes
    revalidatePath('/en/admin/ideas', 'page');
    return { success: true, message: 'Idea agregada correctamente' };
  } catch (error) {
    console.error('Error adding idea:', error);
    return { success: false, message: 'Error al guardar la idea' };
  }
}

export async function deleteIdea(id: number) {
  try {
    await pool.execute('DELETE FROM tbl_ideas_post WHERE post_id = ?', [id]);
    revalidatePath('/[locale]/admin/ideas', 'page');
    return { success: true };
  } catch (error) {
    console.error('Delete error:', error);
    return { success: false };
  }
}
