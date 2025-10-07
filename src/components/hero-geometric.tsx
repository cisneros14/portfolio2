
"use client"
import { PinContainer } from '@/components/ui/shadcn-io/3d-pin';
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
    ExternalLink,
    Twitter,
    MapPin,
    HomeIcon,
    SunMoon,
    ScrollText,
    Activity,
    Component,
    Package,
    MailIcon,
    Languages,
} from "lucide-react"
import ThemeToggle from "@/app/[locale]/ThemeToggle"
import { useTranslations } from 'next-intl';
import { Dock, DockIcon, DockItem, DockLabel } from '@/components/ui/shadcn-io/dock/index';
import Link from "next/link"
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Separator } from "@radix-ui/react-separator"
import React from "react"



// Utilidad cn para concatenar clases
function cn(...classes: (string | undefined | false | null)[]) {
    return classes.filter(Boolean).join(" ")
}

function FloatingOrb({
    className,
    delay = 0,
    size = "w-32 h-32",
    gradient = "from-purple-400/20 to-violet-400/20",
}: {
    className?: string
    delay?: number
    size?: string
    gradient?: string
}) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
                duration: 2,
                delay,
                ease: [0.23, 0.86, 0.39, 0.96],
            }}
            className={cn("absolute", className)}
        >
            <motion.div
                animate={{
                    y: [0, -20, 0],
                    rotate: [0, 5, 0],
                }}
                transition={{
                    duration: 8,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                }}
                className={cn("rounded-full blur-xl", "bg-gradient-to-br", gradient, size)}
            />
        </motion.div>
    )
}

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
            initial={{
                opacity: 0,
                y: -150,
                rotate: rotate - 15,
            }}
            animate={{
                opacity: 1,
                y: 0,
                rotate: rotate,
            }}
            transition={{
                duration: 2.4,
                delay,
                ease: [0.23, 0.86, 0.39, 0.96],
                opacity: { duration: 1.2 },
            }}
            className={cn("absolute", className)}
        >
            <motion.div
                animate={{
                    y: [0, 15, 0],
                }}
                transition={{
                    duration: 12,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                }}
                style={{
                    width,
                    height,
                }}
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

