"use client";

import Image from "next/image";
import type { Work } from "@/content/works";
import { workLabel } from "@/content/works";
import Folio from "@/components/Folio";

type SectionPhotoEssayProps = {
  work: Work;
};

/** Left: inset plate + title/date. Right: full bleed + folio only. */
export default function SectionPhotoEssay({ work }: SectionPhotoEssayProps) {
  const left = work.images[0];
  const right = work.images[1] ?? work.images[0];

  if (!left || !right) return null;

  return (
    <div
      className="flex h-full w-full overflow-hidden bg-[var(--paper)]"
      style={{ boxShadow: "var(--sheet-shadow)" }}
      aria-label={`${workLabel(work)}, photography`}
    >
      {/* Left page — inset image, title + year only */}
      <article
        className="relative flex h-full w-1/2 flex-col bg-[var(--paper)]"
        style={{
          boxShadow: "inset -12px 0 18px -14px var(--gutter-shade)",
        }}
      >
        <p className="utility-label absolute top-[10px] left-[10px] z-20">
          {workLabel(work)}
        </p>

        <div className="flex min-h-0 flex-1 items-center justify-center px-[10%] py-[12%]">
          <div
            className="relative w-1/2 overflow-hidden bg-[var(--rule)]"
            style={{ aspectRatio: left.aspectRatio ?? "2 / 3" }}
          >
            <Image
              src={left.src}
              alt={left.alt}
              fill
              sizes="(max-width: 768px) 50vw, 20vw"
              className="object-cover object-center"
              priority={work.id === "nell"}
            />
          </div>
        </div>

        {work.dateLabel ? (
          <p className="utility-fine absolute bottom-[10px] left-[10px] z-20">
            {work.dateLabel}
          </p>
        ) : null}
      </article>

      {/* Right page — full bleed, folio top-right only */}
      <article
        className="relative h-full w-1/2 overflow-hidden bg-[var(--paper)]"
        style={{
          boxShadow: "inset 12px 0 18px -14px var(--gutter-shade)",
        }}
      >
        <Image
          src={right.src}
          alt={right.alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-center"
          priority={work.id === "nell"}
        />

        <p className="absolute top-[10px] right-[10px] z-20">
          <Folio page={work.folio} />
        </p>
      </article>
    </div>
  );
}
