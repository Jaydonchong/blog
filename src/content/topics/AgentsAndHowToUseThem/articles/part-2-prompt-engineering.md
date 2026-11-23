# Part 2 · Prompt Engineering

*How to use and learn AI — a six-part series. Part 2 of 6.*
**Draft v1 · ~4,500 words · §2.5 filled with a placeholder pair · for everyone**

> **Budget note for the author:** the target is 3,000 and this is at ~4,500. §2.5's worked transformation is now filled with a *constructed* example — swap it for a real one. The remaining `[AUTHOR]` block is the running example v2, which will add another 300–500. Compress in this order: §2.6 anti-patterns, then §2.3's worked tests, then trim §2.5's after-output to two entries instead of three.

> The model is a stateless, non-deterministic function. Every technique in this series is about controlling what you feed it, what you let it touch, and how many times you let it go around. This part is about the feeding.

---

## The problem this layer solves

Here is a prompt someone sent last week:

> *Summarise this customer feedback and tell me what's important.*

It came back with six bullets. Every bullet was true. The summary was useless — it flattened forty complaints about one broken feature into the same weight as two people asking for dark mode. The person who asked took the six bullets into a meeting, argued for dark mode, and lost an hour.

Nothing malfunctioned. The model was asked to decide what "important" meant, and it decided — reasonably, and wrongly, because it had no idea that this quarter *important* means *churn risk* and not *most frequently mentioned*.

That's the whole of prompt engineering in one failure. Part 1 established that the model is a completion engine: it takes what you give it and produces the most plausible continuation. It does not know your context, it will not ask for it, and it will never abstain because the brief was thin. It will complete. Confidently.

So the prompt is not a question you ask. It is the entire universe the model gets to reason inside. Everything you leave out, it fills in with the statistical average of the internet — which is to say, with someone else's context.

This is the cheapest layer to fix and the one most people skip. It requires no tooling, no code, and no budget. The rest of this series is about what to do when a better brief genuinely isn't enough. Most of the time, it is.

---

## 2.1 What is a prompt

The chat box is a thin client over an HTTP request. Here is what a turn looks like on the wire — this is Anthropic's Messages API; OpenAI's differs in shape but not in kind:

```json
{
  "model": "claude-opus-5",
  "max_tokens": 4096,
  "system": "You are Claude, made by Anthropic. The current date is...",
  "messages": [
    { "role": "user",      "content": "Summarise this feedback..." },
    { "role": "assistant", "content": "Here are six themes..." },
    { "role": "user",      "content": "No, rank them by churn risk." }
  ],
  "tools": [ "...every connected tool, schema in full..." ],
  "temperature": 1.0
}
```

Three things in there are worth staring at.

**The standing instruction you didn't write.** Every consumer app prepends its own instructions before your first word — tone, refusal behaviour, formatting habits, the current date. Some vendors publish theirs; most apps don't surface them at all. Either way it isn't in the box you typed into, and it's a large part of why the same question gets a different-feeling answer in two apps running the same underlying model.

Note *where* it sits: `system` is a top-level field, a sibling of `messages`, not an entry inside it. That structural detail matters in 2.7.

**The full history, resent every time.** `messages` is not a pointer to a conversation on a server. It is the conversation, re-uploaded in full, on every single turn. This is the statelessness from Part 1 made concrete. The model isn't remembering your third message — your client is resending it. That has a cost, and the cost compounds, which is Part 3's entire subject.

**Tool definitions, in full, before you've asked anything.** If you have connectors enabled, their schemas ride along on every request. Part 4 gets into what that costs.

What comes back is equally unglamorous:

```json
{
  "role": "assistant",
  "content": [ { "type": "text", "text": "Ranked by churn risk:\n1. ..." } ],
  "stop_reason": "end_turn",
  "usage": { "input_tokens": 12480, "output_tokens": 310 }
}
```

`usage` is the line to notice. Input dwarfs output on almost every real request, and it grows every turn while you do nothing. Keep an eye on it; it's the number Part 3 is about.

The point for the technical reader is demystification: there's no hidden intelligence in the interface. The point for everyone else is more useful — *the thing you typed is a minority of what was sent*. When output surprises you, the invisible payload is usually why.

## 2.2 What is prompt engineering

Prompt engineering is the practice of structuring that payload so the completion you want is the most plausible one.

That's it. It is not incantation. There is no magic phrasing, no secret word that unlocks a better model. Every technique in this article has a mechanical reason it works, and if you can't state the reason, you're doing superstition.

