type FolioProps = {
  page: number;
  className?: string;
};

/** Page number — utility face, tabular */
export default function Folio({ page, className }: FolioProps) {
  return (
    <span
      className={
        className ?? "utility tabular-nums text-[var(--ink)]"
      }
    >
      {page}
    </span>
  );
}
