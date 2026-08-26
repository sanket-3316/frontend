import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') || '').trim();
  const locale = searchParams.get('locale') || 'en';

  if (!q) {
    return NextResponse.json([]);
  }

  try {
    const res = await fetch(`${BASE_URL}/category-wise-reports`, {
      headers: {
        'Accept-Language': locale,
        'X-Category-Slug': '',
        'search': q,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json([]);
    }

    const data = await res.json();
    const reports = data?.reports || [];

    const results = reports.slice(0, 8).map((r: any) => ({
      id: r.id,
      title: r.keyword,
      url: `/report/${r.report_url}`,
    }));

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json([]);
  }
}
