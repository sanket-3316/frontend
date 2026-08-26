import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const DEFAULT_LOCALE = 'en';
const locales = ['en', 'ja', 'ko'];

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

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