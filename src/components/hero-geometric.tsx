"use client"
import { PinContainer } from "@/components/ui/shadcn-io/3d-pin"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion, useScroll, useTransform } from "framer-motion"
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
} from "lucide-react"
import { useTranslations } from "next-intl"
import { Dock, DockIcon, DockItem, DockLabel } from "@/components/ui/shadcn-io/dock/index"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { AnimatePresence } from "framer-motion"
import { Separator } from "@radix-ui/react-separator"
import React from "react"
import MovilSheet from "./movil-sheet"
import WhatsappBtn from "./whatsapp-btn"
import Image from "next/image"
import { ContactDialog } from "./contact-dialog"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
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
} from "recharts"
import ProcessTimeline from "./timeline"

function cn(...classes: (string | undefined | false | null)[]) {
    return classes.filter(Boolean).join(" ")
}

// Función para obtener datos de habilidades con traducciones
const getSkillsData = (t: any) => [
    {
        category: t("technologies_list.tec1"),
        icon: Code2,
        skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Shadcn UI"],
        gradient: "from-blue-500 to-purple-600",
        bgGradient: "from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50",
        borderColor: "border-blue-200/20 dark:border-blue-800/20",
    },
    {
        category: t("technologies_list.tec2"),
        icon: Server,
        skills: ["Python", "PHP", "Node.js", "APIs"],
        gradient: "from-purple-500 to-pink-600",
        bgGradient: "from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50",
        borderColor: "border-purple-200/20 dark:border-purple-800/20",
    },
    {
        category: t("technologies_list.tec3"),
        icon: Database,
        skills: ["WordPress", "Elementor", "WooCommerce", "Custom Themes"],
        gradient: "from-pink-500 to-rose-600",
        bgGradient: "from-pink-50 to-rose-50 dark:from-pink-950/50 dark:to-rose-950/50",
        borderColor: "border-pink-200/20 dark:border-pink-800/20",
    },
    {
        category: t("technologies_list.tec4"),
        icon: ShoppingBag,
        skills: ["Shopify", "Hydrogen", "Oxygen"],
        gradient: "from-rose-500 to-orange-600",
        bgGradient: "from-rose-50 to-orange-50 dark:from-rose-950/50 dark:to-orange-950/50",
        borderColor: "border-rose-200/20 dark:border-rose-800/20",
    },
    {
        category: t("technologies_list.tec5"),
        icon: Zap,
        skills: ["n8n", "Make", "Workflows"],
        gradient: "from-orange-500 to-yellow-600",
        bgGradient: "from-orange-50 to-yellow-50 dark:from-orange-950/50 dark:to-yellow-950/50",
        borderColor: "border-orange-200/20 dark:border-orange-800/20",
    },
    {
        category: t("technologies_list.tec6"),
        icon: Globe,
        skills: ["Mysql", "PostgreSQL"],
        gradient: "from-yellow-500 to-green-600",
        bgGradient: "from-yellow-50 to-green-50 dark:from-yellow-950/50 dark:to-green-950/50",
        borderColor: "border-yellow-200/20 dark:border-yellow-800/20",
    },
];

// Función para obtener datos de servicios con traducciones
const getServicesData = (t: any) => [
    {
        title: t("services_data.landing_pages.title"),
        description: t("services_data.landing_pages.description"),
        icon: Rocket,
        gradient: "from-purple-500 to-violet-600",
    },
    {
        title: t("services_data.strategic_websites.title"),
        description: t("services_data.strategic_websites.description"),
        icon: Target,
        gradient: "from-violet-500 to-fuchsia-600",
    },
    {
        title: t("services_data.ecommerce.title"),
        description: t("services_data.ecommerce.description"),
        icon: ShoppingBag,
        gradient: "from-fuchsia-500 to-pink-600",
    },
    {
        title: t("services_data.automation.title"),
        description: t("services_data.automation.description"),
        icon: Zap,
        gradient: "from-pink-500 to-rose-600",
    },
    {
        title: t("services_data.custom_systems.title"),
        description: t("services_data.custom_systems.description"),
        icon: Settings,
        gradient: "from-rose-500 to-purple-600",
    },
    {
        title: t("services_data.conversion_optimization.title"),
        description: t("services_data.conversion_optimization.description"),
        icon: TrendingUp,
        gradient: "from-purple-500 to-indigo-600",
    },
    {
        title: t("services_data.tool_integration.title"),
        description: t("services_data.tool_integration.description"),
        icon: Wrench,
        gradient: "from-indigo-500 to-blue-600",
    },
];

const SOCIAL_LINKS = [
    {
        icon: Mail,
        href: "mailto:cisnerosgranda14@gmail.com",
        label: "Email",
        hoverColor: "hover:bg-purple-100 dark:hover:bg-purple-900/50 hover:text-purple-600 dark:hover:text-purple-400",
    },
    {
        icon: Github,
        href: "https://github.com/cisneros14",
        label: "GitHub",
        hoverColor: "hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100",
    },
    {
        icon: Linkedin,
        href: "https://www.linkedin.com/in/carlos-cisneros-granda-059469230/",
        label: "LinkedIn",
        hoverColor: "hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:text-blue-600 dark:hover:text-blue-400",
    },
]

