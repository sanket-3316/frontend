// lib/getLocale.ts

import { SUPPORTED_LOCALES, DEFAULT_LOCALE, Locale } from "./config";

export function getValidLocale(locale?: string): Locale {
  if (locale && SUPPORTED_LOCALES.includes(locale as Locale)) {
    return locale as Locale;
  }
  return DEFAULT_LOCALE;
}