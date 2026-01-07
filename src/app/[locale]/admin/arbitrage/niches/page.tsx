"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Search } from "lucide-react";

interface Niche {
  id: number;
  name: string;
  description: string;
  avg_ticket_value: number;
  created_at: string;
}

export default function NichesPage() {
  const [niches, setNiches] = useState<Niche[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNiche, setEditingNiche] = useState<Niche | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    avg_ticket_value: "",
  });

  useEffect(() => {
    fetchNiches();
  }, []);

  const fetchNiches = () => {
    setLoading(true);
    fetch("/api/arbitrage/niches")
      .then((res) => res.json())
      .then((data) => {
        setNiches(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching niches:", err);
        setLoading(false);
      });
  };

  const handleCreateClick = () => {
    setEditingNiche(null);
    setFormData({
      name: "",
      description: "",
      avg_ticket_value: "",
    });
    setIsModalOpen(true);
  };

  const handleEditClick = (niche: Niche) => {
    setEditingNiche(niche);
    setFormData({
      name: niche.name,
      description: niche.description || "",
      avg_ticket_value: niche.avg_ticket_value
        ? niche.avg_ticket_value.toString()
        : "",
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este nicho?")) return;

    try {
      const res = await fetch(`/api/arbitrage/niches/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchNiches();
      } else {
        alert("Error al eliminar nicho");
      }
    } catch (error) {
      console.error("Error deleting niche:", error);
    }
  };

  const handleSave = async () => {
    if (!formData.name) {
      alert("El nombre es obligatorio");
      return;
    }

    try {
      const url = editingNiche
        ? `/api/arbitrage/niches/${editingNiche.id}`
        : "/api/arbitrage/niches";
      const method = editingNiche ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          avg_ticket_value: formData.avg_ticket_value
            ? parseFloat(formData.avg_ticket_value)
            : null,
        }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchNiches();
      } else {
        const data = await res.json();
        alert(data.error || "Error al guardar nicho");
      }
    } catch (error) {
      console.error("Error saving niche:", error);
    }
  };

  const filteredNiches = niches.filter((niche) =>
    niche.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Nichos de Negocio
          </h1>
          <p className="text-muted-foreground">
            Gestiona las categorías de negocios para prospectar (Ej. Plomeros,
            Dentistas).
          </p>
        </div>
        <Button onClick={handleCreateClick}>
          <Plus className="mr-2 h-4 w-4" /> Nuevo Nicho
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre..."
            className="pl-9 bg-background"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Nichos</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-10">Cargando nichos...</div>
          ) : filteredNiches.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No hay nichos encontrados.
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
                      Nombre
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Descripción
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Ticket Promedio
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {filteredNiches.map((niche) => (
                    <tr
                      key={niche.id}
                      className="border-b transition-colors hover:bg-muted/50"
                    >
                      <td className="p-4 align-middle font-medium">
                        {niche.id}
                      </td>
                      <td className="p-4 align-middle">{niche.name}</td>
                      <td
                        className="p-4 align-middle max-w-xs truncate"
                        title={niche.description}
                      >
                        {niche.description || "-"}
                      </td>
                      <td className="p-4 align-middle">
                        {niche.avg_ticket_value
                          ? `$${niche.avg_ticket_value}`
                          : "-"}
                      </td>
                      <td className="p-4 align-middle flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(niche)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteClick(niche.id)}
                        >
                          <Trash2 className="h-4 w-4" />
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingNiche ? "Editar Nicho" : "Nuevo Nicho"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Ej. Plomeros"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Breve descripción del nicho"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="avg_ticket">Ticket Promedio ($)</Label>
              <Input
                id="avg_ticket"
                type="number"
                value={formData.avg_ticket_value}
                onChange={(e) =>
                  setFormData({ ...formData, avg_ticket_value: e.target.value })
                }
                placeholder="Ej. 500"
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
