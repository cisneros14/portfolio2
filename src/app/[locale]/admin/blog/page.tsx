"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Search } from "lucide-react";

interface BlogPost {
  blog_id: number;
  blog_titulo: string;
  blog_slug: string;
  blog_estado: string;
  blog_creado_en: string;
  cat_nombre: string;
  usu_nombre: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = () => {
    setLoading(true);
    fetch("/api/blog/posts")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching posts:", err);
        setLoading(false);
      });
  };

  const handleDeleteClick = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este artículo?")) return;

    try {
      const res = await fetch(`/api/blog/posts/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchPosts();
      } else {
        alert("Error al eliminar artículo");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.blog_titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.blog_slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "publicado":
        return "bg-green-500";
      case "borrador":
        return "bg-yellow-500";
      case "archivado":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Artículos de Blog
          </h1>
          <p className="text-muted-foreground">
            Gestiona el contenido de tu blog.
          </p>
        </div>
        <Link href="/admin/blog/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Nuevo Artículo
          </Button>
        </Link>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por título..."
            className="pl-9 bg-background"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Artículos</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-10">Cargando artículos...</div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No hay artículos encontrados.
            </div>
          ) : (
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      ID
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Título
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Categoría
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Autor
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Estado
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Fecha
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {filteredPosts.map((post) => (
                    <tr
                      key={post.blog_id}
                      className="border-b transition-colors hover:bg-muted/50"
                    >
                      <td className="p-4 align-middle font-medium">
                        {post.blog_id}
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {post.blog_titulo}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {post.blog_slug}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        {post.cat_nombre || "-"}
                      </td>
                      <td className="p-4 align-middle">
                        {post.usu_nombre || "-"}
                      </td>
                      <td className="p-4 align-middle">
                        <Badge className={getStatusColor(post.blog_estado)}>
                          {post.blog_estado}
                        </Badge>
                      </td>
                      <td className="p-4 align-middle">
                        {new Date(post.blog_creado_en).toLocaleDateString()}
                      </td>
                      <td className="p-4 align-middle flex gap-2">
                        <Link href={`/admin/blog/${post.blog_id}`}>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteClick(post.blog_id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
