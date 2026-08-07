export const SUPPORTED_LOCALES = ['en', 'ja', 'ko', 'ar'] as const;
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
  ar: 'العربية',
};

export const localeConfig: Record<Locale, { dir: 'ltr' | 'rtl'; lang: string }> = {
  en: { dir: 'ltr', lang: 'en-US' },
  ja: { dir: 'ltr', lang: 'ja-JP' },
  ko: { dir: 'ltr', lang: 'ko-KR' },
  ar: { dir: 'rtl', lang: 'ar-SA' },
};

export const routeSlugs: Record<Locale, Record<string, string>> = {
  en: {
    'about': 'about-us',
    'contact': 'contact-us',
    'terms': 'terms-conditions',
    'privacy': 'privacy-policy',
    'reports': 'reports',
    'search': 'search',
  },
  ja: {
    'about': 'about-us',
    'contact': 'contact-us',
    'terms': 'terms-conditions',
    'privacy': 'privacy-policy',
    'reports': 'reports',
    'search': 'search',
  },
  ko: {
    'about': 'about-us',
    'contact': 'contact-us',
    'terms': 'terms-conditions',
    'privacy': 'privacy-policy',
    'reports': 'reports',
    'search': 'search',
  },
  ar: {
    'about': 'about-us',
    'contact': 'contact-us',
    'terms': 'terms-conditions',
    'privacy': 'privacy-policy',
    'reports': 'reports',
    'search': 'search',
  },
};
