import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from '@/lib/config';

const locales: string[] = [...SUPPORTED_LOCALES];

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // 🔥 Paginated report sitemaps: /reports-N.xml needs to reach the same
  // [locale] route tree /{locale}/reports-N.xml uses (a second top-level
  // dynamic segment isn't allowed alongside it) — rewrite before the
  // generic dot-exclusion below skips it as a "static file".
  if (/^\/reports-\d+\.xml$/.test(pathname)) {
    return NextResponse.rewrite(
      new URL(`/${DEFAULT_LOCALE}${pathname}${search}`, request.url)
    );
  }

  // ignore static files
  if (
    pathname.startsWith('/_next') ||
    pathname.includes('.') ||
    pathname.startsWith('/api')
  ) {
    return;
  }

  // 🔥 0. Arabic locale permanently removed → 410 Gone
  if (pathname === '/ar' || pathname.startsWith('/ar/')) {
    return new NextResponse('Gone', { status: 410 });
  }

  // 🔥 1. Remove /en → redirect to clean URL
  if (pathname === '/en') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (pathname.startsWith('/en/')) {
    const newPath = pathname.replace('/en', '');
    return NextResponse.redirect(new URL(newPath + search, request.url));
  }

  // 🔥 2. If already has NON-default locale → allow
  const hasOtherLocale = locales
    .filter((l) => l !== DEFAULT_LOCALE)
    .some((locale) => pathname.startsWith(`/${locale}`));

  if (hasOtherLocale) return;

  // 🔥 3. IMPORTANT: Rewrite English routes internally
  // URL stays clean, but app gets /en
  return NextResponse.rewrite(
    new URL(`/${DEFAULT_LOCALE}${pathname}${search}`, request.url)
  );
}