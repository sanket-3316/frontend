import { getCache, setCache } from './cache';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// ⏱ cache time (ms)
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

// 🔥 GENERIC FETCH FUNCTION
async function fetchAPI(url: string, locale: string) {
  const res = await fetch(url, {
    headers: {
      'Accept-Language': locale,
    },
    cache: 'no-store', // always fresh from backend
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}


export async function getCategories(locale: string) {
  const cacheKey = `categories:${locale}`;

  const cached = getCache<any[]>(cacheKey);
  if (cached) {
    console.log('CACHE HIT:', locale);
    return cached;
  }


  try {
    const data = await fetchAPI(
      `${BASE_URL}/categories?lang=${locale}`, 
      locale
    );

    const categories = data.categories || [];

    // ✅ store in cache
    setCache(cacheKey, categories, CACHE_TTL);

    return categories;
  } catch (error) {
    console.error('Category API error:', error);
    return [];
  }
}

export async function getCareers() {
  const cacheKey = 'careers';

  const cached = getCache<any[]>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const data = await fetchAPI(`${BASE_URL}/careers`, 'en');

    const careers = data.careers || [];

    setCache(cacheKey, careers, CACHE_TTL);

    return careers;
  } catch (error) {
    console.error('Careers API error:', error);
    return [];
  }
}

export async function getReports(
  locale: string,
  categoryId?: number,
  limit: number = 6
) {
  const key = `reports:${locale}:${categoryId || 'all'}:${limit}`;

  const cached = getCache<any[]>(key);
  if (cached) {
    console.log('CACHE HIT:', key);
    return cached;
  }

  try {
    const res = await fetch(`${BASE_URL}/reports`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',

        // 🔥 language
        'Accept-Language': locale || 'en',

        // 🔥 custom headers
        'X-Category-Id': categoryId ? String(categoryId) : '',
        'X-Limit': String(limit),
      },
      cache: 'no-store',
    });

    if (!res.ok) throw new Error('Failed to fetch reports');

    const data = await res.json();

    setCache(key, data, CACHE_TTL);

    return data;
  } catch (error) {
    console.error('Reports API error:', error);
    return [];
  }
}

export async function getCategoryReports(
  locale: string,
  categorySlug?: string,
  search?: string,
  page?: number,
  perPage: number = 20
) {
  const key = `reports:${locale}:${categorySlug || 'all'}:${search || ''}:${page || 'all'}:${perPage}`;

  const cached = getCache<any>(key);
  if (cached) return cached;

  try {
    const url = new URL(`${BASE_URL}/category-wise-reports`);
    if (page) {
      url.searchParams.set('page', String(page));
      url.searchParams.set('per_page', String(perPage));
    }

    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': locale || 'en',
        'X-Category-Slug': categorySlug ? String(categorySlug) : '',
        'search': search || '',
      },
      cache: 'no-store',
    });

    if (!res.ok) throw new Error('Failed to fetch reports');

    const json = await res.json();

    const data = json || {};

    setCache(key, data, CACHE_TTL);

    return data;
  } catch (error) {
    console.error('Reports API error:', error);
    return { reports: [], category: null, pagination: null };
  }
}

export async function searchReports(locale: string, query: string) {
  if (!query?.trim()) return [];

  const key = `search:${locale}:${query}`;

  const cached = getCache<any[]>(key);
  if (cached) {
    console.log('CACHE HIT:', key);
    return cached;
  }

  try {
    const res = await fetch(`${BASE_URL}/category-wise-reports`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': locale || 'en',
        'X-Category-Slug': '',
        'search': query,
      },
      cache: 'no-store',
    });

    if (!res.ok) throw new Error('Failed to search reports');

    const json = await res.json();
    const reports = json?.reports || [];

    setCache(key, reports, CACHE_TTL);

    return reports;
  } catch (error) {
    console.error('Search API error:', error);
    return [];
  }
}


export async function getSingleReport(
  locale: string,
  reportSlug?: string,
) {
  const key = `reports:${locale}:${reportSlug || 'all'}`;

  const cached = getCache<any[]>(key);
  if (cached) {
    console.log('CACHE HIT:', key);
    return cached;
  }

  try {
    const res = await fetch(`${BASE_URL}/get-single-report`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': locale || 'en',
        'X-Report-Slug': reportSlug ? String(reportSlug) : '',
      },
      cache: 'no-store',
    });

    if (!res.ok) throw new Error('Failed to fetch reports');

    const data = await res.json();

    setCache(key, data, CACHE_TTL);

    return data;
  } catch (error) {
    console.error('Reports API error:', error);
    return [];
  }
}