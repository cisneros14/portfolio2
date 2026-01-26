"use client";

import { useState } from "react";
import { addIdea } from "@/app/actions/facebook-actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus } from "lucide-react";
// Asumo que usan sonner o similar para toasts, si no, se puede usar alert o console.
// Ojo: Si no tienen 'sonner' instalado, podría fallar. Revisar package.json.
// Package.json no muestra 'sonner', pero muestra 'lucide-react'.
// Muestra '@radix-ui/...'. No veo toast stack obvio excepto tal vez algo propio.
// Usaré alert simple por seguridad si falla, o un estado local de mensaje.

export function AddIdeaForm() {
  const [loading, setLoading] = useState(false);
  const [idea, setIdea] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!idea.trim()) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("idea", idea);

    try {
      const result = await addIdea(formData);
      if (result.success) {
        setIdea("");
        // toast.success('Idea agregada') // Si hubiera toast
        alert("Idea agregada correctamente");
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      console.error(error);
      alert("Error inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Nueva Idea de Publicación</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="idea">Describe la idea o tema</Label>
            <Textarea
              id="idea"
              placeholder="Ej: Tips para mejorar el SEO en 2026..."
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              rows={3}
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Agregar Idea
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
