"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  LayoutGrid,
  List,
  Calendar,
  User,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Nav from "@/components/nav";

interface BlogPost {
  blog_id: number;
  blog_titulo: string;
  blog_slug: string;
  blog_extracto: string;
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

export default function BlogListingPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [postsRes, catsRes] = await Promise.all([
          fetch("/api/blog/posts"),
          fetch("/api/blog/categories"),
        ]);

        const postsData = await postsRes.json();
        const catsData = await catsRes.json();

        // Filter only published posts
        const publishedPosts = postsData.filter(
          (p: any) => p.blog_estado === "publicado"
        );

        setPosts(publishedPosts);
        setCategories(catsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.blog_titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.blog_extracto?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory
      ? post.cat_id === selectedCategory
      : true;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col lg:flex-row gap-12">
      {/* Main Content */}
      <div className="flex-1 space-y-8">
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 border-b pb-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              Nuestro Blog
            </h1>
            <p className="text-muted-foreground text-lg">
              Noticias, consejos y artículos de interés.
            </p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar artículos..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20 bg-muted/30 rounded-lg">
            <p className="text-muted-foreground text-lg">
              No se encontraron artículos.
            </p>
            {selectedCategory && (
              <Button
                variant="link"
                onClick={() => setSelectedCategory(null)}
                className="mt-2"
              >
                Ver todos los artículos
              </Button>
            )}
          </div>
        ) : (
          <div
            className={cn(
              "grid gap-6",
              viewMode === "grid" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
            )}
          >
            {filteredPosts.map((post) => (
              <Card
                key={post.blog_id}
                className={cn(
                  "overflow-hidden py-0 hover:shadow-lg transition-shadow flex flex-col",
                  viewMode === "list" && "md:flex-row"
                )}
              >
                {/* Image */}
                <div
                  className={cn(
                    "relative overflow-hidden bg-muted",
                    viewMode === "grid"
                      ? "aspect-video w-full"
                      : "aspect-video md:aspect-square md:w-64 md:h-full"
                  )}
                >
                  {post.blog_imagen_portada ? (
                    <Image
                      src={post.blog_imagen_portada}
                      alt={post.blog_titulo}
                      fill
                      className="object-cover transition-transform hover:scale-105 duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-muted-foreground">
                      <LayoutGrid className="h-12 w-12 opacity-20" />
                    </div>
                  )}
                  {post.cat_nombre && (
                    <Badge className="absolute top-4 right-4 z-10">
                      {post.cat_nombre}
                    </Badge>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-6">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(post.blog_creado_en).toLocaleDateString()}
                    </div>
                    {post.usu_nombre && (
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {post.usu_nombre}
                      </div>
                    )}
                  </div>

                  <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    <Link
                      href={`/blog/${post.blog_slug}`}
                      className="hover:underline"
                    >
                      {post.blog_titulo}
                    </Link>
                  </h3>

                  <p className="text-muted-foreground line-clamp-3 mb-4 flex-1">
                    {post.blog_extracto || "Sin descripción disponible."}
                  </p>

                  <div className="mt-auto pt-4 border-t flex justify-between items-center">
                    <Link href={`/blog/${post.blog_slug}`}>
                      <Button
                        variant="link"
                        className="p-0 h-auto font-semibold group"
                      >
                        Leer más{" "}
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Sidebar */}
      <aside className="w-full lg:w-80 space-y-8 sticky top-24 self-start">
        <Card>
          <CardHeader>
            <CardTitle>Categorías</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex flex-col">
              <button
                onClick={() => setSelectedCategory(null)}
                className={cn(
                  "text-left px-6 py-3 text-sm font-medium transition-colors hover:bg-muted/50 border-l-2",
                  selectedCategory === null
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-transparent text-muted-foreground"
                )}
              >
                Todas las categorías
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.cat_id}
                  onClick={() => setSelectedCategory(cat.cat_id)}
                  className={cn(
                    "text-left px-6 py-3 text-sm font-medium transition-colors hover:bg-muted/50 border-l-2",
                    selectedCategory === cat.cat_id
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-transparent text-muted-foreground"
                  )}
                >
                  {cat.cat_nombre}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Optional: Recent Posts or other widgets could go here */}
        <Card className="bg-primary/5 border-none">
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-2">¿Necesitas ayuda?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Contáctanos para recibir asesoría personalizada sobre nuestros
              servicios.
            </p>
            <Link href="/#contact">
              <Button className="w-full">Contáctanos</Button>
            </Link>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
