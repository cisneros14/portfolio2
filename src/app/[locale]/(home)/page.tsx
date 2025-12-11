"use client";
import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, ShoppingBag, Rocket } from "lucide-react";
import { useTranslations } from "next-intl";

import Link from "next/link";
import { useRouter } from "next/navigation";

import React from "react";

import Image from "next/image";
import { ContactDialog } from "@/components/contact-dialog";

import ProcessTimeline from "@/components/timeline";

import dynamic from "next/dynamic";

const ContactSection = dynamic(
  () =>
    import("@/components/contact-section").then((mod) => mod.ContactSection),
  { ssr: false }
);

function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}
const ProjectsSection = dynamic(
  () =>
    import("@/components/projects-section").then((mod) => mod.ProjectsSection),
  { ssr: false }
);

const AboutExperienceSection = dynamic(
  () =>
    import("@/components/about-experience-section").then(
      (mod) => mod.AboutExperienceSection
    ),
  { ssr: false }
);

const TechnologiesSection = dynamic(
  () =>
    import("@/components/technologies-section").then(
      (mod) => mod.TechnologiesSection
    ),
  { ssr: false }
);

const ServicesSection = dynamic(
  () =>
    import("@/components/services-section").then((mod) => mod.ServicesSection),
  { ssr: false }
);

const MetricsSection = dynamic(
  () =>
    import("@/components/metrics-section").then((mod) => mod.MetricsSection),
  { ssr: false }
);

function HeroSection({
  t,
  itemVariants,
  containerVariants,
}: {
  t: any;
  itemVariants: any;
  containerVariants: any;
}) {
  return (
    <div id="hero" className="scroll-mt-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left Column: Content */}
        <motion.div
          className="flex flex-col items-start text-left order-2 lg:order-1"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-6">
            <Badge
              variant="outline"
              className="!text-wrap items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-[0.7rem] sm:text-xs font-medium bg-background backdrop-blur-sm border-primary/20 shadow-sm text-muted-foreground max-w-full inline-flex"
            >
              <Sparkles className="min-w-3.5 min-h-3.5 max-w-3.5 max-h-3.5 sm:min-w-4 sm:min-h-4 sm:max-w-4 sm:max-h-4 text-primary" />
              {t("available_projects")}
            </Badge>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-foreground mb-6 leading-[1.1]">
              {t("role")}
              <span className="text-primary ml-2">{t("role2")}</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              {t("hero_description")}
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 mt-2 w-full sm:w-auto"
          >
            <ContactDialog
              triggerSize="lg"
              triggerClassName="group bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-3 text-base lg:text-lg rounded-xl flex items-center justify-center w-full sm:w-auto"
            >
              {t("request_quote")}
              <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-200" />
            </ContactDialog>
            <Button
              asChild
              size="lg"
              className="group w-full sm:w-auto border border-primary bg-transparent hover:bg-primary/20 text-foreground shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-3 text-base lg:text-lg rounded-xl h-auto"
            >
              <a
                href="#projects"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3"
              >
                <ShoppingBag className="w-5 h-5" />
                {t("view_latest_project")}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </a>
            </Button>
          </motion.div>
        </motion.div>

        {/* Right Column: Visual */}
        <div className="relative order-1 lg:order-2 flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[400px] lg:max-w-[500px] aspect-square flex items-center justify-center">
            <div className="absolute inset-0 rounded-full pointer-events-none opacity-20 dark:opacity-10 bg-primary/20 blur-3xl" />
            <Image
              className="w-74 lg:w-100 h-auto drop-shadow-2xl block dark:hidden"
              src="/logo6.png"
              alt="Agility Logo"
              width={400}
              height={400}
              priority
              fetchPriority="high"
            />
            <Image
              className="w-74 lg:w-100 h-auto drop-shadow-2xl hidden dark:block"
              src="/logo5.png"
              alt="Agility Logo"
              width={400}
              height={400}
              priority
              fetchPriority="high"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProcessSection() {
  const t = useTranslations();

  return (
    <div id="proceso" className="scroll-mt-24">
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
            <Rocket className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
            {t("process.badge")}
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-4 sm:mb-5 lg:mb-6 px-4 leading-tight">
            {t("process.title_part1")}{" "}
            <span className="text-primary">{t("process.title_part2")}</span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-3xl mx-auto px-4 leading-relaxed">
            {t("process.description")}
          </p>
        </motion.div>
      </div>

      <ProcessTimeline />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-center mt-12 sm:mt-16 lg:mt-20"
      >
        <div className="bg-background rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 border border-border/50 shadow-sm">
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-3 sm:mb-4 px-4 leading-tight">
            {t("process.cta_title")}
          </h3>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-4 leading-relaxed">
            {t("process.cta_description")}
          </p>
          <div className="inline-flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center px-4 w-full sm:w-auto">
            <ContactDialog
              triggerSize="lg"
              triggerClassName="group bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base lg:text-lg rounded-xl flex items-center justify-center w-full sm:w-auto"
            >
              {t("request_quote")}
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3 group-hover:translate-x-1 transition-transform duration-200" />
            </ContactDialog>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function HeroGeometric() {
  const t = useTranslations();
  const router = useRouter();

  // Scroll transformations
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const currentLocale =
    typeof window !== "undefined"
      ? window.location.pathname.split("/")[1]
      : "es";

  const handleLanguageSwitch = () => {
    const newLocale = currentLocale === "es" ? "en" : "es";
    const restPath = window.location.pathname.split("/").slice(2).join("/");
    router.push(`/${newLocale}${restPath ? "/" + restPath : ""}`);
  };

  return (
    <div className="relative space-y-48">
      {/* Background shapes - Simplified */}
      <div className="inset-0 overflow-x-hidden fixed z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/40 via-transparent to-transparent" />
      </div>

      {/* Main content */}
      <div className="relative z-10 space-y-48">
        <HeroSection
          t={t}
          itemVariants={itemVariants}
          containerVariants={containerVariants}
        />

        <AboutExperienceSection t={t} itemVariants={itemVariants} />
        <ProjectsSection t={t} itemVariants={itemVariants} />
        <ServicesSection />
        <ProcessSection />
        <MetricsSection />
        <TechnologiesSection t={t} itemVariants={itemVariants} />
        <ContactSection />
      </div>
    </div>
  );
}
