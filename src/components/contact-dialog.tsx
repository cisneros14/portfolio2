"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Phone, Mail, Facebook, Instagram, Send } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useTranslations } from "next-intl";

// Datos de contacto - personaliza estos valores
const CONTACT_DATA = {
  whatsapp: "+1234567890", // Formato internacional sin espacios
  phone: "+1234567890",
  email: "contacto@ejemplo.com",
  facebook: "https://facebook.com/tupagina",
  instagram: "https://instagram.com/tuusuario",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getContactChannels = (t: any) => [
  {
    id: "whatsapp",
    name: t("contact_whatsapp"),
    icon: FaWhatsapp,
    href: `https://wa.me/${CONTACT_DATA.whatsapp}`,
    color: "from-green-500 to-emerald-600",
    description: "+593 939 595 776",
  },
  {
    id: "phone",
    name: t("contact_phone"),
    icon: Phone,
    href: `tel:${CONTACT_DATA.phone}`,
    color: "from-blue-500 to-cyan-600",
    description: "+593 939 595 776",
  },
  {
    id: "email",
    name: t("contact_email"),
    icon: Mail,
    href: `mailto:${CONTACT_DATA.email}`,
    color: "from-purple-500 to-pink-600",
    description: "info@agilityecuador.com",
  },
  {
    id: "facebook",
    name: t("contact_facebook"),
    icon: Facebook,
    href: CONTACT_DATA.facebook,
    color: "bg-[#0866ff]",
    description: t("contact_follow_facebook"),
  },
  {
    id: "instagram",
    name: t("contact_instagram"),
    icon: Instagram,
    href: CONTACT_DATA.instagram,
    color:
      "bg-[radial-gradient(circle_at_bottom_left,_#ffb347_0%,_#fd1d1d_45%,_#833ab4_90%)]",
    description: t("contact_follow_instagram"),
  },
];

export function ContactDialog({
  triggerClassName,
  triggerSize,
  children,
}: {
  triggerClassName?: string;
  triggerSize?: "default" | "sm" | "lg" | "icon";
  children?: ReactNode;
}) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const CONTACT_CHANNELS = getContactChannels(t);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
        >
          <Button
            size={triggerSize}
            className={cn(
              "group max-sm:w-full cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-2 !text-[0.8rem] md:!text-base sm:text-lg rounded-xl h-auto",
              triggerClassName
            )}
          >
            {children ? (
              children
            ) : (
              <>
                <Send className="h-6 w-6" />
                <span className="sr-only">Abrir canales de contacto</span>
              </>
            )}
          </Button>
        </motion.div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-background/95 border-primary/20 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            {t("contact_dialog_title")}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {t("contact_dialog_description")}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-4">
          <AnimatePresence>
            {CONTACT_CHANNELS.map((channel, index) => {
              const Icon = channel.icon;
              return (
                <motion.a
                  key={channel.id}
                  href={channel.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-lg border border-border/50 bg-card/50 p-4 transition-all duration-300 hover:border-primary/20 hover:bg-muted/20"
                  onClick={() => setOpen(false)}
                >
                  <div className="relative flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 shadow-sm transition-transform duration-300 group-hover:scale-110">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                        {channel.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {channel.description}
                      </p>
                    </div>

                    <div className="text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-foreground">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </motion.a>
              );
            })}
          </AnimatePresence>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          {t("contact_available_help")}
        </div>
      </DialogContent>
    </Dialog>
  );
}
