"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Code2,
  Server,
  Mail,
  Github,
  Linkedin,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  Zap,
  Database,
  Globe,
  MapPin,
  Component,
  Package,
  MailIcon,
  Languages,
  Rocket,
  Target,
  Settings,
  TrendingUp,
  Wrench,
  Headphones,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Dock,
  DockIcon,
  DockItem,
  DockLabel,
} from "@/components/ui/shadcn-io/dock/index";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Separator } from "@radix-ui/react-separator";
import React from "react";
import WhatsappBtn from "@/components/whatsapp-btn";
import Image from "next/image";
import { ContactDialog } from "@/components/contact-dialog";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import ProcessTimeline from "@/components/timeline";
import Nav from "@/components/nav";
import { ContactSection } from "@/components/contact-section";

function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}

// Función para obtener datos de habilidades con traducciones
const getSkillsData = (t: any) => [
  {
    category: t("technologies_list.tec1"),
    icon: Code2,
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Shadcn UI"],
  },
  {
    category: t("technologies_list.tec2"),
    icon: Server,
    skills: ["Python", "PHP", "Node.js", "APIs"],
  },
  {
    category: t("technologies_list.tec3"),
    icon: Database,
    skills: ["WordPress", "Elementor", "WooCommerce", "Custom Themes"],
  },
  {
    category: t("technologies_list.tec4"),
    icon: ShoppingBag,
    skills: ["Shopify", "Hydrogen", "Oxygen"],
  },
  {
    category: t("technologies_list.tec5"),
    icon: Zap,
    skills: ["n8n", "Make", "Workflows"],
  },
  {
    category: t("technologies_list.tec6"),
    icon: Globe,
    skills: ["Mysql", "PostgreSQL"],
  },
];

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

const SOCIAL_LINKS = [
  {
    icon: Mail,
    href: "mailto:cisnerosgranda14@gmail.com",
    label: "Email",
    hoverColor: "hover:bg-primary/10 hover:text-primary",
  },
  {
    icon: Github,
    href: "https://github.com/cisneros14",
    label: "GitHub",
    hoverColor: "hover:bg-secondary/10 hover:text-secondary",
  },
  {
    icon: Linkedin,
    href: "https://www.linkedin.com/in/carlos-cisneros-granda-059469230/",
    label: "LinkedIn",
    hoverColor: "hover:bg-accent/10 hover:text-accent",
  },
];

const DOCK_DATA = [
  {
    title: "Tecnologías",
    icon: (
      <Package className="h-full w-full text-neutral-600 dark:text-neutral-300" />
    ),
    href: "#skills",
  },
  {
    title: "Proyectos",
    icon: (
      <Component className="h-full w-full text-neutral-600 dark:text-neutral-300" />
    ),
    href: "#projects",
  },
];

const DOCK_SOCIAL_DATA = [
  {
    icon: Github,
    href: "https://github.com/cisneros14",
    label: "GitHub",
  },
  {
    icon: MailIcon,
    href: "mailto:cisnerosgranda14@gmail.com",
    label: "Correo Electronico",
  },
  {
    icon: Linkedin,
    href: "https://www.linkedin.com/in/carlos-cisneros-granda-059469230/",
    label: "LinkedIn",
  },
];
// Proyectos: generar datos traducibles usando las claves de i18n
const getProjectsData = (t: any) => [
  {
    title: t("projects_data.easyClosers.title"),
    subtitle: t("projects_data.easyClosers.subtitle"),
    href: "https://micky-next.vercel.app",
    image: "easyClosers.png",
  },
  {
    title: t("projects_data.holysin.title"),
    subtitle: t("projects_data.holysin.subtitle"),
    href: "https://github.com/cisneros14/portfolio2",
    image: "holySin.png",
  },
  {
    title: t("projects_data.dash_ecommerce.title"),
    subtitle: t("projects_data.dash_ecommerce.subtitle"),
    href: "https://cisnerosdash.vercel.app/",
    image: "dash.png",
  },
  {
    title: t("projects_data.cainec.title"),
    subtitle: t("projects_data.cainec.subtitle"),
    href: "https://palevioletred-gerbil-452167.hostingersite.com/",
    image: "cainec.png",
  },
];

