# Article Series Outline — LLMs, Prompts, Agents
**Companion to the talk.** Same skeleton, no time limit, every term expanded.
Six parts, publishable independently, sequenced as a ladder.

---

## Series design

**Premise (repeat in every intro, one sentence):**
> The model is a stateless, non-deterministic function. Every technique in this series is about controlling what you feed it, what you let it touch, and how many times you let it go around.

**Running example across all six parts:** the Notion board reviewer. Each part ships the version of it built with that part's material. Readers can diff part N against part N−1.

**Per-part template — keep it rigid, readers learn the shape:**
1. *The problem this layer solves* (2–3 paragraphs, opens with a concrete failure)
2. *Concepts* (the body)
3. *The running example, this layer*
4. *Tradeoffs and when not to bother*
5. *What breaks next* → sets up the following part

**Length targets** are deliberately uneven — parts 2 and 3 are the ones people will actually apply.

| Part | Title | Words | Primary reader |
|---|---|---|---|
| 0 | Why this series | 600 | everyone |
| 1 | What is an LLM | 1,800 | everyone |
| 2 | Prompt Engineering | 3,000 | everyone |
| 3 | Context Engineering | 3,200 | mixed, technical-leaning |
| 4 | Tools and MCP | 2,400 | technical |
| 5 | Harness Engineering | 2,200 | technical |
| 6 | Loop Engineering | 2,600 | technical |

---

# Part 0 · Why this series — 600 words

- The two goals from the talk, restated as reader outcomes:
  1. Explain what happens when you use ChatGPT/Claude — specifically enough to diagnose a failure.
  2. Use AI efficiently — fewer tokens, fewer retries, less supervision.
- **The map.** The six-layer diagram, presented once and referenced by every part.
- **How to read this** — parts 1–3 are for everybody; 4–6 assume you write code or manage people who do.
- Link the talk recording and deck.

---

# Part 1 · What is an LLM — 1,800 words
*Goal: understand the technology behind it*

## 1.1 AI as an abstraction, the way Python is an abstraction over C
- The analogy at full strength: you operate at a higher level and stop hand-managing the layer below.
- **Then break it, carefully.** Three ways it fails, and each failure is a lesson for a later part:
  - Python is deterministic; this is not → *part 2 exists because of this*
  - Python has a spec you can read; this has weights you can't → *part 3 exists because of this*
  - Python doesn't invent a function that doesn't exist → *hallucination*
- Position the analogy honestly: useful for the shape, misleading for the guarantees.

## 1.2 What is GenAI
- The taxonomy, briefly: AI ⊃ ML ⊃ deep learning ⊃ generative models ⊃ LLMs.
- Why the marketing term is broader than the thing this series is about.
- Placed *before* the internals — general to specific.

## 1.3 The four properties that matter
Each gets its own subsection with a worked consequence, because the rest of the series is downstream of these.
- **Next-token prediction** — the primitive. Completion, not answering.
- **Non-deterministic** — sampling from a distribution, not argmax. Temperature. Why "it worked yesterday" isn't evidence. *Consequence:* you cannot test an LLM system with a single run.
- **Stateless** — every call resends the whole conversation. *Consequence:* conversation is an illusion your client maintains, and it is the reason part 3 exists.
- **Blackbox, response-only** — no introspection, no self-initiation. Asking "why did you say that" returns another prediction, not a reason. *Consequence:* agency has to be supplied externally — a loop, part 6.

## 1.4 Weights, inference, quantization
Full depth here, since the talk only names them.
- **Weights** — learned in training, frozen at use. The most common misconception to kill: chatting does not teach it anything.
- **Inference** — one forward pass. Where latency and cost come from. Why longer context costs more *per token generated*, not just more tokens.
- **Quantization** — reducing numeric precision so the model fits smaller hardware. The quality/cost curve, common precision levels, and the decision rule: this only matters if you self-host.

## 1.5 Tokens
- Tokenisation with a worked example — show a sentence split, including one that splits badly.
- Tokens as the unit of both **cost** and **space**.
- Reading a pricing page: input vs output rates, why output is dearer.
- Forward-reference to token bloat in part 3.

