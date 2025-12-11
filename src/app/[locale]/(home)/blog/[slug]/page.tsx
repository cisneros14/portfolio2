import { notFound } from "next/navigation";
import { pool } from "@/lib/db";
import { Metadata } from "next";
import Image from "next/image";
import { Calendar, User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Link href="/lista-blogs">
        <Button variant="ghost" className="mb-8 pl-0 hover:pl-2 transition-all">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al blog
        </Button>
      </Link>

      <article className="space-y-8">
        <div className="space-y-4">
          {post.cat_nombre && (
            <Badge variant="secondary" className="mb-2">
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
          <div className="relative aspect-video w-full overflow-hidden rounded-xl border bg-muted">
            <Image
              src={post.blog_imagen_portada}
              alt={post.blog_titulo}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div
          className="prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.blog_contenido }}
        />
      </article>
    </div>
  );
}
