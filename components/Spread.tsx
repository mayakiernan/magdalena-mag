"use client";

import IndexPage from "@/components/IndexPage";
import SectionPhotoEssay from "@/components/SectionPhotoEssay";
import SectionPoemSpread from "@/components/SectionPoemSpread";
import SectionTitleSpread from "@/components/SectionTitleSpread";
import { getWorkBySpreadIndex } from "@/content/works";

type SpreadProps = {
  spreadIndex: number;
  onNavigate?: (spreadIndex: number) => void;
};

/** Contents (0) or section content by spreadIndex */
export default function Spread({ spreadIndex, onNavigate }: SpreadProps) {
  if (spreadIndex === 0) {
    return (
      <IndexPage
        onNavigate={(next) => {
          onNavigate?.(next);
        }}
      />
    );
  }

  const work = getWorkBySpreadIndex(spreadIndex);

  if (work?.kind === "photography" && work.images.length >= 1) {
    return <SectionPhotoEssay work={work} />;
  }

  if (work?.poem || work?.poemLayouts?.length) {
    return <SectionPoemSpread work={work} spreadIndex={spreadIndex} />;
  }

  if (work) {
    return <SectionTitleSpread work={work} />;
  }

  return (
    <div
      className="flex h-full w-full overflow-hidden bg-[var(--paper)]"
      style={{ boxShadow: "var(--sheet-shadow)" }}
      aria-label="Blank spread"
    >
      <div className="h-full w-1/2 bg-[var(--paper)]" />
      <div className="h-full w-1/2 bg-[var(--paper)]" />
    </div>
  );
}
