# Deck Copy v2 — final on-slide text
**How to use and learn AI** · 29 slides · 45 min + 10 min Q&A
Companion to `slides-outline.md`, which holds the *Notes* for each slide.

**Slide anatomy:** a small section kicker above the title (the H1 from the original outline), then a plain descriptive title (the H2), then three bullets.

**Copy rules:** bullets under 8 words · parallel grammar within a slide · term in bold, gloss in plain · the title never repeats a bullet.

---

## S1 · Title

# How to use and learn AI
### From the chat box to the unattended loop
[your name · date]

> *[screenshot: a confident, wrong answer]*
> Confident. Fluent. Wrong.

---

## S2
`Introduction`
# Goals of this lecture

- Explain what goes on when you use ChatGPT or Claude
- Utilize AI efficiently
- Understand what people are talking about in the AI space

---

## S3
`Introduction`
# What we'll cover

> *[the map]*

- Six layers, one section each
- Each layer is one mo  re thing you hand over
- When the output is bad, you'll know which layer broke

---

## S4
`What is an LLM`
# AI as an abstraction

- Python hides C from you — this hides reasoning
- Where GenAI sits: AI → ML → deep learning → generative → LLMs
- **Every abstraction before this one was deterministic**

---

## S5
`What is an LLM`
# Characteristics of an LLM

- **Stateless** — remembers nothing between messages
- **Non-deterministic** — same question, different answer
- **Blackbox, response-only** — can't explain itself, won't act first

> A brilliant contractor with total amnesia.
> You re-brief them every morning. They never admit they've forgotten.

---

## S6
`What is an LLM`
# Next-token prediction, sampling, and tokens

- **Tokens** — The currency of conversation, parameter for your output
- **Sampling** — it rolls a weighted die, not a lookup
- **Next-token prediction** — it completes text, nothing else

---

## S7
`What is an LLM`
# Model spec of an LLM

- **Weights** — frozen at training; chatting teaches it nothing
- **Inference** — one pass through those weights, and your bill
- **Quantization** — smaller numbers, smaller hardware, slightly worse

---

## S8
`Prompt Engineering`
# What is a prompt

- The chat box is a thin skin over an API call
- **Prompt engineering** — structuring the brief, not finding magic words
- Augment with structure and data to improve the prediction

---

## S9
`Prompt Engineering`
# What is a good prompt

| Reliability | Consistency |
|---|---|
| Correct **in my context** | Same across runs and models |
| Verified | Same structure every time |
| | Same process every time |

> Reliability is about this answer. Consistency is about tomorrow's.

---

## S10
`Prompt Engineering`
# Prompt techniques

- **Chain of thought** — reasoning before the answer
- **ReAct** — reasoning and acting, interleaved
- **Few-shot** — examples that teach the pattern, not the exception

---

## S11
`Prompt Engineering`
# Structuring a good prompt — the stack

- **Context** — tone, and where this lands
- **Scope** — goals, acceptance criteria, constraints
- **Steps** — the route, in order
- **Output** — the shape you want back
- **Examples** — show, don't describe

---

## S12
`Prompt Engineering`
# Applying the stack

| Before | After |
|---|---|
| *[bad prompt]* | *[stacked prompt]* |
| *[what came back]* | *[what came back]* |

- Avoid: vague adjectives · "don't do X" · politeness padding

> The only thing that changed is the brief.

---

## S13
`Prompt Engineering`
# System prompts

- A standing instruction applied to every message
- In practice, a file in your project: `CLAUDE.md`, `AGENTS.md`
- Rules you write — not state the model accumulates

---

## S14
`Context Engineering`
# The context window and token bloat

- A desk, not a filing cabinet — finite surface
- More context is not better
- Bloat costs you money and quality at the same time

---

## S15
`Context Engineering`
# Memory layer (persistence)

- `MEMORY.md` — a file it reads at the start of every session
- Three kinds: **episodic** (happened) · **semantic** (true) · **procedural** (how)
- Curation is the skill — a file that only grows becomes bloat

---

## S16
`Context Engineering`
# RAG

- **Chunk** — split the documents into pieces
- **Embed** — turn pieces into searchable meaning
- **Vector DB** — store them, fetch the closest ones

> YouTube does the same three steps to your video.

---

## S17
`Context Engineering`
# Context management techniques

