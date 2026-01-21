import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { generateBlogContent } from '@/actions/blog-ai';
import { saveBlogPost } from '@/actions/blog';

// Set max duration for the function to avoid timeouts (Vercel specific)
export const maxDuration = 300; // 5 minutes
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // Optional: add auth check here if needed (e.g., check for CRON_SECRET)
    
    // 1. Find 1 category with the least amount of posts
    const query = `
      SELECT c.cat_id, c.cat_nombre, COUNT(b.blog_id) as post_count
      FROM tbl_categoria_blog c
      LEFT JOIN tbl_blog b ON c.cat_id = b.blog_cat_id
      GROUP BY c.cat_id, c.cat_nombre
      ORDER BY post_count ASC
      LIMIT 1
    `;
    
    const [categories]: any = await pool.query(query);
    
    if (!categories || categories.length === 0) {
      return NextResponse.json({ message: 'No categories found' }, { status: 404 });
    }

    const cat = categories[0];
    const results = [];

    // 2. Generate content for this category
    try {
      const catId = cat.cat_id.toString();
      console.log(`Generating content for category: ${cat.cat_nombre} (${catId})`);
      
      const content = await generateBlogContent(catId);
      
      if (content) {
        // 3. Save the blog post
        const saveResult = await saveBlogPost({
          title: content.title,
          slug: content.slug,
          categoryId: catId,
          extract: content.extract,
          content: content.content,
          keywords: content.keywords,
          description: content.description,
          status: 'published', // Automatically publish
          imageUrl: '', // Optional: could integrate image generation here later
        });
        
        results.push({
          category: cat.cat_nombre,
          success: saveResult.success,
          message: saveResult.message || saveResult.error
        });
      } else {
        results.push({
          category: cat.cat_nombre,
          success: false,
          message: 'AI Generation failed reduced content to null'
        });
      }
    } catch (err: any) {
      console.error(`Error processing category ${cat.cat_nombre}:`, err);
      results.push({
          category: cat.cat_nombre,
          success: false,
          message: err.message
        });
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      results
    });

  } catch (error: any) {
    console.error('Cron job failed:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
