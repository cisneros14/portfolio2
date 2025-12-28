"use client";

import { useState, useEffect, forwardRef, useImperativeHandle } from "react";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import Image from "next/image";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { generateBlogContent, getBlogCategories } from "@/actions/blog-ai";

const formSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  slug: z.string().min(1, "El slug es obligatorio"),
  categoryId: z.string().min(1, "La categoría es obligatoria"),
  extract: z.string().optional(),
  content: z.string().min(1, "El contenido es obligatorio"),
  keywords: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["draft", "published"]),
  imageUrl: z.string().optional(),
});

interface BlogFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export interface BlogFormHandle {
  generateAI: () => Promise<void>;
}

export const BlogForm = forwardRef<BlogFormHandle, BlogFormProps>(
  ({ initialData, isEditing }, ref) => {
    const [categories, setCategories] = useState<any[]>([]);
    const [uploading, setUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(
      initialData?.blog_imagen || null
    );

    const {
      register,
      handleSubmit,
      control,
      setValue,
      getValues,
      formState: { errors, isSubmitting },
    } = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        title: initialData?.blog_titulo || "",
        slug: initialData?.blog_slug || "",
        categoryId: initialData?.blog_categoria_id?.toString() || "",
        extract: initialData?.blog_extracto || "",
        content: initialData?.blog_contenido || "",
        keywords: initialData?.blog_keywords || "",
        description: initialData?.blog_descripcion || "",
        status: initialData?.blog_estado || "draft",
        imageUrl: initialData?.blog_imagen || "",
      },
    });

    useEffect(() => {
      async function fetchCategories() {
        try {
          const cats = await getBlogCategories();
          setCategories(cats);
        } catch (error) {
          console.error("Failed to fetch categories", error);
        } finally {
          // setLoadingCategories(false); // Removed as per instruction
        }
      }
      fetchCategories();
    }, []);

    async function onGenerateAI() {
      const categoryId = getValues("categoryId");
      if (!categoryId) {
        alert("Por favor selecciona una categoría primero");
        return;
      }

      try {
        const content = await generateBlogContent(categoryId);
        if (content) {
          setValue("title", content.title);
          setValue("slug", content.slug);
          setValue("extract", content.extract);
          setValue("content", content.content);
          setValue("keywords", content.keywords);
          setValue("description", content.description);
        }
      } catch (error) {
        console.error("Error generating content:", error);
        alert("Error al generar contenido");
      } finally {
        // setIsGenerating(false); // Removed as per instruction
      }
    }

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploading(true);

      try {
        // Import dynamically or use the imported utility
        const { compressImage } = await import("@/lib/image-utils");

        // Compress if larger than 2MB
        const compressedFile = await compressImage(file, 2);

        const formData = new FormData();
        formData.append("file", compressedFile);

        // Dynamically import the server action to avoid build issues if it's not ready
        const { uploadImage } = await import("@/actions/upload-image");
        const result = await uploadImage(formData);
        if (result?.secure_url) {
          setValue("imageUrl", result.secure_url);
          setImagePreview(result.secure_url);
        }
      } catch (error) {
        console.error("Upload failed:", error);
        alert("Error al subir la imagen");
      } finally {
        setUploading(false);
      }
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
      console.log(values);
      alert(
        "Funcionalidad de guardar pendiente. Revisa la consola para ver los valores."
      );
      // Here you would call the server action to save/update the post
    }

    useImperativeHandle(ref, () => ({
      generateAI: onGenerateAI,
    }));

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    placeholder="Título del artículo"
                    {...register("title")}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    placeholder="slug-del-articulo"
                    {...register("slug")}
                  />
                  {errors.slug && (
                    <p className="text-sm text-red-500">
                      {errors.slug.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Contenido</Label>
                  <Controller
                    name="content"
                    control={control}
                    render={({ field }) => (
                      <ReactQuill
                        theme="snow"
                        value={field.value}
                        onChange={field.onChange}
                        className="min-h-[400px]"
                      />
                    )}
                  />
                  {errors.content && (
                    <p className="text-sm text-red-500">
                      {errors.content.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Publicación</h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Estado</Label>
                  <Controller
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Borrador</SelectItem>
                          <SelectItem value="published">Publicado</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.status && (
                    <p className="text-sm text-red-500">
                      {errors.status.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoryId">Categoría</Label>
                  <Controller
                    control={control}
                    name="categoryId"
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem
                              key={cat.cat_id}
                              value={cat.cat_id.toString()}
                            >
                              {cat.cat_nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.categoryId && (
                    <p className="text-sm text-red-500">
                      {errors.categoryId.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Imagen Destacada</Label>
                  <div className="flex flex-col gap-4">
                    {imagePreview && (
                      <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                        <Image
                          src={imagePreview}
                          alt="Vista previa"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                      />
                      {uploading && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}
                    </div>
                    <input type="hidden" {...register("imageUrl")} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-medium">SEO</h3>
                <div className="space-y-2">
                  <Label htmlFor="extract">Extracto</Label>
                  <Textarea
                    id="extract"
                    placeholder="Resumen corto..."
                    {...register("extract")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="keywords">Palabras clave</Label>
                  <Input
                    id="keywords"
                    placeholder="seo, palabras clave, aquí"
                    {...register("keywords")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Meta Descripción</Label>
                  <Textarea
                    id="description"
                    placeholder="Meta descripción para motores de búsqueda..."
                    {...register("description")}
                  />
                </div>
              </CardContent>
            </Card>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || uploading}
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isEditing ? "Actualizar Artículo" : "Crear Artículo"}
            </Button>
          </div>
        </div>
      </form>
    );
  }
);

BlogForm.displayName = "BlogForm";
