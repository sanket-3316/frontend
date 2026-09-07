import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from '@/lib/config';
import {
  SITE_URL,
  buildSitemapIndexXml,
  getSitemapReportsPageCount,
  reportsSitemapPath,
  xmlResponse,
} from '@/lib/sitemap-helpers';

export const dynamic = 'force-dynamic';

export async function GET() {
  const entries: { loc: string; lastmod?: string }[] = [
    { loc: `${SITE_URL}/sitemap-pages.xml` },
  ];

  // One set of reports-N.xml entries per locale, sized to that locale's own
  // published-report count (they don't all have the same number of chunks).
  for (const locale of SUPPORTED_LOCALES) {
    const pageCount = await getSitemapReportsPageCount(locale);

    for (let chunk = 1; chunk <= pageCount; chunk++) {
      entries.push({ loc: `${SITE_URL}${reportsSitemapPath(locale, chunk)}` });
    }
  }

  return xmlResponse(buildSitemapIndexXml(entries));
}
