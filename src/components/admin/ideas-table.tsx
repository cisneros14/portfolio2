"use client";

import { deleteIdea } from "@/app/actions/facebook-actions";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// Usaremos tabla HTML standard con clases Tailwind para asegurar compatibilidad si falta el componente
import { Button } from "@/components/ui/button";
import { Trash2, CheckCircle, Clock } from "lucide-react";
import { useState } from "react";

import { Idea } from "@/app/actions/facebook-actions";

export function IdeasTable({ ideas }: { ideas: Idea[] }) {
  const [deleting, setDeleting] = useState<number | null>(null);

  async function handleDelete(id: number) {
    if (!confirm("¿Estás seguro de eliminar esta idea?")) return;
    setDeleting(id);
    await deleteIdea(id);
    setDeleting(null);
  }

  return (
    <div className="rounded-md border">
      <div className="w-full overflow-auto">
        <table className="w-full caption-bottom text-sm text-left">
          <thead className="[&_tr]:border-b">
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <th className="h-12 px-4 align-middle font-medium text-muted-foreground w-[50px]">
                ID
              </th>
              <th className="h-12 px-4 align-middle font-medium text-muted-foreground">
                Idea
              </th>
              <th className="h-12 px-4 align-middle font-medium text-muted-foreground w-[150px]">
                Estado
              </th>
              <th className="h-12 px-4 align-middle font-medium text-muted-foreground w-[200px]">
                Fecha Publicación
              </th>
              <th className="h-12 px-4 align-middle font-medium text-muted-foreground w-[100px] text-right">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {ideas.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-4 text-center text-muted-foreground"
                >
                  No hay ideas registradas.
                </td>
              </tr>
            ) : (
              ideas.map((idea) => (
                <tr
                  key={idea.post_id}
                  className="border-b transition-colors hover:bg-muted/50"
                >
                  <td className="p-4 align-middle font-medium">
                    {idea.post_id}
                  </td>
                  <td className="p-4 align-middle">{idea.post_idea}</td>
                  <td className="p-4 align-middle">
                    {idea.post_publicado ? (
                      <span className="inline-flex items-center rounded-full border border-transparent bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800 dark:bg-green-800/20 dark:text-green-300">
                        <CheckCircle className="mr-1 h-3 w-3" /> Publicado
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full border border-transparent bg-yellow-100 px-2.5 py-0.5 text-xs font-semibold text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-300">
                        <Clock className="mr-1 h-3 w-3" /> Pendiente
                      </span>
                    )}
                  </td>
                  <td className="p-4 align-middle">
                    {idea.post_fecha_publicacion
                      ? new Date(idea.post_fecha_publicacion).toLocaleString()
                      : "-"}
                  </td>
                  <td className="p-4 align-middle text-right">
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(idea.post_id)}
                      disabled={deleting === idea.post_id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