The two levers are **structure** and **data**. Structure means the model doesn't have to guess what part of your message is the goal, what part is the constraint, and what part is background. Data means you supply the facts it can't have. Both are about reducing the number of things the model has to invent — because everything it invents, it invents plausibly, and plausibly wrong is the expensive failure mode.

## 2.3 What makes a prompt good

Two properties, and people almost always optimise the first while getting destroyed by the second.

### Reliability — is this answer any good?

**Is the output correct in my context.** General correctness is not enough. A legally accurate contract summary that ignores your jurisdiction is wrong. A technically correct code review that ignores your team's conventions is noise. Correctness is domain-relative, and the domain is the part only you can supply.

**Is the output verified — and by what.** Most people's verification is "I read it and it seemed fine." That works until volume or fatigue. What you actually want is a check that doesn't depend on your attention: a schema the output must parse against, a test that must pass, a second pass that grades the first. We build these properly in Part 5. For now, notice how rarely you have one.

### Consistency — will it be good tomorrow?

**Between runs and models.** This is the property non-determinism attacks directly. The same prompt, twice, gives you different text. Sometimes that difference is cosmetic and sometimes it changes the conclusion. *Test:* run it five times and diff the conclusions, not the wording. If three of five rank a different complaint first, you don't have a summariser, you have a coin.

**In structure.** Same shape every time. *Test:* can something downstream parse it without a human in between — a script, a spreadsheet import, a copy-paste into a template? If the field order moves or a heading vanishes on run four, the answer was never really usable, you were just fixing it by hand each time and not counting the cost.

**Of process.** Did it get there the same way, or did it get there by luck? *Test:* ask it to show its route, twice, and compare the routes rather than the answers. Two identical conclusions reached by different reasoning is the warning sign — it means the conclusion isn't being derived, it's being guessed at plausibly. An answer that was right by accident stops being right the moment the input shifts, and you will not see it coming, because the last fifty were fine.

> **Reliability is about this answer. Consistency is about tomorrow's.**

Hold that distinction. It's the reason the stack in 2.5 is worth the ceremony.

## 2.4 Prompt techniques

Three worth knowing, twenty seconds of theory each.

