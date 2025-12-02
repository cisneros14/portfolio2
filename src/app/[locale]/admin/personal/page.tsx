"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit, Trash2, Search } from "lucide-react";

interface User {
  usu_id: number;
  usu_nombre: string;
  usu_correo: string;
  usu_rol: number;
  usu_estado: 'activo' | 'inactivo' | 'bloqueado';
  usu_creado_en: string;
}

export default function PersonalPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    usu_nombre: "",
    usu_correo: "",
    usu_password: "",
    usu_rol: "2",
    usu_estado: "activo",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        setLoading(false);
      });
  };

  const handleCreateClick = () => {
    setEditingUser(null);
    setFormData({
      usu_nombre: "",
      usu_correo: "",
      usu_password: "",
      usu_rol: "2",
      usu_estado: "activo",
    });
    setIsModalOpen(true);
  };

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setFormData({
      usu_nombre: user.usu_nombre,
      usu_correo: user.usu_correo,
      usu_password: "", // Password is not fetched
      usu_rol: user.usu_rol.toString(),
      usu_estado: user.usu_estado,
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este usuario?")) return;

    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchUsers();
      } else {
        alert("Error al eliminar usuario");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleSave = async () => {
    // Basic validation
    if (!formData.usu_nombre || !formData.usu_correo) {
      alert("Nombre y correo son obligatorios");
      return;
    }
    if (!editingUser && !formData.usu_password) {
      alert("La contraseña es obligatoria para nuevos usuarios");
      return;
    }

    try {
      const url = editingUser ? `/api/users/${editingUser.usu_id}` : "/api/users";
      const method = editingUser ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchUsers();
      } else {
        const data = await res.json();
        alert(data.error || "Error al guardar usuario");
      }
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.usu_nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.usu_correo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Personal</h1>
          <p className="text-muted-foreground">Gestiona los usuarios y sus permisos.</p>
        </div>
        <Button onClick={handleCreateClick}>
          <Plus className="mr-2 h-4 w-4" /> Nuevo Usuario
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o correo..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-10">Cargando usuarios...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No hay usuarios encontrados.
            </div>
          ) : (
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">ID</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nombre</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Correo</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Rol</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Estado</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Creado</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Acciones</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {filteredUsers.map((user) => (
                    <tr key={user.usu_id} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-4 align-middle font-medium">{user.usu_id}</td>
                      <td className="p-4 align-middle">{user.usu_nombre}</td>
                      <td className="p-4 align-middle">{user.usu_correo}</td>
                      <td className="p-4 align-middle">
                        <Badge variant="outline">
                          {user.usu_rol === 1 ? "Administrador" : "Agente/Editor"}
                        </Badge>
                      </td>
                      <td className="p-4 align-middle">
                        <Badge className={
                          user.usu_estado === 'activo' ? 'bg-green-500' : 
                          user.usu_estado === 'inactivo' ? 'bg-yellow-500' : 'bg-red-500'
                        }>
                          {user.usu_estado}
                        </Badge>
                      </td>
                      <td className="p-4 align-middle">
                        {new Date(user.usu_creado_en).toLocaleDateString()}
                      </td>
                      <td className="p-4 align-middle flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditClick(user)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDeleteClick(user.usu_id)}>
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
            <DialogTitle>{editingUser ? "Editar Usuario" : "Nuevo Usuario"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={formData.usu_nombre}
                onChange={(e) => setFormData({ ...formData, usu_nombre: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo</Label>
              <Input
                id="email"
                type="email"
                value={formData.usu_correo}
                onChange={(e) => setFormData({ ...formData, usu_correo: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña {editingUser && "(Dejar en blanco para mantener)"}</Label>
              <Input
                id="password"
                type="password"
                value={formData.usu_password}
                onChange={(e) => setFormData({ ...formData, usu_password: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Rol</Label>
              <Select
                value={formData.usu_rol}
                onValueChange={(val) => setFormData({ ...formData, usu_rol: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Administrador</SelectItem>
                  <SelectItem value="2">Agente/Editor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select
                value={formData.usu_estado}
                onValueChange={(val) => setFormData({ ...formData, usu_estado: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                  <SelectItem value="bloqueado">Bloqueado</SelectItem>
                </SelectContent>
              </Select>
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
