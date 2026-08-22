---
doc_type: implementation_plan
slug: blog-slide-refactor
title: Slide Architecture Refactor
status: draft
version: 0.1
created: 2026-08-22
updated: 2026-08-22
upstream:
  - brainstorming session (in-conversation, 2026-08-22)
compression: >
  Shared Slide shell first, then migrate 30 slides to JSX, then wire topic Deck + Gallery,
  then update routing, then delete old parser.
---

# Implementation Plan: Slide Architecture Refactor

> **Compression (critical path):** Shared `Slide.jsx` shell → migrate 30 slides to JSX → topic `Deck` + `Gallery` → routing → delete old parser.

## Context

No upstream PRD or TECH_SPEC exists. Design was settled in a brainstorming session on 2026-08-22.
Decisions are recorded in this file and in `CONVENTION.md` (to be written as TASK-007).

**Core constraint:** content does not change — only structure. Slide text, notes, and section
groupings are migrated verbatim.

## 1. Component map (treated as spec IDs)

| ID | Component / artefact | Location |
|---|---|---|
| CMP-001 | `Slide` — generic chrome wrapper | `src/shared/components/Slide.jsx` |
| CMP-002 | `Article` — reserved shell | `src/shared/components/Article.jsx` |
| CMP-003 | 30 individual slide files | `src/content/topics/IntroductionToAgenticWorkflows/slides/*Slide.jsx` |
| CMP-004 | `IntroductionToAgenticWorkflowsSlide` — topic registry + layout | `src/content/topics/IntroductionToAgenticWorkflows/IntroductionToAgenticWorkflowsSlide.jsx` |
| CMP-005 | `IntroductionToAgenticWorkflowsDeck` — mountable deck | `src/content/topics/IntroductionToAgenticWorkflows/IntroductionToAgenticWorkflowsDeck.jsx` |
| CMP-006 | `topics/index.js` — global topic registry | `src/content/topics/index.js` |
| CMP-007 | `TopicsGallery` — gallery page | `src/shared/components/TopicsGallery.jsx` |
| CMP-008 | Router update | `src/App.jsx` |
| CMP-009 | `CONVENTION.md` | repo root |
| CMP-010 | Delete old artefacts | `content/slides.md`, `src/content/slides.js`, `src/components/Surface.jsx`, `src/components/Deck.jsx` |

## 2. Milestones

| ID | Milestone | Definition of done | Tasks |
|---|---|---|---|
| MS-001 | Shell ready | `Slide.jsx` renders chrome; dev server starts clean | TASK-001 |
| MS-002 | Content migrated | All 30 slides render in the new system; content visually identical to current | TASK-002, TASK-003 |
| MS-003 | Navigation live | Gallery shows topic card; clicking enters deck; layer bar works | TASK-004, TASK-005, TASK-006 |
| MS-004 | Cleanup + convention | Old files deleted; `CONVENTION.md` written and committed | TASK-007, TASK-008 |

## 3. Tasks

| ID | Task | implements | depends_on | owner | est. | risk | Definition of done |
|---|---|---|---|---|---|---|---|
| TASK-001 | Scaffold new folder structure + build `Slide.jsx` shared chrome (kicker, title, subtitle, body slot, notes) | CMP-001, CMP-002 | — | Jaydon | 0.5d | high | `Slide.jsx` accepts `meta` prop and a `children` body; renders identically to current `Surface.jsx`; storybook/dev preview confirms layout |
| TASK-002 | Migrate all 30 slides from `slides.md` to individual JSX files with `.meta` static prop | CMP-003 | TASK-001 | Jaydon | 2d | med | All 30 `*Slide.jsx` files exist under `slides/`; each has `.meta` with `{ title, subtitle?, section, notes }`; body content matches current rendered output |
| TASK-003 | Build `IntroductionToAgenticWorkflowsSlide.jsx` — ordered slide array + section metadata | CMP-004 | TASK-002 | Jaydon | 0.5d | low | File exports `SLIDES` array (ordered) and `SECTIONS` array; arrays match current `slides.js` output |
| TASK-004 | Build `IntroductionToAgenticWorkflowsDeck.jsx` — reveal.js wrapper + layer bar; attach `.meta` | CMP-005 | TASK-003 | Jaydon | 1d | med | Deck mounts, keyboard nav works (`← →`, `Esc`, `F`, `S`), layer bar tracks progress, URL updates on slide change; `.meta` has `{ title, slug, description }` |
| TASK-005 | Build `TopicsGallery.jsx` + `topics/index.js` topic registry | CMP-006, CMP-007 | TASK-004 | Jaydon | 0.5d | low | Gallery renders one card per topic; card shows title + description; clicking routes to `/slides/:slug` |
| TASK-006 | Update `App.jsx` routing: `/slides` → Gallery, `/slides/:slug` → matched Deck | CMP-008 | TASK-005 | Jaydon | 0.5d | low | Both routes work; old `/deck` route redirects to `/slides`; 404 falls back to gallery |
| TASK-007 | Write `CONVENTION.md` — file naming, folder layout, meta shape, color rules | CMP-009 | TASK-006 | Jaydon | 0.5d | low | `CONVENTION.md` exists at repo root; covers all conventions listed in §Design conventions below; `CLAUDE.md` references it |
| TASK-008 | Delete old artefacts: `content/slides.md`, `src/content/slides.js`, `src/components/Surface.jsx`, `src/components/Deck.jsx` | CMP-010 | TASK-006 | Jaydon | 0.25d | low | Files deleted; `git status` clean; dev server starts with no import errors |

