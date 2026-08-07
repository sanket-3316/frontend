'use client';

import { useState, useRef, useEffect } from 'react';
import DOMPurify from 'dompurify';

export default function ExpandableDescription({
  html,
}: {
  html: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    // Wait for DOM render
    const checkOverflow = () => {
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
      const maxHeight = lineHeight * 5;

      if (el.scrollHeight > maxHeight) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    checkOverflow();
  }, [html]);

  return (
    <div className="text-center max-w-3xl mx-auto !text-white">
      {/* Description */}
      <div
        ref={contentRef}
        className={`subtitle !text-white transition-all duration-300 overflow-hidden ${
          expanded ? '' : 'line-clamp-5'
        }`}
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(html),
        }}
      />

      {/* Button (only if needed) */}
      {showButton && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-sm font-semibold underline text-white/90 hover:text-white"
        >
          {expanded ? 'Read Less' : 'Read More'}
        </button>
      )}
    </div>
  );
}