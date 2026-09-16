"use client";

import { getReports } from "@/lib/server/api";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Category = {
    id: number;
    name: string;
};

type Report = {
    report_url: string;
    keyword: string;
    meta_desc: string;
    category: string;
};

type CategorySectionProps = {
    lang: string;
    title: string;
    browseReportsBTN: string;
    browseIndustryBTN: string;
    categories: Category[];
    initialReports: Report[];
};

// Categories and the first category's reports are fetched server-side by
// the parent page and passed in here — the initial render is fully SSR,
// strictly scoped to this locale (no client fetch, no loading flash).
// Only switching to a *different* category tab fetches client-side, since
// that's genuine runtime interactivity a page load can't pre-render.
export default function CategorySection({
    lang,
    title,
    browseReportsBTN,
    browseIndustryBTN,
    categories,
    initialReports,
}: CategorySectionProps) {
    const [reports, setReports] = useState<Report[]>(initialReports);
    const [activeCategory, setActiveCategory] = useState<number>(categories[0]?.id ?? 0);
    const [reportsLoading, setReportsLoading] = useState(false);
    const locale = lang;
    const isFirstRender = useRef(true);

    // 🔹 Fetch reports when category changes (skips the initial render —
    // that data already arrived server-rendered via `initialReports`).
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const fetchReportsByCategory = async () => {
            if (!categories.length) return;

            const selected = categories.find((c) => c.id === activeCategory);
            if (!selected) return;

            try {
                setReportsLoading(true); // 🔥 only reports loading

                const repRes = await getReports(locale, selected.id, 6);
                setReports(repRes?.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setReportsLoading(false);
            }
        };

        fetchReportsByCategory();
    }, [activeCategory]);


    return (
        <section className="gradient-wrapper">
            <div className="mx-auto max-w-7xl px-4 sm:p-6 lg:p-8">
                <h2 className="!text-2xl sm:!text-3xl md:!text-4xl font-semibold leading-snug text-center mb-10 !text-white">
                    {title}
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                    {/* 🔹 LEFT */}
                    {/* 🔹 LEFT */}
                    <div className="lg:space-y-4">

                        {/* 👉 MOBILE / TABLET (Horizontal Scroll) */}
                        <div className="flex items-center gap-2 lg:hidden mb-4">

                            {/* Left Arrow */}
                            <button
                                onClick={() => {
                                    document.getElementById("cat-scroll")?.scrollBy({ left: -200, behavior: "smooth" });
                                }}
                                className="bg-white p-2 rounded-full shadow"
                            >
                                ←
                            </button>

                            {/* Scrollable Categories */}
                            <div
                                id="cat-scroll"
                                className="flex overflow-x-auto gap-3 scroll-smooth no-scrollbar"
                            >
                                {categories.map((cat) => {
                                    const isActive = activeCategory === cat.id;

                                    return (
                                        <button
                                            key={cat.id}
                                            onClick={() => setActiveCategory(cat.id)}
                                            className={`whitespace-nowrap px-4 py-2 rounded-lg transition text-sm
              ${isActive
                                                    ? "bg-white text-blue-600 font-semibold"
                                                    : "bg-white/90 text-gray-700"
                                                }`}
                                        >
                                            {cat.name}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Right Arrow */}
                            <button
                                onClick={() => {
                                    document.getElementById("cat-scroll")?.scrollBy({ left: 200, behavior: "smooth" });
                                }}
                                className="bg-white p-2 rounded-full shadow"
                            >
                                →
                            </button>
                        </div>

                        {/* 👉 DESKTOP (Sidebar - same as before) */}
                        <div className="hidden lg:block space-y-4">
                            {categories.map((cat) => {
                                const isActive = activeCategory === cat.id;

                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => setActiveCategory(cat.id)}
                                        className={`w-full flex items-center gap-3 px-5 py-4 rounded-lg transition relative
          ${isActive
                                                ? "bg-white text-blue-600 font-semibold"
                                                : "bg-white/90 hover:bg-white text-gray-700"
                                            }`}
                                    >
                                        {cat.name}

                                        {isActive && (
                                            <span className="absolute right-[-10px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[10px] border-b-[10px] border-l-[10px] border-transparent border-l-white"></span>
                                        )}
                                    </button>
                                );
                            })}

                            <Link
                                href="/category/agriculture"
                                className="w-full block text-center mt-4 border border-white !text-white py-3 rounded-lg hover:bg-white hover:!text-blue-600 transition"
                            >
                                {browseIndustryBTN}
                            </Link>
                        </div>
                    </div>

                    {/* 🔹 RIGHT */}
                    <div className="lg:col-span-3 bg-gray-100 rounded-xl p-6">

                        <h2 className="text-center text-xl md:text-2xl font-semibold mb-6">
                            - {categories.find(c => c.id === activeCategory)?.name} -
                        </h2>

                        {reportsLoading ? (
                            <div className="grid sm:grid-cols-2 gap-6">
                                {[...Array(4)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="h-28 bg-gray-200 animate-pulse rounded-lg"
                                    ></div>
                                ))}
                            </div>
                        ) : Array.isArray(reports) && reports.length > 0 ? (
                            <>
                                <div className="grid sm:grid-cols-2 gap-6">
                                    {reports.map((report, index: number) => (
                                        <div
                                            key={index}
                                            className="rounded-lg p-5 shadow-lg shadow-cyan-500/20"
                                        >
                                            <Link href={locale === 'en' ? `/report/${report.report_url}` : `/${locale}/report/${report.report_url}`} className="!font-semibold">
                                                {report.keyword}
                                            </Link>
                                            <p className="!text-sm line-clamp-3 mt-1">
                                                {report.meta_desc}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <div className="text-center mt-6">
                                    <Link
                                        href="/category/agriculture"
                                        className="gradient-wrapper !text-white px-6 py-3 rounded-lg"
                                    >
                                        {browseReportsBTN}
                                    </Link>
                                </div>
                            </>
                        ) : (
                            // 🔥 PROFESSIONAL EMPTY STATE
                            <div className="text-center py-12">
                                <h3 className="text-lg font-semibold text-gray-700">
                                    No Reports Found
                                </h3>
                                <p className="text-sm text-gray-500 mt-2">
                                    No reports available for this category. Please try another category.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
