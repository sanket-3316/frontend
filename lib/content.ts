import { Locale, DEFAULT_LOCALE, SUPPORTED_LOCALES } from './config';

const contentCache = new Map<string, any>();

export async function getContent(locale: Locale, page: string): Promise<any> {
  const cacheKey = `${locale}:${page}`;

  if (contentCache.has(cacheKey)) {
    return contentCache.get(cacheKey);
  }

  try {
    const content = await import(`@/content/${locale}/${page}.json`);
    const data = content.default;
    contentCache.set(cacheKey, data);
    return data;
  } catch (error) {
    console.error(`Failed to load content: ${locale}/${page}`);
    return null;
  }
}