const DOCK_DATA = [
    {
        title: "Tecnologías",
        icon: <Package className="h-full w-full text-neutral-600 dark:text-neutral-300" />,
        href: "#skills",
    },
    {
        title: "Proyectos",
        icon: <Component className="h-full w-full text-neutral-600 dark:text-neutral-300" />,
        href: "#projects",
    },
]

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
]
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
];


const getMetricsHighlights = (t: any) => [
    {
        title: t("metrics.sales_increase"),
        value: t("metrics.sales_increase_value"),
        description: t("metrics.sales_increase_desc"),
        gradient: "from-emerald-500 to-green-600",
        icon: TrendingUp,
    },
    {
        title: t("metrics.conversion_rate"),
        value: t("metrics.conversion_rate_value"),
        description: t("metrics.conversion_rate_desc"),
        gradient: "from-blue-500 to-cyan-600",
        icon: Target,
    },
    {
        title: t("metrics.average_roi"),
        value: t("metrics.average_roi_value"),
        description: t("metrics.average_roi_desc"),
        gradient: "from-purple-500 to-fuchsia-600",
        icon: Zap,
    },
    {
        title: t("metrics.satisfied_clients"),
        value: t("metrics.satisfied_clients_value"),
        description: t("metrics.satisfied_clients_desc"),
        gradient: "from-orange-500 to-rose-600",
        icon: Sparkles,
    },
]

const SALES_GROWTH_DATA = [
    { month: "Ene", before: 15000, after: 28000 },
    { month: "Feb", before: 18000, after: 35000 },
    { month: "Mar", before: 16000, after: 42000 },
    { month: "Abr", before: 19000, after: 48000 },
    { month: "May", before: 17000, after: 55000 },
    { month: "Jun", before: 20000, after: 62000 },
]

const CONVERSION_RATE_DATA = [
    { month: "Ene", rate: 1.8 },
    { month: "Feb", rate: 2.4 },
    { month: "Mar", rate: 3.2 },
    { month: "Abr", rate: 4.1 },
    { month: "May", rate: 5.5 },
    { month: "Jun", rate: 6.8 },
]

const CLIENT_GROWTH_DATA = [
    { month: "Ene", clients: 45 },
    { month: "Feb", clients: 78 },
    { month: "Mar", clients: 125 },
    { month: "Abr", clients: 189 },
    { month: "May", clients: 267 },
    { month: "Jun", clients: 354 },
]

function ElegantShape({
    className,
    delay = 0,
    width = 400,
    height = 100,
    rotate = 0,
    gradient = "from-white/[0.08]",
}: {
    className?: string
    delay?: number
    width?: number
    height?: number
    rotate?: number
    gradient?: string
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -150, rotate: rotate - 15 }}
            animate={{ opacity: 1, y: 0, rotate: rotate }}
            transition={{
                duration: 2.4,
                delay,
                ease: [0.23, 0.86, 0.39, 0.96],
                opacity: { duration: 1.2 },
            }}
            className={cn("absolute", className)}
        >
            <motion.div
                animate={{ y: [0, 15, 0] }}
                transition={{
                    duration: 12,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                }}
                style={{ width, height }}
                className="relative"
            >
                <div
                    className={cn(
                        "absolute inset-0 rounded-full",
                        "bg-gradient-to-r to-transparent",
                        gradient,
                        "backdrop-blur-[4px]",
                        "shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
                        "after:absolute after:inset-0 after:rounded-full",
                        "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]",
                    )}
                />
            </motion.div>
        </motion.div>
    )
}

function SocialButton({
    icon: Icon,
    href,
    label,
    hoverColor,
}: {
    icon: LucideIcon
    href: string
    label: string
    hoverColor: string
}) {
    return (
        <Button
            variant="ghost"
            size="icon"
            asChild
            className={cn(
                "w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-sm transition-all duration-300 hover:scale-110 hover:shadow-lg active:scale-95",
                hoverColor,
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
    )
}

function SkillCard({
    skill,
    index,
    itemVariants,
}: {
    skill: SkillType
    index: number
    itemVariants: any
}) {
    return (
        <motion.div variants={itemVariants} transition={{ delay: index * 0.1 }}>
            <Card
                className={cn(
                    `group relative p-5 sm:p-6 lg:p-7 h-full bg-gradient-to-br border ${skill.borderColor} shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 backdrop-blur-md`,
                    skill.bgGradient,
                )}
            >
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5">
                    <div className={cn("p-2.5 sm:p-3 rounded-xl bg-gradient-to-r text-white shadow-sm", skill.gradient)}>
                        <skill.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">{skill.category}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                    {skill.skills.map((tech) => (
                        <Badge
                            key={tech}
                            variant="default"
                            className="text-xs text-foreground border border-foreground/30 bg-transparent font-medium transition-colors duration-200 px-2.5 py-1 rounded-lg"
                        >
                            {tech}
                        </Badge>
                    ))}
                </div>
            </Card>
        </motion.div>
    )
}

