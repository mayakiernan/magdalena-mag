export type WorkKind = "photography" | "writing" | "publishing";

export type WorkImage = {
  src: string;
  alt: string;
  caption?: string;
  /** Intended drop-in dimensions, shown on placeholders */
  dimensions?: string;
  aspectRatio?: string;
};

/** One page of verse within a multi-page poem piece */
export type PoemPageContent = {
  heading?: string;
  attribution?: string;
  text: string;
};

/** Physical spread belonging to a poem work (title plate and/or verse pages) */
export type PoemSpreadLayout = {
  spreadIndex: number;
  folio: number;
  /** Title plate (work title) or a poem page on the left leaf */
  left: "title" | PoemPageContent;
  right: PoemPageContent;
};

export type Work = {
  id: string;
  title: string;
  kind: WorkKind;
  year: string;
  /** Printed date line, e.g. "Spring 2023" */
  dateLabel?: string;
  /** Index ordinal shown as "01. Title" */
  indexNumber: string;
  folio: number;
  spreadIndex: number;
  dek?: string;
  images: WorkImage[];
  body?: string[];
  /** Exact line-broken poem; rendered with whitespace preserved */
  poem?: string;
  /**
   * Multi-spread poem layouts. When present, each entry is its own
   * physical spread; `spreadIndex` / `folio` on the work point at the first.
   */
  poemLayouts?: PoemSpreadLayout[];
  pullQuote?: string;
  pullQuoteAttribution?: string;
  credits?: {
    words?: string;
    photography?: string;
    styling?: string;
  };
};

/** Left page of the index spread */
export const coverSpreadImage: WorkImage = {
  src: "/images/cover.jpg",
  alt: "Deniz Magdalena in a bridge pose, looking through the arch of her body at the camera",
  dimensions: "813 × 1024",
  aspectRatio: "3 / 4",
};

/**
 * Issue 01 contents. Folio numbers are the printed page markers
 * referenced by the index — keep them in sync with Spread folios.
 */
