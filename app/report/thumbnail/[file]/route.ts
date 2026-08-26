import { NextRequest } from 'next/server';
import { BUSINESS_CARD_SVG, buildWrappedLeftText } from '@/lib/thumbnail-template';

// GET /report/thumbnail/{report_url}.svg?keyword=Biogas&lang=en
//
// Entirely frontend-generated — no backend call. The caller (report cards,
// the report detail page) already has the report's own locale-specific
// `keyword` from its own API fetch, and just passes it straight through as
// a query param, so this route only has to template an SVG string.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_TITLE_WIDTH = 460;
const FONT_FAMILY = "'Open Sans','Noto Sans','Segoe UI',Roboto,Arial,Helvetica,sans-serif";

function marketSuffix(lang: string) {
  switch (lang) {
    case 'ja':
      return { word: '市場', separator: '' };
    case 'ko':
      return { word: '시장', separator: '' };
    default:
      return { word: 'Market', separator: ' ' };
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { file: string } }
) {
  const { searchParams } = new URL(request.url);

  const slug = params.file.replace(/\.svg$/i, '');
  const keywordParam = (searchParams.get('keyword') || '').trim();
  const lang = (searchParams.get('lang') || 'en').toLowerCase();

  const keyword = keywordParam || slug.replace(/-/g, ' ');
  const { word, separator } = marketSuffix(lang);
  const title = `${keyword}${separator}${word}`;

  // Scales down smoothly as the title gets longer so it keeps fitting on one
  // line (and stays clear of the artwork/contact block) — this is what keeps
  // the thumbnail responsive instead of overflowing.
  let fontSize = Math.floor(MAX_TITLE_WIDTH / (Math.max(1, title.length) * 0.62));
  fontSize = Math.max(16, Math.min(40, fontSize));

  const titleBlock = buildWrappedLeftText(
    title,
    31,
    81,
    FONT_FAMILY,
    700,
    fontSize,
    MAX_TITLE_WIDTH,
    2
  );

  const svg = BUSINESS_CARD_SVG.replace('[[title_block]]', titleBlock);

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
