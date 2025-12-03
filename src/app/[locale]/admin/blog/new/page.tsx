"use client";

import { BlogForm } from "@/components/admin/blog-form";

export default function NewBlogPostPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nuevo Artículo</h1>
        <p className="text-muted-foreground">Crea un nuevo artículo para el blog.</p>
      </div>
      <BlogForm />
    </div>
  );
}
