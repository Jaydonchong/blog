# Handoff: Building my own agent harness article

## Next focus

Continue the article from the full prose draft below, using the working outline as the scope reference.
The prose draft is ready for Jaydon's review; no new editorial revision has been requested in this handoff turn.
[from Jaydon: request to write a separate Markdown review draft, followed by request to hand off with both outline and content]

## Outline and content

| Artifact | Absolute path | Role |
| --- | --- | --- |
| Working outline | [building-my-own-harness-outline.md](/Users/jaydonchong/repos/blog/content/articles/building-my-own-harness-outline.md) | Settled structure, examples, visualization plan, and references. |
| Full article content | [building-my-own-harness-draft.md](/Users/jaydonchong/repos/blog/content/articles/building-my-own-harness-draft.md) | Separate narrative review draft; revise this file when processing prose feedback. |
| Harness repository | /Users/jaydonchong/repos/agenticDir | Implementation evidence for the article, whose public project name is jharness. |

The outline describes the intended design, including capabilities not yet built.
The draft introduces components in nine phases and preserves a linked contents section.
[read: /Users/jaydonchong/repos/blog/content/articles/building-my-own-harness-outline.md:59; /Users/jaydonchong/repos/blog/content/articles/building-my-own-harness-draft.md:13; /Users/jaydonchong/repos/blog/content/articles/building-my-own-harness-draft.md:23]

## Current state

- Last completed article checkpoint: `cb0b9dc Write agent harness architecture article review draft`.
  The commit adds the separate prose draft; the preceding outline checkpoint is `f35f9fa Integrate author turning points into harness outline`.
  [from local Git inspection during handoff preparation]
- No outline or draft edits are in flight during handoff preparation.
  The working tree was clean before this handoff file was created.
  [from local Git status during handoff preparation]
- The draft contains the outline's 31 TypeScript excerpts unchanged and 32 diagram placeholders.
  No diagrams were created in the prose draft.
  The outline retains its earlier ASCII diagrams.
  [from local structural validation during handoff preparation; read: /Users/jaydonchong/repos/blog/content/articles/building-my-own-harness-draft.md:17; /Users/jaydonchong/repos/blog/content/articles/building-my-own-harness-outline.md:150]
- The draft preserves the outline's 181 recorded source URLs when matched by source page or commit, and adds sources used while writing.
  The references appendix and inline links are part of the deliverable.
  [from local structural validation during handoff preparation; read: /Users/jaydonchong/repos/blog/content/articles/building-my-own-harness-draft.md:1336]
- Repository references are pinned to harness snapshot `e9f7a1872f51c1952e4a7ce49eaf0e0a15ead695`.
  Treat that snapshot as the article's evidence baseline rather than a claim about later repository changes.
  [read: /Users/jaydonchong/repos/blog/content/articles/building-my-own-harness-draft.md:1529]
- No site source currently mentions `building-my-own-harness`.
  The article remains a Markdown review artifact rather than a registered site article.
  [from search of /Users/jaydonchong/repos/blog/src during handoff preparation]

## Settled editorial decisions

These constraints come from Jaydon's instructions in this conversation.
The instructions apply to subsequent revisions unless Jaydon changes them.

| Concern | Direction |
| --- | --- |
| Framing | Write an architecture walkthrough for developers comfortable with TypeScript and APIs. Do not label the article a tutorial or turn the excerpts into a turnkey build-along. |
| Intended design | Discuss the intended final product, including unbuilt capabilities. Do not restore an implementation-status table or remove planned concepts merely because the current code lacks them. |
| Scope | Explain agent components. Exclude controller-layer, service-layer, and application-startup exposition. The collector and observability backend architecture remain explicitly in scope. |
| Progression | Let each transition explain the problem the next component solves. Jaydon will vet the transition prose. Keep advanced concepts as brief anecdotes within their existing sections. Do not force a continuous running example. |
| Code excerpts | Show only the concern being explained: contracts or happy paths first, retries and error handling in their section, instrumentation in Observability. Simplified excerpts are intentional; do not add production boilerplate throughout. |
| Missing implementation examples | Use a process visualization rather than an invented implementation sketch. For this review draft, retain placeholders because Jaydon explicitly deferred diagram creation. |
| Visualizations | Preserve planned architecture, class, and process diagram locations. Do not create diagrams until Jaydon requests them. |
| Model context | Say the model receives one request at a time, with messages and conversation history selected by the harness. Do not say the model remembers only the latest message or that API requests literally contain only one message. |
| Loop alternatives | A continuation scenario without tool calls is a conceptual alternative, not a claim that the current loop implements it. |
| Prompts and permissions | Explain system prompts generally; provider representation is an implementation detail. Explain both configured capabilities and enforcement when tools are invoked. The intended permission design can exceed the current implementation. |
| Multiple models | Explain the harness coordinating task-appropriate generation, compaction, embedding, reranking, and classification models alongside deterministic algorithms. Avoid universal claims that every deployment requires multiple models. |
| ContextAssembler | Keep a separate Memory/Context section explaining multiple production context sources, upstream data pipelines, and request-time selection. Fresh observations can also arrive through tools and APIs. |
| Memory | Distinguish memory types from access boundaries. Describe typed memory tools available during conversation; optional initial context does not replace on-demand memory access. |
| Compaction | The main compaction section covers session-message compaction only. Keep memory distillation under Memory and retrieved-evidence shortening under RAG. |
| Retrieval | Keep rank fusion separate from reranking. Preserve the brief treatment of advanced RAG techniques. |
| References | Retain all recorded sources as part of the article. Source links illustrate components; source links do not prove every intended capability exists. |
| Personal narrative | Use the supplied experiences below. Do not invent incidents, measurements, dates, or quotations. |

