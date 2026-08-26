import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import TeamPage from "@/components/pages/TeamPage";
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

  const team = await getContent(locale, 'team');
  const meta = team?.meta || {};

  return generateSEO(
    {
      title: meta.title || 'Our Team | Bremont Strategy',
      description: meta.description || 'Meet the leadership behind Bremont Strategy.',
      keywords: meta.keywords || ['Bremont Strategy team'],
      url: '/our-team',
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
    { name: 'Our Team', url: 'https://www.bremontstrategy.com/our-team' },
  ]);

  return (
    <>
      <SchemaScript schema={organizationSchema} />
      <SchemaScript schema={breadcrumbSchema} />
      <TeamPage locale={locale} />
    </>
  );
}
