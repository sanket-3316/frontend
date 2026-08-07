import { MetadataRoute } from 'next';
import { SUPPORTED_LOCALES } from '@/lib/config';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.bremontstrategy.com';
  const lastModified = new Date();

  const localeUrls: MetadataRoute.Sitemap = [];

  const englishPages = [
    { path: '' },
    { path: '/reports' },
    { path: '/about-us' },
    { path: '/contact-us' },
    { path: '/terms-conditions' },
    { path: '/privacy-policy' },
  ];

  englishPages.forEach((page) => {
    localeUrls.push({
      url: `${baseUrl}${page.path}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: page.path === '' ? 1 : 0.8,
    });
  });

  SUPPORTED_LOCALES.filter((locale) => locale !== 'en').forEach((locale) => {
    const otherPages = [
      { path: '' },
      { path: '/reports' },
      { path: '/about-us' },
      { path: '/contact-us' },
      { path: '/terms-conditions' },
      { path: '/privacy-policy' },
    ];

    otherPages.forEach((page) => {
      localeUrls.push({
        url: `${baseUrl}/${locale}${page.path}`,
        lastModified,
        changeFrequency: 'weekly',
        priority: page.path === '' ? 0.9 : 0.7,
      });
    });
  });

  return localeUrls;
}
