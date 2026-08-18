"use client";

import Image from "next/image";
import type { Work, WorkImage } from "@/content/works";
import Folio from "@/components/Folio";

type SectionLivingBodySpreadProps = {
  work: Work;
};

function Plate({
  image,
  priority,
}: {
  image: WorkImage;
  priority?: boolean;
}) {
  return (
    <div
      className="relative w-full overflow-hidden bg-[var(--rule)]"
      style={{ aspectRatio: image.aspectRatio ?? "2 / 3" }}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes="(max-width: 768px) 50vw, 30vw"
        className="object-cover object-center"
        priority={priority}
      />
    </div>
  );
}

/**
 * Asymmetric three-plate editorial spread on a shared margin grid.
 * Left: title + large anchor. Right: two supporting plates + folio.
 */
export default function SectionLivingBodySpread({
  work,
}: SectionLivingBodySpreadProps) {
  const [anchor, supportA, supportB] = work.images;

  if (!anchor || !supportA || !supportB) return null;

  return (
    <div
      className="flex h-full w-full overflow-hidden bg-[var(--paper)]"
      style={{ boxShadow: "var(--sheet-shadow)", containerType: "size" }}
      aria-label={`${work.title}, photography`}
    >
      {/*
        Shared page padding = one grid: 8% margins, 12 conceptual columns
        per leaf. Plates snap to column widths (7/12, 5/12, 6/12).
      */}
      <article
        className="relative grid h-full w-1/2 grid-cols-12 grid-rows-[auto_minmax(0,1fr)_auto] gap-x-[1.1%] bg-[var(--paper)] px-[8%] pt-[8%] pb-[8%]"
        style={{
          boxShadow: "inset -12px 0 18px -14px var(--gutter-shade)",
        }}
      >
        <h2
          className="display col-span-12 mb-[0.9em] text-[var(--ink)]"
          style={{
            fontSize: "clamp(1.6rem, 3.4vw, 2.6rem)",
            fontWeight: 400,
            fontStyle: "italic",
            lineHeight: 1.05,
          }}
        >
          {work.title}
        </h2>

        <div className="col-span-9 col-start-1 row-start-2 flex min-h-0 items-end self-end">
          <div className="w-full max-h-full">
            <Plate image={anchor} priority />
          </div>
        </div>

        {work.dateLabel ? (
          <p className="utility-fine absolute bottom-[10px] left-[10px] z-20 text-[var(--ink-soft)]">
            {work.dateLabel}
          </p>
        ) : null}
      </article>

      <article
        className="relative grid h-full w-1/2 grid-cols-12 grid-rows-[minmax(0,1fr)_minmax(0,1fr)] gap-x-[1.1%] gap-y-[4%] bg-[var(--paper)] px-[8%] pt-[10%] pb-[8%]"
        style={{
          boxShadow: "inset 12px 0 18px -14px var(--gutter-shade)",
        }}
      >
        <p className="absolute top-[10px] right-[10px] z-20">
          <Folio page={work.folio} />
        </p>

        <div className="col-span-7 col-start-6 row-start-1 flex min-h-0 items-start justify-end self-start pt-[2%]">
          <div className="w-full max-h-full">
            <Plate image={supportA} />
          </div>
        </div>

        <div className="col-span-6 col-start-1 row-start-2 flex min-h-0 items-end self-end pb-[2%]">
          <div className="w-full max-h-full">
            <Plate image={supportB} />
          </div>
        </div>
      </article>
    </div>
  );
}
