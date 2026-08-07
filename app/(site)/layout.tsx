import { Navbar } from '@/app/layout/navbar';
import { DEFAULT_LOCALE } from '@/lib/config';

export default async function SiteLayout({ children }: any) {
  const locale = DEFAULT_LOCALE;

  return (
    <div className="flex flex-col min-h-screen">
      {children}
    </div>
  );
}