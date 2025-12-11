"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Search, Edit, Archive } from "lucide-react";
import Image from "next/image";

interface Post {
  publi_id: number;
  publi_caption: string;
  publi_imagen_url: string;
  publi_imagen_prompt: string;
  publi_estado_aprobacion: "pendiente" | "aprobado" | "rechazado" | "archivo";
  publi_estado_publicacion: "borrador" | "listo" | "publicado" | "fallido";
  publi_fecha_programada: string | null;
  publi_plataformas: string | string[] | null; // Can be JSON string or parsed array
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [approvalFilter, setApprovalFilter] = useState<string>("all");
  const [publicationFilter, setPublicationFilter] = useState<string>("all");
  const [showArchived, setShowArchived] = useState(false);

  // Modal State
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<{
    publi_caption: string;
    publi_imagen_url: string;
    publi_imagen_prompt: string;
    publi_estado_aprobacion: string;
    publi_plataformas: string[];
    publi_fecha_programada: string;
  }>({
    publi_caption: "",
    publi_imagen_url: "",
    publi_imagen_prompt: "",
    publi_estado_aprobacion: "pendiente",
    publi_plataformas: [],
    publi_fecha_programada: "",
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = () => {
    setLoading(true);
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching posts:", err);
        setLoading(false);
      });
  };

  const handleEditClick = (post: Post) => {
    setSelectedPost(post);

    // Parse platforms if it's a string
    let platforms: string[] = [];
    if (typeof post.publi_plataformas === "string") {
      try {
        platforms = JSON.parse(post.publi_plataformas);
      } catch (e) {
        console.error("Error parsing platforms JSON", e);
        platforms = [];
      }
    } else if (Array.isArray(post.publi_plataformas)) {
      platforms = post.publi_plataformas;
    }

    // Format date for datetime-local input
    let formattedDate = "";
    if (post.publi_fecha_programada) {
      const date = new Date(post.publi_fecha_programada);
      // Adjust for timezone offset to show correct local time in input
      const offset = date.getTimezoneOffset() * 60000;
      formattedDate = new Date(date.getTime() - offset)
        .toISOString()
        .slice(0, 16);
    }

    setEditForm({
      publi_caption: post.publi_caption || "",
      publi_imagen_url: post.publi_imagen_url || "",
      publi_imagen_prompt: post.publi_imagen_prompt || "",
      publi_estado_aprobacion: post.publi_estado_aprobacion,
      publi_plataformas: platforms || [],
      publi_fecha_programada: formattedDate,
    });
    setIsModalOpen(true);
  };

  const handlePlatformChange = (platform: string, checked: boolean) => {
    setEditForm((prev) => {
      const currentPlatforms = prev.publi_plataformas;
      if (checked) {
        return { ...prev, publi_plataformas: [...currentPlatforms, platform] };
      } else {
        return {
          ...prev,
          publi_plataformas: currentPlatforms.filter((p) => p !== platform),
        };
      }
    });
  };

