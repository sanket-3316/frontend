import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Footer from '@/app/layout/footer';
import { generateMetadata as generateSEO, generateOrganizationSchema, SchemaScript } from '@/lib/seo';
import { SUPPORTED_LOCALES, Locale, localeConfig } from '@/lib/config';
import Link from 'next/link';
import OurClients from '@/components/OurClients';
import Image from 'next/image';
import Testimonials from '@/components/Testimonials';
import LatestReports from '@/components/LatestReports';
import CategorySection from '@/components/CategorySection';
import StatsSection from '@/components/StatsSection';
import { getContent } from '@/lib/content';

interface HomePageProps {
  params: { locale: string };
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const { locale } = params;
  if (!SUPPORTED_LOCALES.includes(locale as Locale)) {
    notFound();
  }

  const content = await getContent(locale as Locale, 'home');
  const baseUrl = locale === 'en' ? BASE_URL : `${BASE_URL}/${locale}`;

  return generateSEO({
    title: content?.title || 'Bremont Strategy | Strategic Market Intelligence',
    description: content?.description || 'Comprehensive market research reports and industry insights',
    keywords: content?.keywords || [],
    url: locale === 'en' ? '/' : `/${locale}/`,
  }, locale as Locale, baseUrl);
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.filter(locale => locale !== 'en').map((locale) => ({
    locale,
  }));
}

export default async function Home({ params }: HomePageProps) {
  const { locale } = params;

  if (!SUPPORTED_LOCALES.includes(locale as Locale)) {
    notFound();
  }

  const typedLocale = locale as Locale;
  const content = await getContent(typedLocale, 'home');
  const common = await getContent(typedLocale, 'common');

  const organizationSchema = generateOrganizationSchema();
  const dir = localeConfig[typedLocale].dir;

  const getLocalePath = (path: string) => {
    if (typedLocale === 'en') {
      return path;
    }
    return `/${typedLocale}${path}`;
  };

  return (
    <>
      <SchemaScript schema={organizationSchema} />
      <div dir={dir}>
        <main className="flex-grow">
          {/* Hero Section */}
          <section
            className="relative bg-cover bg-center bg-no-repeat h-[75vh] lg:h-[80vh] flex items-center"
            style={{ backgroundImage: "url('/images/bg/hero.jpg')" }}
          >
            <div className="container relative z-10 mx-auto px-6 max-w-screen-xl">
              <div className="flex flex-col justify-center min-h-screen">
                <div className="max-w-3xl">
                  <h1 className=" !text-2xl sm:!text-3xl md:!text-4xl font-semibold leading-snug">
                    {content.hero.title}
                  </h1>
                  <p className=" font-medium max-w-2xl mt-4 mb-8">  {content.hero.subtitle} </p>

                  <div className="flex items-center gap-4">
                    <Link
                      href={getLocalePath('/category/automotive')}
                      aria-label="Discover Our Tools"
                      className="flex items-center justify-center w-12 h-12 rounded-full gradient-wrapper"
                    >
                      {/* Arrow Icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 5l7 7-7 7" />
                      </svg>
                    </Link>

                    <Link
                      href={getLocalePath('/category/agriculture')}
                      className="  font-medium"
                    >
                      {content.hero.cta}
                    </Link>
                  </div>

                </div>
              </div>
            </div>
          </section>

          <StatsSection stats={content.statsSection} />

          {/* Category Section */}
          <CategorySection lang={locale}
            title={content.exploreMarketResearchSection.title}
            browseReportsBTN={content.exploreMarketResearchSection.browseReportsBTN}
            browseIndustryBTN={content.exploreMarketResearchSection.browseIndustryBTN} />

          <section className="py-10 px-5 ">
            <div className="mx-auto max-w-7xl ">
              <div>
                <h2 className="!text-2xl sm:!text-3xl md:!text-4xl font-semibold leading-snug text-center mb-10">{content.latestFromBremont}</h2>
              </div>
              <div>
                <LatestReports 
                lang={locale} 
                reportTitle={common.report.reportTitle}/>
              </div>
            </div>
          </section>
          <section className="py-10 px-5 ">
            <div className="mx-auto max-w-7xl ">
              <div>
                <h2 className="!text-2xl sm:!text-3xl md:!text-4xl font-semibold leading-snug text-center mb-10">{content.testimonialsSection.title}</h2>
              </div>
              <div className=''>
                <Testimonials testimonials={content.testimonialsSection.testimonials} />
              </div>
            </div>
          </section>
          {/* Features Section */}
          <section className="py-10 px-5 ">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className='mb-10'>
                <h2 className="text-3xl md:text-4xl font-bold text-center">
                  {content.whyChooseUs.title}
                </h2>
                <div className="w-20 h-1 gradient-wrapper  mx-auto mt-3 rounded"></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                {content.whyChooseUs.content.map((item: { title: string, description: string, img: string }, index: number) =>
                  <div className="text-center">
                    <div className="flex justify-center mb-4">
                      <div className="w-20 h-20 flex items-center justify-center">
                        <Image
                          src={item.img}
                          alt={`  Expert-driven insights`}
                          width={60}
                          height={60}
                          loading="lazy"
                        />
                      </div>
                    </div>
                    <h3 className="!text-lg !font-semibold  mb-2"> {item.title} </h3>
                    <p className=" text-sm leading-relaxed">  {item.description} </p>
                  </div>
                )}

              </div>
            </div>
          </section>

          <section className="py-10">
            <OurClients
              title={content.trustedByIndustryLeaders}
              logos={content.clientLogos}
            />
          </section>
        </main >
       
      </div>
    </>
  );
}
