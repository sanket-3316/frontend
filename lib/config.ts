// Arabic ('ar') has been permanently removed — see middleware.ts (410 Gone for /ar/*)
export const SUPPORTED_LOCALES = ['en', 'ja', 'ko', 'zh', 'es', 'de', 'fr'] as const;
export const DEFAULT_LOCALE = 'en';
export function getValidLocale(locale?: string): Locale {
  if (SUPPORTED_LOCALES.includes(locale as Locale)) {
    return locale as Locale;
  }
  return DEFAULT_LOCALE;
}

export type Locale = typeof SUPPORTED_LOCALES[number];

export const localeNames: Record<Locale, string> = {
  en: 'English',
  ja: '日本語',
  ko: '한국어',
  zh: '中文',
  es: 'Español',
  de: 'Deutsch',
  fr: 'Français',
};

export const localeConfig: Record<Locale, { dir: 'ltr' | 'rtl'; lang: string }> = {
  en: { dir: 'ltr', lang: 'en-US' },
  ja: { dir: 'ltr', lang: 'ja-JP' },
  ko: { dir: 'ltr', lang: 'ko-KR' },
  zh: { dir: 'ltr', lang: 'zh-CN' },
  es: { dir: 'ltr', lang: 'es-ES' },
  de: { dir: 'ltr', lang: 'de-DE' },
  fr: { dir: 'ltr', lang: 'fr-FR' },
};

// Every locale currently shares the same (English-derived) slugs.
const SHARED_ROUTE_SLUGS: Record<string, string> = {
  'about': 'about-us',
  'contact': 'contact-us',
  'terms': 'terms-conditions',
  'privacy': 'privacy-policy',
  'reports': 'reports',
  'search': 'search',
  'careers': 'careers',
  'faq': 'faq',
  'team': 'our-team',
};

export const routeSlugs: Record<Locale, Record<string, string>> = {
  en: SHARED_ROUTE_SLUGS,
  ja: SHARED_ROUTE_SLUGS,
  ko: SHARED_ROUTE_SLUGS,
  zh: SHARED_ROUTE_SLUGS,
  es: SHARED_ROUTE_SLUGS,
  de: SHARED_ROUTE_SLUGS,
  fr: SHARED_ROUTE_SLUGS,
};
