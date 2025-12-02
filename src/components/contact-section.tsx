"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Send, MessageSquare } from "lucide-react"

/**
 * Valida estrictamente una cédula de identidad ecuatoriana.
 * @param {string} cedula - El número de cédula a validar.
 * @returns {boolean} - Retorna true si es válida, false si no.
 */
function validarCedulaEcuatoriana(cedula: string) {
  // 1. Validar que no esté vacía y que sean solo números
  if (!cedula || !/^\d+$/.test(cedula)) {
    return false; // Error: Debe contener solo dígitos
  }

  // 2. Validar longitud exacta de 10 dígitos
  if (cedula.length !== 10) {
    return false; // Error: Longitud incorrecta
  }

  // 3. Validar código de provincia (dos primeros dígitos)
  // Rango estricto: 01 a 24. (Se puede incluir 30 para ecuatorianos en el exterior si se requiere)
  const codigoProvincia = parseInt(cedula.substring(0, 2), 10);
  const provinciasValidas = (codigoProvincia >= 1 && codigoProvincia <= 24) || codigoProvincia === 30;
  
  if (!provinciasValidas) {
    return false; // Error: Código de provincia inválido
  }

  // 4. Validar tercer dígito (Tipo de persona)
  // Para cédulas personales, el tercer dígito debe ser menor a 6 (0-5)
  const tercerDigito = parseInt(cedula.charAt(2), 10);
  if (tercerDigito >= 6) {
    return false; // Error: Tercer dígito inválido para persona natural (posible RUC)
  }

  // 5. Algoritmo Módulo 10 (Coeficientes: 2,1,2,1,2,1,2,1,2)
  const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  const digitoVerificador = parseInt(cedula.charAt(9), 10);
  let suma = 0;

  for (let i = 0; i < 9; i++) {
    let valor = parseInt(cedula.charAt(i), 10) * coeficientes[i];
    
    // Si el resultado es mayor o igual a 10, se restan 9
    if (valor >= 10) {
      valor -= 9;
    }
    suma += valor;
  }

  // Calcular dígito verificador esperado
  const modulo = suma % 10;
  const resultado = modulo === 0 ? 0 : 10 - modulo;

  // 6. Comparación final
  return resultado === digitoVerificador;
}

export function ContactSection() {
    const t = useTranslations()

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        cedula: "",
        phone: "",
        message: ""
    })

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        cedula: "",
        phone: "",
        message: ""
    })

    const validateForm = () => {
        let isValid = true
        const newErrors = {
            name: "",
            email: "",
            cedula: "",
            phone: "",
            message: ""
        }

        if (!formData.name.trim()) {
            newErrors.name = t("error_required")
            isValid = false
        }

        if (!formData.email.trim()) {
            newErrors.email = t("error_required")
            isValid = false
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email inválido"
            isValid = false
        }

        if (!formData.cedula.trim()) {
            newErrors.cedula = t("error_required")
            isValid = false
        } else if (!validarCedulaEcuatoriana(formData.cedula)) {
            newErrors.cedula = t("error_cedula_invalid")
            isValid = false
        }

        if (!formData.phone.trim()) {
            newErrors.phone = t("error_required")
            isValid = false
        } else if (!/^\d{10}$/.test(formData.phone)) {
             newErrors.phone = t("error_phone_invalid")
             isValid = false
        }

        if (!formData.message.trim()) {
            newErrors.message = t("error_required")
            isValid = false
        }

        setErrors(newErrors)
        return isValid
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (validateForm()) {
            console.log("Form submitted:", formData)
            // Aquí iría la lógica de envío real
            alert("Formulario válido. Enviando datos...")
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target
        setFormData(prev => ({ ...prev, [id]: value }))
        // Limpiar error al escribir
        if (errors[id as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [id]: "" }))
        }
    }

    const fadeUpVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 1,
                delay: 0.5 + i * 0.2,
                ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number],
            },
        }),
    }

    return (
        <section id="contact" className="container mx-auto px-4 py-24 sm:py-32 relative ">
            {/* Decorative Background Elements */}
         
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center relative z-10">
                {/* Left Column: Copy */}
                <div className="flex flex-col items-start text-left">
                    <motion.div
                        custom={0}
                        variants={fadeUpVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="mb-6"
                    >
                        <Badge
                            variant="outline"
                            className="items-center gap-2 px-3 py-1.5 text-xs font-medium bg-background/80 backdrop-blur-sm border-primary/20 shadow-sm text-muted-foreground inline-flex"
                        >
                            <MessageSquare className="w-3.5 h-3.5 text-primary" />
                            {t("contact_badge")}
                        </Badge>
                    </motion.div>

                    <motion.div
                        custom={1}
                        variants={fadeUpVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="mb-6"
                    >
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6 leading-[1.1]">
                            {t("contact_title")}
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
                            {t("contact_description")}
                        </p>
                    </motion.div>
                </div>

                {/* Right Column: Form */}
                <motion.div
                    custom={2}
                    variants={fadeUpVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="w-full"
                >
                    <div className="relative group">
                        {/* Gradient Border Effect */}
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-2xl opacity-75 blur group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-xy"></div>
                        
                        <Card className="relative p-6 sm:p-8 bg-card/80 backdrop-blur-xl border-primary/10 shadow-lg rounded-2xl">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        {t("form_name")}
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`flex h-10 w-full rounded-md border ${errors.name ? 'border-red-500' : 'border-input'} bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 focus:border-primary/50`}
                                        placeholder={t("form_placeholder_name")}
                                    />
                                    {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="cedula" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            {t("form_cedula")}
                                        </label>
                                        <input
                                            type="text"
                                            id="cedula"
                                            value={formData.cedula}
                                            onChange={handleChange}
                                            maxLength={10}
                                            className={`flex h-10 w-full rounded-md border ${errors.cedula ? 'border-red-500' : 'border-input'} bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 focus:border-primary/50`}
                                            placeholder={t("form_placeholder_cedula")}
                                        />
                                        {errors.cedula && <p className="text-xs text-red-500">{errors.cedula}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="phone" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            {t("form_phone")}
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            maxLength={10}
                                            className={`flex h-10 w-full rounded-md border ${errors.phone ? 'border-red-500' : 'border-input'} bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 focus:border-primary/50`}
                                            placeholder={t("form_placeholder_phone")}
                                        />
                                        {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        {t("form_email")}
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`flex h-10 w-full rounded-md border ${errors.email ? 'border-red-500' : 'border-input'} bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 focus:border-primary/50`}
                                        placeholder={t("form_placeholder_email")}
                                    />
                                    {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        {t("form_message")}
                                    </label>
                                    <textarea
                                        id="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        className={`flex min-h-[120px] w-full rounded-md border ${errors.message ? 'border-red-500' : 'border-input'} bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 focus:border-primary/50`}
                                        placeholder={t("form_placeholder_message")}
                                    />
                                    {errors.message && <p className="text-xs text-red-500">{errors.message}</p>}
                                </div>
                                <Button type="submit" className="w-full group bg-gradient-to-r from-primary via-accent to-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300" size="lg">
                                    {t("form_submit")}
                                    <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </form>
                        </Card>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
