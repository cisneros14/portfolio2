import { getIdeas } from "@/app/actions/facebook-actions";
import { AddIdeaForm } from "@/components/admin/add-idea-form";
import { IdeasTable } from "@/components/admin/ideas-table";
import { Separator } from "@/components/ui/separator";

export default async function AdminIdeasPage() {
  const ideas = await getIdeas();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Automatización de Facebook</h3>
        <p className="text-sm text-muted-foreground">
          Gestiona las ideas para las publicaciones automáticas diarias.
        </p>
      </div>
      <Separator />

      <div className="grid gap-6">
        <AddIdeaForm />

        <div className="space-y-4">
          <h4 className="text-md font-medium">Listado de Ideas</h4>
          <IdeasTable ideas={ideas} />
        </div>
      </div>
    </div>
  );
}
