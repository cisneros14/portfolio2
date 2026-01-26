import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { generateBlogContent, generateImageWithGemini } from '@/actions/blog-ai';
import { saveBlogPost } from '@/actions/blog';

// Set max duration for the function to avoid timeouts (Vercel specific)
export const maxDuration = 300; // 5 minutes
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
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
        // Generate Image using Gemini (Google Imagen)
        let permanentImageUrl = '';
        let imageStatus = 'skipped';
        
        if (content.title) {
           try {
             // Generate Image using the standardized Imagen 4.0 service
             const buffer = await generateImageWithGemini(content.title);
             
             if (buffer) {
                // Upload to Cloudinary
                const cloudinary = (await import('@/lib/cloudinary')).default;
                
                const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
                    cloudinary.uploader.upload_stream(
                    {
                        folder: 'blog-images-ai',
                    },
                    (error, result) => {
                        if (error) {
                            reject(error);
                            return;
                        }
                        if (result) {
                            resolve({ secure_url: result.secure_url });
                        } else {
                            reject(new Error("Upload failed: No result returned"));
                        }
                    }
                    ).end(buffer);
                });
                
                permanentImageUrl = uploadResult.secure_url;
                imageStatus = 'uploaded: ' + permanentImageUrl;
                console.log('Image uploaded to Cloudinary:', permanentImageUrl);
             } else {
                imageStatus = 'gemini_error: image generation returned null';
             }

           } catch (uploadError: any) {
             imageStatus = 'upload_error: ' + uploadError.message;
             console.error('Failed to generate/upload AI image:', uploadError);
           }
        }

        // 3. Save the blog post
        const saveResult = await saveBlogPost({
          title: content.title,
          slug: content.slug,
          categoryId: catId,
          extract: content.extract,
          content: content.content,
          keywords: content.keywords,
          description: content.description,
          status: 'published',
          imageUrl: permanentImageUrl, 
        });
        
        results.push({
          category: cat.cat_nombre,
          imageStatus: imageStatus,
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
