"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Cover from "@/components/Cover";
import FlipLeaf from "@/components/FlipLeaf";
import Spread from "@/components/Spread";
import { getMaxSpreadIndex } from "@/content/toc";
import { getWorkBySpreadIndex, workLabel } from "@/content/works";
import { useReducedMotion } from "@/lib/useReducedMotion";

type Mode = "cover" | "open";

const COVER_TURN_MS = 900;
const FLIP_TOTAL_MS = 1100;
const FLIP_MIN_STEP_MS = 70;
const FLIP_MAX_STEP_MS = 320;
const MAX_SPREAD = getMaxSpreadIndex();

/** Closed cover sits on the right half; shift stage left so that half reads centered. */
const COVER_STAGE_SHIFT = -25;

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

  /** 1 = opening, -1 = closing */
  const [coverDir, setCoverDir] = useState<1 | -1>(1);
  const [coverTurning, setCoverTurning] = useState(false);
  const [coverProgress, setCoverProgress] = useState(0);

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
    if (coverTurning || isFlipping || mode === "open") return;

    if (reducedMotion) {
      setMode("open");
      setSpreadIndex(0);
      return;
    }

    setCoverDir(1);
    setCoverProgress(0);
    setSpreadIndex(0);
    setCoverTurning(true);
  }, [coverTurning, isFlipping, mode, reducedMotion]);

  const closeToCover = useCallback(() => {
    if (coverTurning || isFlipping || mode !== "open") return;
    if (spreadIndexRef.current !== 0) return;

    if (reducedMotion) {
      setMode("cover");
      return;
    }

    setCoverDir(-1);
    setCoverProgress(0);
    setCoverTurning(true);
  }, [coverTurning, isFlipping, mode, reducedMotion]);

  useEffect(() => {
    if (!coverTurning) return;

    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / COVER_TURN_MS);
      setCoverProgress(easeOutCubic(t));
      if (t < 1) {
        raf = window.requestAnimationFrame(tick);
      } else {
        if (coverDir === 1) {
          setMode("open");
          setSpreadIndex(0);
        } else {
          setMode("cover");
        }
        setCoverTurning(false);
        setCoverProgress(0);
      }
    };

    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [coverTurning, coverDir]);

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
      if (mode !== "open" || coverTurning) return;
      if (next < 0 || next > MAX_SPREAD) return;

      const from = isFlipping
        ? flipProgress < 0.5
          ? stepFromRef.current
          : spreadIndexRef.current
        : spreadIndexRef.current;

      if (next === from && !isFlipping) return;

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
    [
      mode,
      coverTurning,
      reducedMotion,
      isFlipping,
      flipProgress,
      runFlipSequence,
    ],
  );

  const returnToContents = useCallback(() => {
    if (mode !== "open" || coverTurning) return;
    goToSpread(0);
  }, [mode, coverTurning, goToSpread]);

  useEffect(() => {
    if (mode !== "cover" || coverTurning) return;

    const onWheel = (event: WheelEvent) => {
      if (event.deltaY > 24) {
        event.preventDefault();
        openIssue();
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [mode, coverTurning, openIssue]);

  useEffect(() => {
    if (mode !== "open" || coverTurning) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goToSpread(spreadIndexRef.current + 1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        if (spreadIndexRef.current === 0 && !isFlipping) {
          closeToCover();
          return;
        }
        goToSpread(spreadIndexRef.current - 1);
      } else if (event.key === "Home") {
        event.preventDefault();
        goToSpread(0);
      } else if (event.key === "Escape") {
        event.preventDefault();
        if (spreadIndexRef.current === 0 && !isFlipping) {
          closeToCover();
        } else {
          goToSpread(0);
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, coverTurning, isFlipping, goToSpread, closeToCover]);

  // Opening: 0→1 clears the -25% shift and turns the cover.
  // Closing: 0→1 restores the shift and closes the cover.
  const openAmount =
    coverTurning
      ? coverDir === 1
        ? coverProgress
        : 1 - coverProgress
      : mode === "open"
        ? 1
        : 0;

  const stageShift = COVER_STAGE_SHIFT * (1 - openAmount);
  const coverRotateY = -180 * openAmount;
  const showCover = mode === "cover" || coverTurning;
  // Interior only when fully open — hide for the entire cover open/close turn
  // so neither direction peeks the left page under a half-turned cover.
  const showSpread = mode === "open" && !coverTurning;
  const busy = coverTurning || isFlipping;

  const activeWork = getWorkBySpreadIndex(spreadIndex);

  const liveMessage =
    mode === "cover"
      ? "Cover. Open the issue to begin."
      : coverTurning
        ? coverDir === 1
          ? "Opening the issue."
          : "Closing the issue."
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

      {/*
        Landscape stage at all times. Closed: translated so the right-half
        cover reads centered. Opening: only transform (and optional opacity).
      */}
      <div
        className="magazine-stage relative h-[min(92dvh,100%)] w-[min(96vw,calc(92dvh*1.45))]"
        style={{
          perspective: "2400px",
          perspectiveOrigin: "50% 50%",
          transformStyle: "preserve-3d",
          transform: `translateX(${stageShift}%)`,
          willChange: coverTurning ? "transform" : "auto",
          pointerEvents: coverTurning ? "none" : "auto",
        }}
      >
        {showSpread ? (
          <div
            className="absolute inset-0 z-0"
            style={{ transformStyle: "preserve-3d" }}
          >
            <Spread spreadIndex={spreadIndex} onNavigate={goToSpread} />

            {isFlipping ? (
              <div
                className="pointer-events-none absolute inset-0 z-20"
                style={{ transformStyle: "preserve-3d" }}
              >
                <FlipLeaf
                  underIndex={flipUnder}
                  overIndex={flipOver}
                  progress={flipProgress}
                  direction={flipDirection}
                />
              </div>
            ) : null}

            {!busy ? (
              <>
                <button
                  type="button"
                  aria-label="Previous spread"
                  className="absolute top-0 left-0 z-30 h-full w-[12%] cursor-w-resize bg-transparent"
                  onClick={() => {
                    if (spreadIndex === 0) {
                      closeToCover();
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
        ) : null}

        {showCover ? (
          <div
            className="absolute inset-y-0 right-0 z-10 w-1/2"
            style={{
              transformOrigin: "left center",
              transformStyle: "preserve-3d",
              transform: `rotateY(${coverRotateY}deg)`,
              willChange: coverTurning ? "transform" : "auto",
              boxShadow: openAmount < 1 ? "var(--sheet-shadow)" : undefined,
            }}
          >
            <div
              className="absolute inset-0 overflow-hidden bg-[var(--paper)]"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transformStyle: "preserve-3d",
              }}
            >
              <Cover onOpen={openIssue} turning={coverTurning} />
            </div>

            <div
              className="absolute inset-0 bg-[var(--paper)]"
              style={{
                transform: "rotateY(180deg)",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                boxShadow: "inset 12px 0 18px -14px var(--gutter-shade)",
              }}
              aria-hidden
            />
          </div>
        ) : null}
      </div>

      <div className="sr-only" aria-live="polite">
        {liveMessage}
      </div>
    </div>
  );
}
