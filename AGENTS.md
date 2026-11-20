# Repository guidance

This file provides guidance to agents working in this repository.

## Commands

```bash
nvm use 20.19        # required — Vite 8 needs Node ≥ 20.19; system default may be older
npm install
npm run dev          # development server → http://localhost:3002
npm run build        # static build → dist/ (also runs as pre-commit hook)
npm run preview      # serve dist/ on the same port
npm run prepare      # activate .githooks/pre-commit (run once after a fresh clone)
```

Port: `PORT` environment variable → `.env` `PORT` → `3002` fallback. No tests or linter are configured.

The pre-commit hook runs `npm run build`. Use Node 20.19 before committing.

## Architecture

Three-layer app: a **Topics Gallery** (`/slides`) → a **Deck** (`/slides/:slug/:n`) → individual **Slides**. `App.jsx` wires routing; `src/content/topics/index.js` is the single registry that drives both the gallery and route matching.

### Data flow

```
App.jsx
  /slides              → TopicsGallery          (reads TOPICS registry)
  /slides/:slug/:n     → <TopicName>Deck         (React slide deck + layer bar)
                            └── <Slide meta={...}>   (shared chrome wrapper)
                                  └── <SlideComp />  (body JSX only)
```

### Path alias

`@shared` resolves to `src/shared/`. Use it for shared component imports:

```js
import Slide from '@shared/components/Slide.jsx'
```

### Conventions

Full conventions (naming, slide anatomy, color rules, and how to add a topic) are in `CONVENTION.md` at the repository root. Read it before creating or editing slides or topics.

Key rules:
- Each slide exports a default component and a `.meta` static prop (title, section, sectionLabel, notes, optionally kind/subtitle). Do not include slide numbers in meta; position in the `SLIDES` array determines the number.
- Slide body JSX uses existing CSS classes only (`.bullets`, `.pull`, `.sheet`, `.compare`, `.map`, `.asset`). Do not add hex values; use CSS custom properties from `:root` in `src/styles.css`.
- The topic registry (`<TopicName>Slide.jsx`) owns `SECTIONS` and the ordered `SLIDES` array. Adding a slide requires one import and one array entry.
- The topic deck (`<TopicName>Deck.jsx`) owns React deck navigation and `.meta.slug` (used in URLs and gallery cards).

### Styling

There is one hand-written stylesheet, `src/styles.css`, and no CSS framework. The site uses a dark background (`--ink`), light slide surface (`--paper`), and `--violet` for structure and active state. `--amber` is reserved; use it before adding a new color. `--rose` is for warnings only.

The three fonts are Bricolage Grotesque (`--display`), Newsreader (`--body`), and JetBrains Mono (`--mono`).

## Commit workflow

Commit after completing work. Push only when explicitly requested.