export default function HeroGeometric() {
    const t = useTranslations();
    const { scrollY } = useScroll()

    // Transformaciones para las animaciones de scroll
    const y1 = useTransform(scrollY, [0, 300], [0, -50])
    const y2 = useTransform(scrollY, [0, 300], [0, 30])
    const y3 = useTransform(scrollY, [0, 300], [0, -20])
    const rotate1 = useTransform(scrollY, [0, 300], [12, 25])
    const rotate2 = useTransform(scrollY, [0, 300], [-15, -30])
    const rotate3 = useTransform(scrollY, [0, 300], [-8, 5])
    const opacity = useTransform(scrollY, [0, 200], [1, 0.3])

    // Sombra dinámica para el ThemeToggle
    const themeToggleShadow = useTransform(
        scrollY,
        [0, 100],
        ["0px 0px 0px rgba(0,0,0,0)", "0px 4px 20px rgba(0,0,0,0.15)"]
    )

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

    const skillsData = [
        {
            category: "Frontend",
            icon: Code2,
            skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
            gradient: "from-blue-500 to-purple-600",
            bgGradient: "from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50",
            borderColor: "border-blue-200/20 dark:border-blue-800/20",
        },
        {
            category: "Backend",
            icon: Server,
            skills: ["Python", "PHP", "Node.js", "APIs"],
            gradient: "from-purple-500 to-pink-600",
            bgGradient: "from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50",
            borderColor: "border-purple-200/20 dark:border-purple-800/20",
        },
        {
            category: "CMS",
            icon: Database,
            skills: ["WordPress", "Elementor", "WooCommerce", "Custom Themes"],
            gradient: "from-pink-500 to-rose-600",
            bgGradient: "from-pink-50 to-rose-50 dark:from-pink-950/50 dark:to-rose-950/50",
            borderColor: "border-pink-200/20 dark:border-pink-800/20",
        },
        {
            category: "E-commerce",
            icon: ShoppingBag,
            skills: ["Shopify", "Hydrogen", "Oxygen"],
            gradient: "from-rose-500 to-orange-600",
            bgGradient: "from-rose-50 to-orange-50 dark:from-rose-950/50 dark:to-orange-950/50",
            borderColor: "border-rose-200/20 dark:border-rose-800/20",
        },
        {
            category: "Automation",
            icon: Zap,
            skills: ["n8n", "Make", "Workflows"],
            gradient: "from-orange-500 to-yellow-600",
            bgGradient: "from-orange-50 to-yellow-50 dark:from-orange-950/50 dark:to-yellow-950/50",
            borderColor: "border-orange-200/20 dark:border-orange-800/20",
        },
        {
            category: "Deployment",
            icon: Globe,
            skills: ["Vercel"],
            gradient: "from-yellow-500 to-green-600",
            bgGradient: "from-yellow-50 to-green-50 dark:from-yellow-950/50 dark:to-green-950/50",
            borderColor: "border-yellow-200/20 dark:border-yellow-800/20",
        },
    ]




    const data = [
        {
            title: 'Home',
            icon: (
                <HomeIcon className='h-full w-full text-neutral-600 dark:text-neutral-300' />
            ),
            href: '#',
        },
        {
            title: 'Products',
            icon: (
                <Package className='h-full w-full text-neutral-600 dark:text-neutral-300' />
            ),
            href: '#',
        },
        {
            title: 'Components',
            icon: (
                <Component className='h-full w-full text-neutral-600 dark:text-neutral-300' />
            ),
            href: '#',
        },
    ];

    const socialData = [
        {
            icon: Github,
            href: 'https://github.com/cisneros14',
            label: 'GitHub',
        },
        {
            icon: MailIcon,
            href: 'https://twitter.com/cisneros14',
            label: 'Correo Electronico',
        },
        {
            icon: Linkedin,
            href: 'https://linkedin.com/in/cisneros14',
            label: 'LinkedIn',
        },
    ];

    const { setTheme, theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

    return (
        <div className="relative min-h-screen py-10 bg-white dark:bg-slate-950 overflow-hidden">


            {/* ElegantShape background, fixed and responsive positioning */}
            <div className="inset-0 overflow-hidden fixed">
                <motion.div style={{ y: y1, rotate: rotate1, opacity }}>
                    <ElegantShape
                        delay={0.3}
                        width={600}
                        height={140}
                        rotate={0}
                        gradient="from-purple-300/60 via-violet-300/50 to-transparent dark:from-purple-400/30 dark:via-violet-400/25"
                        className="left-[-20vw] sm:left-[-10vw] md:left-[-5vw] top-[10vh] md:top-[18vh]"
                    />
                </motion.div>
                <motion.div style={{ y: y2, rotate: rotate2, opacity }}>
                    <ElegantShape
                        delay={0.5}
                        width={500}
                        height={120}
                        rotate={0}
                        gradient="from-fuchsia-300/60 via-pink-300/50 to-transparent dark:from-fuchsia-400/30 dark:via-pink-400/25"
                        className="right-[-10vw] sm:right-[-5vw] md:right-[0vw] top-[60vh] sm:top-[68vh] md:top-[75vh]"
                    />
                </motion.div>
                <motion.div style={{ y: y3, rotate: rotate3, opacity }}>
                    <ElegantShape
                        delay={0.4}
                        width={300}
                        height={80}
                        rotate={0}
                        gradient="from-violet-300/60 via-purple-300/50 to-transparent dark:from-violet-400/30 dark:via-purple-400/25"
                        className="left-[2vw] sm:left-[5vw] md:left-[10vw] bottom-[2vh] sm:bottom-[5vh] md:bottom-[10vh]"
                    />
                </motion.div>
                <motion.div style={{ y: y1, rotate: rotate1, opacity }}>
                    <ElegantShape
                        delay={0.6}
                        width={200}
                        height={60}
                        rotate={0}
                        gradient="from-lavender-300/60 via-purple-200/50 to-transparent dark:from-purple-300/30 dark:via-violet-300/25"
                        className="right-[10vw] sm:right-[15vw] md:right-[20vw] top-[5vh] sm:top-[10vh] md:top-[15vh]"
                    />
                </motion.div>
                <motion.div style={{ y: y2, rotate: rotate2, opacity }}>
                    <ElegantShape
                        delay={0.7}
                        width={150}
                        height={40}
                        rotate={0}
                        gradient="from-indigo-300/60 via-purple-300/50 to-transparent dark:from-indigo-400/30 dark:via-purple-400/25"
                        className="left-[10vw] sm:left-[20vw] md:left-[25vw] top-[2vh] sm:top-[5vh] md:top-[10vh]"
                    />
                </motion.div>
            </div>

            {/* Grid Pattern - REMOVED */}

            <div className="relative z-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 ">
                    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-6xl mx-auto">
                        {/* Hero Section */}
                        <div className="text-center mb-16 sm:mb-20 lg:mb-24">
                            {/* Status Badge */}
                            <motion.div variants={itemVariants} className="mb-6 sm:mb-8">
                                <Badge
                                    variant="outline"
                                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-purple-200/60 dark:border-purple-800/60 shadow-sm text-slate-600 dark:text-white"
                                >
                                    <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                    {t('available_projects')}
                                </Badge>
                            </motion.div>

                            {/* Name & Title */}
                            <motion.div variants={itemVariants} className="mb-6 sm:mb-8">
                                <h1 className="text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight mb-4 sm:mb-6">
                                    <span className="bg-gradient-to-r from-slate-900 via-purple-900 to-violet-900 dark:from-white dark:via-purple-100 dark:to-violet-100 bg-clip-text text-transparent">
                                        Carlos
                                    </span>
                                    <br />
                                    <span className="bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                                        Cisneros
                                    </span>
                                </h1>
                                <p className="text-xl sm:text-2xl lg:text-3xl font-medium text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
                                    {t('role')}
                                </p>
                            </motion.div>

                            {/* Description */}
                            <motion.div variants={itemVariants} className="mb-8 sm:mb-12">
                                <p className="text-base sm:text-lg lg:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed px-4">
                                    {t('hero_description')}
                                </p>
                            </motion.div>

                            {/* CTA Buttons */}
                            <motion.div
                                variants={itemVariants}
                                className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 sm:mb-16"
                            >
                                <Button
                                    asChild
                                    size="lg"
                                    className="group bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-2 text-base sm:text-lg rounded-xl h-auto animate-bounce"
                                >
                                    <a
                                        href="https://tresore.store"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3"
                                    >
                                        <ShoppingBag className="w-5 h-5" />
                                        {t('view_latest_project')}
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                                    </a>
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="px-8 cursor-pointer py-2 sm:text-lg text-sm rounded-xl h-auto border dark:text-white hover:bg-purple-50 dark:hover:bg-purple-950/50 transition-all duration-300 bg-background"
                                >
                                    <Mail className="w-5 h-5 mr-3" />
                                    {t('contact')}
                                </Button>
                            </motion.div>

                            {/* Social Links */}
                            <motion.div variants={itemVariants}>
                                <div className="flex justify-center gap-4">
                                    {[
                                        {
                                            icon: Mail,
                                            href: "mailto:cisnerosgranda14@gmail.com",
                                            label: "Email",
                                            hoverColor:
                                                "hover:bg-purple-100 dark:hover:bg-purple-900/50 hover:text-purple-600 dark:hover:text-purple-400",
                                        },
                                        {
                                            icon: Github,
                                            href: "https://github.com/cisneros14",
                                            label: "GitHub",
                                            hoverColor:
                                                "hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100",
                                        },
                                        {
                                            icon: Linkedin,
                                            href: "https://www.linkedin.com/in/carlos-cisneros-granda-059469230/",
                                            label: "LinkedIn",
                                            hoverColor:
                                                "hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:text-blue-600 dark:hover:text-blue-400",
                                        },
                                    ].map((social) => (
                                        <Button
                                            key={social.label}
                                            variant="ghost"
                                            size="icon"
                                            asChild
                                            className={cn(
                                                "w-12 h-12 rounded-xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-sm transition-all duration-300 hover:scale-110 hover:shadow-md",
                                                social.hoverColor,
                                            )}
                                        >
                                            <a
                                                href={social.href}
                                                target={social.href.startsWith("http") ? "_blank" : undefined}
                                                rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                                                aria-label={social.label}
                                            >
                                                <social.icon className="w-5 h-5 text-slate-600 dark:text-white" />
                                            </a>
                                        </Button>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        {/* Skills Section */}
                        <motion.div variants={itemVariants}>
                            <div className="text-center mb-12">
                                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                                    {t('technologies')}
                                </h2>
                                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                                    {t('technologies_desc')}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-7xl mx-auto">
                                {skillsData.map((skill, index) => (
                                    <motion.div key={skill.category} variants={itemVariants} transition={{ delay: index * 0.1 }}>
                                        <Card
                                            className={cn(
                                                `group relative p-6 h-full bg-gradient-to-br border ${skill.borderColor} shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 backdrop-blur-md`,
                                                skill.bgGradient,
                                            )}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={cn("p-3 rounded-xl bg-gradient-to-r text-white shadow-sm", skill.gradient)}>
                                                    <skill.icon className="w-6 h-6" />
                                                </div>
                                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{skill.category}</h3>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {skill.skills.map((tech) => (
                                                    <Badge
                                                        key={tech}
                                                        variant="default"
                                                        className="text-xs text-gray-800 bg-foreground/10 dark:bg-foreground/60 font-medium transition-colors duration-200 px-3 py-1 rounded-lg"
                                                    >
                                                        {tech}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
                <div className="flex justify-center items-center mt-5 sm:mt-10">

                    <Button
                        variant="outline"
                        size="lg"
                        className="group bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-2 text-base sm:text-lg rounded-xl h-auto"
                    >
                        <Mail className="w-5 h-5 mr-3" />
                        {t('contact')}
                    </Button>
                </div>
            </div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-20 sm:mt-24 lg:mt-32 relative z-10 shadow-none">
                <div className="text-center mb-12">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                        {t('experience_projects')}
                    </h2>
                    <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        {t('experience_projects_desc')}
                    </p>
                </div>
                <motion.div className="shadow-none">
                    <div className="grid shadow-none grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 h-[800px] md:h-[600px]">
                        {/* About Me - Tall Card (Top Left) */}
                        <Card
                            id="about"
                            className={cn(
                                "group relative p-6 h-full bg-gradient-to-br border shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 backdrop-blur-md",
                                "md:col-span-2 lg:col-span-2 md:row-span-2",
                                "from-purple-50 to-violet-50 dark:from-purple-950/50 dark:to-violet-950/50",
                                "border-purple-200/20 dark:border-purple-800/20"
                            )}
                        >
                            <div className="flex flex-col h-full relative z-10">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                                        <span className="text-2xl font-bold font-sans">FM</span>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-card-foreground font-sans">{t('about_me')}</h2>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                            <MapPin className="w-4 h-4" />
                                            <span className="font-sans">{t('about_me_location')}</span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-muted-foreground leading-relaxed font-sans flex-1 text-sm">
                                    {t('about_me_desc')}
                                </p>
                                <div className="flex flex-wrap gap-2 mt-4">
                                    <Badge variant="outline" className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-purple-200/60 dark:border-purple-800/60 shadow-sm text-slate-600 dark:text-white">
                                        HubSpot CMS
                                    </Badge>
                                    <Badge variant="outline" className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-purple-200/60 dark:border-purple-800/60 shadow-sm text-slate-600 dark:text-white">
                                        JavaScript
                                    </Badge>
                                    <Badge variant="outline" className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-purple-200/60 dark:border-purple-800/60 shadow-sm text-slate-600 dark:text-white">
                                        React
                                    </Badge>
                                    <Badge variant="outline" className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-purple-200/60 dark:border-purple-800/60 shadow-sm text-slate-600 dark:text-white">
                                        Node.js
                                    </Badge>
                                </div>
                            </div>
                        </Card>

                        {/* Experience - Medium Card (Top Middle) */}
                        <Card
                            id="experience"
                            className={cn(
                                "group relative p-6 h-full bg-gradient-to-br border shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 backdrop-blur-md",
                                "md:col-span-2",
                                "from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50",
                                "border-blue-200/20 dark:border-blue-800/20"
                            )}
                        >
                            <div className="relative z-10">
                                <h3 className="font-bold text-card-foreground mb-4 font-sans">{t('experience')}</h3>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <span className="text-xs font-bold font-sans">TC</span>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-card-foreground font-sans text-sm">
                                                {t('senior_fullstack')}
                                            </h4>
                                            <p className="text-xs text-muted-foreground font-sans">{t('senior_fullstack_company')}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <span className="text-xs font-bold font-sans">ST</span>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-card-foreground font-sans text-sm">{t('fullstack')}</h4>
                                            <p className="text-xs text-muted-foreground font-sans">{t('fullstack_company')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Status - Square Card (Top Right) */}
                        <Card
                            className={cn(
                                "group relative p-6 h-full bg-gradient-to-br border shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 backdrop-blur-md",
                                "md:col-span-1",
                                "from-green-50 to-lime-50 dark:from-green-950/50 dark:to-lime-950/50",
                                "border-green-200/20 dark:border-green-800/20"
                            )}
                        >
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-3 h-3 rounded-full bg-primary animate-pulse"></div>
                                    <h3 className="font-semibold text-card-foreground font-sans">{t('available')}</h3>
                                </div>
                                <p className="text-sm text-muted-foreground mb-4 font-sans">{t('open_opportunities')}</p>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground font-sans">{t('projects')}</span>
                                        <span className="font-semibold text-card-foreground font-sans">25+</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground font-sans">{t('years_experience')}</span>
                                        <span className="font-semibold text-card-foreground font-sans">{t('years_value')}</span>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Social Links - Square Card (Bottom Left) */}
                        <Card
                            id="contact"
                            className={cn(
                                "group relative p-6 h-full bg-gradient-to-br border shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 backdrop-blur-md",
                                "md:col-span-1",
                                "from-pink-50 to-rose-50 dark:from-pink-950/50 dark:to-rose-950/50",
                                "border-pink-200/20 dark:border-pink-800/20"
                            )}
                        >
                            <div className="relative z-10">
                                <h3 className="font-semibold text-card-foreground mb-4 font-sans">{t('connect')}</h3>
                                <div className="space-y-3">
                                    <a
                                        href="#"
                                        className="flex items-center gap-3 text-card-foreground hover hover:translate-x-1 transition-all duration-200"
                                    >
                                        <Github className="w-4 h-4" />
                                        <span className="text-sm font-sans text-muted-foreground">{t('github')}</span>
                                    </a>
                                    <a
                                        href="#"
                                        className="flex items-center gap-3 text-card-foreground hover hover:translate-x-1 transition-all duration-200"
                                    >
                                        <Linkedin className="w-4 h-4" />
                                        <span className="text-sm font-sans text-muted-foreground">{t('linkedin')}</span>
                                    </a>
                                    <a
                                        href="#"
                                        className="flex items-center gap-3 text-card-foreground hover hover:translate-x-1 transition-all duration-200"
                                    >
                                        <Twitter className="w-4 h-4" />
                                        <span className="text-sm font-sans text-muted-foreground">{t('twitter')}</span>
                                    </a>
                                    <a
                                        href="#"
                                        className="flex items-center gap-3 text-card-foreground hover hover:translate-x-1 transition-all duration-200"
                                    >
                                        <Mail className="w-4 h-4" />
                                        <span className="text-sm font-sans text-muted-foreground">{t('email')}</span>
                                    </a>
                                </div>
                            </div>
                        </Card>

                        {/* Selected Projects - Large Card (Bottom Right) */}
                        <Card
                            id="projects"
                            className={cn(
                                "group relative p-6 h-full bg-gradient-to-br border shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 backdrop-blur-md",
                                "md:col-span-2 lg:col-span-2",
                                "from-yellow-50 to-green-50 dark:from-yellow-950/50 dark:to-green-950/50",
                                "border-yellow-200/20 dark:border-yellow-800/20"
                            )}
                        >
                            <div className="relative z-10">
                                <h3 className="font-bold text-card-foreground mb-4 font-sans">{t('selected_projects')}</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-card-foreground font-sans">{t('ecommerce_platform')}</h4>
                                            <p className="text-sm text-muted-foreground mb-2 font-sans">
                                                {t('ecommerce_platform_desc')}
                                            </p>
                                            <div className="flex flex-wrap gap-1">
                                                <Badge variant="outline" className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-purple-200/60 dark:border-purple-800/60 shadow-sm text-slate-600 dark:text-white">
                                                    React
                                                </Badge>
                                                <Badge variant="outline" className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-purple-200/60 dark:border-purple-800/60 shadow-sm text-slate-600 dark:text-white">
                                                    Node.js
                                                </Badge>
                                                <Badge variant="outline" className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-purple-200/60 dark:border-purple-800/60 shadow-sm text-slate-600 dark:text-white">
                                                    PostgreSQL
                                                </Badge>
                                            </div>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="ml-3 font-sans bg-transparent hover:bg-primary/10 hover:scale-105 transition-all duration-200 rounded-full"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </Button>
                                    </div>

                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-card-foreground font-sans">{t('task_management_app')}</h4>
                                            <p className="text-sm text-muted-foreground mb-2 font-sans">
                                                {t('task_management_app_desc')}
                                            </p>
                                            <div className="flex flex-wrap gap-1">
                                                <Badge variant="outline" className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-purple-200/60 dark:border-purple-800/60 shadow-sm text-slate-600 dark:text-white">
                                                    Next.js
                                                </Badge>
                                                <Badge variant="outline" className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-purple-200/60 dark:border-purple-800/60 shadow-sm text-slate-600 dark:text-white">
                                                    TypeScript
                                                </Badge>
                                                <Badge variant="outline" className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-purple-200/60 dark:border-purple-800/60 shadow-sm text-slate-600 dark:text-white">
                                                    Socket.io
                                                </Badge>
                                            </div>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="ml-3 font-sans bg-transparent hover:bg-primary/10 hover:scale-105 transition-all duration-200 rounded-full"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                </motion.div>
            </div>
            <div className="container mb-30 mx-auto px-4 sm:px-6 lg:px-8 mt-20 sm:mt-24 lg:mt-32 relative z-10 shadow-none">
                <div className="text-center mb-12">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                        Ultimos proyectos
                    </h2>
                    <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Los proyectos más recientes en los que he trabajado, destacando mis habilidades y experiencia en desarrollo web.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-18">
                    <ThreeDPinDemo />
                    <ThreeDPinDemo />
                    <ThreeDPinDemo />
                </div>
                <motion.div
                    variants={itemVariants}
                    className="flex mt-20 flex-col sm:flex-row gap-4 justify-center items-center mb-12 sm:mb-16"
                >
                    <Button
                        asChild
                        size="lg"
                        className="group bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-2 text-base sm:text-lg rounded-xl h-auto animate-bounce"
                    >
                        <a
                            href="https://tresore.store"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            {t('view_latest_project')}
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                        </a>
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        className="px-8 cursor-pointer py-2 sm:text-lg text-sm rounded-xl h-auto border dark:text-white hover:bg-purple-50 dark:hover:bg-purple-950/50 transition-all duration-300 bg-background"
                    >
                        <Mail className="w-5 h-5 mr-3" />
                        {t('contact')}
                    </Button>
                </motion.div>


            </div>


            <div className="fixed bottom-5 mx-auto left-0 right-0 z-40">

                <Dock className='items-end border pb-3 z-50 bg-gradient-to-r !from-purple-100 !to-pink-100/100 dark:!from-purple-950/80 dark:!to-pink-950/80'>
                    {data.map((item, idx) => (
                        <Link href={item.href} key={idx}>
                            <DockItem className='aspect-square rounded-full '>
                                <DockLabel>{item.title}</DockLabel>
                                <DockIcon>{item.icon}</DockIcon>
                            </DockItem>
                        </Link>
                    ))}
                    <Separator orientation="vertical" className="bg-foreground/20 w-[1px] h-10" />
                    {socialData.map((item, idx) => (
                        <Link href={item.href} key={idx} target="_blank" rel="noopener noreferrer">
                            <DockItem className='aspect-square rounded-full '>
                                <DockLabel>{item.label}</DockLabel>
                                <DockIcon>{React.createElement(item.icon, { className: "h-full w-full text-neutral-600 dark:text-neutral-300" })}</DockIcon>
                            </DockItem>
                        </Link>
                    ))}
                    <Separator orientation="vertical" className="bg-foreground/20 w-[1px] h-10" />
                    <DockItem className="aspect-square cursor-pointer rounded-full ">
                        <DockLabel>Cambiar idioma</DockLabel>
                        <DockIcon  >
                            <Languages className=" " />
                            <span className="sr-only">Toggle language</span>

                        </DockIcon>

                    </DockItem>
                    <div onClick={toggleTheme}>

                        <DockItem className="aspect-square cursor-pointer rounded-full ">
                            <DockLabel>Cambiar Tema</DockLabel>
                            <DockIcon  >
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
        </div>
    )
}



function ThreeDPinDemo() {
    return (
        <PinContainer
            className=''
            title="/ui.shadcn.io"
            href="https://ui.shadcn.com"
        >
            <div className="flex basis-full flex-col tracking-tight sm:basis-1/2 w-[20rem] h-[20rem]">
                <div className="p-4">

                    <h3 className="max-w-xs !pb-2 !m-0 font-bold text-base">
                        shadcn/ui
                    </h3>
                    <div className="text-base !m-0 !p-0 font-normal">
                        <span className="text-slate-500">
                            Beautifully designed components built with Radix UI and Tailwind CSS.
                        </span>
                    </div>
                </div>
                <div className="flex flex-1 w-full rounded-lg mt-4 bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500" />
            </div>
        </PinContainer>
    );
}