'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GhostPageContent } from '@/lib/ghost-content-generator';

interface GhostPageComponentProps {
  content: GhostPageContent;
  locale: string;
}

export default function GhostPageComponent({ content, locale }: GhostPageComponentProps) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  const isEnglish = locale === 'en';

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setIsRedirecting(true);
          // Redirigir a la página principal
          router.push(`/${locale}`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router, locale]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header con información de Agility */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Agility Ecuador</h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {isEnglish ? 'Professional Web Design' : 'Diseño Web Profesional'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {isEnglish ? 'Located in Quito, Ecuador' : 'Ubicados en Quito, Ecuador'}
              </p>
              <p className="text-lg font-semibold text-green-600">
                {content.price}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
          {/* Título principal */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {content.title}
          </h1>

          {/* Meta información */}
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg">
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                📍 {content.location}
              </span>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-lg">
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                💰 {content.price}
              </span>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 px-4 py-2 rounded-lg">
              <span className="text-sm font-medium text-pink-700 dark:text-purple-300">
                ⚡ {isEnglish ? 'Fast Delivery' : 'Entrega Rápida'}
              </span>
            </div>
          </div>

          {/* Contenido del artículo */}
          <div className="prose prose-lg max-w-none mb-8">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
              {content.content}
            </p>
          </div>

          {/* Características destacadas */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div className="text-3xl mb-3">🚀</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {isEnglish ? 'Fast & Reliable' : 'Rápido y Confiable'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {isEnglish 
                  ? 'Your website ready in 48-72 hours'
                  : 'Tu sitio web listo en 48-72 horas'
                }
              </p>
            </div>
            <div className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div className="text-3xl mb-3">💎</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {isEnglish ? 'Professional Quality' : 'Calidad Profesional'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {isEnglish 
                  ? 'Modern design and optimized performance'
                  : 'Diseño moderno y rendimiento optimizado'
                }
              </p>
            </div>
            <div className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {isEnglish ? 'Conversion Focused' : 'Enfocado en Conversiones'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {isEnglish 
                  ? 'Designed to generate more customers'
                  : 'Diseñado para generar más clientes'
                }
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">
              {isEnglish 
                ? 'Ready to Transform Your Business?'
                : '¿Listo para Transformar tu Negocio?'
              }
            </h2>
            <p className="text-lg mb-6 opacity-90">
              {isEnglish 
                ? `Get your professional ${content.service.toLowerCase()} ${content.price} today!`
                : `¡Obtén tu ${content.service.toLowerCase()} profesional ${content.price} hoy!`
              }
            </p>
            
            {/* Botón de acción principal */}
            <button 
              onClick={() => router.push(`/${locale}`)}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-200 shadow-lg"
            >
              {isEnglish ? 'Get Started Now' : 'Comenzar Ahora'}
            </button>
          </div>

          {/* Información de contacto */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-600">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  {isEnglish ? 'Contact Information' : 'Información de Contacto'}
                </h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <p>📍 Quito, Ecuador</p>
                  <p>📧 contacto@agility-ecuador.com</p>
                  <p>📱 +593 99 999 9999</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  {isEnglish ? 'Why Choose Agility?' : '¿Por qué Elegir Agility?'}
                </h3>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                  <li>✅ {isEnglish ? 'Local Ecuador team' : 'Equipo local de Ecuador'}</li>
                  <li>✅ {isEnglish ? 'Affordable prices' : 'Precios accesibles'}</li>
                  <li>✅ {isEnglish ? 'Fast delivery' : 'Entrega rápida'}</li>
                  <li>✅ {isEnglish ? 'Professional support' : 'Soporte profesional'}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Loading/Redirect overlay */}
      {isRedirecting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center max-w-md mx-4">
            <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {isEnglish ? 'Redirecting...' : 'Redirigiendo...'}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {isEnglish 
                ? 'Taking you to our main page'
                : 'Llevándote a nuestra página principal'
              }
            </p>
          </div>
        </div>
      )}

      {/* Countdown timer */}
      <div className="fixed bottom-6 right-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border">
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
            {isEnglish ? 'Auto-redirect in:' : 'Auto-redirección en:'}
          </p>
          <div className="text-2xl font-bold text-blue-600">
            {countdown}s
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-800 border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              © 2024 Agility Ecuador. {isEnglish ? 'All rights reserved.' : 'Todos los derechos reservados.'}
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-2">
              {isEnglish 
                ? 'Professional web design services in Ecuador'
                : 'Servicios profesionales de diseño web en Ecuador'
              }
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

