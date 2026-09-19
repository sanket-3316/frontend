'use client';

import { useEffect, useState } from 'react';

type Props = {
  html?: string;
  aboutThisReport?: string
  tableOfContents?: string
  methodology?: string
  faqs?: string
};

type Heading = {
  id: string;
  text: string;
};

// Matches the `.parent-active`/`.category-active` nav treatment used elsewhere
// on the site (navbar, category page) — brand primary bg + white text.
const ACTIVE_CLASSES = 'bg-[#074c65] !text-white';

export default function ReportSidebar({ html, aboutThisReport, tableOfContents, methodology, faqs }: Props) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>('');

  // 🔹 Extract h2 headings from the report description. The ids computed
  // here (`section-N`, Nth <h2> in document order) match the ids the server
  // injects onto the actual rendered <h2> elements — see injectHeadingIds()
  // in the report page — so clicking one has a real DOM target to land on.
  useEffect(() => {
    if (!html) return;

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      const h2Tags = doc.querySelectorAll('h2');

      const extracted: Heading[] = [];

      h2Tags.forEach((h2, index) => {
        let text = h2.textContent || '';

        // Remove "Market" prefix
        if (text.toLowerCase().includes('market')) {
          const parts = text.split(/market/i);
          text = parts[1]?.trim() || text;
        }

        if (!text) return;

        extracted.push({
          id: `section-${index}`,
          text,
        });
      });

      setHeadings(extracted);
    } catch (err) {
      console.error('Parse error:', err);
    }
  }, [html]);

  // 🔹 Scroll expand/collapse (desktop sidebar body)
  useEffect(() => {
    const handleScroll = () => {
      setExpanded(window.scrollY > 150);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 🔹 Scrollspy — highlights whichever section is currently under the
  // reading line, across the h2 outline AND the TOC/Methodology/FAQ anchors,
  // Outlook-style.
  useEffect(() => {
    if (!headings.length) return;

    const ids = [
      ...headings.map((h) => h.id),
      'table-of-content',
      'methodology',
      'frequently-asked-questions',
    ];
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;

        const topMost = visible.reduce((a, b) =>
          a.boundingClientRect.top < b.boundingClientRect.top ? a : b
        );
        setActiveId(topMost.target.id);
      },
      { rootMargin: '-96px 0px -70% 0px', threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  // 🔹 Scroll to section
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    const yOffset = -100;
    const y = el.getBoundingClientRect().top + window.scrollY + yOffset;

    window.scrollTo({
      top: y,
      behavior: 'smooth',
    });

    setMobileOpen(false);
  };

  if (!headings.length) return null;

  const navItemClass = (id: string) =>
    `block text-sm text-left w-full rounded px-2 py-1 transition-colors ${activeId === id ? ACTIVE_CLASSES : 'text-gray-700 hover:text-[#074c65]'
    }`;

  const mainItemClass = (id: string) =>
    `text-lg font-semibold block text-left w-full mt-2 rounded px-2 py-1 transition-colors ${activeId === id ? ACTIVE_CLASSES : 'text-[#195571]'
    }`;

  const activeLabel =
    headings.find((h) => h.id === activeId)?.text ||
    (activeId === 'table-of-content' ? tableOfContents : undefined) ||
    (activeId === 'methodology' ? methodology : undefined) ||
    (activeId === 'frequently-asked-questions' ? faqs : undefined) ||
    aboutThisReport;

  return (
    <>
      {/* ============ DESKTOP OUTLINE ============ */}
      <div className="hidden lg:block bg-white rounded-xl shadow p-4 transition-all duration-300">
        {/* HEADER */}
        <h3 className="font-semibold text-lg">
          {aboutThisReport}
        </h3>

        {/* CONTENT */}
        <div
          className={`overflow-hidden transition-all duration-300 ${expanded ? 'max-h-[500px] mt-4' : 'max-h-0'
            }`}
        >
          <div className=" text-sm">
            {headings.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={navItemClass(item.id)}
              >
                • {item.text}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={() => scrollToSection('table-of-content')}
          className={mainItemClass('table-of-content')}
        >
          {tableOfContents}
        </button>
        <button
          onClick={() => scrollToSection('methodology')}
          className={mainItemClass('methodology')}
        >
          {methodology}
        </button>
        <button
          onClick={() => scrollToSection('frequently-asked-questions')}
          className={mainItemClass('frequently-asked-questions')}
        >
          {faqs}
        </button>
      </div>

      {/* ============ MOBILE / TABLET DROPDOWN ============ */}
      <div className="lg:hidden bg-white rounded-xl shadow p-4">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-full flex justify-between items-center gap-2 font-semibold text-left"
        >
          <span className="truncate">{activeLabel}</span>
          <span className={`shrink-0 transition-transform ${mobileOpen ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>

        <div
          className={`overflow-hidden transition-all duration-300 ${mobileOpen ? 'max-h-[400px] mt-3 overflow-y-auto' : 'max-h-0'
            }`}
        >
          <div className="space-y-1 border-t pt-3">
            {headings.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={navItemClass(item.id)}
              >
                • {item.text}
              </button>
            ))}
            <button
              onClick={() => scrollToSection('table-of-content')}
              className={mainItemClass('table-of-content')}
            >
              {tableOfContents}
            </button>
            <button
              onClick={() => scrollToSection('methodology')}
              className={mainItemClass('methodology')}
            >
              {methodology}
            </button>
            <button
              onClick={() => scrollToSection('frequently-asked-questions')}
              className={mainItemClass('frequently-asked-questions')}
            >
              {faqs}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
