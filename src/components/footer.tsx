"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { useTheme } from "next-themes";

export function Footer() {
  const t = useTranslations();
  const currentYear = new Date().getFullYear();
  const { theme } = useTheme();

  return (
    <footer className="w-full py-6 border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex flex-col items-center justify-center gap-4 px-4 md:py-0 mx-auto">
        <Image
          src={theme === "dark" ? "/logo4.png" : "/logo7.png"}
          alt="Agility Logo"
          width={400}
          height={400}
          className="w-24 h-auto drop-shadow-2xl"
          priority
        />
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          &copy; {currentYear} {t("footer_company")}. {t("footer_copyright")}
        </p>
      </div>
    </footer>
  );
}
