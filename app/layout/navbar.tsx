'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { Locale, SUPPORTED_LOCALES, DEFAULT_LOCALE } from '@/lib/config';
import { X, Search, Phone } from 'lucide-react';


type Category = {
  id: number;
  name: string;
  slug: string;
};

type Props = {
  locale: Locale;
  categories: Category[]; // ✅ from server
};

export function Navbar({ locale, categories = [] }: Props) { // ✅ fallback added

  const router = useRouter();
  const pathname = usePathname();
  // Detect locale from URL

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchQuery.trim().length < 3) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);

      try {
        const res = await fetch(`/api/search?q=${searchQuery}&locale=${locale}`);
        const data = await res.json();

        setResults(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 400); // debounce

    return () => clearTimeout(timer);
  }, [searchQuery, locale]);

  const isRTL = locale === 'ar';

  const getLocalePath = (path: string) => {
    // ✅ If English → NO prefix
    if (locale === DEFAULT_LOCALE) {
      return path === '/' ? '/' : path;
    }

    // ✅ Other languages → add prefix
    return `/${locale}${path}`;
  };


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) return;

    const basePath = locale === 'en' ? '' : `/${locale}`;

    router.push(`${basePath}/search?q=${encodeURIComponent(searchQuery)}`);

    setSearchOpen(false);
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);

  // set active manus
  const cleanPath = (() => {
    if (locale === DEFAULT_LOCALE) return pathname;

    // remove /ja /ko /ar from start
    return pathname.replace(`/${locale}`, '') || '/';
  })();

  const isHome = cleanPath === '/';
  const isCategoryPage = cleanPath.startsWith('/category');
  const isCategoryActive = (slug: string) =>
    cleanPath === `/category/${slug}`;

  const isAbout = cleanPath === '/about-us';
  const isContact = cleanPath === '/contact-us';
  return (
    <>
      <nav
        className={`sticky top-0 z-40 w-full border-b border-gray-200 bg-white shadow-sm ${isRTL ? 'rtl' : 'ltr'
          }`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 navbar">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className={`flex items-center gap-6 ${isRTL ? 'ml-auto flex-row-reverse' : ''}`}>

              {/* Logo */}
              <Link href={getLocalePath('/')} className="flex items-center">
                <Image
                  src={`/images/bremont-strategy.png`}
                  alt="Bremont Strategy"
                  width={160}
                  height={40}
                  className="h-9 w-auto"
                  priority
                />
              </Link>

              {/* CONTACT NUMBERS (DESKTOP ONLY) */}
              <div className="hidden lg:flex items-center gap-6 text-sm border-l pl-6">
                <div className="flex items-center gap-2">
                  <span className="text-blue-600"><Phone size={16} className="text-blue-600" /></span>
                  <div className="leading-tight">
                    <div>USA: <a href="tel:+13028462799" className="hover:text-blue-600">+1-302-846-2799</a></div>
                    <div>EMEA: <a href="tel:+4917674502496" className="hover:text-blue-600">+49-176-7450-2496</a></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Center Navigation */}
            <div className={`hidden gap-8 md:flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>

              {/* Home */}
              <Link
                href={getLocalePath('/')}
                className={`text-sm font-medium ${isHome ? 'parent-active' : ''
                  }`}
              >
                {locale === 'en' ? 'Home' : locale === 'ja' ? 'ホーム' : locale === 'ko' ? '홈' : 'الرئيسية'}
              </Link>

              {/* Categories Dropdown */}
              <div className="relative group">
                <Link href={'#'} className={`text-sm font-medium flex items-center gap-1 ${isCategoryPage ? 'parent-active' : ''
                  }`}>
                  {locale === 'en'
                    ? 'Industries'
                    : locale === 'ja'
                      ? '産業'
                      : locale === 'ko'
                        ? '산업'
                        : 'الصناعات'}
                  <svg
                    className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      d="M6 9l6 6 6-6"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>

                {/* Dropdown */}
                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50 hidden group-hover:block">

                  {/* Invisible hover bridge */}
                  <div className="h-3 w-full absolute -top-3 left-0"></div>

                  {/* Triangle */}
                  <div className="flex justify-center">
                    <div className="w-3 h-3 bg-white rotate-45 -mb-2 shadow-md"></div>
                  </div>

                  {/* Dropdown Content */}
                  <div className="bg-white shadow-xl rounded-xl border p-6 w-[90vw] max-w-3xl">

                    <div className="grid grid-cols-2 gap-4">
                      {categories.map((cat) => (
                        <Link
                          key={cat.slug}
                          href={getLocalePath(`/category/${cat.slug}`)}
                          className={`block rounded-md px-2 ${isCategoryActive(cat.slug)
                            ? 'category-active' : ''
                            }`}
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>

                  </div>
                </div>
              </div>

              {/* About */}
              <Link
                href={getLocalePath('/about-us')}
                className={`text-sm font-medium ${isAbout ? 'parent-active' : ''
                  }`}
              >
                {locale === 'en' ? 'About' : locale === 'ja' ? '私たちについて' : locale === 'ko' ? '소개' : 'معلومات عنا'}
              </Link>

              {/* Contact */}
              <Link
                href={getLocalePath('/contact-us')}
                className={`text-sm font-medium ${isContact ? 'parent-active' : ''
                  }`}
              >
                {locale === 'en' ? 'Contact' : locale === 'ja' ? 'お問い合わせ' : locale === 'ko' ? '문의' : 'اتصل بنا'}
              </Link>

            </div>

            {/* Right Side: Search, Language, Mobile Menu */}
            <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {/* Search Icon */}
              <button
                onClick={() => setSearchOpen(true)}
                className="text-gray-600 transition-colors hover:text-blue-600"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              {/* Language Switcher */}
              <div className={`hidden gap-2 md:flex ${isRTL ? 'flex-row-reverse' : ''}`}>
                {SUPPORTED_LOCALES.map((loc) => {
                  const newPath =
                    loc === DEFAULT_LOCALE
                      ? pathname.replace(`/${locale}`, '') || '/'
                      : `/${loc}${pathname.replace(`/${locale}`, '')}`;

                  return (
                    <button
                      key={loc}
                      onClick={() => (window.location.href = newPath)} // 🔥 FORCE SSR
                      className={`px-2 py-1 text-xs font-medium rounded ${locale === loc
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      {loc.toUpperCase()}
                    </button>
                  );
                })}
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 text-gray-600 hover:text-blue-600"
                >
                  ☰
                </button>
              </div>
            </div>
          </div>
        </div>
        {mobileMenuOpen && (
          <div
            className={`
              md:hidden overflow-hidden transition-all duration-300 ease-in-out
              ${mobileMenuOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"}
            `}
          >
            <div className="bg-white border-t p-4 space-y-4">

              <Link href={getLocalePath('/')} className="block">
                {locale === 'en' ? 'Home' : locale === 'ja' ? 'ホーム' : locale === 'ko' ? '홈' : 'الرئيسية'}
              </Link>
              {/* Categories Toggle */}
              <button
                onClick={() => setCategoryOpen(!categoryOpen)}
                className="w-full flex justify-between items-center font-medium"
              >
                {locale === 'en'
                  ? 'Industries'
                  : locale === 'ja'
                    ? '産業'
                    : locale === 'ko'
                      ? '산업'
                      : 'الصناعات'}
                <span className={`transition-transform ${categoryOpen ? "rotate-180" : ""}`}>
                  ▼
                </span>
              </button>

              {/* Categories List */}
              <div
                className={` overflow-hidden transition-all duration-300 ${categoryOpen ? "max-h-60 mt-2" : "max-h-0"} `}
              >
                <div className="p-4 space-y-1">
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={getLocalePath(`/category/${cat.slug}`)}
                      className="block text-sm text-gray-600 hover:text-blue-600"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              <Link href={getLocalePath('/about-us')} className="block">
                {locale === 'en' ? 'About' : locale === 'ja' ? '私たちについて' : locale === 'ko' ? '소개' : 'معلومات عنا'}

              </Link>

              <Link href={getLocalePath('/contact-us')} className="block">
                {locale === 'en' ? 'Contact' : locale === 'ja' ? 'お問い合わせ' : locale === 'ko' ? '문의' : 'اتصل بنا'}

              </Link>

            </div>
          </div>
        )}
      </nav>

      {/* Full-Screen Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <div className="flex items-start justify-center pt-20">
            <div className={`w-full max-w-2xl mx-4 bg-white rounded-lg shadow-2xl ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
              {/* Close Button */}
              <button
                onClick={() => setSearchOpen(false)}
                className={`absolute top-4 text-gray-400 hover:text-gray-600 ${isRTL ? 'left-4' : 'right-4'}`}
                aria-label="Close"
              >
                <X size={24} />
              </button>

              {/* Search Form */}
              <form
                onSubmit={handleSearch}
                className='p-3'
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full border-b-2 border-gray-300 py-2 text-lg outline-none focus:border-blue-600"
                />

                {/* Search Results Dropdown - Would be populated with real results */}
                <div className="mt-4 max-h-80 overflow-y-auto">
                  {loading && (
                    <p className="text-sm text-gray-400">Loading...</p>
                  )}

                  {!loading && results.length > 0 && (
                    <div className="border rounded-lg shadow bg-white">
                      {results.map((item: any) => (
                        <button
                          key={item.id}
                          type="button"
                          className="w-full text-left px-4 py-3 hover:bg-gray-100 border-b last:border-0"
                        >
                          <p className="text-sm font-medium text-gray-800">
                            {item.title}
                          </p>
                        </button>
                      ))}

                      {/* View All */}
                      <button
                        type="button"
                        className="w-full text-left px-4 py-3 text-blue-600 hover:bg-gray-50"
                      >
                        {locale === 'en'
                          ? 'View all results'
                          : locale === 'ja'
                            ? 'すべて表示'
                            : locale === 'ko'
                              ? '모두보기'
                              : 'عرض النتائج'}
                      </button>
                    </div>
                  )}

                  {!loading && searchQuery.length >= 3 && results.length === 0 && (
                    <p className="text-sm text-gray-400 px-2 py-3">
                      No results found
                    </p>
                  )}
                </div>

                <div className="mt-6 flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {locale === 'en' ? 'Cancel' : locale === 'ja' ? 'キャンセル' : locale === 'ko' ? '취소' : 'إلغاء'}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium"
                  >
                    {locale === 'en' ? 'Search' : locale === 'ja' ? '検索' : locale === 'ko' ? '검색' : 'بحث'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
