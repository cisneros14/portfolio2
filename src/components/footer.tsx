"use client"

import { useTranslations } from "next-intl"

export function Footer() {
    const t = useTranslations()
    const currentYear = new Date().getFullYear()

    return (
        <footer className="w-full py-6 mt-12 border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex flex-col items-center justify-center gap-4 px-4 md:h-16 md:flex-row md:py-0 mx-auto">
                <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                    &copy; {currentYear} {t("footer_company")}. {t("footer_copyright")}
                </p>
            </div>
        </footer>
    )
}
