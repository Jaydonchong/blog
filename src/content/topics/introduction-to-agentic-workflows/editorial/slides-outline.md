# Slide Outline v3 — How to use and learn AI
**45 min presented + 10 min Q&A · Mixed technical / non-technical · No live demos · 29 slides**
Structure and naming follow the original outline: H1s are the section kickers, H2s are the slide titles.

---

## Slide contract

Every slide is **a section kicker, a plain title, and three points.** You are the content; the slide is the heading.

- **Notes** — attached to the slide, published with the deck, not spoken. Where the depth that used to be its own slide now lives.

**Pace:** 29 slides / 45 min ≈ 1.5 min each. Tight.

---

## Why the third goal changes the deck

Adding *"understand what people are talking about in the AI space"* makes term-recognition a stated objective rather than a compromise. Every one-line, name-only slide — quantization, RAG internals, swarming, distributed failures — is now delivering goal three directly. Say this once, early: *"some of this you'll use on Monday. Some of it is so you know what the word means when someone says it at you."* That single sentence licenses the entire depth structure.

---

## Recurring assets

**The map** — on S3 and S29, referenced verbally at every section change:

```
  YOU ─► [ PROMPT ] ─► ( MODEL ) ─► OUTPUT
              │
              ├── CONTEXT    what it knows
              ├── TOOLS      what it can touch
              ├── HARNESS    what it runs inside
              └── LOOP       how many times it goes around
```

**The running example** — the Notion board reviewer. Lives in the Notes throughout, surfaces as a slide at S28. One sentence at each section change so the payoff lands.

---

# Introduction — 3 min · 3 slides

### S1 · Title
**Notes** — Pick a failure the non-technical half can independently judge as wrong. A fabricated citation works for everyone; a fake API method only lands for engineers.

### S2 · Goals of this lecture
**Notes** — Goal three is what lets you name things without teaching them. Restate it at each name-only slide if the room looks lost.

### S3 · What we'll cover
**Notes** — Return to this diagram verbally at each section change rather than reprinting it. Saves five slides.

---

# What is an LLM — 7 min · 4 slides

### S4 · AI as an abstraction
**Notes** — Three ways it fails, each pointing forward: Python is deterministic (→ section 2), Python has a readable spec (→ section 3), Python won't invent a function that doesn't exist (→ hallucination). Use one out loud, keep the others for Q&A.

### S5 · Characteristics of an LLM
**Notes** — Consequences to draw on later: stateless → section 3 exists. Non-deterministic → you can't test with one run. Response-only → the loop isn't a nice-to-have, it's the source of agency. Hallucination if asked: a completion engine always completes, so it rarely abstains.

### S6 · Next-token prediction, sampling, and tokens
**Notes** — Show one badly-split tokenised sentence if you want a visual. Pricing for Q&A: input and output bill at different rates, output is dearer. Tokens are the through-line to S14 bloat and S19 connection cost.

### S7 · Weights, inference, quantization
**Notes** — Kill the misconception directly: your conversation does not train the model. Quantization only matters if you self-host; give the decision rule, not the precision levels.

---

# Prompt Engineering — 11 min · 6 slides

### S8 · What is a prompt
**Notes** — What the interface silently adds: system prompt, full conversation history, tool definitions. That invisible payload is why the same question behaves differently in two apps.

### S9 · What is a good prompt
**Notes** — "Same process" is the check nobody runs and the best predictor of failure at scale: an answer that was right by luck stops being right. Correctness is domain-relative, hence *in my context*.

### S10 · Prompt techniques
**Notes** — CoT buys computation before commitment, costs tokens, doesn't help on simple tasks. (Naming settled: chain of thought, not "chain of action" — it's what people search for.)

### S11 · Structuring a good prompt — the stack
**Notes** — Naming settled: this slot is **Steps**, not "Instruction" or "Workflow." *Workflow* is now reserved for the multi-stage pipeline at S25; keeping both would have made the word mean three things. Output structure is the mechanical link to S9's consistency column.

### S12 · Applying the stack
**Notes** — This replaced the live demo. Static costs the drama, buys reliability and exact timing. Screenshot a real pair, leave timestamps visible. Put both full prompts in the notes so the published deck works as a template. ⚠ Risk: if the "before" output needs domain knowledge to judge as bad, the slide fails silently.

### S13 · System prompts
**Notes** — Naming discipline: three filenames across S13 and S15. Always lead with the concept — "instruction file" here, "memory file" there. Settled: the full instruction-file vs memory-file comparison lives in article Part 2 and appendix A7, not in the presented deck. The third bullet is all the deck gets. OpenAI vs Claude: both expose a separate system role; differences are adherence and length tolerance, not mechanism. Q&A material.

---

# Context Engineering — 9 min · 4 slides

### S14 · The context window and token bloat
**Notes** — Bring your own numbers if you have them: same task at three context sizes, quality and cost for each. Far more persuasive than a citation. Q&A terms: lost-in-the-middle, instruction drift.

### S15 · Memory layer (persistence)
**Notes** — The file is a feedback loop: corrections given once become permanent. Different staleness rules — episodic ages fastest, procedural changes when the team does, semantic when the system does.

### S16 · RAG
**Notes** — Resist internals; chunk strategies, embedding models, vector DB comparison are all article material. If pushed in Q&A: chunk boundaries are where most RAG quality is won or lost.

### S17 · Context management techniques
**Notes** — Progressive disclosure tradeoff in full: gain is lower context usage; cost one is non-deterministic execution — you traded guaranteed-present for probably-fetched; cost two is over-normalisation, fragments too small to mean anything. Knowledge graph is the answer to over-normalisation: relationships are what fragments lose, so store them explicitly. This is the retrieval and indexing problem relocated into your filesystem. ⚠ Fine-tuning vs context engineering is still a research gap — don't improvise numbers, point at the follow-up.

