"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import Image from "next/image";

const formSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  subtitle: z.string().optional(),
  link: z.string().url("Debe ser una URL válida").optional().or(z.literal("")),
  imageUrl: z.string().optional(),
});

interface ProjectFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: any;
  isEditing?: boolean;
}

export function ProjectForm({ initialData, isEditing }: ProjectFormProps) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.pro_imagen || null
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.pro_titulo || "",
      subtitle: initialData?.pro_subtitulo || "",
      link: initialData?.pro_link || "",
      imageUrl: initialData?.pro_imagen || "",
    },
  });

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const { compressImage } = await import("@/lib/image-utils");
      const compressedFile = await compressImage(file, 2);

      const formData = new FormData();
      formData.append("file", compressedFile);

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
    try {
      const url = isEditing
        ? `/api/projects/${initialData.pro_id}`
        : "/api/projects";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pro_titulo: values.title,
          pro_subtitulo: values.subtitle,
          pro_imagen: values.imageUrl,
          pro_link: values.link,
        }),
      });

      if (res.ok) {
        router.push("/admin/projects");
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Error al guardar");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error inesperado");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              placeholder="Nombre del proyecto"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtítulo / Descripción corta</Label>
            <Input
              id="subtitle"
              placeholder="Breve descripción"
              {...register("subtitle")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="link">Link del Proyecto</Label>
            <Input id="link" placeholder="https://..." {...register("link")} />
            {errors.link && (
              <p className="text-sm text-red-500">{errors.link.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Imagen</Label>
            <div className="flex flex-col gap-4">
              {imagePreview && (
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
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
                {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
              </div>
              <input type="hidden" {...register("imageUrl")} />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/projects")}
              disabled={isSubmitting || uploading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || uploading}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isEditing ? "Actualizar" : "Crear"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
