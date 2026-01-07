"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, CheckCircle, AlertTriangle } from "lucide-react";

export default function ScraperPage() {
  const [query, setQuery] = useState("");
  const [maxResults, setMaxResults] = useState("20");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    total: number;
    saved: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScrape = async () => {
    if (!query) {
      setError("Por favor ingresa un término de búsqueda.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/arbitrage/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          maxResults: parseInt(maxResults),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setResult(data.data);
      } else {
        setError(data.error || "Error al ejecutar el scraper.");
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Google Maps Scraper
        </h1>
        <p className="text-muted-foreground">
          Busca y extrae leads directamente desde Google Maps.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Configuración de Búsqueda</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="query">
                Término de Búsqueda (Nicho + Ciudad)
              </Label>
              <Input
                id="query"
                placeholder="Ej. Plomeros en Miami"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxResults">Máximo de Resultados</Label>
              <Input
                id="maxResults"
                type="number"
                placeholder="20"
                value={maxResults}
                onChange={(e) => setMaxResults(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Recomendado: 20-50 para evitar bloqueos y timeouts.
              </p>
            </div>

            <Button
              className="w-full"
              onClick={handleScrape}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Ejecutando Scraper...
                </>
              ) : (
                "Iniciar Búsqueda"
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Estado</CardTitle>
            </CardHeader>
            <CardContent>
              {loading && (
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <p className="text-muted-foreground">
                    El scraper está navegando en Google Maps...
                    <br />
                    Esto puede tomar unos minutos.
                  </p>
                </div>
              )}

              {!loading && !result && !error && (
                <div className="text-center py-8 text-muted-foreground">
                  Listo para iniciar. Los resultados se guardarán
                  automáticamente en la base de datos.
                </div>
              )}

              {result && (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800">
                    ¡Búsqueda Completada!
                  </AlertTitle>
                  <AlertDescription className="text-green-700">
                    Se encontraron <strong>{result.total}</strong> resultados.
                    <br />
                    Se guardaron <strong>{result.saved}</strong> nuevos leads en
                    la base de datos.
                  </AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card className="bg-blue-50/50 border-blue-100">
            <CardContent className="pt-6">
              <h4 className="font-semibold text-blue-900 mb-2">
                Notas Importantes:
              </h4>
              <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
                <li>El navegador se ejecutará en segundo plano (headless).</li>
                <li>
                  Si la búsqueda tarda más de 60 segundos, podría haber un
                  timeout del servidor.
                </li>
                <li>
                  Los leads duplicados (por URL de Maps) podrían ser ignorados
                  si ya existen.
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
