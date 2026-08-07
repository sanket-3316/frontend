// components/ui/SearchModal.tsx

"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function SearchModal({ open, onClose }: any) {
  const [query, setQuery] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center pt-20">

      <div className="bg-white w-full max-w-xl p-6 rounded-lg relative">

        <button
          onClick={onClose}
          className="absolute right-4 top-4"
        >
          <X />
        </button>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search reports..."
          className="w-full border-b py-2 outline-none"
          autoFocus
        />
      </div>
    </div>
  );
}