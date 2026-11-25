# CONVENTION.md

Project-wide conventions for structure, naming, and style. Referenced by CLAUDE.md.

---

## Folder structure

```
src/
├── content/
│   └── topics/
│       ├── index.js                              ← gallery topic registry
│       └── <topic-slug>/                         ← one gallery entry per topic
│           ├── editorial/                        ← drafts, outlines, handoffs; not imported by the app
│           ├── topic.js                           ← metadata and content manifest
│           ├── article.md                         ← article topic only
│           ├── components/                        ← optional topic-specific render helpers
│           ├── slides/
│           │   └── <section-id>/                 ← matches topic.js section id (e.g. intro, llm, prompt)
│           │       └── <CamelCaseTitle>Slide.jsx ← individual slide (body only)
│           ├── assets/                            ← optional topic-only media
│           └── styles.css                         ← optional topic-wide styles
└── shared/
    └── components/
        └── <Component>/
            ├── <Component>.jsx
            └── <Component>.css                   ← only when the component needs styles

src/app/                                            ← router, app shell, route pages
src/styles/                                         ← global tokens and base rules
src/styles.css                                      ← imports global styles
assets/site/                                        ← final website-wide assets only
design/drafts/                                      ← unpublished visual drafts; not imported by the app
```

---

## Naming

| Artefact | Convention | Example |
|---|---|---|
| Topic folder | kebab-case | `introduction-to-agentic-workflows` |
| Individual slide file | `<CamelCaseTitle>Slide.jsx` | `TheAgenticLoopSlide.jsx` |
| Topic manifest file | `topic.js` | `topic.js` |
| Slide component name | `<CamelCaseTitle>Slide` (matches filename) | `TheAgenticLoopSlide` |

---

## Individual slide anatomy

Each slide file has one default export. `meta` is attached as a static property on the function.

```jsx
function <CamelCaseTitle>Slide() {
  return (
    <>{/* body content only — no chrome, no title, no notes */}</>
  )
}

<CamelCaseTitle>Slide.meta = {
  kind: 'title',           // only on the one title slide; omit for all others
  title: 'Human-readable title',
  subtitle: 'Optional subtitle',     // omit if none
  section: 'section-id',            // must match an id in topic.js sections
  sectionLabel: 'Section Label',    // human-readable, used for the kicker
  notes: 'Published notes text.',   // omit if none
}

export default <CamelCaseTitle>Slide
```

**Rules:**
- Body JSX uses existing CSS classes only (`.bullets`, `.pull`, `.sheet`, `.compare`, `.map`, `.asset`).
- No new hex values — use custom properties from `:root` in `src/styles/tokens.css`.
- No chrome (title, kicker, notes) inside the slide body — `Slide.jsx` renders those.

---

## Topic manifest (`topic.js`)

Each gallery entry is one topic with `kind` set to `slides` or `article`.
A slide topic imports its components and records the section list and presentation order:

```js
const sections = [
  { id: 'section-id', label: 'Full Label', short: 'Short', minor: true },
]

const slides = [FirstSlide, SecondSlide]

export default {
  kind: 'slides',
  meta: { title: 'Full topic title', slug: 'topic-slug', description: 'One sentence.' },
  sections,
  slides,
}
```

Slide number is the component's position in `slides`; do not store it in slide `meta`.
Add a slide by adding its import and component to the ordered list.

An article topic has one `article.md` at the topic root and imports it in the manifest:

```js
import source from './article.md?raw'

export default {
  kind: 'article',
  meta: { title: 'Article title', slug: 'article-slug', description: 'One sentence.' },
  source,
}
```

`src/content/topics/index.js` imports every gallery topic. The generic route chooses the
slide deck or Markdown reader from `kind`. Keep drafts, outlines, and handoffs in `editorial/`;
the app must not import editorial files.

## Styles

Keep component-owned CSS beside its component. Keep topic-wide CSS in the topic folder.
Use `src/styles/tokens.css` for design tokens and `src/styles/base.css` for resets and
document-wide rules. `src/styles.css` imports those global files. Store topic-only media in
that topic's `assets/`; store final site-wide assets in `assets/site/`. Keep visual drafts
outside the app's import tree in `design/drafts/`.

---

## Color rule

Use only custom properties defined in `:root` in `src/styles/tokens.css`. Never add a bare hex value.
Reach for `--amber` (`#e0a33c`) before introducing any new colour token.

Current semantic assignments:
- `--violet` — structure, active state, accent (layer bar, bullets, pull-quote rule)
- `--rose` — warnings only
- `--amber` — reserved; unused since depth markers were removed

---

## Diagram scale

Every diagram on every slide sits on one type scale, measured in **rendered px inside
reveal's 1280x720 box**:

| Role | Size |
|---|---|
| Primary label (node name, card body, stack slot, chat message) | 16px |
| Secondary label (caption, unit, annotation) | 11px |
| Stroke | 1.5px |

For comparison: bullets are 27px, the kicker 12px.

**SVG rule: never `width="100%"`.** A percentage width makes rendered type size a
function of the column width, so the same `fontSize: 12` came out at 17px on one slide
and 24px on the next. Instead:

1. Pick the rendered width the diagram should occupy and set explicit `width` /
   `height` attributes on `<svg>` (viewBox stays whatever the drawing uses).
2. Derive `k = renderedWidth / viewBoxWidth`.
3. Write font sizes and stroke widths as `target / k` — e.g. at `k = 1.4`, a primary
   label is `fontSize: 11.5` and a stroke is `strokeWidth="1.1"`.

Helper classes:
- `.diag-figure` — flex box that takes the vertical slack on a graphic-above-bullets
  slide and centres the graphic in it. Add `--left` to left-align instead.
- `.diag-svg` — `display: block`, no flex grow, horizontally centred.
- `.diag-column` — stacked tiers sharing left and right edges (`alignSelf: 'stretch'`
  on each tier).
- `.dn__sub` — the 11px secondary label inside a `.dn` node.

Slide-level type sizes live in CSS, not inline. Inline `style` on a diagram is for
geometry (width, gap, grid template), not for font size.

---

## Adding a new topic

1. Create `src/content/topics/<topic-slug>/`.
2. Put outlines, drafts, and handoffs in `editorial/`.
3. For a slide topic, add `slides/<section>/*.jsx` and list the components in `topic.js`.
4. For an article topic, add one `article.md` and import it in `topic.js`.
5. Add the manifest to `src/content/topics/index.js`.
6. The gallery and generic route pick it up automatically.
