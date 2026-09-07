import { SUPPORTED_LOCALES, Locale } from '@/lib/config';
import { buildReportsChunkXml, parseReportsChunkFilename, xmlResponse } from '@/lib/sitemap-helpers';

// GET /reports-{n}.xml (English, reached via a middleware rewrite) and
// /{locale}/reports-{n}.xml (ja, ko, native prefix) — both land here since
// this reuses the same [locale] segment the rest of the localized site
// tree uses (a second, competing top-level dynamic segment isn't allowed
// by Next.js). Route Handlers don't go through [locale]/layout.tsx, so no
// Navbar/Footer data-fetching happens for these XML responses.
export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: { locale: string; sitemapFile: string } }
) {
  const { locale, sitemapFile } = params;

  if (!SUPPORTED_LOCALES.includes(locale as Locale)) {
    return new Response('Not Found', { status: 404 });
  }

  const chunk = parseReportsChunkFilename(sitemapFile);
  if (chunk === null) {
    return new Response('Not Found', { status: 404 });
  }

  const xml = await buildReportsChunkXml(locale, chunk);
  if (xml === null) {
    return new Response('Not Found', { status: 404 });
  }

  return xmlResponse(xml);
}
