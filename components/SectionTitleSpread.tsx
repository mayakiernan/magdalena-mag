"use client";

import type { Work } from "@/content/works";
import { workLabel } from "@/content/works";
import Folio from "@/components/Folio";

/** Title-only placeholder spread for forthcoming works */
export default function SectionTitleSpread({ work }: { work: Work }) {
  return (
    <div
      className="flex h-full w-full overflow-hidden bg-[var(--paper)]"
      style={{ boxShadow: "var(--sheet-shadow)" }}
      aria-label={work.title}
    >
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
            fontSize: "clamp(1.8rem, 4vw, 3rem)",
            fontWeight: 400,
            fontStyle: "italic",
            lineHeight: 1.05,
          }}
        >
          {work.title}
        </h2>
        {work.dek ? (
          <p
            className="utility-fine mt-[1.25em] text-[var(--ink-soft)]"
            style={{ fontStyle: "italic" }}
          >
            {work.dek}
          </p>
        ) : null}
      </article>

      <article
        className="relative h-full w-1/2 bg-[var(--paper)]"
        style={{
          boxShadow: "inset 12px 0 18px -14px var(--gutter-shade)",
        }}
      >
        <p className="absolute top-[10px] right-[10px] z-20">
          <Folio page={work.folio} />
        </p>
      </article>
    </div>
  );
}
