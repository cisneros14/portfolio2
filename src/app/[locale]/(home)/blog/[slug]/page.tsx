"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowLeft, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import Nav from "@/components/nav";

interface BlogPost {
  blog_id: number;
  blog_titulo: string;
  blog_slug: string;
  blog_extracto: string;
  blog_contenido: string;
  blog_imagen_portada: string;
  blog_estado: string;
  blog_creado_en: string;
  cat_id: number;
  cat_nombre: string;
  usu_nombre: string;
}

interface Category {
  cat_id: number;
  cat_nombre: string;
  cat_slug: string;
}

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [postRes, catsRes] = await Promise.all([
          fetch(`/api/blog/slug/${params.slug}`),
          fetch("/api/blog/categories")
        ]);

        if (!postRes.ok) {
          setError(true);
        } else {
          const postData = await postRes.json();
          setPost(postData);
        }
        
        const catsData = await catsRes.json();
        setCategories(catsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchData();
    }
  }, [params.slug]);

  if (loading) {
    return (
      <div className="container mx-auto py-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold">Artículo no encontrado</h1>
        <p className="text-muted-foreground">El artículo que buscas no existe o ha sido eliminado.</p>
        <Link href="/lista-blogs">
          <Button>Volver al Blog</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* Main Content */}
        <article className="flex-1 space-y-8">
          <Link href="/lista-blogs">
            <Button variant="ghost" className="pl-0 hover:pl-2 transition-all group mb-4">
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Volver al Blog
            </Button>
          </Link>

          <div className="space-y-4">
            {post.cat_nombre && (
              <Badge variant="secondary" className="text-sm">
                {post.cat_nombre}
              </Badge>
            )}
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              {post.blog_titulo}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground border-b pb-8">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date(post.blog_creado_en).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              {post.usu_nombre && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {post.usu_nombre}
                </div>
              )}
              {/* Optional: Read time calculation could go here */}
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Lectura de 5 min
              </div>
            </div>
          </div>

          {post.blog_imagen_portada && (
            <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-lg">
              <img 
                src={post.blog_imagen_portada} 
                alt={post.blog_titulo}
                className="object-cover w-full h-full"
              />
            </div>
          )}

          <div 
            className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary hover:prose-a:underline prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: post.blog_contenido }}
          />

          <div className="border-t pt-8 mt-12">
            <h3 className="font-bold text-xl mb-4">Compartir este artículo</h3>
            <div className="flex gap-2">
              {/* Social share buttons placeholders */}
              <Button variant="outline" size="sm">Facebook</Button>
              <Button variant="outline" size="sm">Twitter</Button>
              <Button variant="outline" size="sm">LinkedIn</Button>
            </div>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="w-full lg:w-80 space-y-8 sticky top-24 h-fit">
          <Card>
            <CardHeader>
              <CardTitle>Categorías</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex flex-col">
                <Link
                  href="/lista-blogs"
                  className="text-left px-6 py-3 text-sm font-medium transition-colors hover:bg-muted/50 border-l-2 border-transparent text-muted-foreground hover:text-foreground"
                >
                  Todas las categorías
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.cat_id}
                    href={`/lista-blogs?category=${cat.cat_id}`} // Note: This query param handling needs to be implemented in listing page if we want direct links
                    className="text-left px-6 py-3 text-sm font-medium transition-colors hover:bg-muted/50 border-l-2 border-transparent text-muted-foreground hover:text-foreground"
                  >
                    {cat.cat_nombre}
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary text-primary-foreground border-none">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-2">¿Te interesa este tema?</h3>
              <p className="text-sm opacity-90 mb-4">
                Suscríbete a nuestro newsletter para recibir más contenido como este.
              </p>
              <div className="space-y-2">
                <input 
                  type="email" 
                  placeholder="Tu correo electrónico" 
                  className="w-full px-3 py-2 rounded-md bg-background text-foreground text-sm"
                />
                <Button variant="secondary" className="w-full">Suscribirse</Button>
              </div>
            </CardContent>
          </Card>
        </aside>

      </div>
    </>
  );
}
