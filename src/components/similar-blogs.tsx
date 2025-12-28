"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BlogPost {
  blog_id: number;
  blog_titulo: string;
  blog_slug: string;
  blog_extracto: string;
  blog_imagen_portada: string;
  blog_creado_en: string;
  cat_nombre: string;
}

interface SimilarBlogsProps {
  posts: BlogPost[];
}

export function SimilarBlogs({ posts }: SimilarBlogsProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="space-y-8">
      <h2 className="text-3xl font-bold tracking-tight">Artículos Similares</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Card
            key={post.blog_id}
            className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow h-full"
          >
            <div className="relative aspect-video w-full overflow-hidden bg-muted">
              {post.blog_imagen_portada ? (
                <Image
                  src={post.blog_imagen_portada}
                  alt={post.blog_titulo}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-secondary">
                  <span className="text-muted-foreground">Sin imagen</span>
                </div>
              )}
            </div>

            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="text-xs">
                  {post.cat_nombre}
                </Badge>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="mr-1 h-3 w-3" />
                  {new Date(post.blog_creado_en).toLocaleDateString()}
                </div>
              </div>
              <Link
                href={`/blog/${post.blog_slug}`}
                className="hover:underline"
              >
                <h3 className="font-semibold leading-tight line-clamp-2">
                  {post.blog_titulo}
                </h3>
              </Link>
            </CardHeader>

            <CardContent className="p-4 pt-0 flex-1">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {post.blog_extracto}
              </p>
            </CardContent>

            <CardFooter className="p-4 pt-0">
              <Link href={`/blog/${post.blog_slug}`} className="w-full">
                <Button
                  variant="ghost"
                  className="w-full justify-between group px-0 hover:bg-transparent hover:text-primary"
                >
                  Leer más
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
