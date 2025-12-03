"use client";

import { useEffect, useState } from "react";
import { BlogForm } from "@/components/admin/blog-form";
import { useParams } from "next/navigation";

export default function EditBlogPostPage() {
  const params = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetch(`/api/blog/posts/${params.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            console.error("Error fetching post:", data.error);
            setPost(null);
          } else {
            setPost(data);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching post:", err);
          setLoading(false);
        });
    }
  }, [params.id]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!post) {
    return <div>Artículo no encontrado</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Editar Artículo</h1>
        <p className="text-muted-foreground">Modifica el contenido del artículo.</p>
      </div>
      <BlogForm initialData={post} isEditing />
    </div>
  );
}
