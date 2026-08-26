// components/pages/AboutPage.tsx

import { notFound } from "next/navigation";
import { getContent } from "@/lib/content";
import { Locale, SUPPORTED_LOCALES, localeConfig } from "@/lib/config";
import Breadcrumb from "../Breadcrumb";
import { getHomeRoute } from "@/lib/routes";
import ClientLogos from "@/components/ClientLogos";

type Props = {
    locale: Locale;
};

export default async function AboutPage({ locale }: Props) {
    if (!SUPPORTED_LOCALES.includes(locale)) {
        notFound();
    }
    const typedLocale = locale as Locale;
    const dir = localeConfig[locale].dir;

    const about = await getContent(locale, "about");
    const common = await getContent(locale, "common");

    return (
        <>
            {/* BREADCRUMB */}
            <div className="w-full shadow-sm bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <Breadcrumb
                        items={[
                            { label: common.nav.home, href: getHomeRoute(typedLocale) },
                            { label: common.nav.about },
                        ]}
                    />
                </div>
            </div>

            <div dir={dir}>

                {/* HERO */}
                <section className="gradient-wrapper  py-20 px-4 text-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[url('/images/grid.svg')] bg-center" />
                    <div className="relative max-w-4xl mx-auto">
                        <span className="inline-block bg-white/10 !text-white text-xs font-semibold tracking-widest uppercase px-4 py-1 rounded-full mb-6">
                            Management Consulting
                        </span>
                        <h1 className="!text-3xl md:!text-5xl font-bold mb-6 !text-white leading-tight">
                            {about.hero.title}
                        </h1>
                        <p className="text-lg md:text-xl opacity-85 !text-white max-w-2xl mx-auto leading-relaxed">
                            {about.hero.subtitle}
                        </p>
                    </div>
                </section>

                {/* ABOUT — WHO WE ARE */}
                <section className="py-16 px-4 bg-white" id="who-we-are">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-[#0b1f5c] mb-8 border-b-2 border-blue-100 pb-4">
                            {about.about.title}
                        </h2>
                        <div className="space-y-5 text-gray-700 leading-relaxed text-base">
                            <p dangerouslySetInnerHTML={{ __html: about.about.description }} />
                            <p dangerouslySetInnerHTML={{ __html: about.about.description2 }} />
                            <p dangerouslySetInnerHTML={{ __html: about.about.description3 }} />
                            <p dangerouslySetInnerHTML={{ __html: about.about.description4 }} />
                            <p dangerouslySetInnerHTML={{ __html: about.about.description5 }} />
                        </div>
                    </div>
                </section>

                {/* PRIMARY INTELLIGENCE ENGINE */}
                <section className="py-16 px-4 bg-blue-50">
                    <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="text-blue-600 text-sm font-semibold uppercase tracking-wider">Our Methodology</span>
                            <h2 className="text-3xl font-bold text-[#0b1f5c] mt-2 mb-5">
                                {about.services.title}
                            </h2>
                            <p
                                className="text-gray-700 leading-relaxed text-base"
                                dangerouslySetInnerHTML={{ __html: about.services.description }}
                            />
                        </div>
                        <div className="gradient-wrapper  rounded-2xl p-8 text-white space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center text-2xl font-bold">85%</div>
                                <p className="text-sm leading-tight  !text-white">Direct Executive Interviews<br /><span className="!text-white/70">Recorded &amp; Transcribed</span></p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center text-2xl font-bold">6–8</div>
                                <p className="text-sm leading-tight  !text-white">Weeks Dedicated Engineering<br /><span className="!text-white/70">Human-Led, Not Algorithmic</span></p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center font-bold">10+</div>
                                <p className="text-sm leading-tight !text-white">Years Domain Expertise<br /><span className="!text-white/70">Per Principal SME Reviewer</span></p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4-STAGE VALIDATION PROTOCOL */}
                <section className="py-16 px-4 bg-white" id={about.process?.id || "validation-protocol"}>
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <span className="text-blue-600 text-sm font-semibold uppercase tracking-wider">Process</span>
                            <h2 className="text-3xl font-bold text-[#0b1f5c] mt-2 mb-4">
                                {about.process.title}
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                {about.process.subtitle}
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {about.process.steps.map((step: any, i: number) => (
                                <div
                                    key={i}
                                    className="relative !bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition group"
                                >
                                    <div className="text-5xl font-black !text-blue-50 group-hover:text-blue-100 transition absolute top-4 right-4 leading-none select-none">
                                        {step.number}
                                    </div>
                                    <div className="relative">
                                        <div className="w-10 h-10 gradient-wrapper  rounded-lg flex items-center justify-center !text-white font-bold text-sm mb-4">
                                            {step.number}
                                        </div>
                                        <h3 className="font-semibold !text-[#0b1f5c] mb-2 text-base">
                                            {step.title}
                                        </h3>
                                        <p
                                            className="text-sm !text-gray-600 leading-relaxed"
                                            dangerouslySetInnerHTML={{ __html: step.description }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* WHY CHOOSE BREMONT STRATEGY */}
                <section className="py-16 px-4 gradient-wrapper ">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold !text-white mb-3">
                                {about.capabilities.title}
                            </h2>
                            <p className="!text-white/70 max-w-xl mx-auto">
                                Bespoke intelligence engineered for board-level decisions.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {about.capabilities.items.map((item: any, i: number) => (
                                <div
                                    key={i}
                                    className="bg-white/5 border border-white/10 p-6 rounded-xl hover:bg-white/10 transition"
                                >
                                    <div className="w-8 h-1 bg-blue-400 mb-4 rounded-full" />
                                    <h3 className="font-semibold !text-white mb-2">
                                        {item.title}
                                    </h3>
                                    <p
                                        className="text-sm !text-white/70 leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: item.description }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* NOTABLE CLIENTS */}
                <section className="py-16 px-4 bg-gray-50">
                    <div className="max-w-6xl mx-auto text-center">
                        <h2 className="text-2xl font-bold text-[#0b1f5c] mb-10">
                            {about.clients.title}
                        </h2>
                        <ClientLogos
                            logos={[
                                "/images/our-clients/abb.png",
                                "/images/our-clients/apple.png",
                                "/images/our-clients/basf.png",
                                "/images/our-clients/baxter.png",
                                "/images/our-clients/bosch.png",
                                "/images/our-clients/dolby.png",
                                "/images/our-clients/exxonmobil.png",
                                "/images/our-clients/herman.png",
                                "/images/our-clients/parker.png",
                                "/images/our-clients/sony.png"
                            ]}
                        />
                    </div>
                </section>

            </div>
        </>
    );
}
