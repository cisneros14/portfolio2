#!/usr/bin/env node

/**
 * Script para generar contenido masivo de páginas fantasma
 * Uso: node scripts/generate-ghost-content.js
 */

const fs = require('fs');
const path = require('path');

// Configuración
const CONFIG = {
  outputDir: './src/data/ghost-content',
  maxPages: 1000,
  locales: ['es', 'en'],
  batchSize: 50, // Procesar en lotes para evitar límites de API
  delayBetweenBatches: 2000, // 2 segundos entre lotes
};

// Palabras clave y variaciones
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

// Función para generar slugs únicos
function generateSlugs(count) {
  const slugs = [];
  const usedSlugs = new Set();
  
  for (let i = 0; i < count; i++) {
    let slug;
    let attempts = 0;
    
    do {
      const service = KEYWORDS.services[Math.floor(Math.random() * KEYWORDS.services.length)];
      const location = KEYWORDS.locations[Math.floor(Math.random() * KEYWORDS.locations.length)];
      const businessType = KEYWORDS.businessTypes[Math.floor(Math.random() * KEYWORDS.businessTypes.length)];
      const price = KEYWORDS.prices[Math.floor(Math.random() * KEYWORDS.prices.length)];
      
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

// Función para generar contenido básico (sin IA para el script)
function generateBasicContent(slug, locale) {
  const service = KEYWORDS.services[Math.floor(Math.random() * KEYWORDS.services.length)];
  const location = KEYWORDS.locations[Math.floor(Math.random() * KEYWORDS.locations.length)];
  const price = KEYWORDS.prices[Math.floor(Math.random() * KEYWORDS.prices.length)];
  const businessType = KEYWORDS.businessTypes[Math.floor(Math.random() * KEYWORDS.businessTypes.length)];
  
  const isEnglish = locale === 'en';
  
  const title = isEnglish 
    ? `${service} ${price} in ${location}, Ecuador | Agility Web Design`
    : `${service} ${price} en ${location}, Ecuador | Agility Diseño Web`;
    
  const description = isEnglish
    ? `Professional ${service} ${price} in ${location}, Ecuador. Fast, affordable, and effective web solutions for ${businessType}. Contact Agility today!`
    : `Profesionales ${service} ${price} en ${location}, Ecuador. Soluciones web rápidas, económicas y efectivas para ${businessType}. ¡Contacta a Agility hoy!`;
    
  const content = isEnglish
    ? `Transform your ${businessType} with professional ${service} in ${location}, Ecuador. Agility delivers fast, affordable, and high-converting websites that help your business grow. Our expert team in Quito creates stunning landing pages that drive results. Don't let your competitors get ahead - get your professional website ${price} today!`
    : `Transforma tu ${businessType} con ${service} profesionales en ${location}, Ecuador. Agility entrega sitios web rápidos, económicos y de alta conversión que ayudan a tu negocio a crecer. Nuestro equipo experto en Quito crea landing pages impresionantes que generan resultados. No dejes que tu competencia se adelante - ¡obtén tu página web profesional ${price} hoy!`;
    
  const keywords = [
    service,
    `${location} Ecuador`,
    'diseño web',
    'landing pages',
    businessType,
    'marketing digital',
    'páginas web baratas',
    'Agility'
  ];
  
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
}

// Función principal
async function generateGhostContent() {
  console.log('🚀 Iniciando generación de contenido para páginas fantasma...');
  
  // Crear directorio de salida
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
  }
  
  // Generar slugs
  console.log(`📝 Generando ${CONFIG.maxPages} slugs únicos...`);
  const slugs = generateSlugs(CONFIG.maxPages);
  
  // Generar contenido para cada locale
  for (const locale of CONFIG.locales) {
    console.log(`🌍 Procesando locale: ${locale}`);
    
    const localeDir = path.join(CONFIG.outputDir, locale);
    if (!fs.existsSync(localeDir)) {
      fs.mkdirSync(localeDir, { recursive: true });
    }
    
    // Procesar en lotes
    for (let i = 0; i < slugs.length; i += CONFIG.batchSize) {
      const batch = slugs.slice(i, i + CONFIG.batchSize);
      console.log(`📦 Procesando lote ${Math.floor(i / CONFIG.batchSize) + 1}/${Math.ceil(slugs.length / CONFIG.batchSize)} (${batch.length} páginas)`);
      
      const batchContent = batch.map(slug => generateBasicContent(slug, locale));
      
      // Guardar lote
      const batchFile = path.join(localeDir, `batch-${Math.floor(i / CONFIG.batchSize) + 1}.json`);
      fs.writeFileSync(batchFile, JSON.stringify(batchContent, null, 2));
      
      // Delay entre lotes
      if (i + CONFIG.batchSize < slugs.length) {
        console.log(`⏳ Esperando ${CONFIG.delayBetweenBatches}ms antes del siguiente lote...`);
        await new Promise(resolve => setTimeout(resolve, CONFIG.delayBetweenBatches));
      }
    }
  }
  
  // Generar archivo de índice
  const indexContent = {
    generatedAt: new Date().toISOString(),
    totalPages: CONFIG.maxPages,
    locales: CONFIG.locales,
    slugs: slugs.slice(0, 100), // Solo los primeros 100 para el índice
    stats: {
      totalSlugs: slugs.length,
      uniqueServices: [...new Set(KEYWORDS.services)].length,
      uniqueLocations: [...new Set(KEYWORDS.locations)].length,
      uniquePrices: [...new Set(KEYWORDS.prices)].length,
      uniqueBusinessTypes: [...new Set(KEYWORDS.businessTypes)].length
    }
  };
  
  fs.writeFileSync(
    path.join(CONFIG.outputDir, 'index.json'),
    JSON.stringify(indexContent, null, 2)
  );
  
  console.log('✅ Generación completada exitosamente!');
  console.log(`📊 Estadísticas:`);
  console.log(`   - Total de páginas: ${CONFIG.maxPages}`);
  console.log(`   - Locales: ${CONFIG.locales.join(', ')}`);
  console.log(`   - Slugs únicos generados: ${slugs.length}`);
  console.log(`   - Archivos guardados en: ${CONFIG.outputDir}`);
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  generateGhostContent().catch(console.error);
}

module.exports = { generateGhostContent, generateSlugs, generateBasicContent };

