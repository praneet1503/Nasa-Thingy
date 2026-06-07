# Nasapedia Visual Redesign — Design Spec

**Date:** 2026-06-07
**Status:** Approved
**Scope:** Pure visual redesign of the existing Nasapedia frontend (Next.js 16 + Tailwind). No backend, data-source, or feature changes.

## Goal

Replace the current dark "command center" aesthetic (muddy brown void `#0a0804` + gold `#f2c40d`) with a bright, playful, **illustrated** identity drawn directly from the Nasapedia logo: a friendly cartoon planet reading a book, navy + cornflower lettering, pastel space doodles on a cream canvas.

The redesign must feel **hand-crafted and personal — not generic "AI slop."** The differentiator is illustration: a planet mascot, hand-drawn doodles, and wobbly hand-lettering that a template cannot fake.

## Design Direction (validated visually)

**Direction A — Bright & Playful**, with a deliberate "personality kit" layered on top. Validated via browser mockups during brainstorming. Cream canvas, rounded sticker cards, pastel category colors.

## Identity System

### Palette (from the logo)
| Token | Hex | Use |
|---|---|---|
| Cream | `#FBF6EC` | page canvas |
| Cream raised | `#FDF9F0` | nav, raised surfaces |
| Navy | `#1b2a6b` | primary text, headings, primary button |
| Navy deep | `#11194a` | button shadow lip, deepest text |
| Cornflower | `#5B8DEF` | primary accent, links, active states |
| Planet blue | `#4A90D9` | mascot, secondary accent |
| Gold ring | `#FFC23C` | highlight, underlines, alt button, active marker |
| Pink | `#F58BB0` | category accent |
| Purple | `#9B7BD6` | category accent |
| Border warm | `#ece3cf` | card/nav borders on cream |
| Muted text | `#5a6488` / `#8a93b0` | body secondary / meta |

Category badge colors (soft bg + saturated text): blue, pink, gold, purple — assigned per project/mission category.

### Type
- **Fredoka** (500–700): headings, buttons, brand mark.
- **Nunito** (400–800): body, descriptions, tables, UI.
- **Caveat** (600–700): handwritten asides, doodle labels, kickers ("hey space explorer!").

Loaded via `next/font/google` in the root layout for performance (no render-blocking `<link>`).

### Personality devices
- **Nova** — the planet mascot from the logo (blue planet, gold ring, eyes/cheeks/smile, reading the N-book). Appears at *key spots only*: homepage hero, empty states, loading states, 404, footer corner. Not on every card.
- **Doodle kit** — reusable SVG components: stars (4-point + sparkle), dotted orbit/flight paths, scribbled circle highlights, hand-drawn underline, shooting star, small planets. Used as page-frame decoration.
- **Chunky 3D buttons** — solid fill + offset `box-shadow` "lip," press-down on `:active`.
- **Paper grain** — faint radial-dot texture overlay on cream surfaces.
- **Sticker tilt** — cards/labels rotated 1–2° for a hand-placed feel (subtle, accessibility-safe; disabled under `prefers-reduced-motion` for any animated tilt).

### Accessibility & restraint rules
- Doodles are decorative (`aria-hidden`), never overlap interactive or data content.
- Maintain WCAG AA contrast: navy/cornflower on cream all pass; verify pastel badge text.
- Respect `prefers-reduced-motion` for any float/bob animation on the mascot/doodles.

## Architecture

Existing structure stays. Work is concentrated in the design-system layer plus per-page restyling.

### 1. Design-system foundation (built first)
- **`tailwind.config.ts`** — replace `space`/`accent` palettes with the logo tokens above; add fonts, shadows (button lip, soft card), border-radius scale.
- **`app/globals.css`** — rewrite. Remove brown/gold vars, starfield-on-black, gold glows. Add: cream background w/ subtle radial color washes + paper grain, new CSS variables, base typography, selection color, scrollbar, leaflet import retained.
- **`next/font`** wiring for Fredoka / Nunito / Caveat in `layout.tsx`.