**Chain of thought** — ask for reasoning before the answer. (This is the standard term; it's what to search for.) The usual explanation is that the model commits token by token, so text it generates *before* the answer becomes context the answer can condition on — reasoning out loud buys computation before commitment. Treat that as a plausible story rather than settled fact: the research on *why* it helps is live, and work on faithfulness suggests the reasoning a model prints is often a rationalisation rather than a transcript of the computation. What is well measured is *where* it helps, and it's narrower than people assume — gains concentrate on maths and symbolic problems and are close to nil on soft judgement, commonsense and recall. The useful axis is symbolic versus not, not hard versus easy.

Two practical consequences. Don't reach for it on "rank these complaints by churn risk" — that's judgement, and you'll pay tokens for prose that reads like reasoning and isn't. And if you're on a reasoning model, don't add it at all: the deliberation is already happening internally and both major vendors advise against bolting "think step by step" on top.

**ReAct — reasoning plus acting.** Interleave thinking with doing: reason about what you need, take an action, observe the result, reason again. Hold onto this one. It is not really a prompting technique — it is the agent loop from Part 6, running once, by hand. Everything autonomous you'll read about later is this shape wrapped in a `while`.

**Few-shot** — show examples. The correction most people need: examples should be **representative, not exceptional**. The instinct is to reach for the tricky cases, because those are the ones that went wrong. But examples read as *"this is what the distribution looks like,"* so a set of edge cases teaches the model that edge cases are normal, and it starts finding them everywhere.

Bad set — three examples, all pathological:

```
Input: "your app deleted my data"        → churn risk: CRITICAL
Input: "cancelling, competitor is cheaper" → churn risk: CRITICAL
Input: "third outage this week"           → churn risk: CRITICAL
```

Every example is a five-alarm fire, so the model infers that five-alarm is the register. Feed it "the export button is in an odd place" and you'll get `HIGH`.

Good set — ordinary cases, spread across the range:

```
Input: "export is slow but works"         → churn risk: LOW    (annoyance, no alternative sought)
Input: "asked support twice, no reply"    → churn risk: MEDIUM (service failure, not product)
Input: "evaluating other vendors now"     → churn risk: HIGH   (explicit intent)
```

Three unremarkable cases that between them show what the *scale* means beat ten dramatic ones. Handle the genuinely hard cases as written constraints instead — "treat any mention of a competitor by name as at least HIGH" — where they instruct without distorting the distribution.

## 2.5 Structuring a good prompt — the stack

Five slots. This is the part to actually memorise.

> **Context · Scope · Steps · Output · Examples**

**Context** — tone, and where this lands. Who reads the output, what happens to it next, what register it should be in. "This goes in a customer-facing changelog" and "this goes in an internal Slack thread" produce different correct answers to the same question.

**Scope** — goals as *acceptance criteria*, plus requirements and constraints. This is the highest-leverage thing missing from most prompts, and it's missing because writing acceptance criteria forces you to know what you want, which is harder than asking. "Summarise this feedback" has no acceptance criteria. "Rank these by estimated churn risk, cite the quote that drove each ranking, and flag any theme mentioned by fewer than three customers as low-confidence" has three, and each one is a thing you can check.

**Steps** — the route, in order. This is the difference between giving someone a destination and giving them a route. Use a destination when you don't know the route and the model might know better than you. Use a route when you know the route and the model keeps taking a worse one. Most people give destinations by default and then get frustrated that the model didn't take their preferred path — a path they never mentioned.

**Output** — the shape you want back. A schema, a format, a template, a field list. This is the mechanical link to the consistency property in 2.3: you cannot get structural consistency by hoping for it, and you get it almost for free by specifying it. If anything downstream will parse this output, specify the structure. If a human reads it, specify it anyway — it's how you stop the model from burying the answer in preamble.

**Examples** — show, don't describe. Good ones are representative, minimal, and consistent with the Output spec. That last point is the one that bites: if your example doesn't match the schema you just asked for, the example wins, and you'll spend twenty minutes wondering why the format keeps drifting.

### The worked transformation

The single most useful thing in this article. One real prompt, before and after.

> **[AUTHOR — placeholder pair, swap for the real one.]** What follows is a constructed example standing in for a genuine prompt of yours. Replace both prompts and both outputs with real ones, timestamps visible, same model and same day for both runs. Keep the shape: before, why it's bad, after, slot-by-slot mapping.
>
> **The one thing the replacement must get right:** a reader with no domain knowledge has to look at the "before" output and see that it's bad. If judging it requires knowing the subject, this section fails silently — the reader nods along and learns nothing. The placeholder below passes that test on purpose: the vague quantifiers are visible as a defect to anyone, whether or not they've read the underlying feedback. Preserve that property. A fabricated citation, a summary that misses the obvious headline, a plan with a missing step. Not a subtly suboptimal code change.

This is the prompt from the top of this article. Forty-seven pieces of feedback from a support inbox, pasted in below the instruction.

**Before** — sent 24 July 2026, Claude Sonnet 5:

```
Summarise this customer feedback and tell me what's important.
```

Output, in full:

```
- Customers are generally positive about the product's core functionality
- Several users reported issues with the export feature
- Multiple requests for a dark mode option
- Some users found the onboarding process confusing
- A few mentions of pricing concerns
- Support response times were praised by several customers
```

Six bullets, all true. Look at the quantifiers: *several*, *multiple*, *some*, *a few*. Not one of them is a number, so nothing can be compared to anything else, and the six bullets sit in an order that reads as ranked but isn't. Forty-one of the forty-seven messages were about export — several of them reporting lost rows — and it is in slot two, weighted identically to the two people who asked for dark mode. You don't need to have read the feedback to see the problem. The output has no way to tell you which of these matters, and it doesn't say so.

**After** — same feedback, same model, same day:

```
[CONTEXT]
I run support for a B2B analytics product. This summary goes to
the product lead, who will use it to pick next sprint's priorities.
It will be argued over in a planning meeting.

[SCOPE]
Rank every distinct theme in this feedback by how much it should
influence next sprint.
Acceptance criteria:
  - Every theme carries a raw count: "N of 47".
  - Every theme cites one verbatim quote that drove its ranking.
  - Any theme raised by fewer than three customers is labelled
    LOW CONFIDENCE and sorted to the bottom regardless of severity.
  - Anything reporting data loss or incorrect output is flagged
    CORRECTNESS, and correctness outranks volume.
Constraint: do not merge themes to make the list tidier. If two
complaints have different causes, they are two themes.

[STEPS]
1. Tag each message with one theme. Note any that fit none.
2. Count per theme.
3. Flag correctness issues.
4. Sort: correctness first, then count, then low-confidence.

[OUTPUT]
A numbered list. Each entry exactly:
  N. THEME — count of 47 — [CORRECTNESS if applicable] — confidence
     Quote: "…"
     One sentence on what it would take to address.
Nothing before the list. Nothing after it except an "Unclassified"
line if step 1 found any.

[EXAMPLES]
1. EXPORT TIMEOUT — 12 of 47 — HIGH confidence
   Quote: "waited four minutes and it just spun"
   Likely a query timeout on large date ranges.

2. DARK MODE — 2 of 47 — LOW CONFIDENCE
   Quote: "would be nice to have a dark theme"
   Straightforward CSS work, no backend change.
```

Output, first three entries of six:

```
1. EXPORT DROPS ROWS — 23 of 47 — CORRECTNESS — HIGH confidence
   Quote: "exported the Q2 report and half the rows were missing,
   found out in the board meeting"
   Silent truncation on large exports; needs a row-count assertion
   before the file is written.

2. EXPORT TIMEOUT — 18 of 47 — HIGH confidence
   Quote: "waited four minutes and it just spun"
   Likely the same query path as #1; may be one fix, may be two.

3. ONBOARDING CONFUSION — 3 of 47 — MEDIUM confidence
   Quote: "took me a day to work out where to connect a data source"
   …
```

Dark mode came sixth, marked LOW CONFIDENCE. The meeting from the top of this article does not happen.

**Which slot did what.** Scope's acceptance criteria produced the counts, which is the entire difference between a list and a ranking. The low-confidence rule is what demoted dark mode — note that it's a rule, not a judgement, so it applies the same way next week on different feedback. The correctness flag is what separated the two export themes and put the data-loss one first, which raw volume alone would not have done. Output killed the preamble and forced the quote onto every line. Steps mattered less than it looks — the model would have found roughly this route on its own, and if you're economising, that's the slot to drop first. Examples earned its place in an unobvious way: the dark mode entry in the example set showed the model what a LOW CONFIDENCE entry looks like *without* implying dark mode was important, because examples teach shape, not priority.

Cost: the before prompt is nine words, the after is about 250 tokens on every run. *Tradeoffs*, at the foot of this article, is where that stops being worth it.

Skeleton of the rewrite, for reference while drafting:

```
[CONTEXT]  Who I am, who reads this, what happens to the output next.
[SCOPE]    Goal. Acceptance criteria as a checklist. Hard constraints.
[STEPS]    1. … 2. … 3. …   (only if the route matters)
[OUTPUT]   The exact structure. Fields, order, length limits.
[EXAMPLES] One or two representative pairs, matching the OUTPUT spec exactly.
```

Copy that. It is the deliverable of this article.

## 2.6 Anti-patterns

Self-evident once named, which is why naming them is worth 200 words.

**Vague adjectives.** "Make it professional." "Make it more engaging." These are not instructions, they're vibes, and the model will resolve them to the average of its training data rather than to your taste. Replace with an observable property: "no exclamation marks, no second person, under 150 words."

**Negation instead of direction.** "Don't be verbose" gives the model a thing to avoid and no thing to aim at, and leaves you no way to check compliance. "Three sentences maximum" gives it a target and gives you a test. Prefer the positive form wherever one exists.

**Politeness padding.** "I was wondering if you could possibly help me with…" costs tokens and pushes the actual request further down. Being civil is fine — there's some evidence that outright rudeness hurts — but the hedging preamble is doing nothing for you.

**Burying the ask.** Three paragraphs of background, then the request. Put the request first, then the background. With a long document, the reliable ordering is document first and question last; either way, the ask should not be in the middle. Part 3 covers why position matters at all.

**Contradictory constraints.** "Comprehensive but brief." "Creative but stick to the source." The model resolves the conflict somehow, silently, and you have no visibility into which side it dropped. If two constraints genuinely trade off, say which one wins.

**Examples that conflict with the output spec.** Covered above, but it earns a second mention because it's the hardest one to spot in your own prompt — you wrote both halves and they each look right on their own.

## 2.7 System prompts

A system prompt is a standing instruction applied to every message in a session, rather than to one message.

**How the providers handle it.** Both give you a dedicated channel for it, but they build it differently, and the difference is worth knowing if you ever move a prompt between them. Anthropic puts `system` at the top level of the request — a sibling of `messages`, exactly as in the JSON back in 2.1 — and `messages` itself only ever contains `user` and `assistant` turns. OpenAI instead puts it *inside* the message list as a first entry with its own role (`system`, or `developer` on newer models), and the Responses API offers a top-level `instructions` parameter as well.

Practically, this matters less than it looks. In both cases the instruction is marked as privileged and the model is trained to weight it more heavily than a conflicting user turn. What actually differs between providers is adherence and length tolerance — how hard the model holds the line, and how much you can put there before the tail starts getting ignored. Neither is enforcement. **A system prompt is a strong prior, not a guarantee**, and a determined user message can talk over it. If you need a guarantee, you need code around the model rather than words inside it — that's Part 5.

**How we define them in practice.** In tools like Claude Code, most of what you'd think of as your system prompt lives in a file in your project: `CLAUDE.md`, or `AGENTS.md`. Strictly it's project context loaded alongside the tool's own system prompt rather than replacing it, but the effect is the one that matters — read at session start, applies to everything after. This is where project conventions live: the stack you use, the patterns you've standardised on, the things you'd otherwise re-explain every morning.

What belongs there versus in the prompt: **the instruction file holds what's true for every task; the prompt holds what's true for this one.** If you find yourself pasting the same paragraph into three prompts a week, it belongs in the file. If it only applies today, it doesn't.

### Instruction file vs memory file

These are different in kind, and readers conflate them constantly — partly because they're both markdown files sitting in a repo. Part 3 introduces `MEMORY.md`. Here is the comparison, so it's settled before you meet the second one:

| | **Instruction file** (`CLAUDE.md`, `AGENTS.md`) | **Memory file** (`MEMORY.md`) |
|---|---|---|
| **What it holds** | Rules. How we do things here. | State. What happened, and what's true now. |
| **Who writes it** | You, by hand. | The agent, mostly — accumulated over sessions. |
| **How it changes** | Edited deliberately, rarely. | Appended continuously, often. |
| **When it's read** | Every message. It's part of the standing instruction on every request. | Session start, or fetched on demand — it's material the agent pulls in, not a standing rule. |
| **Characteristic failure** | Goes stale — describes a convention you abandoned. | Grows without bound — becomes the token bloat problem it was meant to solve. |
| **Right maintenance** | Review when the convention changes. | Curate ruthlessly; deletion is the skill. |

The one-line version: **an instruction file is rules you write, a memory file is state the model accumulates.** If you remember nothing else from this section, remember that the maintenance failure modes are opposites — one rots by standing still, the other by growing.

---

## The running example, v2

**v1 (Part 1)** was the board reviewer as a single chat message. It produced something plausible and had three defects: it summarised the wrong things, its output shape changed every run, and it silently invented status values that don't exist on the board.

**v2** is that same request, rewritten through the stack.

> **[AUTHOR — supply v2.]** Show the full stacked prompt and its output, diffed against v1. Two of the three v1 defects should visibly close here: wrong emphasis is fixed by Scope's acceptance criteria, and shape drift is fixed by the Output spec.
>
> The third defect — invented status values — should **not** close. That's the point. Prompting can't fix it, because the model has no way to know what statuses exist. That failure is the hook into Part 3.
>
> **Continuity to confirm when Part 3 is drafted:** this hands Part 3 the job of fixing invented statuses, which means v3's memory file has to explicitly record the board's valid status enum. If instead you'd rather the fix be *reading the board directly*, that's a Part 4 (tools) fix and this paragraph should point there. Either works — pick one deliberately rather than discovering the mismatch mid-draft.

## Tradeoffs, and when not to bother

Structure has a cost. Say it plainly.

**The stack is overkill for one-off questions.** If you're asking something once, throwaway, and you'll eyeball the answer — just ask. The ceremony pays off on repetition, and only on repetition.

**Long prompts are not free.** Every slot you add is tokens on every run. A 900-token prompt scaffold on a task you run 200 times a day is a real bill, and Part 3 will argue that it's also a quality cost.

**Over-specified Steps make the model worse at things it's good at.** If you dictate a route through a problem you don't fully understand, you cap the output at your own understanding. Give a destination when the model plausibly knows the terrain better than you do.

**Rough decision rule:** if you'll run it more than three times, or if you'll act on the output without reading it closely, use the stack. Otherwise don't.

## What breaks next

Rewrite the prompt and a whole class of failure disappears. Then you hit the wall.

The model still doesn't know what's on your board, what you decided last Tuesday, what your codebase looks like, or what it told you an hour ago. You can paste some of that in — and you will, and it'll work — right up until the paste gets long enough that the answers start degrading rather than improving. That's not a bug in your prompt. It's the next layer.

**Part 3 is Context Engineering:** what the model knows, how to get information in front of it without drowning it, and the counterintuitive fact that more context makes the output worse past a point that arrives sooner than you'd think.

---

*Part 1 · What is an LLM ← · → Part 3 · Context Engineering*
