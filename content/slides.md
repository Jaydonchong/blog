<!--
  The deck. 30 slides. This file is the source — the site parses it at build time.

  # Section label {id | Short | minor}   section header; groups the slides beneath it
  ## S<n> · Slide title {title}          a slide. {title} marks the one title slide.
  ### Subtitle                           optional
  - text                                 a bullet
  - **Term** — text                      a bullet with a lead-in term
    - **Sub** — text                     indent two spaces to nest
  - text {strong}                        emphasised bullet.  {mono} for monospace.
  | a | b |                              a GFM table sets the slide kind to "table"
  > text                                 the pull-quote
  :::map                                 the six-layer diagram
  :::asset text                          placeholder for a missing image
  :::compare                             two-column before/after; kind becomes "compare"
  Label | body | result                    one line per column, inside the block
  :::
  **Notes** — text                       published with the deck, not spoken
-->

# Introduction {intro | Intro | minor}

## S1 · How to use and learn AI {title}

### From the chat box to the unattended loop

:::asset Screenshot: a confident, wrong answer

> Confident. Fluent. Wrong.

**Notes** — Pick a failure the non-technical half can independently judge as wrong. A fabricated citation works for everyone; a fake API method only lands for engineers.

## S2 · Goals of this lecture

- Explain what goes on when you use ChatGPT or Claude
- Utilize AI efficiently
- Understand what people are talking about in the AI space

**Notes** — Goal three is what lets you name things without teaching them. Restate it at each name-only slide if the room looks lost.

## S3 · What we'll cover

- Six layers, one section each
- Each layer is one more thing you hand over
- When the output is bad, you’ll know which layer broke

:::map

**Notes** — Return to this diagram verbally at each section change rather than reprinting it. Saves five slides.

# What is an LLM {llm | LLM}

## S4 · AI as a tool, not a solution

- Python hides C from you — this hides reasoning
- Where GenAI sits: AI → ML → deep learning → generative → LLMs
- Every abstraction before this one was deterministic {strong}

**Notes** — Three ways it fails, each pointing forward: Python is deterministic (section 2), Python has a readable spec (section 3), Python will not invent a function that does not exist (hallucination). Use one out loud, keep the others for Q&A.

## S5 · What is AI

- AI, Model, Gen AIs and LLMs (Next token prediction)

**Notes** — One slide, one nesting: AI is the field, a model is the artefact, generative models produce content, and an LLM is the generative model that produces text by predicting the next token. Everything after this slide is a consequence of that last clause.

## S6 · Using LLMs

- **Stateless** — remembers nothing between messages
- **Non-deterministic** — same question, different answer
- **Blackbox, response-only** — can't explain itself, won't act first

> A brilliant contractor with total amnesia. You re-brief them every morning. They never admit they’ve forgotten.

**Notes** — Consequences to draw on later: stateless means section 3 exists. Non-deterministic means you cannot test with one run. Response-only means the loop is not a nice-to-have, it is the source of agency. Hallucination if asked: a completion engine always completes, so it rarely abstains.

## S7 · AI process terminologies

- **Sampling** — it rolls a weighted die, not a lookup
- **Tokens** — the unit of cost and the unit of space

**Notes** — Show one badly-split tokenised sentence if you want a visual. Pricing for Q&A: input and output bill at different rates, output is dearer. Tokens are the through-line to token bloat and to connection cost in the tools section.

## S8 · AI Model specification terminologies

- **Weights** — frozen at training; chatting teaches it nothing
- **Inference** — one pass through those weights, and your bill
- **Quantization** — smaller numbers, smaller hardware, slightly worse

**Notes** — Kill the misconception directly: your conversation does not train the model. Quantization only matters if you self-host; give the decision rule, not the precision levels. PAUSE POINT — ask the room a question before moving on.

# Prompt Engineering {prompt | Prompt}

## S9 · What is a prompt

- The chat box is a thin skin over an API call
- **Prompt engineering** — structuring the brief, not finding magic words
- Augment with structure and data to improve the prediction

**Notes** — What the interface silently adds: system prompt, full conversation history, tool definitions. That invisible payload is why the same question behaves differently in two apps.

## S10 · Good prompt leads to better output

| Reliability | Consistency |
| --- | --- |
| Correct **in my context** | Same across runs and models |
| Verified | Same structure every time |
|  | Same process every time |

> Reliability is about this answer. Consistency is about tomorrow’s.

**Notes** — "Same process" is the check nobody runs and the best predictor of failure at scale: an answer that was right by luck stops being right. Correctness is domain-relative, hence "in my context".

## S11 · Prompt Framework

- **Context** — tone, and where this lands
- **Scope** — goals, acceptance criteria, constraints
- **Steps** — the route, in order
- **Output** — the shape you want back
- **Examples** — show, don't describe

