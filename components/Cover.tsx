"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import coverPhoto from "@/public/images/cover.jpg";
import { issueMeta } from "@/content/works";
import { useReducedMotion } from "@/lib/useReducedMotion";

const ROLES = ["Photographer", "Writer", "Publisher"] as const;
export const COVER_EASE = [0.22, 1, 0.36, 1] as const;

const TYPE_MS = 70;
const HOLD_MS = 380;
const BETWEEN_MS = 260;
const START_DELAY_MS = 500;

type CoverProps = {
  onOpen?: () => void;
  turning?: boolean;
};

type TypedLine = {
  text: string;
  active: boolean;
};

function useRoleTypewriter(reducedMotion: boolean, paused: boolean): TypedLine[] {
  const [lines, setLines] = useState<TypedLine[]>(() =>
    ROLES.map((role) =>
      reducedMotion
        ? { text: role, active: false }
        : { text: "", active: false },
    ),
  );

  useEffect(() => {
    if (reducedMotion) {
      setLines(ROLES.map((role) => ({ text: role, active: false })));
      return;
    }

    if (paused) return;

    let cancelled = false;
    const timers: number[] = [];

    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timers.push(window.setTimeout(resolve, ms));
      });

    const run = async () => {
      setLines(ROLES.map(() => ({ text: "", active: false })));
      await wait(START_DELAY_MS);
      if (cancelled) return;

      for (let i = 0; i < ROLES.length; i++) {
        const role = ROLES[i];
        setLines((prev) =>
          prev.map((line, idx) =>
            idx === i ? { text: "", active: true } : { ...line, active: false },
          ),
        );

        for (let n = 1; n <= role.length; n++) {
          if (cancelled) return;
          const slice = role.slice(0, n);
          setLines((prev) =>
            prev.map((line, idx) =>
              idx === i ? { text: slice, active: true } : line,
            ),
          );
          await wait(TYPE_MS);
        }

        if (cancelled) return;
        setLines((prev) =>
          prev.map((line, idx) =>
            idx === i ? { ...line, active: false } : line,
          ),
        );
        await wait(HOLD_MS);
        if (i < ROLES.length - 1) await wait(BETWEEN_MS);
      }
    };

    void run();

    return () => {
      cancelled = true;
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [reducedMotion, paused]);

  return lines;
}

export default function Cover({ onOpen, turning = false }: CoverProps) {
  const reducedMotion = useReducedMotion();
  const [hovering, setHovering] = useState(false);
  const [focused, setFocused] = useState(false);
  const [peelLift, setPeelLift] = useState(0);
  const typedLines = useRoleTypewriter(reducedMotion, turning);

  useEffect(() => {
    if (reducedMotion) {
      setPeelLift(8);
      return;
    }
    const t1 = window.setTimeout(() => setPeelLift(10), 800);
    const t2 = window.setTimeout(() => setPeelLift(0), 1400);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [reducedMotion]);

  const lift = hovering || focused ? 22 : peelLift;

  const handleOpen = () => {
    if (!turning) onOpen?.();
  };

  return (
    <button
      type="button"
      aria-label="Open the issue"
      disabled={turning}
      className="relative h-full w-full cursor-pointer overflow-hidden bg-[var(--paper)] text-left disabled:cursor-default"
      style={{ containerType: "size" }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onClick={(event) => {
        event.preventDefault();
        handleOpen();
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleOpen();
        }
      }}
    >
      <div className="absolute inset-0">
        <Image
          src={coverPhoto}
          alt="Deniz Magdalena bent forward in a bridge pose against draped fabric, looking through the arch of her body"
          fill
          priority
          placeholder="blur"
          sizes="(max-width: 768px) 92vw, 50vw"
          className="object-cover object-center"
        />
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-[2.5%] z-20 px-[3%]">
        <div className="flex justify-center">
          <h1
            className="display text-center text-[var(--masthead)] uppercase"
            style={{
              fontSize: "clamp(2.05rem, 14.75cqw, 5rem)",
              fontWeight: 600,
              lineHeight: 1.2,
              whiteSpace: "nowrap",
              paddingTop: "0.08em",
              letterSpacing: "0.02em",
              paddingLeft: "0.02em",
            }}
          >
            Magdalena
          </h1>
        </div>
        <div
          className="absolute top-full right-[3%] mt-[0.35em] flex flex-col items-end gap-[0.15em] text-right"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--masthead)",
            fontSize: "clamp(0.7rem, 1.6cqw, 0.85rem)",
            fontWeight: 400,
            letterSpacing: "0.01em",
            lineHeight: 1.35,
          }}
        >
          <p className="m-0">{issueMeta.location}</p>
          <p className="m-0">
            <a
              href={`mailto:${issueMeta.email}`}
              className="pointer-events-auto underline-offset-4 [text-decoration-thickness:1px] hover:underline"
              style={{ textDecorationColor: "var(--masthead)" }}
              onClick={(event) => event.stopPropagation()}
            >
              {issueMeta.email}
            </a>
          </p>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 z-20 flex flex-col items-center gap-[0.4em]"
        style={{ top: "54%" }}
        aria-live="polite"
      >
        {typedLines.map((line, index) => (
          <p
            key={ROLES[index]}
            className="display min-h-[1.15em] text-[clamp(1.25rem,3.2vw,2rem)] text-[var(--paper)]"
            style={{ letterSpacing: "0.04em" }}
          >
            {line.text}
            {line.active ? (
              <span
                className="ml-[0.05em] inline-block w-[0.08em] animate-pulse bg-[var(--paper)] align-baseline"
                style={{ height: "0.9em" }}
                aria-hidden
              />
            ) : null}
          </p>
        ))}
      </div>

      <div
        className="pointer-events-none absolute right-0 bottom-0 z-40 origin-bottom-right"
        aria-hidden
        style={{
          width: 18 + lift * 0.28,
          height: 18 + lift * 0.28,
          transition: reducedMotion
            ? "none"
            : "width 0.32s cubic-bezier(0.22, 1, 0.36, 1), height 0.32s cubic-bezier(0.22, 1, 0.36, 1)",
          background: `linear-gradient(
            to bottom right,
            var(--peel-face-deep) 0%,
            var(--peel-face) 44%,
            var(--rule) 49%,
            transparent 50%
          )`,
          boxShadow:
            lift > 0
              ? `-2px -3px ${5 + lift * 0.2}px rgba(11, 11, 11, 0.28)`
              : "-1px -1px 3px rgba(11, 11, 11, 0.18)",
        }}
      />
    </button>
  );
}