- **Compaction** — it summarises to fit, and quietly drops things
- **Progressive disclosure** — load an index, fetch pages on demand
  - **Indexing** — a good filename is a retrieval strategy
  - **Knowledge graph** — store relationships, not just similarity
- **Subagents** — hand work to a fresh context

> Fetching on demand is a decision the model can get wrong.

---

## S18
`Tool, MCP`
# Tool calling

- A tool is a function you **describe** to the model
- It doesn't run it — it asks you to run it
- Give it a terminal and every CLI becomes a tool

---

## S19
`Tool, MCP`
# MCP

- A standard plug shape, not new technology
- **External vs internal** — whose server, whose data boundary
- Every connected tool spends context before you type a word

> Connecting everything makes the model worse.

---

## S20
`Tool, MCP`
# Skills

- Loaded only when relevant — the **YAML frontmatter** decides
- **Project** skills ship with the repo, **user** skills follow you
- Build by interview, by documentation, or by **walkthrough**

---

## S21
`Harness Engineering`
# What is a harness

- **Tools + memory + verification + hooks**
- An agent is simply a model with a harness
- You already built half of it — sections 3 and 4

---

## S22
`Harness Engineering`
# Hooks

- Code that fires at fixed points in a run
- Run tests after an edit · notify on completion
- Session end: run a prompt that updates memory

> Deterministic scaffolding around a non-deterministic core.

---

## S23
`Harness Engineering`
# Observability and evals

- **LLM as judge** — a second model grades the first
- **Golden datasets** — hand-labelled, known-good answers
- **Static evals** — did it compile, validate, pass the tests

> Log every run: cost, context size, tool calls, outcome.

---

## S24
`Loop Engineering`
# The agentic loop

- **Think → Act → Verify → repeat**
- The loop is where the agency comes from
- Stop on: max turns · budget cap · human approval

> Autonomy is cheap; verification is the expensive part.

---

## S25
`Loop Engineering`
# Designing a workflow

- Each stage's output is the next stage's context
- Every boundary is a cheap place to check, or restart
- Example: **Prompt → PRD → SPEC → PLAN → ISSUES**

---

## S26
`Multiagent workflows`
# Orchestration patternns

- **Orchestrating** — one coordinator delegates and collects. *Task Decomposition*
- **Pipeline** - Sequential stages
- **Swarming** — Parallel autonomous agent
- **Mesh** - Peer to peer
- The trade: less context per agent, more coordination

---

## S27
`Multiagent workflows`
# Distribution challenges

- Cascading hallucination
- Infinite retries 
- Cost scaling
- Loop 2 — watches the board: **heartbeat** for isolation, **status** for state
- Examples : PR Review Loop

---

## S28
`Close`
# Putting it together

- v1 was a chat message · v6 runs unattended
- Each layer fixed one thing the version before got wrong
- Same model throughout — only the scaffolding changed

---

## S29
`Close`
# Recap and next steps

> *[the map, complete]*

- Which layer broke? Prompt · context · tools · harness · loop
- **Non-technical** — write a memory file for your most-repeated task
- **Technical** — add a verification step to one loop you already run

---

# Copy notes

1. **Titles are now descriptive labels, not arguments.** The assertion moved into the bullets and pull-quotes, where it doesn't compete with the title for attention. The four you named as examples are all applied: S5 *Characteristics of an LLM*, S8 *What is a prompt*, S24 *The agentic loop*, S25 *Designing a workflow*.
2. **Section kickers use the original outline's H1 names verbatim** — *What is an LLM*, *Prompt Engineering*, *Context Engineering*, *Tool, MCP*, *Harness Engineering*, *Loop Engineering*. Keep them small and consistently placed; they're navigation, not content.
3. **Nine slides carry a pull-quote** under the bullets. That's the line you say verbatim while the room reads it, and it's where the punchy phrasing went after the titles were flattened.
4. **S11 and S17 break the three-bullet rule deliberately** — S11 is five named slots that scan as one block, S17 has two sub-points nested under one parent bullet. Both still read as three units.
5. **Assets you need to supply:** the failure screenshot (S1), the map (S3, S29), the before/after prompt pair (S12), and the six versions of the running example (S28).
6. **Timing:** 29 slides across 45 minutes is roughly 1.5 min each. That's tight. S28 is the safest cut if you're running long — it's a payoff slide, not a load-bearing one.
