"use client";

import { useState } from "react";
import { Search } from "lucide-react";

export default function SearchBox() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const results = [
    "AI Market Report",
    "Healthcare Analytics",
    "Automotive Industry",
  ].filter((r) =>
    r.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="relative hidden lg:block">

      {/* 🔹 FIXED INPUT (NO WIDTH CHANGE) */}
      <div
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="flex items-center border rounded-full px-3 py-1 w-48 bg-gray-50"
      >
        <Search size={16} className="mr-2 text-gray-400" />

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search reports..."
          className="bg-transparent outline-none w-full text-sm"
        />
      </div>

      {/* 🔥 BIG DROPDOWN (LIKE FORTUNE UI) */}
      {open && (
        <div
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          className="absolute right-0 top-full mt-3 w-[400px] bg-white border rounded-xl shadow-xl z-50 p-4"
        >
          <div className="flex items-center border rounded px-3 py-2 mb-3">
            <Search size={16} className="mr-2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search reports..."
              className="w-full outline-none"
              autoFocus
            />
          </div>

          {/* AUTOCOMPLETE */}
          <div className="max-h-60 overflow-y-auto">
            {query ? (
              results.length > 0 ? (
                results.map((item, i) => (
                  <div
                    key={i}
                    className="px-3 py-2 hover:bg-gray-50 cursor-pointer"
                  >
                    {item}
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-gray-500">
                  No results found
                </div>
              )
            ) : (
              <div className="px-3 py-2 text-gray-400">
                Start typing to search...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}