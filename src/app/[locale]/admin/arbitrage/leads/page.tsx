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
import { Search, ExternalLink } from "lucide-react";

interface Lead {
  id: number;
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
];

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [websiteFilter, setWebsiteFilter] = useState("ALL");
  const [minReviews, setMinReviews] = useState("");

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
    const matchesSearch = lead.business_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
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

  const handleStatusChange = async (id: number, newStatus: string) => {
    // Optimistic update
    setLeads(
      leads.map((lead) =>
        lead.id === id ? { ...lead, status: newStatus } : lead
      )
    );

    try {
      const res = await fetch(`/api/arbitrage/leads/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      // Revert on error
      fetchLeads();
      alert("Error al actualizar el estado");
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
      default:
        return <Badge variant="outline">{status}</Badge>;
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
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre..."
            className="pl-9 bg-background"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
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
          <SelectTrigger className="w-[160px]">
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
                      Maps
                    </th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {filteredLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="border-b transition-colors hover:bg-muted/50"
                    >
                      <td className="p-4 align-middle font-medium text-muted-foreground">
                        #{lead.id}
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
                          <span className="text-red-500 font-bold">
                            NO TIENE
                          </span>
                        )}
                      </td>
                      <td className="p-4 align-middle">
                        {lead.phone_number || "-"}
                      </td>
                      <td className="p-4 align-middle">
                        <Select
                          value={lead.status}
                          onValueChange={(val) =>
                            handleStatusChange(lead.id, val)
                          }
                        >
                          <SelectTrigger className="w-[140px] h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUS_OPTIONS.filter(
                              (o) => o.value !== "ALL"
                            ).map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-4 align-middle">
                        {lead.google_maps_url && (
                          <a
                            href={lead.google_maps_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground"
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
    </div>
  );
}
