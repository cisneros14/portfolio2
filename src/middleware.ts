

import { NextResponse, NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';

const locales = ['es', 'en'] as const;
const defaultLocale = 'es' as const;
const LOCALE_COOKIE = 'NEXT_LOCALE';

function parseAcceptLanguage(header: string | null): (typeof locales)[number] {
  if (!header) return defaultLocale;
  // Ejemplos: "es-ES,es;q=0.9,en;q=0.8" -> prioriza el primero compatible con nuestras locales
  const parts = header.split(',').map((p) => p.trim());
  for (const part of parts) {
    const code = part.split(';')[0]?.toLowerCase();
    const base = code.split('-')[0];
    if ((locales as readonly string[]).includes(base)) {
      return base as (typeof locales)[number];
    }
  }
  return defaultLocale;
}

function detectLocale(request: NextRequest): (typeof locales)[number] {
  // 1) Preferencia guardada en cookie (next-intl usa NEXT_LOCALE por defecto)
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value as (typeof locales)[number] | undefined;
  if (cookieLocale && (locales as readonly string[]).includes(cookieLocale)) {
    return cookieLocale;
  }
  // 2) Accept-Language del navegador
  const acceptLang = request.headers.get('accept-language');
  return parseAcceptLanguage(acceptLang);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === '/') {
    const locale = detectLocale(request);
    const response = NextResponse.redirect(new URL(`/${locale}`, request.url));
    // Persistimos la preferencia para futuras visitas
    response.cookies.set({
      name: LOCALE_COOKIE,
      value: locale,
      path: '/',
      // ~1 año
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax'
    });
    return response;
  }
  // next-intl middleware para el resto de rutas
  return createMiddleware({
    locales,
    defaultLocale,
    localePrefix: 'as-needed',
  })(request);
}

export const config = {
  matcher: ['/((?!_next|.*\..*).*)'],
};
