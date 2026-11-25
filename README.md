## Run it

```bash
npm install
npm run dev
```

## Change the port

Edit `PORT` in `.env`, or override per-run:

```bash
PORT=4000 npm run dev
```

## Scripts

| Command           | Does                                     |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Dev server with hot reload               |
| `npm run build`   | Static build into `dist/`                |
| `npm run preview` | Serve the built `dist/` on the same port |

## Content and topics

Each gallery card is one topic under `src/content/topics/<topic-slug>/`.

```text
src/
├── main.jsx                     # browser entry point
├── app/                         # app shell and route pages
├── content/topics/
│   ├── index.js                 # gallery topic registry
│   └── <topic-slug>/            # one gallery entry
│       ├── editorial/           # drafts, outlines, and handoffs
│       ├── topic.js              # metadata and ordered content
│       ├── article.md            # article topic only
│       ├── slides/<section>/     # slide topic only; one JSX component per slide
│       ├── components/           # optional topic-only helpers
│       ├── assets/               # optional topic-only media
│       └── styles.css            # optional topic-wide styles
├── shared/components/<Component>/
│   ├── <Component>.jsx
│   └── <Component>.css
├── styles/                       # shared tokens and base rules
└── styles.css                    # imports shared styles
```

The app imports topic manifests and presented content. Editorial outlines, drafts, and handoffs stay in each topic's `editorial/` folder and are not imported.
Topic-only media and helper components stay with their topic. Shared UI components live in `src/shared/components/<Component>/` with their styles.
Component CSS is colocated with its component. Global tokens and base rules live in `src/styles/`; `src/styles.css` imports them.

Read [CONVENTION.md](CONVENTION.md) before adding a topic, slide, or shared component.

## Deck keyboard shortcuts

| Key          | Does                       |
| ------------ | -------------------------- |
| `←` `→`      | Previous / next slide      |
| `N`          | Toggle the notes panel     |
| `G`          | Toggle the all-slides grid |
| `Esc`        | Leave the grid             |
| `Home` `End` | First / last slide         |

Slides are addressable: `#/slides/<topic-slug>/17` opens a specific slide directly.
