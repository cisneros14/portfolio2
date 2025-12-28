"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ContactDialog } from "@/components/contact-dialog";
import { ArrowRight, Code2, Rocket, Sparkles } from "lucide-react";
import { Card } from "./ui/card";

export function BlogCTA() {
  const t = useTranslations();

  return (
    <section className="w-full relative">

      <div className="container relative mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="relative bg-background backdrop-blur-xl p-8 md:p-12 overflow-hidden">
            {/* Decorative Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12 text-center md:text-left">
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <Sparkles className="w-4 h-4" />
                  <span>{t("blog_cta_badge")}</span>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                  {t("blog_cta_title")}
                </h2>

                <p className="text-lg text-muted-foreground leading-relaxed">
                  {t("blog_cta_description")}
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                  <ContactDialog
                    triggerSize="lg"
                    triggerClassName="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-primary/25"
                  >
                    <span className="flex items-center gap-2">
                      {t("blog_cta_button")}
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  </ContactDialog>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Rocket className="w-4 h-4 text-primary" />
                      <span>Scalable</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Code2 className="w-4 h-4 text-primary" />
                      <span>Modern</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visual Element */}
              <div className="hidden md:block relative w-64 h-64 shrink-0">
                <div className="absolute inset-0 bg-linear-to-br from-primary to-blue-600 rounded-2xl opacity-20 rotate-6 blur-md" />
                <div className="absolute inset-0 bg-card border border-border rounded-2xl shadow-xl flex items-center justify-center -rotate-3 transition-transform hover:rotate-0 duration-500">
                  <div className="text-center p-6 space-y-4">
                    <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center">
                      <Code2 className="w-8 h-8 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 w-24 bg-muted rounded-full mx-auto" />
                      <div className="h-2 w-32 bg-muted rounded-full mx-auto" />
                      <div className="h-2 w-20 bg-muted rounded-full mx-auto" />
                    </div>
                    <div className="pt-4 flex justify-center gap-2">
                      <div className="h-8 w-20 bg-primary/10 rounded-lg" />
                      <div className="h-8 w-8 bg-muted rounded-lg" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
