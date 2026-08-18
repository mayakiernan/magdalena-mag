"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Cover from "@/components/Cover";
import FlipLeaf from "@/components/FlipLeaf";
import Spread from "@/components/Spread";
import { getMaxSpreadIndex } from "@/content/toc";
import { getWorkBySpreadIndex, workLabel } from "@/content/works";
import { useReducedMotion } from "@/lib/useReducedMotion";

type Mode = "cover" | "open";

const FLIP_TOTAL_MS = 1100;
const FLIP_MIN_STEP_MS = 70;
const FLIP_MAX_STEP_MS = 320;
const MAX_SPREAD = getMaxSpreadIndex();

function stepDurations(stepCount: number): number[] {
  if (stepCount <= 0) return [];
  if (stepCount === 1) return [Math.min(FLIP_MAX_STEP_MS, FLIP_TOTAL_MS * 0.55)];

  const weights = Array.from({ length: stepCount }, (_, i) => {
    const t = i / (stepCount - 1);
    return 1.35 - Math.sin(Math.PI * t) * 0.9;
  });
  const sum = weights.reduce((a, b) => a + b, 0);
  return weights.map((w) => {
    const raw = (FLIP_TOTAL_MS * w) / sum;
    return Math.min(FLIP_MAX_STEP_MS, Math.max(FLIP_MIN_STEP_MS, raw));
  });
}

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

