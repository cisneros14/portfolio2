"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, MapPin, ExternalLink, Calendar, Phone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
// import { format } from "date-fns";
// import { es } from "date-fns/locale";

// Types matching DB
interface Lead {
  id: number;
  google_place_id: string;
  business_name: string;
  phone_number: string | null;
  address: string | null;
  rating_count: number;
  business_type: string | null;
  business_status: string;
  lead_status: "NUEVO" | "CONTACTADO" | "INTERESADO" | "CLIENTE" | "RECHAZADO";
  search_keyword: string;
  city_zone: string | null;
  scrapped_at: string;
}

export default function LeadsViewPage() {
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<{
    found?: number;
    filtered_valid?: number;
    inserted?: number;
    rejection_stats?: { website: number; status: number; rating: number };
  } | null>(null);

  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [deepScan, setDeepScan] = useState(false);
  const [currentScanPage, setCurrentScanPage] = useState(0);

  // Dialog State
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/scraper");
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const performScan = async (searchToken?: string, isInitial = true) => {
    if (!keyword.trim()) return;

    if (isInitial) {
      setLoading(true);
      setStats(null);
      setCurrentScanPage(1);
    }

    try {
      const res = await fetch("/api/scraper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          search_keyword: keyword,
          pageToken: searchToken,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setStats((prev) => {
          const currentFound = data.found || 0;
          const currentValid = data.filtered_valid || 0;
          const currentInserted = data.inserted || 0;
          const rejStats = data.rejection_stats || {
            website: 0,
            status: 0,
            rating: 0,
          };

          if (!isInitial && prev) {
            return {
              found: (prev.found || 0) + currentFound,
              filtered_valid: (prev.filtered_valid || 0) + currentValid,
              inserted: (prev.inserted || 0) + currentInserted,
              rejection_stats: {
                website:
                  (prev.rejection_stats?.website || 0) + rejStats.website,
                status: (prev.rejection_stats?.status || 0) + rejStats.status,
                rating: (prev.rejection_stats?.rating || 0) + rejStats.rating,
              },
            };
          }
          return {
            found: currentFound,
            filtered_valid: currentValid,
            inserted: currentInserted,
            rejection_stats: rejStats,
          };
        });

        setNextPageToken(data.nextPageToken || null);
        await fetchLeads();

        if (
          deepScan &&
          data.nextPageToken &&
          (isInitial ? 1 : currentScanPage + 1) <= 5
        ) {
          setCurrentScanPage((prev) => prev + 1);
          await performScan(data.nextPageToken, false);
        } else {
          setLoading(false);
        }
      } else {
        alert("Error: " + (data.error || "Unknown error"));
        setLoading(false);
      }
    } catch (error) {
      console.error("Scan error:", error);
      alert("Error al escanear");
      setLoading(false);
    }
  };

  const handleScanClick = () => {
    performScan();
  };

  const updateLeadStatus = async (leadId: number, newStatus: string) => {
    try {
      const res = await fetch("/api/scraper", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: leadId, status: newStatus }),
      });

      if (res.ok) {
        // Update local state without refetching EVERYTHING
        setLeads((prev) =>
          prev.map((l) =>
            l.id === leadId ? { ...l, lead_status: newStatus as any } : l,
          ),
        );
        if (selectedLead && selectedLead.id === leadId) {
          setSelectedLead((prev) =>
            prev ? { ...prev, lead_status: newStatus as any } : null,
          );
        }
      } else {
        alert("Error updating status");
      }
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const getStatusBadgeVariant = (
    status: string,
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "NUEVO":
        return "secondary";
      case "CONTACTADO":
        return "secondary";
      case "INTERESADO":
        return "outline";
      case "CLIENTE":
        return "default";
      case "RECHAZADO":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">
          Buscador de Leads sin Web (Google Places)
        </h1>

        <div className="flex flex-col gap-4 bg-card p-4 rounded-lg border shadow-sm">
          <div className="flex gap-4 items-end">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">
                Término de Búsqueda (ej: "Plomeros sur de Quito")
              </label>
              <Input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Escribe el nicho y la ciudad..."
                disabled={loading}
                onKeyDown={(e) =>
                  e.key === "Enter" && !loading && handleScanClick()
                }
              />
            </div>

            <div className="flex items-center gap-2 pb-2">
              <input
                type="checkbox"
                id="deepScan"
                checked={deepScan}
                onChange={(e) => setDeepScan(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
                disabled={loading}
              />
              <label
                htmlFor="deepScan"
                className="text-sm cursor-pointer select-none"
              >
                Modo Turbo (Buscar en 5 páginas)
              </label>
            </div>

            <Button
              onClick={handleScanClick}
              disabled={loading || !keyword.trim()}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                  {deepScan
                    ? `Escaneando Pág ${currentScanPage}...`
                    : "Escaneando..."}
                </>
              ) : deepScan ? (
                "Iniciar Turbo Scan"
              ) : (
                "Escanear"
              )}
            </Button>
          </div>

          {nextPageToken && !loading && !deepScan && (
            <Button
              variant="secondary"
              onClick={() => performScan(nextPageToken, false)}
              className="w-full"
            >
              Cargar siguientes 20 resultados
            </Button>
          )}
        </div>

        {stats && (
          <div className="flex flex-col gap-2 bg-muted/50 p-4 rounded-md text-sm">
            <div className="flex gap-6 font-medium text-base">
              <span className="text-blue-600">Procesados: {stats.found}</span>
              <span className="text-green-600">
                Guardados (Sin Web): {stats.inserted}
              </span>
            </div>
            <div className="flex gap-4 text-muted-foreground text-xs mt-1 border-t pt-2">
              <span>
                Descartados por tener Web:{" "}
                <strong className="text-red-500">
                  {stats.rejection_stats?.website || 0}
                </strong>
              </span>
              <span>
                Descartados por Rating bajo:{" "}
                <strong>{stats.rejection_stats?.rating || 0}</strong>
              </span>
              <span>
                Descartados por Estado (Cerrado):{" "}
                <strong>{stats.rejection_stats?.status || 0}</strong>
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Origen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center h-24 text-muted-foreground"
                >
                  No hay leads registrados aún. Intenta buscar algo.
                </TableCell>
              </TableRow>
            ) : (
              leads.map((lead) => (
                <TableRow
                  key={lead.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedLead(lead)}
                >
                  <TableCell className="font-medium">
                    <div>{lead.business_name}</div>
                    <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                      {lead.address}
                    </div>
                  </TableCell>
                  <TableCell>{lead.phone_number || "-"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="font-bold">{lead.rating_count}</span>
                      <span className="text-xs text-muted-foreground">
                        reviews
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(lead.lead_status)}>
                      {lead.lead_status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {lead.search_keyword}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={!!selectedLead}
        onOpenChange={(open) => !open && setSelectedLead(null)}
      >
        <DialogContent className="sm:max-w-[600px]">
          {selectedLead && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl flex items-center gap-2">
                  {selectedLead.business_name}
                  <Badge
                    variant={getStatusBadgeVariant(selectedLead.lead_status)}
                  >
                    {selectedLead.lead_status}
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  Descubierto el{" "}
                  {new Date(selectedLead.scrapped_at).toLocaleString("es-ES", {
                    dateStyle: "long",
                    timeStyle: "short",
                  })}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground uppercase">
                      Estado del Lead
                    </label>
                    <Select
                      value={selectedLead.lead_status}
                      onValueChange={(val) =>
                        updateLeadStatus(selectedLead.id, val)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NUEVO">NUEVO</SelectItem>
                        <SelectItem value="CONTACTADO">CONTACTADO</SelectItem>
                        <SelectItem value="INTERESADO">INTERESADO</SelectItem>
                        <SelectItem value="CLIENTE">CLIENTE</SelectItem>
                        <SelectItem value="RECHAZADO">RECHAZADO</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground uppercase">
                      Rating
                    </label>
                    <div className="flex items-center gap-2 text-sm border p-2 rounded-md h-9">
                      <span className="font-bold">
                        {selectedLead.rating_count}
                      </span>{" "}
                      reseñas
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1">
                    <Phone className="w-3 h-3" /> Teléfono
                  </label>
                  <div className="text-sm font-mono border p-2 rounded-md bg-muted/30">
                    {selectedLead.phone_number || "No disponible"}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Dirección
                  </label>
                  <div className="text-sm border p-2 rounded-md bg-muted/30">
                    {selectedLead.address || "No disponible"}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Keyword Original
                  </label>
                  <div className="text-sm border p-2 rounded-md bg-muted/30">
                    {selectedLead.search_keyword}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1">
                    Notas del Administrador
                  </label>
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Escribe notas aquí... (guardado en clic)"
                      value={selectedLead.admin_notes || ""}
                      onChange={(e) =>
                        setSelectedLead({
                          ...selectedLead,
                          admin_notes: e.target.value,
                        })
                      }
                      className="bg-background text-sm"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      title="Guardar Nota"
                      onClick={() =>
                        updateLeadStatus(
                          selectedLead.id,
                          selectedLead.lead_status,
                          selectedLead.admin_notes,
                        )
                      }
                    >
                      <span className="sr-only">Guardar</span>
                      💾
                    </Button>
                  </div>
                </div>

                <div className="pt-2">
                  <Button className="w-full" variant="outline" asChild>
                    <a
                      href={`https://www.google.com/maps/place/?q=place_id:${selectedLead.google_place_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MapPin className="mr-2 h-4 w-4 text-red-500" />
                      Ver Ficha en Google Maps
                      <ExternalLink className="ml-2 h-3 w-3 opacity-50" />
                    </a>
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
