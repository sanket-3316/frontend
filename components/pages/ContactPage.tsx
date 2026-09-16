// components/pages/ContactPage.tsx

import { notFound } from "next/navigation";
import { getContent } from "@/lib/content";
import { SUPPORTED_LOCALES, Locale, localeConfig } from "@/lib/config";
import ContactForm from "../ContactForm";
import Breadcrumb from "../Breadcrumb";
import { getHomeRoute } from "@/lib/routes";
import { MapPin, Phone, Mail, Globe, Facebook, Linkedin, X } from "lucide-react";

type Props = {
  locale: string;
};

export default async function ContactPage({ locale }: Props) {
  const typedLocale = locale as Locale;

  if (!SUPPORTED_LOCALES.includes(typedLocale)) {
    notFound();
  }

  const dir = localeConfig[typedLocale].dir;

  const common = await getContent(typedLocale, "common");
  const contact = await getContent(typedLocale, "contact");

  const offices: Array<{
    region: string;
    address: string;
    phone: string | null;
    email: string;
  }> = contact.info?.offices || [];

  return (
    <>
      {/* BREADCRUMB */}
      <div className="w-full shadow-sm bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <Breadcrumb
            items={[
              { label: common.nav.home, href: getHomeRoute(typedLocale) },
              { label: common.nav.contact },
            ]}
          />
        </div>
      </div>

      <div dir={dir}>

        {/* HERO */}
        <section className="gradient-wrapper py-14 px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="!text-3xl md:!text-5xl font-bold !text-white mb-3">
              {contact.info?.title || "Our Global Offices"}
            </h1>
            <p className="!text-white/80 text-lg">
              {contact.hero?.subtitle}
            </p>
          </div>
        </section>

        {/* GLOBAL OFFICES */}
        <section className="py-12 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              {offices.map((office, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Globe size={18} className="text-[#0b1f5c] shrink-0" />
                    <h3 className="font-bold text-[#0b1f5c] text-base">
                      {office.region}
                    </h3>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2 text-gray-700">
                      <MapPin size={15} className="text-blue-500 mt-0.5 shrink-0" />
                      <span dangerouslySetInnerHTML={{ __html: office.address }} />
                    </div>

                    {office.phone && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <Phone size={15} className="text-blue-500 shrink-0" />
                        <a
                          href={`tel:${office.phone.replace(/[^+\d]/g, '')}`}
                          className="hover:text-blue-600 font-medium"
                        >
                          {office.phone}
                        </a>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-gray-700">
                      <Mail size={15} className="text-blue-500 shrink-0" />
                      <span dangerouslySetInnerHTML={{ __html: office.email }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* LEGAL NOTE */}
            {contact.info?.legalNote && (
              <div className="mt-6 bg-blue-50 border border-blue-100 rounded-lg px-6 py-4 text-sm text-gray-700">
                <strong className="text-[#0b1f5c]">Privacy &amp; Legal:</strong>{" "}
                {contact.info.legalNote}{" "}
                <span dangerouslySetInnerHTML={{ __html: contact.info.legalEmail }} />
              </div>
            )}
          </div>
        </section>

        {/* FORM + CONNECT */}
        <section className="py-12 px-4 bg-white">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-start">

            {/* CONTACT FORM */}
            <div className="bg-blue-50 p-8 rounded-2xl shadow-sm border border-blue-100">
              <h2 className="text-2xl font-bold text-[#0b1f5c] text-center mb-6">
                {contact.form?.title}
              </h2>
              <ContactForm content={common.form} />
            </div>

            {/* CONNECT WITH US */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-[#0b1f5c] mb-2">
                  <strong>{contact.connectWithUs}</strong>
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {contact.connectDescription}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { name: "Facebook", href: "#", color: "bg-[#3b4acc]", icon: <Facebook size={18} /> },
                    { name: "LinkedIn", href: "#", color: "bg-[#0077b5]", icon: <Linkedin size={18} /> },
                    { name: "X", href: "#", color: "bg-[#000000]", icon: <X size={18} /> },
                  ].map((s) => (
                    <a
                      key={s.name}
                      href={s.href}
                      className={`${s.color} !text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:opacity-90 transition flex items-center justify-center gap-2`}
                    >
                      {s.icon}
                      {s.name}
                    </a>
                  ))}
                </div>

                <a
                  href="mailto:sales@bremontstrategy.com"
                  className="bg-[#ef4444] !text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:opacity-90 transition flex items-center justify-center gap-2"
                >
                  <Mail size={18} />
                  Email
                </a>
              </div>

              <hr className="border-gray-200" />

              {/* QUICK CONTACT */}
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-[#0b1f5c] shrink-0" />
                  <div>
                    <div className="font-semibold text-[#0b1f5c] text-xs uppercase tracking-wide mb-0.5">USA Headquarters</div>
                    <a href="tel:+13028462799" className="hover:text-blue-600">+1-302-846-2799</a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-[#0b1f5c] shrink-0" />
                  <div>
                    <div className="font-semibold text-[#0b1f5c] text-xs uppercase tracking-wide mb-0.5">EMEA Office</div>
                    <a href="tel:+4917674502496" className="hover:text-blue-600">+49-176-7450-2496</a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-[#0b1f5c] shrink-0" />
                  <div>
                    <div className="font-semibold text-[#0b1f5c] text-xs uppercase tracking-wide mb-0.5">Sales Enquiries</div>
                    <a href="mailto:sales@bremontstrategy.com" className="hover:text-blue-600">
                      sales@bremontstrategy.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

      </div>
    </>
  );
}
