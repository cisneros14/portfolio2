"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
  const t = useTranslations();
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();
  const currentLocale = pathname.split("/")[1];
  const localePrefix = ["es", "en"].includes(currentLocale)
    ? `/${currentLocale}`
    : "";

  return (
    <footer className="w-full py-6 border-t border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex flex-col items-center justify-center gap-4 px-4 md:py-0 mx-auto">
        <Image
          src="/logo7.png"
          alt="Agility Logo"
          width={400}
          height={400}
          className="w-24 h-auto drop-shadow-2xl block dark:hidden"
          priority
        />
        <Image
          src="/logo4.png"
          alt="Agility Logo"
          width={400}
          height={400}
          className="w-24 h-auto drop-shadow-2xl hidden dark:block"
          priority
        />
        <div className="flex flex-col items-center gap-2 md:flex-row md:gap-4">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {currentYear} {t("footer_company")}. {t("footer_copyright")}
          </p>
          <Link
            href={`${localePrefix}/politica-de-privacidad`}
            className="text-sm text-muted-foreground hover:text-foreground hover:underline transition-colors"
          >
            {t("footer_privacy_policy")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
