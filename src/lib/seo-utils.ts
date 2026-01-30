// Utilidades para SEO y optimización de páginas fantasma

export interface SEOConfig {
  baseUrl: string;
  companyName: string;
  defaultLocale: string;
  supportedLocales: string[];
  socialMedia: {
    facebook: string;
    instagram: string;
    linkedin: string;
    twitter: string;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
}

export const AGILITY_CONFIG: SEOConfig = {
  baseUrl: 'https://agility-ecuador.com',
  companyName: 'Agility Ecuador',
  defaultLocale: 'es',
  supportedLocales: ['es', 'en'],
  socialMedia: {
    facebook: 'https://www.facebook.com/agilityecuador',
    instagram: 'https://www.instagram.com/agilityecuador',
    linkedin: 'https://www.linkedin.com/company/agilityecuador',
    twitter: 'https://twitter.com/agilityecuador'
  },
  contact: {
    email: 'contacto@agility-ecuador.com',
    phone: '+593-99-999-9999',
    address: 'Av. Amazonas N39-79, Quito, Ecuador',
    coordinates: {
      lat: -0.1807,
      lng: -78.4678
    }
  }
};

// Generar sitemap dinámico para páginas fantasma
export function generateGhostSitemap(slugs: string[]): string {
  const baseUrl = AGILITY_CONFIG.baseUrl;
  const locales = AGILITY_CONFIG.supportedLocales;
  
  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<?xml-stylesheet type="text/xsl" href="/sitemap-style.xsl"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';
  
  // Agregar página principal
  locales.forEach(locale => {
    sitemap += '  <url>\n';
    sitemap += `    <loc>${baseUrl}/${locale}</loc>\n`;
    sitemap += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
    sitemap += '    <changefreq>weekly</changefreq>\n';
    sitemap += '    <priority>1.0</priority>\n';
    
    // Agregar alternativas de idioma
    locales.forEach(altLocale => {
      sitemap += `    <xhtml:link rel="alternate" hreflang="${altLocale}" href="${baseUrl}/${altLocale}" />\n`;
    });
    
    sitemap += '  </url>\n';
  });
  
  // Agregar páginas fantasma
  slugs.forEach(slug => {
    locales.forEach(locale => {
      sitemap += '  <url>\n';
      sitemap += `    <loc>${baseUrl}/${locale}/ghost/${slug}</loc>\n`;
      sitemap += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
      sitemap += '    <changefreq>monthly</changefreq>\n';
      sitemap += '    <priority>0.8</priority>\n';
      
      // Agregar alternativas de idioma
      locales.forEach(altLocale => {
        sitemap += `    <xhtml:link rel="alternate" hreflang="${altLocale}" href="${baseUrl}/${altLocale}/ghost/${slug}" />\n`;
      });
      
      sitemap += '  </url>\n';
    });
  });
  
  sitemap += '</urlset>';
  
  return sitemap;
}

// Generar robots.txt optimizado
export function generateRobotsTxt(): string {
  const baseUrl = AGILITY_CONFIG.baseUrl;
  
  return `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml
Sitemap: ${baseUrl}/sitemap-ghost.xml

# Crawl-delay para evitar sobrecarga
Crawl-delay: 1

# Permitir todas las páginas fantasma
Allow: /ghost/

# Bloquear archivos innecesarios
Disallow: /api/
Disallow: /_next/
Disallow: /admin/
Disallow: /private/`;
}

// Validar y limpiar slugs para SEO
export function sanitizeSlug(slug: string): string {
  return slug
    .toLowerCase()
    .replace(/[^a-z0-9\-]/g, '-') // Solo letras, números y guiones
    .replace(/-+/g, '-') // Múltiples guiones por uno solo
    .replace(/^-|-$/g, '') // Quitar guiones al inicio y final
    .substring(0, 100); // Limitar longitud
}

// Generar keywords relacionadas para una página
export function generateRelatedKeywords(service: string, location: string): string[] {
  const baseKeywords = [
    service,
    `${location} Ecuador`,
    'diseño web Ecuador',
    'landing pages Ecuador',
    'páginas web baratas',
    'marketing digital Ecuador',
    'Agility Ecuador',
    'desarrollo web Quito',
    'sitios web profesionales',
    'diseño web económico'
  ];
  
  // Agregar variaciones en inglés
  const englishKeywords = [
    service.replace('páginas', 'pages').replace('web', 'web'),
    `${location} Ecuador`,
    'web design Ecuador',
    'landing pages Ecuador',
    'cheap websites',
    'digital marketing Ecuador',
    'Agility Ecuador',
    'web development Quito',
    'professional websites',
    'affordable web design'
  ];
  
  return [...baseKeywords, ...englishKeywords];
}

// Calcular densidad de keywords en contenido
export function calculateKeywordDensity(content: string, keyword: string): number {
  const words = content.toLowerCase().split(/\s+/);
  const keywordCount = words.filter(word => word.includes(keyword.toLowerCase())).length;
  return (keywordCount / words.length) * 100;
}

// Generar meta tags adicionales para SEO
export function generateAdditionalMetaTags(content: Record<string, string>, locale: string) {
  
  return {
    'application-name': AGILITY_CONFIG.companyName,
    'apple-mobile-web-app-title': AGILITY_CONFIG.companyName,
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'format-detection': 'telephone=no',
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#2563eb',
    'msapplication-config': '/browserconfig.xml',
    'theme-color': '#2563eb',
    'viewport': 'width=device-width, initial-scale=1, maximum-scale=5',
    'referrer': 'origin-when-cross-origin',
    'color-scheme': 'light dark',
    'supported-color-schemes': 'light dark',
    'google-site-verification': 'your-google-verification-code',
    'yandex-verification': 'your-yandex-verification-code',
    'bing-site-verification': 'your-bing-verification-code',
    'p:domain_verify': 'your-pinterest-verification-code',
    'fb:app_id': 'your-facebook-app-id',
    'og:locale': locale === 'es' ? 'es_EC' : 'en_US',
    'og:site_name': AGILITY_CONFIG.companyName,
    'og:type': 'website',
    'og:updated_time': new Date().toISOString(),
    'article:author': AGILITY_CONFIG.companyName,
    'article:publisher': AGILITY_CONFIG.socialMedia.facebook,
    'twitter:site': '@agilityecuador',
    'twitter:creator': '@agilityecuador',
    'twitter:domain': 'agility-ecuador.com',
    'twitter:app:name:iphone': AGILITY_CONFIG.companyName,
    'twitter:app:name:ipad': AGILITY_CONFIG.companyName,
    'twitter:app:name:googleplay': AGILITY_CONFIG.companyName,
    'business:contact_data:street_address': 'Av. Amazonas N39-79',
    'business:contact_data:locality': 'Quito',
    'business:contact_data:region': 'Pichincha',
    'business:contact_data:postal_code': '170150',
    'business:contact_data:country_name': 'Ecuador',
    'business:contact_data:email': AGILITY_CONFIG.contact.email,
    'business:contact_data:phone_number': AGILITY_CONFIG.contact.phone,
    'business:contact_data:website': AGILITY_CONFIG.baseUrl,
    'place:location:latitude': AGILITY_CONFIG.contact.coordinates.lat.toString(),
    'place:location:longitude': AGILITY_CONFIG.contact.coordinates.lng.toString(),
    'product:price:amount': content.price?.replace(/[^\d]/g, '') || '79',
    'product:price:currency': 'USD',
    'product:availability': 'in stock',
    'product:condition': 'new',
    'product:brand': AGILITY_CONFIG.companyName,
    'product:category': 'Web Design Services'
  };
}

// Función para generar breadcrumbs
export function generateBreadcrumbs(locale: string, slug: string) {
  const isEnglish = locale === 'en';
  const baseUrl = AGILITY_CONFIG.baseUrl;
  
  return [
    {
      '@type': 'ListItem',
      'position': 1,
      'name': isEnglish ? 'Home' : 'Inicio',
      'item': `${baseUrl}/${locale}`
    },
    {
      '@type': 'ListItem',
      'position': 2,
      'name': isEnglish ? 'Services' : 'Servicios',
      'item': `${baseUrl}/${locale}/services`
    },
    {
      '@type': 'ListItem',
      'position': 3,
      'name': slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      'item': `${baseUrl}/${locale}/ghost/${slug}`
    }
  ];
}
