# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
nvm use 20.19        # required — Vite 8 needs Node ≥ 20.19; system default is older
npm install
npm run dev          # dev server → http://localhost:3002
npm run build        # static build → dist/ (also runs as pre-commit hook)
npm run preview      # serve dist/ on same port
npm run prepare      # activate .githooks/pre-commit (run once after fresh clone)
```

Port: `PORT` env var → `.env` `PORT` → `3002` fallback. No tests, no linter.

**Pre-commit hook** runs `npm run build`. Always `nvm use 20.19` before committing.

## Architecture

Three-layer app: a **Topics Gallery** (`/slides`) → a **Deck** (`/slides/:slug/:n`) → individual **Slides**. `App.jsx` wires routing; `src/content/topics/index.js` is the single registry that drives both the gallery and route matching.

### Data flow

```
App.jsx
  /slides              → TopicsGallery          (reads TOPICS registry)
  /slides/:slug/:n     → <TopicName>Deck         (reveal.js + layer bar)
                            └── <Slide meta={...}>   (shared chrome wrapper)
                                  └── <SlideComp />  (body JSX only)
```

### Path alias

`@shared` resolves to `src/shared/`. Use it for shared component imports:
```js
import Slide from '@shared/components/Slide.jsx'
```

### Conventions

Full conventions (naming, slide anatomy, color rules, how to add a topic) are in **`CONVENTION.md`** at the repo root. Read it before creating or editing slides or topics.

Key rules at a glance:
- Each slide exports a default component + `.meta` static prop (title, section, sectionLabel, notes, optionally kind/subtitle). No slide number in meta — position in `SLIDES` array is the number.
- Slide body JSX uses existing CSS classes only (`.bullets`, `.pull`, `.sheet`, `.compare`, `.map`, `.asset`). No new hex values — CSS custom properties from `:root` in `src/styles.css` only.
- The topic registry (`<TopicName>Slide.jsx`) owns `SECTIONS` and the ordered `SLIDES` array. Adding a slide = one import + one array entry.
- The topic deck (`<TopicName>Deck.jsx`) owns reveal.js, navigation, and `.meta.slug` (used in URLs and gallery cards).

### Styling

One hand-written `src/styles.css`. No CSS framework. Dark background (`--ink`), light slide surface (`--paper`), `--violet` for structure/active state. `--amber` is reserved (reach for it before adding any new colour). `--rose` for warnings only.

Three fonts: Bricolage Grotesque (`--display`), Newsreader (`--body`), JetBrains Mono (`--mono`).

### Commit workflow

Always commit after completing work. Only push when the user explicitly asks.
