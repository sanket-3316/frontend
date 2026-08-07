import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AboutPage from "@/components/pages/AboutPage";
import { getValidLocale } from "@/lib/getLocale";
import { getContent } from '@/lib/content';
import { SUPPORTED_LOCALES, Locale } from '@/lib/config';
import {
  generateMetadata as generateSEO,
  SchemaScript,
  generateOrganizationSchema,
  generateAboutPageSchema,
  generateBreadcrumbSchema,
} from '@/lib/seo';

type Params = {
  locale: string;
};

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const locale = getValidLocale(params.locale) as Locale;

  if (!SUPPORTED_LOCALES.includes(locale)) {
    notFound();
  }

  const about = await getContent(locale, 'about');

  const meta = about?.meta || {};
  return generateSEO(
    {
      title: meta.title || 'About Bremont Strategy | Leading Management Consulting Firm',
      description: meta.description || 'Bremont Strategy is a leading independent management consulting firm delivering bespoke business intelligence for multi-million dollar capital allocations worldwide.',
      keywords: meta.keywords || ['about Bremont Strategy', 'management consulting', 'business intelligence'],
      url: '/about-us',
    },
    locale
  );
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.filter((locale) => locale !== 'en').map((locale) => ({
    locale,
  }));
}

export default async function Page({ params }: { params: Params }) {
  const locale = getValidLocale(params.locale);

  const organizationSchema = generateOrganizationSchema();
  const aboutPageSchema = generateAboutPageSchema();
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://www.bremontstrategy.com/' },
    { name: 'About Us', url: 'https://www.bremontstrategy.com/about-us' },
  ]);

  return (
    <>
      <SchemaScript schema={organizationSchema} />
      <SchemaScript schema={aboutPageSchema} />
      <SchemaScript schema={breadcrumbSchema} />
      <AboutPage locale={locale} />
    </>
  );
}
