interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number;
}

const cache = new Map<string, CacheEntry>();

// Cache TTL in milliseconds (default 1 hour)
const DEFAULT_TTL = 60 * 60 * 1000;

export function getCacheKey(...args: string[]): string {
  return args.join(':');
}

export function setCache(key: string, data: any, ttl: number = DEFAULT_TTL): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl,
  });
}

export function getCache(key: string): any | null {
  const entry = cache.get(key);
  
  if (!entry) {
    return null;
  }

  const isExpired = Date.now() - entry.timestamp > entry.ttl;
  
  if (isExpired) {
    cache.delete(key);
    return null;
  }

  return entry.data;
}

export function clearCache(keyPattern?: string): void {
  if (!keyPattern) {
    cache.clear();
    return;
  }

  const regex = new RegExp(keyPattern);
  for (const key of cache.keys()) {
    if (regex.test(key)) {
      cache.delete(key);
    }
  }
}

export async function cachedFetch(
  url: string,
  options?: RequestInit,
  ttl: number = DEFAULT_TTL
): Promise<any> {
  const cacheKey = getCacheKey('fetch', url, JSON.stringify(options || {}));
  
  // Check cache first
  const cached = getCache(cacheKey);
  if (cached !== null) {
    return cached;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'User-Agent': 'MarketResearchHub/1.0',
        ...(options?.headers || {}),
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    setCache(cacheKey, data, ttl);
    return data;
  } catch (error) {
    console.error(`Failed to fetch ${url}:`, error);
    throw error;
  }
}
