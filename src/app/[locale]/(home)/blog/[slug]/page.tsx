import { notFound } from "next/navigation";
import { pool } from "@/lib/db";
import { Metadata } from "next";
import Image from "next/image";
import { Calendar, User, ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BlogCTA } from "@/components/blog-cta";
import { SimilarBlogs } from "@/components/similar-blogs";

// Force dynamic rendering since we're fetching from DB
export const dynamic = "force-dynamic";

interface BlogPost {
  blog_id: number;
  blog_titulo: string;
  blog_slug: string;
  blog_contenido: string;
  blog_extracto: string;
  blog_imagen_portada: string;
  blog_estado: string;
  blog_creado_en: string;
  blog_keywords: string;
  blog_meta_descripcion: string;
  cat_id: number;
  cat_nombre: string;
  usu_nombre: string;
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [rows]: any = await pool.query(
      `
      SELECT b.*, c.cat_nombre, u.usu_nombre 
      FROM tbl_blog b
      LEFT JOIN tbl_categoria_blog c ON b.blog_cat_id = c.cat_id
      LEFT JOIN tbl_usuarios u ON b.blog_autor_id = u.usu_id
      WHERE b.blog_slug = ? AND b.blog_estado = 'publicado'
    `,
      [slug]
    );

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  } catch (error) {
    console.error("Error fetching post by slug:", error);
    return null;
  }
}

async function getAdjacentPosts(currentDate: string) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [prevRows]: any = await pool.query(
      `SELECT blog_slug, blog_titulo FROM tbl_blog WHERE blog_estado = 'publicado' AND blog_creado_en < ? ORDER BY blog_creado_en DESC LIMIT 1`,
      [currentDate]
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [nextRows]: any = await pool.query(
      `SELECT blog_slug, blog_titulo FROM tbl_blog WHERE blog_estado = 'publicado' AND blog_creado_en > ? ORDER BY blog_creado_en ASC LIMIT 1`,
      [currentDate]
    );

    return {
      prev: prevRows[0] || null,
      next: nextRows[0] || null,
    };
  } catch (error) {
    console.error("Error fetching adjacent posts:", error);
    return { prev: null, next: null };
  }
}

async function getSimilarPosts(categoryId: number, currentId: number) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [rows]: any = await pool.query(
      `
      SELECT b.*, c.cat_nombre 
      FROM tbl_blog b
      LEFT JOIN tbl_categoria_blog c ON b.blog_cat_id = c.cat_id
      WHERE b.blog_cat_id = ? AND b.blog_id != ? AND b.blog_estado = 'publicado'
      ORDER BY b.blog_creado_en DESC
      LIMIT 3
    `,
      [categoryId, currentId]
    );
    return rows;
  } catch (error) {
    console.error("Error fetching similar posts:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: "Artículo no encontrado",
    };
  }

  return {
    title: post.blog_titulo,
    description: post.blog_meta_descripcion || post.blog_extracto,
    keywords: post.blog_keywords ? post.blog_keywords.split(",") : [],
    openGraph: {
      title: post.blog_titulo,
      description: post.blog_meta_descripcion || post.blog_extracto,
      images: post.blog_imagen_portada ? [post.blog_imagen_portada] : [],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const adjacentPosts = await getAdjacentPosts(post.blog_creado_en);
  const similarPosts = await getSimilarPosts(post.cat_id, post.blog_id);

  return (
    <div className="container mx-auto px-4 max-w-4xl">
      <Link href="/lista-blogs">
        <Button variant="outline" className="mb-8 pl-0 hover:pl-2 transition-all !bg-background">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al blog
        </Button>
      </Link>

      <article className="space-y-8">
        <div className="space-y-4">
          {post.cat_nombre && (
            <Badge variant="default" className="mb-2">
              {post.cat_nombre}
            </Badge>
          )}

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            {post.blog_titulo}
          </h1>

          <div className="flex items-center gap-6 text-muted-foreground border-b pb-8">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{new Date(post.blog_creado_en).toLocaleDateString()}</span>
            </div>
            {post.usu_nombre && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{post.usu_nombre}</span>
              </div>
            )}
          </div>
        </div>

        {post.blog_imagen_portada && (
          <div className="relative aspect-video w-full overflow-hidden rounded-xl border bg-muted shadow-sm">
            <Image
              src={post.blog_imagen_portada}
              alt={post.blog_titulo}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* APA 7 Styled Content */}
        <div className="apa-content mt-18">
          <style>{`
            .apa-content {
              font-size: 1.125rem; /* 18px approx */
              color: hsl(var(--foreground));
              text-align: justify;
            }
            .apa-content h1, .apa-content h2, .apa-content h3, .apa-content h4, .apa-content h5, .apa-content h6 {
              font-family: var(--font-sans); /* Keep headings modern or switch to serif if strictly APA */
              font-weight: bold;
              margin-top: 1.5em;
              margin-bottom: 0.5em;
              line-height: 1.3;
              text-align: left; /* APA headings are usually left or centered depending on level */
            }
            .apa-content p {
              margin-bottom: 2em;
            }
            .apa-content ul, .apa-content ol {
              margin-bottom: 2em;
              padding-left: 2em;
              list-style-type: disc;
            }
            .apa-content blockquote {
              border-left: 4px solid hsl(var(--primary));
              padding-left: 1em;
              margin-left: 0;
              font-style: italic;
            }
            /* Reset indent for first paragraph after heading if desired, but APA indents all */
            .apa-content p:empty,
            .apa-content h1:empty,
            .apa-content h2:empty,
            .apa-content h3:empty,
            .apa-content h4:empty,
            .apa-content h5:empty,
            .apa-content h6:empty,
            .apa-content ul:empty,
            .apa-content ol:empty,
            .apa-content blockquote:empty {
              margin-bottom: 0;
              margin-top: 0;
            }
          `}</style>
          <div
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: post.blog_contenido }}
          />
        </div>
      </article>

      {/* Navigation Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12 border-t pt-8">
        {adjacentPosts.prev ? (
          <Link href={`/blog/${adjacentPosts.prev.blog_slug}`}>
            <Button
              variant="outline"
              className="w-full justify-start h-auto py-4 px-6 text-left"
            >
              <div className="w-full overflow-hidden">
                <div className="flex items-center text-muted-foreground mb-1">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Anterior
                </div>
                <div className="font-semibold truncate">
                  {adjacentPosts.prev.blog_titulo}
                </div>
              </div>
            </Button>
          </Link>
        ) : (
          <div /> /* Spacer */
        )}

        {adjacentPosts.next ? (
          <Link href={`/blog/${adjacentPosts.next.blog_slug}`}>
            <Button
              variant="outline"
              className="w-full justify-end h-auto py-4 px-6 text-right cursor-pointer"
            >
              <div className="w-full overflow-hidden">
                <div className="flex items-center justify-end text-muted-foreground mb-1">
                  Siguiente
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
                <div className="font-semibold truncate">
                  {adjacentPosts.next.blog_titulo}
                </div>
              </div>
            </Button>
          </Link>
        ) : (
          <div /> /* Spacer */
        )}
      </div>

      <div className="mt-16">
        <BlogCTA />
      </div>

      {/* Similar Blogs */}
      {similarPosts.length > 0 && (
        <div className="mt-20 border-t pt-12">
          <SimilarBlogs posts={similarPosts} />
        </div>
      )}
    </div>
  );
}
