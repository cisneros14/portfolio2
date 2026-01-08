"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Eye,
  Archive,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Lead {
  id: number;
  batch_id: number | null;
  business_name: string;
  address: string;
  phone_number: string;
  google_maps_url: string;
  rating: string;
  review_count: number;
  has_website: number; // 0 or 1
  website_url: string;
  status: string;
  created_at: string;
}

const STATUS_OPTIONS = [
  { value: "ALL", label: "Todos" },
  { value: "NEW", label: "Nuevos" },
  { value: "QUALIFIED", label: "Cualificados" },
  { value: "PROTOTYPE_READY", label: "Prototipo Listo" },
  { value: "CONTACTED", label: "Contactados" },
  { value: "NEGOTIATING", label: "Negociando" },
  { value: "CLOSED_WON", label: "Ganados" },
  { value: "CLOSED_LOST", label: "Perdidos" },
  { value: "BAD_DATA", label: "Datos Erróneos" },
  { value: "ARCHIVED", label: "Archivado" },
];

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [websiteFilter, setWebsiteFilter] = useState("ALL");
  const [minReviews, setMinReviews] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showArchived, setShowArchived] = useState(false);
  const itemsPerPage = 15;

  // Dialog State
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editStatus, setEditStatus] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/arbitrage/leads");
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      lead.business_name.toLowerCase().includes(query) ||
      (lead.phone_number && lead.phone_number.toLowerCase().includes(query)) ||
      lead.id.toString().includes(query) ||
      (lead.batch_id && lead.batch_id.toString().includes(query));

    // Archiving Logic
    if (showArchived) {
      if (lead.status !== "ARCHIVED") return false;
    } else {
      if (lead.status === "ARCHIVED") return false;
    }

    const matchesStatus =
      statusFilter === "ALL" || lead.status === statusFilter;

    const matchesWebsite =
      websiteFilter === "ALL"
        ? true
        : websiteFilter === "YES"
        ? lead.has_website === 1
        : lead.has_website === 0;

    const matchesReviews =
      minReviews === "" ||
      (lead.review_count !== null && lead.review_count >= Number(minReviews));

    return matchesSearch && matchesStatus && matchesWebsite && matchesReviews;
  });

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, websiteFilter, minReviews]);

  const handleOpenDialog = (lead: Lead) => {
    setSelectedLead(lead);
    setEditStatus(lead.status);
    setEditPhone(lead.phone_number || "");
    setIsDialogOpen(true);
  };

  const handleSaveChanges = async () => {
    if (!selectedLead) return;
    setSaving(true);

    try {
      const res = await fetch(`/api/arbitrage/leads/${selectedLead.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: editStatus,
          phone_number: editPhone,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update lead");
      }

      // Update local state
      setLeads(
        leads.map((l) =>
          l.id === selectedLead.id
            ? { ...l, status: editStatus, phone_number: editPhone }
            : l
        )
      );

      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error updating lead:", error);
      alert("Error al actualizar el lead");
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NEW":
        return <Badge variant="secondary">Nuevo</Badge>;
      case "QUALIFIED":
        return <Badge className="bg-blue-500">Cualificado</Badge>;
      case "PROTOTYPE_READY":
        return <Badge className="bg-purple-500">Prototipo</Badge>;
      case "CONTACTED":
        return <Badge className="bg-yellow-500">Contactado</Badge>;
      case "CLOSED_WON":
        return <Badge className="bg-green-500">Ganado</Badge>;
      case "CLOSED_LOST":
        return <Badge variant="destructive">Perdido</Badge>;
      case "ARCHIVED":
        return (
          <Badge
            variant="outline"
            className="bg-gray-200 text-gray-800 hover:bg-gray-200"
          >
            Archivado
          </Badge>
        );
      default:
        return <Badge variant="outline">{status || "Desconocido"}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Leads (Clientes Potenciales)
          </h1>
          <p className="text-muted-foreground">
            Gestiona los negocios encontrados y su estado en el embudo de
            ventas.
          </p>
        </div>
        <Button
          variant={showArchived ? "default" : "outline"}
          onClick={() => setShowArchived(!showArchived)}
          className="gap-2"
        >
          <Archive className="h-4 w-4" />
          {showArchived ? "Ocultar Archivados" : "Archivados"}
        </Button>
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, tel, ID, lote..."
            className="pl-9 bg-background"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px] bg-background">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={websiteFilter} onValueChange={setWebsiteFilter}>
          <SelectTrigger className="w-[160px] bg-background">
            <SelectValue placeholder="Sitio Web" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos</SelectItem>
            <SelectItem value="YES">Con Web</SelectItem>
            <SelectItem value="NO">Sin Web</SelectItem>
          </SelectContent>
        </Select>
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
                      Lote
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Negocio
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Web
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Teléfono
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Estado
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {paginatedLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="border-b transition-colors hover:bg-muted/50"
                    >
                      <td className="p-4 align-middle font-medium text-muted-foreground">
                        #{lead.id}
                      </td>
                      <td className="p-4 align-middle font-medium text-muted-foreground">
                        {lead.batch_id ? `#${lead.batch_id}` : "-"}
                      </td>
                      <td className="p-4 align-middle font-medium">
                        {lead.business_name}
                      </td>
                      <td className="p-4 align-middle">
                        {lead.has_website ? (
                          <a
                            href={lead.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline flex items-center gap-1"
                          >
                            Si <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="text-red-500">NO TIENE</span>
                        )}
                      </td>
                      <td className="p-4 align-middle">
                        {lead.phone_number || "-"}
                      </td>
                      <td className="p-4 align-middle">
                        {getStatusBadge(lead.status)}
                      </td>
                      <td className="p-4 align-middle flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(lead)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {lead.google_maps_url && (
                          <a
                            href={lead.google_maps_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground p-2"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      {filteredLeads.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Mostrando{" "}
            {Math.min(
              (currentPage - 1) * itemsPerPage + 1,
              filteredLeads.length
            )}{" "}
            a {Math.min(currentPage * itemsPerPage, filteredLeads.length)} de{" "}
            {filteredLeads.length} leads
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Anterior
            </Button>
            <div className="text-sm font-medium">
              Página {currentPage} de {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Siguiente
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Lead Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Detalles del Lead</DialogTitle>
            <DialogDescription>
              Información completa del negocio. Puedes editar el estado y
              teléfono.
            </DialogDescription>
          </DialogHeader>

          {selectedLead && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-bold">Negocio</Label>
                <div className="col-span-3">{selectedLead.business_name}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-bold">Dirección</Label>
                <div className="col-span-3 text-sm text-muted-foreground">
                  {selectedLead.address || "-"}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right font-bold">
                  Teléfono
                </Label>
                <Input
                  id="phone"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right font-bold">
                  Estado
                </Label>
                <Select value={editStatus} onValueChange={setEditStatus}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-[10002]">
                    {STATUS_OPTIONS.filter((o) => o.value !== "ALL").map(
                      (option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-bold">Web</Label>
                <div className="col-span-3">
                  {selectedLead.website_url ? (
                    <a
                      href={selectedLead.website_url}
                      target="_blank"
                      className="text-blue-500 hover:underline flex items-center gap-1"
                    >
                      {selectedLead.website_url}{" "}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    "No tiene"
                  )}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-bold">Rating</Label>
                <div className="col-span-3 flex items-center gap-2">
                  <span className="font-medium">
                    {selectedLead.rating || "-"}
                  </span>
                  <span className="text-muted-foreground">
                    ({selectedLead.review_count || 0} reviews)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-bold">Google ID</Label>
                <div className="col-span-3 text-xs text-muted-foreground break-all">
                  {/* @ts-ignore */}
                  {selectedLead.google_id || "-"}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveChanges} disabled={saving}>
              {saving ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
