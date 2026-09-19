import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumb';
import { ReportSampleModal } from '@/components/report-sample-modal';
import ReportSidebar from '@/components/ReportSidebar';
import ReportStickyBar from '@/components/ReportStickyBar';
import RequestReportModalBtn from '@/components/RequestReportModalBtn';
import ReportTableOfContents from '@/components/ReportTableOfContents';
import LatestReports from '@/components/LatestReports';
import { Locale } from '@/lib/config';
import { getContent } from '@/lib/content';
import { getHomeRoute } from '@/lib/routes';
import { getSingleReport, getReports } from '@/lib/server/api';
import {
  generateMetadata as generateSEO,
  SchemaScript,
  generateOrganizationSchema,
  generateBreadcrumbSchema,
  generateReportSchema,
  generateFAQSchema,
} from '@/lib/seo';
import { Metadata } from 'next';

type Props = {
  params: {
    locale: string;
    slug: string;
  };
};

const SITE_URL = 'https://www.bremontstrategy.com';

// Injects id="section-N" onto each <h2> in document order (server-side —
// DOMParser isn't available during SSR) so ReportSidebar's outline links,
// which compute the same section-N ids client-side from the same h2 list,
// have a real DOM target to scroll to.
function injectHeadingIds(html: string): string {
  let index = 0;
  return html.replace(/<h2(\s[^>]*)?>/gi, (_match, attrs) => {
    const id = `section-${index++}`;
    return `<h2${attrs || ''} id="${id}">`;
  });
}

// ✅ SEO Metadata — built from the actual report, not a hardcoded stand-in
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = params;
  const apiResp = await getSingleReport(locale, slug);
  const report = apiResp?.report;

  if (!report) {
    return {
      title: 'Report Not Found | Bremont Strategy',
    };
  }

  return generateSEO(
    {
      title: report.report_title || `${report.keyword} Market Report`,
      description: report.meta_desc || report.h1_long_title,
      url: `/report/${slug}`,
    },
    locale as Locale,
    SITE_URL
  );
}

