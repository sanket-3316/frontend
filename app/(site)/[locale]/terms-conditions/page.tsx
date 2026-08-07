import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getContent } from '@/lib/content';
import { generateMetadata as generateSEO, SchemaScript, generateOrganizationSchema } from '@/lib/seo';
import { SUPPORTED_LOCALES, Locale, localeConfig } from '@/lib/config';

interface TermsPageProps {
  params: { locale: string };
}

export async function generateMetadata({ params }: TermsPageProps): Promise<Metadata> {
  const { locale } = params;
  if (!SUPPORTED_LOCALES.includes(locale as Locale)) {
    notFound();
  }

  const content = await getContent(locale as Locale, 'terms');
  return generateSEO({
    title: content?.title || 'Terms & Conditions',
    description: content?.description || 'Terms and conditions',
    keywords: content?.keywords || [],
    url: locale === 'en' ? '/terms-conditions' : `/${locale}/terms-conditions`,
  }, locale as Locale);
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.filter(locale => locale !== 'en').map((locale) => ({
    locale,
  }));
}

export default async function TermsPage({ params }: TermsPageProps) {
  const { locale } = params;

  if (!SUPPORTED_LOCALES.includes(locale as Locale)) {
    notFound();
  }

  const typedLocale = locale as Locale;
  const content = await getContent(typedLocale, 'terms');
  const commonContent = await getContent(typedLocale, 'common');

  const organizationSchema = generateOrganizationSchema();
  const dir = localeConfig[typedLocale].dir;

  return (
    <>
      <SchemaScript schema={organizationSchema} />
      <div dir={dir}>
        <main className="flex-grow bg-gray-50">
          {/* Header */}
          <section className="bg-white border-b border-gray-200 py-12">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              <h1 className="text-4xl font-bold text-gray-900 animate-slideInUp">
                {content?.title || 'Terms & Conditions'}
              </h1>
            </div>
          </section>

          {/* Content */}
          <section className="py-16">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 prose prose-lg max-w-none">
              <div className="bg-white rounded-lg p-8 shadow-sm space-y-8">
                {content?.sections?.map((section: any, index: number) => (
                  <div key={index} className="animate-fadeIn" style={{ animationDelay: `${index * 100}ms` }}>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.title}</h2>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{section.content}</p>
                  </div>
                ))}
              </div>

              {/* Last Updated */}
              <div className="mt-12 text-center text-gray-600">
                <p>
                  {typedLocale === 'en'
                    ? 'Last updated: January 2024'
                    : typedLocale === 'ja'
                    ? '最終更新: 2024年1月'
                    : typedLocale === 'ko'
                    ? '마지막 업데이트: 2024년 1월'
                    : 'آخر تحديث: يناير 2024'}
                </p>
              </div>
            </div>
          </section>
        </main>
        <Footer locale={typedLocale} content={commonContent} />
      </div>
    </>
  );
}
