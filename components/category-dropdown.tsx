'use client';

import { useRouter } from 'next/navigation';

export function CategoryDropdown({ categories }) {
  const router = useRouter();

  return (
    <select
      onChange={(e) => {
        const value = e.target.value;
        router.push(value ? `/reports?category=${value}` : '/reports');
      }}
      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">All Industries</option>
      {categories.map((cat) => (
        <option key={cat.slug} value={cat.slug}>
          {cat.name}
        </option>
      ))}
    </select>
  );
}