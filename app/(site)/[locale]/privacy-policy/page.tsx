import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getContent } from '@/lib/content';
import { SUPPORTED_LOCALES, Locale, localeConfig } from '@/lib/config';
import { getValidLocale } from '@/lib/getLocale';
import {
  generateMetadata as generateSEO,
  SchemaScript,
  generateOrganizationSchema,
  generatePrivacyPageSchema,
  generateBreadcrumbSchema,
} from '@/lib/seo';
import Breadcrumb from '@/components/Breadcrumb';
import { getHomeRoute } from '@/lib/routes';
import { Shield } from 'lucide-react';

type Params = { locale: string };

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const locale = getValidLocale(params.locale) as Locale;

  if (!SUPPORTED_LOCALES.includes(locale)) {
    notFound();
  }

  const privacy = await getContent(locale, 'privacy');
  const meta = privacy?.meta || {};

  return generateSEO(
    {
      title: meta.title || 'Privacy Policy | Bremont Strategy',
      description: meta.description || "Bremont Strategy's Privacy Policy outlines our commitment to protecting your personal and business data.",
      keywords: meta.keywords || ['privacy policy', 'Bremont Strategy', 'data protection', 'GDPR'],
      url: '/privacy-policy',
    },
    locale
  );
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.filter((locale) => locale !== 'en').map((locale) => ({
    locale,
  }));
}

export default async function PrivacyPolicyPage({ params }: { params: Params }) {
  const locale = getValidLocale(params.locale) as Locale;

  if (!SUPPORTED_LOCALES.includes(locale)) {
    notFound();
  }

  const privacy = await getContent(locale, 'privacy');
  const common = await getContent(locale, 'common');
  const dir = localeConfig[locale].dir;

  const organizationSchema = generateOrganizationSchema();
  const privacySchema = generatePrivacyPageSchema();
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://www.bremontstrategy.com/' },
    { name: 'Privacy Policy', url: 'https://www.bremontstrategy.com/privacy-policy' },
  ]);

  return (
    <>
      <SchemaScript schema={organizationSchema} />
      <SchemaScript schema={privacySchema} />
      <SchemaScript schema={breadcrumbSchema} />

      {/* BREADCRUMB */}
      <div className="w-full shadow-sm bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <Breadcrumb
            items={[
              { label: common.nav.home, href: getHomeRoute(locale) },
              { label: privacy?.hero?.title || 'Privacy Policy' },
            ]}
          />
        </div>
      </div>

      <div dir={dir}>

        {/* HERO */}
        <section className="bg-[#0b1f5c] py-16 px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center">
                <Shield size={28} className="!text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold !text-white mb-3">
              {privacy?.hero?.title || 'Privacy Policy'}
            </h1>
            <p className="!text-white/80 text-lg">
              {privacy?.hero?.subtitle || 'Our Commitment to Protecting Your Data'}
            </p>
          </div>
        </section>

        {/* INTRO */}
        <section className="py-10 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-gray-700 leading-relaxed">
              <p dangerouslySetInnerHTML={{ __html: privacy?.intro || '' }} />
            </div>
          </div>
        </section>

        {/* SECTIONS */}
        <section className="pb-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto space-y-8">
            {privacy?.sections?.map((section: any, index: number) => (
              <div
                key={index}
                id={`section-${section.number}`}
                className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
              >
                {/* Section header */}
                <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#0b1f5c] rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {section.number}
                  </div>
                  <h2 className="text-lg font-bold text-[#0b1f5c]">
                    {section.title}
                  </h2>
                </div>

                {/* Section body */}
                <div className="px-6 py-5 text-gray-700 text-sm leading-relaxed space-y-4">
                  {section.content && (
                    <p dangerouslySetInnerHTML={{ __html: section.content }} />
                  )}

                  {section.items && section.items.length > 0 && (
                    <ul className="space-y-3">
                      {section.items.map((item: string, j: number) => (
                        <li
                          key={j}
                          className="flex items-start gap-2"
                        >
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#0b1f5c] shrink-0" />
                          <span dangerouslySetInnerHTML={{ __html: item }} />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}

            {/* LAST UPDATED */}
            <div className="text-center text-gray-500 text-sm pt-4 border-t border-gray-100">
              {privacy?.lastUpdated}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 px-4 bg-[#0b1f5c]">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold !text-white mb-3">
              {locale === 'en' ? 'Questions about your data?' :
                locale === 'ja' ? 'データについてご質問がありますか？' :
                  locale === 'ko' ? '데이터에 대한 질문이 있으신가요?' :
                    'هل لديك أسئلة حول بياناتك؟'}
            </h3>
            <p className="!text-white/70 mb-6 text-sm">
              {locale === 'en' ? 'Contact our Legal Compliance Division for data management requests or privacy enquiries.' :
                locale === 'ja' ? 'データ管理リクエストやプライバシーに関するお問い合わせは法務コンプライアンス部門にご連絡ください。' :
                  locale === 'ko' ? '데이터 관리 요청이나 개인정보 문의는 법무 컴플라이언스 부서에 문의하세요.' :
                    'تواصل مع قسم الامتثال القانوني لطلبات إدارة البيانات أو استفسارات الخصوصية.'}
            </p>
            <a
              href="mailto:legal@bremontstrategy.com"
              className="inline-block bg-white text-[#0b1f5c] font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition"
            >
              legal@bremontstrategy.com
            </a>
          </div>
        </section>

      </div>
    </>
  );
}
