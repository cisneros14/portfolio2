export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "García & Asociados",
  description: "Firma de abogados líder, ofreciendo asesoría y representación legal de excelencia para particulares y empresas.",
  url: "https://garciayasociados.com",
  ogImage: "https://garciayasociados.com/og.jpg",
  author: {
    name: "García & Asociados",
    url: "https://garciayasociados.com",
    twitter: "@garciaasociados",
  },
  keywords: ["abogados", "firma legal", "asesoría jurídica", "derecho civil", "derecho corporativo", "litigios"],
  applicationName: "FirmaAbogadosApp",
  creator: "García & Asociados",
  language: "es",
  business: {
    name: "García & Asociados S.L.",
    phone: "+34 900 123 456",
    whatsapp: "34900123456",
    address: "Paseo de la Castellana 45, Madrid, España",
    coordinates: {
      lat: 40.435775,
      long: -3.688790,
    },
    email: "contacto@garciayasociados.com",
    operating_hours: "Mo-Fr 09:00-19:00",
  },
  nav_items: [
    { label: "Inicio", href: "/" },
    { label: "Áreas de Práctica", href: "/services" },
    { label: "El Bufete", href: "/about" },
    { label: "Contacto", href: "/contact" },
  ],
  branding: {
    primary: "#a74d42",
    primary_foreground: "0 0% 100%",
    secondary: "#0f172a",
    secondary_foreground: "0 0% 100%",
    background: "#e6decb",
    font_sans: "font-sans",
    logo_text: "García&Asociados",
  },
  social: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com",
    whatsapp: "https://wa.me/34900123456",
  },
  services: [
    {
      id: "corporativo",
      title: "Derecho Corporativo",
      description: "Asesoramiento integral a empresas, desde su constitución hasta fusiones y adquisiciones.",
      icon: "Briefcase",
      image: "/placeholder.webp"
    },
    {
      id: "civil",
      title: "Derecho Civil",
      description: "Representación en litigios civiles, contratos, herencias y derecho de familia.",
      icon: "Scale",
      image: "/placeholder.webp"
    },
    {
      id: "laboral",
      title: "Derecho Laboral",
      description: "Asesoría en contratación, despidos, negociaciones colectivas y litigios laborales.",
      icon: "Users",
      image: "/placeholder.webp"
    },
    {
      id: "penal",
      title: "Derecho Penal",
      description: "Defensa penal de excelencia, compliance normativo y prevención de delitos corporativos.",
      icon: "ShieldAlert",
      image: "/placeholder.webp"
    },
  ],
  testimonials: [
    {
      name: "Roberto Fernández",
      role: "CEO, Grupo Inversor",
      content: "La asesoría de García & Asociados fue fundamental para la reestructuración de nuestra empresa. Profesionalismo y discreción absolutos.",
      avatar: "https://i.pravatar.cc/150?u=tt",
    },
    {
      name: "Laura Gómez",
      role: "Cliente Particular",
      content: "Me acompañaron en un proceso familiar muy complejo con una empatía y eficacia que superó todas mis expectativas.",
      avatar: "https://i.pravatar.cc/150?u=yy",
    },
    {
      name: "Carlos Mendoza",
      role: "Director Financiero",
      content: "Su equipo de litigios corporativos nos salvó de una disputa millonaria. Son estrategas legales de primer nivel.",
      avatar: "https://i.pravatar.cc/150?u=oo",
    },
  ],
  faq: [
    {
      question: "¿Cuál es el costo de una primera consulta?",
      answer: "La primera consulta de evaluación de caso tiene un costo fijo, el cual es deducido de los honorarios finales si decide contratar nuestros servicios.",
    },
    {
      question: "¿Cuánto puede durar mi proceso legal?",
      answer: "La duración varía enormemente dependiendo de la jurisdicción, la complejidad del caso y si es posible llegar a un acuerdo extrajudicial. En la consulta inicial le daremos una estimación realista.",
    },
    {
      question: "¿Aceptan casos pro bono?",
      answer: "Sí, llevamos un porcentaje de casos pro bono anualmente como parte de nuestro compromiso social. Estos son evaluados por nuestro comité mes a mes.",
    },
    {
      question: "¿Trabajan con empresas internacionales?",
      answer: "Absolutamente. Contamos con un departamento especializado en derecho internacional privado y corporativo, y ofrecemos atención en varios idiomas.",
    },
  ],
  process: [
    {
      title: "Revisión Inicial",
      description: "Análisis exhaustivo de la documentación y los hechos de su caso.",
      icon: "FileText",
    },
    {
      title: "Estrategia Legal",
      description: "Diseño de la mejor ruta legal y alternativas viables.",
      icon: "Map",
    },
    {
      title: "Representación",
      description: "Gestión rigurosa de su caso ante tribunales o en negociaciones.",
      icon: "Scale",
    },
    {
      title: "Resolución",
      description: "Cierre del caso asegurando el cumplimiento de las sentencias o acuerdos.",
      icon: "CheckCircle",
    },
  ],
  pricing: [
    {
      name: "Consulta Legal",
      price: "€150",
      description: "Evaluación inicial de caso y orientación legal.",
      features: ["Revisión de documentos básicos", "Análisis de viabilidad", "Orientación sobre pasos a seguir", "1 hora de atención personalizada"],
      cta: "Agendar Consulta",
      popular: false,
    },
    {
      name: "Asesoría Corporativa",
      price: "€800/mes",
      description: "Retener legal para pymes y corporaciones.",
      features: ["Consultas ilimitadas vía email", "Revisión de contratos (hasta 10/mes)", "Asistencia en juntas directivas", "Auditoría legal semestral", "Descuento en litigios"],
      cta: "Contratar Plan",
      popular: true,
    },
    {
      name: "Representación en Litigio",
      price: "A convenir",
      description: "Defensa o acusación en procesos judiciales.",
      features: ["Estudio profundo del caso", "Representación en todas las instancias", "Estrategia procesal integral", "Acompañamiento constante", "Honorarios basados en complejidad"],
      cta: "Evaluar Caso",
      popular: false,
    },
  ],
  team: [
    {
      name: "Eduardo García",
      role: "Socio Fundador",
      bio: "Especialista en Derecho Societario e Internacional con más de 25 años de experiencia. Ha liderado algunas de las fusiones más importantes del país.",
      image: "/placeholder.webp",
      specialties: ["Derecho Mercantil", "Fusiones y Adquisiciones", "Derecho Internacional"],
      education: "Doctor en Derecho (UAM), LL.M. en Harvard Law School.",
      experience: "25+ años asesorando a empresas del IBEX 35 y multinacionales.",
      social: { twitter: "#", linkedin: "#" }
    },
    {
      name: "Valeria Márquez",
      role: "Socia Directora",
      bio: "Experta en Litigios Civiles y Comerciales. Su enfoque se centra en la resolución estratégica de conflictos complejos y arbitraje internacional.",
      image: "/placeholder.webp",
      specialties: ["Derecho Civil", "Arbitraje", "Derecho de Familia"],
      education: "Licenciada en Derecho (Complutense), Máster en Práctica Jurídica.",
      experience: "Ex magistrada con amplia trayectoria en tribunales superiores.",
      social: { twitter: "#", linkedin: "#" }
    },
    {
      name: "Andrés Silva",
      role: "Director de Derecho Penal",
      bio: "Reconocido penalista especializado en delitos económicos y compliance. Asesor recurrente en prevención de blanqueo de capitales.",
      image: "/placeholder.webp",
      specialties: ["Derecho Penal", "Compliance Corporativo", "Ciberdelincuencia"],
      education: "Grado en Derecho (Salamanca), Máster en Ciencias Penales.",
      experience: "Defensa técnica en procesos de alta complejidad ante la Audiencia Nacional.",
      social: { twitter: "#", linkedin: "#" }
    },
    {
      name: "Sofía Montes",
      role: "Asociada Senior",
      bio: "Especialista en Derecho Laboral y negociaciones colectivas. Experta en procesos de reestructuración de plantillas y auditorías laborales.",
      image: "/placeholder.webp",
      specialties: ["Derecho Laboral", "Seguridad Social", "Recursos Humanos"],
      education: "Grado en Relaciones Laborales y Derecho (Universidad de Valencia).",
      experience: "Líder en negociaciones colectivas para sectores industriales y de servicios.",
      social: { twitter: "#", linkedin: "#" }
    }
  ],  sectionTitles: {
    services: {
      title: "Nuestras Áreas de Práctica",
      description: "Conocimiento especializado para ofrecer la defensa y el asesoramiento legal más sólido.",
    },
    testimonials: {
      title: "Casos de Éxito",
      description: "La confianza de nuestros clientes es nuestro mayor aval y orgullo.",
    },
    faq: {
      title: "Consultas Frecuentes",
      description: "Respuestas a las preguntas comunes antes de iniciar un proceso legal.",
    },
    contact: {
      title: "Comuníquese con Nosotros",
      description: "Su tranquilidad comienza con la asesoría adecuada. Contáctenos hoy.",
      formTitle: "Solicitar Evaluación",
      formDescription: "Bríndenos un resumen de su caso y nos pondremos en contacto con prontitud.",
    },
  },
  hero: {
    badge: {
      text: "Líderes en resolución de conflictos corporativos",
      href: "#",
      icon: "ShieldCheck"
    },
    title: "Experiencia, Integridad y Resultados.",
    description: "Defendemos sus intereses con rigor profesional. Somos una firma de abogados dedicada a proporcionar soluciones jurídicas estratégicas y eficientes.",
    primaryCta: {
      text: "Conozca Nuestras Áreas",
      href: "/services",
      icon: "Scale"
    },
    secondaryCta: {
      text: "Agendar Consulta",
      icon: "Calendar"
    },
    image: {
      src: "/placeholder.webp", 
      alt: "García & Asociados Oficinas"
    }
  },

  categories: [
    {
      id: "corporativo",
      name: "Corporativo",
      icon: "Briefcase",
      href: "/services#corporativo",
      description: "Asesoramiento integral para empresas, cubriendo desde la constitución legal hasta la gestión de fusiones, adquisiciones y cumplimiento normativo. Nos convertimos en el aliado estratégico de su negocio.",
      image: "/placeholder.webp"
    },
    {
      id: "civil",
      name: "Civil",
      icon: "Building",
      href: "/services#civil",
      description: "Especialistas en la resolución de conflictos entre particulares. Abarcamos derecho de familia, sucesiones, contratos y reclamaciones de responsabilidad civil con un enfoque humano y profesional.",
      image: "/placeholder.webp"
    },
    {
      id: "penal",
      name: "Penal",
      icon: "Gavel",
      href: "/services#penal",
      description: "Defensa penal técnica y estratégica. Expertos en delitos económicos, derecho penal corporativo y representación en procesos judiciales complejos, garantizando siempre la presunción de inocencia.",
      image: "/placeholder.webp"
    },
    {
      id: "laboral",
      name: "Laboral",
      icon: "Users",
      href: "/services#laboral",
      description: "Protegemos la relación entre empleadores y trabajadores. Asesoría en contratación, prevención de riesgos laborales, despidos y negociaciones colectivas para asegurar el cumplimiento de la ley.",
      image: "/placeholder.webp"
    },
  ],

  featuredProducts: [
    {
      id: "1",
      name: 'Auditoría Legal Preventiva (Due Diligence)',
      price: 1500,
      rating: 5.0,
      reviewsCount: 45,
      imageLight: "/products/starter-plan.png",
      imageDark: "/products/starter-plan-dark.png",
      discountBadge: "Empresarial",
      features: [
        { label: "Informe Completo", iconType: "check" as const },
        { label: "Prevención de Riesgos", iconType: "check" as const },
      ],
    },
    {
      id: "2",
      name: "Kit de Contratos Laborales Estandarizados",
      price: 350,
      rating: 4.8,
      reviewsCount: 112,
      imageLight: "/products/business-plan.png",
      imageDark: "/products/business-plan-dark.png",
      discountBadge: "-10%",
      features: [
        { label: "Adaptado a Ley Actual", iconType: "check" as const },
        { label: "Uso Ilimitado", iconType: "check" as const },
      ],
    },
    {
      id: "3",
      name: "Registro de Marca Comercial",
      price: 450,
      rating: 4.9,
      reviewsCount: 89,
      imageLight: "/products/corporate-plan.png",
      imageDark: "/products/corporate-plan-dark.png",
      discountBadge: "Trámite Total",
      features: [
        { label: "Búsqueda de Antecedentes", iconType: "check" as const },
        { label: "Gestión Administrativa", iconType: "check" as const },
      ],
    },
  ],

  valueProposition: {
    title: "Nuestro Compromiso Jurídico",
    description: "Más de dos décadas de experiencia nos permiten ofrecer soluciones legales impecables, marcadas por la ética, la confidencialidad y la búsqueda incesante del éxito para nuestros clientes.",
    items: [
      {
        icon: "ShieldCheck",
        title: "Ética Profesional",
        description: "Actuamos bajo los más estrictos estándares de probidad y transparencia en cada caso.",
      },
      {
        icon: "Award",
        title: "Experiencia Probada",
        description: "Un equipo multidisciplinario con historial de éxitos en litigios y negociaciones complejas.",
      },
      {
        icon: "Lock",
        title: "Confidencialidad Absoluta",
        description: "El secreto profesional es la piedra angular de nuestra relación con cada cliente.",
      },
      {
        icon: "Target",
        title: "Estrategias a Medida",
        description: "No existen dos casos iguales. Diseñamos planes de acción específicos para su situación.",
      },
    ]
  },

  cta: {
    title: "¿Requiere asistencia legal inmediata?",
    description: "No deje su situación jurídica al azar. Nuestro equipo de abogados está listo para evaluar su caso y proteger sus derechos.",
    buttonText: "Contactar a un Abogado",
  },

  about: {
    title: "Nuestra Historia",
    description: "García & Asociados fue fundada con el propósito de ofrecer una práctica legal que combine la rigurosidad académica con un enfoque práctico y orientado a resultados. Hoy somos una de las firmas más respetadas del país, defendiendo los intereses de corporaciones multinacionales y particulares por igual.",
    features: [
      "Abogados con posgrados internacionales",
      "Atención de emergencias legales 24/7",
      "Red de contactos a nivel global",
      "Responsabilidad social corporativa",
    ],
    image: "/about-image.jpg"
  },
  catalog: {
    categories: [
      { id: "civil", label: "Contratos Civiles", count: 24 },
      { id: "laboral", label: "Paquetes Laborales", count: 15 },
      { id: "mercantil", label: "Documentación Mercantil", count: 32 },
      { id: "propiedad-intelectual", label: "Propiedad Intelectual", count: 18 },
      { id: "inmobiliario", label: "Derecho Inmobiliario", count: 11 },
    ],
    shippingRegions: [
        { id: "presencial", label: "Presencial (Madrid)" },
        { id: "online", label: "Asesoría Online (Nacional)" },
        { id: "internacional", label: "Asuntos Internacionales" },
    ],
  },
  
  products: [
    {
      id: "1",
      name: 'Auditoría Integral de Riesgos Laborales',
      price: 1200,
      rating: 5.0,
      reviewsCount: 34,
      imageLight: "https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front.svg",
      imageDark: "https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front-dark.svg",
      discountBadge: "Top Servicio",
      features: [
        { label: "Informe Detallado", iconType: "default" as const },
        { label: "Plan de Acción", iconType: "check" as const },
      ],
      images: [
          "https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front.svg",
      ],
      description: "Revisión exhaustiva de la situación laboral de su empresa para identificar contingencias y prevenir conflictos laborales.",
      colors: [],
      capacities: [],
      specs: [
          { label: "Duración Estimada", value: "2 semanas" },
          { label: "Entregables", value: "Informe Ejecutivo y Matriz de Riesgo" },
      ]
    },
    {
      id: "2",
      name: "Pacto de Socios (Startups y Pymes)",
      price: 850,
      rating: 4.9,
      reviewsCount: 56,
      imageLight: "https://flowbite.s3.amazonaws.com/blocks/e-commerce/iphone-light.svg",
      imageDark: "https://flowbite.s3.amazonaws.com/blocks/e-commerce/iphone-dark.svg",
      discountBadge: "Recomendado",
      features: [
        { label: "Personalizado", iconType: "check" as const },
        { label: "Garantía Legal", iconType: "check" as const },
      ],
      images: ["https://flowbite.s3.amazonaws.com/blocks/e-commerce/iphone-light.svg"],
      description: "Redacción de un pacto de socios estructurado para evitar conflictos a futuro en empresas emergentes.",
      colors: [],
      capacities: [],
      specs: [
          { label: "Reuniones", value: "Incluye 2 sesiones de negociación" }
      ]
    },
  ],
};
