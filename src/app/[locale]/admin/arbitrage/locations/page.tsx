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

interface Location {
  id: number;
  city: string;
  country: string;
  language_code: string;
  currency_symbol: string;
  created_at: string;
}

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [formData, setFormData] = useState({
    city: "",
    country: "",
    language_code: "EN",
    currency_symbol: "$",
  });

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = () => {
    setLoading(true);
    fetch("/api/arbitrage/locations")
      .then((res) => res.json())
      .then((data) => {
        setLocations(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching locations:", err);
        setLoading(false);
      });
  };

  const handleCreateClick = () => {
    setEditingLocation(null);
    setFormData({
      city: "",
      country: "",
      language_code: "EN",
      currency_symbol: "$",
    });
    setIsModalOpen(true);
  };

  const handleEditClick = (location: Location) => {
    setEditingLocation(location);
    setFormData({
      city: location.city,
      country: location.country,
      language_code: location.language_code || "EN",
      currency_symbol: location.currency_symbol || "$",
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar esta región?")) return;

    try {
      const res = await fetch(`/api/arbitrage/locations/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchLocations();
      } else {
        alert("Error al eliminar región");
      }
    } catch (error) {
      console.error("Error deleting location:", error);
    }
  };

  const handleSave = async () => {
    if (!formData.city || !formData.country) {
      alert("Ciudad y País son obligatorios");
      return;
    }

    try {
      const url = editingLocation
        ? `/api/arbitrage/locations/${editingLocation.id}`
        : "/api/arbitrage/locations";
      const method = editingLocation ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchLocations();
      } else {
        const data = await res.json();
        alert(data.error || "Error al guardar región");
      }
    } catch (error) {
      console.error("Error saving location:", error);
    }
  };

  const filteredLocations = locations.filter(
    (loc) =>
      loc.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Regiones Objetivo
          </h1>
          <p className="text-muted-foreground">
            Gestiona las ciudades y países donde buscarás clientes.
          </p>
        </div>
        <Button onClick={handleCreateClick}>
          <Plus className="mr-2 h-4 w-4" /> Nueva Región
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por ciudad o país..."
            className="pl-9 bg-background"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Regiones</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-10">Cargando regiones...</div>
          ) : filteredLocations.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No hay regiones encontradas.
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
                      Ciudad
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      País
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Idioma
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Moneda
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {filteredLocations.map((loc) => (
                    <tr
                      key={loc.id}
                      className="border-b transition-colors hover:bg-muted/50"
                    >
                      <td className="p-4 align-middle font-medium">{loc.id}</td>
                      <td className="p-4 align-middle">{loc.city}</td>
                      <td className="p-4 align-middle">{loc.country}</td>
                      <td className="p-4 align-middle">{loc.language_code}</td>
                      <td className="p-4 align-middle">
                        {loc.currency_symbol}
                      </td>
                      <td className="p-4 align-middle flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(loc)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteClick(loc.id)}
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
              {editingLocation ? "Editar Región" : "Nueva Región"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="city">Ciudad</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                placeholder="Ej. Miami"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">País</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
                placeholder="Ej. USA"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="language">Idioma (Código)</Label>
                <Input
                  id="language"
                  value={formData.language_code}
                  onChange={(e) =>
                    setFormData({ ...formData, language_code: e.target.value })
                  }
                  placeholder="Ej. EN"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Moneda</Label>
                <Input
                  id="currency"
                  value={formData.currency_symbol}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      currency_symbol: e.target.value,
                    })
                  }
                  placeholder="Ej. $"
                />
              </div>
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
