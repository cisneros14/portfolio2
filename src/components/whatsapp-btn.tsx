"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { FaWhatsapp } from "react-icons/fa";

export default function WhatsappBtn() {
  const pathname = usePathname();
  const isEnglish = pathname.startsWith("/en");

  const phone = "593939595776"; // solo números, sin +
  const message = isEnglish
    ? "Hello, I would like more information about..."
    : "Hola, quisiera más información sobre ...";

  const href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-5 right-3 z-[1000] inline-flex items-center justify-center rounded-md border border-green-400 bg-green-500 p-3 shadow-lg transition-transform hover:scale-110"
    >
      <FaWhatsapp className="h-6 w-6 text-white" />
    </a>
  );
}
