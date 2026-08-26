import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import CareersPage from "@/components/pages/CareersPage";
import { getValidLocale } from "@/lib/getLocale";
import { getContent } from '@/lib/content';
import { SUPPORTED_LOCALES, Locale } from '@/lib/config';
import { getRoute } from '@/lib/routes';
import {
  generateMetadata as generateSEO,
  SchemaScript,
  generateOrganizationSchema,
  generateBreadcrumbSchema,
} from '@/lib/seo';

type Params = {
  locale: string;
};

// Careers is English-only — any other locale prefix redirects to the
// canonical /careers URL instead of 404ing or duplicating untranslated content.
function assertEnglishOnly(locale: string) {
  if (locale !== 'en') {
    redirect(getRoute('en', 'careers'));
  }
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const locale = getValidLocale(params.locale) as Locale;

  if (!SUPPORTED_LOCALES.includes(locale)) {
    notFound();
  }

  assertEnglishOnly(locale);

  const careers = await getContent('en', 'careers');
  const meta = careers?.meta || {};

  return generateSEO(
    {
      title: meta.title || 'Careers at Bremont Strategy',
      description: meta.description || 'Explore open roles at Bremont Strategy.',
      keywords: meta.keywords || ['Bremont Strategy careers'],
      url: '/careers',
    },
    'en'
  );
}

// No generateStaticParams: this route is English-only (enforced by
// assertEnglishOnly below) and the parent layout is already force-dynamic.

export default async function Page({ params }: { params: Params }) {
  const locale = getValidLocale(params.locale);

  if (!SUPPORTED_LOCALES.includes(locale)) {
    notFound();
  }

  assertEnglishOnly(locale);

  const organizationSchema = generateOrganizationSchema();
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://www.bremontstrategy.com/' },
    { name: 'Careers', url: 'https://www.bremontstrategy.com/careers' },
  ]);

  return (
    <>
      <SchemaScript schema={organizationSchema} />
      <SchemaScript schema={breadcrumbSchema} />
      <CareersPage locale="en" />
    </>
  );
}