## 1.6 Hallucination
- Reframe: not a malfunction, a direct consequence of 1.3. A completion engine always completes.
- Why "I don't know" is rare unless the prompt makes room for it.

**Running example v1:** the board reviewer as a single chat message. Show the output. Annotate three specific defects — each one is fixed by a later part.

---

# Part 2 · Prompt Engineering — 3,000 words
*(Interacting with the LLM)*

## 2.1 What is a prompt
- The chat box is a thin client over an API call. Show the raw request/response JSON, annotated.
- What the interface adds that you don't see: system prompt, conversation history, tool definitions.

## 2.2 What is prompt engineering
- The practice of improving and structuring the prompt to get the desired result.
- Augmenting with structure and data to improve the prediction.
- Explicit anti-framing: it is not incantations. Every technique below has a mechanical reason it works.

## 2.3 What makes a prompt good
The original taxonomy, kept whole and given examples.
- **Reliability**
  1. *Is the output correct in my context* — general correctness is not enough; correctness is domain-relative.
  2. *Is the output verified* — and by what. Flag forward to part 5 evals.
- **Consistency**
  1. *Between runs and models* — the property non-determinism attacks.
  2. *In structure* — the property that makes output machine-consumable.
  3. *Of process* — did it take the same route, or get there by luck. The one people never check, and the one that predicts failure at scale.
- Section closer: reliability is about *this* answer; consistency is about *tomorrow's*. Most prompt work optimises the first and gets burned by the second.

## 2.4 Prompt techniques
- **Chain of thought** — request reasoning before the answer. Why it helps (more tokens of computation before commitment), when it doesn't, what it costs.
  - *Naming settled:* chain of thought is the term throughout. The original draft said "chain of action"; that phrase is retired because readers can't search for it.
- **ReAct (reasoning + acting)** — interleaving thought and tool use. Mark it clearly as the ancestor of the agent loop in part 6; the cross-link is the most valuable thing in this subsection.
- **Few-shot** — examples that *teach the pattern*, not examples that patch edge cases. Why 2–3 representative beats 10 exceptional. Show a bad few-shot set and a good one.

## 2.5 Structuring a good prompt — the stack
**Context · Scope · Steps · Output · Examples**
> *Naming settled:* this slot is **Steps**. The original draft called it "Instruction" in the header and "Workflow" in the subsections; both are retired here. *Workflow* now means one thing only in this series — the multi-stage pipeline in 6.2.

- **Context** — tone; where this output executes; who consumes it.
- **Scope** — goals expressed as *acceptance criteria*; requirements; constraints. Argue that acceptance criteria is the single highest-leverage addition most prompts are missing.
- **Steps** — the route, in order. The difference between specifying a destination and specifying a route, and when each is right.
- **Output** — defining a structure. Schemas, formats, and how structure improves consistency (2.3) mechanically.
- **Examples** — what makes one good: representative, minimal, consistent with the output spec.
- **Full worked transformation** — one real bad prompt, rewritten slot by slot, both outputs shown. This is the section readers will bookmark.
- Ship a **copy-pasteable template** at the end.

## 2.6 Anti-patterns
Vague adjectives · negation instead of direction · politeness padding · burying the ask · contradictory constraints · examples that conflict with the output spec.

