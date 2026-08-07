import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ContactPage from "@/components/pages/ContactPage";
import { getValidLocale } from "@/lib/getLocale";
import { getContent } from '@/lib/content';
import { SUPPORTED_LOCALES, Locale } from '@/lib/config';
import {
  generateMetadata as generateSEO,
  SchemaScript,
  generateOrganizationSchema,
  generateContactPageSchema,
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

  const contact = await getContent(locale, 'contact');

  const meta = contact?.meta || {};
  return generateSEO(
    {
      title: meta.title || 'Contact Bremont Strategy | Global Management Consulting',
      description: meta.description || 'Get in touch with Bremont Strategy for strategic market research, competitive analysis, and management consulting services. Offices in USA, Germany, and India.',
      keywords: meta.keywords || ['contact Bremont Strategy', 'consulting inquiry', 'market research contact'],
      url: '/contact-us',
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
  const contactPageSchema = generateContactPageSchema();
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://www.bremontstrategy.com/' },
    { name: 'Contact Us', url: 'https://www.bremontstrategy.com/contact-us' },
  ]);

  return (
    <>
      <SchemaScript schema={organizationSchema} />
      <SchemaScript schema={contactPageSchema} />
      <SchemaScript schema={breadcrumbSchema} />
      <ContactPage locale={locale} />
    </>
  );
}