export default function Issue() {
  const reducedMotion = useReducedMotion();
  const [mode, setMode] = useState<Mode>("cover");
  const [spreadIndex, setSpreadIndex] = useState(0);

  const [flipOver, setFlipOver] = useState(0);
  const [flipUnder, setFlipUnder] = useState(0);
  const [flipProgress, setFlipProgress] = useState(0);
  const [flipDirection, setFlipDirection] = useState<1 | -1>(1);
  const [isFlipping, setIsFlipping] = useState(false);

  const spreadIndexRef = useRef(spreadIndex);
  const flipRunIdRef = useRef(0);
  const targetRef = useRef<number | null>(null);
  const stepFromRef = useRef(0);

  useEffect(() => {
    spreadIndexRef.current = spreadIndex;
  }, [spreadIndex]);

  const openIssue = useCallback(() => {
    if (isFlipping || mode === "open") return;
    setMode("open");
    setSpreadIndex(0);
  }, [isFlipping, mode]);

  const runFlipSequence = useCallback(
    async (fromStart: number, initialTarget: number, runId: number) => {
      let from = fromStart;
      targetRef.current = initialTarget;
      setIsFlipping(true);

      while (runId === flipRunIdRef.current) {
        const target = targetRef.current;
        if (target == null || from === target) break;

        const direction = (target > from ? 1 : -1) as 1 | -1;
        const remaining = Math.abs(target - from);
        const durations = stepDurations(remaining);
        const next = from + direction;
        const duration = durations[0] ?? FLIP_MIN_STEP_MS;

        stepFromRef.current = from;
        setFlipDirection(direction);
        setFlipOver(from);
        setFlipUnder(next);
        setFlipProgress(0);

        const stepStart = performance.now();
        await new Promise<void>((resolve) => {
          const stepTick = (now: number) => {
            if (runId !== flipRunIdRef.current) {
              resolve();
              return;
            }
            const t = Math.min(1, (now - stepStart) / duration);
            setFlipProgress(easeOutCubic(t));
            if (t < 1) {
              window.requestAnimationFrame(stepTick);
            } else {
              resolve();
            }
          };
          window.requestAnimationFrame(stepTick);
        });

        if (runId !== flipRunIdRef.current) return;

        from = next;
        spreadIndexRef.current = from;
        setSpreadIndex(from);
        setFlipProgress(1);
      }

      if (runId === flipRunIdRef.current) {
        const finalTarget = targetRef.current ?? from;
        setSpreadIndex(finalTarget);
        spreadIndexRef.current = finalTarget;
        setIsFlipping(false);
        setFlipProgress(0);
        targetRef.current = null;
      }
    },
    [],
  );

  const goToSpread = useCallback(
    (next: number) => {
      if (mode !== "open") return;
      if (next < 0 || next > MAX_SPREAD) return;

      const from = isFlipping
        ? flipProgress < 0.5
          ? stepFromRef.current
          : spreadIndexRef.current
        : spreadIndexRef.current;

      if (next === from && !isFlipping) return;

      // Single-step interior turns stay instant.
      if (!reducedMotion && Math.abs(next - from) === 1 && !isFlipping) {
        setSpreadIndex(next);
        spreadIndexRef.current = next;
        return;
      }

      if (reducedMotion) {
        flipRunIdRef.current += 1;
        setIsFlipping(false);
        setFlipProgress(0);
        targetRef.current = null;
        setSpreadIndex(next);
        spreadIndexRef.current = next;
        return;
      }

      if (isFlipping) {
        flipRunIdRef.current += 1;
        const runId = flipRunIdRef.current;
        setSpreadIndex(from);
        spreadIndexRef.current = from;
        if (Math.abs(next - from) <= 1) {
          setIsFlipping(false);
          setFlipProgress(0);
          targetRef.current = null;
          setSpreadIndex(next);
          spreadIndexRef.current = next;
          return;
        }
        void runFlipSequence(from, next, runId);
        return;
      }

      const runId = ++flipRunIdRef.current;
      void runFlipSequence(from, next, runId);
    },
    [mode, reducedMotion, isFlipping, flipProgress, runFlipSequence],
  );

  const returnToContents = useCallback(() => {
    if (mode !== "open") return;
    goToSpread(0);
  }, [mode, goToSpread]);

  useEffect(() => {
    if (mode !== "cover") return;

    const onWheel = (event: WheelEvent) => {
      if (event.deltaY > 24) {
        event.preventDefault();
        openIssue();
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [mode, openIssue]);

  useEffect(() => {
    if (mode !== "open") return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goToSpread(spreadIndexRef.current + 1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        if (spreadIndexRef.current === 0 && !isFlipping) {
          setMode("cover");
          return;
        }
        goToSpread(spreadIndexRef.current - 1);
      } else if (event.key === "Home") {
        event.preventDefault();
        goToSpread(0);
      } else if (event.key === "Escape") {
        event.preventDefault();
        if (spreadIndexRef.current === 0 && !isFlipping) {
          setMode("cover");
        } else {
          goToSpread(0);
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, isFlipping, goToSpread]);

  const activeWork = getWorkBySpreadIndex(spreadIndex);

  const liveMessage =
    mode === "cover"
      ? "Cover. Open the issue to begin."
      : isFlipping
        ? "Turning pages."
        : spreadIndex === 0
          ? "Contents."
          : activeWork
            ? `Page ${activeWork.folio}. ${workLabel(activeWork)}, ${activeWork.kind}, ${activeWork.year}.`
            : `Spread ${spreadIndex}.`;

  return (
    <div className="relative flex h-[100dvh] w-full items-center justify-center overflow-hidden bg-[var(--stage)] text-[var(--ink)]">
      <button
        type="button"
        className="absolute top-[10px] left-[10px] z-50 transition-opacity hover:opacity-80"
        style={{
          fontFamily: "var(--font-utility)",
          fontWeight: 700,
          fontSize: "clamp(0.72rem, 1.05vw, 0.82rem)",
          letterSpacing: "0.01em",
          lineHeight: 1,
          color: "var(--ink)",
          background: "var(--masthead)",
          borderRadius: "0.65rem 0.65rem 0 0",
          padding: "0.62em 1.2em 0.55em",
          boxShadow: "1px 0 0 rgba(11, 11, 11, 0.08)",
        }}
        onClick={() => {
          if (mode === "cover") {
            openIssue();
            return;
          }
          returnToContents();
        }}
        aria-label="Contents"
      >
        ?
      </button>

      <div className="magazine-stage relative h-[min(92dvh,100%)] w-[min(96vw,calc(92dvh*1.45))]">
        {mode === "open" ? (
          <div className="absolute inset-0 z-0">
            <Spread spreadIndex={spreadIndex} onNavigate={goToSpread} />

            {isFlipping ? (
              <div className="pointer-events-none absolute inset-0 z-20">
                <FlipLeaf
                  underIndex={flipUnder}
                  overIndex={flipOver}
                  progress={flipProgress}
                  direction={flipDirection}
                />
              </div>
            ) : null}

            {!isFlipping ? (
              <>
                <button
                  type="button"
                  aria-label="Previous spread"
                  className="absolute top-0 left-0 z-30 h-full w-[12%] cursor-w-resize bg-transparent"
                  onClick={() => {
                    if (spreadIndex === 0) {
                      setMode("cover");
                      return;
                    }
                    goToSpread(spreadIndex - 1);
                  }}
                />
                <button
                  type="button"
                  aria-label="Next spread"
                  className="absolute top-0 right-0 z-30 h-full w-[12%] cursor-e-resize bg-transparent"
                  onClick={() => goToSpread(spreadIndex + 1)}
                />
              </>
            ) : null}
          </div>
        ) : (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <div
              className="relative h-full bg-[var(--paper)]"
              style={{
                aspectRatio: "3 / 4",
                maxWidth: "100%",
                boxShadow: "var(--sheet-shadow)",
              }}
            >
              <Cover onOpen={openIssue} />
            </div>
          </div>
        )}
      </div>

      <div className="sr-only" aria-live="polite">
        {liveMessage}
      </div>
    </div>
  );
}
