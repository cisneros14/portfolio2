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

/**
 * Valida estrictamente una cédula de identidad ecuatoriana.
 * @param {string} cedula - El número de cédula a validar.
 * @returns {boolean} - Retorna true si es válida, false si no.
 */
function validarCedulaEcuatoriana(cedula: string) {
  // 1. Validar que no esté vacía y que sean solo números
  if (!cedula || !/^\d+$/.test(cedula)) {
    return false; // Error: Debe contener solo dígitos
  }

  // 2. Validar longitud exacta de 10 dígitos
  if (cedula.length !== 10) {
    return false; // Error: Longitud incorrecta
  }

  // 3. Validar código de provincia (dos primeros dígitos)
  // Rango estricto: 01 a 24. (Se puede incluir 30 para ecuatorianos en el exterior si se requiere)
  const codigoProvincia = parseInt(cedula.substring(0, 2), 10);
  const provinciasValidas =
    (codigoProvincia >= 1 && codigoProvincia <= 24) || codigoProvincia === 30;

  if (!provinciasValidas) {
    return false; // Error: Código de provincia inválido
  }

  // 4. Validar tercer dígito (Tipo de persona)
  // Para cédulas personales, el tercer dígito debe ser menor a 6 (0-5)
  const tercerDigito = parseInt(cedula.charAt(2), 10);
  if (tercerDigito >= 6) {
    return false; // Error: Tercer dígito inválido para persona natural (posible RUC)
  }

  // 5. Algoritmo Módulo 10 (Coeficientes: 2,1,2,1,2,1,2,1,2)
  const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  const digitoVerificador = parseInt(cedula.charAt(9), 10);
  let suma = 0;

  for (let i = 0; i < 9; i++) {
    let valor = parseInt(cedula.charAt(i), 10) * coeficientes[i];

    // Si el resultado es mayor o igual a 10, se restan 9
    if (valor >= 10) {
      valor -= 9;
    }
    suma += valor;
  }

  // Calcular dígito verificador esperado
  const modulo = suma % 10;
  const resultado = modulo === 0 ? 0 : 10 - modulo;

  // 6. Comparación final
  return resultado === digitoVerificador;
}

interface Lead {
  lead_id: number;
  lead_nombre: string;
  lead_identificacion: string;
  lead_celular: string;
  lead_correo: string;
  lead_estado: number;
  lead_calificacion: "frio" | "tibio" | "caliente";
  lead_creado_en: string;
}

