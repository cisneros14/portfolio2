"use client";

import { useEffect, useState } from "react";
import { ProjectForm } from "@/components/admin/project-form";
import { use } from "react";

export default function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setProject(data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Cargando...</div>;
  if (!project) return <div>Proyecto no encontrado</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Editar Proyecto</h1>
      <ProjectForm initialData={project} isEditing />
    </div>
  );
}
