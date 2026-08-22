# Handoff Brief — "How to use and learn AI"

**Last updated:** 1 August 2026 (second pass — naming settled, Part 2 drafted)
**Read this first.** It orients a new session in about two minutes so you don't have to re-derive context from six files.

---

## What this project is

A ~45 minute talk plus a companion article series, both covering the same six-section ladder: what an LLM is → prompting → context → tools → harness → loops. Two audiences in one room, technical and non-technical. There is also a local React site for previewing the deck and reading the articles.

The talk is written, the deck copy is final, the site is built and runs. The article series is planned; **Part 2 is drafted**, the other five are not.

---

## Fixed constraints

These came from the author and shaped every decision. Don't quietly relax them.

| Constraint | Detail |
|---|---|
| Runtime | 45 min presented + 10 min Q&A. Hard. |
| Audience | Mixed technical / non-technical, one room. |
| Structure | Follows the author's original outline. H1s are section names, H2s are slide titles. |
| Coverage | **Every term in the original outline must appear somewhere.** Nothing gets silently dropped. |
| Demos | None. Removed by request. Static comparisons replace them. |
| Slide density | Heading plus three bullets. The presenter elaborates; the slide doesn't. |

---

## Files, and which one is current

**Layout changed 1 Aug 2026.** The repo root *is* the site now. What used to be `files/` is `content/`, and `files/site/` is gone — its contents sit at the root. Both zips were deleted.

```
/                       package.json · vite.config.js · index.html · src/ · README.md · Decisions.md
/content/               the talk itself
```

| File | Status | What it is |
|---|---|---|
| `content/slides.md` | **current — the deck** | All 29 slides, the appendix, and per-slide notes. Plain markdown; the site parses it. **Edit slides here.** |
| `content/slides-outline.md` | **current — v3** | Per-slide delivery notes and the section budgets. No longer holds slide copy. |
| `content/deck-copy.md` | **current — v2** | The literal on-slide text. Paste this into slide software. |
| `content/articles-outline.md` | **current** | Six-part series plan, section by section, with length targets. Holds the settled term registry. **The site renders this file directly.** |
| `content/articles/part-2-prompt-engineering.md` | **draft v1** | First article written. ~4,500 words against a 3,000 target. §2.5 filled with a *placeholder* pair; one `[AUTHOR]` block left. |
| `src/content/slides.js` | **current** | Not content — the ~140-line parser for `slides.md`. Only touch it if you change the markdown grammar. |

**Duplication is gone.** Both `Articles.jsx` and the slide parser import straight out of `content/`, so the canonical documents and the rendered pages are the same files. There is no copy step any more, and nothing to keep in sync.

---

## Decisions locked — don't relitigate

