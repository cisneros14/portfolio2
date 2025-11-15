import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export interface GhostPageContent {
  title: string;
  description: string;
  slug: string;
  content: string;
  keywords: string[];
  location: string;
  price: string;
  service: string;
}

// Palabras clave y variaciones para generar contenido
const KEYWORDS = {
  services: [
    'landing pages baratas',
    'páginas web económicas',
    'sitios web accesibles',
    'landing pages low-cost',
    'páginas web baratas',
    'sitios web económicos',
    'landing pages rápidas',
    'páginas web profesionales',
    'marketing digital Ecuador',
    'desarrollo web Ecuador'
  ],
  locations: [
    'Quito',
    'Guayaquil',
    'Cuenca',
    'Ambato',
    'Machala',
    'Manta',
    'Portoviejo',
    'Loja',
    'Ibarra',
    'Quevedo',
    'Ecuador'
  ],
  prices: [
    'desde $79',
    'desde $89',
    'desde $149',
    'desde $199',
    'solo $79',
    'solo $89',
    'solo $149',
    'solo $199',
    'a partir de $79',
    'a partir de $89'
  ],
  businessTypes: [
    'restaurantes',
    'tiendas online',
    'consultorios médicos',
    'gimnasios',
    'peluquerías',
    'talleres mecánicos',
    'clínicas veterinarias',
    'academias',
    'hoteles',
    'agencias de viajes',
    'empresas de servicios',
    'startups',
    'emprendimientos',
    'pequeños negocios'
  ]
};

// Generar slugs únicos basados en combinaciones
export function generateGhostSlugs(count: number = 1000): string[] {
  const slugs: string[] = [];
  const usedSlugs = new Set<string>();

  for (let i = 0; i < count; i++) {
    let slug: string;
    let attempts = 0;
    
    do {
      const service = KEYWORDS.services[Math.floor(Math.random() * KEYWORDS.services.length)];
      const location = KEYWORDS.locations[Math.floor(Math.random() * KEYWORDS.locations.length)];
      const businessType = KEYWORDS.businessTypes[Math.floor(Math.random() * KEYWORDS.businessTypes.length)];
      const price = KEYWORDS.prices[Math.floor(Math.random() * KEYWORDS.prices.length)];
      
      // Crear diferentes variaciones de slugs
      const variations = [
        `${service.replace(/\s+/g, '-')}-${location.toLowerCase()}`,
        `${businessType}-${service.replace(/\s+/g, '-')}-${location.toLowerCase()}`,
        `${service.replace(/\s+/g, '-')}-${price.replace(/\s+/g, '-')}-${location.toLowerCase()}`,
        `${businessType}-${location.toLowerCase()}-${service.replace(/\s+/g, '-')}`,
        `${location.toLowerCase()}-${service.replace(/\s+/g, '-')}-${price.replace(/\s+/g, '-')}`,
        `${service.replace(/\s+/g, '-')}-profesionales-${location.toLowerCase()}`,
        `${businessType}-web-${location.toLowerCase()}`,
        `${service.replace(/\s+/g, '-')}-rapidas-${location.toLowerCase()}`
      ];
      
      slug = variations[Math.floor(Math.random() * variations.length)];
      attempts++;
    } while (usedSlugs.has(slug) && attempts < 10);
    
    if (!usedSlugs.has(slug)) {
      usedSlugs.add(slug);
      slugs.push(slug);
    }
  }
  
  return slugs;
}