## 2.7 System prompts
- What they are: standing instruction applied to every message.
- **How OpenAI and Claude handle them** — separate role in both; differences in adherence and length tolerance; what that means practically.
- **How we define them** — `CLAUDE.md`, `AGENTS.md`. What belongs in a project instruction file vs what belongs in the prompt.
- **Instruction file vs memory file — the comparison table.** Settled: this table is owed to the reader here, in 2.7, and is referenced back from part 3. It stays out of the presented deck (S13's third bullet is all the slide gets). Contrast on five axes: what it holds (rules vs state) · who writes it (you vs the agent) · how it changes (edited vs accumulated) · when it's read (every message vs session start) · what goes wrong (staleness vs unbounded growth).

**Running example v2:** the board reviewer rewritten through the stack. Diff against v1.

---

# Part 3 · Context Engineering — 3,200 words
*(Building situational awareness)*

## 3.1 What is a context window, and the issue with token bloat
- The desk, not the filing cabinet.
- **Token bloat**: why more context degrades output. Attention dilution, lost-in-the-middle, instruction drift in long contexts.
- A measured demonstration — same task, three context sizes, quality and cost for each. Numbers, not assertion.
- The efficiency argument in full: bloat costs money *and* quality simultaneously, which is why it's the highest-ROI thing to fix.

## 3.2 Memory layer (persistence)
### `MEMORY.md`
- The direct answer to statelessness from 1.3.
- What it holds: things worth carrying between sessions and tasks.
- **A way to improve** — the file as a feedback loop; corrections you give once become permanent. Show a real file that has grown over time.
- Curation as the actual skill: a memory file that only grows becomes the bloat problem it was meant to solve.
### Episodic vs semantic vs procedural
- **Episodic** — what happened, when. Decisions and their dates.
- **Semantic** — what is true. Facts about the system.
- **Procedural** — how things are done. Conventions and sequences.
- Why the distinction is operationally useful: different lifespans, different staleness rules, different owners. Show a file organised by the three.

## 3.3 RAG
- The problem it solves in one line: the notes exceed the desk.
- **Chunking** — splitting documents. Strategies, and what a bad split destroys.
- **Embedding** — text to vectors; semantic rather than keyword similarity.
- **Vector DB** — storage and nearest-neighbour retrieval.
- End-to-end walkthrough of one query.
- **The transfer section — chunking and embedding elsewhere in tech.** YouTube chunking and embedding video for search and recommendation; the same three steps in a different medium. This is the part that makes RAG stop feeling like an AI thing and start feeling like search, and it's worth 400 words here even though it was cut from the talk.

## 3.4 Context management techniques for token bloat
### Compaction
- Mechanism: summarise and continue.
- **What it silently loses** — and how to notice. Annotated before/after of a real compaction.
- Defensive practice: write the important thing to a file before the window fills.
### Structured note-taking / progressive disclosure
- Load an index, fetch pages on demand.
- **The tradeoff, at full depth** — the original's core insight, expanded:
  - *Gain:* lower context usage.
  - *Cost 1 — non-deterministic execution:* fetching is now a decision the model makes, and it can make it wrong. You traded guaranteed-present for probably-fetched.
  - *Cost 2 — over-normalisation:* shredded too fine, each fragment loses the context that made it meaningful.
- **Relate it to retrieval and indexing generally** — this is a search problem living in your file system. Index design, naming as an affordance, and why a good filename is a retrieval strategy.
### Subagents
- Delegating to a fresh context.
- **Context isolation vs context management** as a real fork: isolation gives the child room and costs shared understanding; management keeps everything coherent and pays in tokens.
- When isolation wins: bounded task, verifiable output, no need for the parent's history.

## 3.5 Extra: fine-tuning vs context engineering
> ⚠ **RESEARCH GAP** — original marked "(Research here)." Do not ship on assertion.
Needs before publication:
- Cost comparison — training run + inference vs per-call context cost, worked at a realistic volume
- Latency comparison
- The maintenance argument — retraining vs editing a file
- The honest heuristic: fine-tune for *form and behaviour*, engineer context for *facts and freshness*
- At least one credible source or your own measured numbers
Suggest publishing this as a standalone follow-up rather than blocking part 3.

**Running example v3:** the board reviewer with a memory file of team conventions. Show what it stops getting wrong.

---

# Part 4 · Tools and MCP — 2,400 words
*How does your model know what it can interact with*

## 4.1 Tool calling
- **What is a tool** — a described function: name, purpose, arguments, return shape.
- **Tool calling** — the mechanism, and the counterintuitive core: *the model does not execute anything.* It emits a structured request; your code executes and returns the result; the loop continues.
  - Show the full message sequence with real JSON.
  - Why this matters beyond trivia: it's the entire basis of sandboxing, permissioning, and auditability. "The AI did it" is never accurate — your harness did it, at the model's request.
- **Terminal as a tool** — one tool that subsumes every CLI you have. The leverage, and the blast radius. Sandboxing and allowlisting.

## 4.2 MCP
- **What it is** — a standardised protocol for describing and calling tools. Not new technology; an agreed connector shape. Write one server, use it in every client that speaks it.
- What existed before and why the fragmentation hurt.
- **External vs internal MCP** — someone else's server and data boundary vs your own inside your network. Frame as a trust and data-governance decision first, an architecture decision second.
- **The context cost of connection** — tool definitions occupy the window before the user says anything. Measure it: N servers, X tokens, before any work. Direct payoff to the efficiency goal, and a hard link back to 3.1.

## 4.3 Skills
- **What a skill is** — instructions loaded on demand when relevant. Name it as progressive disclosure (3.4) in packaged form.
- **The YAML frontmatter** — how relevance is decided cheaply. Anatomy of the frontmatter, and why the description field is the whole ballgame: it's the only part read before loading.
- **Project skills vs user skills** — shared with the repo vs following the person. Which belongs where, and the failure mode of getting it backwards.
- **Three ways to build one:**
  - *Interview your process* — have the model ask you what you do
  - *Document your process* — write it down, then compress
  - *Walk through your process* — narrate while doing it, transcribe, edit
  - Argue for the third as the highest-fidelity method, and say why: you do things you don't know you do.
- A complete worked skill, frontmatter to body.

**Running example v4:** the board reviewer with Notion tools. It can now read tickets. Note the new failure mode this introduces — forward-reference to injection in part 6.

---

# Part 5 · Harness Engineering — 2,200 words
*(Building the environment)*

## 5.1 What is a harness
- **Tools + Memory + Verification + Hooks.**
- > A harness is what turns a model into an agent. An agent is simply a model with a harness.
- **Structural note for the writing:** parts 3 and 4 already built two of the four components. Open this part by naming the container and cross-linking backwards — do *not* re-explain memory or tools here. The original outline duplicated memory in this section; the fix is a table of the four components with links to where each was covered, then spend the article's budget on the two genuinely new ones (verification, hooks).

| Component | Covered in | This part adds |
|---|---|---|
| Tools | Part 4 | how the harness exposes and gates them |
| Memory | Part 3 | when the harness reads and writes it |
| Verification | — | §5.3 |
| Hooks | — | §5.2 |

## 5.2 Context inside the harness
- Not what memory is, but the harness's *lifecycle* around it:
  - **Managing memory** — what the harness loads at session start
  - **Updating memory** — what gets written back, when, and by whom
  - **Inserting past conversation** — replaying history, and how much
- One diagram: read → run → write → compact.
- The failure mode: memory that's read but never written is just a config file.

## 5.3 Hooks
- Code that fires at defined lifecycle points.
- Real examples from your setup, each with the trigger point: send to Telegram on completion · run tests after an edit · run an enrichment prompt at session end to update memory.
- Hooks as the deterministic scaffolding around a non-deterministic core — the callback to 1.3 that makes the whole series cohere. Put deterministic guarantees where you need them, and stop asking the model for them.

## 5.4 Observability and evals
- Framing: how you know it still works once you stop watching. Answers the "is the output verified" box from 2.3.
- **LLM as judge** — a model grading model output. Judge prompt design, position and verbosity bias, when to trust it. Cheap and scalable; calibrate it against human labels before relying on it.
- **Golden datasets and labelling** — hand-labelled known-good cases. How many you need to start (fewer than people think), how to choose them, how to keep them from rotting.
- **Static evals** — ordinary tests. Did it compile, did the schema validate, did the tests pass. Cheapest and most underused; run these first.
- **Observability** — what to log per run: prompt, context size, tool calls, cost, latency, outcome. Without this you can't debug a loop, only restart it.
- Decision guidance: which of the three to reach for at which stage of maturity.

**Running example v5:** the board reviewer with a verification step and a completion hook.

---

# Part 6 · Loop Engineering — 2,600 words
*(Workflow automation)*

## 6.1 The agentic loop
- **Think → Act → Verify → repeat.**
- Cross-link hard to ReAct (2.4) — the loop is that technique put in a while-loop.
- Cross-link to response-only (1.3) — the loop supplies the agency the model structurally lacks.
- **Verify is the load-bearing step.** A Think→Act loop without verification is a machine for producing mistakes at scale, billed by the token.
- **Stopping conditions** *(addition to the original — recommend keeping):* max turns, token/cost budget, human approval before irreversible actions. Every unattended loop needs all three.

## 6.2 Workflow engineering — `/work-on-feat`
- The pipeline: **Prompt → PRD → SPEC → PLAN → ISSUES.**
- Each stage: what goes in, what comes out, what a human checks.
- **The generalisable principle**, stated explicitly so readers can build their own: each stage's output is the next stage's context, so a pipeline is context engineering distributed over time. Every boundary is a cheap inspection point and a cheap restart point.
- Real artefacts from a real feature — the most persuasive asset in this part.

## 6.3 Multi-agent workflows
- **Swarming (handoff)** — peer-to-peer transfer of work.
- **Orchestrating** — a coordinator delegates and collects.
- **The tradeoff:** swarming carries less context per agent but requires more coordination. Expand into when each shape wins: swarming for pipelines with clean handoff boundaries, orchestration when a global view is needed to decide.
- Cross-link to subagents (3.4) — same isolation-vs-coherence tension, now at system scale.

## 6.4 Loop challenges
- Framing: an unattended loop is a distributed system and inherits every distributed problem.
- **Parallelism** — concurrent agents on shared state; the conflicts that follow.
- **Retries** — idempotency, and why retrying a non-deterministic operation isn't the same as retrying an HTTP call.
- **Timeouts** — what a stuck agent looks like, and what to do with partial work.
- **Example 1 — the PR review loop.** Finds PRs assigned to you, reviews them. Trigger, tools, verification, failure modes.
- **Example 2 — the Notion board loop.** Watches for raised issues and reviews them. The **heartbeat mechanism** for isolation — how it prevents double-processing. The **status field** as the state machine driving next steps. Full walkthrough: this is the most valuable technical content in the series and it should be shown at implementation depth, with the state diagram.

## 6.5 Prompt injection and the trust boundary
> *Addition to the original. Strongly recommend including — parts 4–6 teach readers to point autonomous loops at inboxes and issue trackers, and both worked examples read attacker-writable text.*
- Untrusted content entering the context is untrusted instruction.
- Both examples are exposed: PR descriptions and Notion tickets are written by other people.
- The compounding risk: private data access + untrusted content + a way to send data out.
- Practical mitigations: separate trusted from untrusted context, allowlist tools by task, require approval before irreversible or outbound actions, never let retrieved text widen the loop's own permissions.

**Running example v6, final:** the board reviewer running unattended, with stopping conditions and an injection boundary. Full source.

---

# Series close · One page

- The map, walked once.
- **Diagnostic checklist** — the deliverable readers keep. When output is bad, in order: is it the prompt (part 2), the context (part 3), the tools (part 4), the harness (part 5), or the loop (part 6)?
- Two starting actions, matched to reader type.
- Everything deferred: fine-tuning vs context engineering (blocked on research), eval design at depth, distributed loop patterns.

---

# Cross-cutting production notes

1. **Term registry — settled 1 Aug 2026.** Hard-code these; don't re-open them mid-draft.
   - **Chain of thought.** Never "chain of action." The original draft's phrasing is retired; readers search for the standard term.
   - **Steps** is the third slot of the prompt stack (2.5). Formerly "Instruction" / "Workflow."
   - **Workflow** means exactly one thing across the series: the multi-stage pipeline in 6.2. Nowhere else.
   - **Process** is what you interview, document or walk through when building a skill (4.3). Previously called "workflow."
   - *Instruction file vs memory file* — `CLAUDE.md` / `AGENTS.md` vs `MEMORY.md`. Comparison table lives in **part 2 (2.7)** and is referenced from part 3; it stays out of the presented deck by decision.
3. **Forward references are a feature.** Each part should end by naming the failure the next part fixes. That's what makes it a series rather than six posts.
4. **Every article opens with a concrete failure**, not a definition. Definitions in paragraph three.
5. **Research gaps blocking publication:** fine-tuning vs context engineering (3.5) is the only hard blocker. Measured token-bloat numbers (3.1) and MCP connection cost (4.2) would each significantly strengthen their sections — your own measurements are more persuasive than citations here.
6. **Part 3 is the longest and hardest to write.** It carries the RAG material, the progressive-disclosure tradeoff, and the research gap. Consider drafting it second-to-last, after the surrounding parts have fixed its boundaries.
