type TocChild = {
  number: string;
  title: string;
};

type TocSection = {
  number: string;
  title: string;
  children?: TocChild[];
};

type TocChapter = {
  number: string;
  title: string;
  sections?: TocSection[];
};

type Toc = {
  language?: string;
  market_name?: string;
  chapters?: TocChapter[];
  methodology?: {
    title?: string;
    paragraphs?: string[];
  } | null;
};

type Props = {
  toc?: Toc | null;
  tableOfContentsTitle?: string;
  methodologyTitle?: string;
};

export default function ReportTableOfContents({
  toc,
  tableOfContentsTitle,
  methodologyTitle,
}: Props) {
  if (!toc) return null;

  return (
    <>
      {!!toc.chapters?.length && (
        <section id="table-of-content" className="scroll-mt-32 border-t pt-6">
          <h2 className="text-xl font-bold text-[#074c65] mb-4">
            {tableOfContentsTitle}
          </h2>

          <ol className="space-y-4">
            {toc.chapters.map((chapter) => (
              <li key={chapter.number}>
                <p className="font-semibold text-gray-800">
                  {chapter.number}. {chapter.title}
                </p>

                {!!chapter.sections?.length && (
                  <ul className="mt-2 ml-5 space-y-2">
                    {chapter.sections.map((section) => (
                      <li key={section.number} className="text-sm text-gray-700">
                        {section.number} {section.title}

                        {!!section.children?.length && (
                          <ul className="mt-1 ml-5 space-y-1 list-disc">
                            {section.children.map((child) => (
                              <li key={child.number} className="text-sm text-gray-600">
                                {child.title}
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        </section>
      )}

      {!!toc.methodology && (
        <section id="methodology" className="scroll-mt-32 border-t pt-6">
          <h2 className="text-xl font-bold text-[#074c65] mb-4">
            {methodologyTitle || toc.methodology.title}
          </h2>

          <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
            {toc.methodology.paragraphs?.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