// Generar contenido con IA para una página fantasma específica
export async function generateGhostPageContent(
  slug: string, 
  locale: string = 'es'
): Promise<GhostPageContent> {
  const service = KEYWORDS.services[Math.floor(Math.random() * KEYWORDS.services.length)];
  const location = KEYWORDS.locations[Math.floor(Math.random() * KEYWORDS.locations.length)];
  const price = KEYWORDS.prices[Math.floor(Math.random() * KEYWORDS.prices.length)];
  const businessType = KEYWORDS.businessTypes[Math.floor(Math.random() * KEYWORDS.businessTypes.length)];

  const isEnglish = locale === 'en';
  
  const prompt = isEnglish 
    ? `Create SEO-optimized content for Agility, a company in Quito, Ecuador that creates affordable landing pages. 
    
    Focus on: ${service} in ${location}, Ecuador. Price: ${price}. Target: ${businessType}.
    
    Generate:
    1. Title (60-70 chars): Focus on "cheap landing pages", "affordable websites", "low-cost web design"
    2. Meta description (150-160 chars): Persuasive, mention price, location, speed
    3. Content (300-400 words): Convince small businesses they need a professional website
    4. Keywords: 5-8 relevant terms
    5. Location: ${location}, Ecuador
    6. Price: ${price}
    7. Service: ${service}
    
    Emphasize: Low prices, fast delivery, professional results, local Ecuador presence, Quito headquarters.
    Tone: Persuasive, professional, conversion-focused.
    Target: Small businesses, entrepreneurs, startups looking for affordable web solutions.`
    
    : `Crea contenido SEO optimizado para Agility, una empresa en Quito, Ecuador que crea landing pages económicas.
    
    Enfoque: ${service} en ${location}, Ecuador. Precio: ${price}. Target: ${businessType}.
    
    Genera:
    1. Título (60-70 caracteres): Enfócate en "landing pages baratas", "páginas web económicas", "diseño web low-cost"
    2. Meta descripción (150-160 caracteres): Persuasiva, menciona precio, ubicación, rapidez
    3. Contenido (300-400 palabras): Convence a pequeños negocios que necesitan una página web profesional
    4. Keywords: 5-8 términos relevantes
    5. Ubicación: ${location}, Ecuador
    6. Precio: ${price}
    7. Servicio: ${service}
    
    Enfatiza: Precios bajos, entrega rápida, resultados profesionales, presencia local en Ecuador, sede en Quito.
    Tono: Persuasivo, profesional, enfocado en conversiones.
    Target: Pequeños negocios, emprendedores, startups buscando soluciones web accesibles.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: isEnglish 
            ? "You are an expert SEO copywriter specializing in web design and digital marketing services for small businesses in Ecuador."
            : "Eres un experto copywriter SEO especializado en servicios de diseño web y marketing digital para pequeños negocios en Ecuador."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.8,
    });

    const response = completion.choices[0]?.message?.content || '';
    
    // Parsear la respuesta estructurada
    const lines = response.split('\n').filter(line => line.trim());
    let title = '';
    let description = '';
    let content = '';
    let keywords: string[] = [];
    
    let currentSection = '';
    for (const line of lines) {
      if (line.includes('Title') || line.includes('Título')) {
        currentSection = 'title';
        title = line.replace(/^\d+\.?\s*(Title|Título):?\s*/i, '').trim();
      } else if (line.includes('Meta description') || line.includes('Meta descripción')) {
        currentSection = 'description';
        description = line.replace(/^\d+\.?\s*(Meta description|Meta descripción):?\s*/i, '').trim();
      } else if (line.includes('Content') || line.includes('Contenido')) {
        currentSection = 'content';
        content = line.replace(/^\d+\.?\s*(Content|Contenido):?\s*/i, '').trim();
      } else if (line.includes('Keywords') || line.includes('Palabras clave')) {
        currentSection = 'keywords';
        const keywordText = line.replace(/^\d+\.?\s*(Keywords|Palabras clave):?\s*/i, '').trim();
        keywords = keywordText.split(',').map(k => k.trim());
      } else if (currentSection === 'content' && line.trim()) {
        content += ' ' + line.trim();
      }
    }

    // Fallback si no se pudo parsear correctamente
    if (!title) {
      title = isEnglish 
        ? `${service} ${price} in ${location}, Ecuador | Agility Web Design`
        : `${service} ${price} en ${location}, Ecuador | Agility Diseño Web`;
    }
    
    if (!description) {
      description = isEnglish
        ? `Professional ${service} ${price} in ${location}, Ecuador. Fast, affordable, and effective web solutions for ${businessType}. Contact Agility today!`
        : `Profesionales ${service} ${price} en ${location}, Ecuador. Soluciones web rápidas, económicas y efectivas para ${businessType}. ¡Contacta a Agility hoy!`;
    }
    
    if (!content) {
      content = isEnglish
        ? `Transform your ${businessType} with professional ${service} in ${location}, Ecuador. Agility delivers fast, affordable, and high-converting websites that help your business grow. Our expert team in Quito creates stunning landing pages that drive results. Don't let your competitors get ahead - get your professional website ${price} today!`
        : `Transforma tu ${businessType} con ${service} profesionales en ${location}, Ecuador. Agility entrega sitios web rápidos, económicos y de alta conversión que ayudan a tu negocio a crecer. Nuestro equipo experto en Quito crea landing pages impresionantes que generan resultados. No dejes que tu competencia se adelante - ¡obtén tu página web profesional ${price} hoy!`;
    }
    
    if (keywords.length === 0) {
      keywords = [
        service,
        `${location} Ecuador`,
        'diseño web',
        'landing pages',
        businessType,
        'marketing digital',
        'páginas web baratas',
        'Agility'
      ];
    }

    return {
      title,
      description,
      slug,
      content,
      keywords,
      location: `${location}, Ecuador`,
      price,
      service
    };
    
  } catch (error) {
    console.error('Error generating content with AI:', error);
    
    // Fallback content si falla la IA
    return {
      title: isEnglish 
        ? `${service} ${price} in ${location}, Ecuador | Agility Web Design`
        : `${service} ${price} en ${location}, Ecuador | Agility Diseño Web`,
      description: isEnglish
        ? `Professional ${service} ${price} in ${location}, Ecuador. Fast, affordable, and effective web solutions for ${businessType}. Contact Agility today!`
        : `Profesionales ${service} ${price} en ${location}, Ecuador. Soluciones web rápidas, económicas y efectivas para ${businessType}. ¡Contacta a Agility hoy!`,
      slug,
      content: isEnglish
        ? `Transform your ${businessType} with professional ${service} in ${location}, Ecuador. Agility delivers fast, affordable, and high-converting websites that help your business grow. Our expert team in Quito creates stunning landing pages that drive results. Don't let your competitors get ahead - get your professional website ${price} today!`
        : `Transforma tu ${businessType} con ${service} profesionales en ${location}, Ecuador. Agility entrega sitios web rápidos, económicos y de alta conversión que ayudan a tu negocio a crecer. Nuestro equipo experto en Quito crea landing pages impresionantes que generan resultados. No dejes que tu competencia se adelante - ¡obtén tu página web profesional ${price} hoy!`,
      keywords: [
        service,
        `${location} Ecuador`,
        'diseño web',
        'landing pages',
        businessType,
        'marketing digital',
        'páginas web baratas',
        'Agility'
      ],
      location: `${location}, Ecuador`,
      price,
      service
    };
  }
}

