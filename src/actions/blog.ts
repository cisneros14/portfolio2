'use server';

import { pool } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function saveBlogPost(data: any) {
  try {
    const {
      id,
      title,
      slug,
      categoryId,
      extract,
      content,
      keywords,
      description,
      status,
      imageUrl,
    } = data;

    // Basic validation
    if (!title || !slug || !content) {
      return { success: false, error: 'Título, slug y contenido son obligatorios' };
    }

    const blog_autor_id = 1; // Default user for now

    // Map status to DB enum if needed (assuming 'borrador'/'publicado' or similar)
    // The form sends 'draft' | 'published'. The DB seems to use 'borrador' | 'publicado' based on the API route default 'borrador'
    // Let's normalize it.
    const dbStatus = status === 'published' ? 'publicado' : 'borrador';

    if (id) {
      // UPDATE
      await pool.query(
        `UPDATE tbl_blog SET
          blog_titulo = ?,
          blog_slug = ?,
          blog_cat_id = ?,
          blog_extracto = ?,
          blog_contenido = ?,
          blog_imagen_portada = ?,
          blog_estado = ?,
          blog_seo_keywords = ?,
          blog_seo_description = ?,
          blog_actualizado_en = NOW()
        WHERE blog_id = ?`,
        [
          title,
          slug,
          categoryId || null,
          extract,
          content,
          imageUrl,
          dbStatus,
          keywords,
          description,
          id,
        ]
      );
      
      revalidatePath('/admin/blog');
      revalidatePath('/lista-blogs');
      return { success: true, message: 'Artículo actualizado correctamente' };
    } else {
      // INSERT
      const [result]: any = await pool.query(
        `INSERT INTO tbl_blog (
          blog_titulo, blog_slug, blog_cat_id, blog_autor_id, 
          blog_extracto, blog_contenido, blog_imagen_portada, 
          blog_estado, blog_seo_keywords, blog_seo_description
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          title,
          slug,
          categoryId || null,
          blog_autor_id,
          extract,
          content,
          imageUrl,
          dbStatus,
          keywords,
          description,
        ]
      );

      revalidatePath('/admin/blog');
      revalidatePath('/lista-blogs');
      return { success: true, message: 'Artículo creado correctamente', id: result.insertId };
    }
  } catch (error: any) {
    console.error('Error saving blog post:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return { success: false, error: 'El slug ya existe, por favor elige otro.' };
    }
    return { success: false, error: 'Error al guardar el artículo: ' + error.message };
  }
}
