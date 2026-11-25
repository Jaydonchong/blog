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

The app has a **Topics Gallery** (`/slides`), slide decks (`/slides/:slug/:n`), and Markdown articles (`/articles/:slug`). `src/app/App.jsx` wires routing; `src/content/topics/index.js` is the single registry for all gallery entries.

### Data flow

```
src/app/App.jsx
  /slides              → TopicsGallery          (reads topic manifests)
  /slides/:slug/:n     → SlideTopicPage         (reads a slide topic manifest)
                            └── SlideDeck        (shared controls and navigation)
                                  └── Slide       (shared chrome wrapper)
                                        └── <SlideComp /> (body JSX only)
  /articles/:slug      → ArticleTopicPage       (reads an article topic manifest)
                            └── MarkdownArticles
```

### Path alias

`@shared` resolves to `src/shared/`. Use it for shared component imports:

```js
import Slide from '@shared/components/Slide/Slide.jsx'
```

Shared components are grouped as `@shared/components/<Component>/<Component>.jsx`.

### Conventions

Full conventions (naming, slide anatomy, color rules, and how to add a topic) are in `CONVENTION.md` at the repository root. Read it before creating or editing slides or topics.

Key rules:
- Each slide exports a default component and a `.meta` static prop (title, section, sectionLabel, notes, optionally kind/subtitle). Do not include slide numbers in meta; position in the topic manifest's `slides` array determines the number.
- Slide body JSX uses existing CSS classes only (`.bullets`, `.pull`, `.sheet`, `.compare`, `.map`, `.asset`). Do not add hex values; use CSS custom properties from `:root` in `src/styles/tokens.css`.
- Each gallery entry is one topic with `kind: 'slides'` or `kind: 'article'` in `topic.js`.
- Slide topics own `slides/<section>/*.jsx`; `topic.js` owns metadata, sections, and slide order. Article topics own one `article.md` plus metadata in `topic.js`.
- Editorial sources belong in that topic's `editorial/` folder and are not imported by the app.
- Topic-only components and media belong in that topic folder. Shared components live in `src/shared/components/<Component>/`.

### Styling

There is no CSS framework. `src/styles.css` imports the shared tokens and base rules from `src/styles/`; component and topic styles live beside their owners. The site uses a dark background (`--ink`), light slide surface (`--paper`), and `--violet` for structure and active state. `--amber` is reserved; use it before adding a new color. `--rose` is for warnings only.

The three fonts are Bricolage Grotesque (`--display`), Newsreader (`--body`), and JetBrains Mono (`--mono`).

## Commit workflow

Commit after completing work. Push only when explicitly requested.
