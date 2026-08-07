import Breadcrumb from '@/components/Breadcrumb';
import { ReportSampleModal } from '@/components/report-sample-modal';
import ReportSidebar from '@/components/ReportSidebar';
import ReportStickyBar from '@/components/ReportStickyBar';
import RequestReportModalBtn from '@/components/RequestReportModalBtn';
import ReportTableOfContents from '@/components/ReportTableOfContents';
import { Locale } from '@/lib/config';
import { getContent } from '@/lib/content';
import { getHomeRoute } from '@/lib/routes';
import { getSingleReport } from '@/lib/server/api';
import { Metadata } from 'next';

type Props = {
  params: {
    locale: string;
    slug: string;
  };
};

// ✅ SEO Metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: 'Semiconductor Wafer Reclaim Market Report',
    description:
      'Growth trends, market size, and forecast insights for semiconductor wafer reclaim market.',
    alternates: {
      canonical: `https://yourdomain.com/report/${params.slug}`,
    },
  };
}

export default async function ReportPage({ params }: Props) {
  const { locale, slug } = params;
  const typedLocale = locale as Locale;
  const common = await getContent(typedLocale, 'common');

  const apiResp = await getSingleReport(locale, slug);

  const report = apiResp?.report;
  if (!report) {
    return <div>{common?.report?.reportNotFound}</div>;
  }

  const processHTML = (html: string) => {
    if (!html) return '';

    try {
      let index = 0;

      return html.replace(/<h2([^>]*)>/gi, () => {
        const id = `section-${index++}`;
        return `<h2 id="${id}">`;
      });
    } catch (e) {
      return html;
    }
  };

  const processedHTML = processHTML(report.description);
  return (
    <div className="bg-gray-50 min-h-screen" id="report-page">
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
            <button className="border rounded-full py-3 text-gray-700 hover:bg-gray-100">
              🔒 {common?.report?.buyNow}
            </button>

            <RequestReportModalBtn
              btnTitle={common?.report?.downloadFreePDF}
              reportId={report.report_id}
              categoryId={report.category_id}
              keyword={report.keyword}
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
            href: `/category/${report.category_slug}`
          }, {
            label: report.keyword,
          },
        ]}
      />

      {/* ================= MAIN ================= */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-4 gap-6 ">

        {/* ============ SIDEBAR ============ */}

        <div className="lg:col-span-1 space-y-4">
          <div className="hidden lg:block lg:col-span-1 self-start sticky top-30 space-y-4">

            <ReportSidebar
              html={report.description}
              aboutThisReport={common?.report?.aboutThisReport}
              tableOfContents={common?.report?.tableOfContents}
              methodology={common?.report?.methodology}
              faqs={common?.report?.faqs}
            />


            <RequestReportModalBtn
              btnTitle={common?.report?.downloadFreePDF}
              reportId={report.report_id}
              categoryId={report.category_id}
              keyword={report.keyword}
              formContent={common.form}
              reportContent={common?.report}
            />

          </div>

        </div>


        {/* ============ CONTENT ============ */}
        <div className="lg:col-span-3 space-y-6 bg-white rounded-md px-2">

          <div
            className={`subtitle !text-white transition-all duration-300 overflow-hidden `}
            dangerouslySetInnerHTML={{
              __html: processedHTML
            }}
          />

          <ReportTableOfContents
            toc={report.toc}
            tableOfContentsTitle={common?.report?.tableOfContents}
            methodologyTitle={common?.report?.methodology}
          />

        </div>

      </div>

    </div>
  );
}