# Nasapedia Visual Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Nasapedia's dark "command center" UI with a bright, playful, illustrated identity drawn from the logo (cream canvas, navy + cornflower, gold rings, pastel accents, planet mascot + hand-drawn doodles), without touching backend/data/features.

**Architecture:** The codebase is CSS-class-driven — components reference named classes in `frontend/app/globals.css`. The theme flip is achieved primarily by rewriting those class bodies (keeping names) plus `tailwind.config.ts` tokens, so most pages restyle automatically. New illustrated React components (`Doodle`, `Mascot`, `Button`, `Chip`) are then created and injected at key spots (hero, nav, loading/empty states). Data-dense pages get "playful chrome, clean data": the page frame is playful, but charts/tables/maps stay clean and high-contrast.

**Tech Stack:** Next.js 16 (App Router), React, Tailwind CSS, `next/font/google` (Fredoka, Nunito, Caveat), Recharts (intel charts), Leaflet (maps).

**Verification model:** No frontend test framework exists. Each task verifies via (a) `npm run build` passing with zero type errors / new warnings, and (b) a visual check on the dev server (`npm run dev`, then the listed route at desktop ≥1280px and mobile 390px). Commit after each task.

**Working directory:** All paths are relative to `frontend/` unless noted. Run all `npm` commands from `frontend/`.

---

## File Structure

**Modified (foundation):**
- `tailwind.config.ts` — replace palette/shadows with logo tokens.
- `app/globals.css` — full rewrite of theme (all existing class names preserved, re-themed) + new doodle/mascot/button utility classes.
- `app/layout.tsx` — light mode, font wiring, new footer, swap `StarField` for `SkyBackdrop`.

**Created (components):**
- `components/brand/Doodle.tsx` — SVG doodle kit (star, sparkle, orbit, underline, shooting-star, planet).
- `components/brand/Mascot.tsx` — Nova the planet mascot (size + expression props).
- `components/brand/Button.tsx` — chunky 3D button.
- `components/brand/Chip.tsx` — filter/category chip.
- `components/brand/SkyBackdrop.tsx` — replaces `StarField`; faint daytime sky doodles on cream.
- `components/EmptyState.tsx` — Nova-based empty/error state.

**Modified (components):**
- `components/TopNav.tsx`, `components/LoadingState.tsx`, `components/ProjectCard.tsx`, `components/SearchBar.tsx`, `components/Filters.tsx`, `components/news/NewsCard.tsx`.

**Modified (pages — mostly auto-themed via CSS, with targeted injections):**
- `components/ProjectsExplorer.tsx`, `app/project/[id]/page.tsx`, `app/feed/page.tsx`, `app/space-news/page.tsx`, `app/space-blogs/page.tsx`, `app/global-launch-intelligence/layout.tsx` + `dashboard` + 7 sub-pages, `app/aurora-tracker/page.tsx`, `app/iss-tracker/page.tsx`.

---

## Phase A — Foundation

### Task A1: Install fonts + Tailwind token swap

**Files:**
- Modify: `tailwind.config.ts`

- [ ] **Step 1: Replace `tailwind.config.ts` entirely**

```ts
import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: { DEFAULT: '#FBF6EC', raised: '#FDF9F0', sunk: '#F3ECDC' },
        navy: { DEFAULT: '#1b2a6b', deep: '#11194a', soft: '#3a4a8c' },
        corn: { DEFAULT: '#5B8DEF', dim: '#3a6fd8' },
        planet: '#4A90D9',
        gold: { DEFAULT: '#FFC23C', deep: '#d99e20' },
        pinkp: '#F58BB0',
        purplep: '#9B7BD6',
        inkmute: '#5a6488',
        inkfaint: '#8a93b0',
      },
      fontFamily: {
        display: ['var(--font-fredoka)', 'system-ui', 'sans-serif'],
        body: ['var(--font-nunito)', 'system-ui', 'sans-serif'],
        hand: ['var(--font-caveat)', 'cursive'],
      },
      boxShadow: {
        'lip': '0 6px 0 #11194a',
        'lip-gold': '0 6px 0 #d99e20',
        'card': '0 8px 22px rgba(74,144,217,.10)',
        'card-hover': '0 16px 34px rgba(74,144,217,.16)',
      },
      borderRadius: { xl2: '1.3rem' },
    },
  },
  plugins: [],
} satisfies Config
```

- [ ] **Step 2: Verify build compiles the config**

Run: `npm run build`
Expected: Build completes (pages may still look dark — globals.css not yet updated). Zero TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add tailwind.config.ts
git commit -m "Swap Tailwind palette/fonts/shadows to Nasapedia logo tokens"
```

### Task A2: Wire fonts + light mode + footer in layout

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Replace `app/layout.tsx` entirely**

```tsx
import type { Metadata } from 'next'
import { Fredoka, Nunito, Caveat } from 'next/font/google'
import './globals.css'
import Providers from './providers'
import SkyBackdrop from '../components/brand/SkyBackdrop'
import TopNav from '../components/TopNav'
import Mascot from '../components/brand/Mascot'
import { Analytics } from '@vercel/analytics/react'

