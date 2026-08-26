// components/pages/FAQPage.tsx

import { notFound } from "next/navigation";
import { getContent } from "@/lib/content";
import { Locale, SUPPORTED_LOCALES, localeConfig } from "@/lib/config";
import Breadcrumb from "../Breadcrumb";
import FAQAccordion from "../FAQAccordion";
import { getHomeRoute } from "@/lib/routes";
import { Phone, Mail } from "lucide-react";

type Props = {
  locale: string;
};

type FAQItem = { q: string; a: string };
type FAQSection = { title: string; items: FAQItem[] };

export default async function FAQPage({ locale }: Props) {
  const typedLocale = locale as Locale;

  if (!SUPPORTED_LOCALES.includes(typedLocale)) {
    notFound();
  }

  const dir = localeConfig[typedLocale].dir;

  const common = await getContent(typedLocale, "common");
  const faq = await getContent(typedLocale, "faq");

  const sections: FAQSection[] = faq?.sections || [];

  return (
    <>
      {/* BREADCRUMB */}
      <div className="w-full shadow-sm bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <Breadcrumb
            items={[
              { label: common.nav.home, href: getHomeRoute(typedLocale) },
              { label: faq?.hero?.title || "FAQ" },
            ]}
          />
        </div>
      </div>

      <div dir={dir}>

        {/* HERO */}
        <section className="gradient-wrapper py-14 px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="!text-3xl md:!text-5xl md:text-4xl font-bold !text-white mb-3">
              {faq?.hero?.title}
            </h1>
            <p className="!text-white/80 text-base md:text-lg">
              {faq?.hero?.subtitle}
            </p>
          </div>
        </section>

        {/* FAQ SECTIONS */}
        <section className="py-12 md:py-16 px-4 bg-gray-50">
          <div className="max-w-3xl mx-auto space-y-10">
            {sections.map((section, i) => (
              <div key={i}>
                <h2 className="text-xl md:text-2xl font-bold text-[#0b1f5c] mb-4">
                  {section.title}
                </h2>
                <FAQAccordion items={section.items} />
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-14 px-4 gradient-wrapper">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold !text-white mb-3">
              {faq?.cta?.title}
            </h2>
            <p className="!text-white/80 mb-6">
              {faq?.cta?.description}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={`tel:${faq?.cta?.phone?.replace(/[^+\d]/g, '')}`}
                className="flex items-center gap-2 bg-white !text-[#0b1f5c] font-semibold px-6 py-3 rounded-lg hover:bg-white/90 transition"
              >
                <Phone size={16} />
                {faq?.cta?.phone}
              </a>
              <a
                href={`mailto:${faq?.cta?.email}`}
                className="flex items-center gap-2 bg-white/10 border border-white/30 !text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/20 transition"
              >
                <Mail size={16} />
                {faq?.cta?.email}
              </a>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
