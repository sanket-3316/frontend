import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from '@/lib/config';
import { SITE_URL, UrlEntry, buildUrlsetXml, xmlResponse } from '@/lib/sitemap-helpers';

export const dynamic = 'force-dynamic';

const STATIC_PAGES = [
  { path: '', priority: 1 },
  { path: '/reports', priority: 0.8 },
  { path: '/about-us', priority: 0.8 },
  { path: '/contact-us', priority: 0.8 },
  { path: '/faq', priority: 0.6 },
  { path: '/our-team', priority: 0.6 },
  { path: '/privacy-policy', priority: 0.8 },
];

// Careers is English-only (see app/(site)/[locale]/careers/page.tsx) — every
// other locale 307-redirects it to the canonical /careers, so it's listed
// only once, not per locale.
const ENGLISH_ONLY_PAGES = [{ path: '/careers', priority: 0.8 }];

export async function GET() {
  const entries: UrlEntry[] = [];

  [...STATIC_PAGES, ...ENGLISH_ONLY_PAGES].forEach((page) => {
    entries.push({
      loc: `${SITE_URL}${page.path}`,
      changefreq: 'weekly',
      priority: page.path === '' ? 1 : page.priority,
    });
  });

  SUPPORTED_LOCALES.filter((locale) => locale !== DEFAULT_LOCALE).forEach((locale) => {
    STATIC_PAGES.forEach((page) => {
      entries.push({
        loc: `${SITE_URL}/${locale}${page.path}`,
        changefreq: 'weekly',
        priority: page.path === '' ? 0.9 : 0.7,
      });
    });
  });

  return xmlResponse(buildUrlsetXml(entries));
}