**Risk note:** TASK-001 (Slide.jsx shell) and TASK-004 (Deck/reveal.js integration) are the
highest-risk tasks. Both are scheduled before content migration and routing so infeasibility
surfaces early. TASK-002 is high-effort but low-risk: mechanical translation.

## 4. Dependency graph

```
TASK-001 ──> TASK-002 ──> TASK-003 ──> TASK-004 ──> TASK-005 ──> TASK-006 ──┬──> TASK-007
                                                                              └──> TASK-008
```

All tasks are sequential. No parallelism — solo developer, and each task's output is the
next task's input.

## 5. Design conventions (input for CONVENTION.md)

### Folder layout

```
src/
├── content/
│   └── topics/
│       ├── index.js                          ← global topic registry
│       └── <TopicName>/                      ← PascalCase
│           ├── slides/
│           │   └── <CamelCaseTitle>Slide.jsx
│           ├── articles/                     ← reserved
│           ├── <TopicName>Slide.jsx          ← topic registry + layout
│           └── <TopicName>Deck.jsx           ← mountable deck
└── shared/
    └── components/
        ├── Slide.jsx
        └── Article.jsx                       ← reserved
```

### Individual slide file anatomy

```jsx
function <CamelCaseTitle>Slide() {
  return <>{/* body content only — no chrome */}</>
}

<CamelCaseTitle>Slide.meta = {
  title: 'Human-readable title',
  subtitle: 'Optional',          // omit if none
  section: 'section-id',        // matches SECTIONS array in topic registry
  notes: 'Published notes text', // omit if none
}

export default <CamelCaseTitle>Slide
```

### Deck meta (for gallery card)

```js
<TopicName>Deck.meta = {
  title: 'Full topic title',
  slug: 'kebab-case-slug',       // used in URL: /slides/:slug
  description: 'One sentence.',
}
```

### Color rule

Use only existing CSS custom properties from `:root` in `src/styles.css`. Never add a new hex
value. Reach for `--amber` before adding any new colour.

### File naming

- Topic folders: `PascalCase` (`IntroductionToAgenticWorkflows`)
- Slide files: `<CamelCaseTitle>Slide.jsx`
- Deck files: `<TopicName>Deck.jsx`
- Topic registry: `<TopicName>Slide.jsx`

## 6. Rollout mechanics

This is a local static site with no staging, feature flags, or user traffic. Rollout is:

1. Work on `main` (solo project, no review branch needed unless desired).
2. Verify dev server renders all 30 slides correctly after TASK-002.
3. Verify full navigation after TASK-006 before running TASK-008 (deletion is irreversible).
4. **Rollback:** `git revert` or `git checkout` — all deleted files remain in git history.

## 7. Estimates & assumptions

- **Total estimate:** ~5.75 days.
- **Assumptions:**
  - Solo developer (Jaydon), full-time on this refactor.
  - TASK-002 (30 slide migrations) is mechanical but time-consuming; estimate assumes
    ~45 min per slide including QA against the current render.
  - reveal.js API is unchanged from the current `Deck.jsx` — no upgrade needed.
  - No design changes: styling is a port of existing CSS classes, not a redesign.

## Upstream change requests

None. All decisions settled in brainstorming session 2026-08-22.

## Handoff to next step

- **Next step:** issue / ticket breakdown (`to-issue` skill).
- **How to break down:** one ticket per `TASK-*`, carrying `depends_on`, owner, estimate, and
  definition of done verbatim.
- **Order tickets by:** the linear dependency graph in §4.
- **Blocked items:** none.
