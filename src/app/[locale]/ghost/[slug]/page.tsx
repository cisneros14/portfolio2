import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCachedGhostContent, generateGhostSlugs } from '@/lib/ghost-content-generator';
import GhostPageComponent from './GhostPageComponent';

// Generar parámetros estáticos para miles de páginas
export async function generateStaticParams() {
  // Generar 50 slugs únicos para páginas fantasma (prueba inicial)
  const slugs = generateGhostSlugs(50);
  
  const locales = ['es', 'en'];
  const params: { locale: string; slug: string }[] = [];
  
  // Crear combinaciones de locale y slug
  for (const locale of locales) {
    for (const slug of slugs) {
      params.push({ locale, slug });
    }
  }
  
  return params;
}

// Generar metadata dinámica para SEO
export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const { locale, slug } = params;
  
  try {
    const content = await getCachedGhostContent(slug, locale);
    
    const baseUrl = 'https://agility-ecuador.com';
    const currentUrl = `${baseUrl}/${locale}/ghost/${slug}`;
    
    return {
      title: content.title,
      description: content.description,
      keywords: content.keywords.join(', '),
      authors: [{ name: 'Agility Ecuador' }],
      creator: 'Agility Ecuador',
      publisher: 'Agility Ecuador',
      
      // Open Graph
      openGraph: {
        type: 'website',
        locale: locale === 'es' ? 'es_EC' : 'en_US',
        url: currentUrl,
        title: content.title,
        description: content.description,
        siteName: 'Agility Ecuador',
        images: [
          {
            url: `${baseUrl}/og-image-agility.jpg`,
            width: 1200,
            height: 630,
            alt: content.title,
          },
        ],
      },
      
      // Twitter Card
      twitter: {
        card: 'summary_large_image',
        title: content.title,
        description: content.description,
        images: [`${baseUrl}/og-image-agility.jpg`],
        creator: '@agilityecuador',
      },
      
      // Canonical URL
      alternates: {
        canonical: currentUrl,
        languages: {
          'es': `${baseUrl}/es/ghost/${slug}`,
          'en': `${baseUrl}/en/ghost/${slug}`,
        },
      },
      
      // Robots
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      
      // Additional meta tags
      other: {
        'geo.region': 'EC',
        'geo.placename': content.location,
        'geo.position': '-0.1807;-78.4678', // Quito coordinates
        'ICBM': '-0.1807, -78.4678',
        'DC.title': content.title,
        'DC.description': content.description,
        'DC.subject': content.keywords.join(', '),
        'DC.creator': 'Agility Ecuador',
        'DC.publisher': 'Agility Ecuador',
        'DC.date.created': new Date().toISOString(),
        'DC.language': locale,
        'DC.coverage': content.location,
        'DC.rights': '© 2024 Agility Ecuador. All rights reserved.',
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Agility Ecuador - Landing Pages Profesionales',
      description: 'Creamos landing pages profesionales y económicas en Ecuador. Desde $79. Contacta a Agility hoy.',
    };
  }
}

// Componente principal de la página fantasma
export default async function GhostPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const { locale, slug } = params;
  
  try {
    const content = await getCachedGhostContent(slug, locale);
    
    return (
      <>
        {/* Schema.org JSON-LD para LocalBusiness */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Agility Ecuador",
              "description": content.description,
              "url": "https://agility-ecuador.com",
              "telephone": "+593-99-999-9999",
              "email": "contacto@agility-ecuador.com",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Av. Amazonas N39-79",
                "addressLocality": "Quito",
                "addressRegion": "Pichincha",
                "postalCode": "170150",
                "addressCountry": "EC"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": -0.1807,
                "longitude": -78.4678
              },
              "openingHours": "Mo-Fr 09:00-18:00",
              "priceRange": "$79-$199",
              "serviceArea": {
                "@type": "Country",
                "name": "Ecuador"
              },
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Servicios de Diseño Web",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": content.service,
                      "description": content.description
                    },
                    "price": content.price,
                    "priceCurrency": "USD",
                    "availability": "https://schema.org/InStock"
                  }
                ]
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "reviewCount": "127"
              },
              "sameAs": [
                "https://www.facebook.com/agilityecuador",
                "https://www.instagram.com/agilityecuador",
                "https://www.linkedin.com/company/agilityecuador"
              ]
            })
          }}
        />
        
        {/* Schema.org para WebPage */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": content.title,
              "description": content.description,
              "url": `https://agility-ecuador.com/${locale}/ghost/${slug}`,
              "isPartOf": {
                "@type": "WebSite",
                "name": "Agility Ecuador",
                "url": "https://agility-ecuador.com"
              },
              "about": {
                "@type": "LocalBusiness",
                "name": "Agility Ecuador"
              },
              "keywords": content.keywords.join(', '),
              "inLanguage": locale,
              "datePublished": new Date().toISOString(),
              "dateModified": new Date().toISOString(),
              "author": {
                "@type": "Organization",
                "name": "Agility Ecuador"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Agility Ecuador",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://agility-ecuador.com/logo.png"
                }
              }
            })
          }}
        />
        
        {/* Schema.org para Service */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Service",
              "name": content.service,
              "description": content.description,
              "provider": {
                "@type": "LocalBusiness",
                "name": "Agility Ecuador"
              },
              "areaServed": {
                "@type": "Country",
                "name": "Ecuador"
              },
              "serviceType": "Web Design",
              "offers": {
                "@type": "Offer",
                "price": content.price,
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock"
              }
            })
          }}
        />
        
        <GhostPageComponent content={content} locale={locale} />
      </>
    );
  } catch (error) {
    console.error('Error loading ghost page:', error);
    notFound();
  }
}
