"use client";

import { ProjectForm } from "@/components/admin/project-form";

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Nuevo Proyecto</h1>
      <ProjectForm />
    </div>
  );
}