export const works: Work[] = [
  {
    id: "nell",
    title: "Nell",
    kind: "photography",
    year: "2023",
    dateLabel: "Spring 2023",
    indexNumber: "01",
    folio: 4,
    spreadIndex: 1,
    dek: "Velvet, gravel, and golden-hour roadside",
    images: [
      {
        src: "/images/nell/nell-01.jpg",
        alt: "Nell in a turquoise velvet bodysuit, face obscured by windblown hair, under a weathered canopy",
        dimensions: "637 × 1024",
        aspectRatio: "5 / 8",
      },
      {
        src: "/images/nell/nell-02.jpg",
        alt: "Nell in a leopard faux-fur coat and teal velvet bodysuit against a white building with a red fascia",
        dimensions: "676 × 1024",
        aspectRatio: "2 / 3",
      },
    ],
  },
  {
    id: "gray-bowl-above",
    title: "Gray Bowl Above",
    kind: "writing",
    year: "2020",
    dateLabel: "Summer 2020",
    indexNumber: "02",
    folio: 6,
    spreadIndex: 2,
    dek: "A poem of return — moon, wire, and the gray bowl of sky",
    images: [
      {
        src: "/images/gray-bowl/ashtray.jpg",
        alt: "Top-down view of a metal ashtray packed with cigarette butts on a concrete sidewalk beside asphalt",
        dimensions: "1024 × 771",
        aspectRatio: "4 / 3",
      },
    ],
    poem: `Last night the world unhinged before me. I hadn’t been sleeping
& so I turned to what always looks—
the moon, its plump, pink eye— & the sky, a gray bowl above.
I felt its vastness,
saw with my own eyes what I’d before been blind to;
every star holding a brighter light, & the invisible wire
cupping the shapes in-between

Today I write the poem of loving myself:
Let my hair down
Bike down a different road
Stop worrying about a relapse
Lay in the water & let myself be held

I used to run wildly through the bushes,
hop the short fences bordering backyards.
It was all a game of tag, everything
	a running trial, the world blue all over
in my wide-open eyes. 

	& I witnessed the world
as it offered itself to me, pinned ladybugs
to the closed garage, thin legs plucking the netting
of every window screen, round bodies squirming against the mesh,
& that feeling inside blooming 
whenever the waves pulled me under.
Then it shut—
	I don’t remember when—
& I’ve been mourning myself ever since.

In this pause, I am trying
	to hold my hands out to the sky, to the world, palms up.

                                   I am here, I am.
Waiting
for the return.`,
  },

  {
    id: "sea-barrel",
    title: "Sea Barrel",
    kind: "writing",
    year: "2021",
    dateLabel: "Fall 20XX",
    indexNumber: "03",
    folio: 8,
    spreadIndex: 3,
    dek: "Ecopoetry",
    images: [],
    poem: `	Roll over on
your back and stare at the sky.

Clouds roll and sink. Seagulls

gasp at the wind. The last time you were here the ocean waved 
behind your back, licked your toes and then devoured you.

In that moment you were nothing 

more than a sea barrel. Some hunk
of collected driftwood the waves sewed together. 

There was a shock of calm. You remember that.

It should be scarier than this, you thought.
But it wasn't. It was just another

space that contained you.`,
  },
  {
    id: "living-body",
    title: "Living Body",
    kind: "photography",
    year: "20XX",
    dateLabel: "Fall 20XX",
    indexNumber: "04",
    folio: 10,
    spreadIndex: 4,
    dek: "Photography",
    images: [
      {
        src: "/images/living-body/stairs.jpg",
        alt: "Looking up a narrow wooden staircase with ivy-stenciled risers; dark hair visible at the top landing",
        dimensions: "735 × 1024",
        aspectRatio: "735 / 1024",
      },
      {
        src: "/images/living-body/mirror-02.jpg",
        alt: "Oval cheval mirror before a window with blinds, reflecting a camera on a tripod",
        dimensions: "686 × 1024",
        aspectRatio: "686 / 1024",
      },
      {
        src: "/images/living-body/motion.jpg",
        alt: "Long-exposure figure arching over a dark armchair in a dim room, motion blurred to a ghostly white",
        dimensions: "690 × 1024",
        aspectRatio: "690 / 1024",
      },
    ],
  },
  {
    id: "world-forever",
    title: "World Forever",
    kind: "writing",
    year: "2022",
    dateLabel: "Spring 20XX",
    indexNumber: "05",
    folio: 12,
    spreadIndex: 5,
    dek: "Ecopoetry",
    images: [],
    poemLayouts: [
      {
        spreadIndex: 5,
        folio: 12,
        left: "title",
        right: {
          text: `Little things catch my eye:
	white-crusted water stains on the mirror,
the glint of sudden light cupped in the depth
of a dented silver spoon, 
& the snag of my mother’s old gold
bracelet, with its twisted chain, sagging around my wrist.

	Everywhere there is lack

of space. 
& of time. 
Am I rushing?
Can I slow down?

The earth today lives on
without us. Every day a reminder:
we are not missed. We are not needed.
The water clears.
The whales begin to sing. 
Dead pigeons on the floor
	begin to breathe again;
World forever.

	To see this healing.
	To witness regrowth--

What a privilege it is right now
	to live.`,
        },
      },
      {
        spreadIndex: 6,
        folio: 14,
        left: {
          heading: "Reimagining The Great Meadow",
          attribution: "MKD",
          text: `Inside, I see the outside
world healing
	& remember 
that time in my life when I knew only the green,
	dandelion weeds growing stubborn
in the deer-eaten garden.
		My old friend Mia
knotted the flower stems into bracelets
That would dry in my cupboard desk.
	Lying beneath a sheltering sun,
I remember reading about California wildflowers,
 & how they don’t grow anymore,
centuries of development transforming
near-painted valleys into plains of thick, golden death,
	& so I reimagine the ocean
as a wildflower meadow,
	growing blue lupines & pink owl’s clover,
baby blue-eyes & yellow fiddlenecks, scarlet paintbrushes
& spiky weeding in between endless poppies, orange against
green against red against blue, more than one million dots
of stems and petals, unfolding across many miles,
	& the light becoming,
the Earth opening.`,
        },
        right: {
          heading: "Ohio River, 1870",
          attribution: "MKD",
          text: `A winged mass-- 2 billion feathered bodies 
migrating south. A cloud quilts the sky, covering
a waxing moon, dark in the night,
dark in the day. 
2 billion hearts humming
in the air. 
4 billion eyes watching 
from above.
What did they see?
& how did that feel?
	To fly up there,
surrounded by one’s own kind,
everything terrible waiting
below.
I imagine them carrying me
	my body lifted atop a winged blanket,
their softness folding between
my outstretched hands.
	Carried on light

wings, beaks unknotting
my tangled hair. Endless sky.
Nothing to fear.`,
        },
      },
    ],
  },
  {
    id: "river-body",
    title: "River Body",
    kind: "writing",
    year: "2021",
    dateLabel: "Spring 20XX",
    indexNumber: "06",
    folio: 16,
    spreadIndex: 7,
    dek: "Ecopoetry",
    images: [
      {
        src: "/images/river-body/april-mill.jpg",
        alt: "Woman in a light dress standing on river driftwood, holding a white cloth open against bare winter trees",
        dimensions: "678 × 1024",
        aspectRatio: "2 / 3",
      },
    ],
    poem: `I’m gripped, sometimes, by sudden grief 
for everything I’ll never know.

A baby-bird feeling overtakes me,
feeble-hearted feathery mess crooked
in its nesting against the roof flashing.
	Even my words curl away from me,
	& I’m left aching.

As an antidote, I become a river,

a body channeling
into some bigger body—
until all of myself is a rushing
vessel.
 No constraint. 
I hold myself only.

As the river, I reflect everything
& hold everything I reflect,
	unfaltering.

& I am enthralled
by everything 
I am,

my tangerine-pulp water—
my moving fish—
every existence a flashing caught
in my own wet grip.`,
  },
  {
    id: "march-spell-for-looking",
    title: "March Spell for Looking",
    kind: "writing",
    year: "2022",
    dateLabel: "Fall 20XX",
    indexNumber: "07",
    folio: 18,
    spreadIndex: 8,
    dek: "Ecopoetry",
    images: [],
    poem: `	I’ve been thinking about looking—
what it means to pick something up with a gaze & hold it

for hours. The wires hovered above the road. From my window: long black worms,
suspended above. I drove back home alone.

Two nights ago in my car, I saw you
	watching me & that light
unfolded around my chest again, everything hidden beneath a sheathed glow. 

Is it always like this? I’ve been so uncomfortable
looking—or maybe it’s being seen
that shocks me.
	That’s what you did the entire drive—
watched me—
& listened to what I wished would happen
to my body under the moon,
every spell I tried to write
failing under sinking light.

I want to remember: what it felt like to be 

looked at; how the night seemed to curve inwards
	around us when you pulled me in, the trees folding;
your porch stairs sinking further into the clay mud;
the birds finally returning with the dew. It was early & late—the world
was yawning. How wonderful it felt
to realize you saw it, too.`,
  },
  {
    id: "that-lift-inside",
    title: "That Lift Inside",
    kind: "writing",
    year: "2023",
    dateLabel: "Spring 20XX",
    indexNumber: "08",
    folio: 20,
    spreadIndex: 9,
    dek: "Ecopoetry",
    images: [],
    poem: `I’ve found in my fear 
of losing myself
no antidote.

Today the clock lugged time around
& each hour held the same milk gray
light. My fingers were still crusted bloody.
My room smelled charred & weedy.

I had a dream—
the earth was yellow & the dirt sang
underneath my toes. I walked the whole world wobbly. 
       & things hovered 
         when I looked at them,
but only just, & when I closed my eyes, I felt it, 
that lift inside.

So I woke with an aching, a recognized loss
unexplainable. Outside, an empty world
nesting. Inside, a worm unfurling, digging further.
Hollow.`,
  },
];

export const issueMeta = {
  number: "01",
  featureTitle: "Nell",
  featureLabel: "01. Nell",
  location: "Brooklyn, NY",
  email: "deniz.magdalena@gmail.com",
} as const;

function allSpreadIndexes(work: Work): number[] {
  if (work.poemLayouts?.length) {
    return work.poemLayouts.map((layout) => layout.spreadIndex);
  }
  return [work.spreadIndex];
}

/** Index is spread 0; works begin at spreadIndex 1+ */
export const TOTAL_SPREADS =
  1 + Math.max(...works.flatMap((w) => allSpreadIndexes(w)));

export function getWorkById(id: string): Work | undefined {
  return works.find((work) => work.id === id);
}

export function getWorkBySpreadIndex(spreadIndex: number): Work | undefined {
  return works.find((work) => allSpreadIndexes(work).includes(spreadIndex));
}

export function getPoemLayoutForSpread(
  work: Work,
  spreadIndex: number,
): PoemSpreadLayout | undefined {
  return work.poemLayouts?.find((layout) => layout.spreadIndex === spreadIndex);
}

export function workLabel(work: Work): string {
  return `${work.indexNumber}. ${work.title}`;
}
