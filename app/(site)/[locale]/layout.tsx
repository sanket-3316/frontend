export const dynamic = 'force-dynamic';

import { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { SUPPORTED_LOCALES, Locale, localeConfig } from '@/lib/config';
import { Navbar } from '../../layout/navbar';
import { getCategories, getContactDetails } from '@/lib/server/api';
import { getContent } from '@/lib/content';
import Footer from '@/app/layout/footer';

interface Props {
  children: ReactNode;
  params: { locale: string };
}

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({
    locale,
  }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = params;

  if (!SUPPORTED_LOCALES.includes(locale as Locale)) {
    notFound();
  }
  const { dir } = localeConfig[locale as Locale];

  const categories = await getCategories(locale as Locale);
  const common = await getContent(locale as Locale, 'common');
  const contactDetails = await getContactDetails();

  return (
    <div dir={dir} className="flex flex-col min-h-screen">
      <Navbar locale={locale as Locale} categories={categories} nav={common.nav} contactDetails={contactDetails} />
      {children}
      <Footer locale={locale} />
    </div>
  );
}