# Decisions

Everything I chose without asking, and why. Anything marked **⚠ Worth a look** is a call you may want to reverse.

---

## Stack

**Vite + React 19, no framework on top.** You asked for React and a static site. Next.js would add a routing convention, a build server and a config surface none of this needs — the site is two views over two content files. Vite gives a sub-second dev server, a plain `dist/` folder at the end, and a `vite.config.js` short enough to read in one sitting.

**Hash routing (`#/deck/17`) rather than history routing.** Hash URLs work when you open `dist/index.html` straight off disk or drop the folder on any static host, with no server rewrite rules. The cost is uglier URLs. For something you'll preview locally and possibly hand to someone as a zip, that trade is worth it.

**Dependencies kept to five:** `react`, `react-dom`, `react-router-dom`, `react-markdown`, `remark-gfm`. No UI kit, no CSS framework, no state library. The styling is one hand-written `styles.css`.

**Fonts are self-hosted via `@fontsource-variable/*` rather than a Google Fonts `<link>`.** The site works offline and on a plane, and there's no third-party request on load. Adds ~230 kB of woff2 to the build, which is irrelevant for local preview.

---

## Port

Resolution order, highest priority first:

1. `PORT` in the shell — `PORT=4000 npm run dev`
2. `PORT` in `.env` — currently `3002`
3. Hard-coded `3002` fallback

`vite.config.js` reads `process.env.PORT` explicitly before falling back to `loadEnv`, so a shell override works regardless of Vite's env-prefix rules. The same port serves both `npm run dev` and `npm run preview`.

`strictPort: false` — if 3002 is busy, Vite takes the next free port rather than refusing to start. Change to `true` if you'd rather it fail loudly.

`host: true` — binds on your LAN too, so you can pull the deck up on a phone or tablet to check it. **⚠ Worth a look** if you're ever on untrusted wifi.

`.env` is committed and `.env.example` duplicates it. There are no secrets here, and a port you have to guess at is worse than a port in version control.

---

## Content architecture

**Everything is markdown in `content/`.** Slides were originally a JS object — `src/content/slides.js` — on the argument that structured data lets the site do things a text blob can't. That was reversed on 1 August. The object was carrying its own weight only because of the depth badges and pause markers, and once those were removed the remaining structure was expressible in ordinary markdown: headings, lists, GFM tables, blockquotes. `slides.js` is now a ~140-line parser rather than 500 lines of content.

What that buys: the deck is editable by anyone, diffs are readable, and the file renders sensibly on GitHub without the site running. What it costs: three fenced directives (`:::map`, `:::asset`, `:::compare`) for the cases markdown has no vocabulary for, and a parser that has to be kept in step with the grammar comment at the top of `slides.md`. The grammar is deliberately small so that stays cheap.

The conversion was verified by round-tripping — parsing `slides.md` and deep-equalling the result against the original object, across all 29 slides, both exports and the appendix. It came out identical.

**Articles are markdown too (`content/articles-outline.md`), rendered with `react-markdown`.** The table of contents is generated from `#` headings at runtime, so adding a part to the markdown adds it to the sidebar with no code change.

**No content lives under `src/`.** The components import from `content/` directly, so the canonical document and the rendered page are the same file. There's nothing to keep in sync.

---

## Design direction

The brief left the visual axis free, so I picked from the talk's own material rather than reaching for a default.

**Signature: the layer rail.** The talk's spine is a six-layer map where each layer is one more thing you hand over. The rail is that diagram, rotated vertical and made navigational — each section is a bar whose fill tracks your position, and completed layers stay lit. It encodes something true (where you are in the ladder) rather than decorating the edge of the screen. It's also the only bold element; everything else is deliberately quiet.

**Palette is semantic, not decorative.**

| Token | Hex | Job |
|---|---|---|
| Ink | `#14161C` | Base — a cool near-black, not pure black |
| Paper | `#F7F6F3` | The slide surface, so slides read as objects on a desk |
| Violet | `#6B5BF5` | Structure and position: rail fill, bullets, pull-quote rules |
| Amber | `#E0A33C` | Reserved. Was the engineers-only depth marker. |
| Rose | `#E0607A` | Warnings — currently only the blocked research row in the appendix |

Amber and rose were the grid's dot markers until the depth badges, pause points and authoring flags came out on 1 August. Both tokens are still defined; amber is now unused. If you reintroduce a per-slide marker of any kind, use amber before adding a colour.

I deliberately avoided the three looks AI-generated design defaults to right now: warm cream with a terracotta accent, near-black with acid green, and broadsheet hairline columns. **⚠ Worth a look** — the violet is the most opinionated choice here and the easiest thing to change: it's one custom property, `--violet`, in `styles.css`.

**Type: three faces, three jobs.** Bricolage Grotesque for display and slide copy (variable, a bit characterful, doesn't read as system-default), Newsreader for article prose (a serif at reading size makes the articles feel like a different medium from the deck, which they are), JetBrains Mono for kickers, badges, slide numbers and the map. The mono is doing structural work — it marks everything that's navigation or metadata rather than content.

**Slides render at a true 16:9 with container queries**, so type scales with the surface rather than the viewport. What you see is proportionally what a projector shows. Below 900px the aspect ratio is dropped and slides go to natural height, because a locked 16:9 on a phone is unreadable.

**Motion is one 320ms rise-and-fade on slide change, and the rail fill animating.** Nothing else. `prefers-reduced-motion` kills both.

---

## Deck behaviour

- **Keyboard first** — `←` `→` to move, `N` for notes, `G` for the grid, `Esc` to leave it, `Home`/`End` for the ends.
- **Notes are on by default.** This is a preview tool for you, not a presentation surface for an audience. Press `N` if you want to see slides clean.
- **One notes pane, not two.** It used to be split into "Say" (what you elaborate live) and "Notes" (what ships with the published deck). Say was removed on 1 August; only the published notes remain.
- **The grid view is unmarked.** It carried three coloured dots — engineers-only, unresolved authoring note, planned pause — all removed on 1 August. The grid is now purely navigational.
- **The appendix table sits under the grid**, since it's reference material rather than something you page through. The blocked research item renders in rose.

---

## Things I did not build

- **No presenter mode with a timer or dual-screen output.** You asked for a preview, and presenting will almost certainly happen from Keynote, Google Slides or PowerPoint. This site is for reading and revising, not for standing in front of a room.
- **No PDF or PPTX export.** Meaningful work, and the deck copy in `deck-copy.md` is what you'd paste into real slide software anyway. Say the word if you want it.
- **No editing UI.** The content files are plain enough to edit directly, and an editor would need persistence I can't give you in a static site.
- **No search.** At 29 slides and one article document, `Cmd-F` is better than anything I'd build.

---

## Known gaps

- **Four slides show placeholder assets** — the failure screenshot (S1), the before/after prompt pair (S12), and the six versions of the running example (S28). They render as dashed boxes so they're visible as gaps rather than quietly missing.
- **The article content is still an outline, not drafted prose.** The reader renders it correctly, but what it's rendering is a plan.
- **`Fine-tuning vs context engineering` is flagged as blocked on research** in the appendix table, carried through from the outline.
- **The JS bundle is 441 kB raw / 142 kB gzipped**, most of it `react-markdown`'s parser. Irrelevant on localhost. If this ever ships publicly, lazy-loading the articles route would halve the initial load.
