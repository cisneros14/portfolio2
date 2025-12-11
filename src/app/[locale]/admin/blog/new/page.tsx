"use client";

import { useRef, useState } from "react";
import { BlogForm, BlogFormHandle } from "@/components/admin/blog-form";
import { Button } from "@/components/ui/button";
import { Loader2, Wand2 } from "lucide-react";

export default function NewBlogPostPage() {
  const blogFormRef = useRef<BlogFormHandle>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  async function onGenerateAI() {
    setIsGenerating(true);
    try {
      await blogFormRef.current?.generateAI();
    } catch (error) {
      console.error("Error triggering AI generation:", error);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nuevo Artículo</h1>
          <p className="text-muted-foreground">
            Crea un nuevo artículo para el blog.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onGenerateAI}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-4 w-4" />
          )}
          Generar con IA
        </Button>
      </div>
      <BlogForm ref={blogFormRef} />
    </div>
  );
}
