'use server';

import { pool } from '@/lib/db';

interface Category {
  cat_id: number;
  cat_nombre: string;
}

interface GeneratedContent {
  title: string;
  slug: string;
  extract: string;
  content: string;
  keywords: string;
  description: string;
}

export async function getBlogCategories(): Promise<Category[]> {
  try {
    const [rows] = await pool.query('SELECT cat_id, cat_nombre FROM tbl_categoria_blog ORDER BY cat_nombre ASC');
    return rows as Category[];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function generateBlogContent(categoryId: string): Promise<GeneratedContent | null> {
  try {
    // 1. Get Category Name
    const [catRows] = await pool.query<any[]>('SELECT cat_nombre FROM tbl_categoria_blog WHERE cat_id = ?', [categoryId]);
    if (!catRows.length) throw new Error('Category not found');
    const categoryName = catRows[0].cat_nombre;

    // 2. Get Recent Titles to avoid duplicates
    const [blogRows] = await pool.query<any[]>('SELECT blog_titulo FROM tbl_blog ORDER BY blog_creado_en DESC LIMIT 20');
    const recentTitles = blogRows.map((row: any) => row.blog_titulo).join(', ');

    // 3. Construct Prompt
    const prompt = `
      Act as an expert SEO copywriter and blog content generator.
      
      Task: Generate a complete, high-quality blog post for the category: "${categoryName}".
      
      Context:
      - Current Date: ${new Date().toLocaleDateString()}
      - Target Audience: General audience interested in ${categoryName}.
      - Goal: Create engaging, trending content that drives traffic.
      
      Constraints:
      - Topic must be a currently trending or popular topic within "${categoryName}".
      - DO NOT use any of these recent titles: ${recentTitles}.
      - The content must be in Spanish.
      - Use double line breaks (<br><br>) ONLY between paragraphs (<p>). Do NOT add them after headings (<h1>, <h2>, <h3>).
      - Return ONLY valid JSON.
      
      Required Output Format (JSON):
      {
        "title": "Catchy, SEO-optimized title",
        "slug": "url-friendly-slug",
        "extract": "Short summary (max 150 chars) for blog card",
        "content": "Full HTML content. Use <h2>, <h3>, <p>, <ul>, <li> tags. Make it long and detailed (approx 800+ words).",
        "keywords": "comma, separated, seo, keywords (max 10)",
        "description": "Meta description for Google (max 160 chars)"
      }
    `;

    // 4. Call Gemini API
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY is not set');

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API Error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textResponse) throw new Error('No response from Gemini');

    // Clean up JSON string (remove markdown code blocks if present)
    const jsonString = textResponse.replace(/```json\n?|\n?```/g, '').trim();
    
    const parsedContent: GeneratedContent = JSON.parse(jsonString);
    return parsedContent;

  } catch (error) {
    console.error('Error generating blog content:', error);
    return null;
  }
}