export default async function ReportPage({ params }: Props) {
  const { locale, slug } = params;
  const typedLocale = locale as Locale;
  const common = await getContent(typedLocale, 'common');

  const apiResp = await getSingleReport(locale, slug);

  const report = apiResp?.report;
  // A report not yet translated into this locale legitimately doesn't exist
  // at this URL — 404 cleanly instead of silently falling back to English.
  if (!report) {
    notFound();
  }

  // English is unprefixed; every other locale keeps its own prefix so the
  // category link/schema stays on the same language instead of dropping
  // into English.
  const localePrefix = locale === 'en' ? '' : `/${locale}`;
  const reportUrl = `${SITE_URL}${localePrefix}/report/${slug}`;
  const categoryUrl = `${SITE_URL}${localePrefix}/category/${report.category_slug}`;
  const organizationSchema = generateOrganizationSchema();
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: common.nav.home, url: `${SITE_URL}${localePrefix}/` },
    { name: report.category_name, url: categoryUrl },
    { name: report.keyword, url: reportUrl },
  ]);
  const reportSchema = generateReportSchema(report, reportUrl);
  const faqSchema = generateFAQSchema(report.primary_interview_insights);
  const descriptionHtml = injectHeadingIds(report.description || '');

  // Rest-of-site latest reports — language-scoped like the homepage carousel,
  // fetched server-side, current report excluded.
  const latestReportsResp = await getReports(typedLocale, 0, 13);
  const latestReports = (latestReportsResp?.data || [])
    .filter((item: any) => item.report_id !== report.report_id)
    .slice(0, 12)
    .map((item: any) => ({
      report_id: item.report_id,
      keyword: item.keyword,
      report_url: item.report_url,
      thumbnailSvg: `/report/thumbnail/${item.report_url}.svg?keyword=${encodeURIComponent(item.keyword)}&lang=${typedLocale}`,
    }));

  return (
    <div className="bg-gray-50 min-h-screen" id="report-page">
      <SchemaScript schema={organizationSchema} />
      <SchemaScript schema={breadcrumbSchema} />
      <SchemaScript schema={reportSchema} />
      {faqSchema && <SchemaScript schema={faqSchema} />}

      <ReportStickyBar
        reportId={report.report_id}
        keyword={report.keyword}
        categoryId={report.category_id}
        locale={locale}
        formContent={common.form}
        buyNowBtn={common?.report?.buyNow}
        downloadPDF={common?.report?.downloadPDF}
        customizeYourReportBtn={common?.report?.customizeYourReport}
      />
      {/* ================= HEADER ================= */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col lg:flex-row justify-between gap-6">

          {/* LEFT CONTENT */}
          <div className="w-full">
            <h1 className=" uppercase">
              {report.report_title}
            </h1>

            <p className="!text-sm md:!text-base  mt-2">
              {report.h1_long_title}
            </p>


          </div>

          {/* RIGHT BUTTONS */}
          <div className="flex flex-col gap-3 min-w-[350px] justify-center">
            <RequestReportModalBtn
              variant="outline"
              icon="🔒"
              btnTitle={common?.report?.buyNow}
              reportId={report.report_id}
              categoryId={report.category_id}
              keyword={report.keyword}
              locale={locale}
              formContent={common.form}
              reportContent={common?.report}
            />

            <RequestReportModalBtn
              btnTitle={common?.report?.downloadFreePDF}
              reportId={report.report_id}
              categoryId={report.category_id}
              keyword={report.keyword}
              locale={locale}
              formContent={common.form}
              reportContent={common?.report}
            />
          </div>

        </div>
      </div>

      {/* ================= BREADCRUMB ================= */}
      <Breadcrumb
        items={[
          {
            label: common.nav.home,
            href: getHomeRoute(typedLocale),
          },
          {
            label: report.category_name,
            href: `${localePrefix}/category/${report.category_slug}`
          }, {
            label: report.keyword,
          },
        ]}
      />

      {/* ================= MAIN ================= */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-4 gap-6 ">

        {/* ============ SIDEBAR ============ */}

        <div className="lg:col-span-1 space-y-4">
          <div className="lg:col-span-1 self-start lg:sticky lg:top-30 space-y-4">

            <ReportSidebar
              html={descriptionHtml}
              aboutThisReport={common?.report?.aboutThisReport}
              tableOfContents={common?.report?.tableOfContents}
              methodology={common?.report?.methodology}
              faqs={common?.report?.faqs}
            />

            {/* Mobile already has a persistent download CTA via ReportStickyBar */}
            <div className="hidden lg:block">
              <RequestReportModalBtn
                btnTitle={common?.report?.downloadFreePDF}
                reportId={report.report_id}
                categoryId={report.category_id}
                keyword={report.keyword}
                locale={locale}
                formContent={common.form}
                reportContent={common?.report}
              />
            </div>

          </div>

        </div>


        {/* ============ CONTENT ============ */}
        <div className="lg:col-span-3 space-y-6 bg-white rounded-md px-2">

          <div
            className={`subtitle transition-all duration-300 overflow-hidden `}
            dangerouslySetInnerHTML={{
              __html: descriptionHtml
            }}
          />

          <ReportTableOfContents
            toc={report.toc}
            tableOfContentsTitle={common?.report?.tableOfContents}
            methodologyTitle={common?.report?.methodology}
          />

          {report.primary_interview_insights && (
            <section
              id="frequently-asked-questions"
              className="scroll-mt-32 border-t pt-6 pb-2"
              dangerouslySetInnerHTML={{
                __html: report.primary_interview_insights,
              }}
            />
          )}

        </div>

      </div>

      {latestReports.length > 0 && (
        <section className="py-10 px-5 mt-6">
          <div className="mx-auto max-w-7xl">
            <h2 className="!text-2xl sm:!text-3xl md:!text-4xl font-semibold leading-snug text-center mb-10">
              {common?.report?.latestReports}
            </h2>
            <LatestReports
              reports={latestReports}
              reportTitle={common?.report?.reportTitle}
              locale={locale}
            />
          </div>
        </section>
      )}

    </div>
  );
}