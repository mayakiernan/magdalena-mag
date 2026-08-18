import { works, type Work } from "@/content/works";

export type TocEntry = {
  id: string;
  title: string;
  /** Printed folio; ignored when folioLabel is set */
  folio: number | null;
  /** Override shown in the number column, e.g. "xx" */
  folioLabel?: string;
  /** null = not an internal spread jump */
  spreadIndex: number | null;
  built: boolean;
  /** Temporary spacing row — not clickable */
  placeholder?: boolean;
  /** External publication — opens in a new tab */
  href?: string;
  /** Secondary line under the title (publications) */
  subtext?: string;
};

export type TocSection = {
  id: string;
  title: string;
  entries: TocEntry[];
};

function folioOf(id: string): number | null {
  return works.find((w) => w.id === id)?.folio ?? null;
}

function spreadOf(id: string): number | null {
  return works.find((w) => w.id === id)?.spreadIndex ?? null;
}

/**
 * Contents spread model — left: Photography / Ecopoetry / Publications;
 * right: Current Musings. Folios stay in sync with works.ts for built pieces.
 */
export const tocSections: TocSection[] = [
  {
    id: "photography",
    title: "Photography",
    entries: [
      {
        id: "nell",
        title: "Nell",
        folio: folioOf("nell"),
        spreadIndex: spreadOf("nell"),
        built: true,
      },
      {
        id: "photo-lorem-1",
        title: "Lorem ipsum dolor sit amet",
        folio: null,
        folioLabel: "xx",
        spreadIndex: null,
        built: false,
        placeholder: true,
      },
      {
        id: "photo-lorem-2",
        title: "Consectetur adipiscing elit",
        folio: null,
        folioLabel: "xx",
        spreadIndex: null,
        built: false,
        placeholder: true,
      },
      {
        id: "photo-lorem-3",
        title: "Sed do eiusmod tempor",
        folio: null,
        folioLabel: "xx",
        spreadIndex: null,
        built: false,
        placeholder: true,
      },
      {
        id: "photo-lorem-4",
        title: "Incididunt ut labore et dolore",
        folio: null,
        folioLabel: "xx",
        spreadIndex: null,
        built: false,
        placeholder: true,
      },
      {
        id: "photo-lorem-5",
        title: "Magna aliqua ut enim",
        folio: null,
        folioLabel: "xx",
        spreadIndex: null,
        built: false,
        placeholder: true,
      },
    ],
  },
  {
    id: "ecopoetry",
    title: "Ecopoetry",
    entries: [
      {
        id: "gray-bowl-above",
        title: "Gray Bowl Above",
        folio: folioOf("gray-bowl-above"),
        spreadIndex: spreadOf("gray-bowl-above"),
        built: true,
      },
      {
        id: "river-body",
        title: "River Body",
        folio: folioOf("river-body"),
        spreadIndex: spreadOf("river-body"),
        built: true,
      },
      {
        id: "sea-barrel",
        title: "Sea Barrel",
        folio: folioOf("sea-barrel"),
        spreadIndex: spreadOf("sea-barrel"),
        built: true,
      },
      {
        id: "world-forever",
        title: "World Forever",
        folio: folioOf("world-forever"),
        spreadIndex: spreadOf("world-forever"),
        built: true,
      },
      {
        id: "march-spell-for-looking",
        title: "March Spell for Looking",
        folio: folioOf("march-spell-for-looking"),
        spreadIndex: spreadOf("march-spell-for-looking"),
        built: true,
      },
      {
        id: "that-lift-inside",
        title: "That Lift Inside",
        folio: folioOf("that-lift-inside"),
        spreadIndex: spreadOf("that-lift-inside"),
        built: true,
      },
    ],
  },
  {
    id: "publications",
    title: "Publications",
    entries: [
      {
        id: "give-us-this-day",
        title: "Give Us This Day Our Daily Bread",
        folio: null,
        spreadIndex: null,
        built: true,
        subtext: "Ripples in Space, Fall 2019 selection",
        href: "https://ripplesinspace.com/wp-content/uploads/2020/02/give-us-this-day-our-daily-bread.pdf",
      },
      {
        id: "rot",
        title: "Rot",
        folio: null,
        spreadIndex: null,
        built: true,
        subtext: "Wilbur & Niso Smith Foundation — shortlisted, Author of Tomorrow",
        href: "https://www.wilbur-niso-smithfoundation.org/index.php/authors/magdalena-deniz",
      },
      {
        id: "type-of-bite",
        title: "The Type of Bite that Stings",
        folio: null,
        spreadIndex: null,
        built: true,
        subtext: "LSSU Border Crossing Magazine, 8th issue, 2018",
        href: "https://www.lssu.edu/lssu-creative-writing-program-announces-winner-of-2018-high-school-short-story-prize/",
      },
    ],
  },
  {
    id: "current-musings",
    title: "Current Musings",
    entries: [],
  },
];

export function formatFolio(n: number | null): string {
  if (n == null) return "";
  return String(n).padStart(2, "0");
}

export function entryFolioLabel(entry: TocEntry): string {
  if (entry.folioLabel) return entry.folioLabel;
  return formatFolio(entry.folio);
}

export function getWorkTitleForSpread(spreadIndex: number): string | null {
  if (spreadIndex === 0) return "Contents";
  const fromWorks = works.find(
    (w) =>
      w.spreadIndex === spreadIndex ||
      w.poemLayouts?.some((layout) => layout.spreadIndex === spreadIndex),
  );
  if (fromWorks) return fromWorks.title;
  for (const section of tocSections) {
    const entry = section.entries.find((e) => e.spreadIndex === spreadIndex);
    if (entry?.title) return entry.title;
  }
  return null;
}

export function getMaxSpreadIndex(): number {
  let max = 2;
  for (const work of works) {
    max = Math.max(max, work.spreadIndex);
    for (const layout of work.poemLayouts ?? []) {
      max = Math.max(max, layout.spreadIndex);
    }
  }
  for (const section of tocSections) {
    for (const entry of section.entries) {
      if (entry.spreadIndex != null) {
        max = Math.max(max, entry.spreadIndex);
      }
    }
  }
  return max;
}

export type { Work };
