# System context for my context system

*How my context management grew from a single paragraph into a full-fledged system*

I did not start out trying to design a context system. I started by giving an agent a little more information about the project it was working in. Then I ran into the limits of that approach: project notes did not capture my general preferences, global instructions did not teach repeatable workflows, and each new harness made it harder to keep my setup consistent.

Each new layer came from a problem I had encountered in practice. Over time, those layers became a system for deciding where context should live, when an agent should load it, and how experience should change what the agent knows.

## 1. Repository documentation: giving an agent the project context

When I first asked an agent to help with a codebase, I noticed that my request was only part of the information it needed. The agent also needed to know what the project did, where the important parts lived, and how the repository expected work to be done.

I started with a paragraph of project context. As it became clear that some information mattered across many tasks, I gave that context a home in repository documentation.

A simple structure might look like this:

```text
project/
├── README.md       → purpose, setup, main entry points
├── docs/           → deeper explanations and reference material
└── AGENTS.md       → architecture, conventions, working instructions
```

For example, the agent instructions in this blog repository describe the app’s routes, where shared components live, which commands to run, and the conventions for adding slides. That lets an agent begin with a useful project map instead of reconstructing one from scratch.

The limitation was scope. Repository documentation helped the agent understand one codebase, but it did not capture preferences I wanted to carry between projects.

## 2. Global instructions: setting defaults in one harness

Some instructions did not belong in any one project. I wanted an agent to follow the same communication preferences and general working rules wherever I was working.

I put those instructions in a global `AGENTS.md` under Claude’s configuration directory:

```text
~/.claude/
└── AGENTS.md       → instructions shared across my projects

project-a/
└── AGENTS.md       → context specific to project-a
```

This separated general preferences from project facts. The two files answered different questions: “How should the agent work with me?” and “What does this particular project require?”

At this point, though, the global instructions belonged to Claude’s harness. That worked as long as I used one harness. It became harder as I began experimenting with others.

## 3. Procedural memory: turning repeated requests into skills

As I continued developing my agentic workflow, I noticed that I would request the same kinds of processes in different words. The wording changed, but the underlying intention was often the same.

Those procedures also became more complicated. Fine-tuning I discovered during one run could get lost before the next. I would have to explain the process again, remember which details mattered, and hope that the agent followed the improved version.

I started formalizing repeatable workflows as skills: procedures an agent could load when a task called for them.

```text
skills/
├── to-handoff/
│   └── SKILL.md       → gather state, write a handoff, verify it
└── code-loop/
    └── SKILL.md       → coordinate coding and review
```

A skill’s description tells the agent what the procedure does and when to use it. The body contains the steps. The skill-authoring guidance also covers how to keep procedures focused, make their triggers understandable, and move details into supporting files when they do not need to load every time.

Skills gave recurring work a stable place to improve. They also raised a new question: how could I keep those procedures available as I changed tools?

## 4. Preferential memory: finding a shared home for instructions

I began trying OpenCode and Codex alongside Claude. Moving my instructions between harnesses was difficult. I was still finding my footing with agents, and keeping `AGENTS.md` consistently updated in each harness became tedious.

Around then, I came across the idea of a second brain: one place to store knowledge so it could be retrieved and reused. I tried keeping one `AGENTS.md` as the source and symlinking it into each harness’s configuration.

```text
one shared AGENTS.md
   ├── symlink → ~/.claude/AGENTS.md
   ├── symlink → ~/.config/opencode/AGENTS.md
   └── symlink → ~/.codex/AGENTS.md
```

That experiment was the beginning of a broader context system. Instead of treating each harness as a separate place to maintain instructions, I started thinking about shared content that could be connected to different tools.

The symlink approach was a useful starting point, but it was not the final integration design. Different harnesses discover instructions, skills, and agents in different ways. The shared content needed adapters that could fit those differences.

## 5. Task decomposition: making larger work resumable and parallel work coherent

As my work grew beyond one session, the conversation became a fragile place to keep project state. I also began looking into multi-agent workflows, where multiple agents could work in parallel. Keeping their shared context aligned was difficult: each agent needed relevant decisions and constraints, but they could not all rely on the same conversation.

I started giving projects their own workspaces. Instead of asking each new agent to reconstruct the project from the conversation, I could point it to the same set of planning documents and current state.

```text
user-projects/
└── 2026-11-23-feature/
    ├── PRD.md              → user problem and goals
    ├── SPEC.md             → technical approach
    ├── PLAN.md             → implementation sequence
    ├── ISSUES.md           → tasks
    └── assets/
        └── HANDOFF.md      → current state and next action
```

The documents have different jobs. The plan describes the work; the issues divide it into tasks; the handoff tells a fresh agent what is complete and what to do next. For parallel work, the shared project artifacts give agents a common reference for decisions and constraints.

A handoff is deliberately compact. It points to the documents that already hold the details rather than copying all of them into one more file. That makes it useful as a bridge between sessions without turning it into another source of drift.

## 6. Episodic memory: keeping lessons from individual runs

