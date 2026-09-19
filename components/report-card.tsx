'use client';

import { useState } from 'react';
import Link from 'next/link';
import RequestReportModalBtn from './RequestReportModalBtn';

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

type formContent = {
  [key: string]: any;
};

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

function formatMonthYear(dateStr?: string): string {
  if (!dateStr) return '';

  const datePart = dateStr.split(' ')[0];

  let month: string | undefined;
  let year: string | undefined;

  if (datePart.includes('-')) {
    // yyyy-mm-dd (e.g. "2026-04-15")
    [year, month] = datePart.split('-');
  } else if (datePart.includes('/')) {
    // dd/mm/yyyy (e.g. "15/04/2026")
    [, month, year] = datePart.split('/');
  } else {
    return dateStr;
  }

  const monthIndex = Number(month) - 1;
  if (!year || monthIndex < 0 || monthIndex > 11) return dateStr;

  return `${MONTH_NAMES[monthIndex]} ${year}`;
}

interface ReportCardProps {
  report: Report;
  formContent?: formContent;
  reportContent?: any;
  reportTitle?: string;
  requestsampleBtnTitle?: string;
  readMoreLabel?: string;
  locale?: string;
}

export function ReportCard({ report, formContent, reportContent, reportTitle, requestsampleBtnTitle, readMoreLabel, locale }: ReportCardProps) {
  // English is unprefixed; every other locale keeps its own prefix so the
  // link stays on the same language instead of dropping into English.
  const href = !locale || locale === 'en' ? `/report/${report.report_url}` : `/${locale}/report/${report.report_url}`;

  return (
    <div className="bg-white rounded-xl flex flex-col hover:shadow-md transition shadow-lg shadow-cyan-500/10 p-5 border">

      {/* Title */}
      <h1 className="text-lg font-semibold mb-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <Link
          href={href}
          className="!text-[#074c65] cursor-pointer"
        >
          {reportTitle?.replace('[[keyword]]', report.keyword)}
        </Link>
        <Link
          href={href}
          className="shrink-0 text-xs font-medium !text-white bg-[#074c65] hover:!bg-[#053a4d] transition-colors rounded-full px-3 py-1"
        >
          {readMoreLabel || 'Read More'}
        </Link>
      </h1>

      {/* Meta */}
      <div className="flex flex-wrap gap-3 text-xs text-gray-600 mb-3 bg-gray-100 px-3 py-2 rounded-md">
        <span className="!text-sm">
          📅 {formatMonthYear(report.updated_at)}
        </span>
        <span className="!text-sm">📄 {report.pages} Pages</span>
        <span className="!text-sm">📈 CAGR: {report.forecast_cagr}%</span>
        <span className="!text-sm">⏱ {report.base_year}-{report.forecast_year}</span>
      </div>

      {/* Description */}
      <p className="!text-base line-clamp-3 mb-4">
        {report.meta_desc}
      </p>

      {/* CTA */}
      <div className="flex justify-end">
        <RequestReportModalBtn
          btnTitle={requestsampleBtnTitle}
          reportId={report.report_id}
          categoryId={report.category_id}
          keyword={report.keyword}
          locale={locale}
          formContent={formContent}
          reportContent={reportContent}
        />
      </div>
    </div>
  );
}