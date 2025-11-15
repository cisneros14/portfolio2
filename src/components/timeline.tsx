import React from "react";
import { Badge } from "@/components/ui/badge";
import {
    Users,
    Layout,
    Palette,
    Code,
    CheckCircle,
    UploadCloud,
    RefreshCw,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { motion, useScroll, useTransform, useMotionValue } from "framer-motion";

const getProcessSteps = (t: any) => [
    {
        title: t("timeline_step1_title"),
        description: t("timeline_step1_description"),
        result: "El resultado: un entendimiento claro de tu marca y lo que realmente necesitas.",
        icon: Users,
        gradient: "from-purple-500 to-violet-600",
    },
    {
        title: t("timeline_step2_title"),
        description: t("timeline_step2_description"),
        result: "El resultado: un esquema (wireframe o boceto) que define la estructura del sitio.",
        icon: Layout,
        gradient: "from-violet-500 to-fuchsia-600",
    },
    {
        title: t("timeline_step3_title"),
        description: t("timeline_step3_description"),
        result: "El resultado: un diseño atractivo, moderno y coherente con tu imagen empresarial.",
        icon: Palette,
        gradient: "from-fuchsia-500 to-pink-600",
    },
    {
        title: t("timeline_step4_title"),
        description: t("timeline_step4_description"),
        result: "El resultado: un sitio web rápido, seguro y totalmente responsive.",
        icon: Code,
        gradient: "from-pink-500 to-rose-600",
    },
    {
        title: t("timeline_step5_title"),
        description: t("timeline_step5_description"),
        result: "El resultado: una versión final aprobada por ti.",
        icon: CheckCircle,
        gradient: "from-rose-500 to-purple-600",
    },
    {
        title: t("timeline_step6_title"),
        description: t("timeline_step6_description"),
        result: "El resultado: tu web publicada, lista para recibir visitantes.",
        icon: UploadCloud,
        gradient: "from-purple-500 to-indigo-600",
    },
    {
        title: t("timeline_step7_title"),
        description: t("timeline_step7_description"),
        result: "El resultado: un sitio siempre actualizado, protegido y en crecimiento.",
        icon: RefreshCw,
        gradient: "from-indigo-500 to-blue-600",
    },
];

export default function ProcessTimeline() {
    const t = useTranslations();
    const processSteps = getProcessSteps(t);
    
    const [currentStep, setCurrentStep] = React.useState(1);
    const stepRefs = React.useRef<(HTMLDivElement | null)[]>([]);

    // Hook para detectar el scroll global para rotación
    const { scrollYProgress } = useScroll();

    // Transformar el scroll en rotación
    const rotate = useTransform(scrollYProgress, [0, 1], [0, 780]);
    
    // Usar Intersection Observer para detectar qué paso está visible al nivel del sticky
    React.useEffect(() => {
        const observers: IntersectionObserver[] = [];
        
        stepRefs.current.forEach((stepElement, index) => {
            if (!stepElement) return;
            
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        // Si el paso está intersectando con el área definida
                        if (entry.isIntersecting) {
                            setCurrentStep(index + 1);
                        }
                    });
                },
                {
                    // Área de detección: top 20-40% de la pantalla (donde está el sticky)
                    rootMargin: "-20% 0px -60% 0px",
                    threshold: 0.3 // 30% del paso debe estar visible
                }
            );
            
            observer.observe(stepElement);
            observers.push(observer);
        });
        
        return () => {
            observers.forEach(observer => observer.disconnect());
        };
    }, []);

    return (
        // Use a grid container so `col-span-*` classes apply and `sticky` works as expected
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 mx-auto py-12 md:py-20 px-6">
            <div className="hidden md:block col-span-1 md:col-span-6 mb-20 md:mb-0 ">
                <div className="sticky top-28 self-start ">
                    <div className="relative w-full flex justify-center ">
                        {/* Contenedor que rota */}
                        <motion.div
                            style={{ rotate }}
                            className="relative"
                        >
                            <div className="group relative inline-block ">
                                {/* Fondo con gradiente radial difuminado */}
                                <div
                                    className="absolute inset-0 rounded-full pointer-events-none"
                                    style={{
                                        background:
                                            "radial-gradient(circle at 20% 20%, rgba(168,85,247,0.32) 0%, rgba(217,70,239,0.25) 18%, rgba(236,72,153,0.12) 36%, rgba(236,72,153,0.08) 28%, transparent 48%)",
                                        filter: "blur(60px)",
                                        transform: "translateZ(0)",
                                    }}
                                />
                                
                                {/* Imagen con drop-shadow directo */}
                                <Image
                                    src="/imgOrb.png"
                                    alt="Decorative timeline image"
                                    width={500}
                                    height={500}
                                    className="relative w-100 max-w-[170px] h-auto rounded-full"
                                    style={{
                                        filter: "drop-shadow(0 0 12px rgba(168,85,247,0.3)) drop-shadow(0 0 24px rgba(217,70,239,0.3)) drop-shadow(0 0 36px rgba(236,72,153,0.2))",
                                    }}
                                />
                            </div>
                        </motion.div>
                        
                        {/* Texto del paso - NO rota, permanece estático */}
                        <motion.div 
                            className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        >
                            <div className="text-center">
                                <motion.span 
                                    className="text-5xl font-bold text-white"
                                    style={{
                                        textShadow: "0 0 20px rgba(168,85,247,0.5), 0 0 40px rgba(217,70,239,0.3)",
                                    }}
                                >
                                    {currentStep}
                                </motion.span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
            <div className="relative col-span-1 md:col-span-6">
                {/* Timeline line */}
                <div className="absolute left-0 top-4 bottom-0 border-l-2" />

                {processSteps.map(({ title, description, result, icon, gradient }, index) => (
                    <div 
                        key={index} 
                        ref={(el) => { stepRefs.current[index] = el; }}
                        className="relative pl-8 pb-12 last:pb-0"
                    >
                        {/* Timeline dot */}
                        <div className="absolute h-3 w-3 -translate-x-1/2 left-px top-3 rounded-full border-2 border-foreground bg-background ring-8 ring-background" />

                        {/* Content */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2.5">
                                <div className={`shrink-0 h-9 w-9 rounded-full flex items-center justify-center bg-linear-to-br ${gradient} shadow-lg`}>
                                    {icon ? (
                                        React.createElement(icon, { className: "h-5 w-5 text-white" })
                                    ) : null}
                                </div>
                                <span className="text-base font-medium">{t("timeline_step")} {index + 1}</span>
                            </div>
                            <div>
                                <h3 className="text-2xl font-semibold">{title}</h3>
                            </div>
                            <p className="text-sm sm:text-base text-muted-foreground">{description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
