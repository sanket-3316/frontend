'use client';

import { useState } from 'react';
import { ReportSampleModal } from '@/components/report-sample-modal';

type Props = {
    btnTitle: string;
    reportId: number;
    categoryId?: number;
    keyword: string;
    formContent: any;
    reportContent: any;
};

export default function RequestReportModalBtn({
    btnTitle,
    reportId,
    categoryId,
    keyword,
    formContent,
    reportContent,
}: Props) {
    const [open, setOpen] = useState(false);
    const reportTitle = reportContent?.reportTitle?.replace('[[keyword]]', keyword) 

    return (
        <>
            {/* BUTTONS */}
            <div className="flex flex-col gap-3 min-w-[250px]">
                <button
                    onClick={() => setOpen(true)}
                    className="gradient-wrapper  text-white rounded-full py-3"
                >
                    ⬇ {btnTitle}
                </button>

            </div>

            {/* MODAL */}
            <ReportSampleModal
                isOpen={open}
                onClose={() => setOpen(false)}
                reportId={reportId}
                keyword={keyword}
                categoryId={categoryId ?? ''}
                formContent={formContent}
                formTitle={reportTitle}
                getFreeSampleOfThisReport={reportContent.getFreeSampleOfThisReport}
            />
        </>
    );
}