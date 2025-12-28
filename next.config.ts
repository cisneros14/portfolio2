
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  // Optimizaciones para páginas fantasma
  experimental: {
    // Habilitar generación estática optimizada
    staticGenerationRetryCount: 3,
    // Optimizar imágenes
    optimizePackageImports: ['lucide-react', 'framer-motion'],
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },


  // Configuración de imágenes
  images: {
    domains: ["i.pinimg.com", "res.cloudinary.com"],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Headers de seguridad y SEO
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        source: '/ghost/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Redirecciones para SEO
  async redirects() {
    return [
      {
        source: '/landing-pages-baratas',
        destination: '/es/ghost/landing-pages-baratas-quito',
        permanent: true,
      },
      {
        source: '/cheap-landing-pages',
        destination: '/en/ghost/cheap-landing-pages-quito',
        permanent: true,
      },
      {
        source: '/paginas-web-economicas',
        destination: '/es/ghost/paginas-web-economicas-ecuador',
        permanent: true,
      },
      {
        source: '/affordable-websites',
        destination: '/en/ghost/affordable-websites-ecuador',
        permanent: true,
      },
    ];
  },

  // Configuración de compresión
  compress: true,

  // Configuración de powerd by header
  poweredByHeader: false,

  // Configuración de trailing slash
  trailingSlash: false,

  // Configuración de output
  // output: 'standalone',
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
