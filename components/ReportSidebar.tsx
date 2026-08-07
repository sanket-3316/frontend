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

export default function ReportSidebar({ html, aboutThisReport, tableOfContents, methodology, faqs }: Props) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [expanded, setExpanded] = useState(false);

  // ✅ HELPER: Add IDs to HTML (INSIDE SAME FILE)
  const addIdsToHTML = (htmlString: string) => {
    if (!htmlString) return '';

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlString, 'text/html');

      const h2Tags = doc.querySelectorAll('h2');

      h2Tags.forEach((h2, index) => {
        h2.setAttribute('id', `section-${index}`);
      });

      return doc.body.innerHTML;
    } catch (e) {
      console.error('HTML parse error:', e);
      return htmlString;
    }
  };

  // 🔥 Extract headings
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

  // 🔥 Scroll expand/collapse
  useEffect(() => {
    const handleScroll = () => {
      setExpanded(window.scrollY > 150);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 🔥 Scroll to section
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    const yOffset = -100;
    const y = el.getBoundingClientRect().top + window.scrollY + yOffset;

    window.scrollTo({
      top: y,
      behavior: 'smooth',
    });
  };

  if (!headings.length) return null;

  return (
    <div className="bg-white rounded-xl shadow p-4 transition-all duration-300">
      {/* HEADER */}
      <h3 className="font-semibold text-lg">
        {aboutThisReport}
      </h3>

      {/* CONTENT */}
      <div
        className={`overflow-hidden transition-all duration-300 ${expanded ? 'max-h-[500px] mt-4' : 'max-h-0'
          }`}
      >
        <div className="space-y-2 text-sm">
          {headings.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="block text-sm text-left w-full text-gray-700 hover:text-[#074c65]"
            >
              • {item.text}
            </button>
          ))}
        </div>
      </div>
      <button
        key={'table-of-content'}
        onClick={() => scrollToSection('table-of-content')}
        className="text-lg font-semibold block text-left w-full mt-2 text-[#195571]"
      >
        {tableOfContents}
      </button>
      <button
        key={'methodology'}
        onClick={() => scrollToSection('methodology')}
        className="text-lg font-semibold block text-left w-full mt-2 text-[#195571]"
      >
        {methodology}
      </button>
      <button
        key={'frequently-asked-questions'}
        onClick={() => scrollToSection('frequently-asked-questions')}
        className="text-lg font-semibold block text-left w-full mt-2 text-[#195571]"
      >
        {faqs}
      </button>
    </div>
  );
}