**Notes** — Naming settled: this slot is Steps, not "Instruction" or "Workflow". Workflow is now reserved for the multi-stage pipeline at S27. Output structure is the mechanical link to the consistency column one slide back.

## S12 · System prompts

- A standing instruction applied to every message
- In practice, a file in your project: CLAUDE.md, AGENTS.md {mono}
- Rules you write — not state the model accumulates

**Notes** — Naming discipline: three filenames across this slide and the memory slide. Always lead with the concept — "instruction file" here, "memory file" there. Settled: the full comparison table lives in article Part 2 and appendix A7, not in the presented deck. OpenAI vs Claude: both expose a separate system role; differences are adherence and length tolerance, not mechanism.

## S13 · Comparing 2 prompts

- Avoid: vague adjectives · "don’t do X" · politeness padding

:::compare
Before | [bad prompt] | [what came back]
After | [stacked prompt] | [what came back]
:::

> The only thing that changed is the brief.

**Notes** — This replaced the live demo. Static costs the drama, buys reliability and exact timing. Screenshot a real pair, leave timestamps visible. RISK: if the "before" output needs domain knowledge to judge as bad, the slide fails silently.

## S14 · Prompt Engineering: Techniques

- **Chain of thought** — reasoning before the answer
- **ReAct** — reasoning and acting, interleaved
- **Few-shot** — examples that teach the pattern, not the exception

**Notes** — Chain of thought buys computation before commitment, costs tokens, and does not help on simple tasks. Naming settled: chain of thought, not "chain of action" — it is what people search for. PAUSE POINT.

# Context Engineering {context | Context}

## S15 · Context

- Context makes request meaningful
- Context makes output correct
- Context makes process efficient and effective

**Notes** — The three reasons map to the three slides after this one: meaningful is why the window matters, correct is what memory and retrieval buy you, efficient is what management techniques buy you. State the ladder here so the section has a spine.

## S16 · The context window and token bloat

- A desk, not a filing cabinet — finite surface
- More context is not better
- Bloat costs you money and quality at the same time

**Notes** — Bring your own numbers if you have them: same task at three context sizes, quality and cost for each. Far more persuasive than a citation. Q&A terms: lost-in-the-middle, instruction drift.

## S17 · Memory layer (persistence)

- **MEMORY.md** — a file it reads at the start of every session {mono}
- Three kinds: episodic (happened) · semantic (true) · procedural (how)
- Curation is the skill — a file that only grows becomes bloat

**Notes** — The file is a feedback loop: corrections given once become permanent. Different staleness rules — episodic ages fastest, procedural changes when the team does, semantic when the system does.

## S18 · RAG

- **Chunk** — split the documents into pieces
- **Embed** — turn pieces into searchable meaning
- **Vector DB** — store them, fetch the closest ones

> YouTube does the same three steps to your video.

**Notes** — Resist internals; chunk strategies, embedding models and vector DB comparison are all article material. If pushed in Q&A: chunk boundaries are where most RAG quality is won or lost.

## S19 · Context management techniques

- **Compaction** — it summarises to fit, and quietly drops things
- **Progressive disclosure** — load an index, fetch pages on demand
  - **Indexing** — a good filename is a retrieval strategy
  - **Knowledge graph** — store relationships, not just similarity
- **Subagents** — hand work to a fresh context

> Fetching on demand is a decision the model can get wrong.

**Notes** — Tradeoff in full: gain is lower context usage; cost one is non-deterministic execution — you traded guaranteed-present for probably-fetched; cost two is over-normalisation, fragments too small to mean anything. Knowledge graph is the answer to over-normalisation: relationships are what fragments lose, so store them explicitly. RESEARCH GAP: fine-tuning vs context engineering — do not improvise numbers.

# Tool, MCP {tools | Tools}

## S20 · Tools Process as a function

- A tool is a function you describe to the model
- It doesn't run it — it asks you to run it {strong}
- Give it a terminal and every CLI becomes a tool

**Notes** — Message sequence for Q&A: model emits tool_use, your code executes, you return tool_result, model continues. Terminal-as-a-tool is enormous leverage and an obvious blast radius; mitigation is allowlisting.

## S21 · MCP: Model Context Protocol

- A standard plug shape, not new technology
- **External vs internal** — whose server, whose data boundary
- Every connected tool spends context before you type a word

> Connecting everything makes the model worse.

**Notes** — Measure your own install and put the number on the slide — "my setup spends N tokens on tool definitions at startup" beats the general claim.

## S22 · Agent Skills

- Loaded only when relevant — the YAML frontmatter decides
- Project skills ship with the repo, user skills follow you
- Build by interview, by documentation, or by walkthrough

**Notes** — Show one real frontmatter for five seconds. Bad scoping failure mode: a user skill that assumes a repo layout, or a project skill full of personal preference. PAUSE POINT.

# Harness Engineering {harness | Harness}

## S23 · What is a harness

