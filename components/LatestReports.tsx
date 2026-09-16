"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

type Report = {
    report_id: number;
    report_url: string;
    keyword: string;
    meta_desc: string;
    category: string;
    thumbnailSvg: string;
};

type Props = {
    reports: Report[];
    reportTitle: string;
    locale: string;
};

// Data is fetched server-side by the parent page (fully server-rendered —
// no client fetch, no loading flash). This component only owns the
// carousel's scroll interactivity, which genuinely needs the browser.
export default function LatestReports({ reports, reportTitle, locale }: Props) {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!scrollRef.current || reports.length === 0) return;

        const container = scrollRef.current;
        let animationFrame: any;
        let isPaused = false;

        const speed = 0.5; // 🔥 lower = smoother

        const scroll = () => {
            if (!container || isPaused) return;

            container.scrollLeft += speed;

            // 👉 reset when half reached (because duplicated list)
            if (container.scrollLeft >= container.scrollWidth / 2) {
                container.scrollLeft = 0;
            }

            animationFrame = requestAnimationFrame(scroll);
        };

        animationFrame = requestAnimationFrame(scroll);

        // 👉 hover control
        const handleMouseEnter = () => (isPaused = true);
        const handleMouseLeave = () => {
            isPaused = false;
            animationFrame = requestAnimationFrame(scroll);
        };

        container.addEventListener("mouseenter", handleMouseEnter);
        container.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            cancelAnimationFrame(animationFrame);
            container.removeEventListener("mouseenter", handleMouseEnter);
            container.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [reports]);

    const scrollLeft = () => {
        if (!scrollRef.current) return;

        const card = scrollRef.current.children[0] as HTMLElement;
        const gap = 24; // same as gap-6 (6 * 4px = 24px)
        const scrollAmount = card.offsetWidth + gap;

        scrollRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    };

    const scrollRight = () => {
        if (!scrollRef.current) return;

        const card = scrollRef.current.children[0] as HTMLElement;
        const gap = 24;
        const scrollAmount = card.offsetWidth + gap;

        scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    };

    if (reports.length === 0) return null;

    return (
        <div className="relative">

            {/* 🔹 SCROLL CONTAINER */}
            <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar px-2"
            >
                {[...reports, ...reports].map((report, index) => (
                    <div
                        key={index}
                        className="min-w-[80%] sm:min-w-[45%] md:min-w-[30%] lg:min-w-[23%]"
                    >
                        <Card report={report} reportTitle={reportTitle} locale={locale} />
                    </div>
                ))}
            </div>

            {/* 🔹 CONTROLS */}
            <div className="flex justify-center items-center gap-4 mt-6">
                <button
                    onClick={scrollLeft}
                    className="bg-white shadow px-4 py-2 rounded-full hover:bg-gray-100 transition"
                >
                    ←
                </button>

                <button
                    onClick={scrollRight}
                    className="bg-white shadow px-4 py-2 rounded-full hover:bg-gray-100 transition"
                >
                    →
                </button>
            </div>

        </div>
    );
}

/* 🔹 CARD */
function Card({ report, reportTitle, locale }: { report: Report, reportTitle: string, locale: string }) {
    // English is unprefixed; every other locale keeps its own prefix so the
    // link stays on the same language instead of dropping into English.
    const href = locale === 'en' ? `/report/${report.report_url}` : `/${locale}/report/${report.report_url}`;

    return (
        <div className="text-center group">

            {/* Image */}
            <div className="relative w-full h-[160px] md:h-[180px] rounded-lg overflow-hidden bg-gray-200">
                {/* Plain <img>, not next/image — this is a locally-generated SVG,
                    which the Next.js image optimizer doesn't handle by default. */}
                <img
                    src={report.thumbnailSvg}
                    alt={report.keyword}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
            </div>

            {/* Title */}
            <Link
                href={href}
                className="block mt-4 !text-sm !md:text-base font-medium text-blue-900 hover:underline"
            >
                {reportTitle?.replace('[[keyword]]', report.keyword)}
            </Link>
        </div>
    );
}
