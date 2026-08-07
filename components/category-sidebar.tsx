'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Locale } from '@/lib/config';

interface CategorySidebarProps {
  categories: { name: string; slug: string }[];
  locale: Locale;
}

export function CategorySidebar({ categories, locale }: CategorySidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const activeCategory = pathname.split('/').pop();
  const isRTL = locale === 'ar';

  return (
    <aside className="w-full md:w-64 bg-gray-50 rounded-lg p-2">
      <h2 className="text-lg font-bold mb-6">
        Categories
      </h2>

      <ul className="space-y-2">
        {categories.map((cat) => (
          <li key={cat.slug}>
            <button
              onClick={() => router.push(`/${locale}/category/${cat.slug}`)}
              className={`w-full px-4 py-2 rounded text-left !text-base ${
                activeCategory === cat.slug
                  ? 'gradient-wrapper text-white'
                  : ' hover:bg-gray-200'
              }`}
            >
              {cat.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}