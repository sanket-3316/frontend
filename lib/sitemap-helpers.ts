import { DEFAULT_LOCALE } from './config';

export const SITE_URL = 'https://www.bremontstrategy.com';
export const REPORTS_PER_SITEMAP = 10000;

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type SitemapReport = { report_url: string; updated_at?: string };
type SitemapPagination = { page: number; per_page: number; total: number; last_page: number };

// GET /api/sitemap-reports — a chunk of published report URLs for one
// locale, ordered by report_id so a given page number is a stable slice
// across requests (no duplicate/missing URLs between sitemap files).
export async function getSitemapReportsChunk(
  locale: string,
  page: number,
  perPage: number = REPORTS_PER_SITEMAP
): Promise<{ reports: SitemapReport[]; pagination: SitemapPagination | null }> {
  try {
    const res = await fetch(
      `${BASE_URL}/sitemap-reports?lang=${locale}&page=${page}&per_page=${perPage}`,
      { cache: 'no-store' }
    );

    if (!res.ok) throw new Error(`sitemap-reports API error: ${res.status}`);

    const json = await res.json();
    return { reports: json?.reports || [], pagination: json?.pagination || null };
  } catch (error) {
    console.error('Sitemap reports API error:', error);
    return { reports: [], pagination: null };
  }
}

// How many reports-N.xml files a locale needs — a cheap page=1/per_page=1
// call just to read the total count.
export async function getSitemapReportsPageCount(locale: string): Promise<number> {
  const { pagination } = await getSitemapReportsChunk(locale, 1, 1);
  if (!pagination || pagination.total === 0) return 0;
  return Math.max(1, Math.ceil(pagination.total / REPORTS_PER_SITEMAP));
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toIsoDate(value?: string): string {
  const date = value ? new Date(value) : new Date();
  return isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

export type UrlEntry = {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: number;
};

export function buildUrlsetXml(entries: UrlEntry[]): string {
  const body = entries
    .map(
      (e) => `  <url>
    <loc>${escapeXml(e.loc)}</loc>
    <lastmod>${toIsoDate(e.lastmod)}</lastmod>${
        e.changefreq ? `\n    <changefreq>${e.changefreq}</changefreq>` : ''
      }${e.priority != null ? `\n    <priority>${e.priority}</priority>` : ''}
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`;
}

export function buildSitemapIndexXml(entries: { loc: string; lastmod?: string }[]): string {
  const body = entries
    .map(
      (e) => `  <sitemap>
    <loc>${escapeXml(e.loc)}</loc>
    <lastmod>${toIsoDate(e.lastmod)}</lastmod>
  </sitemap>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</sitemapindex>`;
}

export function xmlResponse(xml: string): Response {
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}

// /reports-N.xml for English, /{locale}/reports-N.xml for the others.
export function reportsSitemapPath(locale: string, chunk: number): string {
  const prefix = locale === DEFAULT_LOCALE ? '' : `/${locale}`;
  return `${prefix}/reports-${chunk}.xml`;
}

// Parses "reports-3.xml" -> 3, or null if the filename doesn't match.
export function parseReportsChunkFilename(filename: string): number | null {
  const match = filename.match(/^reports-(\d+)\.xml$/);
  if (!match) return null;
  const chunk = parseInt(match[1], 10);
  return chunk > 0 ? chunk : null;
}

// Builds the urlset XML for one reports-N.xml chunk, or null if that chunk
// is out of range (so the route handler can 404 instead of returning an
// empty-but-200 sitemap).
export async function buildReportsChunkXml(locale: string, chunk: number): Promise<string | null> {
  const { reports, pagination } = await getSitemapReportsChunk(locale, chunk, REPORTS_PER_SITEMAP);

  if (!pagination || chunk > pagination.last_page) {
    return null;
  }

  const prefix = locale === DEFAULT_LOCALE ? '' : `/${locale}`;

  const entries: UrlEntry[] = reports.map((r) => ({
    loc: `${SITE_URL}${prefix}/report/${r.report_url}`,
    lastmod: r.updated_at,
    changefreq: 'weekly',
    priority: 0.7,
  }));

  return buildUrlsetXml(entries);
}