1. **The author's six-section structure stands.** An earlier attempt to reframe it as an "autonomy ladder" with renamed sections was rejected. Section names are the originals: *What is an LLM · Prompt Engineering · Context Engineering · Tool, MCP · Harness Engineering · Loop Engineering.*
2. **Slide titles are plain and descriptive**, taken from the original H2s. "Characteristics of an LLM," not "What you're actually talking to." Assertions moved into the bullets and pull-quotes.
3. **Three depth tiers.** `TEACH` gets an anchor and an example. `NAME` gets one defining sentence. `APPX` ships with the published deck but isn't presented. The 20-slide appendix is why nothing had to be cut.
4. **Goal three — "understand what people are talking about in the AI space" — licenses the NAME tier.** Say it once at S2. It converts every one-line slide from a compromise into a stated objective.
5. **Prompt injection is out of the presented deck** (author's call) and lives as appendix A20.
6. **Harness Engineering does not re-teach memory or tools.** The original outline duplicated memory there. It now opens with a four-component map pointing back to the context and tools sections, and spends its budget only on hooks and evals.
7. **Running example throughout: the Notion board reviewer.** Built one layer per section, v1 (a chat message) to v6 (unattended). Lives in the Notes; surfaces as a slide at S28.
8. **Site content lives in two markdown files only** — `content/slides.md` and `content/articles-outline.md`, both imported raw from outside `src/`. No component edits needed to change wording.
9. **Term registry — settled 1 Aug 2026.** Canonical list is in `articles-outline.md` under *Cross-cutting production notes*. Summary:
   - **Chain of thought**, never "chain of action." The original draft's phrasing is retired.
   - **Steps** is the third slot of the prompt stack (S11 / §2.5). Formerly "Instruction" / "Workflow."
   - **Workflow** means the multi-stage pipeline (S25 / §6.2) and nothing else, anywhere.
   - **Process** is what you interview, document or walk through when building a skill (S20 / §4.3).
10. **Instruction file vs memory file comparison lives in the article, not the deck.** Full five-axis table shipped in Part 2 §2.7. The deck keeps S13's third bullet only; appendix A7 backs it up for Q&A. Deck stays at 29 slides.
11. **Presenter scaffolding is out — 1 Aug 2026.** The per-slide *Say* lines, the three planned pause points, the `[ENG]` engineers-only badges and the authoring flags were all removed, from the deck, the site and `slides-outline.md`. Only *Notes* survives. See *Open questions* — this reopens the pacing problem the pauses were solving.
12. **Slides are markdown, not a JS object — 1 Aug 2026.** Reverses the original build decision. `content/slides.md` is the deck; `src/content/slides.js` is now just its parser. Verified lossless by round-tripping against the old object. Grammar is documented at the top of `slides.md` and in the README.

---

## Open questions — need the author's call

*The three naming collisions were settled on 1 Aug 2026 — see Decisions 9 and 10. Remaining:*

1. **Is the running example real?** S28 and the whole cumulative structure only work if the board reviewer is genuinely the author's and can be spoken to without notes. If it isn't, S28 is the safest cut in the deck. **Now blocking the articles too** — Part 2's v2 section is written around it.
2. **Article series shape** — six separate posts, or one long piece with six parts? Currently planned as six, and Part 2 is drafted as a standalone post with prev/next links at the foot.
3. **Part 2 voice check.** First article written, so it sets the register for the other five. Read it before drafting anything else; if the tone is wrong, it's much cheaper to fix now than after five more parts match it.

---

## Blocked

**Fine-tuning vs context engineering** (article §3.5, appendix A14). The original outline marked this "(Research here)" and it's still unresolved. It needs a cost comparison at realistic volume, a latency comparison, and the maintenance argument, or measured numbers of the author's own. **Do not improvise figures.** Recommendation on file: publish Part 3 without it and run it as a standalone follow-up.

---

## Missing assets

Four slides render placeholder boxes on the preview site so the gaps stay visible:

- **S1** — screenshot of a confident, wrong answer. Must be judgeable as wrong by a non-technical viewer.
- **S12** — the before/after prompt pair. ⚠ Known risk: if the "before" output needs domain knowledge to recognise as bad, this slide fails silently, and it's carrying the highest-value three minutes of the talk.
- **S28** — the six versions of the board reviewer.
- **The map** — the six-layer diagram is drawn as ASCII on the site; a real version is needed for S3 and S29.

Two more that would strengthen the talk if the author can measure them: token bloat numbers for S14 (same task at three context sizes, quality and cost) and the token cost of their own connected MCP servers for S19. Own measurements beat citations for both.

---

## Suggested next moves, in order

1. ~~Settle the three naming collisions.~~ **Done 1 Aug.** Decisions 9 and 10.
2. ~~Draft article Part 2.~~ **Draft v1 done.** Needs a voice check and three real artefacts.
3. **Fill Part 2's three `[AUTHOR]` blocks.** The before/after prompt pair (§2.5) and running example v2. These are the same artefacts S12 and S28 need, so capturing them once serves both. **§2.5 is the one to get right** — if the "before" output needs domain knowledge to recognise as bad, both the slide and the article section fail silently.
4. **Capture the other two assets** — the S1 failure screenshot and a real version of the six-layer map (S3, S29). Both quick.
5. **Draft Parts 1, 4, 5, 6.** Straightforward once Part 2's voice is signed off.
6. **Draft Part 3 second-to-last.** It's the longest and hardest — it carries the RAG material, the progressive-disclosure tradeoff and the research gap. Let the surrounding parts fix its boundaries first. Part 2 currently hands it two specific hooks: the invented-status-values defect, and "more context makes it worse past a point."
7. **Rehearse against the clock.** 29 slides in 45 minutes is ~1.5 min each with no demo slack. If it runs long: cut S28 first, then compress S26–S27 into one spoken minute. **Never cut S29.**

---

## Running the preview site

From the repo root:

```bash
npm install && npm run dev
```

Opens on `localhost:3002`. Change `PORT` in `.env`, or `PORT=4000 npm run dev`.

Deck shortcuts: `←` `→` move · `N` notes · `G` grid of all slides · `Esc` leave grid. Slides are addressable at `#/deck/17`.

The grid view is unmarked — the coloured dots went with the rest of the presenter scaffolding.

Full build rationale is in `Decisions.md` at the repo root.

---

## Working notes for whoever picks this up

- The author moves fast and gives terse, decisive direction. Match it. Give the recommendation, then the reasoning, not the reverse.
- When cutting, say what's being lost. The author has overruled cuts before and was right to.
- The talk now has no breathing points at all. Demos went first, then the three planned pauses (after S7, S13, S20) on 1 Aug. That was deliberate, but the problem the pauses solved — 29 slides at 1.5 minutes each with nowhere to stop — is unsolved. Worth watching for in rehearsal.
- The *Say* lines are gone too, so the deck no longer carries any record of what to elaborate per slide. If the author wants that back, it lives in git history, not in any current file.
