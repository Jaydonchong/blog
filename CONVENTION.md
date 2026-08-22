# CONVENTION.md

Project-wide conventions for structure, naming, and style. Referenced by CLAUDE.md.

---

## Folder structure

```
src/
├── content/
│   └── topics/
│       ├── index.js                              ← global topic registry (barrel export)
│       └── <TopicName>/                          ← PascalCase topic folder
│           ├── slides/
│           │   └── <section-id>/                 ← matches SECTIONS id (e.g. intro, llm, prompt)
│           │       └── <CamelCaseTitle>Slide.jsx ← individual slide (body only)
│           ├── articles/                         ← reserved; not built yet
│           ├── <TopicName>Slide.jsx              ← topic registry: SLIDES + SECTIONS arrays
│           └── <TopicName>Deck.jsx               ← mountable deck component
└── shared/
    └── components/
        ├── Slide.jsx                             ← generic chrome wrapper (all topics share this)
        └── Article.jsx                           ← reserved; not built yet
```

---

## Naming

| Artefact | Convention | Example |
|---|---|---|
| Topic folder | PascalCase | `IntroductionToAgenticWorkflows` |
| Individual slide file | `<CamelCaseTitle>Slide.jsx` | `TheAgenticLoopSlide.jsx` |
| Topic registry file | `<TopicName>Slide.jsx` | `IntroductionToAgenticWorkflowsSlide.jsx` |
| Topic deck file | `<TopicName>Deck.jsx` | `IntroductionToAgenticWorkflowsDeck.jsx` |
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
  section: 'section-id',            // must match an id in the topic's SECTIONS array
  sectionLabel: 'Section Label',    // human-readable, used for the kicker
  notes: 'Published notes text.',   // omit if none
}

export default <CamelCaseTitle>Slide
```

**Rules:**
- Body JSX uses existing CSS classes only (`.bullets`, `.pull`, `.sheet`, `.compare`, `.map`, `.asset`).
- No new hex values — use custom properties from `:root` in `styles.css`.
- No chrome (title, kicker, notes) inside the slide body — `Slide.jsx` renders those.

---

## Topic registry (`<TopicName>Slide.jsx`)

Imports every slide in the topic and exports two arrays:

```js
export const SECTIONS = [
  { id: 'section-id', label: 'Full Label', short: 'Short', minor: true }, // minor is optional
  // ...
]

export const SLIDES = [
  FirstSlide,
  SecondSlide,
  // ...ordered array; position = slide number
]
```

- Slide number is `SLIDES.indexOf(Slide) + 1`. Do not store a number in `meta`.
- Adding a slide = add the import + add the component to the array. Nothing else changes.

---

## Topic deck (`<TopicName>Deck.jsx`)

Mounts reveal.js, owns navigation, renders `<Slide>` for each entry in `SLIDES`.

```js
<TopicName>Deck.meta = {
  title: 'Full topic title',
  slug: 'kebab-case-slug',       // used in the URL: /slides/:slug
  description: 'One sentence.',
}
```

The deck is registered in `src/content/topics/index.js`:

```js
export const TOPICS = [
  SomeDeck,
  AnotherDeck,
]
```

`App.jsx` reads `TOPICS`, matches `:slug` to `Deck.meta.slug`, and mounts the Deck.

---

## Articles (reserved)

Each topic's `articles/` folder will hold article content when built. Convention TBD then.
The `Article.jsx` shared component is a placeholder.

---

## Color rule

Use only custom properties defined in `:root` in `src/styles.css`. Never add a bare hex value.
Reach for `--amber` (`#e0a33c`) before introducing any new colour token.

Current semantic assignments:
- `--violet` — structure, active state, accent (layer bar, bullets, pull-quote rule)
- `--rose` — warnings only
- `--amber` — reserved; unused since depth markers were removed

---

## Adding a new topic

1. Create `src/content/topics/<TopicName>/` with `slides/`, `articles/`.
2. Write individual `*Slide.jsx` files in `slides/`.
3. Write `<TopicName>Slide.jsx` (registry: SECTIONS + SLIDES arrays).
4. Write `<TopicName>Deck.jsx` (deck with `.meta.slug`).
5. Add the Deck to `src/content/topics/index.js`.
6. The gallery and routing pick it up automatically.
