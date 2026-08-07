// lib/routes.ts

import { Locale, routeSlugs, DEFAULT_LOCALE } from "./config";

type RouteKey = keyof typeof routeSlugs.en;

export function getRoute(locale: Locale, key: RouteKey) {
  const slug = routeSlugs[locale][key];

  return locale === DEFAULT_LOCALE
    ? `/${slug}`
    : `/${locale}/${slug}`;
}

export function getHomeRoute(locale: Locale) {
  return locale === DEFAULT_LOCALE ? "/" : `/${locale}`;
}