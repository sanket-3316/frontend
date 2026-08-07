// components/ui/Breadcrumb.tsx

import Link from "next/link";

type Item = {
  label: string;
  href?: string;
};

export default function Breadcrumb({ items }: { items: Item[] }) {
  return (
    <nav className="text-sm text-gray-600 ">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ol className="flex flex-wrap items-center gap-2">

          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li key={index} className="flex items-center flex-wrap max-w-full">

                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="!text-sm md:!text-base hover:underline break-words"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className=" !text-sm md:!text-base font-medium break-words">
                    {item.label}
                  </span>
                )}

                {!isLast && <span className="mx-2 text-gray-400">/</span>}
              </li>
            );
          })}

        </ol>
      </div>
    </nav>
  );
}