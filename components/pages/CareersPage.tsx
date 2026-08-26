// components/pages/CareersPage.tsx

import { getContent } from "@/lib/content";
import { getCareers } from "@/lib/server/api";
import { Locale } from "@/lib/config";
import Breadcrumb from "../Breadcrumb";
import { getHomeRoute } from "@/lib/routes";
import { Mail, MapPin, Quote } from "lucide-react";

type Props = {
  locale: Locale;
};

type Career = {
  id: number;
  role: string;
  practice_area: string;
  location: string;
  description?: string | null;
};

type BenefitRow = { area: string; features: string };
type WhyItem = { title: string; description: string };

export default async function CareersPage({ locale }: Props) {
  const careers = await getContent(locale, "careers");
  const common = await getContent(locale, "common");

  const openings: Career[] = await getCareers();

  const whyItems: WhyItem[] = careers?.why?.items || [];
  const benefitRows: BenefitRow[] = careers?.benefits?.rows || [];

  return (
    <>
      {/* BREADCRUMB */}
      <div className="w-full shadow-sm bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <Breadcrumb
            items={[
              { label: common.nav.home, href: getHomeRoute(locale) },
              { label: careers?.hero?.title || "Careers" },
            ]}
          />
        </div>
      </div>

      <div>

        {/* HERO */}
        <section className="gradient-wrapper py-16 md:py-20 px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="!text-3xl md:!text-5xl font-bold !text-white mb-4 leading-tight">
              {careers?.hero?.title}
            </h1>
            <p className="text-lg md:text-xl !text-white/85 mb-6">
              {careers?.hero?.subtitle}
            </p>
            <p className="!text-white/75 max-w-2xl mx-auto text-sm md:text-base">
              {careers?.intro}
            </p>
          </div>
        </section>

        {/* WHY BREMONT */}
        <section className="py-14 md:py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0b1f5c] text-center mb-10">
              {careers?.why?.title}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {whyItems.map((item, i) => (
                <div
                  key={i}
                  className="bg-blue-50 border border-blue-100 rounded-xl p-6 hover:shadow-md transition"
                >
                  <div className="w-8 h-1 bg-blue-400 mb-4 rounded-full" />
                  <h3 className="font-semibold text-[#0b1f5c] mb-2 text-base">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* KEY BENEFITS */}
        <section className="py-14 md:py-16 px-4 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0b1f5c] text-center mb-10">
              {careers?.benefits?.title}
            </h2>

            {/* Table on md+, stacked cards on mobile */}
            <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
              <table className="w-full text-left min-w-[560px]">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold text-[#0b1f5c] w-1/4">Area</th>
                    <th className="px-6 py-4 text-sm font-semibold text-[#0b1f5c]">Features</th>
                  </tr>
                </thead>
                <tbody>
                  {benefitRows.map((row, i) => (
                    <tr key={i} className={i % 2 ? 'bg-gray-50/50' : ''}>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-800 align-top">
                        {row.area}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 align-top">
                        {row.features}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden space-y-4">
              {benefitRows.map((row, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                  <div className="text-sm font-semibold text-[#0b1f5c] mb-1">{row.area}</div>
                  <div className="text-sm text-gray-600 leading-relaxed">{row.features}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIAL */}
        {careers?.testimonial && (
          <section className="py-14 px-4 gradient-wrapper">
            <div className="max-w-2xl mx-auto text-center">
              <Quote className="!text-white/40 mx-auto mb-4" size={32} />
              <p className="text-lg md:text-xl !text-white italic leading-relaxed mb-4">
                &ldquo;{careers.testimonial.quote}&rdquo;
              </p>
              <p className="!text-white/70 text-sm font-semibold uppercase tracking-wide">
                — {careers.testimonial.attribution}
              </p>
            </div>
          </section>
        )}

        {/* CURRENT OPENINGS */}
        <section className="py-14 md:py-16 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0b1f5c] text-center mb-10">
              {careers?.openings?.title}
            </h2>

            {openings.length > 0 ? (
              <>
                {/* Table on md+ */}
                <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
                  <table className="w-full text-left min-w-[640px]">
                    <thead className="bg-blue-50">
                      <tr>
                        <th className="px-6 py-4 text-sm font-semibold text-[#0b1f5c]">
                          {careers?.openings?.columns?.role || 'Role'}
                        </th>
                        <th className="px-6 py-4 text-sm font-semibold text-[#0b1f5c]">
                          {careers?.openings?.columns?.practiceArea || 'Practice Area'}
                        </th>
                        <th className="px-6 py-4 text-sm font-semibold text-[#0b1f5c]">
                          {careers?.openings?.columns?.location || 'Location'}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {openings.map((job, i) => (
                        <tr key={job.id} className={i % 2 ? 'bg-gray-50/50' : ''}>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-800">{job.role}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{job.practice_area}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{job.location}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Cards on mobile */}
                <div className="md:hidden space-y-4">
                  {openings.map((job) => (
                    <div key={job.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                      <div className="text-sm font-bold text-[#0b1f5c] mb-2">{job.role}</div>
                      <div className="text-sm text-gray-600 mb-1">{job.practice_area}</div>
                      <div className="flex items-center gap-1.5 text-sm text-gray-500">
                        <MapPin size={13} />
                        {job.location}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-center text-gray-500 max-w-lg mx-auto">
                {careers?.openings?.noOpenings}
              </p>
            )}
          </div>
        </section>

        {/* JOIN US */}
        <section className="py-14 px-4 bg-gray-50">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0b1f5c] mb-3">
              {careers?.join?.title}
            </h2>
            <p className="text-gray-600 mb-6">
              {careers?.join?.description}
            </p>
            <a
              href={`mailto:${careers?.join?.email}`}
              className="inline-flex items-center gap-2 gradient-wrapper !text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition"
            >
              <Mail size={16} />
              {careers?.join?.email}
            </a>
          </div>
        </section>

      </div>
    </>
  );
}
