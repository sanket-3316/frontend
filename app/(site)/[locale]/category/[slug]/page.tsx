export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Footer from '@/app/layout/footer';
import { ReportCard } from '@/components/report-card';
import { CategorySidebar } from '@/components/category-sidebar';
import { getContent } from '@/lib/content';
import { generateMetadata as generateSEO, generateBreadcrumbSchema, SchemaScript } from '@/lib/seo';
import { SUPPORTED_LOCALES, Locale, localeConfig } from '@/lib/config';
import Breadcrumb from '@/components/Breadcrumb';
import { getCategories, getCategoryReports } from '@/lib/server/api';
import { getHomeRoute } from '@/lib/routes';
import ExpandableDescription from '@/components/ExpandableDescription';

interface categoryPageProps {
  params: {
    locale: string;
    slug: string; // 🔥 add this
  };
}



type Report = {
  report_id: number;
  report_url: string;
  keyword: string;
  meta_desc?: string;
  thumbnail?: string;
  updated_at?: string;
  pages?: number;
  cagr?: string;
  forecast_cagr?: string;
  base_year?: string;
  forecast_year?: string;
  category_id?: number;
};

export default async function Page({ params }: categoryPageProps) {
  const { locale } = params;

  if (!SUPPORTED_LOCALES.includes(locale as Locale)) {
    notFound();
  }

  const typedLocale = locale as Locale;
  const categories = await getCategories(typedLocale);
  const categorySlug = params.slug;

  const apiResp = await getCategoryReports(
    typedLocale,
    categorySlug
  );
  const reports = apiResp?.reports
  const category = apiResp?.category

  const dir = localeConfig[typedLocale].dir;
  const common = await getContent(typedLocale, 'common');
  const content = await getContent(typedLocale, 'reports');

  return (
    <>

      <section
        className="hero-section-category py-10 gradient-wrapper"      >
        <div className="categoryBannerDiv">
          <div className="custom-radial-bg"></div>
        </div>

        <div className="content industryBreadcrumDiv text-center !text-white">
          <h1 className="hero-heading  !text-white">{category.category_name}</h1>

          <ExpandableDescription html={category.description} />
        </div>

      </section>
      <Breadcrumb
        items={[
          {
            label: common.nav.home,
            href: getHomeRoute(typedLocale),
          },
          {
            label: category.category_name,
          },
        ]}
      />
      <div dir={dir}>
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <CategorySidebar categories={categories} locale={typedLocale} />
              <div className="md:col-span-3">
                {reports.length > 0 ? (
                  <div className="grid  gap-6">
                    {reports.map((report: Report) => (
                      <ReportCard
                        key={report.report_id}
                        report={report}
                        formContent={common.form} 
                        reportContent={common.report} 
                        reportTitle={common.report.reportTitle} 
                        requestsampleBtnTitle={common.report.downloadPDF} 
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">
                      {common.report.noReportsFound}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