// Cache para evitar regenerar contenido
const contentCache = new Map<string, GhostPageContent>();

// Cargar contenido pre-generado desde archivos JSON
let preGeneratedContent: GhostPageContent[] | null = null;

async function loadPreGeneratedContent(locale: string): Promise<GhostPageContent[]> {
  if (preGeneratedContent) {
    return preGeneratedContent;
  }
  
  try {
    const allContent: GhostPageContent[] = [];
    // Cargar los 11 archivos batch
    for (let i = 1; i <= 11; i++) {
      try {
        const batch = await import(`@/data/ghost-content/${locale}/batch-${i}.json`);
        allContent.push(...batch.default);
      } catch (e) {
        console.log(`Batch ${i} not found for locale ${locale}`);
      }
    }
    preGeneratedContent = allContent;
    return allContent;
  } catch (error) {
    console.error('Error loading pre-generated content:', error);
    return [];
  }
}

export async function getCachedGhostContent(slug: string, locale: string): Promise<GhostPageContent> {
  const cacheKey = `${slug}-${locale}`;
  
  if (contentCache.has(cacheKey)) {
    return contentCache.get(cacheKey)!;
  }
  
  // Intentar cargar contenido pre-generado primero
  const preGenerated = await loadPreGeneratedContent(locale);
  const existingContent = preGenerated.find(c => c.slug === slug);
  
  if (existingContent) {
    contentCache.set(cacheKey, existingContent);
    return existingContent;
  }
  
  // Si no existe pre-generado, generar con IA (fallback)
  const content = await generateGhostPageContent(slug, locale);
  contentCache.set(cacheKey, content);
  
  return content;
}

