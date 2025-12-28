"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  LogOut,
  Menu,
  Megaphone,
  BookOpen,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";
import Image from "next/image";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
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
    <div className="flex flex-col h-full">
      <div className="h-16 flex items-center px-6 border-b">
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
      <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {sidebarItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen?.(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.title}
          </Link>
        ))}

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="usuarios" className="border-none">
            <AccordionTrigger className="px-3 py-2.5 hover:no-underline hover:bg-muted rounded-md text-sm font-medium text-muted-foreground hover:text-foreground">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5" />
                Usuarios
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-0">
              <div className="pl-10 space-y-1 mt-1">
                <Link
                  href="/admin/leads"
                  onClick={() => setOpen?.(false)}
                  className={cn(
                    "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    pathname === "/admin/leads"
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  Leads
                </Link>
                <Link
                  href="/admin/personal"
                  onClick={() => setOpen?.(false)}
                  className={cn(
                    "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    pathname === "/admin/personal"
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  Personal Admin
                </Link>
                <Link
                  href="/admin/messages"
                  onClick={() => setOpen?.(false)}
                  className={cn(
                    "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    pathname === "/admin/messages"
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  Mensajes
                </Link>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="marketing" className="border-none">
            <AccordionTrigger className="px-3 py-2.5 hover:no-underline hover:bg-muted rounded-md text-sm font-medium text-muted-foreground hover:text-foreground">
              <div className="flex items-center gap-3">
                <Megaphone className="h-5 w-5" />
                Marketing
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-0">
              <div className="pl-10 space-y-1 mt-1">
                <Link
                  href="/admin/posts"
                  onClick={() => setOpen?.(false)}
                  className={cn(
                    "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    pathname === "/admin/posts"
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  Posts Redes
                </Link>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="blog" className="border-none">
            <AccordionTrigger className="px-3 py-2.5 hover:no-underline hover:bg-muted rounded-md text-sm font-medium text-muted-foreground hover:text-foreground">
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5" />
                Blog
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-0">
              <div className="pl-10 space-y-1 mt-1">
                <Link
                  href="/admin/blog"
                  onClick={() => setOpen?.(false)}
                  className={cn(
                    "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    pathname === "/admin/blog" ||
                      pathname.startsWith("/admin/blog/")
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  Entradas Blog
                </Link>
                <Link
                  href="/admin/categoria_blog"
                  onClick={() => setOpen?.(false)}
                  className={cn(
                    "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    pathname === "/admin/categoria_blog"
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  Categorías Blog
                </Link>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Link
          key="/admin/perfil"
          href="/admin/perfil"
          onClick={() => setOpen?.(false)}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
            pathname === "/admin/perfil"
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <User className="h-5 w-5" />
          Perfil
        </Link>
      </div>
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={async () => {
            await fetch("/api/auth/logout", { method: "POST" });
            window.location.href = "/es/login";
          }}
        >
          <LogOut className="h-5 w-5" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
}
