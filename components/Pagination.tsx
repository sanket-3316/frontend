import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Props = {
  currentPage: number;
  lastPage: number;
  basePath: string; // e.g. /category/biogas or /ja/category/biogas — no query string
};

// Builds a compact page-number list with ellipses, e.g.
// 1 … 4 5 [6] 7 8 … 42
function buildPageList(current: number, last: number): (number | '...')[] {
  const pages = new Set<number>([1, last, current, current - 1, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= last).sort((a, b) => a - b);

  const result: (number | '...')[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (prev && p - prev > 1) result.push('...');
    result.push(p);
    prev = p;
  }
  return result;
}

export default function Pagination({ currentPage, lastPage, basePath }: Props) {
  if (lastPage <= 1) return null;

  const hrefFor = (page: number) => (page <= 1 ? basePath : `${basePath}?page=${page}`);

  return (
    <nav className="flex items-center justify-center gap-2 mt-10" aria-label="Pagination">
      {currentPage > 1 ? (
        <Link
          href={hrefFor(currentPage - 1)}
          className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </Link>
      ) : (
        <span className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-100 text-gray-300">
          <ChevronLeft size={16} />
        </span>
      )}

      {buildPageList(currentPage, lastPage).map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={hrefFor(p)}
            className={`flex items-center justify-center w-9 h-9 rounded-lg text-sm font-medium ${
              p === currentPage
                ? 'gradient-wrapper !text-white'
                : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
            aria-current={p === currentPage ? 'page' : undefined}
          >
            {p}
          </Link>
        )
      )}

      {currentPage < lastPage ? (
        <Link
          href={hrefFor(currentPage + 1)}
          className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </Link>
      ) : (
        <span className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-100 text-gray-300">
          <ChevronRight size={16} />
        </span>
      )}
    </nav>
  );
}
