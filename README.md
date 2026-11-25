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

- A slide topic has `slides/<section>/*.jsx` and a `topic.js` manifest with metadata, sections, and the ordered slide components.
- An article topic has one `article.md` and a `topic.js` manifest with its metadata.
- Editorial outlines, drafts, and handoffs belong under that topic's `editorial/` folder. The app does not import those files.
- Topic-only media and helper components stay with their topic. Shared UI components live under `src/shared/components/<Component>/` with their styles.
- Global tokens and base rules live in `src/styles/`; `src/styles.css` imports them. Component CSS is colocated with the component.

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