type SkillType = {
    category: string
    icon: any
    skills: string[]
    gradient: string
    bgGradient: string
    borderColor: string
}

type ServiceType = {
    title: string
    description: string
    icon: any
    gradient: string
}

function ServiceCard({ service, index }: { service: ServiceType; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            <div className="group relative h-full">
                <div
                    className={cn(
                        "absolute -inset-0.5 bg-gradient-to-r rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur",
                        service.gradient,
                    )}
                />
                <div className="relative h-full bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 lg:p-8 border border-slate-200/60 dark:border-slate-800/60 hover:border-transparent transition-all duration-300">
                    <div className="flex flex-col md:flex-row items-start gap-4 lg:gap-5">
                        <div className="flex-shrink-0">
                            <div
                                className={cn(
                                    "w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300",
                                    service.gradient,
                                )}
                            >
                                <service.icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 dark:text-white mb-2 sm:mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-purple-600 group-hover:to-fuchsia-600 transition-all duration-300 leading-snug">
                                {service.title}
                            </h3>
                            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                                {service.description}
                            </p>
                        </div>
                    </div>
                    <div
                        className={cn(
                            "absolute top-0 right-0 w-20 h-20 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl",
                            service.gradient,
                        )}
                    />
                </div>
            </div>
        </motion.div>
    )
}

function ThreeDPinDemo({
    title,
    subtitle,
    image,
    href,
}: {
    title: string
    subtitle: string
    image?: string
    href: string
}) {
    return (
        <PinContainer className="" title={title} href={href}>
            <div className="flex basis-full flex-col tracking-tight sm:basis-1/2 w-[15rem] sm:w-[17rem] md:w-[20rem] h-auto md:h-[20rem]">
                <div className="p-2 sm:p-2.5 md:p-3">
                    <h3 className="max-w-xs !pb-2 !m-0 font-bold text-sm sm:text-base">{title}</h3>
                    <div className="text-sm sm:text-base !m-0 !p-0 font-normal">
                        <span className="text-slate-500">{subtitle}</span>
                    </div>
                </div>
                {image ? (
                    <div className="flex flex-1 w-full rounded-lg mt-3 sm:mt-4 overflow-hidden">
                        <img src={image || "/placeholder.svg"} alt={title} className="object-cover w-full h-full rounded-lg" />
                    </div>
                ) : (
                    <div className="flex flex-1 w-full rounded-lg mt-3 sm:mt-4 bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500" />
                )}
            </div>
        </PinContainer>
    )
}

function HeroSection({ t, itemVariants }: { t: any; itemVariants: any }) {
    return (
        <div className="text-center mb-12 sm:mb-16 lg:mb-20 xl:mb-24 px-4">
            <motion.div variants={itemVariants} className="mb-5 sm:mb-6 lg:mb-8">
                <Badge
                    variant="outline"
                    className="!text-wrap text-center items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-[0.7rem] sm:text-xs font-medium bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-purple-200/60 dark:border-purple-800/60 shadow-sm text-slate-600 dark:text-white max-w-full inline-flex"
                >
                    <Sparkles className="min-w-3.5 min-h-3.5 max-w-3.5 max-h-3.5 sm:min-w-4 sm:min-h-4 sm:max-w-4 sm:max-h-4 text-purple-600 dark:text-purple-400" />
                    {t("available_projects")}
                </Badge>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-5 sm:mb-6 lg:mb-8">
                <div className="inline-block rounded-2xl p-1.5 sm:p-2 lg:p-3 mb-3 sm:mb-4 lg:mb-6 relative">
                    <div
                        className="absolute inset-0 rounded-4xl pointer-events-none"
                        style={{
                            background:
                                "radial-gradient(circle at 50% 40%, rgba(124,58,237,0.72) 0%, rgba(124,58,237,0.55) 18%, rgba(124,58,237,0.32) 36%, rgba(124,58,237,0.08) 58%, transparent 78%)",
                            filter: "blur(60px)",
                            transform: "translateZ(0)",
                        }}
                    />
                    <Image
                        src="/logo.png"
                        alt="Agility Logo"
                        width={400}
                        height={100}
                        className="relative w-40 sm:w-48 lg:w-56 mx-auto rounded-full"
                        style={{
                            filter: "drop-shadow(0 0 6px rgba(124,58,237,0.6))",
                        }}
                    />
                </div>
                <p className="text-start md:text-center text-lg sm:text-xl lg:text-2xl xl:text-3xl font-medium text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed px-2">
                    {t("role")}
                </p>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-6 sm:mb-8 lg:mb-10">
                <p className="text-start md:text-center text-sm sm:text-base lg:text-lg xl:text-xl text-slate-500 dark:text-slate-400 max-w-4xl mx-auto leading-relaxed px-4">
                    {t("hero_description")}
                </p>
            </motion.div>

            <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center mb-8 sm:mb-12 lg:mb-14 px-4"
            >
                <ContactDialog
                    triggerSize="lg"
                    triggerClassName="group bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base lg:text-lg rounded-xl flex items-center justify-center w-full sm:w-auto"
                >
                    {t("request_quote")}
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3 group-hover:translate-x-1 transition-transform duration-200" />
                </ContactDialog>
                <Button
                    asChild
                    size="lg"
                    className="group w-full sm:w-auto border border-violet-500 bg-transparent hover:bg-violet-500/20 text-foreground shadow-lg hover:shadow-xl transition-all duration-300 px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base lg:text-lg rounded-xl h-auto"
                >
                    <a href="#projects" rel="noopener noreferrer" className="flex items-center justify-center gap-2 sm:gap-3">
                        <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                        {t("view_latest_project")}
                        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </a>
                </Button>
            </motion.div>
        </div>
    )
}

