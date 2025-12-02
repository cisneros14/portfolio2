

// Middleware for locale handling
import { NextResponse, NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { jwtVerify } from 'jose';

const locales = ['es', 'en'] as const;
const defaultLocale = 'es' as const;
const LOCALE_COOKIE = 'NEXT_LOCALE';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';



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

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

async function verifyToken(token: string) {
  if (!token) return false;
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Check for Admin Routes Protection
  // Matches: /admin, /es/admin, /en/admin, /admin/..., /es/admin/...
  const isAdminRoute = 
    pathname === '/admin' || 
    pathname.startsWith('/admin/') || 
    /^\/(es|en)\/admin(\/|$)/.test(pathname);

  if (isAdminRoute) {
    const token = request.cookies.get('auth_token')?.value;
    const isValid = await verifyToken(token || '');

    if (!isValid) {
      // Determine locale to redirect to
      const localeMatch = pathname.match(/^\/(es|en)\//);
      const locale = localeMatch ? localeMatch[1] : defaultLocale;
      
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    }
  }

  // 2. Handle Root Redirect (Optional, handled by intlMiddleware usually but keeping custom logic if needed)
  if (pathname === '/') {
    const locale = detectLocale(request);
    // Let intlMiddleware handle the redirect to default locale if we want standard behavior, 
    // but keeping your custom logic for persistence:
    const response = NextResponse.redirect(new URL(`/${locale}`, request.url));
    response.cookies.set({
      name: LOCALE_COOKIE,
      value: locale,
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax'
    });
    return response;
  }

  // 3. Run Internationalization Middleware
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