### 2. Shared components (`components/`)
| Component | Purpose |
|---|---|
| `Mascot.tsx` | Nova, size + expression props (reading / waving / sleeping for empty states) |
| `Doodle.tsx` | SVG doodle kit (named variants: `star`, `orbit`, `underline`, `shooting-star`, `planet`, `sparkle`) |
| `Button.tsx` | chunky 3D button (variants: primary navy, alt gold, ghost) |
| `Card.tsx` | sticker card shell (optional tilt, hover lift) |
| `Chip.tsx` | filter/category chip (active = cornflower or gold) |
| `SectionHeading.tsx` | Fredoka heading + optional Caveat kicker + doodle |
| `TopNav.tsx` | **redesigned**: cream bar, logo mark + Nasapedia wordmark, friendly nav links, active = gold underline. Remove red mission-clock + "COMMAND CENTER" military framing. |
| `Footer.tsx` | cream footer w/ small Nova + handwritten credit |
| `LoadingState.tsx` | **redesigned**: Nova + handwritten "loading the cosmos…" |
| `SearchBar.tsx`, `Filters.tsx`, `Pagination.tsx` | restyled to system |

`StarField.tsx`: repurpose to a light daytime-sky doodle field (faint pastel stars/sparkles on cream) or retire in favor of static CSS washes — decided in plan.

### 3. Page restyling
| Page / route | Treatment |
|---|---|
| `/projects` (ProjectsExplorer) | Hero w/ Nova + Caveat kicker + scribbled underline, doodle search bar, pastel category chips, sticker project cards in grid |
| `/project/[id]` | Friendly mission profile: navy headings, doodle dividers, clean fact tables, category badge |
| `/feed` | Card stream w/ playful section headers |
| `/space-news`, `/space-blogs` | Warm editorial cards (NewsCard/NewsGrid/SectionHeader), Nunito body, readable line length |
| `/global-launch-intelligence/dashboard` + 7 sub-pages | **Playful chrome, clean data** (see rule below) |
| `/aurora-tracker`, `/iss-tracker` | Cream chrome + control panels; maps and markers legible, logo-colored |

### Data-page rule ("playful chrome, clean data")
For the Command Center dashboards and the tracker maps:
- **Frame is playful:** cream nav, section headings w/ small doodles, a Nova in an empty corner, branded panel chrome, mascot-based loading/empty/error states.
- **Data surfaces stay clean:** charts, tables, and maps use high-contrast logo colors on clean backgrounds, generous spacing, legible Nunito. **No doodles, grain, or tilt over data.** Readability wins inside the data; personality lives in the chrome around it.
- Chart/series colors drawn from the palette (cornflower, planet-blue, gold, pink, purple) with adequate contrast and a consistent legend.

## Data Flow
Unchanged. All pages keep their existing data fetching, hooks (`hooks/`), lib (`lib/`), and providers. This is presentation-only.

## Error / Empty / Loading States
Standardized through `LoadingState` and new empty/error treatments featuring Nova + a handwritten line. Every list page (projects, feed, news, blogs) and data page gets a friendly empty + error state instead of bare text.

## Testing / Verification
No unit-test suite exists for the frontend; verification is visual + build integrity:
1. `next build` passes with zero type errors and zero new warnings.
2. Manual visual pass on every redesigned route (dev server) — desktop + mobile widths.
3. Contrast spot-check on text/badge combos (AA).
4. `prefers-reduced-motion` disables mascot/doodle motion.
5. No console errors; leaflet maps still render.

## Out of Scope
- Backend, APIs, data ingestion, migrations.
- New features or new pages.
- Content/copy rewrites beyond microcopy needed for new UI states (kickers, empty-state lines).
- Auth, performance refactors unrelated to the redesign.
