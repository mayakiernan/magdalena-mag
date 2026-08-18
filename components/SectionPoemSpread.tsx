"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import type { PoemPageContent, Work } from "@/content/works";
import { getPoemLayoutForSpread, workLabel } from "@/content/works";
import Folio from "@/components/Folio";
import LetterGridTitle, {
  GRAY_BOWL_TITLE_ROWS,
} from "@/components/LetterGridTitle";

type SectionPoemSpreadProps = {
  work: Work;
  spreadIndex: number;
};

const poemTypeStyle = {
  fontFamily: "var(--font-body)",
  fontSize: "clamp(0.58rem, 1.15cqw, 0.72rem)",
  lineHeight: 1.42,
  fontWeight: 400,
  whiteSpace: "pre-wrap" as const,
  tabSize: 4,
};

function PoemVerse({ content }: { content: PoemPageContent }) {
  return (
    <div className="w-full max-w-[42ch]">
      {content.heading ? (
        <header className="mb-[1.1em]">
          <h3
            className="display m-0 text-[var(--ink)]"
            style={{
              fontSize: "clamp(0.95rem, 1.9cqw, 1.2rem)",
              fontWeight: 400,
              fontStyle: "italic",
              lineHeight: 1.15,
            }}
          >
            {content.heading}
          </h3>
          {content.attribution ? (
            <p className="utility-fine m-0 mt-[0.35em] text-[var(--ink-soft)]">
              {content.attribution}
            </p>
          ) : null}
        </header>
      ) : null}
      <pre className="m-0 text-[var(--ink)]" style={poemTypeStyle}>
        {content.text}
      </pre>
    </div>
  );
}

function PoemLeaf({
  side,
  folio,
  children,
}: {
  side: "left" | "right";
  folio?: number;
  children: ReactNode;
}) {
  const gutter =
    side === "left"
      ? "inset -12px 0 18px -14px var(--gutter-shade)"
      : "inset 12px 0 18px -14px var(--gutter-shade)";

  return (
    <article
      className="relative flex h-full w-1/2 flex-col bg-[var(--paper)]"
      style={{ boxShadow: gutter }}
    >
      {folio != null ? (
        <p className="absolute top-[10px] right-[10px] z-20">
          <Folio page={folio} />
        </p>
      ) : null}
      <div className="flex min-h-0 flex-1 items-center justify-end overflow-hidden px-[10%] py-[10%]">
        {children}
      </div>
    </article>
  );
}

function TitlePlate({ work }: { work: Work }) {
  return (
    <article
      className="relative flex h-full w-1/2 flex-col justify-center bg-[var(--paper)] px-[10%]"
      style={{
        boxShadow: "inset -12px 0 18px -14px var(--gutter-shade)",
      }}
    >
      <p className="utility-label mb-[0.75em] text-[var(--ink-soft)]">
        {workLabel(work)}
      </p>
      <h2
        className="display text-[var(--ink)]"
        style={{
          fontSize: "clamp(1.6rem, 3.4vw, 2.6rem)",
          fontWeight: 400,
          fontStyle: "italic",
          lineHeight: 1.05,
        }}
      >
        {work.title}
      </h2>
    </article>
  );
}

/**
 * Poem spreads: Gray Bowl (photo + grid), single-page title+verse,
 * or multi-page layouts with verse on either leaf.
 */
export default function SectionPoemSpread({
  work,
  spreadIndex,
}: SectionPoemSpreadProps) {
  const photo = work.images[0];
  const layout = getPoemLayoutForSpread(work, spreadIndex);
  const poem = work.poem;
  const isGrayBowl = work.id === "gray-bowl-above" && photo && poem;

  if (!layout && !poem) return null;

  return (
    <div
      className="flex h-full w-full overflow-hidden bg-[var(--paper)]"
      style={{ boxShadow: "var(--sheet-shadow)", containerType: "size" }}
      aria-label={`${work.title}, writing`}
    >
      {isGrayBowl ? (
        <>
          <article className="relative h-full w-1/2 overflow-hidden bg-[var(--ink)]">
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center"
              priority
            />

            {/* Soft centerfold shade along the gutter edge */}
            <div
              className="pointer-events-none absolute inset-y-0 right-0 z-[5] w-[min(2.4rem,7%)]"
              style={{
                background:
                  "linear-gradient(to left, rgba(11, 11, 11, 0.32), rgba(11, 11, 11, 0.08) 42%, transparent)",
              }}
              aria-hidden
            />

            <div className="absolute inset-0 z-10 flex items-center justify-center px-[8%]">
              <LetterGridTitle
                rows={GRAY_BOWL_TITLE_ROWS}
                label="Gray Bowl Above"
              />
            </div>

            {work.dateLabel ? (
              <p className="utility-fine absolute bottom-[10px] left-[10px] z-20 text-white">
                {work.dateLabel}
              </p>
            ) : null}
          </article>

          <PoemLeaf side="right" folio={work.folio}>
            <pre className="m-0 w-full max-w-[42ch] text-[var(--ink)]" style={poemTypeStyle}>
              {poem}
            </pre>
          </PoemLeaf>
        </>
      ) : layout ? (
        <>
          {layout.left === "title" ? (
            <TitlePlate work={work} />
          ) : (
            <PoemLeaf side="left">
              <PoemVerse content={layout.left} />
            </PoemLeaf>
          )}
          <PoemLeaf side="right" folio={layout.folio}>
            <PoemVerse content={layout.right} />
          </PoemLeaf>
        </>
      ) : (
        <>
          <TitlePlate work={work} />
          <PoemLeaf side="right" folio={work.folio}>
            <pre className="m-0 w-full max-w-[42ch] text-[var(--ink)]" style={poemTypeStyle}>
              {poem}
            </pre>
          </PoemLeaf>
        </>
      )}
    </div>
  );
}
