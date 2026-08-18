"use client";

import Spread from "@/components/Spread";

type FlipLeafProps = {
  /** Spread shown underneath (revealed by the turn) */
  underIndex: number;
  /** Spread whose turning leaf is on top */
  overIndex: number;
  /** 0 = closed leaf, 1 = fully turned */
  progress: number;
  direction: 1 | -1;
};

/**
 * Forward: right leaf turns left around the gutter.
 * Backward: left leaf turns right around the gutter.
 * Underneath sits the destination spread for this step.
 */
export default function FlipLeaf({
  underIndex,
  overIndex,
  progress,
  direction,
}: FlipLeafProps) {
  const forward = direction === 1;
  const angle = forward ? -180 * progress : 180 * progress;

  return (
    <div
      className="absolute inset-0 z-20"
      style={{ perspective: "2400px", perspectiveOrigin: "50% 50%" }}
      aria-hidden
    >
      {/* Destination of this leaf turn */}
      <div className="absolute inset-0 z-0">
        <Spread spreadIndex={underIndex} />
      </div>

      {/* Static half of the current spread (does not turn) */}
      {forward ? (
        <div className="absolute inset-y-0 left-0 z-10 w-1/2 overflow-hidden">
          <div className="absolute inset-y-0 left-0 h-full w-[200%]">
            <Spread spreadIndex={overIndex} />
          </div>
        </div>
      ) : (
        <div className="absolute inset-y-0 right-0 z-10 w-1/2 overflow-hidden">
          <div className="absolute inset-y-0 right-0 h-full w-[200%]">
            <Spread spreadIndex={overIndex} />
          </div>
        </div>
      )}

      {/* Turning leaf */}
      <div
        className={`absolute inset-y-0 z-20 w-1/2 ${forward ? "right-0" : "left-0"}`}
        style={{
          transformOrigin: forward ? "left center" : "right center",
          transformStyle: "preserve-3d",
          transform: `rotateY(${angle}deg)`,
          willChange: "transform",
        }}
      >
        {/* Front — current page face */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          {forward ? (
            <div className="absolute inset-y-0 right-0 h-full w-[200%]">
              <Spread spreadIndex={overIndex} />
            </div>
          ) : (
            <div className="absolute inset-y-0 left-0 h-full w-[200%]">
              <Spread spreadIndex={overIndex} />
            </div>
          )}
        </div>

        {/* Back — paper verso mid-turn */}
        <div
          className="absolute inset-0 bg-[var(--paper)]"
          style={{
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
            boxShadow: forward
              ? "inset 12px 0 18px -14px var(--gutter-shade)"
              : "inset -12px 0 18px -14px var(--gutter-shade)",
          }}
        />
      </div>
    </div>
  );
}
