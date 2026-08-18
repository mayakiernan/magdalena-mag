"use client";

import { useCallback, useEffect, useState } from "react";
import Cover from "@/components/Cover";
import Spread from "@/components/Spread";
import { getMaxSpreadIndex } from "@/content/toc";
import { getWorkBySpreadIndex, workLabel } from "@/content/works";
import { useReducedMotion } from "@/lib/useReducedMotion";

type Mode = "cover" | "open";

const TURN_MS = 700;
const MAX_SPREAD = getMaxSpreadIndex();

export default function Issue() {
  const reducedMotion = useReducedMotion();
  const [mode, setMode] = useState<Mode>("cover");
  const [turning, setTurning] = useState(false);
  const [spreadIndex, setSpreadIndex] = useState(0);
  const [turnProgress, setTurnProgress] = useState(0);

  const openIssue = useCallback(() => {
    if (turning || mode === "open") return;

    if (reducedMotion) {
      setMode("open");
      setSpreadIndex(0);
      return;
    }

    setTurning(true);
    setTurnProgress(0);
  }, [turning, mode, reducedMotion]);

  useEffect(() => {
    if (!turning) return;

    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / TURN_MS);
      const eased = 1 - (1 - t) ** 3;
      setTurnProgress(eased);
      if (t < 1) {
        raf = window.requestAnimationFrame(tick);
      } else {
        setMode("open");
        setSpreadIndex(0);
        setTurning(false);
        setTurnProgress(0);
      }
    };

    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [turning]);

  const goToSpread = useCallback(
    (next: number) => {
      if (mode !== "open" || turning) return;
      if (next < 0 || next > MAX_SPREAD) return;
      setSpreadIndex(next);
    },
    [mode, turning],
  );

  const returnToContents = useCallback(() => {
    if (mode !== "open" || turning) return;
    setSpreadIndex(0);
  }, [mode, turning]);

  useEffect(() => {
    if (mode !== "cover" || turning) return;

    const onWheel = (event: WheelEvent) => {
      if (event.deltaY > 24) {
        event.preventDefault();
        openIssue();
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [mode, turning, openIssue]);

  useEffect(() => {
    if (mode !== "open" || turning) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goToSpread(spreadIndex + 1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        if (spreadIndex === 0) {
          setMode("cover");
          return;
        }
        goToSpread(spreadIndex - 1);
      } else if (event.key === "Home") {
        event.preventDefault();
        goToSpread(0);
      } else if (event.key === "Escape") {
        event.preventDefault();
        if (spreadIndex === 0) {
          setMode("cover");
        } else {
          goToSpread(0);
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, turning, spreadIndex, goToSpread]);

  const showCover = mode === "cover" || turning;
  const showSpread = mode === "open" || turning;
  const rotateY = turning ? -180 * turnProgress : 0;

  const activeWork = getWorkBySpreadIndex(spreadIndex);

  const liveMessage =
    mode === "cover"
      ? "Cover. Open the issue to begin."
      : spreadIndex === 0
        ? "Contents."
        : activeWork
          ? `Page ${activeWork.folio}. ${workLabel(activeWork)}, ${activeWork.kind}, ${activeWork.year}.`
          : `Spread ${spreadIndex}.`;

  return (
    <div className="relative flex h-[100dvh] w-full items-center justify-center overflow-hidden bg-[var(--stage)] text-[var(--ink)]">
      <button
        type="button"
        className="utility absolute top-[10px] left-[10px] z-50 text-[var(--ink-soft)] transition-opacity hover:opacity-60"
        onClick={() => {
          if (mode === "cover") {
            openIssue();
            return;
          }
          returnToContents();
        }}
        aria-label="Contents"
      >
        Contents
      </button>

      <div
        className="magazine-stage relative h-[min(92dvh,100%)] w-[min(96vw,calc(92dvh*1.45))]"
        style={{ pointerEvents: turning ? "none" : "auto" }}
      >
        {showSpread ? (
          <div className="absolute inset-0 z-0">
            <Spread
              spreadIndex={turning ? 0 : spreadIndex}
              onNavigate={goToSpread}
            />
            {mode === "open" && !turning ? (
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
        ) : null}

        {showCover ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center [perspective:2400px]">
            <div
              className="relative h-full bg-[var(--paper)]"
              style={{
                aspectRatio: "3 / 4",
                maxWidth: "100%",
                transformOrigin: "left center",
                transformStyle: "preserve-3d",
                transform: `rotateY(${rotateY}deg)`,
                boxShadow: "var(--sheet-shadow)",
                willChange: turning ? "transform" : "auto",
              }}
            >
              <div
                className="absolute inset-0 bg-[var(--paper)]"
                style={{
                  transform: "rotateY(180deg)",
                  backfaceVisibility: "hidden",
                  pointerEvents: "none",
                }}
                aria-hidden
              />
              <div
                className="absolute inset-0"
                style={{
                  backfaceVisibility: "hidden",
                  pointerEvents: turning ? "none" : "auto",
                }}
              >
                <Cover onOpen={openIssue} turning={turning} />
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="sr-only" aria-live="polite">
        {liveMessage}
      </div>
    </div>
  );
}
