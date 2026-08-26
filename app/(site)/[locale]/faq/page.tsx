import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import FAQPage from "@/components/pages/FAQPage";
import { getValidLocale } from "@/lib/getLocale";
import { getContent } from '@/lib/content';
import { SUPPORTED_LOCALES, Locale } from '@/lib/config';
import {
  generateMetadata as generateSEO,
  SchemaScript,
  generateOrganizationSchema,
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

  const faq = await getContent(locale, 'faq');
  const meta = faq?.meta || {};

  return generateSEO(
    {
      title: meta.title || 'Frequently Asked Questions | Bremont Strategy',
      description: meta.description || 'Answers to common questions about Bremont Strategy.',
      keywords: meta.keywords || ['Bremont Strategy FAQ'],
      url: '/faq',
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
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://www.bremontstrategy.com/' },
    { name: 'FAQ', url: 'https://www.bremontstrategy.com/faq' },
  ]);

  return (
    <>
      <SchemaScript schema={organizationSchema} />
      <SchemaScript schema={breadcrumbSchema} />
      <FAQPage locale={locale} />
    </>
  );
}
