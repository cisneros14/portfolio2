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

interface Category {
  cat_id: number;
  cat_nombre: string;
  cat_slug: string;
  cat_descripcion: string;
  cat_creado_en: string;
}

export default function BlogCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    cat_nombre: "",
    cat_slug: "",
    cat_descripcion: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    setLoading(true);
    fetch("/api/blog/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
        setLoading(false);
      });
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      cat_nombre: name,
      cat_slug: generateSlug(name),
    }));
  };

  const handleCreateClick = () => {
    setEditingCategory(null);
    setFormData({
      cat_nombre: "",
      cat_slug: "",
      cat_descripcion: "",
    });
    setIsModalOpen(true);
  };

  const handleEditClick = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      cat_nombre: category.cat_nombre,
      cat_slug: category.cat_slug,
      cat_descripcion: category.cat_descripcion || "",
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar esta categoría?")) return;

    try {
      const res = await fetch(`/api/blog/categories/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchCategories();
      } else {
        alert("Error al eliminar categoría");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleSave = async () => {
    if (!formData.cat_nombre || !formData.cat_slug) {
      alert("Nombre y Slug son obligatorios");
      return;
    }

    try {
      const url = editingCategory
        ? `/api/blog/categories/${editingCategory.cat_id}`
        : "/api/blog/categories";
      const method = editingCategory ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchCategories();
      } else {
        const data = await res.json();
        alert(data.error || "Error al guardar categoría");
      }
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.cat_nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.cat_slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categorías de Blog</h1>
          <p className="text-muted-foreground">Gestiona las categorías para tus artículos.</p>
        </div>
        <Button onClick={handleCreateClick}>
          <Plus className="mr-2 h-4 w-4" /> Nueva Categoría
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o slug..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Categorías</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-10">Cargando categorías...</div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No hay categorías encontradas.
            </div>
          ) : (
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">ID</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nombre</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Slug</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Descripción</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Acciones</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {filteredCategories.map((cat) => (
                    <tr key={cat.cat_id} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-4 align-middle font-medium">{cat.cat_id}</td>
                      <td className="p-4 align-middle">{cat.cat_nombre}</td>
                      <td className="p-4 align-middle text-muted-foreground">{cat.cat_slug}</td>
                      <td className="p-4 align-middle max-w-xs truncate" title={cat.cat_descripcion}>
                        {cat.cat_descripcion || '-'}
                      </td>
                      <td className="p-4 align-middle flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditClick(cat)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDeleteClick(cat.cat_id)}>
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
            <DialogTitle>{editingCategory ? "Editar Categoría" : "Nueva Categoría"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={formData.cat_nombre}
                onChange={handleNameChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={formData.cat_slug}
                onChange={(e) => setFormData({ ...formData, cat_slug: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">URL amigable para SEO.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Input
                id="description"
                value={formData.cat_descripcion}
                onChange={(e) => setFormData({ ...formData, cat_descripcion: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