Skills gave agents procedures to follow, but procedures still met real-world edge cases. A correction made during one run could disappear with the conversation. Keeping every conversation would preserve the history, but make it hard to find the lessons that mattered.

As I read about context engineering and different kinds of memory, I found it useful to distinguish three forms:

| Memory type | What it preserves | Example |
|---|---|---|
| **Procedural** | How to do something | A skill describes a repeatable handoff process. |
| **Episodic** | What happened in a particular run and what was learned | A review episode records a trigger, mistake, cause, and corrective rule. |
| **Semantic** | What is generally true or useful across situations | A distilled rule guides future coding work without requiring the agent to read the episode. |

I began adding feedback loops to capture lessons from runs and place them where they could help future work.

```text
skill run
  └── LEARNINGS.md         → reusable workflow lesson

code review rejection
  └── episode              → trigger · mistake · cause · corrective rule

harness tool failures
  └── reliability review   → recurring failure and scoped destination
```

These loops have different scopes. Skill learnings improve a workflow. Code episodes capture lessons from review rejections. Harness reliability feedback looks for recurring tool failures within one harness. The common idea is to capture the useful lesson rather than replay the entire conversation.

## 7. Semantic memory: distilling episodes into durable guidance

Recording episodes solved the problem of lessons disappearing, but it created another risk: if every future task loaded the episode history, the history itself would become a source of context bloat.

I needed a way to turn repeated lessons into concise guidance. Episodes became input to a distillation process. The distilled rule could then guide normal work without asking the agent to read every event that had led to it.

```text
review rejection
      │
      ▼
episode: trigger · mistake · cause · rule
      │
      ├── reusable across repositories
      │       └── shared coding guidance
      │
      └── specific to one repository
              └── that repository's conventions

future coding task ──loads──> relevant guidance
                               not the episode history
```

For example, a recurring code-review lesson that applies across projects can become shared coding guidance. A lesson about one repository’s specific tools or conventions belongs with that repository.

This gave experience a lifecycle: capture it as an episode, decide where it applies, and distill recurring lessons into guidance agents can use directly.

## 8. Composition over inheritance: routing knowledge in smaller pieces

As I added more skills, I noticed that tool definitions were taking up about 10% of my context window at startup. Most sessions needed only a handful of those tools, but their definitions were already using space.

Putting all the guides behind one entry point would not solve the problem if agents then had to read every guide. It would delay the context bloat instead of reducing how much irrelevant material a task received.

I began organizing durable knowledge into guides and routing agents to the parts relevant to the current work. A skill says how to act; a guide says what is useful to know while acting.

```text
guides/
├── SYSTEM.md              → registry and read/write protocol
└── coding/
    ├── GUIDE.md           → guide unit and routing metadata
    ├── PACKS.toon         → declares the available packs
    └── packs/
        ├── writing/       → guidance for code writers
        └── reviewing/     → guidance for reviewers

task → registry → relevant pack
```

`SYSTEM.md` explains how to find guidance and how guide units are organized. The registry routes the agent to a unit’s relevant pack. Rather than loading every guide, the agent reads the registry and then the pack that fits the task.

I had the agent use a lighter model to find the relevant context. Later, I recognized this as a basic combination of **agentic retrieval-augmented generation (RAG)** and **deferred tool calling**: retrieve knowledge when the task needs it and defer detailed capability loading until it is relevant.

## 9. Execution context: applying rules at the right time in each harness

Shared knowledge still had to work across different tasks and different tools. A coding rule should not load during every kind of task, and harness-specific installation details did not belong in universal instructions.

I separated task-specific hard rules into policies and documented how each harness connects to the shared content.

```text
task starts
   │
   ├── task-specific rules
   │     └── policies/code-writing.policies.md
   │
   └── harness integration
         ├── Claude Code → links and imports
         ├── Codex       → links shared files, copies agent adapters
         └── OpenCode    → links wrappers, registers skills
```

Policies load when the matching task begins. Harness documentation explains what each tool discovers and how to verify that discovery. The integrations can differ while still drawing from shared sources.

This keeps the general instructions focused while giving an agent the specific rules and setup it needs for the work in front of it.

## Context engineering is lifecycle design

I did not set out to build a context system all at once. Each layer answered a problem I had encountered: an agent lacked project knowledge; preferences were tied to one harness; repeated procedures were being re-explained; parallel work lacked a shared reference; lessons vanished with sessions; and loading everything at startup wasted context.

The result is not one large prompt. It is a set of context stores and loading paths, each with a purpose:

- **Repository documentation** explains a project.
- **Global instructions** carry preferences across projects.
- **Skills** preserve procedures.
- **Project workspaces and handoffs** preserve task state.
- **Episodes** capture experience.
- **Distilled guidance** preserves reusable lessons.
- **Guide routing** loads the knowledge relevant to a task.
- **Policies and harness integrations** shape how that context is applied.

The design questions became: **Where should this context live? When should it load? How can work resume? How does experience become useful to future work?**