const fredoka = Fredoka({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-fredoka', display: 'swap' })
const nunito = Nunito({ subsets: ['latin'], weight: ['400', '600', '700', '800'], variable: '--font-nunito', display: 'swap' })
const caveat = Caveat({ subsets: ['latin'], weight: ['600', '700'], variable: '--font-caveat', display: 'swap' })

export const metadata: Metadata = {
  title: 'Nasapedia',
  description: 'Your friendly guide to everything space',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fredoka.variable} ${nunito.variable} ${caveat.variable}`}>
      <body className="min-h-screen bg-cream text-navy antialiased font-body">
        <SkyBackdrop />
        <TopNav />
        <Providers>
          <div className="relative z-10 pt-16 pb-14">{children}</div>
          <Analytics />
        </Providers>
        <footer className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center gap-2 py-2 px-4 bg-cream-raised/85 backdrop-blur-sm border-t border-[#ece3cf] text-xs text-inkmute">
          <Mascot size={22} expression="wave" aria-hidden />
          <span className="font-hand text-[15px] text-corn">made with love of space &amp; data</span>
          <span aria-hidden>·</span>
          <span>by praneet ·{' '}
            <a href="https://github.com/praneet1503/Nasapedia" className="font-bold text-corn-dim underline underline-offset-2 hover:text-navy transition-colors">open source</a>
          </span>
        </footer>
      </body>
    </html>
  )
}
```

> Note: `SkyBackdrop` and `Mascot` are created in Tasks B1/B2. Build will fail until those exist — that is expected; Step 2 below is deferred to after B2. Commit this file now anyway (the import resolution failure surfaces only at build).

- [ ] **Step 2: Commit (build verified later in B2)**

```bash
git add app/layout.tsx
git commit -m "Wire Fredoka/Nunito/Caveat fonts, light mode, friendly footer in layout"
```

### Task A3: Rewrite globals.css to the bright/playful theme

**Files:**
- Modify: `app/globals.css` (full replacement)

This is the core of the redesign. Every class name currently used by components is preserved and re-themed. `.starfield`/`.nebula` rules are dropped (component replaced in B5).

- [ ] **Step 1: Replace `app/globals.css` entirely with the content below**

```css
@import 'leaflet/dist/leaflet.css';

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: light;
  --cream: #FBF6EC;
  --cream-raised: #FDF9F0;
  --cream-sunk: #F3ECDC;
  --navy: #1b2a6b;
  --navy-deep: #11194a;
  --navy-soft: #3a4a8c;
  --corn: #5B8DEF;
  --corn-dim: #3a6fd8;
  --planet: #4A90D9;
  --gold: #FFC23C;
  --gold-deep: #d99e20;
  --pink: #F58BB0;
  --purple: #9B7BD6;
  --ink: #1b2a6b;
  --ink-mute: #5a6488;
  --ink-faint: #8a93b0;
  --border: #ece3cf;
  --border-strong: #d9e1f5;
  --danger: #e0567a;
  --success: #2fa37a;

  /* legacy aliases kept so any stragglers resolve to the new theme */
  --space-void: var(--cream);
  --text-primary: var(--navy);
  --text-secondary: var(--ink-mute);
  --text-muted: var(--ink-faint);
  --accent: var(--corn);

  --radius-sm: 0.8rem;
  --radius-md: 1.05rem;
  --radius-lg: 1.3rem;
  --radius-pill: 999px;
  --shadow-soft: 0 8px 22px rgba(74, 144, 217, 0.10);
  --shadow-panel: 0 16px 40px rgba(74, 144, 217, 0.14);
  --page-max-width: 78rem;
}

html, body {
  height: 100%;
  font-family: var(--font-nunito), 'Segoe UI', system-ui, sans-serif;
  background:
    radial-gradient(circle at 10% 8%, rgba(91, 141, 239, 0.07), transparent 32%),
    radial-gradient(circle at 88% 84%, rgba(247, 168, 196, 0.08), transparent 34%),
    var(--cream);
  color: var(--ink);
  overflow-x: hidden;
}

/* faint paper grain over the cream */
body::before {
  content: '';
  position: fixed; inset: 0; z-index: 0; pointer-events: none; opacity: 0.5;
  background-image: radial-gradient(rgba(27, 42, 107, 0.035) 1px, transparent 1px);
  background-size: 7px 7px;
}

h1, h2, h3, h4, .font-display { font-family: var(--font-fredoka), system-ui, sans-serif; }

::selection { background: rgba(91, 141, 239, 0.28); color: var(--navy); }
a { color: inherit; }

::-webkit-scrollbar { width: 11px; height: 11px; }
::-webkit-scrollbar-thumb { background: #d8cdb3; border-radius: 999px; border: 3px solid var(--cream); }
::-webkit-scrollbar-thumb:hover { background: var(--corn); }

/* ── Daytime sky backdrop (replaces dark starfield) ───────────── */
.sky-backdrop { position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
.sky-doodle { position: absolute; opacity: 0.5; }
@keyframes sky-bob { 0%,100% { transform: translateY(0) rotate(var(--rot,0deg)); } 50% { transform: translateY(-10px) rotate(var(--rot,0deg)); } }
.sky-float { animation: sky-bob 9s ease-in-out infinite; }

/* ── Cards & surfaces ─────────────────────────────────────────── */
.space-card, .surface-panel {
  background: var(--cream-raised);
  border: 1.5px solid var(--border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-soft);
  transition: border-color .22s, box-shadow .22s, transform .22s;
}
.space-card:hover { border-color: var(--corn); box-shadow: var(--shadow-panel); transform: translateY(-2px); }
.surface-panel { padding: 1.35rem; }
.space-glass {
  background: rgba(253, 249, 240, 0.82);
  backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  border: 1.5px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-panel);
}
.surface-panel--search, .surface-panel--empty { position: relative; overflow: hidden; }

/* ── Inputs ───────────────────────────────────────────────────── */
.space-input {
  background: #fff;
  border: 1.5px solid var(--border-strong);
  border-radius: 0.9rem; color: var(--navy);
  min-height: 3rem; padding: 0.8rem 0.95rem; font-size: 0.9rem;
  outline: none; transition: border-color .2s, box-shadow .2s;
}
.space-input::placeholder { color: var(--ink-faint); }
.space-input:focus { border-color: var(--corn); box-shadow: 0 0 0 3px rgba(91, 141, 239, 0.18); }

/* ── Buttons (chunky 3D) ──────────────────────────────────────── */
.space-btn {
  font-family: var(--font-fredoka), sans-serif;
  background: #fff; border: 1.5px solid var(--border-strong);
  color: var(--navy); border-radius: 0.9rem;
  min-height: 2.9rem; padding: 0.6rem 1.1rem; font-size: 0.92rem; font-weight: 600;
  cursor: pointer; box-shadow: 0 4px 0 #d9e1f5; transition: transform .08s, box-shadow .08s, background .2s;
}
.space-btn:hover { background: var(--cream-sunk); }
.space-btn:active { transform: translateY(4px); box-shadow: 0 0 0 #d9e1f5; }
.space-btn:disabled { opacity: 0.5; cursor: not-allowed; box-shadow: 0 4px 0 #d9e1f5; transform: none; }
.space-btn-primary { background: var(--navy); border-color: transparent; color: #fff; box-shadow: 0 6px 0 var(--navy-deep); }
.space-btn-primary:hover { background: #243a8a; }
.space-btn-primary:active { transform: translateY(6px); box-shadow: 0 0 0 var(--navy-deep); }
.space-btn-gold { background: var(--gold); border-color: transparent; color: var(--navy); box-shadow: 0 6px 0 var(--gold-deep); }
.space-btn-gold:active { transform: translateY(6px); box-shadow: 0 0 0 var(--gold-deep); }

/* ── Page shell + hero ────────────────────────────────────────── */
.page-shell { width: min(var(--page-max-width), calc(100% - 2rem)); margin: 0 auto; padding: 2rem 0 3rem; position: relative; z-index: 1; }
.page-hero {
  position: relative; display: grid; grid-template-columns: minmax(0, 1.45fr) minmax(260px, 0.9fr);
  gap: 1.5rem; align-items: center; padding: 2rem 2rem 2.2rem; overflow: hidden;
  border: 1.5px solid var(--border); border-radius: var(--radius-lg);
  background:
    radial-gradient(circle at 14% 20%, rgba(91,141,239,.08), transparent 34%),
    radial-gradient(circle at 86% 80%, rgba(247,168,196,.10), transparent 36%),
    var(--cream-raised);
  box-shadow: var(--shadow-soft);
}
.page-hero__copy, .page-hero__rail { display: flex; flex-direction: column; gap: 1rem; }
.page-eyebrow {
  display: inline-flex; align-items: center; gap: 0.5rem; width: fit-content;
  font-family: var(--font-caveat), cursive; font-size: 1.5rem; color: var(--corn);
  transform: rotate(-3deg); padding: 0; border: none; background: none; letter-spacing: 0; text-transform: none;
}
.page-eyebrow__tag { font-family: var(--font-nunito); font-size: 0.6rem; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; color: var(--purple); padding: 0.2rem 0.5rem; border-radius: 999px; background: rgba(155,123,214,.14); transform: rotate(2deg); }
.page-title {
  margin: 0; font-family: var(--font-fredoka), sans-serif; font-weight: 700;
  font-size: clamp(2.1rem, 3.4vw, 3.1rem); line-height: 1.02; letter-spacing: -0.02em; color: var(--navy);
}
.page-title .hl { color: var(--corn-dim); position: relative; white-space: nowrap; }
.page-kicker { margin: 0.3rem 0 0; color: var(--ink-faint); font-size: 0.8rem; }
.page-subtitle { margin: 0; max-width: 56ch; color: var(--ink-mute); font-size: 1.02rem; line-height: 1.7; font-weight: 600; }
.page-section { margin-top: 1.75rem; }

/* hero stat tiles */
.page-hero__stats { display: grid; gap: 0.8rem; }
.page-hero__stats--atlas { grid-column: 1 / -1; grid-template-columns: repeat(3, minmax(0, 1fr)); }
.page-stat { display: flex; flex-direction: column; gap: 0.3rem; padding: 1rem 1.05rem; border-radius: var(--radius-md); border: 1.5px solid var(--border); background: #fff; box-shadow: var(--shadow-soft); }
.page-stat__label { color: var(--ink-faint); font-size: 0.66rem; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; }
.page-stat__value { color: var(--navy); font-family: var(--font-fredoka); font-size: 1.3rem; font-weight: 700; }
.page-stat__hint { color: var(--corn-dim); font-size: 0.74rem; font-weight: 700; }

/* ── Section headings ─────────────────────────────────────────── */
.section-heading-row { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0.75rem; }
.section-title { margin: 0; font-family: var(--font-fredoka); color: var(--navy); font-size: 1.4rem; font-weight: 700; letter-spacing: -0.01em; }
.section-meta { margin: 0; color: var(--ink-faint); font-size: 0.9rem; font-weight: 600; }

/* ── Search suite / filters ───────────────────────────────────── */
.search-suite { display: grid; gap: 0.95rem; }
.search-suite__form { display: flex; width: 100%; gap: 0.75rem; }
.search-suite__dropdown { border-radius: var(--radius-md); }
.search-suite__meta { display: flex; flex-wrap: wrap; align-items: center; gap: 0.85rem; }
.search-suite__meta-copy { color: var(--ink-faint); font-size: 0.82rem; font-weight: 600; }
.filter-grid { display: grid; grid-template-columns: repeat(1, minmax(0, 1fr)); gap: 0.9rem; }
.filter-field { display: flex; flex-direction: column; }
.filter-label { display: block; margin-bottom: 0.4rem; color: var(--navy-soft); font-size: 0.7rem; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; }

/* ── Chips ────────────────────────────────────────────────────── */
.chip { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.42rem 0.9rem; border-radius: 999px; font-size: 0.8rem; font-weight: 700; cursor: pointer; background: #fff; color: var(--navy-soft); border: 1.5px solid var(--border); transition: all .15s; }
.chip:hover { border-color: var(--corn); }
.chip--active { background: var(--corn); color: #fff; border-color: var(--corn); }
.chip--gold.chip--active { background: var(--gold); color: var(--navy); border-color: var(--gold); }

/* ── Project list/cards (sticker cards) ───────────────────────── */
.project-list { display: grid; grid-template-columns: 1fr; gap: 1.1rem; }
@media (min-width: 720px) { .project-list { grid-template-columns: repeat(2, 1fr); } }
.project-card {
  display: block; padding: 1.3rem 1.35rem; border-radius: var(--radius-lg);
  border: 1.5px solid var(--border); background: var(--cream-raised);
  text-decoration: none; box-shadow: var(--shadow-soft);
  transition: transform .2s, border-color .2s, box-shadow .2s;
}
.project-card:hover { transform: translateY(-4px) rotate(-0.4deg); border-color: var(--corn); box-shadow: var(--shadow-panel); }
.project-card__header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; }
.project-card__lead { display: flex; align-items: flex-start; gap: 0.85rem; min-width: 0; }
.project-card__icon { display: inline-flex; align-items: center; justify-content: center; width: 2.5rem; height: 2.5rem; border-radius: 0.9rem; background: rgba(91,141,239,.12); font-size: 1.1rem; }
.project-card__title-group { min-width: 0; }
.project-card__eyebrow { display: block; margin-bottom: 0.3rem; color: var(--corn-dim); font-size: 0.66rem; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.project-card__title { margin: 0; font-family: var(--font-fredoka); color: var(--navy); font-size: 1.12rem; font-weight: 600; line-height: 1.3; }
.project-card__badges { display: flex; flex-wrap: wrap; gap: 0.55rem; justify-content: flex-end; }
.project-card__signal { display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.32rem 0.68rem; border-radius: 999px; background: rgba(255,194,60,.18); color: var(--gold-deep); border: 1.5px solid rgba(255,194,60,.4); font-size: 0.72rem; font-weight: 800; }
.project-card__description { margin: 0.95rem 0 0; color: var(--ink-mute); font-size: 0.92rem; line-height: 1.65; font-weight: 600; height: 6rem; overflow: hidden; box-sizing: border-box; }
.project-card__readmore { display: block; margin-top: 0.5rem; text-align: right; color: var(--corn-dim); font-weight: 800; font-size: 0.74rem; text-transform: uppercase; letter-spacing: 0.03em; }
.project-card__meta-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.75rem; margin-top: 1rem; padding-top: 0.9rem; border-top: 1.5px dashed var(--border); }
.project-card__meta-item { display: flex; flex-direction: column; gap: 0.25rem; min-width: 0; }
.project-card__meta-label { color: var(--ink-faint); font-size: 0.64rem; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; }
.project-card__meta-value { color: var(--navy-soft); font-size: 0.84rem; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* ── TRL badges (pastel) ──────────────────────────────────────── */
.trl-badge { padding: 0.18rem 0.6rem; border-radius: 9999px; font-size: 0.7rem; font-weight: 800; }
.trl-low  { background: rgba(245,139,176,.2); color: #c44d77; border: 1.5px solid rgba(245,139,176,.45); }
.trl-mid  { background: rgba(255,194,60,.2); color: var(--gold-deep); border: 1.5px solid rgba(255,194,60,.45); }
.trl-high { background: rgba(47,163,122,.16); color: #21795a; border: 1.5px solid rgba(47,163,122,.4); }

/* ── Loading / empty panels ───────────────────────────────────── */
.loading-panel { display: flex; width: 100%; align-items: center; gap: 1.1rem; padding: 1.5rem; border-radius: var(--radius-lg); border: 1.5px solid var(--border); background: var(--cream-raised); box-shadow: var(--shadow-soft); }
.loading-panel__copy { display: flex; flex-direction: column; gap: 0.25rem; }
.loading-panel__eyebrow { color: var(--corn-dim); font-size: 0.68rem; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; }
.loading-panel__title { margin: 0; font-family: var(--font-fredoka); color: var(--navy); font-size: 1.05rem; font-weight: 600; }
.loading-panel__body { margin: 0; color: var(--ink-faint); font-size: 0.85rem; font-weight: 600; }

/* mascot bob (used by Mascot loading variant) */
@keyframes nova-bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
.nova-bob { animation: nova-bob 2.4s ease-in-out infinite; }

/* ── Top nav (cream, friendly) ────────────────────────────────── */
.global-topbar {
  position: fixed; top: 0; left: 0; right: 0; z-index: 70;
  display: flex; align-items: center; justify-content: space-between; gap: 1rem;
  min-height: 3.75rem; padding: 0.6rem 1.1rem;
  background: rgba(253, 249, 240, 0.9); border-bottom: 1.5px solid var(--border);
  backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
}
.global-topbar-brand { display: inline-flex; align-items: center; gap: 0.5rem; text-decoration: none; }
.global-topbar-wordmark { font-family: var(--font-fredoka); font-weight: 700; font-size: 1.22rem; letter-spacing: -0.02em; color: var(--navy); }
.global-topbar-wordmark .pedia { color: var(--corn); }
.global-topbar-links { display: flex; align-items: center; gap: 0.35rem; max-width: min(64vw, 920px); overflow-x: auto; scrollbar-width: none; }
.global-topbar-links::-webkit-scrollbar { display: none; }
.global-topbar-link {
  display: inline-flex; flex-shrink: 0; align-items: center; min-height: 2.1rem; padding: 0 0.8rem;
  border-radius: 999px; color: var(--navy-soft); text-decoration: none;
  font-family: var(--font-fredoka); font-size: 0.82rem; font-weight: 500; transition: all .18s;
}
.global-topbar-link:hover { color: var(--navy); background: var(--cream-sunk); }
.global-topbar-link-active { color: var(--navy); background: rgba(255,194,60,.22); box-shadow: inset 0 -2px 0 var(--gold); }

/* legacy nav classes (still referenced in some pages) */
.space-nav { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 0.65rem; }
.space-nav-link { display: inline-flex; align-items: center; gap: 0.5rem; min-height: 2.6rem; padding: 0.6rem 1rem; border-radius: 0.8rem; border: 1.5px solid var(--border); background: #fff; color: var(--navy-soft); font-size: 0.84rem; font-weight: 700; text-decoration: none; transition: all .2s; }
.space-nav-link:hover { border-color: var(--corn); color: var(--navy); }
.space-nav-link-active { border-color: var(--corn); background: rgba(91,141,239,.12); color: var(--navy); }
.space-nav-link-icon { color: var(--corn); }

/* ── Intelligence (Command Center) — playful chrome, clean data ── */
.intel-sidebar {
  position: fixed; top: 3.75rem; left: 0; bottom: 0; width: 222px; z-index: 40;
  display: flex; flex-direction: column; gap: 3px; padding: 0.9rem 0.6rem;
  background: var(--cream-raised); border-right: 1.5px solid var(--border); overflow-y: auto;
  transition: width .2s, padding .2s;
}
.intel-sidebar-collapsed { width: 56px; padding: 0.9rem 0.4rem; }
.intel-sidebar-collapsed .intel-nav-label { display: none; }
.intel-nav-item { display: flex; align-items: center; gap: 0.65rem; padding: 0.55rem 0.7rem; border-radius: 0.7rem; font-family: var(--font-fredoka); font-size: 0.84rem; font-weight: 500; color: var(--navy-soft); text-decoration: none; transition: all .15s; white-space: nowrap; overflow: hidden; }
.intel-nav-item:hover { background: var(--cream-sunk); color: var(--navy); }
.intel-nav-active { background: rgba(91,141,239,.14); color: var(--corn-dim); box-shadow: inset 3px 0 0 var(--corn); }
.intel-brand-link { font-family: var(--font-fredoka); font-size: 1rem; font-weight: 700; color: var(--navy); text-decoration: none; }
.intel-topbar { position: sticky; top: 0; z-index: 50; display: flex; align-items: center; justify-content: space-between; height: 3rem; padding: 0 1.25rem; background: var(--cream-raised); border-bottom: 1.5px solid var(--border); }
.intel-topbar-link { display: inline-flex; align-items: center; min-height: 2rem; padding: 0 0.8rem; border-radius: 999px; color: var(--navy-soft); text-decoration: none; font-family: var(--font-fredoka); font-size: 0.8rem; font-weight: 500; }
.intel-topbar-link:hover { background: var(--cream-sunk); color: var(--navy); }

.intel-card { background: var(--cream-raised); border: 1.5px solid var(--border); border-radius: var(--radius-md); padding: 1.25rem; position: relative; box-shadow: var(--shadow-soft); transition: border-color .2s, box-shadow .2s; }
.intel-card:hover { border-color: var(--corn); box-shadow: var(--shadow-panel); }
.intel-hero { position: relative; display: grid; grid-template-columns: minmax(0, 1.7fr) minmax(280px, 1fr); gap: 1.5rem; padding: 1.75rem; align-items: center; border: 1.5px solid var(--border); border-radius: var(--radius-lg); background: radial-gradient(circle at 86% 20%, rgba(91,141,239,.10), transparent 40%), var(--cream-raised); overflow: hidden; box-shadow: var(--shadow-soft); }
.intel-hero__copy { position: relative; z-index: 1; display: flex; flex-direction: column; gap: 0.85rem; }
.intel-hero__eyebrow { display: inline-flex; width: fit-content; font-family: var(--font-caveat); font-size: 1.4rem; color: var(--corn); transform: rotate(-3deg); }
.intel-hero__title { margin: 0; font-family: var(--font-fredoka); max-width: 14ch; font-size: clamp(1.9rem, 3vw, 3rem); line-height: 1.06; letter-spacing: -0.02em; color: var(--navy); font-weight: 700; }
.intel-hero__title-chip { display: inline-flex; align-items: center; gap: 0.3em; padding: 0.1em 0.4em; margin: 0 0.1em; border-radius: 0.35em; background: var(--navy); color: #fff; }
.intel-hero__title-chip-core { font-size: 0.8em; font-weight: 700; letter-spacing: 0.06em; }
.intel-hero__title-chip-orbit { display: inline-flex; align-items: center; justify-content: center; width: 1.1em; height: 1.1em; border-radius: 999px; border: 1.5px solid var(--gold); color: var(--gold); font-size: 0.55em; }
.intel-hero__body { max-width: 48rem; margin: 0; color: var(--ink-mute); font-size: 1rem; line-height: 1.65; font-weight: 600; }
.intel-hero__actions { display: flex; flex-wrap: wrap; gap: 0.75rem; }
.intel-hero__summary { position: relative; z-index: 1; display: grid; gap: 0.8rem; }
.intel-hero__panel { display: flex; flex-direction: column; gap: 0.3rem; padding: 1rem; border-radius: 0.9rem; border: 1.5px solid var(--border); background: #fff; }
.intel-hero__label { color: var(--ink-faint); font-size: 0.66rem; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; }
.intel-hero__value { color: var(--navy); font-family: var(--font-fredoka); font-size: 1.25rem; font-weight: 700; }
.intel-hero__hint { color: var(--corn-dim); font-size: 0.72rem; font-weight: 700; }

/* tables — clean & legible */
.intel-th { padding: 0.55rem 0.8rem; text-align: left; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; color: var(--navy-soft); border-bottom: 1.5px solid var(--border); background: var(--cream-sunk); white-space: nowrap; }
.intel-td { padding: 0.5rem 0.8rem; font-size: 0.82rem; color: var(--ink-mute); font-weight: 600; border-bottom: 1px solid var(--border); white-space: nowrap; }
tr:hover .intel-td { background: rgba(91,141,239,.05); }

.intel-live-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--success); animation: intel-pulse 2s ease-in-out infinite; }
@keyframes intel-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
.intel-gauge-track { height: 7px; border-radius: 999px; background: var(--cream-sunk); overflow: hidden; }
.intel-gauge-fill { height: 100%; border-radius: 999px; transition: width .6s ease; background: linear-gradient(90deg, var(--corn), var(--corn-dim)); }
.intel-alert { display: flex; align-items: center; gap: 0.5rem; padding: 0.6rem 1rem; border-radius: 0.7rem; font-size: 0.8rem; font-weight: 700; border: 1.5px solid; }
.intel-alert-surge { background: rgba(255,194,60,.12); border-color: rgba(255,194,60,.4); color: var(--gold-deep); }
.intel-alert-escalation { background: rgba(245,139,176,.12); border-color: rgba(245,139,176,.4); color: #c44d77; }
.intel-alert-expansion { background: rgba(155,123,214,.12); border-color: rgba(155,123,214,.4); color: #6f54b0; }
.intel-status-dot { position: absolute; top: 0.75rem; right: 0.75rem; width: 8px; height: 8px; border-radius: 50%; }
.intel-status-elevated { background: var(--gold); }
.intel-status-critical { background: var(--danger); }

/* charts — light theme via CSS vars consumed in chart components (Task D2) */
.intel-chart .recharts-cartesian-grid line { stroke: rgba(27,42,107,0.08); }
.intel-chart .recharts-text { fill: var(--ink-faint); font-size: 0.72rem; font-family: var(--font-nunito); }
.recharts-tooltip-wrapper .recharts-default-tooltip,
.intel-chart .recharts-tooltip-wrapper .recharts-default-tooltip {
  background: var(--cream-raised) !important; border: 1.5px solid var(--border) !important;
  border-radius: 0.6rem !important; font-size: 0.78rem !important; color: var(--navy) !important;
}
.recharts-tooltip-wrapper .recharts-default-tooltip *,
.intel-chart .recharts-tooltip-wrapper .recharts-default-tooltip * {
  color: var(--navy) !important;
}

/* ── Maps (Aurora / ISS) — clean, light ───────────────────────── */
.iss-map-shell { position: relative; border-radius: var(--radius-md); overflow: hidden; border: 1.5px solid var(--border); background: var(--cream-sunk); box-shadow: var(--shadow-soft); }
.iss-map { height: 420px; width: 100%; }
.iss-map-overlay { position: absolute; top: 0.75rem; left: 0.75rem; background: rgba(253,249,240,0.92); color: var(--navy); font-family: var(--font-fredoka); font-size: 0.72rem; font-weight: 600; letter-spacing: 0.04em; padding: 0.4rem 0.7rem; border: 1.5px solid var(--border); border-radius: 999px; box-shadow: var(--shadow-soft); }
.iss-marker { width: 18px; height: 18px; border-radius: 999px; background: radial-gradient(circle at 32% 30%, #fff, var(--gold) 60%, var(--gold-deep) 100%); border: 2px solid #fff; box-shadow: 0 0 0 2px var(--gold), 0 2px 6px rgba(0,0,0,.2); }
.leaflet-control-zoom a { background: var(--cream-raised) !important; color: var(--navy) !important; border: 1.5px solid var(--border) !important; }
.leaflet-control-zoom a:hover { background: var(--cream-sunk) !important; }
.leaflet-control-attribution, .leaflet-control-attribution a { color: var(--ink-faint) !important; background: rgba(253,249,240,0.8) !important; }

/* ── News / Blogs cards (warm editorial) ──────────────────────── */
.news-grid { display: grid; grid-template-columns: 1fr; gap: 1.25rem; }
@media (min-width: 640px) { .news-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .news-grid { grid-template-columns: repeat(3, 1fr); } }
.news-card { display: flex; flex-direction: column; background: var(--cream-raised); border: 1.5px solid var(--border); border-radius: var(--radius-md); overflow: hidden; box-shadow: var(--shadow-soft); text-decoration: none; color: inherit; transition: border-color .22s, box-shadow .22s, transform .22s; }
.news-card:hover { border-color: var(--corn); box-shadow: var(--shadow-panel); transform: translateY(-3px); }
.news-card__image-wrap { position: relative; aspect-ratio: 16 / 9; overflow: hidden; background: var(--cream-sunk); }
.news-card__image { width: 100%; height: 100%; object-fit: cover; transition: transform .35s ease; }
.news-card:hover .news-card__image { transform: scale(1.04); }
.news-card__image-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; background: linear-gradient(135deg, var(--cream-sunk), #e7eefb); }
.news-card__source-badge { position: absolute; top: 0.6rem; right: 0.6rem; padding: 0.24rem 0.6rem; border-radius: 999px; background: rgba(253,249,240,0.92); border: 1.5px solid var(--border); color: var(--corn-dim); font-size: 0.62rem; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; }
.news-card__body { display: flex; flex-direction: column; flex: 1; padding: 1rem 1rem 0.85rem; gap: 0.5rem; }
.news-card__title { margin: 0; font-family: var(--font-fredoka); font-size: 1rem; font-weight: 600; line-height: 1.3; color: var(--navy); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.news-card__summary { margin: 0; font-size: 0.84rem; line-height: 1.5; color: var(--ink-mute); font-weight: 600; height: 4.5rem; overflow: hidden; box-sizing: border-box; }
.news-card__readmore { display: block; margin-top: 0.45rem; text-align: right; color: var(--corn-dim); font-weight: 800; font-size: 0.72rem; text-transform: uppercase; }
.news-card__footer { display: flex; align-items: center; justify-content: space-between; margin-top: auto; padding-top: 0.5rem; border-top: 1.5px dashed var(--border); }
.news-card__date { font-size: 0.72rem; color: var(--ink-faint); font-weight: 700; }
.news-card__cta { font-size: 0.72rem; font-weight: 800; color: var(--corn-dim); }
.news-card:hover .news-card__cta { color: var(--navy); }
.load-more-btn { min-width: 10rem; display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; }
.load-more-spinner { width: 14px; height: 14px; border: 2px solid rgba(27,42,107,0.2); border-top-color: var(--corn); border-radius: 50%; animation: spin-loader 0.6s linear infinite; }
@keyframes spin-loader { to { transform: rotate(360deg); } }

/* ── Responsive ───────────────────────────────────────────────── */
@media (max-width: 960px) {
  .page-hero { grid-template-columns: 1fr; }
  .page-hero__stats--atlas { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .intel-hero { grid-template-columns: 1fr; }
}
@media (max-width: 768px) {
  .intel-sidebar { width: 56px; padding: 0.9rem 0.4rem; }
  .intel-sidebar .intel-nav-label { display: none; }
}
@media (min-width: 768px) { .filter-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
@media (max-width: 640px) {
  .global-topbar { padding-inline: 0.75rem; }
  .space-nav { justify-content: flex-start; }
  .page-shell { width: min(var(--page-max-width), calc(100% - 1rem)); padding: 1.3rem 0 2.2rem; }
  .page-hero { padding: 1.3rem; }
  .surface-panel, .loading-panel, .project-card { padding: 1.1rem; }
  .search-suite__form { flex-direction: column; }
  .project-card__header { flex-direction: column; }
  .project-card__badges { justify-content: flex-start; }
  .project-card__meta-grid { grid-template-columns: 1fr; }
  .project-list { grid-template-columns: 1fr; }
}

@media (prefers-reduced-motion: reduce) {
  .sky-float, .nova-bob, .intel-gauge-fill, .news-card__image, .intel-live-dot { animation: none !important; transition: none !important; }
}
```

- [ ] **Step 2: Commit (build verified in B2 once components exist)**

```bash
git add app/globals.css
git commit -m "Rewrite globals.css to bright/playful cream+navy theme (all class names preserved)"
```

---

## Phase B — Illustrated Components

### Task B1: Doodle kit

**Files:**
- Create: `components/brand/Doodle.tsx`

- [ ] **Step 1: Create `components/brand/Doodle.tsx`**

```tsx
type DoodleName = 'star' | 'sparkle' | 'orbit' | 'underline' | 'shooting-star' | 'planet'

type DoodleProps = {
  name: DoodleName
  className?: string
  style?: React.CSSProperties
  color?: string
}

export default function Doodle({ name, className = '', style, color = 'currentColor' }: DoodleProps) {
  const common = { 'aria-hidden': true as const, className, style, fill: color }
  switch (name) {
    case 'star':
      return (
        <svg {...common} width="24" height="24" viewBox="0 0 24 24">
          <path d="M12 2l2.4 6.6L21 9l-5 4.3L17.5 21 12 17l-5.5 4 1.5-7.7L3 9l6.6-.4z" />
        </svg>
      )
    case 'sparkle':
      return (
        <svg {...common} width="20" height="20" viewBox="0 0 24 24">
          <path d="M12 0c.6 5.4 2.6 7.4 8 8-5.4.6-7.4 2.6-8 8-.6-5.4-2.6-7.4-8-8 5.4-.6 7.4-2.6 8-8z" />
        </svg>
      )
    case 'planet':
      return (
        <svg {...common} width="28" height="28" viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="14" r="8" fill={color} />
          <ellipse cx="14" cy="15" rx="13" ry="4" stroke={color} strokeWidth="2.2" fill="none" transform="rotate(-18 14 15)" />
        </svg>
      )
    case 'orbit':
      return (
        <svg {...common} width="120" height="40" viewBox="0 0 120 40" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round">
          <path d="M4 30 C 40 6, 80 6, 116 26" strokeDasharray="2 8" />
        </svg>
      )
    case 'shooting-star':
      return (
        <svg {...common} width="80" height="40" viewBox="0 0 80 40" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round">
          <path d="M6 34 L 52 8" />
          <path d="M22 33 L 40 22" opacity="0.6" />
          <path d="M58 6l1.6 4.2L64 11l-3.2 2.8L62 18l-4-2.6L54 18l1.1-4.9L52 11l4.2-.3z" fill={color} stroke="none" />
        </svg>
      )
    case 'underline':
      return (
        <svg {...common} width="280" height="14" viewBox="0 0 280 14" preserveAspectRatio="none" fill="none">
          <path d="M3 8 C 70 2, 150 12, 277 5" stroke={color} strokeWidth="5" strokeLinecap="round" />
        </svg>
      )
  }
}
```

- [ ] **Step 2: Lint-compile check**

Run: `npx tsc --noEmit` (from `frontend/`)
Expected: No errors related to `Doodle.tsx`.

- [ ] **Step 3: Commit**

```bash
git add components/brand/Doodle.tsx
git commit -m "Add SVG doodle kit component"
```

### Task B2: Mascot (Nova) + SkyBackdrop, then verify the foundation build

**Files:**
- Create: `components/brand/Mascot.tsx`, `components/brand/SkyBackdrop.tsx`
- Delete: `components/StarField.tsx`

- [ ] **Step 1: Create `components/brand/Mascot.tsx`**

```tsx
type Expression = 'read' | 'wave' | 'sleep'

type MascotProps = {
  size?: number
  expression?: Expression
  className?: string
  bob?: boolean
  'aria-hidden'?: boolean
}

export default function Mascot({ size = 160, expression = 'read', className = '', bob = false, ...rest }: MascotProps) {
  const s = size
  return (
    <svg
      width={s} height={s} viewBox="0 0 200 200"
      className={`${bob ? 'nova-bob' : ''} ${className}`}
      role="img" aria-label={rest['aria-hidden'] ? undefined : 'Nova, the Nasapedia planet'}
      aria-hidden={rest['aria-hidden']}
    >
      {/* ring behind */}
      <ellipse cx="100" cy="108" rx="92" ry="26" fill="none" stroke="#FFC23C" strokeWidth="9" transform="rotate(-18 100 108)" />
      {/* planet body */}
      <circle cx="100" cy="92" r="58" fill="#4A90D9" />
      <circle cx="100" cy="92" r="58" fill="url(#novaShade)" />
      {/* ring front (over body) */}
      <path d="M 22 118 A 92 26 -18 0 0 178 96" fill="none" stroke="#FFC23C" strokeWidth="9" strokeLinecap="round" />
      {/* face */}
      {expression !== 'sleep' ? (
        <>
          <ellipse cx="84" cy="86" rx="7" ry="9" fill="#11194a" />
          <ellipse cx="116" cy="86" rx="7" ry="9" fill="#11194a" />
          <circle cx="86" cy="83" r="2.4" fill="#fff" />
          <circle cx="118" cy="83" r="2.4" fill="#fff" />
        </>
      ) : (
        <>
          <path d="M77 86 q7 6 14 0" stroke="#11194a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M109 86 q7 6 14 0" stroke="#11194a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        </>
      )}
      <ellipse cx="76" cy="102" rx="7" ry="4" fill="#f7a8c4" opacity="0.85" />
      <ellipse cx="124" cy="102" rx="7" ry="4" fill="#f7a8c4" opacity="0.85" />
      <path d="M92 104 q8 8 16 0" stroke="#11194a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      {/* book (read expression) */}
      {expression === 'read' && (
        <g>
          <rect x="64" y="120" width="72" height="30" rx="4" fill="#1b2a6b" />
          <rect x="69" y="125" width="62" height="20" rx="2" fill="#f4e6c8" />
          <text x="100" y="141" textAnchor="middle" fontFamily="var(--font-fredoka), sans-serif" fontWeight="700" fontSize="15" fill="#1b2a6b">N</text>
        </g>
      )}
      {expression === 'wave' && (
        <circle cx="150" cy="120" r="11" fill="#4A90D9" />
      )}
      <defs>
        <radialGradient id="novaShade" cx="38%" cy="32%" r="72%">
          <stop offset="0%" stopColor="#7fb0ec" />
          <stop offset="70%" stopColor="#4A90D9" />
          <stop offset="100%" stopColor="#3a7cc4" />
        </radialGradient>
      </defs>
    </svg>
  )
}
```

- [ ] **Step 2: Create `components/brand/SkyBackdrop.tsx`**

```tsx
import Doodle from './Doodle'

const DOODLES = [
  { name: 'star' as const, top: '12%', left: '8%', color: '#FFC23C', size: 26, rot: -8 },
  { name: 'planet' as const, top: '20%', left: '88%', color: '#F58BB0', size: 40, rot: 0 },
  { name: 'sparkle' as const, top: '38%', left: '15%', color: '#5B8DEF', size: 18, rot: 0 },
  { name: 'star' as const, top: '70%', left: '90%', color: '#9B7BD6', size: 20, rot: 12 },
  { name: 'orbit' as const, top: '78%', left: '6%', color: '#5B8DEF', size: 120, rot: 0 },
  { name: 'sparkle' as const, top: '55%', left: '80%', color: '#FFC23C', size: 16, rot: 0 },
]

export default function SkyBackdrop() {
  return (
    <div className="sky-backdrop" aria-hidden="true">
      {DOODLES.map((d, i) => (
        <span
          key={i}
          className="sky-doodle sky-float"
          style={{ top: d.top, left: d.left, ['--rot' as string]: `${d.rot}deg`, animationDelay: `${i * 0.8}s` }}
        >
          <Doodle name={d.name} color={d.color} style={{ width: d.size, height: d.size, transform: `rotate(${d.rot}deg)` }} />
        </span>
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Delete the old StarField**

Run: `git rm components/StarField.tsx`
Expected: file removed. (Layout already imports `SkyBackdrop` instead — Task A2.)

- [ ] **Step 4: Full build verification of Phase A + B foundation**

Run: `npm run build`
Expected: Build succeeds, zero TypeScript errors, zero new warnings. (This validates A2's layout imports + A3 CSS now that components exist.)

- [ ] **Step 5: Visual smoke check**

Run: `npm run dev`, open `/projects`.
Expected: Cream background, paper grain, floating pastel doodles, Nunito body, no dark void, no console errors. (Nav still old-styled until B3 — acceptable.)

- [ ] **Step 6: Commit**

```bash
git add components/brand/Mascot.tsx components/brand/SkyBackdrop.tsx
git commit -m "Add Nova mascot + daytime SkyBackdrop; remove dark StarField"
```

### Task B3: Redesign TopNav

**Files:**
- Modify: `components/TopNav.tsx`

- [ ] **Step 1: Replace `components/TopNav.tsx` entirely**

```tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Mascot from './brand/Mascot'

const NAV_ITEMS = [
  { href: '/projects', label: 'Missions', match: (p: string) => p === '/projects' || p.startsWith('/project/') },
  { href: '/feed', label: 'Feed', match: (p: string) => p.startsWith('/feed') },
  { href: '/global-launch-intelligence/dashboard', label: 'Command Center', match: (p: string) => p.startsWith('/global-launch-intelligence') },
  { href: '/aurora-tracker', label: 'Aurora', match: (p: string) => p.startsWith('/aurora-tracker') },
  { href: '/iss-tracker', label: 'ISS', match: (p: string) => p.startsWith('/iss-tracker') },
  { href: '/space-news', label: 'News', match: (p: string) => p.startsWith('/space-news') },
  { href: '/space-blogs', label: 'Blogs', match: (p: string) => p.startsWith('/space-blogs') },
]

export default function TopNav() {
  const pathname = usePathname()
  return (
    <header className="global-topbar">
      <Link href="/projects" className="global-topbar-brand">
        <Mascot size={34} expression="read" aria-hidden />
        <span className="global-topbar-wordmark">Nasa<span className="pedia">pedia</span></span>
      </Link>
      <nav className="global-topbar-links" aria-label="Primary">
        {NAV_ITEMS.map((item) => {
          const isActive = item.match(pathname)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`global-topbar-link ${isActive ? 'global-topbar-link-active' : ''}`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
    </header>
  )
}
```

> Removes the red `MissionClock` and the "MISSION DATABASE / COMMAND CENTER" military section label. The `.global-topbar-clock` CSS rule is now unused and harmless (already absent from the rewritten globals).

- [ ] **Step 2: Build + visual check**

Run: `npm run build` then `npm run dev`, view any page top bar.
Expected: cream bar, Nova + "Nasa**pedia**" wordmark, friendly nav links, active link has gold underline. No red clock. Build clean.

- [ ] **Step 3: Commit**

```bash
git add components/TopNav.tsx
git commit -m "Redesign TopNav: cream bar, Nova mark, friendly links, gold active underline"
```

### Task B4: Friendly LoadingState + EmptyState

**Files:**
- Modify: `components/LoadingState.tsx`
- Create: `components/EmptyState.tsx`

- [ ] **Step 1: Replace `components/LoadingState.tsx` entirely**

```tsx
import Mascot from './brand/Mascot'

type LoadingStateProps = { label?: string }

export default function LoadingState({ label = 'Loading the cosmos…' }: LoadingStateProps) {
  return (
    <div className="loading-panel">
      <Mascot size={56} expression="read" bob aria-hidden />
      <div className="loading-panel__copy">
        <span className="loading-panel__eyebrow">hang tight</span>
        <p className="loading-panel__title">{label}</p>
        <p className="loading-panel__body">Nova is fetching fresh space data for you…</p>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create `components/EmptyState.tsx`**

```tsx
import Mascot from './brand/Mascot'

type EmptyStateProps = {
  title?: string
  body?: string
  expression?: 'sleep' | 'wave' | 'read'
  children?: React.ReactNode
}

export default function EmptyState({
  title = 'Nothing out here yet',
  body = 'Try a different search or check back soon.',
  expression = 'sleep',
  children,
}: EmptyStateProps) {
  return (
    <div className="surface-panel surface-panel--empty" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
        <Mascot size={84} expression={expression} aria-hidden />
      </div>
      <h3 className="section-title" style={{ marginBottom: '0.35rem' }}>{title}</h3>
      <p className="section-meta" style={{ maxWidth: '40ch', margin: '0 auto' }}>{body}</p>
      {children ? <div style={{ marginTop: '1rem' }}>{children}</div> : null}
    </div>
  )
}
```

- [ ] **Step 3: Build check**

Run: `npm run build`
Expected: clean build.

- [ ] **Step 4: Commit**

```bash
git add components/LoadingState.tsx components/EmptyState.tsx
git commit -m "Add Nova-based LoadingState and reusable EmptyState"
```

### Task B5: Reusable Button + Chip (optional convenience wrappers)

**Files:**
- Create: `components/brand/Button.tsx`, `components/brand/Chip.tsx`

- [ ] **Step 1: Create `components/brand/Button.tsx`**

```tsx
import Link from 'next/link'

type Variant = 'primary' | 'gold' | 'plain'
type CommonProps = { variant?: Variant; className?: string; children: React.ReactNode }

function cls(variant: Variant, extra = '') {
  const base = 'space-btn'
  const v = variant === 'primary' ? 'space-btn-primary' : variant === 'gold' ? 'space-btn-gold' : ''
  return `${base} ${v} ${extra}`.trim()
}

export function ButtonLink({ href, variant = 'primary', className, children }: CommonProps & { href: string }) {
  return <Link href={href} className={cls(variant, className)}>{children}</Link>
}

export default function Button({
  variant = 'primary', className, children, ...rest
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={cls(variant, className)} {...rest}>{children}</button>
}
```

- [ ] **Step 2: Create `components/brand/Chip.tsx`**

```tsx
type ChipProps = {
  active?: boolean
  gold?: boolean
  onClick?: () => void
  children: React.ReactNode
}

export default function Chip({ active, gold, onClick, children }: ChipProps) {
  const classes = ['chip', active ? 'chip--active' : '', gold ? 'chip--gold' : ''].filter(Boolean).join(' ')
  return (
    <button type="button" className={classes} onClick={onClick} aria-pressed={active}>
      {children}
    </button>
  )
}
```

- [ ] **Step 3: Build check + commit**

Run: `npm run build`
Expected: clean.

```bash
git add components/brand/Button.tsx components/brand/Chip.tsx
git commit -m "Add reusable Button and Chip brand components"
```

---

## Phase C — Core Pages

> Most styling now flows from the rewritten CSS. These tasks add the illustrated personality (kickers, mascot, doodles) and wire the new empty states.

### Task C1: Projects hero + explorer personality

**Files:**
- Modify: `components/ProjectsExplorer.tsx`

Read the file first. It renders the hero/search/results. Apply these concrete changes:

- [ ] **Step 1: Add imports at top of `components/ProjectsExplorer.tsx`**

```tsx
import Doodle from '../components/brand/Doodle'
import Mascot from '../components/brand/Mascot'
import EmptyState from '../components/EmptyState'
```

- [ ] **Step 2: Replace the hero block**

Find the hero markup (the element with class `page-hero` / `page-hero__copy`, containing the eyebrow + `page-title` + `page-subtitle`). Replace its inner structure with:

```tsx
<section className="page-hero">
  <div className="page-hero__copy">
    <span className="page-eyebrow">hey space explorer! <Doodle name="sparkle" color="#FFC23C" style={{ width: 18, height: 18 }} /></span>
    <h1 className="page-title">
      Explore every{' '}
      <span className="hl">
        NASA mission
        <Doodle name="underline" color="#FFC23C" style={{ position: 'absolute', left: 0, bottom: -10, width: '100%' }} />
      </span>
    </h1>
    <p className="page-subtitle">Search thousands of missions, satellites and discoveries — your friendly window into space.</p>
  </div>
  <div className="page-hero__rail" style={{ alignItems: 'center' }}>
    <Mascot size={150} expression="read" bob aria-hidden />
  </div>
</section>
```

(Keep the existing search/filter/results sections that follow.)

- [ ] **Step 3: Wire the empty state**

Find where the "no results" / empty case renders (after a search with zero results). Replace bare empty markup with:

```tsx
<EmptyState
  title="No missions found"
  body="Try a broader search term or clear your filters — there's a whole universe out there."
  expression="sleep"
/>
```

- [ ] **Step 4: Build + visual check**

Run: `npm run build` then `npm run dev`, open `/projects`.
Expected: Hero shows Caveat kicker, Fredoka title with gold scribble underline, Nova bobbing on the right; two-column sticker project cards; empty search shows Nova. Mobile 390px: hero stacks, cards single column. Clean build.

- [ ] **Step 5: Commit**

```bash
git add components/ProjectsExplorer.tsx
git commit -m "Add illustrated hero + Nova empty state to Projects explorer"
```

### Task C2: ProjectCard category icon + accent

**Files:**
- Modify: `components/ProjectCard.tsx`

- [ ] **Step 1: Add a category accent dot to the card lead**

In `components/ProjectCard.tsx`, inside `project-card__lead` (before `project-card__title-group`), add a small planet icon so each card carries brand:

```tsx
<span className="project-card__icon" aria-hidden>
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="7" fill="#4A90D9" />
    <ellipse cx="12" cy="13" rx="11" ry="3.4" stroke="#FFC23C" strokeWidth="2" transform="rotate(-18 12 13)" />
  </svg>
</span>
```

- [ ] **Step 2: Build + visual check**

Run: `npm run build` then view `/projects`.
Expected: each card shows a tiny planet icon left of the title; hover lifts + slight rotate; READ MORE in cornflower. Clean build.

- [ ] **Step 3: Commit**

```bash
git add components/ProjectCard.tsx
git commit -m "Add planet icon accent to project cards"
```

### Task C3: Project detail page

**Files:**
- Modify: `app/project/[id]/page.tsx`

Read the file first. It is theme-driven via existing classes, so the flip is mostly automatic. Apply:

- [ ] **Step 1: Verify it renders on the new theme**

Run: `npm run dev`, open a project detail route (e.g. `/project/1`).
Expected: cream theme already applied via classes. Note any element still using removed dark utility classes (e.g. inline `text-[var(--text-secondary)]`, `bg-[var(--space-...)]`).

- [ ] **Step 2: Replace any inline dark Tailwind utilities**

For any inline classes referencing old vars/utilities on this page, map them:
- `bg-[var(--space-void)]` / `bg-[var(--space-*)]` → remove (inherit cream) or `bg-cream-raised`
- `text-[var(--text-primary)]` → `text-navy`
- `text-[var(--text-secondary)]` → `text-inkmute`
- `border-white/10` → `border-[#ece3cf]`
- `text-accent` / gold text → `text-corn-dim`

Add a doodle divider between major sections:

```tsx
<div aria-hidden style={{ display: 'flex', justifyContent: 'center', margin: '1.5rem 0' }}>
  <Doodle name="shooting-star" color="#9B7BD6" />
</div>
```

(Import `Doodle` from `../../../components/brand/Doodle`.)

- [ ] **Step 3: Build + visual check**

Run: `npm run build` then view the detail route.
Expected: friendly cream profile, navy headings, readable body, doodle divider, no leftover dark patches. Clean build.

- [ ] **Step 4: Commit**

```bash
git add app/project/[id]/page.tsx
git commit -m "Polish project detail page for bright theme + doodle divider"
```

### Task C4: Feed page

**Files:**
- Modify: `app/feed/page.tsx`

- [ ] **Step 1: Read the file, then map any inline dark utilities** using the same mapping table as C3 Step 2.

- [ ] **Step 2: Add a Caveat kicker to the feed hero/header**

Where the feed page renders its title, add above it:

```tsx
<span className="page-eyebrow">fresh from orbit 🛰️</span>
```

(If the page uses `page-hero`/`page-eyebrow` already, just ensure the eyebrow text is friendly.)

- [ ] **Step 3: Wire `EmptyState`** for the empty-feed case (import from `../../components/EmptyState`), `expression="wave"`, body "Your feed will fill up as new space content drops."

- [ ] **Step 4: Build + visual check**

Run: `npm run build` then view `/feed`.
Expected: bright card stream, friendly header, Nova empty state. Clean build.

- [ ] **Step 5: Commit**

```bash
git add app/feed/page.tsx
git commit -m "Brighten Feed page: friendly header + Nova empty state"
```

### Task C5: News + Blogs pages and NewsCard

**Files:**
- Modify: `app/space-news/page.tsx`, `app/space-blogs/page.tsx`, `components/news/NewsCard.tsx`

- [ ] **Step 1: NewsCard** — read `components/news/NewsCard.tsx`; it uses `.news-card*` classes (already re-themed). Replace any inline dark utilities using the C3 mapping. Ensure the image placeholder uses an emoji/Doodle (the `.news-card__image-placeholder` is already styled light).

- [ ] **Step 2: News & Blogs heroes** — add Caveat kickers:
  - News: `<span className="page-eyebrow">space, hot off the press 📰</span>`
  - Blogs: `<span className="page-eyebrow">long reads from the stars ✨</span>`
  Map any inline dark utilities on both pages (C3 table).

- [ ] **Step 3: Empty states** — wire `EmptyState` on both list pages for zero-result cases.

- [ ] **Step 4: Build + visual check**

Run: `npm run build` then view `/space-news` and `/space-blogs`.
Expected: warm 1→2→3 column card grids, friendly kickers, readable Nunito summaries, hover lift. Clean build.

- [ ] **Step 5: Commit**

```bash
git add app/space-news/page.tsx app/space-blogs/page.tsx components/news/NewsCard.tsx
git commit -m "Brighten News + Blogs pages and NewsCard"
```

---

## Phase D — Data Pages (playful chrome, clean data)

### Task D1: Command Center layout + dashboard chrome

**Files:**
- Modify: `app/global-launch-intelligence/layout.tsx`

- [ ] **Step 1: Friendly sidebar labels + icons**

In `app/global-launch-intelligence/layout.tsx`, the `NAV_ITEMS` use shouty uppercase labels (`COMMAND CENTER`, `LAUNCH VELOCITY`, …) and the toggle shows `▾ MODULES`. Replace labels with title-case friendly names and keep the emoji/icon column:

```tsx
const NAV_ITEMS = [
  { href: '/global-launch-intelligence/dashboard', label: 'Command Center', icon: '🛰️' },
  { href: '/global-launch-intelligence/launch-velocity', label: 'Launch Velocity', icon: '🚀' },
  { href: '/global-launch-intelligence/agency-dominance', label: 'Agency Dominance', icon: '🏆' },
  { href: '/global-launch-intelligence/orbital-intelligence', label: 'Orbital Intel', icon: '🌍' },
  { href: '/global-launch-intelligence/mission-classification', label: 'Mission Class', icon: '🗂️' },
  { href: '/global-launch-intelligence/astronaut-activity', label: 'Astronaut Ops', icon: '👩‍🚀' },
  { href: '/global-launch-intelligence/station-traffic', label: 'Station Traffic', icon: '🛰️' },
  { href: '/global-launch-intelligence/geopolitical-map', label: 'Geo Map', icon: '🗺️' },
]
```

Change the collapse toggle text from `'▾ MODULES'` to `'▾ Sections'` and the collapsed glyph stays `'▸'`. Replace the toggle button's inline classes `text-[10px] text-[var(--text-muted)] hover:text-[var(--text-secondary)] uppercase tracking-wider` with `text-xs font-display text-inkmute hover:text-navy`.

- [ ] **Step 2: Build + visual check**

Run: `npm run build` then view `/global-launch-intelligence/dashboard`.
Expected: cream sidebar, title-case links with emoji, active link cornflower with left bar; charts/tables still render (colors fixed in D2). Clean build.

- [ ] **Step 3: Commit**

```bash
git add app/global-launch-intelligence/layout.tsx
git commit -m "Friendly Command Center sidebar (title-case + emoji, cream chrome)"
```

### Task D2: Chart colors + intel components (clean data)

**Files:**
- Modify: `components/intelligence/IntelComponents.tsx`

- [ ] **Step 1: Find hard-coded chart/series colors**

Read `components/intelligence/IntelComponents.tsx`. Locate any hard-coded hex colors used for Recharts series, gauges, status, or inline `style`/`fill`/`stroke` props that assume a dark background (gold `#f2c40d`, `#c58b2f`, near-white text, dark fills).

- [ ] **Step 2: Define and apply a light palette constant**

Add near the top of the file:

```tsx
const CHART_COLORS = ['#5B8DEF', '#4A90D9', '#FFC23C', '#F58BB0', '#9B7BD6', '#2fa37a']
const CHART_AXIS = '#8a93b0'
const CHART_GRID = 'rgba(27,42,107,0.08)'
```

Replace series color arrays / individual `stroke`/`fill` hexes with `CHART_COLORS[i]` (or specific entries), axis tick `stroke`/`fill` with `CHART_AXIS`, and grid stroke with `CHART_GRID`. Any text fills that were light (`#f8f8f2`, `#fff`, `var(--text-primary)` used on charts) become `#1b2a6b` (navy) or `CHART_AXIS` for secondary.

- [ ] **Step 3: Build + visual check across data sub-pages**

Run: `npm run build` then visit each: `/global-launch-intelligence/dashboard`, `launch-velocity`, `agency-dominance`, `orbital-intelligence`, `mission-classification`, `astronaut-activity`, `station-traffic`, `geopolitical-map`.
Expected on every page: charts legible on cream (no invisible light-on-light text, no muddy gold series), tables clean (`.intel-th`/`.intel-td` light), gauges cornflower, alerts pastel. No console errors.

- [ ] **Step 4: Commit**

```bash
git add components/intelligence/IntelComponents.tsx
git commit -m "Recolor intel charts/series for light theme (clean, legible data)"
```

### Task D3: Aurora + ISS trackers

**Files:**
- Modify: `app/aurora-tracker/page.tsx`, `app/iss-tracker/page.tsx`, `components/AuroraMap.tsx`, `components/IssMap.tsx`

- [ ] **Step 1: Map tiles + markers**

Read `components/AuroraMap.tsx` and `components/IssMap.tsx`. If they use a dark Leaflet tile layer (e.g. CartoDB `dark_all`, or a dark `url` template), switch to a light/voyager tile to match the cream theme:

```tsx
// light basemap
<TileLayer
  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
  attribution='&copy; OpenStreetMap &copy; CARTO'
/>
```

Marker styling is already handled by `.iss-marker` / `.iss-map-overlay` in CSS (re-themed). For aurora overlays/heat colors, keep them but ensure opacity reads on a light map (cornflower→purple→pink ramp is fine).

- [ ] **Step 2: Page chrome**

On both tracker pages, map inline dark utilities (C3 table) and add a Caveat kicker:
- Aurora: `<span className="page-eyebrow">chasing the northern lights 🌌</span>`
- ISS: `<span className="page-eyebrow">where's the station right now? 🛰️</span>`

Wire `LoadingState` (already friendly) for the loading case and `EmptyState` (`expression="wave"`) for any error/no-data case.

- [ ] **Step 3: Build + visual check**

Run: `npm run build` then view `/aurora-tracker` and `/iss-tracker`.
Expected: light map tiles, gold ISS marker visible, cream control panels, friendly kickers; map fills its shell with rounded corners; no dark leftovers; leaflet zoom/attribution legible. Clean build.

- [ ] **Step 4: Commit**

```bash
git add app/aurora-tracker/page.tsx app/iss-tracker/page.tsx components/AuroraMap.tsx components/IssMap.tsx
git commit -m "Brighten Aurora + ISS trackers: light map tiles, cream chrome, friendly kickers"
```

---

## Phase E — Final Verification Sweep

### Task E1: Full-site visual + build QA

**Files:** none (verification only; fix-forward as needed)

- [ ] **Step 1: Clean production build**

Run: `npm run build`
Expected: success, zero TypeScript errors, zero new warnings.

- [ ] **Step 2: Grep for leftover dark theme references**

Run from `frontend/`: `grep -rn "space-void\|space-deep\|space-mid\|space-elevated\|text-primary\|accent-glow\|starfield\|nebula\|Space Grotesk" app components`
Expected: only intentional legacy CSS aliases in `globals.css` (the `--space-void`/`--text-primary` alias block). Any component/page hits → fix using the C3 mapping table, rebuild, recommit.

- [ ] **Step 3: Route-by-route visual pass**

Run `npm run dev`. Visit every route at desktop (≥1280px) and mobile (390px):
`/projects`, a `/project/[id]`, `/feed`, `/space-news`, `/space-blogs`, `/global-launch-intelligence/dashboard` + 7 subs, `/aurora-tracker`, `/iss-tracker`.
Checklist per route: cream background; Fredoka headings; no dark patches; readable contrast; nav active state correct; no console errors; mascot/doodles present only in chrome (never overlapping charts/maps/tables).

- [ ] **Step 4: Accessibility checks**

- Toggle OS "reduce motion" → confirm mascot bob, sky float, gauge fill, image zoom all stop.
- Spot-check contrast: navy-on-cream, cornflower links, pastel badge text (`trl-low/mid/high`, alerts) meet WCAG AA for their text size. Darken any that fail (use `--gold-deep`, `--corn-dim`, `#c44d77`, etc.).

- [ ] **Step 5: Commit any fixes**

```bash
git add -A
git commit -m "Final redesign QA: fix leftover dark refs and contrast"
```

### Task E2: Branch wrap-up

- [ ] **Step 1:** Use the `superpowers:finishing-a-development-branch` skill to choose merge/PR and finalize.

---

## Self-Review (completed by plan author)

- **Spec coverage:** Palette/type/devices → A1, A2, A3, B1, B2. Components (Mascot, Doodle, Button, Chip, TopNav, Footer, LoadingState, SearchBar/Filters, Pagination) → B1–B5, A2 (footer). Note: `SearchBar`/`Filters`/`Pagination` carry no hard-coded dark hexes (they use `.space-input`/`.filter-*`/`.space-btn` classes re-themed in A3), so they need no dedicated task — verified in C1/E1. Pages (Projects, detail, Feed, News, Blogs, Command Center + 7 subs, Aurora, ISS) → C1–C5, D1–D3. Data-page rule → D1/D2/D3. Error/empty/loading → B4 + wired in C1/C4/C5/D3. Accessibility/reduced-motion → A3 media query + E1 Step 4. Verification → E1.
- **Placeholder scan:** No "TBD/TODO". Page tasks that say "read the file first" still give the exact change (imports, exact markup blocks, the C3 mapping table). The only deliberately open step is D2/D3 where exact hex locations depend on file contents — each gives the concrete replacement constants and rule, which is the actionable instruction.
- **Type consistency:** `Mascot` props (`size`, `expression: 'read'|'wave'|'sleep'`, `bob`, `aria-hidden`) consistent across layout/TopNav/LoadingState/EmptyState/ProjectsExplorer. `Doodle` names (`star|sparkle|orbit|underline|shooting-star|planet`) consistent across SkyBackdrop/ProjectsExplorer/project-detail. CSS class names match the existing component usages (verified against current `globals.css` and components).
- **Build model:** Note that A2/A3 commit before a green build; the first full `npm run build` gate is B2 Step 4 (after `Mascot`/`SkyBackdrop` exist). This is called out explicitly in A2/A3 so an executor doesn't panic at an intermediate red build.