const getMetricsHighlights = (t: any) => [
  {
    title: t("metrics.sales_increase"),
    value: t("metrics.sales_increase_value"),
    description: t("metrics.sales_increase_desc"),
    icon: TrendingUp,
  },
  {
    title: t("metrics.conversion_rate"),
    value: t("metrics.conversion_rate_value"),
    description: t("metrics.conversion_rate_desc"),
    icon: Target,
  },
  {
    title: t("metrics.average_roi"),
    value: t("metrics.average_roi_value"),
    description: t("metrics.average_roi_desc"),
    icon: Zap,
  },
  {
    title: t("metrics.satisfied_clients"),
    value: t("metrics.satisfied_clients_value"),
    description: t("metrics.satisfied_clients_desc"),
    icon: Sparkles,
  },
];

const SALES_GROWTH_DATA = [
  { month: "Ene", before: 15000, after: 28000 },
  { month: "Feb", before: 18000, after: 35000 },
  { month: "Mar", before: 16000, after: 42000 },
  { month: "Abr", before: 19000, after: 48000 },
  { month: "May", before: 17000, after: 55000 },
  { month: "Jun", before: 20000, after: 62000 },
];

const CONVERSION_RATE_DATA = [
  { month: "Ene", rate: 1.8 },
  { month: "Feb", rate: 2.4 },
  { month: "Mar", rate: 3.2 },
  { month: "Abr", rate: 4.1 },
  { month: "May", rate: 5.5 },
  { month: "Jun", rate: 6.8 },
];

const CLIENT_GROWTH_DATA = [
  { month: "Ene", clients: 45 },
  { month: "Feb", clients: 78 },
  { month: "Mar", clients: 125 },
  { month: "Abr", clients: 189 },
  { month: "May", clients: 267 },
  { month: "Jun", clients: 354 },
];

function SocialButton({
  icon: Icon,
  href,
  label,
  hoverColor,
}: {
  icon: LucideIcon;
  href: string;
  label: string;
  hoverColor: string;
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      asChild
      className={cn(
        "w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-sm transition-all duration-300 hover:scale-110 hover:shadow-lg active:scale-95",
        hoverColor
      )}
    >
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        aria-label={label}
      >
        <Icon className="w-5 h-5 text-slate-600 dark:text-white" />
      </a>
    </Button>
  );
}

