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
    variant?: 'primary' | 'outline';
    icon?: string;
};

export default function RequestReportModalBtn({
    btnTitle,
    reportId,
    categoryId,
    keyword,
    formContent,
    reportContent,
    variant = 'primary',
    icon = '⬇',
}: Props) {
    const [open, setOpen] = useState(false);
    const reportTitle = reportContent?.reportTitle?.replace('[[keyword]]', keyword)

    return (
        <>
            {/* BUTTONS */}
            <div className="flex flex-col gap-3 min-w-[250px]">
                <button
                    onClick={() => setOpen(true)}
                    className={
                        variant === 'outline'
                            ? 'border rounded-full py-3 text-gray-700 hover:bg-gray-100'
                            : 'gradient-wrapper text-white rounded-full py-3'
                    }
                >
                    {icon} {btnTitle}
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