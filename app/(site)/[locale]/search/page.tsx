import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Footer from '@/app/layout/footer';
import { ReportCard } from '@/components/report-card';
import { getContent } from '@/lib/content';
import { generateMetadata as generateSEO } from '@/lib/seo';
import { SUPPORTED_LOCALES, Locale, localeConfig } from '@/lib/config';
import { searchReports } from '@/lib/server/api';
import SearchBox from '@/components/SearchBox';

interface SearchPageProps {
  params: { locale: string };
  searchParams: { q?: string };
}

export async function generateMetadata({ params }: SearchPageProps): Promise<Metadata> {
  const { locale } = params;
  if (!SUPPORTED_LOCALES.includes(locale as Locale)) {
    notFound();
  }

  return generateSEO({
    title: 'Search Results',
    description: 'Search market research reports',
    url: locale === 'en' ? '/search' : `/${locale}/search`,
  }, locale as Locale);
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.filter(locale => locale !== 'en').map((locale) => ({
    locale,
  }));
}

export default async function SearchPage({ params, searchParams }: SearchPageProps) {
  const { locale } = params;
  const query = (searchParams.q || '').trim();

  if (!SUPPORTED_LOCALES.includes(locale as Locale)) {
    notFound();
  }

  const typedLocale = locale as Locale;

  const commonContent = await getContent(typedLocale, 'common');
  const t = commonContent
  const dir = localeConfig[typedLocale].dir;

  let results: any[] = [];
  if (query.trim()) {
    results = await searchReports(typedLocale, query);
  }

  return (
    <div dir={dir}>
      <main className="flex-grow bg-gray-50">
        {/* Header */}
        <section className="bg-white border-b border-gray-200 py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 animate-slideInUp mb-2">
              {t.search.searchResult}   {query && (`: "${query}"`)}
            </h1>
            <SearchBox />
          </div>
        </section>

        {/* Results */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((report) => (
                  <ReportCard
                    key={report.id}
                    report={report}
                    locale={typedLocale}
                  />
                ))}
              </div>
            ) : query.trim() ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-4">
                  {t.search.noResultFound}
                </p>
                <p className="text-gray-400">
                  {t.search.trySearchingWithDifferentKeywords}
                </p>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  {t.search.searchQuery}
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer locale={typedLocale} />
    </div>
  );
}
