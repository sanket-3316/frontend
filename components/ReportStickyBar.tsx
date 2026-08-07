'use client';

import { useEffect, useState } from 'react';
import { ReportSampleModal } from './report-sample-modal';

type Props = {
  reportId: number;
  keyword: string;
  categoryId?: number;
  locale: string;
  formContent: any;
  buyNowBtn: string
  downloadPDF: string
  customizeYourReportBtn: string
};

export default function ReportStickyBar({
  reportId,
  keyword,
  categoryId,
  locale,
  formContent,
  buyNowBtn,
  downloadPDF,
  customizeYourReportBtn
}: Props) {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false); // 🔥 modal state

  // 🔥 Show on scroll
  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 🔥 Open modal
  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);
  return (
    <>
      {/* ================= DESKTOP ================= */}
      <div
        className={`hidden lg:flex fixed left-0 w-full  transition-all duration-300 z-10 ${visible ? 'top-16 opacity-100' : 'top-0 opacity-0 pointer-events-none'
          }`}
      >
        <div className="w-full bg-white shadow-md border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">

            {/* TITLE */}
            <h2 className="text-sm md:text-base font-semibold uppercase text-gray-800 truncate !my-1">
              {keyword}
            </h2>

            {/* BUTTONS */}
            <div className="flex items-center gap-3">

              {/* 🔥 OPEN MODAL */}
              <button
                onClick={openModal}
                className="gradient-wrapper  text-white px-4 py-2 rounded text-sm hover:bg-blue-500"
              >
                {downloadPDF}
              </button>
{/* 
              <button className="bg-black text-white px-4 py-2 rounded text-sm">
                {buyNowBtn}
              </button>

              <button onClick={openModal} className="bg-red-600 text-white px-4 py-2 rounded text-sm">
                {customizeYourReportBtn}
              </button> */}

            </div>
          </div>
        </div>
      </div>

      {/* ================= MOBILE / TABLET ================= */}
      <div
        className={`lg:hidden fixed bottom-0 left-0 w-full z-50 transition-all duration-300 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
          }`}
      >
        <div className="bg-white border-t shadow-lg p-3">
          <button
            onClick={openModal} // 🔥 OPEN MODAL
            className="w-full bg-orange-500 text-white py-3 rounded-lg text-sm font-semibold"
          >
            {downloadPDF}
          </button>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      <ReportSampleModal
        isOpen={open}
        onClose={() => setOpen(false)}
        reportId={reportId}
        keyword={keyword}
        categoryId={categoryId ?? ''}
        formContent={formContent}
        formTitle={keyword}
      />
    </>
  );
}