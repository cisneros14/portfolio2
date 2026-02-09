"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  ExternalLink,
  MoreHorizontal,
  Globe,
} from "lucide-react";

interface Platform {
  plataforma_id: number;
  plataforma_nombre: string;
  plataforma_url: string;
  created_at: string;
}

export default function PlatformsPage() {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Platform Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlatform, setEditingPlatform] = useState<Platform | null>(null);
  const [formData, setFormData] = useState({
    plataforma_nombre: "",
    plataforma_url: "",
  });

  useEffect(() => {
    fetchPlatforms();
  }, []);

  const fetchPlatforms = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/platforms");
      const data = await res.json();
      setPlatforms(data);
    } catch (err) {
      console.error("Error fetching platforms:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.plataforma_nombre) {
      alert("El nombre es requerido");
      return;
    }
    try {
      const url = "/api/platforms";
      const method = editingPlatform ? "PUT" : "POST";
      const body = editingPlatform
        ? { ...formData, plataforma_id: editingPlatform.plataforma_id }
        : formData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchPlatforms();
      } else {
        const error = await res.json();
        alert(error.error || "Error al guardar");
      }
    } catch (err) {
      console.error("Error saving platform:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar esta plataforma?")) return;
    try {
      const res = await fetch(`/api/platforms?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchPlatforms();
    } catch (err) {
      console.error("Error deleting platform:", err);
    }
  };

  const openModal = (platform?: Platform) => {
    if (platform) {
      setEditingPlatform(platform);
      setFormData({
        plataforma_nombre: platform.plataforma_nombre,
        plataforma_url: platform.plataforma_url || "",
      });
    } else {
      setEditingPlatform(null);
      setFormData({ plataforma_nombre: "", plataforma_url: "" });
    }
    setIsModalOpen(true);
  };

  const filteredPlatforms = platforms.filter(
    (p) =>
      p.plataforma_nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.plataforma_url &&
        p.plataforma_url.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Plataformas</h1>
          <p className="text-muted-foreground">
            Administra el catálogo de servicios y plataformas disponibles.
          </p>
        </div>
        <Button onClick={() => openModal()}>
          <Plus className="mr-2 h-4 w-4" /> Nueva Plataforma
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Listado de Servicios</CardTitle>
          <CardDescription>
            Gestiona las plataformas que se pueden vincular a los clientes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o URL..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>URL de Acceso</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      Cargando plataformas...
                    </TableCell>
                  </TableRow>
                ) : filteredPlatforms.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No se encontraron plataformas.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPlatforms.map((p, index) => (
                    <TableRow key={p.plataforma_id}>
                      <TableCell className="font-medium text-muted-foreground">
                        {index + 1}
                      </TableCell>
                      <TableCell className="font-semibold">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <Globe className="h-4 w-4" />
                          </div>
                          {p.plataforma_nombre}
                        </div>
                      </TableCell>
                      <TableCell>
                        {p.plataforma_url ? (
                          <a
                            href={
                              p.plataforma_url.startsWith("http")
                                ? p.plataforma_url
                                : `https://${p.plataforma_url}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-600 hover:underline text-sm"
                          >
                            {p.plataforma_url}{" "}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            -
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Abrir menú</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => openModal(p)}>
                              <Edit className="mr-2 h-4 w-4" /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDelete(p.plataforma_id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="text-xs text-muted-foreground mt-4">
            Mostrando {filteredPlatforms.length} de {platforms.length}{" "}
            plataformas
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingPlatform ? "Editar Plataforma" : "Nueva Plataforma"}
            </DialogTitle>
            <DialogDescription>
              Ingresa los detalles del servicio o plataforma.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre de la Plataforma</Label>
              <Input
                id="name"
                placeholder="Ej. Facebook Ads, Google Analytics..."
                value={formData.plataforma_nombre}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    plataforma_nombre: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">URL de Acceso (Opcional)</Label>
              <Input
                id="url"
                placeholder="Ej. https://business.facebook.com"
                value={formData.plataforma_url}
                onChange={(e) =>
                  setFormData({ ...formData, plataforma_url: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
