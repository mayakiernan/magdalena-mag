"use client";

import {
  entryFolioLabel,
  tocSections,
  type TocEntry,
  type TocSection,
} from "@/content/toc";

type IndexPageProps = {
  onNavigate: (spreadIndex: number) => void;
};

const LEFT_SECTION_IDS = new Set([
  "photography",
  "ecopoetry",
  "publications",
]);

const pagePad =
  "relative flex h-full w-1/2 flex-col overflow-hidden px-[10%] pt-[10%] pb-[7%]";

export default function IndexPage({ onNavigate }: IndexPageProps) {
  const leftSections = tocSections.filter((s) => LEFT_SECTION_IDS.has(s.id));
  const rightSections = tocSections.filter((s) => !LEFT_SECTION_IDS.has(s.id));

  return (
    <div
      className="flex h-full w-full overflow-hidden bg-[var(--paper)]"
      style={{ boxShadow: "var(--sheet-shadow)", containerType: "size" }}
      aria-label="Contents"
    >
      <nav
        className={pagePad}
        style={{
          boxShadow: "inset -12px 0 18px -14px var(--gutter-shade)",
        }}
        aria-label="Contents"
      >
        <h2
          className="display mb-[1.1em] shrink-0 text-[var(--ink)]"
          style={{
            fontSize: "clamp(1.15rem, 2.2cqw, 1.55rem)",
            fontWeight: 500,
            lineHeight: 1.05,
            letterSpacing: "-0.01em",
          }}
        >
          Contents
        </h2>

        <div className="flex min-h-0 flex-1 flex-col gap-[1em] overflow-hidden">
          {leftSections.map((section) => (
            <TocSectionBlock
              key={section.id}
              section={section}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </nav>

      <div
        className={pagePad}
        style={{
          boxShadow: "inset 12px 0 18px -14px var(--gutter-shade)",
        }}
      >
        <div className="flex min-h-0 flex-1 flex-col gap-[1em] overflow-hidden">
          {rightSections.map((section) => (
            <TocSectionBlock
              key={section.id}
              section={section}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function TocSectionBlock({
  section,
  onNavigate,
}: {
  section: TocSection;
  onNavigate: (spreadIndex: number) => void;
}) {
  return (
    <section className="min-w-0 shrink-0">
      <h3
        className="display mb-[0.35em] text-[var(--ink)]"
        style={{
          fontSize: "clamp(0.92rem, 1.55cqw, 1.12rem)",
          fontWeight: 400,
          fontStyle: "italic",
          lineHeight: 1.1,
        }}
      >
        {section.title}
      </h3>

      {section.entries.length > 0 ? (
        <ul className="m-0 list-none p-0">
          {section.entries.map((entry) => (
            <TocRow key={entry.id} entry={entry} onNavigate={onNavigate} />
          ))}
        </ul>
      ) : null}
    </section>
  );
}

function TocRow({
  entry,
  onNavigate,
}: {
  entry: TocEntry;
  onNavigate: (spreadIndex: number) => void;
}) {
  const folio = entryFolioLabel(entry);
  const numberedRow =
    "grid w-full items-baseline gap-x-[0.75em] py-[0.14em] text-left";
  const numberedStyle = { gridTemplateColumns: "2.4ch 1fr" } as const;

  const titleStyle = {
    fontSize: "clamp(0.68rem, 1.05cqw, 0.78rem)",
    fontWeight: 400,
    lineHeight: 1.35,
  } as const;

  const titleEl = (
    <span className="display text-[var(--ink)]" style={titleStyle}>
      {entry.title}
    </span>
  );

  const folioEl = (
    <span
      className="display tabular-nums text-[var(--ink)]"
      style={{
        ...titleStyle,
        fontWeight: 600,
      }}
    >
      {folio}
    </span>
  );

  // Publications — flush to the folio column edge
  if (entry.href) {
    return (
      <li className="m-0 p-0">
        <a
          href={entry.href}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full py-[0.28em] text-left transition-opacity hover:opacity-60 focus-visible:opacity-60"
        >
          <span className="display block text-[var(--ink)]" style={titleStyle}>
            {entry.title}
          </span>
          {entry.subtext ? (
            <span
              className="utility mt-[0.15em] block text-[var(--ink-soft)]"
              style={{
                fontSize: "clamp(0.48rem, 0.72cqw, 0.56rem)",
                fontWeight: 400,
                lineHeight: 1.35,
                letterSpacing: "0.02em",
                textTransform: "none",
              }}
            >
              {entry.subtext}
            </span>
          ) : null}
        </a>
      </li>
    );
  }

  if (entry.placeholder) {
    return (
      <li className={numberedRow} style={numberedStyle}>
        {folioEl}
        {titleEl}
      </li>
    );
  }

  if (entry.spreadIndex != null) {
    return (
      <li className="m-0 p-0">
        <button
          type="button"
          className={`${numberedRow} transition-opacity hover:opacity-60 focus-visible:opacity-60`}
          style={numberedStyle}
          onClick={() => onNavigate(entry.spreadIndex!)}
          aria-label={`Open ${entry.title}, page ${folio}`}
        >
          {folioEl}
          {titleEl}
        </button>
      </li>
    );
  }

  return (
    <li className={`${numberedRow} opacity-45`} style={numberedStyle}>
      {folioEl}
      {titleEl}
    </li>
  );
}
