"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Phone,
  Mail,
  FileText,
  Key,
  Users,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface Client {
  cliente_id: number;
  cliente_nombre: string;
  cliente_empresa: string | null;
  cliente_identificacion: string | null;
  cliente_estado: "activo" | "inactivo" | "lead";
  created_at: string;
}

interface ClientNumber {
  numero_id: number;
  numero: string;
  tipo: string;
}

interface ClientEmail {
  correo_id: number;
  correo: string;
  tipo: string;
}

interface ClientNote {
  nota_id: number;
  nota: string;
  created_at: string;
}

interface ClientCredential {
  cred_id: number;
  plataforma_id: number;
  plataforma_nombre: string;
  cred_correo: string;
  cred_usuario: string;
  cred_contrasena: string;
  alias: string | null;
}

interface Credential {
  cred_id: number;
  plataforma_id: number;
  plataforma_nombre: string;
  cred_correo: string;
  cred_usuario: string;
  cred_contrasena?: string; // Optional for listing
}

interface Platform {
  plataforma_id: number;
  plataforma_nombre: string;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Client Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    empresa: "",
    identificacion: "",
    estado: "activo" as "activo" | "inactivo" | "lead",
  });

  // Client Details (Nested)
  // We use this state for BOTH displaying fetched details (Edit Mode) AND storing local details (Create Mode)
  const [details, setDetails] = useState<{
    numeros: ClientNumber[];
    correos: ClientEmail[];
    notas: ClientNote[];
    credenciales: ClientCredential[];
  }>({
    numeros: [],
    correos: [],
    notas: [],
    credenciales: [],
  });

  const [platforms, setPlatforms] = useState<Platform[]>([]);

  // New credential state for the form
  const [newCred, setNewCred] = useState<{
    plataforma_id: string;
    cred_correo: string;
    cred_usuario: string;
    cred_contrasena: string;
  }>({
    plataforma_id: "",
    cred_correo: "",
    cred_usuario: "",
    cred_contrasena: "",
  });

  const [activeTab, setActiveTab] = useState("general");

  // Local additions
  const [newNumber, setNewNumber] = useState({ numero: "", tipo: "otro" });
  const [newEmail, setNewEmail] = useState({ correo: "", tipo: "otro" });
  const [newNote, setNewNote] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [clientsRes, platformsRes] = await Promise.all([
        fetch("/api/clients?estado=" + statusFilter),
        fetch("/api/platforms"),
      ]);
      const clientsData = await clientsRes.json();
      const platformsData = await platformsRes.json();

      setClients(clientsData);
      setPlatforms(platformsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fetchDetails = async (id: number) => {
    try {
      const res = await fetch(`/api/clients/${id}/details`);
      const data = await res.json();
      setDetails(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClientSave = async () => {
    if (!formData.nombre) {
      alert("El nombre es requerido");
      return;
    }

    try {
      if (editingClient) {
        // Edit Mode: Update Base Info Only (Details are handled individually)
        const res = await fetch("/api/clients", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            cliente_id: editingClient.cliente_id,
          }),
        });
        if (res.ok) {
          fetchData();
          alert("Información básica actualizada");
        }
      } else {
        // Create Mode: Batch Create
        const payload = {
          ...formData,
          numeros: details.numeros,
          correos: details.correos,
          notas: details.notas,
          credenciales: details.credenciales.map((c) => ({
            plataforma_id: c.plataforma_id,
            cred_correo: c.cred_correo,
            cred_usuario: c.cred_usuario,
            cred_contrasena: c.cred_contrasena,
            alias: c.alias,
          })),
        };

        const res = await fetch("/api/clients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          setIsModalOpen(false);
          fetchData();
          alert("Cliente creado exitosamente");
        } else {
          const err = await res.json();
          alert("Error: " + (err.error || "Error desconocido"));
        }
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión");
    }
  };

  const handleDeleteClient = async (id: number) => {
    if (
      !confirm(
        "¿Estás seguro de eliminar este cliente? Esta acción no se puede deshacer.",
      )
    )
      return;
    try {
      const res = await fetch(`/api/clients?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchData();
        alert("Cliente eliminado");
      } else {
        const err = await res.json();
        alert("Error: " + (err.error || "Error desconocido"));
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión");
    }
  };

  const handleEditClick = (client: Client) => {
    setEditingClient(client);
    setFormData({
      nombre: client.cliente_nombre,
      empresa: client.cliente_empresa || "",
      identificacion: client.cliente_identificacion || "",
      estado: client.cliente_estado,
    });
    fetchDetails(client.cliente_id);
    setActiveTab("general");
    setIsModalOpen(true);
  };

  const addDetail = async (type: string, data: any) => {
    if (editingClient) {
      // Edit Mode: API Call
      try {
        const res = await fetch(
          `/api/clients/${editingClient.cliente_id}/details`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type, data }),
          },
        );
        if (res.ok) {
          fetchDetails(editingClient.cliente_id);
          resetDetailInputs(type);
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      // Create Mode: Local State
      const id = Date.now(); // temp id
      if (type === "numero") {
        if (!/^\d+$/.test(data.numero)) {
          alert("El número solo puede contener dígitos");
          return;
        }
        setDetails((prev) => ({
          ...prev,
          numeros: [...prev.numeros, { ...data, numero_id: id }],
        }));
      }
      if (type === "correo") {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.correo)) {
          alert("Formato de correo inválido");
          return;
        }
        setDetails((prev) => ({
          ...prev,
          correos: [...prev.correos, { ...data, correo_id: id }],
        }));
      }
      if (type === "nota")
        setDetails((prev) => ({
          ...prev,
          notas: [
            ...prev.notas,
            { ...data, nota_id: id, created_at: new Date().toISOString() },
          ],
        }));
      else if (type === "credencial") {
        // For credentials, 'item' is the newCred object
        const credToAdd = data as typeof newCred;
        const platform = platforms.find(
          (p) => p.plataforma_id.toString() === credToAdd.plataforma_id,
        );

        if (!platform) return;

        const newDetail: ClientCredential = {
          cred_id: Date.now(), // Temp ID
          plataforma_id: parseInt(credToAdd.plataforma_id),
          plataforma_nombre: platform.plataforma_nombre,
          cred_correo: credToAdd.cred_correo,
          cred_usuario: credToAdd.cred_usuario,
          cred_contrasena: credToAdd.cred_contrasena,
          alias: "",
        };

        setDetails({
          ...details,
          credenciales: [...details.credenciales, newDetail],
        });
        setNewCred({
          plataforma_id: "",
          cred_correo: "",
          cred_usuario: "",
          cred_contrasena: "",
        });
      }
      resetDetailInputs(type);
    }
  };

  const resetDetailInputs = (type: string) => {
    if (type === "numero") setNewNumber({ numero: "", tipo: "otro" });
    if (type === "correo") setNewEmail({ correo: "", tipo: "otro" });
    if (type === "nota") setNewNote("");
    if (type === "credencial")
      setNewCred({
        plataforma_id: "",
        cred_correo: "",
        cred_usuario: "",
        cred_contrasena: "",
      });
  };

  const deleteDetail = async (type: string, id: number) => {
    if (editingClient) {
      // Edit Mode: API Call
      if (!confirm("¿Seguro de eliminar este dato?")) return;
      try {
        const res = await fetch(
          `/api/clients/${editingClient.cliente_id}/details?type=${type}&id=${id}`,
          { method: "DELETE" },
        );
        if (res.ok) {
          fetchDetails(editingClient.cliente_id);
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      // Create Mode: Local State
      if (type === "numero")
        setDetails((prev) => ({
          ...prev,
          numeros: prev.numeros.filter((x) => x.numero_id !== id),
        }));
      if (type === "correo")
        setDetails((prev) => ({
          ...prev,
          correos: prev.correos.filter((x) => x.correo_id !== id),
        }));
      if (type === "nota")
        setDetails((prev) => ({
          ...prev,
          notas: prev.notas.filter((x) => x.nota_id !== id),
        }));
      if (type === "credencial") {
        // If it's a temp ID (created now), filter it out
        // If it was fetched (real ID), we might need to handle deletion differently if we want to delete from DB immediately
        // But for now, let's assume we just remove from the list to be saved/updated
        setDetails({
          ...details,
          credenciales: details.credenciales.filter((c) => c.cred_id !== id),
        });
      }
    }
  };

  const WizardNavigation = ({
    prev,
    next,
    isSave,
  }: {
    prev?: string;
    next?: string;
    isSave?: boolean;
  }) => (
    <div className="flex justify-between items-center mt-6 pt-4 border-t">
      <div>
        {prev && (
          <Button variant="outline" onClick={() => setActiveTab(prev)}>
            Anterior
          </Button>
        )}
      </div>
      <div>
        {next && <Button onClick={() => setActiveTab(next)}>Siguiente</Button>}
        {isSave && (
          <Button onClick={handleClientSave}>
            {editingClient ? "Cerrar / Guardar" : "Guardar Cliente"}
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground">
            Gestiona tus clientes y su información detallada.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingClient(null);
            setFormData({
              nombre: "",
              empresa: "",
              identificacion: "",
              estado: "activo",
            });
            setDetails({
              numeros: [],
              correos: [],
              notas: [],
              credenciales: [],
            });
            setIsModalOpen(true);
            setDetails({
              numeros: [],
              correos: [],
              notas: [],
              credenciales: [],
            });
            setActiveTab("general");
            setIsModalOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Nuevo Cliente
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, ruc..."
            className="pl-9 bg-background"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos</SelectItem>
            <SelectItem value="activo">Activo</SelectItem>
            <SelectItem value="inactivo">Inactivo</SelectItem>
            <SelectItem value="lead">Lead</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-10">Cargando...</div>
          ) : clients.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No hay clientes encontrados.
            </div>
          ) : (
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Nombre
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Empresa
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Estado
                    </th>
                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {clients.map((c) => (
                    <tr
                      key={c.cliente_id}
                      className="border-b transition-colors hover:bg-muted/50"
                    >
                      <td className="p-4 align-middle font-medium">
                        {c.cliente_nombre}
                      </td>
                      <td className="p-4 align-middle">
                        {c.cliente_empresa || "-"}
                      </td>
                      <td className="p-4 align-middle">
                        <Badge
                          variant={
                            c.cliente_estado === "activo"
                              ? "default"
                              : c.cliente_estado === "lead"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {c.cliente_estado.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="p-4 align-middle text-right flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(c)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDeleteClient(c.cliente_id)}
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
        <DialogContent className="sm:max-w-[700px] h-[90vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {editingClient
                ? `Editar: ${editingClient.cliente_nombre}`
                : "Nuevo Cliente"}
            </DialogTitle>
          </DialogHeader>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col mt-4 overflow-hidden"
          >
            <div className="px-6 border-b">
              <TabsList className="bg-transparent border-b-0 gap-4">
                <TabsTrigger
                  value="general"
                  className="data-[state=active]:bg-muted"
                >
                  General
                </TabsTrigger>
                <TabsTrigger
                  value="contacto"
                  className="data-[state=active]:bg-muted"
                >
                  Contacto
                </TabsTrigger>
                <TabsTrigger
                  value="credenciales"
                  className="data-[state=active]:bg-muted"
                >
                  Credenciales
                </TabsTrigger>
                <TabsTrigger
                  value="notas"
                  className="data-[state=active]:bg-muted"
                >
                  Notas
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <TabsContent value="general" className="space-y-4 mt-0">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nombre Completo</Label>
                    <Input
                      value={formData.nombre}
                      onChange={(e) =>
                        setFormData({ ...formData, nombre: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Empresa</Label>
                    <Input
                      value={formData.empresa}
                      onChange={(e) =>
                        setFormData({ ...formData, empresa: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Identificación / RUC</Label>
                    <Input
                      value={formData.identificacion}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          identificacion: e.target.value.replace(/\D/g, ""),
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Estado</Label>
                    <Select
                      value={formData.estado}
                      onValueChange={(val: any) =>
                        setFormData({ ...formData, estado: val })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="activo">Activo</SelectItem>
                        <SelectItem value="inactivo">Inactivo</SelectItem>
                        <SelectItem value="lead">Lead</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <WizardNavigation next="contacto" />
              </TabsContent>

              <TabsContent value="contacto" className="space-y-6 mt-0">
                {/* NUMEROS */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold flex items-center gap-2">
                    <Phone className="h-4 w-4" /> Números de Teléfono
                  </h3>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Número..."
                      value={newNumber.numero}
                      onChange={(e) =>
                        setNewNumber({
                          ...newNumber,
                          numero: e.target.value.replace(/\D/g, ""),
                        })
                      }
                    />
                    <Select
                      value={newNumber.tipo}
                      onValueChange={(val) =>
                        setNewNumber({ ...newNumber, tipo: val })
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="whatsapp">WA</SelectItem>
                        <SelectItem value="personal">Personal</SelectItem>
                        <SelectItem value="empresa">Empresa</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      size="icon"
                      onClick={() => addDetail("numero", newNumber)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {details.numeros.map((n) => (
                      <div
                        key={n.numero_id}
                        className="flex justify-between items-center p-2 bg-muted/30 rounded-md text-sm"
                      >
                        <span>
                          {n.numero}{" "}
                          <Badge variant="outline" className="ml-2 text-[10px]">
                            {n.tipo.toUpperCase()}
                          </Badge>
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-destructive"
                          onClick={() => deleteDetail("numero", n.numero_id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CORREOS */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold flex items-center gap-2 pt-2 border-t">
                    <Mail className="h-4 w-4" /> Correos Electrónicos
                  </h3>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Correo..."
                      value={newEmail.correo}
                      onChange={(e) =>
                        setNewEmail({ ...newEmail, correo: e.target.value })
                      }
                    />
                    <Select
                      value={newEmail.tipo}
                      onValueChange={(val) =>
                        setNewEmail({ ...newEmail, tipo: val })
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="personal">Personal</SelectItem>
                        <SelectItem value="empresa">Empresa</SelectItem>
                        <SelectItem value="facturacion">Factura</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      size="icon"
                      onClick={() => addDetail("correo", newEmail)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {details.correos.map((e) => (
                      <div
                        key={e.correo_id}
                        className="flex justify-between items-center p-2 bg-muted/30 rounded-md text-sm"
                      >
                        <span>
                          {e.correo}{" "}
                          <Badge variant="outline" className="ml-2 text-[10px]">
                            {e.tipo.toUpperCase()}
                          </Badge>
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-destructive"
                          onClick={() => deleteDetail("correo", e.correo_id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <WizardNavigation prev="general" next="credenciales" />
              </TabsContent>

              <TabsContent value="credenciales" className="space-y-4 mt-0">
                <div className="space-y-2">
                  <h3 className="text-sm font-bold flex items-center gap-2">
                    <Key className="h-4 w-4" /> Credenciales del Cliente
                  </h3>

                  {/* Form to Add New Credential */}
                  <div className="p-4 border rounded-md bg-muted/10 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Plataforma</Label>
                        <Select
                          value={newCred.plataforma_id}
                          onValueChange={(val) =>
                            setNewCred({ ...newCred, plataforma_id: val })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione Plataforma" />
                          </SelectTrigger>
                          <SelectContent>
                            {platforms.map((p) => (
                              <SelectItem
                                key={p.plataforma_id}
                                value={p.plataforma_id.toString()}
                              >
                                {p.plataforma_nombre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Usuario</Label>
                        <Input
                          value={newCred.cred_usuario}
                          onChange={(e) =>
                            setNewCred({
                              ...newCred,
                              cred_usuario: e.target.value,
                            })
                          }
                          placeholder="Usuario..."
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Correo</Label>
                        <Input
                          value={newCred.cred_correo}
                          onChange={(e) =>
                            setNewCred({
                              ...newCred,
                              cred_correo: e.target.value,
                            })
                          }
                          placeholder="Correo..."
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Contraseña</Label>
                        <Input
                          value={newCred.cred_contrasena}
                          onChange={(e) =>
                            setNewCred({
                              ...newCred,
                              cred_contrasena: e.target.value,
                            })
                          }
                          placeholder="Contraseña..."
                          type="text"
                        />
                      </div>
                    </div>

                    <Button
                      onClick={() => addDetail("credencial", newCred)}
                      disabled={
                        !newCred.plataforma_id ||
                        (!newCred.cred_usuario && !newCred.cred_correo)
                      }
                      className="w-full mt-2"
                      size="sm"
                    >
                      <Plus className="mr-2 h-4 w-4" /> Agregar Credencial
                    </Button>
                  </div>

                  {/* List of Added Credentials */}
                  <div className="space-y-2 mt-4">
                    {details.credenciales.map((c, idx) => (
                      <div
                        key={c.cred_id || idx}
                        className="flex justify-between items-start p-3 bg-muted/30 rounded-md border text-sm"
                      >
                        <div className="grid grid-cols-1 gap-1 flex-1">
                          <span className="font-bold flex items-center gap-2">
                            {c.plataforma_nombre}
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            <span className="text-muted-foreground">
                              User:{" "}
                              <span className="text-foreground">
                                {c.cred_usuario}
                              </span>
                            </span>
                            <span className="text-muted-foreground">
                              Pass:{" "}
                              <span className="text-foreground font-mono bg-muted px-1 rounded">
                                {c.cred_contrasena}
                              </span>
                            </span>
                            <span className="text-muted-foreground sm:col-span-2">
                              Email:{" "}
                              <span className="text-foreground">
                                {c.cred_correo}
                              </span>
                            </span>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-destructive ml-2"
                          onClick={() => deleteDetail("credencial", c.cred_id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                    {details.credenciales.length === 0 && (
                      <div className="text-center text-xs text-muted-foreground py-4 border border-dashed rounded-md">
                        No hay credenciales agregadas para este cliente.
                      </div>
                    )}
                  </div>
                </div>

                <WizardNavigation prev="contacto" next="notas" />
              </TabsContent>

              <TabsContent value="notas" className="space-y-4 mt-0">
                <div className="space-y-2">
                  <h3 className="text-sm font-bold flex items-center gap-2">
                    <FileText className="h-4 w-4" /> Diario de Notas
                  </h3>
                  <div className="flex flex-col gap-2">
                    <Textarea
                      placeholder="Agregar una nota nueva..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      rows={3}
                    />
                    <Button
                      onClick={() => addDetail("nota", { nota: newNote })}
                      disabled={!newNote}
                    >
                      Agregar Nota
                    </Button>
                  </div>
                  <div className="space-y-3 mt-4">
                    {details.notas.map((n) => (
                      <div
                        key={n.nota_id}
                        className="bg-muted/30 p-3 rounded-md border text-sm relative group"
                      >
                        <div className="text-[10px] text-muted-foreground mb-1">
                          {new Date(n.created_at).toLocaleString()}
                        </div>
                        <p className="whitespace-pre-wrap">{n.nota}</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-destructive absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => deleteDetail("nota", n.nota_id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <WizardNavigation prev="credenciales" isSave={true} />
              </TabsContent>
            </div>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