[from Jaydon: article corrections, scope instructions, visualization decisions, ContextAssembler request, and turning-point notes in this conversation]

### Observability hierarchy

Preserve this requested structure.
[from Jaydon: explicit Observability refactor request]

- Observability
  - Architecture: collector, Tempo, Prometheus, and Grafana roles.
  - Instrumentation
    - Tracing: agent loop; compaction.
    - Metrics: agent loop; compaction; memory.
  - Evals
    - Online evals: conversation; retrieval; compaction.
    - Offline evals.

The draft implements this hierarchy in Phase 9.
[read: /Users/jaydonchong/repos/blog/content/articles/building-my-own-harness-draft.md:967]

### Author experiences already incorporated

These observations came from Jaydon; preserve their meaning when editing the narrative.

| Experience | Draft location |
| --- | --- |
| A Google Calendar agent answered “What's on this month?” with the same month from the previous year. Dynamic date context became necessary. Preserve the observation without presenting training data as a proven sole root cause. | /Users/jaydonchong/repos/blog/content/articles/building-my-own-harness-draft.md:501 |
| Agents with different responsibilities retrieved irrelevant, similarly worded memories from a shared store. Configuring memory boundaries improved the observed result. | /Users/jaydonchong/repos/blog/content/articles/building-my-own-harness-draft.md:629 |
| Evals were hardest to understand because explanations stayed abstract. Separating online and offline evaluation made implementation easier to understand. | /Users/jaydonchong/repos/blog/content/articles/building-my-own-harness-draft.md:1180 |
| Understanding asynchronous orchestration of deterministic transformations and distinct model roles made process design more intuitive. Advice such as “normalize words” had omitted which component performed the operation. | /Users/jaydonchong/repos/blog/content/articles/building-my-own-harness-draft.md:118; /Users/jaydonchong/repos/blog/content/articles/building-my-own-harness-draft.md:750 |
| Memory is a tool capability during conversation, not only a once-per-session preprocessing step. Typed tools make memory access clearer than requiring the model to choose Bash commands and query conventions. | /Users/jaydonchong/repos/blog/content/articles/building-my-own-harness-draft.md:661 |

[from Jaydon: five turning-point notes in this conversation]

## Next actions

1. Read the outline and full prose draft linked above before revising.
2. Process Jaydon's next review comments against the prose draft; no further rewrite is specified yet.
3. Keep the outline as the scope reference, and change the outline only when feedback changes structure or scope.
4. Commit completed work locally; push only when explicitly requested.

Do not publish the article, register the article in the site, or create diagrams as an implied continuation of this handoff.
[from Jaydon: separate review-file request and diagram deferral; read: /Users/jaydonchong/repos/blog/AGENTS.md:1]

## Working instructions and skills

| Absolute path | When needed |
| --- | --- |
| /Users/jaydonchong/repos/blog/AGENTS.md | Repository instructions, build requirements, and local commit workflow. |
| /Users/jaydonchong/jaygents/COMMUNICATION.md | Communication and sentence-per-line Markdown conventions. |
| /Users/jaydonchong/repos/blog/.agents/skills/write-article/SKILL.md | Prose writing or revision within the approved scope. The current Phase N headings follow this skill. |
| /Users/jaydonchong/repos/blog/.agents/skills/brainstorm-article/SKILL.md | Editorial discussion or outline evaluation when requested. |
| /Users/jaydonchong/repos/blog/.agents/skills/make-process-visual/SKILL.md | Creating article diagrams after Jaydon requests diagram work. |
| /Users/jaydonchong/repos/blog/.agents/skills/verify-visual/SKILL.md | Browser verification after visual work exists. |
| /Users/jaydonchong/repos/blog/CONVENTION.md | Required before changing slides or topics; no slide or topic changes are part of the present handoff. |

Use `/code-loop` only if Jaydon explicitly requests it.
[from Jaydon: temporary code-loop override in supplied AGENTS.md instructions]

This handoff requests no code changes.
Apply the relevant code-writing rules if a later revision changes executable examples.
[from Jaydon: request to hand off the article work]

## Verification and remaining review

Structural validation during handoff preparation confirmed unchanged excerpts, source preservation, linked section anchors, the Observability hierarchy, and diagram placeholders.
The validation output was:

```text
Validated 31 unchanged code excerpts, 22 reference-style links, and all section anchors.
Preserved all 181 recorded source URLs (matched by source page/commit) and the requested Observability hierarchy.
Confirmed 32 placeholders with no created diagrams; approved outline unchanged.
```

[from executed local structural validation during handoff preparation]

The checks above establish document consistency, not live integration behavior or author approval of the prose.
Jaydon's review remains the next editorial input.
[from scope of the structural checks; from Jaydon: request for a separate file to review]