- Tools + memory + verification + hooks {strong}
- An agent is simply a model with a harness
- You already built half of it — sections 3 and 4

**Notes** — Component map: Tools from the tools section, Memory from the context section, Verification and Hooks come next. Lifecycle in one line: read, run, write, compact. Failure mode: memory that is read but never written is just a config file.

## S24 · Hooks

- Code that fires at fixed points in a run
- Run tests after an edit · notify on completion
- Session end: run a prompt that updates memory

> Deterministic scaffolding around a non-deterministic core.

**Notes** — Direct callback to the characteristics slide. Worth saying out loud if time allows: every time you catch yourself asking the model to reliably remember to do something, that is a hook.

## S25 · Observability and evals

- **LLM as judge** — a second model grades the first
- **Golden datasets** — hand-labelled, known-good answers
- **Static evals** — did it compile, validate, pass the tests

> Log every run: cost, context size, tool calls, outcome.

**Notes** — LLM-as-judge needs calibrating against human labels before you trust it; watch for position and verbosity bias. Golden datasets need fewer examples than people think to start. Without logging you cannot debug a loop, only restart it.

# Loop Engineering {loop | Loop}

## S26 · The agentic loop

- Think → Act → Verify → repeat {strong}
- The loop is where the agency comes from
- Stop on: max turns · budget cap · human approval

> Autonomy is cheap; verification is the expensive part.

**Notes** — Verify is load-bearing, not decorative. The third stopping condition — human approval before anything irreversible — is what lets you leave a loop running overnight.

## S27 · Designing a workflow

- Prompt → PRD → SPEC → PLAN → ISSUES {strong}
- Each stage's output is the next stage's context
- Every boundary is a cheap place to check, or restart

**Notes** — Real artefacts from a real feature are the most persuasive thing here; a genuine PRD the model wrote beats any diagram.

## S28 · Multi-agent workflows

- **Swarming** — agents hand work off to each other
- **Orchestrating** — one coordinator delegates and collects
- The trade: less context per agent, more coordination

**Notes** — Same isolation-vs-coherence tension as subagents, now at system scale. Swarming suits pipelines with clean handoff boundaries; orchestration suits work where a global view is needed to decide what happens next.

## S29 · Loop challenges

- Unattended means distributed: parallelism · retries · timeouts
- Loop 1 — finds PRs assigned to me and reviews them
- Loop 2 — watches the board: heartbeat for isolation, status for state

**Notes** — Retrying a non-deterministic operation is not retrying an HTTP call — idempotency has to be designed in. Partial work on timeout is the case people forget. The heartbeat mechanism deserves its own diagram in the article.

# Close {close | Close | minor}

## S30 · Putting it together

- v1 was a chat message · v6 runs unattended
- Each layer fixed one thing the version before got wrong
- Same model throughout — only the scaffolding changed

**Notes** — This is now the last slide, so land the close here: name the layer each version fixed, then give the one action each — non-technical, write a memory file for your most-repeated task; technical, add a verification step to one loop you already run. Only works if the example is genuinely yours and you can speak to it without reading.


# Appendix {appendix}

Published with the deck, not presented. The reason nothing from the
original outline had to be dropped.

| Ref | Title | Covers |
| --- | --- | --- |
| A1 | Inference internals | forward pass, KV cache, why latency scales with context |
| A2 | Quantization in practice | precision levels, quality/cost curve, when to self-host |
| A3 | Tokenisation | worked example, bad splits, input vs output pricing |
| A4 | Reliability & consistency, in full | all five checks with worked examples |
| A5 | Chain of thought vs ReAct vs few-shot | when each helps, when each wastes tokens |
| A6 | The stack, as a template | copy-pasteable, all five slots, annotated |
| A7 | System prompts by provider | OpenAI vs Claude · CLAUDE.md vs AGENTS.md vs MEMORY.md |
| A8 | RAG internals | chunk strategies, embedding models, vector DB choices |
| A9 | Chunking and embedding beyond text | the YouTube case, at depth |
| A10 | Memory types with file layouts | episodic / semantic / procedural, structured |
| A11 | Progressive disclosure tradeoffs | fragmentation vs over-normalisation |
| A12 | Indexing and knowledge graphs | naming as retrieval, entities and relations, traversal vs similarity |
| A13 | Subagents | isolation vs management, when the parent stays dumb |
| A14 | Fine-tuning vs context engineering | BLOCKED ON RESEARCH |
| A15 | MCP internals | transport, auth, external vs internal trust boundary |
| A16 | Skill anatomy | frontmatter, project vs user scope, three build methods |
| A17 | Eval design | judge prompts, golden dataset labelling, static suites |
| A18 | Distributed loop patterns | heartbeats, idempotency, retries, timeout budgets |
| A19 | /work-on-feat in full | every stage, real artefacts from a real feature |
| A20 | Prompt injection and trust boundaries | untrusted content as instruction, mitigations |
