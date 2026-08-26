import { Metadata } from 'next';
import { Locale } from './config';

export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  publishedDate?: string;
  author?: string;
}

export function generateMetadata(
  seoData: SEOMetadata,
  locale: Locale,
  baseUrl: string = 'https://www.bremontstrategy.com'
): Metadata {
  const localePath = locale === 'en' ? '' : `/${locale}`;
  const fullUrl = `${baseUrl}${localePath}${seoData.url || ''}`;

  return {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    openGraph: {
      title: seoData.title,
      description: seoData.description,
      url: fullUrl,
      type: seoData.type || 'website',
      images: seoData.image ? [{ url: seoData.image }] : [],
      locale: locale === 'en' ? 'en_US' : locale === 'ja' ? 'ja_JP' : 'ko_KR',
      siteName: 'Bremont Strategy',
    },
    twitter: {
      card: 'summary_large_image',
      title: seoData.title,
      description: seoData.description,
      images: seoData.image ? [seoData.image] : [],
    },
    alternates: {
      canonical: fullUrl,
      languages: {
        'en': `${baseUrl}/`,
        'ja': `${baseUrl}/ja/`,
        'ko': `${baseUrl}/ko/`,
      },
    },
  };
}

export interface SchemaMarkup {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

export function generateOrganizationSchema(): SchemaMarkup {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Bremont Strategy',
    url: 'https://www.bremontstrategy.com',
    logo: 'https://www.bremontstrategy.com/logo.png',
    description: 'Leading independent management consulting firm delivering bespoke business intelligence for multi-million dollar capital allocations worldwide',
    sameAs: [
      'https://twitter.com/bremontstrategy',
      'https://linkedin.com/company/bremont-strategy',
      'https://facebook.com/bremontstrategy',
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'Sales',
        telephone: '+1-302-846-2799',
        email: 'sales@bremontstrategy.com',
        areaServed: 'US',
      },
      {
        '@type': 'ContactPoint',
        contactType: 'Sales',
        telephone: '+49-176-7450-2496',
        email: 'sales@bremontstrategy.com',
        areaServed: 'DE',
      },
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: '24a Trolley Square',
      addressLocality: 'Wilmington',
      addressRegion: 'Delaware',
      postalCode: '19801',
      addressCountry: 'US',
    },
  };
}

export function generateContactPageSchema(): SchemaMarkup {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Bremont Strategy',
    url: 'https://www.bremontstrategy.com/contact-us',
    description: 'Contact Bremont Strategy for strategic market research and management consulting services',
    mainEntity: {
      '@type': 'Organization',
      name: 'Bremont Strategy',
      telephone: '+1-302-846-2799',
      email: 'sales@bremontstrategy.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '24a Trolley Square',
        addressLocality: 'Wilmington',
        addressRegion: 'Delaware',
        postalCode: '19801',
        addressCountry: 'US',
      },
    },
  };
}

export function generateAboutPageSchema(): SchemaMarkup {
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About Bremont Strategy',
    url: 'https://www.bremontstrategy.com/about-us',
    description: 'Bremont Strategy is a leading independent management consulting firm and an institutional cornerstone for market leaders, multinational enterprises, and tier-one investors',
    mainEntity: {
      '@type': 'Organization',
      name: 'Bremont Strategy',
      foundingDate: '2015',
      url: 'https://www.bremontstrategy.com',
      description: 'Leading independent management consulting firm delivering bespoke business intelligence worldwide',
    },
  };
}

export function generatePrivacyPageSchema(): SchemaMarkup {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Privacy Policy - Bremont Strategy',
    url: 'https://www.bremontstrategy.com/privacy-policy',
    description: 'Privacy Policy for Bremont Strategy - how we collect, use, and protect your data',
  };
}

export function generateArticleSchema(
  title: string,
  description: string,
  image: string,
  datePublished: string,
  author: string,
  url: string
): SchemaMarkup {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    image: image,
    datePublished: datePublished,
    author: {
      '@type': 'Person',
      name: author,
    },
    url: url,
  };
}

// Builds Product + AggregateRating + Offer schema straight from the
// `reports` / `reports_info` / `report_prices` table data returned by
// getSingleReport(), so it always reflects what's actually in the DB.
export function generateReportSchema(report: any, url: string): SchemaMarkup {
  const offers = [
    { name: 'Single User License', price: report?.single },
    { name: 'Multi User License', price: report?.multiuser },
    { name: 'Corporate License', price: report?.corporate },
    { name: 'Excel Datapack', price: report?.excel },
  ]
    .filter((o) => o.price != null && o.price !== '')
    .map((o) => ({
      '@type': 'Offer',
      name: o.name,
      price: String(o.price),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url,
    }));

  const schema: SchemaMarkup = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: report?.report_title || report?.keyword,
    description: report?.meta_desc,
    sku: report?.report_id != null ? String(report.report_id) : undefined,
    category: report?.category_name,
    url,
    brand: {
      '@type': 'Brand',
      name: 'Bremont Strategy',
    },
  };

  if (report?.rating) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: String(report.rating),
      bestRating: '5',
      worstRating: '1',
      reviewCount: String(report.views ?? 1),
    };
  }

  if (offers.length > 0) {
    schema.offers = offers;
  }

  return schema;
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>): SchemaMarkup {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function SchemaScript({ schema }: { schema: SchemaMarkup }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
