// components/footer/Footer.tsx

import Link from "next/link";
import Image from "next/image";
import { Linkedin, Twitter, Facebook, Youtube } from "lucide-react";
import { Locale, DEFAULT_LOCALE } from "@/lib/config";
import { getRoute } from "@/lib/routes";
import ScrollToTop from "@/components/ScrollToTop";
import { getContent } from "@/lib/content";
import { ReactNode } from "react";

function getFooterLink(url: string, locale: Locale): string {
  // Careers is English-only — never prefix it with a locale
  if (url === '/careers') return url;

  if (url.startsWith('/')) {
    return locale === DEFAULT_LOCALE ? url : `/${locale}${url}`;
  }
  return url;
}

type FooterLink = {
  label: string;
  url: string;
};

type FooterContent = {
  certifications: {
    image: string;
    title: string;
  }[];
  information: FooterLink[];
  links: FooterLink[];
  contact: {
    title: string;
    address: string;
    phones: string[];
    email: string;
  };
  bottom: {
    company: string;
    copyright: string;
  };
  social: {
    name: "linkedin" | "twitter" | "facebook" | "youtube";
    url: string;
  }[];
};

type Props = {
  locale: Locale;
};

export default async function Footer({ locale }: Props) {
  const common = await getContent(locale, "common");
  const content: FooterContent = common.footer;
  const iconMap: Record<string, ReactNode> = {
    linkedin: <Linkedin size={18} />,
    twitter: <Twitter size={18} />,
    facebook: <Facebook size={18} />,
    youtube: <Youtube size={18} />,
  };

  return (
    <footer
      className="gradient-wrapper text-white mt-16"
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      {/* TOP */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-4 gap-10">

        {/* CERTIFICATIONS */}
        <div className="space-y-6">
          {content.certifications.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <Image
                src={item.image}
                alt={item.title}
                width={180}
                height={80}
                loading="lazy"
              />
              {/* <span className=" !text-white">{item.title}</span> */}
            </div>
          ))}
        </div>

        {/* INFORMATION */}
        <div>
          <h3 className="mb-4 font-semibold !text-white">Information</h3>
          <ul className="space-y-2">
            {content.information.map((item, i) => (
              <li className="!text-white" key={i}>
                <Link
                  href={getFooterLink(item.url, locale)}
                  className="hover:underline !text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* LINKS */}
        <div>
          <h3 className="mb-4 font-semibold !text-white">Links</h3>
          <ul className="space-y-2">
            {content.links.map((item, i) => (
              <li key={i} className="!text-white">
                <Link
                  href={getFooterLink(item.url, locale)}
                  className="hover:underline !text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="mb-4 font-semibold  !text-white">{content.contact.title}</h3>

          <p className="mb-4  !text-white">{content.contact.address}</p>

          <div className="space-y-1  !text-white">
            {content.contact.phones.map((phone, i) => (
              <a
                key={i}
                href={`tel:${phone.replace(/\D/g, "")}`}
                className="block hover:underline  !text-white"
              >
                {phone}
              </a>
            ))}
          </div>

          <a
            href={`mailto:${content.contact.email}`}
            className="block mt-3 hover:underline  !text-white"
          >
            {content.contact.email}
          </a>
        </div>

      </div>

      {/* DIVIDER */}
      <div className="border-t border-white/20" />

      {/* BOTTOM */}
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4">

        {/* COPYRIGHT */}
        <div className="flex items-center gap-3">
            
          <span className="!text-white">Bremont Strategy {content.bottom.copyright}</span>
        </div>

        {/* SOCIAL */}
        <div className="flex gap-4  !text-white">
          {content.social.map((item, i) => (
            <Link
              key={i}
              href={item.url}
              target="_blank"
              className="bg-white/10 p-3 rounded-full hover:bg-white/20 transition  !text-white"
            >
              {iconMap[item.name]}
            </Link>
          ))}
        </div>

      </div>

      {/* SCROLL TO TOP */}
      <ScrollToTop />
    </footer>
  );
}