"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Rocket,
  Target,
  ShoppingBag,
  Zap,
  Settings,
  TrendingUp,
  Wrench,
  ArrowRight,
} from "lucide-react";
import { ContactDialog } from "@/components/contact-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Función para obtener datos de servicios con traducciones
const getServicesData = (t: any) => [
  {
    title: t("services_data.landing_pages.title"),
    description: t("services_data.landing_pages.description"),
    icon: Rocket,
  },
  {
    title: t("services_data.strategic_websites.title"),
    description: t("services_data.strategic_websites.description"),
    icon: Target,
  },
  {
    title: t("services_data.ecommerce.title"),
    description: t("services_data.ecommerce.description"),
    icon: ShoppingBag,
  },
  {
    title: t("services_data.automation.title"),
    description: t("services_data.automation.description"),
    icon: Zap,
  },
  {
    title: t("services_data.custom_systems.title"),
    description: t("services_data.custom_systems.description"),
    icon: Settings,
  },
  {
    title: t("services_data.conversion_optimization.title"),
    description: t("services_data.conversion_optimization.description"),
    icon: TrendingUp,
  },
  {
    title: t("services_data.tool_integration.title"),
    description: t("services_data.tool_integration.description"),
    icon: Wrench,
  },
];

type ServiceType = {
  title: string;
  description: string;
  icon: any;
};

function ServiceCard({
  service,
  index,
}: {
  service: ServiceType;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="group relative h-full">
        <div className="relative h-full rounded-2xl p-5 sm:p-6 bg-background lg:p-8 border border-border/50 hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md">
          <div className="flex flex-col md:flex-row items-start gap-4 lg:gap-5">
            <div className="flex-shrink-0">
              <div
                className={cn(
                  "w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl bg-primary/10 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300"
                )}
              >
                <service.icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-primary" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-foreground mb-2 sm:mb-3 transition-colors duration-300 leading-snug">
                {service.title}
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function ServicesSection() {
  // We need to pass t from parent or useTranslations hook if we want to keep it self-contained.
  // But page.tsx passes t to other sections. Here ServicesSection uses useTranslations() inside.
  // Wait, in page.tsx: function ServicesSection() { const t = useTranslations(); ... }
  // So I should import useTranslations.
  // But useTranslations is from next-intl.
  // I'll check imports in page.tsx.

  // Actually, I'll modify ServicesSection to accept t as a prop like others, or import useTranslations.
  // The original code used useTranslations().
  // I'll import useTranslations from "next-intl".

  const { useTranslations } = require("next-intl");
  const t = useTranslations();

  return (
    <div id="servicios" className="scroll-mt-24">
      <div className="text-center mb-10 sm:mb-12 lg:mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Badge
            variant="outline"
            className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-medium bg-background/80 backdrop-blur-sm border-primary/20 shadow-sm text-muted-foreground mb-5 sm:mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
            {t("services_badge")}
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-4 sm:mb-5 lg:mb-6 px-4 leading-tight">
            {t("services_title_part1")}{" "}
            <span className="text-primary">{t("services_title_part2")}</span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-3xl mx-auto px-4 leading-relaxed">
            {t("services_description")}
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 max-w-7xl mx-auto">
        {getServicesData(t).map((service: any, index: number) => (
          <ServiceCard key={service.title} service={service} index={index} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-center mt-12 sm:mt-16 lg:mt-20"
      >
        <div className="inline-flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center px-4 w-full sm:w-auto">
          <ContactDialog
            triggerSize="lg"
            triggerClassName="group bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base lg:text-lg rounded-xl flex items-center justify-center w-full sm:w-auto"
          >
            {t("request_quote")}
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3 group-hover:translate-x-1 transition-transform duration-200" />
          </ContactDialog>
          <Button
            asChild
            size="lg"
            className="group w-full sm:w-auto border border-primary bg-transparent hover:bg-primary/20 text-foreground shadow-lg hover:shadow-xl transition-all duration-300 px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base lg:text-lg rounded-xl h-auto"
          >
            <a
              href="#projects"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 sm:gap-3"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              {t("view_latest_project")}
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </a>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
