"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SearchBox({ locale = "en" }: { locale?: string }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // 🔥 Debounced API call
  useEffect(() => {
    if (query.trim().length < 3) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);

      try {
        const res = await fetch(
          `/api/search?q=${query}&locale=${locale}`
        );
        const data = await res.json();
        setResults(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query, locale]);

  // 🔥 Handle submit (ENTER + BUTTON)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) return;

    const base = locale === "en" ? "" : `/${locale}`;

    router.push(`${base}/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="w-full max-w-3xl mx-auto relative">
      {/* 🔥 Search Box */}
      <form onSubmit={handleSubmit}>
        <div className="flex items-center border border-gray-300 rounded-full overflow-hidden bg-white shadow-sm">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Reports..."
            className="flex-1 px-5 py-3 outline-none text-sm sm:text-base"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-3 hover:bg-blue-700 transition"
          >
            Search
          </button>
        </div>
      </form>

      {/* 🔥 Dropdown */}
      {query.length >= 3 && (
        <div className="absolute w-full bg-white border rounded-xl shadow-lg mt-2 max-h-80 overflow-y-auto z-50">
          {loading && (
            <p className="p-4 text-sm text-gray-400">Loading...</p>
          )}

          {!loading && results.length > 0 && (
            <>
              {results.map((item: any) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    const base = locale === "en" ? "" : `/${locale}`;
                    router.push(`${base}/report/${item.slug}`);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 border-b"
                >
                  {item.title}
                </button>
              ))}

              {/* View All */}
              <button
                type="button"
                onClick={() => {
                  const base = locale === "en" ? "" : `/${locale}`;
                  router.push(`${base}/search?q=${encodeURIComponent(query)}`);
                }}
                className="w-full text-left px-4 py-3 text-blue-600 hover:bg-gray-50"
              >
                View all results
              </button>
            </>
          )}

          {!loading && results.length === 0 && (
            <p className="p-4 text-sm text-gray-400">
              No results found
            </p>
          )}
        </div>
      )}
    </div>
  );
}