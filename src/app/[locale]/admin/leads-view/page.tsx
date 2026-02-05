"use client";

import { useState, useEffect, useCallback } from "react";
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

import {
  Loader2,
  MapPin,
  ExternalLink,
  Calendar,
  Phone,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { FaWhatsapp } from "react-icons/fa";
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
  lead_status:
    | "NUEVO"
    | "CONTACTADO"
    | "INTERESADO"
    | "CLIENTE"
    | "RECHAZADO"
    | "EN_DESARROLLO"
    | "SIN_WHATSAPP";
  search_keyword: string;

  city_zone: string | null;
  scrapped_at: string;
  admin_notes?: string | null;
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

  // Filter State
  const [filterQ, setFilterQ] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterCountry, setFilterCountry] = useState("ALL");
  const [filterRating, setFilterRating] = useState("ALL"); // empty = all
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");

  const [availableCountries, setAvailableCountries] = useState<
    { country: string }[]
  >([]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const ITEMS_PER_PAGE = 15;

  // Dialog State
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const fetchLeads = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filterQ) params.append("q", filterQ);
      if (filterStatus && filterStatus !== "ALL")
        params.append("status", filterStatus);
      if (filterCountry && filterCountry !== "ALL")
        params.append("country", filterCountry);
      if (filterRating && filterRating !== "ALL")
        params.append("rating", filterRating);
      if (filterDateFrom) params.append("dateFrom", filterDateFrom);
      if (filterDateTo) params.append("dateTo", filterDateTo);

      // Pagination
      params.append("page", currentPage.toString());
      params.append("limit", ITEMS_PER_PAGE.toString());

      const res = await fetch(`/api/scraper?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        // Handle new response format
        if (data.leads) {
          setLeads(data.leads);
          setTotalPages(data.totalPages);
          setTotalCount(data.total);
        } else {
          // Fallback just in case, though API is updated
          setLeads(data);
        }
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  }, [
    filterQ,
    filterStatus,
    filterCountry,
    filterRating,
    filterDateFrom,
    filterDateTo,
    currentPage,
  ]);

  const fetchCountries = async () => {
    try {
      const res = await fetch("/api/scraper?meta=countries");
      if (res.ok) {
        const data = await res.json();
        setAvailableCountries(data);
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    filterQ,
    filterStatus,
    filterCountry,
    filterRating,
    filterDateFrom,
    filterDateTo,
  ]);

  useEffect(() => {
    // Debounce fetch for filters
    const timer = setTimeout(() => {
      fetchLeads();
    }, 500);
    return () => clearTimeout(timer);
  }, [fetchLeads]);

  const clearFilters = () => {
    setFilterQ("");
    setFilterStatus("ALL");
    setFilterCountry("ALL");
    setFilterRating("ALL");
    setFilterDateFrom("");
    setFilterDateTo("");
    // Page reset is handled by useEffect
  };

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
        // Refresh leads list if we inserted new ones
        if (data.inserted > 0) fetchLeads();
        // Also refresh countries if new ones might have appeared
        if (data.inserted > 0) fetchCountries();

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

  const updateLead = async (
    leadId: number,
    updates: { status?: string; admin_notes?: string; phone_number?: string },
  ) => {
    try {
      const res = await fetch("/api/scraper", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: leadId,
          ...updates,
        }),
      });

      if (res.ok) {
        // Update local state without refetching EVERYTHING
        // Update local state without refetching EVERYTHING
        setLeads((prev) =>
          prev.map((l) => {
            if (l.id !== leadId) return l;
            // Map 'status' to 'lead_status' if present
            const { status, ...otherUpdates } = updates;
            const updatedLead = { ...l, ...otherUpdates };
            if (status) updatedLead.lead_status = status as any;
            return updatedLead;
          }),
        );
        if (selectedLead && selectedLead.id === leadId) {
          setSelectedLead((prev) => {
            if (!prev) return null;
            const { status, ...otherUpdates } = updates;
            const updated = { ...prev, ...otherUpdates };
            if (status) updated.lead_status = status as any;
            return updated;
          });
        }
      } else {
        const data = await res.json();
        alert("Error al actualizar: " + (data.error || "Unknown"));
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Error de conexión al actualizar");
    }
  };

  const handleSavePhone = (newPhone: string) => {
    if (!selectedLead) return;
    const oldPhone = leads.find((l) => l.id === selectedLead.id)?.phone_number;
    let newNotes = selectedLead.admin_notes || "";

    // Only append log if the phone number in DB (oldPhone) is different from what we are saving
    // However, selectedLead.phone_number is already updated in state as user types,
    // so we need to compare against the 'committed' state in `leads` array or just trust the user intention.
    // Better: compare against leads list which acts as "server state" until updated.

    if (oldPhone && newPhone !== oldPhone) {
      const timestamp = new Date().toLocaleString();
      const log = `\n[${timestamp}] Número reemplazado: ${oldPhone || "N/A"} -> ${newPhone}`;
      newNotes += log;
      // Update selectedLead notes immediately so UI shows it
      setSelectedLead((prev) =>
        prev ? { ...prev, admin_notes: newNotes } : null,
      );
    }

    updateLead(selectedLead.id, {
      phone_number: newPhone,
      admin_notes: newNotes,
    });
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
      case "EN_DESARROLLO":
        return "default";
      case "SIN_WHATSAPP":
        return "outline";
      default:
        return "outline";
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "NUEVO":
        return "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200";
      case "CONTACTADO":
        return "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200";
      case "INTERESADO":
        return "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200";
      case "CLIENTE":
        return "bg-green-100 text-green-800 border-green-200 hover:bg-green-200";
      case "RECHAZADO":
        return "bg-red-100 text-red-800 border-red-200 hover:bg-red-200";
      case "EN_DESARROLLO":
        return "bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-200"; // Distinct from Contactado
      case "SIN_WHATSAPP":
        return "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200";
      default:
        return "";
    }
  };

  const getWhatsAppUrl = (phone: string | null) => {
    if (!phone) return null;
    // Eliminar todo lo que no sea dígito
    const cleanPhone = phone.replace(/\D/g, "");
    if (!cleanPhone) return null;
    return `https://wa.me/${cleanPhone}`;
  };

  const PaginationControls = () => (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
      <div className="text-sm text-muted-foreground order-2 sm:order-1">
        Mostrando página <span className="font-bold">{currentPage}</span> de{" "}
        <span className="font-bold">{totalPages}</span> ({totalCount}{" "}
        resultados)
      </div>
      <div className="flex items-center gap-2 order-1 sm:order-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1 || loading}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages || loading}
        >
          Siguiente
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="p-0 md:p-6 space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-xl md:text-2xl font-bold">
          Scraper de Leads sin Web (Google Places)
        </h1>

        <div className="flex flex-col gap-4 bg-card p-4 rounded-lg border shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 md:items-end">
            <div className="flex-1 space-y-2 w-full">
              <label className="text-sm font-medium">
                Término de Búsqueda (ej: &quot;Plomeros sur de Quito&quot;)
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

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
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
                  Modo Turbo (x5)
                </label>
              </div>

              <Button
                onClick={handleScanClick}
                disabled={loading || !keyword.trim()}
                className="w-full md:w-auto"
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
            <div className="flex flex-wrap gap-4 font-medium text-base">
              <span className="text-blue-600">Procesados: {stats.found}</span>
              <span className="text-green-600">
                Guardados (Sin Web): {stats.inserted}
              </span>
            </div>
            <div className="flex flex-wrap gap-4 text-muted-foreground text-xs mt-1 border-t pt-2">
              <span>
                Con Web:{" "}
                <strong className="text-red-500">
                  {stats.rejection_stats?.website || 0}
                </strong>
              </span>
              <span>
                Rating bajo:{" "}
                <strong>{stats.rejection_stats?.rating || 0}</strong>
              </span>
              <span>
                Cerrados: <strong>{stats.rejection_stats?.status || 0}</strong>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* FILTER CARD */}
      <div className="flex flex-col gap-4 bg-card p-4 rounded-lg border shadow-sm">
        <h2 className="text-sm font-semibold uppercase text-muted-foreground">
          Filtros de Leads
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* 1. Global Search */}
          <div className="space-y-1">
            <label className="text-xs font-medium">Búsqueda General</label>
            <Input
              placeholder="Buscar..."
              value={filterQ}
              onChange={(e) => setFilterQ(e.target.value)}
              className="h-9"
            />
          </div>

          {/* 2. Status */}
          <div className="space-y-1">
            <label className="text-xs font-medium">Estado</label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos</SelectItem>
                <SelectItem
                  value="NUEVO"
                  className={getStatusBadgeClass("NUEVO")}
                >
                  NUEVO
                </SelectItem>
                <SelectItem
                  value="CONTACTADO"
                  className={getStatusBadgeClass("CONTACTADO")}
                >
                  CONTACTADO
                </SelectItem>
                <SelectItem
                  value="INTERESADO"
                  className={getStatusBadgeClass("INTERESADO")}
                >
                  INTERESADO
                </SelectItem>
                <SelectItem
                  value="CLIENTE"
                  className={getStatusBadgeClass("CLIENTE")}
                >
                  CLIENTE
                </SelectItem>
                <SelectItem
                  value="RECHAZADO"
                  className={getStatusBadgeClass("RECHAZADO")}
                >
                  RECHAZADO
                </SelectItem>
                <SelectItem
                  value="EN_DESARROLLO"
                  className={getStatusBadgeClass("EN_DESARROLLO")}
                >
                  EN_DESARROLLO
                </SelectItem>
                <SelectItem
                  value="SIN_WHATSAPP"
                  className={getStatusBadgeClass("SIN_WHATSAPP")}
                >
                  SIN_WHATSAPP
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 3. Date Range (Simplified) */}
          <div className="space-y-1">
            <label className="text-xs font-medium">Fecha (Desde)</label>
            <Input
              type="date"
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)}
              className="h-9"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium">Fecha (Hasta)</label>
            <Input
              type="date"
              value={filterDateTo}
              onChange={(e) => setFilterDateTo(e.target.value)}
              className="h-9"
            />
          </div>

          {/* 4. Rating */}
          <div className="space-y-1">
            <label className="text-xs font-medium">Rating Mínimo</label>
            <Select value={filterRating} onValueChange={setFilterRating}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Cualquiera" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Cualquiera</SelectItem>
                <SelectItem value="1">1+ estrellas</SelectItem>
                <SelectItem value="5">5+ estrellas</SelectItem>
                <SelectItem value="10">10+ estrellas</SelectItem>
                <SelectItem value="50">50+ estrellas</SelectItem>
                <SelectItem value="100">100+ estrellas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 5. Country */}
          <div className="space-y-1">
            <label className="text-xs font-medium">País</label>
            <Select value={filterCountry} onValueChange={setFilterCountry}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos</SelectItem>
                {availableCountries.map((c) => (
                  <SelectItem key={c.country} value={c.country}>
                    {c.country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="w-full text-muted-foreground hover:text-foreground border border-dashed"
              disabled={
                !filterQ &&
                filterStatus === "ALL" &&
                filterCountry === "ALL" &&
                filterRating === "ALL" &&
                !filterDateFrom &&
                !filterDateTo
              }
            >
              Limpiar Filtros
            </Button>
          </div>
        </div>
      </div>

      <PaginationControls />

      <div className="rounded-md border w-full max-w-[95vw] md:max-w-full">
        <div className="overflow-x-auto">
          <Table className="min-w-[800px]">
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
                    <TableCell className="font-medium max-w-[200px]">
                      <div className="truncate" title={lead.business_name}>
                        {lead.business_name}
                      </div>
                      <div
                        className="text-xs text-muted-foreground truncate"
                        title={lead.address || ""}
                      >
                        {lead.address}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="whitespace-nowrap">
                          {lead.phone_number || "-"}
                        </span>
                        {lead.phone_number && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-green-600 hover:text-green-700 hover:bg-green-100 shrink-0"
                            onClick={(e) => {
                              e.stopPropagation(); // Evitar abrir modal
                              const url = getWhatsAppUrl(lead.phone_number);
                              if (url) window.open(url, "_blank");
                            }}
                          >
                            <FaWhatsapp className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 min-w-[80px]">
                        <span className="font-bold">{lead.rating_count}</span>
                        <span className="text-xs text-muted-foreground">
                          reviews
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getStatusBadgeVariant(lead.lead_status) as any}
                        className={getStatusBadgeClass(lead.lead_status)}
                      >
                        {lead.lead_status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[150px] truncate">
                      <span title={lead.search_keyword}>
                        {lead.search_keyword}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <PaginationControls />

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
                    variant={
                      getStatusBadgeVariant(selectedLead.lead_status) as any
                    }
                    className={getStatusBadgeClass(selectedLead.lead_status)}
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
                        updateLead(selectedLead.id, { status: val })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          value="NUEVO"
                          className={getStatusBadgeClass("NUEVO")}
                        >
                          NUEVO
                        </SelectItem>
                        <SelectItem
                          value="CONTACTADO"
                          className={getStatusBadgeClass("CONTACTADO")}
                        >
                          CONTACTADO
                        </SelectItem>
                        <SelectItem
                          value="INTERESADO"
                          className={getStatusBadgeClass("INTERESADO")}
                        >
                          INTERESADO
                        </SelectItem>
                        <SelectItem
                          value="CLIENTE"
                          className={getStatusBadgeClass("CLIENTE")}
                        >
                          CLIENTE
                        </SelectItem>
                        <SelectItem
                          value="RECHAZADO"
                          className={getStatusBadgeClass("RECHAZADO")}
                        >
                          RECHAZADO
                        </SelectItem>
                        <SelectItem
                          value="EN_DESARROLLO"
                          className={getStatusBadgeClass("EN_DESARROLLO")}
                        >
                          EN_DESARROLLO
                        </SelectItem>
                        <SelectItem
                          value="SIN_WHATSAPP"
                          className={getStatusBadgeClass("SIN_WHATSAPP")}
                        >
                          SIN_WHATSAPP
                        </SelectItem>
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
                  <div className="flex gap-2 items-center">
                    <Input
                      value={selectedLead.phone_number || ""}
                      onChange={(e) =>
                        setSelectedLead({
                          ...selectedLead,
                          phone_number: e.target.value,
                        })
                      }
                      className="font-mono h-9"
                      placeholder="Sin teléfono"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      title="Guardar Teléfono"
                      onClick={() =>
                        handleSavePhone(selectedLead.phone_number || "")
                      }
                    >
                      <span className="sr-only">Guardar</span>
                      💾
                    </Button>

                    {selectedLead.phone_number && (
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                        title="Abrir WhatsApp"
                        onClick={() => {
                          const url = getWhatsAppUrl(selectedLead.phone_number);
                          if (url) window.open(url, "_blank");
                        }}
                      >
                        <FaWhatsapp className="h-4 w-4" />
                        {/* Chat text removed to save space or keep it? Original had Chat text. Let's keep icon only for consistency/space or add text if needed. User asked to edit input. */}
                      </Button>
                    )}
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
                        updateLead(selectedLead.id, {
                          admin_notes: selectedLead.admin_notes || "",
                        })
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
