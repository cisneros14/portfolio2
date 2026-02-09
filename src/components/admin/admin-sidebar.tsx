"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  Megaphone,
  User,
  Settings,
  Shield,
  Briefcase,
  UserPlus,
  MapPin,
  Globe,
  PenTool,
  Share2,
  MessageSquare,
  Box,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import Image from "next/image";

import { LucideIcon } from "lucide-react";

type NavItem = {
  title: string;
  href: string;
  icon?: LucideIcon;
};

type NavGroup = {
  title: string;
  items?: NavItem[]; // If it has items, it's an accordion or group
  singleItem?: NavItem; // If it's a single detailed link
};

const navConfig: NavGroup[] = [
  {
    title: "General",
    singleItem: {
      title: "Panel de Control",
      href: "/admin",
      icon: LayoutDashboard,
    },
  },
  {
    title: "Gestión Comercial",
    items: [
      {
        title: "Cartera de Clientes",
        href: "/admin/clients",
        icon: Briefcase,
      },
      {
        title: "Prospectos (Leads)",
        href: "/admin/leads",
        icon: UserPlus,
      },
      {
        title: "Buscador en Mapa",
        href: "/admin/leads-view",
        icon: MapPin,
      },
      {
        title: "Mensajería",
        href: "/admin/messages",
        icon: MessageSquare,
      },
    ],
  },
  {
    title: "Contenido Digital",
    items: [
      {
        title: "Portafolio",
        href: "/admin/projects",
        icon: Box,
      },
      {
        title: "Entradas Blog",
        href: "/admin/blog",
        icon: Globe,
      },
      {
        title: "Categorías Blog",
        href: "/admin/categoria_blog",
        icon: PenTool,
      },
      {
        title: "Publicaciones Redes",
        href: "/admin/posts",
        icon: Share2,
      },
      {
        title: "Banco de Ideas",
        href: "/admin/ideas",
        icon: Megaphone,
      },
    ],
  },
  {
    title: "Configuración",
    items: [
      {
        title: "Servicios / Plataformas",
        href: "/admin/platforms",
        icon: Settings,
      },
      {
        title: "Equipo de Trabajo",
        href: "/admin/personal",
        icon: Shield,
      },
      {
        title: "Mi Perfil",
        href: "/admin/perfil",
        icon: User,
      },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Sidebar Trigger */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden fixed top-4 left-4 z-50"
            aria-label="Toggle Menu"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent pathname={pathname} setOpen={setOpen} />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex h-screen w-64 flex-col fixed left-0 top-0 border-r bg-background text-card-foreground z-40">
        <SidebarContent pathname={pathname} />
      </aside>
    </>
  );
}

function SidebarContent({
  pathname,
  setOpen,
}: {
  pathname: string;
  setOpen?: (open: boolean) => void;
}) {
  return (
    <div className="flex flex-col h-full bg-slate-50/50 dark:bg-background">
      <div className="h-16 flex items-center px-6 border-b bg-background">
        <Image
          className="w-24 block dark:hidden"
          src="/logo7.png"
          alt="Logo"
          width={1000}
          height={1000}
        />
        <Image
          className="w-24 hidden dark:block"
          src="/logo4.png"
          alt="Logo"
          width={1000}
          height={1000}
        />
      </div>

      <div className="flex-1 py-6 px-3 space-y-6 overflow-y-auto">
        {navConfig.map((group, idx) => (
          <div key={idx} className="space-y-2">
            {!group.singleItem && (
              <h4 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {group.title}
              </h4>
            )}

            {group.singleItem ? (
              <Link
                href={group.singleItem.href}
                onClick={() => setOpen?.(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                  pathname === group.singleItem.href
                    ? "bg-muted text-foreground font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {group.singleItem.icon && (
                  <group.singleItem.icon className="h-4 w-4" />
                )}
                {group.singleItem.title}
              </Link>
            ) : (
              <div className="space-y-1">
                {group.items?.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen?.(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      pathname === item.href
                        ? "bg-muted text-foreground font-medium"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {item.icon && <item.icon className="h-4 w-4" />}
                    {item.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 border-t bg-background">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          onClick={async () => {
            await fetch("/api/auth/logout", { method: "POST" });
            window.location.href = "/es/login";
          }}
        >
          <LogOut className="h-4 w-4" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
}