function SkillCard({
  skill,
  index,
  itemVariants,
}: {
  skill: SkillType;
  index: number;
  itemVariants: any;
}) {
  return (
    <motion.div variants={itemVariants} transition={{ delay: index * 0.1 }}>
      <Card
        className={cn(
          `group relative p-5 sm:p-6 lg:p-7 h-full bg-background border-border/50 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1`
        )}
      >
        <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5">
          <div
            className={cn(
              "p-2.5 sm:p-3 rounded-xl bg-primary/10 text-primary shadow-sm"
            )}
          >
            <skill.icon className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-foreground">
            {skill.category}
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {skill.skills.map((tech) => (
            <Badge
              key={tech}
              variant="secondary"
              className="text-xs font-medium px-2.5 py-1 rounded-lg"
            >
              {tech}
            </Badge>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}

type SkillType = {
  category: string;
  icon: any;
  skills: string[];
};

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

function ProjectCard({
  title,
  subtitle,
  image,
  href,
}: {
  title: string;
  subtitle: string;
  image?: string;
  href: string;
}) {
  return (
    <motion.div
      whileHover={{ y: 0 }}
      transition={{ duration: 0.2 }}
      className="w-full h-full"
    >
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full"
      >
        <Card className="overflow-hidden h-full bg-background border-border/50 hover:border-primary/50 transition-colors shadow-sm hover:shadow-md py-0">
          <div className="relative aspect-video w-full overflow-hidden bg-muted">
            {image ? (
              <img
                src={image}
                alt={title}
                className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <Component className="w-12 h-12 text-muted-foreground/50" />
              </div>
            )}
          </div>
          <div className="p-5">
            <h3 className="font-bold text-lg mb-2 text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {subtitle}
            </p>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}

function HeroSection({ t, itemVariants }: { t: any; itemVariants: any }) {
  const { theme } = useTheme();
  return (
    <div id="hero" className="scroll-mt-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left Column: Content */}
        <div className="flex flex-col items-start text-left order-2 lg:order-1">
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
        </div>

        {/* Right Column: Visual */}
        <div className="relative order-1 lg:order-2 flex justify-center lg:justify-end">
          <motion.div
            variants={itemVariants}
            className="relative w-full max-w-[400px] lg:max-w-[500px] aspect-square flex items-center justify-center"
          >
            <div className="absolute inset-0 rounded-full pointer-events-none opacity-20 dark:opacity-10 bg-primary/20 blur-3xl" />
            <Image
              src={theme === "dark" ? "/logo5.png" : "/logo6.png"}
              alt="Agility Logo"
              width={400}
              height={400}
              className="w-74 lg:w-100 h-auto drop-shadow-2xl"
              priority
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function AboutExperienceSection({
  t,
  itemVariants,
}: {
  t: any;
  itemVariants: any;
}) {
  return (
    <div id="about" className="scroll-mt-24">
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
            {t("experience_badge")}
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-4 sm:mb-5 lg:mb-6 px-4 leading-tight">
            {t("experience_projects")}
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-3xl mx-auto px-4">
            {t("experience_projects_desc")}
          </p>
        </motion.div>
      </div>
      <motion.div className="shadow-none">
        <div className="grid shadow-none grid-cols-12 gap-3 sm:gap-4 lg:gap-5">
          {/* About Me - Tall Card */}
          <Card
            id="about"
            className={cn(
              "group relative p-5 sm:p-6 lg:p-7 h-full bg-background border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1",
              "xl:col-span-6 col-span-12 row-span-2"
            )}
          >
            <div className="flex flex-col items-start justify-start h-full relative z-10">
              <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl sm:text-2xl font-bold font-sans">
                    FM
                  </span>
                </div>
                <div className="flex-1">
                  <h2 className="text-lg sm:text-xl font-bold text-card-foreground font-sans">
                    {t("about_me")}
                  </h2>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mt-1">
                    <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="font-sans">{t("about_me_location")}</span>
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed font-sans text-sm sm:text-base mb-3 sm:mb-4">
                {t("about_me_desc")}
              </p>
              <Image
                src="/beans.png"
                alt="Profile Picture"
                width={400}
                height={400}
                className="w-full max-w-[400px] mx-auto my-10 lg:my-auto rounded-lg object-cover self-start"
              />
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-auto">
                {["HubSpot CMS", "JavaScript", "React", "Node.js"].map(
                  (tech) => (
                    <Badge
                      key={tech}
                      variant="outline"
                      className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 text-[0.7rem] sm:text-xs font-medium bg-background/80 backdrop-blur-sm border-primary/20 shadow-sm text-muted-foreground"
                    >
                      {tech}
                    </Badge>
                  )
                )}
              </div>
            </div>
          </Card>

          {/* Experience - Medium Card */}
          <Card
            id="experience"
            className={cn(
              "group relative p-5 sm:p-6 lg:p-7 h-full bg-background border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1",
              "xl:col-span-3 lg:col-span-6 col-span-12"
            )}
          >
            <div className="relative z-10">
              <div className="flex flex-col items-start gap-2.5 sm:gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-[0.65rem] sm:text-xs font-bold font-sans">
                    TC
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-card-foreground font-sans text-sm sm:text-base leading-snug">
                    {t("senior_fullstack")}
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground font-sans mt-0.5">
                    {t("senior_fullstack_company")}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Status - Square Card */}
          <Card
            className={cn(
              "group relative p-5 sm:p-6 h-full bg-background border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1",
              "xl:col-span-3 lg:col-span-6 col-span-12"
            )}
          >
            <div className="relative z-10">
              <div className="flex flex-col items-start gap-2.5 sm:gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-[0.65rem] sm:text-xs font-bold font-sans">
                    ST
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-card-foreground font-sans text-sm sm:text-base leading-snug">
                    {t("fullstack")}
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground font-sans mt-0.5">
                    {t("fullstack_company")}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Selected Projects - Large Card */}
          <Card
            id="selected-projects-card"
            className={cn(
              "group relative p-5 sm:p-6 lg:p-7 h-full bg-background border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1",
              "xl:col-span-6 col-span-12"
            )}
          >
            <div className="relative z-10">
              <h3 className="font-bold text-card-foreground mb-3 sm:mb-4 lg:mb-5 font-sans text-base sm:text-lg">
                {t("selected_projects")}
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {[
                  {
                    title: t("ecommerce_platform"),
                    desc: t("ecommerce_platform_desc"),
                  },
                  {
                    title: t("task_management_app"),
                    desc: t("task_management_app_desc"),
                  },
                  { title: t("etica3"), desc: t("etica3Descrip") },
                ].map((project) => (
                  <div
                    key={project.title}
                    className="flex items-start justify-between"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-card-foreground font-sans text-sm sm:text-base mb-1">
                        {project.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-muted-foreground font-sans leading-relaxed">
                        {project.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </motion.div>
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center my-10 sm:my-12 lg:my-16 px-4"
      >
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
      </motion.div>
    </div>
  );
}

function TechnologiesSection({
  t,
  itemVariants,
}: {
  t: any;
  itemVariants: any;
}) {
  return (
    <div id="tecnologias" className="scroll-mt-24">
      <motion.div variants={itemVariants} id="skills">
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
              {t("technologies_badge")}
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-4 sm:mb-5 lg:mb-6 px-4 leading-tight">
              {t("technologies")}
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-3xl mx-auto px-4">
              {t("technologies_desc")}
            </p>
          </motion.div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5 max-w-7xl mx-auto">
          {getSkillsData(t).map((skill, index) => (
            <SkillCard
              key={skill.category}
              skill={skill}
              index={index}
              itemVariants={itemVariants}
            />
          ))}
        </div>
      </motion.div>
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center my-10 sm:my-12 lg:my-16 px-4"
      >
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
      </motion.div>
    </div>
  );
}

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

function ProjectsSection({ t, itemVariants }: { t: any; itemVariants: any }) {
  return (
    <div id="projects" className="scroll-mt-24">
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
            {t("projects_badge")}
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-4 sm:mb-5 lg:mb-6 px-4 leading-tight">
            {t("latest_projects")}
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-3xl mx-auto px-4">
            {t("latest_projects_desc")}
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {getProjectsData(t).map((project) => (
              <CarouselItem
                key={project.title}
                className="pl-2 md:pl-4 sm:basis-1/2 lg:basis-1/3"
              >
                <div className="h-full p-1">
                  <ProjectCard {...project} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden sm:block">
            <CarouselPrevious className="left-0 -translate-x-1/2" />
            <CarouselNext className="right-0 translate-x-1/2" />
          </div>
        </Carousel>
      </div>

      <motion.div
        variants={itemVariants}
        className="flex mt-12 sm:mt-16 lg:mt-20 flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center mb-10 sm:mb-12 lg:mb-16 px-4"
      >
        <ContactDialog
          triggerSize="lg"
          triggerClassName="group bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base lg:text-lg rounded-xl flex items-center justify-center w-full sm:w-auto"
        >
          {t("request_quote")}
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3 group-hover:translate-x-1 transition-transform duration-200" />
        </ContactDialog>
      </motion.div>
    </div>
  );
}

function ServicesSection() {
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
        {getServicesData(t).map((service, index) => (
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

function MetricsSection() {
  const t = useTranslations();
  const METRICS_HIGHLIGHTS = getMetricsHighlights(t);

  return (
    <div id="metricas" className="scroll-mt-24">
      <div className="text-center mb-10 sm:mb-12 lg:mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Badge
            variant="outline"
            className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-medium bg-background/80 backdrop-blur-sm border-secondary/20 shadow-sm text-muted-foreground mb-5 sm:mb-6"
          >
            <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-secondary" />
            {t("metrics.badge")}
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-4 sm:mb-5 lg:mb-6 px-4 leading-tight">
            {t("metrics.title_part1")}{" "}
            <span className="text-primary">{t("metrics.title_part2")}</span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-3xl mx-auto px-4 leading-relaxed">
            {t("metrics.description")}
          </p>
        </motion.div>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mb-12 sm:mb-16">
        {METRICS_HIGHLIGHTS.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="relative p-5 sm:p-6 h-full bg-background border border-border/50 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <div className="relative">
                <div
                  className={cn(
                    "w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 sm:mb-4"
                  )}
                >
                  <metric.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-1.5 sm:mb-2">
                  {metric.value}
                </div>
                <h4 className="font-semibold text-foreground mb-1 text-sm sm:text-base">
                  {metric.title}
                </h4>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {metric.description}
                </p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-7xl mx-auto">
        {/* Sales Growth Chart */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="min-w-0"
        >
          <Card className="p-5 sm:p-6 lg:p-7 bg-background border border-border/50 shadow-sm">
            <div className="mb-5 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-foreground mb-1.5 sm:mb-2">
                {t("metrics.sales_growth_chart")}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {t("metrics.sales_growth_chart_desc")}
              </p>
            </div>
            <ChartContainer
              config={{
                before: {
                  label: "Antes",
                  color: "var(--chart-1)",
                },
                after: {
                  label: "Después",
                  color: "var(--chart-2)",
                },
              }}
              className="h-[250px] sm:h-[300px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={SALES_GROWTH_DATA}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-border"
                  />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="before"
                    stackId="1"
                    stroke="var(--chart-1)"
                    fill="var(--chart-1)"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="after"
                    stackId="2"
                    stroke="var(--chart-2)"
                    fill="var(--chart-2)"
                    fillOpacity={0.8}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </Card>
        </motion.div>

        {/* Conversion Rate Chart */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="min-w-0"
        >
          <Card className="p-5 sm:p-6 lg:p-7 bg-background border border-border/50 shadow-sm">
            <div className="mb-5 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-foreground mb-1.5 sm:mb-2">
                {t("metrics.conversion_chart")}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {t("metrics.conversion_chart_desc")}
              </p>
            </div>
            <ChartContainer
              config={{
                rate: {
                  label: t("metrics.conversion_rate"),
                  color: "var(--chart-3)",
                },
              }}
              className="h-[250px] sm:h-[300px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={CONVERSION_RATE_DATA}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-border"
                  />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="var(--chart-3)"
                    strokeWidth={3}
                    dot={{ fill: "var(--chart-3)", r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </Card>
        </motion.div>

        {/* Client Growth Chart - Full Width */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-2 min-w-0"
        >
          <Card className="p-5 sm:p-6 lg:p-7 bg-background border border-border/50 shadow-sm">
            <div className="mb-5 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-foreground mb-1.5 sm:mb-2">
                {t("metrics.client_growth_chart")}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {t("metrics.client_growth_chart_desc")}
              </p>
            </div>
            <ChartContainer
              config={{
                clients: {
                  label: t("metrics.satisfied_clients"),
                  color: "var(--chart-4)",
                },
              }}
              className="h-[250px] sm:h-[300px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CLIENT_GROWTH_DATA}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-border"
                  />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="clients"
                    fill="var(--chart-4)"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </Card>
        </motion.div>
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="md:text-center mt-12 sm:mt-16 lg:mt-20"
      >
        <div className="bg-background rounded-2xl sm:rounded-3xl p-2 py-10 md:p-6 sm:p-8 lg:p-12 border border-border/50 shadow-sm">
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-3 sm:mb-4 px-4 leading-tight">
            {t("metrics.cta_title")}
          </h3>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-4 leading-relaxed">
            {t("you_know")}
          </p>
          <div className="inline-flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center px-4 w-full sm:w-auto">
            <ContactDialog
              triggerSize="lg"
              triggerClassName="group bg-gradient-to-r from-primary via-accent to-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base lg:text-lg rounded-xl flex items-center justify-center w-full sm:w-auto"
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
        </div>
      </motion.div>
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
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);
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

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative space-y-48">
      {/* Background shapes - Simplified */}
      <div className="inset-0 overflow-x-hidden fixed z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/40 via-transparent to-transparent" />
      </div>

      {/* Main content */}
      <div className="relative z-10 space-y-48">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <HeroSection t={t} itemVariants={itemVariants} />
        </motion.div>

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
