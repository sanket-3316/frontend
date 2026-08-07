'use client';

import { useEffect, useState } from 'react';

export type DetectedCountry = {
  iso2: string;
  dialCode: string;
};

const DEFAULT_COUNTRY: DetectedCountry = { iso2: 'in', dialCode: '91' };
const STORAGE_KEY = 'detected-country';

// Free, keyless IP geolocation lookup used to preselect the caller's
// country in phone inputs. Falls back to DEFAULT_COUNTRY on any failure
// (offline, blocked, rate-limited) so the form never gets stuck.
export function useDetectedCountry() {
  const [country, setCountry] = useState<DetectedCountry>(DEFAULT_COUNTRY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const cached = sessionStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        setCountry(JSON.parse(cached));
      } catch {
        // ignore malformed cache
      }
      setReady(true);
      return;
    }

    fetch('https://ipwho.is/')
      .then((res) => res.json())
      .then((data) => {
        if (cancelled || !data?.success || !data?.country_code || !data?.calling_code) return;

        const detected: DetectedCountry = {
          iso2: String(data.country_code).toLowerCase(),
          dialCode: String(data.calling_code).replace('+', ''),
        };

        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(detected));
        setCountry(detected);
      })
      .catch(() => {
        // keep default
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { ...country, ready };
}
