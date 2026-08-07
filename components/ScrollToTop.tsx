// components/footer/ScrollToTop.tsx
"use client";

export default function ScrollToTop() {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 bg-[#0f4c5c] text-white px-4 py-2 rounded shadow hover:bg-[#0c3b48]"
    >
      Top
    </button>
  );
}