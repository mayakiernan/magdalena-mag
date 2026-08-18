"use client";

import Image from "next/image";
import type { Work } from "@/content/works";
import Folio from "@/components/Folio";

type SectionRiverBodySpreadProps = {
  work: Work;
};

const poemTypeStyle = {
  fontFamily: "var(--font-body)",
  fontSize: "clamp(0.58rem, 1.15cqw, 0.72rem)",
  lineHeight: 1.42,
  fontWeight: 400,
  whiteSpace: "pre-wrap" as const,
  tabSize: 4,
};

const TITLE_MASK_ID = "river-body-title-mask";

/**
 * Left: poem.
 * Right: one April mill photo. An SVG paper plate covers the upper page;
 * RIVER / BODY are cut from that plate via mask so the same photo shows
 * through the glyphs and continues in the strip below.
 */
export default function SectionRiverBodySpread({
  work,
}: SectionRiverBodySpreadProps) {
  const photo = work.images[0];
  const poem = work.poem;

  if (!photo || !poem) return null;

  return (
    <div
      className="flex h-full w-full overflow-hidden bg-[var(--paper)]"
      style={{ boxShadow: "var(--sheet-shadow)", containerType: "size" }}
      aria-label={`${work.title}, writing`}
    >
      <article
        className="relative flex h-full w-1/2 flex-col bg-[var(--paper)]"
        style={{
          boxShadow: "inset -12px 0 18px -14px var(--gutter-shade)",
        }}
      >
        <p className="absolute top-[10px] right-[10px] z-20">
          <Folio page={work.folio} />
        </p>
        <div className="flex min-h-0 flex-1 items-center justify-end overflow-hidden px-[10%] py-[10%]">
          <pre
            className="m-0 w-full max-w-[42ch] text-[var(--ink)]"
            style={poemTypeStyle}
          >
            {poem}
          </pre>
        </div>
      </article>

      <article
        className="relative h-full w-1/2 overflow-hidden bg-[var(--paper)]"
        style={{ containerType: "size" }}
      >
        {/* Single photo instance — under the masked paper and the open strip */}
        <div className="absolute inset-0">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-[center_28%] contrast-[1.18] brightness-[1.02]"
            priority
          />
        </div>

        {/*
          Paper plate over the upper page. Mask: white = paper stays,
          black type = transparent holes → photo shows through at those pixels.
        */}
        <svg
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[58%] w-full"
          viewBox="0 0 400 280"
          preserveAspectRatio="xMinYMax meet"
          aria-hidden
        >
          <defs>
            <mask
              id={TITLE_MASK_ID}
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="400"
              height="280"
            >
              <rect width="400" height="280" fill="#fff" />
              <text
                x="12"
                y="148"
                fill="#000"
                fontSize="120"
                letterSpacing="-7"
                style={{
                  fontFamily: "var(--font-utility)",
                  fontWeight: 900,
                  textTransform: "uppercase",
                }}
              >
                River
              </text>
              <text
                x="12"
                y="258"
                fill="#000"
                fontSize="120"
                letterSpacing="-7"
                style={{
                  fontFamily: "var(--font-utility)",
                  fontWeight: 900,
                  textTransform: "uppercase",
                }}
              >
                Body
              </text>
            </mask>
          </defs>
          <rect
            width="400"
            height="280"
            fill="var(--paper)"
            mask={`url(#${TITLE_MASK_ID})`}
          />
        </svg>

        <h2 className="sr-only">River Body</h2>

        {/* Soft centerfold shade — inner (gutter) edge */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-20 w-[min(2.4rem,7%)]"
          style={{
            background:
              "linear-gradient(to right, rgba(11, 11, 11, 0.32), rgba(11, 11, 11, 0.08) 42%, transparent)",
          }}
          aria-hidden
        />
      </article>
    </div>
  );
}
