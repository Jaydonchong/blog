# How to use and learn AI — preview site

Slide deck and companion articles for the talk.

## Run it

```bash
npm install
npm run dev
```

Opens on **http://localhost:3002**.

## Change the port

Edit `PORT` in `.env`, or override per-run:

```bash
PORT=4000 npm run dev
```

## Scripts

| Command | Does |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Static build into `dist/` |
| `npm run preview` | Serve the built `dist/` on the same port |

## Where the content lives

Everything the site renders is markdown in `content/`. There is no content under `src/` — the components import these files directly, so the canonical document and the rendered page are always the same file.

| File | Holds |
|---|---|
| `content/slides.md` | **All 29 slides**, the appendix list, and the per-slide notes |
| `content/articles-outline.md` | The article series outline, rendered as long-form on `/articles` |
| `content/slides-outline.md` | Per-slide delivery notes. Not read by the site. |
| `content/deck-copy.md` | Literal on-slide text, for pasting into slide software. Not read by the site. |
| `content/articles/` | The written articles. Part 2 drafted; the rest pending. |
| `content/HANDOFF.md` | Project state, locked decisions, open questions. Read first. |

## Writing a slide

`content/slides.md` is ordinary markdown. A comment at the top of the file states the grammar; `src/content/slides.js` is the parser that implements it. In short:

```md
# Prompt Engineering {prompt | Prompt}     section header, groups the slides below it

## S10 · Prompt techniques                 a slide

- **Chain of thought** — reasoning before answering
- Plain bullet with no lead-in term
  - **Nested** — indent two spaces
- Emphasised bullet {strong}               {mono} for monospace

| Reliability | Consistency |              a GFM table makes it a table slide
|---|---|
| Correct | Same across runs |

> The pull-quote.

**Notes** — published with the deck, not spoken. Toggled with N.
```

Three fenced directives cover the slides plain markdown can't express: `:::map` for the six-layer diagram, `:::asset <text>` for a placeholder where an image is still missing, and `:::compare` for a two-column before/after (one `Label | body | result` line per column).

Slide kind is inferred — a table makes it a table slide, a `:::compare` block makes it a compare slide, `{title}` on the heading marks the title slide, everything else is standard. Adding a slide is adding an `## S<n> ·` heading; nothing else needs touching.

## Deck keyboard shortcuts

| Key | Does |
|---|---|
| `←` `→` | Previous / next slide |
| `N` | Toggle the notes panel |
| `G` | Toggle the all-slides grid |
| `Esc` | Leave the grid |
| `Home` `End` | First / last slide |

Slides are addressable: `#/deck/17` opens slide 17 directly.
