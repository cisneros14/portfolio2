"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";


interface Message {
  msj_id: number;
  msj_mensaje: string;
  msj_creado_en: string;
  lead_id: number;
  lead_nombre: string;
  lead_identificacion: string;
  lead_correo: string;
  lead_celular: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = () => {
    setLoading(true);
    fetch("/api/messages")
      .then((res) => res.json())
      .then((data) => {
        setMessages(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching messages:", err);
        setLoading(false);
      });
  };

  const filteredMessages = messages.filter((msg) =>
    msg.lead_nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.lead_identificacion.includes(searchQuery) ||
    msg.msj_mensaje.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mensajes</h1>
          <p className="text-muted-foreground">Bandeja de entrada de formularios de contacto.</p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, cédula o mensaje..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Mensajes</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-10">Cargando mensajes...</div>
          ) : filteredMessages.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No hay mensajes encontrados.
            </div>
          ) : (
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Fecha</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Lead</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Contacto</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Mensaje</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {filteredMessages.map((msg) => (
                    <tr key={msg.msj_id} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-4 align-middle whitespace-nowrap">
                        {new Date(msg.msj_creado_en).toLocaleString()}
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex flex-col">
                          <span className="font-medium">{msg.lead_nombre}</span>
                          <span className="text-xs text-muted-foreground">ID: {msg.lead_identificacion}</span>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex flex-col text-xs">
                          <span>{msg.lead_correo}</span>
                          <span>{msg.lead_celular}</span>
                        </div>
                      </td>
                      <td className="p-4 align-middle max-w-md truncate" title={msg.msj_mensaje}>
                        {msg.msj_mensaje}
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
