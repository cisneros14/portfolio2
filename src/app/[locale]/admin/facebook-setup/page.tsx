"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Facebook, Copy, AlertTriangle } from "lucide-react";
import Script from "next/script";

// Declaración global para el SDK de FB
declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: any;
  }
}

export default function FacebookSetupPage() {
  const [status, setStatus] = useState<string>("Esperando SDK...");
  const [pages, setPages] = useState<any[]>([]);

  // App ID provided by user
  const FB_APP_ID = "1332884798591989";

  useEffect(() => {
    // Inicializar SDK cuando cargue
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: FB_APP_ID,
        cookie: true,
        xfbml: true,
        version: "v19.0",
      });
      setStatus("SDK Listo. Conecta tu cuenta.");
    };
  }, []);

  const handleLogin = () => {
    if (!window.FB) return;

    window.FB.login(
      function (response: any) {
        if (response.authResponse) {
          console.log("Login exitoso, buscando páginas...");
          setStatus("Conectado. Buscando páginas...");

          // Buscar páginas
          window.FB.api("/me/accounts", function (pagesResponse: any) {
            console.log("Páginas:", pagesResponse);
            if (pagesResponse && pagesResponse.data) {
              setPages(pagesResponse.data);
              setStatus("Páginas encontradas. Selecciona una.");
            } else {
              setStatus(
                "No se encontraron páginas administradas por este usuario.",
              );
            }
          });
        } else {
          console.log("User cancelled login or did not fully authorize.");
          setStatus("Login cancelado.");
        }
      },
      {
        scope: "pages_show_list,pages_manage_posts,public_profile",
      },
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Token copiado. Pégalo en tu .env.local como FB_PAGE_ACCESS_TOKEN");
  };

  return (
    <div className="space-y-6">
      <Script
        src="https://connect.facebook.net/en_US/sdk.js"
        async
        defer
        crossOrigin="anonymous"
      />

      <div>
        <h3 className="text-lg font-medium">Configuración de Facebook</h3>
        <p className="text-sm text-muted-foreground">
          Utiliza esta herramienta para obtener el Token de Acceso correcto para
          la automatización.
        </p>
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Importante</AlertTitle>
        <AlertDescription>
          El token actual parece inválido. Usa el botón de abajo para generar
          uno nuevo.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Generador de Tokens</CardTitle>
          <CardDescription>
            Inicia sesión con la cuenta que administra la página. Asegúrate de
            dar permisos a todas las páginas.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={handleLogin}
              className="bg-[#1877F2] hover:bg-[#1864D9]"
            >
              <Facebook className="mr-2 h-4 w-4" />
              Conectar con Facebook
            </Button>
            <span className="text-sm text-muted-foreground">{status}</span>
          </div>

          {pages.length > 0 && (
            <div className="mt-6 space-y-4">
              <h4 className="text-sm font-semibold">Páginas Encontradas:</h4>
              <div className="grid gap-4">
                {pages.map((page) => (
                  <div
                    key={page.id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-card"
                  >
                    <div className="overflow-hidden">
                      <p className="font-medium truncate">{page.name}</p>
                      <p className="text-xs text-muted-foreground">
                        ID: {page.id}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(page.access_token)}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copiar Token
                    </Button>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                1. Copia el token de la página.
                <br />
                2. Edita <code>.env.local</code> y pega el valor en{" "}
                <code>FB_PAGE_ACCESS_TOKEN</code>.<br />
                3. También actualiza <code>FB_PAGE_ID</code>.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
