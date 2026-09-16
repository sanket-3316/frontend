// components/pages/TeamPage.tsx

import { notFound } from "next/navigation";
import { getContent } from "@/lib/content";
import { Locale, SUPPORTED_LOCALES, localeConfig } from "@/lib/config";
import Breadcrumb from "../Breadcrumb";
import { getHomeRoute } from "@/lib/routes";
import { Linkedin, User } from "lucide-react";

type Props = {
  locale: string;
};

type TeamMember = {
  name: string;
  title: string;
  linkedin: string | null;
  bio: string;
};

export default async function TeamPage({ locale }: Props) {
  const typedLocale = locale as Locale;

  if (!SUPPORTED_LOCALES.includes(typedLocale)) {
    notFound();
  }

  const dir = localeConfig[typedLocale].dir;

  const common = await getContent(typedLocale, "common");
  const team = await getContent(typedLocale, "team");

  const members: TeamMember[] = team?.members || [];

  return (
    <>
      {/* BREADCRUMB */}
      <div className="w-full shadow-sm bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <Breadcrumb
            items={[
              { label: common.nav.home, href: getHomeRoute(typedLocale) },
              { label: team?.hero?.title || "Our Team" },
            ]}
          />
        </div>
      </div>

      <div dir={dir}>

        {/* HERO */}
        <section className="gradient-wrapper py-14 px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="!text-3xl md:!text-5xl md:text-4xl font-bold !text-white mb-3">
              {team?.hero?.title}
            </h1>
            <p className="!text-white/80 text-base md:text-lg">
              {team?.hero?.subtitle}
            </p>
          </div>
        </section>

        {/* TEAM MEMBERS */}
        <section className="py-12 md:py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member, i) => (
              <div
                key={i}
                className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition p-6 flex flex-col"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 shrink-0 rounded-full gradient-wrapper flex items-center justify-center">
                    <User size={26} className="!text-white" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-[#0b1f5c] text-base leading-tight break-words">
                      {member.name}
                    </h3>
                    <p className="text-sm text-gray-500 leading-snug break-words">
                      {member.title}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed flex-1">
                  {member.bio}
                </p>

                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#0077b5] hover:underline w-fit"
                  >
                    <Linkedin size={16} />
                    {team?.viewLinkedin}
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>

      </div>
    </>
  );
}