---

# Tool, MCP — 7 min · 3 slides

### S18 · Tool calling
**Notes** — Message sequence for Q&A: model emits tool_use → your code executes → you return tool_result → model continues. Terminal-as-a-tool is enormous leverage and an obvious blast radius; mitigation is allowlisting.

### S19 · MCP
**Notes** — Measure your own install and put the number on the slide — "my setup spends N tokens on tool definitions at startup" beats the general claim. Hard callback to S14.

### S20 · Skills
**Notes** — Show one real frontmatter for five seconds. Bad scoping failure mode: a user skill that assumes a repo layout, or a project skill full of personal preference.

---

# Harness Engineering — 5 min · 3 slides

### S21 · What is a harness
**Notes** — Component map for the published deck: Tools → S18–S20 · Memory → S15 · Verification → S23 · Hooks → S22. Lifecycle in one line: read → run → write → compact. Failure mode: memory that's read but never written is just a config file.

### S22 · Hooks
**Notes** — Direct callback to S5. Worth saying out loud if time allows: every time you catch yourself asking the model to reliably remember to do something, that's a hook.

### S23 · Observability and evals
**Notes** — LLM-as-judge needs calibrating against human labels before you trust it; watch for position and verbosity bias. Golden datasets need fewer examples than people think to start. Without the logging line, you can't debug a loop — only restart it.

---

# Loop Engineering — 7 min · 4 slides

### S24 · The agentic loop
**Notes** — Verify is load-bearing, not decorative. The third stopping condition — human approval before anything irreversible — is what lets you leave a loop running overnight.

### S25 · Designing a workflow
**Notes** — Real artefacts from a real feature are the most persuasive thing here; a genuine PRD the model wrote beats any diagram. Full stage-by-stage in the article.

### S26 · Multi-agent workflows
**Notes** — Same isolation-vs-coherence tension as subagents at S17, now at system scale. Swarming suits pipelines with clean handoff boundaries; orchestration suits work where a global view is needed to decide what happens next.

### S27 · Loop challenges
**Notes** — Retrying a non-deterministic operation is not retrying an HTTP call — idempotency has to be designed in. Partial work on timeout is the case people forget. The heartbeat mechanism deserves its own diagram in the article.

---

# Close — 3 min · 2 slides

### S28 · Putting it together
**Notes** — Only works if the example is genuinely yours and you can speak to it without reading. If it isn't, cut this slide and give the time to S29. This is the safest cut in the deck if you're running long.

### S29 · Recap and next steps
**Notes** — Never cut this slide. If you're over time, compress S26 and S27 into a single spoken minute instead.

---

# Appendix slides — published, not presented

Q&A backstop, and the reason nothing from the original outline had to be dropped. One slide each, denser than a presented slide is allowed to be.

| # | Slide | Covers |
|---|---|---|
| A1 | Inference internals | forward pass, KV cache, why latency scales with context |
| A2 | Quantization in practice | precision levels, quality/cost curve, when to self-host |
| A3 | Tokenisation | worked example, bad splits, input vs output pricing |
| A4 | Reliability & consistency, in full | all five checks with worked examples |
| A5 | Chain of thought vs ReAct vs few-shot | when each helps, when each wastes tokens |
| A6 | The stack, as a template | copy-pasteable, all five slots, annotated |
| A7 | System prompts by provider | OpenAI vs Claude · `CLAUDE.md` vs `AGENTS.md` vs `MEMORY.md` |
| A8 | RAG internals | chunk strategies, embedding models, vector DB choices |
| A9 | Chunking and embedding beyond text | the YouTube case, at depth |
| A10 | Memory types with file layouts | episodic / semantic / procedural, structured |
| A11 | Progressive disclosure tradeoffs | fragmentation vs over-normalisation |
| A12 | Indexing and knowledge graphs | naming as retrieval, entities and relations, traversal vs similarity |
| A13 | Subagents | isolation vs management, when the parent stays dumb |
| A14 | Fine-tuning vs context engineering | ⚠ blocked on research |
| A15 | MCP internals | transport, auth, external vs internal trust boundary |
| A16 | Skill anatomy | frontmatter, project vs user scope, three build methods |
| A17 | Eval design | judge prompts, golden dataset labelling, static suites |
| A18 | Distributed loop patterns | heartbeats, idempotency, retries, timeout budgets |
| A19 | `/work-on-feat` in full | every stage, real artefacts from a real feature |
| A20 | Prompt injection and trust boundaries | untrusted content as instruction, mitigations |

---

# Delivery notes

1. **The slide is the title; you are the content.** If a slide can be read faster than you can say it, it has too many words.
2. **Goal three licenses everything you only name.** Say it once at S2 and the name-only slides stop feeling like gaps.
3. **Three planned pauses — after S7, S13, S20.** With no demos, there are no natural breathing points. Ask the room a real question.
4. **Non-code anchor within 10 seconds** of any technical term, or half the room disengages permanently.
5. **One name per concept.** Settled: *chain of thought* (never "chain of action") · *Steps* is the prompt-stack slot · *workflow* means the multi-stage pipeline at S25 and nothing else. Biggest remaining live risk is instruction file vs memory file at S13 and S15 — lead with the concept, not the filename, and point at the appendix if pushed.
6. **Running long?** Cut S28, then compress S26–S27 into one spoken minute. Never touch S29.
7. **Harness is deliberately short.** It names a container for things you already built. Resist re-explaining.