  const handleSave = async () => {
    if (!selectedPost) return;

    // Validation for 'aprobado' status
    if (editForm.publi_estado_aprobacion === "aprobado") {
      if (!editForm.publi_fecha_programada) {
        alert("Para aprobar un post, debes establecer una fecha programada.");
        return;
      }

      const scheduledDate = new Date(editForm.publi_fecha_programada);
      const now = new Date();
      if (scheduledDate <= now) {
        alert("La fecha programada debe ser una fecha futura.");
        return;
      }

      if (editForm.publi_plataformas.length === 0) {
        alert(
          "Para aprobar un post, debes seleccionar al menos una plataforma."
        );
        return;
      }
    }

    try {
      // Auto-update publication status based on approval status
      let publicationStatus = selectedPost.publi_estado_publicacion;

      if (editForm.publi_estado_aprobacion === "aprobado") {
        publicationStatus = "listo";
      } else if (
        ["pendiente", "rechazado", "archivo"].includes(
          editForm.publi_estado_aprobacion
        )
      ) {
        publicationStatus = "borrador";
      }

      const res = await fetch(`/api/posts/${selectedPost.publi_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...editForm,
          publi_estado_publicacion: publicationStatus,
          publi_fecha_programada: editForm.publi_fecha_programada || null,
        }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchPosts(); // Refresh list
      } else {
        console.error("Failed to update post");
      }
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "aprobado":
        return "bg-green-500 hover:bg-green-600";
      case "rechazado":
        return "bg-red-500 hover:bg-red-600";
      case "pendiente":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "archivo":
        return "bg-gray-500 hover:bg-gray-600";
      default:
        return "bg-gray-500";
    }
  };

  const getPubStatusColor = (status: string) => {
    switch (status) {
      case "publicado":
        return "bg-blue-500 hover:bg-blue-600";
      case "fallido":
        return "bg-red-500 hover:bg-red-600";
      case "listo":
        return "bg-green-500 hover:bg-green-600";
      default:
        return "bg-gray-400";
    }
  };

  const isArchived = (post: Post) => {
    // Explicitly archived or Rejected
    if (
      post.publi_estado_aprobacion === "archivo" ||
      post.publi_estado_aprobacion === "rechazado"
    )
      return true;

    // Auto-archive logic: Past scheduled date AND pending
    if (post.publi_fecha_programada) {
      const scheduledDate = new Date(post.publi_fecha_programada);
      const now = new Date();
      if (scheduledDate < now && post.publi_estado_aprobacion === "pendiente") {
        return true;
      }
    }

    return false;
  };

  const filteredPosts = posts.filter((post) => {
    const postIsArchived = isArchived(post);

    // Archived Logic
    if (showArchived) {
      if (!postIsArchived) return false;
    } else {
      if (postIsArchived) return false;
    }

    const matchesSearch =
      post.publi_caption?.toLowerCase().includes(searchQuery.toLowerCase()) ??
      false;
    const matchesApproval =
      approvalFilter === "all" ||
      post.publi_estado_aprobacion === approvalFilter;
    const matchesPublication =
      publicationFilter === "all" ||
      post.publi_estado_publicacion === publicationFilter;
    return matchesSearch && matchesApproval && matchesPublication;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {showArchived ? "Posts Archivados" : "Posts de Marketing"}
          </h1>
          <p className="text-muted-foreground">
            {showArchived
              ? "Visualizando historial de posts."
              : "Gestiona y revisa el contenido generado por la IA."}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={showArchived ? "secondary" : "outline"}
            onClick={() => setShowArchived(!showArchived)}
          >
            <Archive className="mr-2 h-4 w-4" />
            {showArchived ? "Ver Activos" : "Archivados"}
          </Button>
          {!showArchived && (
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Nuevo Post
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por caption..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full md:w-[200px]">
          <Select value={approvalFilter} onValueChange={setApprovalFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Estado Aprobación" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos (Aprobación)</SelectItem>
              <SelectItem value="pendiente">Pendiente</SelectItem>
              <SelectItem value="aprobado">Aprobado</SelectItem>
              <SelectItem value="rechazado">Rechazado</SelectItem>
              {showArchived && <SelectItem value="archivo">Archivo</SelectItem>}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-[200px]">
          <Select
            value={publicationFilter}
            onValueChange={setPublicationFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Estado Publicación" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos (Publicación)</SelectItem>
              <SelectItem value="borrador">Borrador</SelectItem>
              <SelectItem value="listo">Listo</SelectItem>
              <SelectItem value="publicado">Publicado</SelectItem>
              <SelectItem value="fallido">Fallido</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Listado de Publicaciones {showArchived ? "(Archivo)" : ""}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-10">Cargando posts...</div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No hay publicaciones encontradas.
            </div>
          ) : (
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      ID
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Imagen
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Caption
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Aprobación
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Estado
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Programado
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {filteredPosts.map((post) => (
                    <tr
                      key={post.publi_id}
                      className="border-b transition-colors hover:bg-muted/50 cursor-pointer hover:bg-muted/80"
                      onClick={() => handleEditClick(post)}
                    >
                      <td className="p-4 align-middle font-medium">
                        {post.publi_id}
                      </td>
                      <td className="p-4 align-middle">
                        <div className="relative h-12 w-12 overflow-hidden rounded-md bg-muted">
                          <Image
                            src={post.publi_imagen_url}
                            alt="Post preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                      </td>
                      <td
                        className="p-4 align-middle max-w-[300px] truncate"
                        title={post.publi_caption}
                      >
                        {post.publi_caption}
                      </td>
                      <td className="p-4 align-middle">
                        <Badge
                          className={getStatusColor(
                            post.publi_estado_aprobacion
                          )}
                        >
                          {post.publi_estado_aprobacion}
                        </Badge>
                      </td>
                      <td className="p-4 align-middle">
                        <Badge
                          variant="outline"
                          className={getPubStatusColor(
                            post.publi_estado_publicacion
                          )}
                        >
                          {post.publi_estado_publicacion}
                        </Badge>
                      </td>
                      <td className="p-4 align-middle">
                        {post.publi_fecha_programada
                          ? new Date(
                              post.publi_fecha_programada
                            ).toLocaleString()
                          : "-"}
                      </td>
                      <td className="p-4 align-middle">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(post);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Editar Publicación #{selectedPost?.publi_id}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="image_url">URL de Imagen</Label>
                <Input
                  id="image_url"
                  value={editForm.publi_imagen_url}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      publi_imagen_url: e.target.value,
                    })
                  }
                />
                {editForm.publi_imagen_url && (
                  <div className="mt-2 relative aspect-video w-full overflow-hidden rounded-md border">
                    <Image
                      src={editForm.publi_imagen_url}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Estado de Aprobación</Label>
                  <Select
                    value={editForm.publi_estado_aprobacion}
                    onValueChange={(val) =>
                      setEditForm({ ...editForm, publi_estado_aprobacion: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendiente">Pendiente</SelectItem>
                      <SelectItem value="aprobado">Aprobado</SelectItem>
                      <SelectItem value="rechazado">Rechazado</SelectItem>
                      <SelectItem value="archivo">Archivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Plataformas</Label>
                  <div className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="instagram"
                        checked={editForm.publi_plataformas.includes(
                          "instagram"
                        )}
                        onCheckedChange={(checked) =>
                          handlePlatformChange("instagram", checked as boolean)
                        }
                      />
                      <Label htmlFor="instagram">Instagram</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="facebook"
                        checked={editForm.publi_plataformas.includes(
                          "facebook"
                        )}
                        onCheckedChange={(checked) =>
                          handlePlatformChange("facebook", checked as boolean)
                        }
                      />
                      <Label htmlFor="facebook">Facebook</Label>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scheduled_date">Fecha Programada</Label>
                  <Input
                    id="scheduled_date"
                    type="datetime-local"
                    value={editForm.publi_fecha_programada}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        publi_fecha_programada: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="caption">Caption</Label>
              <Textarea
                id="caption"
                className="min-h-[150px]"
                value={editForm.publi_caption}
                onChange={(e) =>
                  setEditForm({ ...editForm, publi_caption: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="prompt">Prompt Original</Label>
              <Textarea
                id="prompt"
                className="min-h-[80px] text-muted-foreground"
                value={editForm.publi_imagen_prompt}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    publi_imagen_prompt: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
