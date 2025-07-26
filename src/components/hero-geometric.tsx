"use client"

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
} from "lucide-react"
import ThemeToggle from "@/app/ThemeToggle"

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
            category: "Database",
            icon: Database,
            skills: ["PostgreSQL", "MongoDB", "Redis", "Supabase"],
            gradient: "from-pink-500 to-rose-600",
            bgGradient: "from-pink-50 to-rose-50 dark:from-pink-950/50 dark:to-rose-950/50",
            borderColor: "border-pink-200/20 dark:border-pink-800/20",
        },
        {
            category: "E-commerce",
            icon: ShoppingBag,
            skills: ["Shopify", "Hydrogen", "Oxygen", "Stripe"],
            gradient: "from-rose-500 to-orange-600",
            bgGradient: "from-rose-50 to-orange-50 dark:from-rose-950/50 dark:to-orange-950/50",
            borderColor: "border-rose-200/20 dark:border-rose-800/20",
        },
        {
            category: "Automation",
            icon: Zap,
            skills: ["n8n", "Make", "Zapier", "Workflows"],
            gradient: "from-orange-500 to-yellow-600",
            bgGradient: "from-orange-50 to-yellow-50 dark:from-orange-950/50 dark:to-yellow-950/50",
            borderColor: "border-orange-200/20 dark:border-orange-800/20",
        },
        {
            category: "Deployment",
            icon: Globe,
            skills: ["Vercel", "AWS", "Docker", "CI/CD"],
            gradient: "from-yellow-500 to-green-600",
            bgGradient: "from-yellow-50 to-green-50 dark:from-yellow-950/50 dark:to-green-950/50",
            borderColor: "border-yellow-200/20 dark:border-yellow-800/20",
        },
    ]

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
                                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-purple-200/60 dark:border-purple-800/60 shadow-sm text-slate-600 dark:text-white"
                                >
                                    <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                    Available for new projects
                                </Badge>
                            </motion.div>

                            {/* Name & Title */}
                            <motion.div variants={itemVariants} className="mb-6 sm:mb-8">
                                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight mb-4 sm:mb-6">
                                    <span className="bg-gradient-to-r from-slate-900 via-purple-900 to-violet-900 dark:from-white dark:via-purple-100 dark:to-violet-100 bg-clip-text text-transparent">
                                        Carlos
                                    </span>
                                    <br />
                                    <span className="bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                                        Cisneros
                                    </span>
                                </h1>
                                <p className="text-xl sm:text-2xl lg:text-3xl font-medium text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
                                    Full Stack Developer & Digital Solutions Architect
                                </p>
                            </motion.div>

                            {/* Description */}
                            <motion.div variants={itemVariants} className="mb-8 sm:mb-12">
                                <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed px-4">
                                    Crafting exceptional digital experiences through elegant code, innovative automation, and scalable
                                    e-commerce solutions that drive business growth.
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
                                    className="group bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-2 text-base sm:text-lg rounded-xl h-auto"
                                >
                                    <a
                                        href="https://tresore.store"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3"
                                    >
                                        <ShoppingBag className="w-5 h-5" />
                                        View Latest Project
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                                    </a>
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="px-8 py-2 sm:text-lg text-sm rounded-xl h-auto border dark:text-white hover:bg-purple-50 dark:hover:bg-purple-950/50 transition-all duration-300 bg-background"
                                >
                                    <Mail className="w-5 h-5 mr-3" />
                                    Get In Touch
                                </Button>
                            </motion.div>

                            {/* Social Links */}
                            <motion.div variants={itemVariants}>
                                <div className="flex justify-center gap-4">
                                    {[
                                        {
                                            icon: Mail,
                                            href: "mailto:carlos@email.com",
                                            label: "Email",
                                            hoverColor:
                                                "hover:bg-purple-100 dark:hover:bg-purple-900/50 hover:text-purple-600 dark:hover:text-purple-400",
                                        },
                                        {
                                            icon: Github,
                                            href: "https://github.com/carloscisneros",
                                            label: "GitHub",
                                            hoverColor:
                                                "hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100",
                                        },
                                        {
                                            icon: Linkedin,
                                            href: "https://linkedin.com/in/carloscisneros",
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
                                    Expertise & Technologies
                                </h2>
                                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                                    Specialized in modern web technologies, automation tools, and scalable solutions
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
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
                                                        variant="secondary"
                                                        className="text-xs font-medium bg-white/70 dark:bg-zinc-800/90 hover:bg-white/90 dark:hover:bg-slate-800/90 dark:text-white transition-colors duration-200 px-3 py-1 rounded-lg"
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
                        className="px-8 py-2 sm:text-lg text-sm rounded-xl h-auto border dark:text-white hover:bg-purple-50 dark:hover:bg-purple-950/50 transition-all duration-300 bg-background"
                    >
                        <Mail className="w-5 h-5 mr-3" />
                        Get In Touch
                    </Button>
                </div>
            </div>
        </div>
    )
}