interface LeadMessage {
  msj_id: number;
  msj_mensaje: string;
  msj_creado_en: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [formData, setFormData] = useState({
    lead_nombre: "",
    lead_identificacion: "",
    lead_celular: "",
    lead_correo: "",
    lead_estado: "1",
    lead_calificacion: "frio",
  });
  const [errors, setErrors] = useState({
    lead_nombre: "",
    lead_identificacion: "",
  });
  const [leadMessages, setLeadMessages] = useState<LeadMessage[]>([]);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = () => {
    setLoading(true);
    fetch("/api/leads")
      .then((res) => res.json())
      .then((data) => {
        setLeads(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching leads:", err);
        setLoading(false);
      });
  };

  const handleCreateClick = () => {
    setEditingLead(null);
    setFormData({
      lead_nombre: "",
      lead_identificacion: "",
      lead_celular: "",
      lead_correo: "",
      lead_estado: "1",
      lead_calificacion: "frio",
    });
    setErrors({
      lead_nombre: "",
      lead_identificacion: "",
    });
    setIsModalOpen(true);
  };

  const handleEditClick = (lead: Lead) => {
    setEditingLead(lead);
    setFormData({
      lead_nombre: lead.lead_nombre,
      lead_identificacion: lead.lead_identificacion || "",
      lead_celular: lead.lead_celular || "",
      lead_correo: lead.lead_correo || "",
      lead_estado: lead.lead_estado.toString(),
      lead_calificacion: lead.lead_calificacion,
    });

    setErrors({
      lead_nombre: "",
      lead_identificacion: "",
    });

    // Fetch messages
    fetch(`/api/leads/${lead.lead_id}/messages`)
      .then((res) => res.json())
      .then((data) => setLeadMessages(data))
      .catch((err) => console.error("Error fetching messages:", err));

    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este lead?")) return;

    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchLeads();
      } else {
        alert("Error al eliminar lead");
      }
    } catch (error) {
      console.error("Error deleting lead:", error);
    }
  };

  const handleSave = async () => {
    // Basic validation
    let isValid = true;
    const newErrors = {
      lead_nombre: "",
      lead_identificacion: "",
    };

    if (!formData.lead_nombre) {
      newErrors.lead_nombre = "El nombre es obligatorio";
      isValid = false;
    }

    if (formData.lead_identificacion) {
      if (!validarCedulaEcuatoriana(formData.lead_identificacion)) {
        newErrors.lead_identificacion = "Cédula inválida";
        isValid = false;
      }
    }

    setErrors(newErrors);

    if (!isValid) {
      return;
    }

    try {
      const url = editingLead
        ? `/api/leads/${editingLead.lead_id}`
        : "/api/leads";
      const method = editingLead ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchLeads();
      } else {
        const data = await res.json();
        alert(data.error || "Error al guardar lead");
      }
    } catch (error) {
      console.error("Error saving lead:", error);
    }
  };

  const filteredLeads = leads.filter(
    (lead) =>
      lead.lead_nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.lead_correo &&
        lead.lead_correo.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (lead.lead_identificacion &&
        lead.lead_identificacion.includes(searchQuery))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
          <p className="text-muted-foreground">
            Gestiona los clientes potenciales.
          </p>
        </div>
        <Button onClick={handleCreateClick}>
          <Plus className="mr-2 h-4 w-4" /> Nuevo Lead
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, correo o ID..."
            className="pl-9 bg-background"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Leads</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-10">Cargando leads...</div>
          ) : filteredLeads.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No hay leads encontrados.
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
                      Identificación
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Contacto
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Calificación
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Estado
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Creado
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {filteredLeads.map((lead) => (
                    <tr
                      key={lead.lead_id}
                      className="border-b transition-colors hover:bg-muted/50"
                    >
                      <td className="p-4 align-middle font-medium">
                        {lead.lead_id}
                      </td>
                      <td className="p-4 align-middle">{lead.lead_nombre}</td>
                      <td className="p-4 align-middle">
                        {lead.lead_identificacion || "-"}
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex flex-col text-xs">
                          <span>{lead.lead_correo}</span>
                          <span>{lead.lead_celular}</span>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <Badge
                          variant="outline"
                          className={
                            lead.lead_calificacion === "caliente"
                              ? "border-red-500 text-red-500"
                              : lead.lead_calificacion === "tibio"
                              ? "border-yellow-500 text-yellow-500"
                              : "border-blue-500 text-blue-500"
                          }
                        >
                          {lead.lead_calificacion}
                        </Badge>
                      </td>
                      <td className="p-4 align-middle">
                        <Badge
                          className={
                            lead.lead_estado === 1
                              ? "bg-green-500"
                              : "bg-gray-500"
                          }
                        >
                          {lead.lead_estado === 1 ? "Activo" : "Inactivo"}
                        </Badge>
                      </td>
                      <td className="p-4 align-middle">
                        {new Date(lead.lead_creado_en).toLocaleDateString()}
                      </td>
                      <td className="p-4 align-middle flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(lead)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteClick(lead.lead_id)}
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
              {editingLead ? "Editar Lead" : "Nuevo Lead"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={formData.lead_nombre}
                onChange={(e) => {
                  setFormData({ ...formData, lead_nombre: e.target.value });
                  if (errors.lead_nombre) {
                    setErrors({ ...errors, lead_nombre: "" });
                  }
                }}
                className={
                  errors.lead_nombre
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
                disabled={!!editingLead}
              />
              {errors.lead_nombre && (
                <p className="text-xs text-red-500">{errors.lead_nombre}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="identificacion">Identificación</Label>
              <Input
                id="identificacion"
                value={formData.lead_identificacion}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    lead_identificacion: e.target.value,
                  });
                  if (errors.lead_identificacion) {
                    setErrors({ ...errors, lead_identificacion: "" });
                  }
                }}
                maxLength={10}
                className={
                  errors.lead_identificacion
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
                disabled={!!editingLead}
              />
              {errors.lead_identificacion && (
                <p className="text-xs text-red-500">
                  {errors.lead_identificacion}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="celular">Celular</Label>
                <Input
                  id="celular"
                  value={formData.lead_celular}
                  onChange={(e) =>
                    setFormData({ ...formData, lead_celular: e.target.value })
                  }
                  disabled={!!editingLead}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.lead_correo}
                  onChange={(e) =>
                    setFormData({ ...formData, lead_correo: e.target.value })
                  }
                  disabled={!!editingLead}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="calificacion">Calificación</Label>
                <Select
                  value={formData.lead_calificacion}
                  onValueChange={(val) =>
                    setFormData({ ...formData, lead_calificacion: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="frio">Frío</SelectItem>
                    <SelectItem value="tibio">Tibio</SelectItem>
                    <SelectItem value="caliente">Caliente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Estado</Label>
                <Select
                  value={formData.lead_estado}
                  onValueChange={(val) =>
                    setFormData({ ...formData, lead_estado: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Activo</SelectItem>
                    <SelectItem value="0">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {editingLead && (
              <div className="space-y-2 pt-4 border-t">
                <Label>Mensajes</Label>
                {leadMessages.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No hay mensajes registrados.
                  </p>
                ) : (
                  <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
                    {leadMessages.map((msg) => (
                      <div
                        key={msg.msj_id}
                        className="bg-muted p-3 rounded-md text-sm space-y-1"
                      >
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>
                            {new Date(msg.msj_creado_en).toLocaleString()}
                          </span>
                        </div>
                        <p>{msg.msj_mensaje}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
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
