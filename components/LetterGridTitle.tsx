"use client";

type LetterGridTitleProps = {
  /** Letters laid out row by row; null = empty cell */
  rows: (string | null)[][];
  label?: string;
  className?: string;
};

/**
 * Text-in-squares title — masthead purple cells, black caps.
 * Matches the grid-letter editorial reference.
 */
export default function LetterGridTitle({
  rows,
  label,
  className = "",
}: LetterGridTitleProps) {
  const cols = Math.max(...rows.map((row) => row.length));
  const aria =
    label ??
    rows
      .map((row) => row.filter(Boolean).join(""))
      .filter(Boolean)
      .join(" ");

  return (
    <div
      className={className}
      role="img"
      aria-label={aria}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        width: "min(88%, 16rem)",
        borderTop: "1px solid rgba(11, 11, 11, 0.35)",
        borderLeft: "1px solid rgba(11, 11, 11, 0.35)",
      }}
    >
      {rows.map((row, rowIndex) =>
        Array.from({ length: cols }, (_, colIndex) => {
          const letter = row[colIndex] ?? null;
          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              style={{
                aspectRatio: "1",
                borderRight: "1px solid rgba(11, 11, 11, 0.35)",
                borderBottom: "1px solid rgba(11, 11, 11, 0.35)",
                background: letter ? "var(--masthead)" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {letter ? (
                <span
                  className="utility"
                  style={{
                    color: "var(--ink)",
                    fontWeight: 600,
                    fontSize: "clamp(0.65rem, 2.2cqw, 0.95rem)",
                    letterSpacing: "0.04em",
                    lineHeight: 1,
                  }}
                >
                  {letter}
                </span>
              ) : null}
            </div>
          );
        }),
      )}
    </div>
  );
}

/** Staggered layout for GRAY / BOWL / ABOVE */
export const GRAY_BOWL_TITLE_ROWS: (string | null)[][] = [
  ["G", "R", "A", "Y", null, null],
  [null, "B", "O", "W", "L", null],
  ["A", "B", "O", "V", "E", null],
];