function AboutExperienceSection({ t, itemVariants }: { t: any; itemVariants: any }) {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 lg:mt-20">
            <div className="text-center mb-10 sm:mb-12 lg:mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <Badge
                        variant="outline"
                        className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-medium bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-purple-200/60 dark:border-purple-800/60 shadow-sm text-slate-600 dark:text-white mb-5 sm:mb-6"
                    >
                        <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600 dark:text-purple-400" />
                        {t("experience_badge")}
                    </Badge>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-5 lg:mb-6 px-4 leading-tight">
                        {t("experience_projects")}
                    </h2>
                    <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto px-4">
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
                            "group relative p-5 sm:p-6 lg:p-7 h-full bg-gradient-to-br border shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 backdrop-blur-md",
                            "xl:col-span-6 col-span-12 row-span-2",
                            "from-purple-50 to-violet-50 dark:from-purple-950/50 dark:to-violet-950/50",
                            "border-purple-200/20 dark:border-purple-800/20",
                        )}
                    >
                        <div className="flex flex-col items-start justify-start h-full relative z-10">
                            <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <span className="text-xl sm:text-2xl font-bold font-sans">FM</span>
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-lg sm:text-xl font-bold text-card-foreground font-sans">{t("about_me")}</h2>
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
                                {["HubSpot CMS", "JavaScript", "React", "Node.js"].map((tech) => (
                                    <Badge
                                        key={tech}
                                        variant="outline"
                                        className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 text-[0.7rem] sm:text-xs font-medium bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-purple-200/60 dark:border-purple-800/60 shadow-sm text-slate-600 dark:text-white"
                                    >
                                        {tech}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </Card>

                    {/* Experience - Medium Card */}
                    <Card
                        id="experience"
                        className={cn(
                            "group relative p-5 sm:p-6 lg:p-7 h-full bg-gradient-to-br border shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 backdrop-blur-md",
                            "xl:col-span-3 lg:col-span-6 col-span-12",
                            "from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50",
                            "border-blue-200/20 dark:border-blue-800/20",
                        )}
                    >
                        <div className="relative z-10">
                            <div className="flex flex-col items-start gap-2.5 sm:gap-3">
                                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <span className="text-[0.65rem] sm:text-xs font-bold font-sans">TC</span>
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
                            "group relative p-5 sm:p-6 h-full bg-gradient-to-br border shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 backdrop-blur-md",
                            "xl:col-span-3 lg:col-span-6 col-span-12",
                            "from-green-50 to-lime-50 dark:from-green-950/50 dark:to-lime-950/50",
                            "border-green-200/20 dark:border-green-800/20",
                        )}
                    >
                        <div className="relative z-10">
                            <div className="flex flex-col items-start gap-2.5 sm:gap-3">
                                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <span className="text-[0.65rem] sm:text-xs font-bold font-sans">ST</span>
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
                            "group relative p-5 sm:p-6 lg:p-7 h-full bg-gradient-to-br border shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 backdrop-blur-md",
                            "xl:col-span-6 col-span-12",
                            "from-yellow-50 to-green-50 dark:from-yellow-950/50 dark:to-green-950/50",
                            "border-yellow-200/20 dark:border-yellow-800/20",
                        )}
                    >
                        <div className="relative z-10">
                            <h3 className="font-bold text-card-foreground mb-3 sm:mb-4 lg:mb-5 font-sans text-base sm:text-lg">
                                {t("selected_projects")}
                            </h3>
                            <div className="space-y-3 sm:space-y-4">
                                {[
                                    { title: t("ecommerce_platform"), desc: t("ecommerce_platform_desc") },
                                    { title: t("task_management_app"), desc: t("task_management_app_desc") },
                                    { title: t("etica3"), desc: t("etica3Descrip") },
                                ].map((project) => (
                                    <div key={project.title} className="flex items-start justify-between">
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
                    triggerClassName="group bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base lg:text-lg rounded-xl flex items-center justify-center w-full sm:w-auto"
                >
                    {t("request_quote")}
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3 group-hover:translate-x-1 transition-transform duration-200" />
                </ContactDialog>
                <Button
                    asChild
                    size="lg"
                    className="group w-full sm:w-auto border border-violet-500 bg-transparent hover:bg-violet-500/20 text-foreground shadow-lg hover:shadow-xl transition-all duration-300 px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base lg:text-lg rounded-xl h-auto"
                >
                    <a href="#projects" rel="noopener noreferrer" className="flex items-center justify-center gap-2 sm:gap-3">
                        <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                        {t("view_latest_project")}
                        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </a>
                </Button>
            </motion.div>
        </div>
    )
}

function TechnologiesSection({ t, itemVariants }: { t: any; itemVariants: any }) {
    return (
        <div
            id="tecnologias"
            className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-24 lg:mt-32 mb-16 sm:mb-20"
        >
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
                            className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-medium bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-purple-200/60 dark:border-purple-800/60 shadow-sm text-slate-600 dark:text-white mb-5 sm:mb-6"
                        >
                            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600 dark:text-purple-400" />
                            {t("technologies_badge")}
                        </Badge>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-5 lg:mb-6 px-4 leading-tight">
                            {t("technologies")}
                        </h2>
                        <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto px-4">
                            {t("technologies_desc")}
                        </p>
                    </motion.div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5 max-w-7xl mx-auto">
                    {getSkillsData(t).map((skill, index) => (
                        <SkillCard key={skill.category} skill={skill} index={index} itemVariants={itemVariants} />
                    ))}
                </div>
            </motion.div>
            <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center my-10 sm:my-12 lg:my-16 px-4"
            >
                <ContactDialog
                    triggerSize="lg"
                    triggerClassName="group bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base lg:text-lg rounded-xl flex items-center justify-center w-full sm:w-auto"
                >
                    {t("request_quote")}
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3 group-hover:translate-x-1 transition-transform duration-200" />
                </ContactDialog>
                <Button
                    asChild
                    size="lg"
                    className="group w-full sm:w-auto border border-violet-500 bg-transparent hover:bg-violet-500/20 text-foreground shadow-lg hover:shadow-xl transition-all duration-300 px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base lg:text-lg rounded-xl h-auto"
                >
                    <a href="#projects" rel="noopener noreferrer" className="flex items-center justify-center gap-2 sm:gap-3">
                        <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                        {t("view_latest_project")}
                        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </a>
                </Button>
            </motion.div>
        </div>
    )
}

function ProjectsSection({ t, itemVariants }: { t: any; itemVariants: any }) {
    return (
        <div id="projects" className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 lg:mt-20 scroll-mt-24">
            <div className="text-center mb-10 sm:mb-12 lg:mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <Badge
                        variant="outline"
                        className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-medium bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-purple-200/60 dark:border-purple-800/60 shadow-sm text-slate-600 dark:text-white mb-5 sm:mb-6"
                    >
                        <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600 dark:text-purple-400" />
                        {t("projects_badge")}
                    </Badge>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-5 lg:mb-6 px-4 leading-tight">
                        {t("latest_projects")}
                    </h2>
                    <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto px-4">
                        {t("latest_projects_desc")}
                    </p>
                </motion.div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 justify-items-center">
                {getProjectsData(t).map((project) => (
                    <ThreeDPinDemo key={project.title} {...project} />
                ))}
            </div>
            <motion.div
                variants={itemVariants}
                className="flex mt-12 sm:mt-16 lg:mt-20 flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center mb-10 sm:mb-12 lg:mb-16 px-4"
            >
                <ContactDialog
                    triggerSize="lg"
                    triggerClassName="group bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base lg:text-lg rounded-xl flex items-center justify-center w-full sm:w-auto"
                >
                    {t("request_quote")}
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3 group-hover:translate-x-1 transition-transform duration-200" />
                </ContactDialog>
            </motion.div>
        </div>
    )
}

function ServicesSection() {
    const t = useTranslations()
    return (
        <div id="servicios" className="container mx-auto px-4 sm:px-6 lg:px-8 mt-20 sm:mt-24 lg:mt-32 mb-16 sm:mb-20">
            <div className="text-center mb-10 sm:mb-12 lg:mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <Badge
                        variant="outline"
                        className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-medium bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-purple-200/60 dark:border-purple-800/60 shadow-sm text-slate-600 dark:text-white mb-5 sm:mb-6"
                    >
                        <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600 dark:text-purple-400" />
                        {t("services_badge")}
                    </Badge>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-5 lg:mb-6 px-4 leading-tight">
                        {t("services_title_part1")}{" "}
                        <span className="bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                            {t("services_title_part2")}
                        </span>
                    </h2>
                    <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto px-4 leading-relaxed">
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
                        triggerClassName="group bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base lg:text-lg rounded-xl flex items-center justify-center w-full sm:w-auto"
                    >
                        {t("request_quote")}
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3 group-hover:translate-x-1 transition-transform duration-200" />
                    </ContactDialog>
                    <Button
                        asChild
                        size="lg"
                        className="group w-full sm:w-auto border border-violet-500 bg-transparent hover:bg-violet-500/20 text-foreground shadow-lg hover:shadow-xl transition-all duration-300 px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base lg:text-lg rounded-xl h-auto"
                    >
                        <a href="#projects" rel="noopener noreferrer" className="flex items-center justify-center gap-2 sm:gap-3">
                            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                            {t("view_latest_project")}
                            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-200" />
                        </a>
                    </Button>
                </div>
            </motion.div>
        </div>
    )
}

function MetricsSection() {
    const t = useTranslations()
    const METRICS_HIGHLIGHTS = getMetricsHighlights(t)

    return (
        <div id="metricas" className="container mx-auto px-4 sm:px-6 lg:px-8 mt-20 sm:mt-24 lg:mt-32 mb-16 sm:mb-20">
            <div className="text-center mb-10 sm:mb-12 lg:mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <Badge
                        variant="outline"
                        className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-medium bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-emerald-200/60 dark:border-emerald-800/60 shadow-sm text-slate-600 dark:text-white mb-5 sm:mb-6"
                    >
                        <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400" />
                        {t("metrics.badge")}
                    </Badge>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-5 lg:mb-6 px-4 leading-tight">
                        {t("metrics.title_part1")}{" "}
                        <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
                            {t("metrics.title_part2")}
                        </span>
                    </h2>
                    <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto px-4 leading-relaxed">
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
                        <Card className="relative p-5 sm:p-6 h-full bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 hover:border-transparent transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                            <div
                                className={cn(
                                    "absolute -inset-0.5 bg-gradient-to-r rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur",
                                    metric.gradient,
                                )}
                            />
                            <div className="relative">
                                <div
                                    className={cn(
                                        "w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-3 sm:mb-4",
                                        metric.gradient,
                                    )}
                                >
                                    <metric.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                </div>
                                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-1.5 sm:mb-2">
                                    {metric.value}
                                </div>
                                <h4 className="font-semibold text-slate-900 dark:text-white mb-1 text-sm sm:text-base">
                                    {metric.title}
                                </h4>
                                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
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
                >
                    <Card className="p-5 sm:p-6 lg:p-7 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/50 dark:to-green-950/50 border border-emerald-200/20 dark:border-emerald-800/20">
                        <div className="mb-5 sm:mb-6">
                            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-1.5 sm:mb-2">
                                {t("metrics.sales_growth_chart")}
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                {t("metrics.sales_growth_chart_desc")}
                            </p>
                        </div>
                        <ChartContainer
                            config={{
                                before: {
                                    label: "Antes",
                                    color: "hsl(var(--chart-1))",
                                },
                                after: {
                                    label: "Después",
                                    color: "hsl(142, 76%, 36%)",
                                },
                            }}
                            className="h-[250px] sm:h-[300px]"
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={SALES_GROWTH_DATA}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
                                    <XAxis dataKey="month" className="text-xs" />
                                    <YAxis className="text-xs" />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Area
                                        type="monotone"
                                        dataKey="before"
                                        stackId="1"
                                        stroke="hsl(var(--chart-1))"
                                        fill="hsl(var(--chart-1))"
                                        fillOpacity={0.6}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="after"
                                        stackId="2"
                                        stroke="hsl(142, 76%, 36%)"
                                        fill="hsl(142, 76%, 36%)"
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
                >
                    <Card className="p-5 sm:p-6 lg:p-7 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 border border-blue-200/20 dark:border-blue-800/20">
                        <div className="mb-5 sm:mb-6">
                            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-1.5 sm:mb-2">
                                {t("metrics.conversion_chart")}
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                {t("metrics.conversion_chart_desc")}
                            </p>
                        </div>
                        <ChartContainer
                            config={{
                                rate: {
                                    label: t("metrics.conversion_rate"),
                                    color: "hsl(199, 89%, 48%)",
                                },
                            }}
                            className="h-[250px] sm:h-[300px]"
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={CONVERSION_RATE_DATA}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
                                    <XAxis dataKey="month" className="text-xs" />
                                    <YAxis className="text-xs" />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Line
                                        type="monotone"
                                        dataKey="rate"
                                        stroke="hsl(199, 89%, 48%)"
                                        strokeWidth={3}
                                        dot={{ fill: "hsl(199, 89%, 48%)", r: 6 }}
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
                    className="lg:col-span-2"
                >
                    <Card className="p-5 sm:p-6 lg:p-7 bg-gradient-to-br from-purple-50 to-fuchsia-50 dark:from-purple-950/50 dark:to-fuchsia-950/50 border border-purple-200/20 dark:border-purple-800/20">
                        <div className="mb-5 sm:mb-6">
                            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-1.5 sm:mb-2">
                                {t("metrics.client_growth_chart")}
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                {t("metrics.client_growth_chart_desc")}
                            </p>
                        </div>
                        <ChartContainer
                            config={{
                                clients: {
                                    label: t("metrics.satisfied_clients"),
                                    color: "hsl(292, 84%, 61%)",
                                },
                            }}
                            className="h-[250px] sm:h-[300px]"
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={CLIENT_GROWTH_DATA}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
                                    <XAxis dataKey="month" className="text-xs" />
                                    <YAxis className="text-xs" />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Bar dataKey="clients" fill="hsl(292, 84%, 61%)" radius={[8, 8, 0, 0]} />
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
                <div className="bg-gradient-to-r from-blue-50 to-blue-50 dark:from-blue-950/50 dark:to-blue-950/50 rounded-2xl sm:rounded-3xl p-2 py-10 md:p-6 sm:p-8 lg:p-12 border border-blue-200/20 dark:border-blue-800/20">
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4 px-4 leading-tight">
                        {t("metrics.cta_title")}
                    </h3>
                    <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-400 mb-6 sm:mb-8 max-w-2xl mx-auto px-4 leading-relaxed">
                        {t("you_know")}
                    </p>
                    <div className="inline-flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center px-4 w-full sm:w-auto">
                        <ContactDialog
                            triggerSize="lg"
                            triggerClassName="group bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base lg:text-lg rounded-xl flex items-center justify-center w-full sm:w-auto"
                        >
                            {t("request_quote")}
                            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3 group-hover:translate-x-1 transition-transform duration-200" />
                        </ContactDialog>
                        <Button
                            asChild
                            size="lg"
                            className="group w-full sm:w-auto border border-violet-500 bg-transparent hover:bg-violet-500/20 text-foreground shadow-lg hover:shadow-xl transition-all duration-300 px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base lg:text-lg rounded-xl h-auto"
                        >
                            <a href="#projects" rel="noopener noreferrer" className="flex items-center justify-center gap-2 sm:gap-3">
                                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                                {t("view_latest_project")}
                                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-200" />
                            </a>
                        </Button>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

function ProcessSection() {
    const t = useTranslations()

    return (
        <div id="proceso" className="container mx-auto px-4 sm:px-6 lg:px-8 mt-20 sm:mt-24 lg:mt-32 mb-16 sm:mb-20">
            <div className="text-center mb-10 sm:mb-12 lg:mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <Badge
                        variant="outline"
                        className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-medium bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-purple-200/60 dark:border-purple-800/60 shadow-sm text-slate-600 dark:text-white mb-5 sm:mb-6"
                    >
                        <Rocket className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600 dark:text-purple-400" />
                        {t("process.badge")}
                    </Badge>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-5 lg:mb-6 px-4 leading-tight">
                        {t("process.title_part1")}{" "}
                        <span className="bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-600 bg-clip-text text-transparent">
                            {t("process.title_part2")}
                        </span>
                    </h2>
                    <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto px-4 leading-relaxed">
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
                <div className="bg-gradient-to-r from-purple-50 to-fuchsia-50 dark:from-purple-950/50 dark:to-fuchsia-950/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 border border-purple-200/20 dark:border-purple-800/20">
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4 px-4 leading-tight">
                        {t("process.cta_title")}
                    </h3>
                    <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-400 mb-6 sm:mb-8 max-w-2xl mx-auto px-4 leading-relaxed">
                        {t("process.cta_description")}
                    </p>
                    <div className="inline-flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center px-4 w-full sm:w-auto">
                        <ContactDialog
                            triggerSize="lg"
                            triggerClassName="group bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base lg:text-lg rounded-xl flex items-center justify-center w-full sm:w-auto"
                        >
                            {t("request_quote")}
                            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3 group-hover:translate-x-1 transition-transform duration-200" />
                        </ContactDialog>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

function DockNavigation({
    currentLocale,
    handleLanguageSwitch,
    toggleTheme,
    theme,
}: {
    currentLocale: string
    handleLanguageSwitch: () => void
    toggleTheme: () => void
    theme: string | undefined
}) {
    const t = useTranslations()

    return (
        <div className="fixed bottom-4 sm:bottom-5 mx-auto left-0 right-0 z-[1000] px-4">
            <Dock className="hidden md:flex items-end border pb-3 bg-gradient-to-r !from-purple-100 !to-pink-100/100 dark:!from-purple-950/80 dark:!to-pink-950/80">
                {DOCK_DATA.map((item, idx) => (
                    <Link href={item.href} key={idx}>
                        <DockItem className="aspect-square rounded-full ">
                            <DockLabel>{item.title}</DockLabel>
                            <DockIcon>{item.icon}</DockIcon>
                        </DockItem>
                    </Link>
                ))}
                <Separator orientation="vertical" className="bg-foreground/20 w-[1px] h-10" />
                {DOCK_SOCIAL_DATA.map((item, idx) => (
                    <Link href={item.href} key={idx} target="_blank" rel="noopener noreferrer">
                        <DockItem className="aspect-square rounded-full ">
                            <DockLabel>{item.label}</DockLabel>
                            <DockIcon>
                                {React.createElement(item.icon, {
                                    className: "h-full w-full text-neutral-600 dark:text-neutral-300",
                                })}
                            </DockIcon>
                        </DockItem>
                    </Link>
                ))}
                <Separator orientation="vertical" className="bg-foreground/20 w-[1px] h-10" />
                <div onClick={handleLanguageSwitch}>
                    <DockItem className="aspect-square cursor-pointer rounded-full ">
                        <DockLabel>{currentLocale === "es" ? "English" : "Español"}</DockLabel>
                        <DockIcon>
                            <Languages className=" " />
                            <span className="sr-only">Toggle language</span>
                        </DockIcon>
                    </DockItem>
                </div>
                <div onClick={toggleTheme}>
                    <DockItem className="aspect-square cursor-pointer rounded-full ">
                        <DockLabel>{t("theme_toggle")}</DockLabel>
                        <DockIcon>
                            <AnimatePresence mode="wait" initial={false}>
                                {theme === "light" ? (
                                    <motion.div
                                        key="sun"
                                        initial={{ y: -10, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: 10, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Sun className=" text-yellow-500 fill-yellow-500" />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="moon"
                                        initial={{ y: 10, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -10, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Moon className=" text-blue-400 fill-blue-400" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <span className="sr-only">Toggle theme</span>
                        </DockIcon>
                    </DockItem>
                </div>
            </Dock>
        </div>
    )
}

export default function HeroGeometric() {
    const t = useTranslations()
    const { scrollY } = useScroll()
    const { setTheme, theme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const router = useRouter()

    // Scroll transformations
    const y1 = useTransform(scrollY, [0, 300], [0, -50])
    const y2 = useTransform(scrollY, [0, 300], [0, 30])
    const y3 = useTransform(scrollY, [0, 300], [0, -20])
    const rotate1 = useTransform(scrollY, [0, 300], [12, 25])
    const rotate2 = useTransform(scrollY, [0, 300], [-15, -30])
    const rotate3 = useTransform(scrollY, [0, 300], [-8, 5])
    const opacity = useTransform(scrollY, [0, 200], [1, 0.3])

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
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    }

    const currentLocale = typeof window !== "undefined" ? window.location.pathname.split("/")[1] : "es"

    const handleLanguageSwitch = () => {
        const newLocale = currentLocale === "es" ? "en" : "es"
        const restPath = window.location.pathname.split("/").slice(2).join("/")
        router.push(`/${newLocale}${restPath ? "/" + restPath : ""}`)
    }

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light")

    return (
        <div className="relative min-h-screen py-8 sm:py-10 bg-white dark:bg-slate-950">
            <WhatsappBtn />
            <MovilSheet />

            {/* Background shapes */}
            <div className="inset-0 overflow-x-hidden fixed z-[0] pointer-events-none">
                <motion.div style={{ y: y1, rotate: rotate1, opacity }}>
                    <ElegantShape
                        delay={0.3}
                        width={600}
                        height={140}
                        gradient="from-purple-300/60 via-violet-300/50 to-transparent dark:from-purple-400/30 dark:via-violet-400/25"
                        className="left-[-20vw] sm:left-[-10vw] md:left-[-5vw] top-[10vh] md:top-[18vh]"
                    />
                </motion.div>
                <motion.div style={{ y: y2, rotate: rotate2, opacity }}>
                    <ElegantShape
                        delay={0.5}
                        width={500}
                        height={120}
                        gradient="from-fuchsia-300/60 via-pink-300/50 to-transparent dark:from-fuchsia-400/30 dark:via-pink-400/25"
                        className="right-[-10vw] sm:right-[-5vw] md:right-[0vw] top-[60vh] sm:top-[68vh] md:top-[75vh]"
                    />
                </motion.div>
                <motion.div style={{ y: y3, rotate: rotate3, opacity }}>
                    <ElegantShape
                        delay={0.4}
                        width={300}
                        height={80}
                        gradient="from-violet-300/60 via-purple-300/50 to-transparent dark:from-violet-400/30 dark:via-purple-400/25"
                        className="left-[2vw] sm:left-[5vw] md:left-[10vw] bottom-[2vh] sm:bottom-[5vh] md:bottom-[10vh]"
                    />
                </motion.div>
                <motion.div style={{ y: y1, rotate: rotate1, opacity }}>
                    <ElegantShape
                        delay={0.6}
                        width={200}
                        height={60}
                        gradient="from-lavender-300/60 via-purple-200/50 to-transparent dark:from-purple-300/30 dark:via-violet-300/25"
                        className="right-[10vw] sm:right-[15vw] md:right-[20vw] top-[5vh] sm:top-[10vh] md:top-[15vh]"
                    />
                </motion.div>
                <motion.div style={{ y: y2, rotate: rotate2, opacity }}>
                    <ElegantShape
                        delay={0.7}
                        width={150}
                        height={40}
                        gradient="from-indigo-300/60 via-purple-300/50 to-transparent dark:from-indigo-400/30 dark:via-purple-400/25"
                        className="left-[10vw] sm:left-[20vw] md:left-[25vw] top-[2vh] sm:top-[5vh] md:top-[10vh]"
                    />
                </motion.div>
            </div>

            {/* Main content */}
            <div className="relative z-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-6xl mx-auto">
                        <HeroSection t={t} itemVariants={itemVariants} />
                    </motion.div>
                </div>

                <AboutExperienceSection t={t} itemVariants={itemVariants} />
                <ProjectsSection t={t} itemVariants={itemVariants} />
                <ServicesSection />
                <ProcessSection />
                <MetricsSection />
                <TechnologiesSection t={t} itemVariants={itemVariants} />
                <DockNavigation
                    currentLocale={currentLocale}
                    handleLanguageSwitch={handleLanguageSwitch}
                    toggleTheme={toggleTheme}
                    theme={theme}
                />
            </div>
        </div>
    )
}
