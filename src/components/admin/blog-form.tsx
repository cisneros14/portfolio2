"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import "react-quill-new/dist/quill.snow.css";

// Dynamic import for React Quill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface Category {
  cat_id: number;
  cat_nombre: string;
}

interface BlogFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export function BlogForm({ initialData, isEditing = false }: BlogFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    blog_titulo: "",
    blog_slug: "",
    blog_cat_id: "",
    blog_extracto: "",
    blog_contenido: "",
    blog_imagen_portada: "",
    blog_estado: "borrador",
    blog_seo_keywords: "",
    blog_seo_description: "",
  });

  useEffect(() => {
    // Fetch categories
    fetch("/api/blog/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        blog_titulo: initialData.blog_titulo || "",
        blog_slug: initialData.blog_slug || "",
        blog_cat_id: initialData.blog_cat_id?.toString() || "",
        blog_extracto: initialData.blog_extracto || "",
        blog_contenido: initialData.blog_contenido || "",
        blog_imagen_portada: initialData.blog_imagen_portada || "",
        blog_estado: initialData.blog_estado || "borrador",
        blog_seo_keywords: initialData.blog_seo_keywords || "",
        blog_seo_description: initialData.blog_seo_description || "",
      });
    }
  }, [initialData]);


  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    // Only auto-generate slug if creating new post or if slug is empty
    if (!isEditing || !formData.blog_slug) {
      setFormData((prev) => ({
        ...prev,
        blog_titulo: title,
        blog_slug: generateSlug(title),
      }));
    } else {
      setFormData((prev) => ({ ...prev, blog_titulo: title }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEditing
        ? `/api/blog/posts/${initialData.blog_id}`
        : "/api/blog/posts";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/admin/blog");
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Error al guardar el artículo");
      }
    } catch (error) {
      console.error("Error saving post:", error);
      alert("Error al guardar el artículo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={formData.blog_titulo}
                  onChange={handleTitleChange}
                  placeholder="Título del artículo"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL)</Label>
                <Input
                  id="slug"
                  value={formData.blog_slug}
                  onChange={(e) => setFormData({ ...formData, blog_slug: e.target.value })}
                  placeholder="url-amigable-del-articulo"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Contenido</Label>
                <div className="h-[400px] mb-12"> {/* Height container for Quill */}
                  <ReactQuill
                    theme="snow"
                    value={formData.blog_contenido}
                    onChange={(content) => setFormData({ ...formData, blog_contenido: content })}
                    className="h-full"
                    modules={{
                      toolbar: [
                        [{ 'header': [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        ['link', 'image'],
                        ['clean']
                      ],
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2 pt-8"> {/* Added padding top to separate from Quill */}
                <Label htmlFor="excerpt">Extracto</Label>
                <Textarea
                  id="excerpt"
                  value={formData.blog_extracto}
                  onChange={(e) => setFormData({ ...formData, blog_extracto: e.target.value })}
                  placeholder="Breve resumen para la tarjeta del blog..."
                  className="h-24"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-medium">SEO</h3>
              <div className="space-y-2">
                <Label htmlFor="seo_keywords">Keywords (separadas por comas)</Label>
                <Input
                  id="seo_keywords"
                  value={formData.blog_seo_keywords}
                  onChange={(e) => setFormData({ ...formData, blog_seo_keywords: e.target.value })}
                  placeholder="marketing, seo, web design"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seo_description">Meta Description</Label>
                <Textarea
                  id="seo_description"
                  value={formData.blog_seo_description}
                  onChange={(e) => setFormData({ ...formData, blog_seo_description: e.target.value })}
                  placeholder="Descripción para buscadores (max 160 caracteres)"
                  maxLength={160}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Right Column */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Estado</Label>
                <Select
                  value={formData.blog_estado}
                  onValueChange={(val) => setFormData({ ...formData, blog_estado: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="borrador">Borrador</SelectItem>
                    <SelectItem value="publicado">Publicado</SelectItem>
                    <SelectItem value="archivado">Archivado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoría</Label>
                  <Select
                    value={formData.blog_cat_id}
                    onValueChange={(val) => {
                      setFormData(prev => ({ ...prev, blog_cat_id: val }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.cat_id} value={cat.cat_id.toString()}>
                          {cat.cat_nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="image">Imagen Portada (URL)</Label>
                <Input
                  id="image"
                  value={formData.blog_imagen_portada}
                  onChange={(e) => setFormData({ ...formData, blog_imagen_portada: e.target.value })}
                  placeholder="https://..."
                />
                {formData.blog_imagen_portada && (
                  <div className="mt-2 relative aspect-video w-full overflow-hidden rounded-md border">
                    <img
                      src={formData.blog_imagen_portada}
                      alt="Preview"
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4 flex-col">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => router.push("/admin/blog")}
            >
              Cancelar
            </Button>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Guardando..." : "Guardar Artículo"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
