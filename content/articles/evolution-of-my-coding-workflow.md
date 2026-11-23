# An evolution of my coding workflow

*How I moved from asking an agent to write code toward building a workflow that can guide, check, and improve its own work.*

**Jaydon Chong · Field notes · Agentic workflows**

# Introduction

I stepped away from my software engineering career just as agentic workflows were becoming a major part of the conversation. A few months later, I found myself trying to catch up by teaching myself about agents and building a workflow of my own.

Learning something new is exciting. Learning something the world is still figuring out can be disorienting. What I learn this week could feel irrelevant by next Friday. Even well-known voices can use the word “agent” in conflicting ways.

My first lightbulb moment came from watching Matt Pocock talk about his agentic workflow. What clicked was the idea that AI works best as leverage within a workflow you shape, rather than as a black box expected to infer everything from one prompt.

This article follows how my workflow has evolved over time. I’ll keep updating it as I learn, and I hope the progression helps others build workflows of their own.

# Phase 0 · One-shotting

## Boilerplate was taking time away from meaningful work

After working with the same codebase for a while, I noticed that a huge chunk of the code I wrote was boilerplate already defined by team standards or repository structure. Meaningful logic came bundled with standardized classes, methods with minuscule variations, layers of dependency instantiation, and code around tech debt that was annoying but not bad enough to warrant a refactor.

Across different tasks, I kept meeting the same friction: I knew what the code needed to do, but still had to write familiar scaffolding around it. I started looking for a way to spend more attention on the decisions and less on the repetition.

## The plan did not contain every assumption

I began asking an agent to turn a requirement and plan into an implementation. That saved typing, but exposed a gap: the plan did not always contain every assumption I was carrying. When I left something unsaid, the agent still had to make a choice. A reasonable choice could still be different from what I intended, sending me back into review to explain a constraint I could have made clear earlier.

#### The workflow changes · Phase 0

# Phase 1 · Spec-driven development

## Planning was not the same as agreeing

An idea and its written description are rarely perfectly synchronized. I might know the outcome I wanted without having resolved an edge case, a fit with the existing system, or a tradeoff. Those undecided points became implementation decisions, and the agent had to infer what I meant.

I changed what happened before coding. I worked through ambiguous parts with the agent, sometimes asking it to challenge the plan. The goal was to surface assumptions and settle important decisions before implementation began. It did not make the agent deterministic; it gave us a clearer target and reduced how much it had to guess.

#### The workflow changes · Phase 1

# Phase 2 · Documentation and context

## Each task needed more than its own request

Working on different tasks showed me that a request was only one layer of context. Product rules, business context, codebase architecture, existing components, and known technical debt could all matter. Some context was new each time; much of it kept recurring.

If I did not provide the recurring context, an agent had to discover it. Discovery was available as a tool, but not a guarantee that it would find and apply everything relevant. I began documenting codebase guidance, product rules, and reusable patterns so each task could start from a steadier baseline.

#### The workflow changes · Phase 2

# Phase 3 · Task decomposition

## Large changes made mistakes harder to catch

Better plans and more context did not remove every problem. In a large change, an early mistaken assumption could affect several later decisions. By review time, the implementation might span enough files and concerns that it took more effort to find where the mismatch began.

I started treating context as a limited resource and splitting larger plans into smaller tasks. Each task had a narrower purpose and a more focused review. That gave me earlier chances to catch a problem before it spread. The goal was not simply to create more tasks, but to keep each step understandable to implement and review.

#### The workflow changes · Phase 3

# Phase 4 · Evals, testing, and review

## One kind of review could not catch every kind of problem

Across tasks, I saw that some issues were objective: a test failed, lint reported an error, or a build did not complete. Other questions were more subjective: whether a change followed conventions, completed the task, or met the expected standard of code quality.

I used hooks and deterministic scripts as static gates for objectively detectable issues. For subjective questions, I used other models as judges against a rubric for conventions, task completion, and code quality. I still did a final human review. A passing build does not prove that a task is complete, and a model’s positive review does not override a failing test.

#### The workflow changes · Phase 4

# Phase 5 · Feedback

## A correction needed to carry forward

A review could identify a mistake and prompt a fix, but the fix did not automatically help with the next similar task. If I corrected the same kind of issue again, the lesson could be trapped in the session where I first gave the feedback.

I started keeping an append-only list of learnings and mistakes. That let me capture feedback without treating every one-off correction as a permanent rule. Periodically, I could distill recurring lessons into guidance for future work. Feedback became part of the workflow: useful lessons could improve the next task’s starting point.

#### The workflow changes · Phase 5

# Phase 6 · Workflow

## Consistency created a coordination problem

As the process gained more defined steps, moving work between planning, breakdown, implementation, review, and follow-up became its own challenge. The workflow was more consistent, but still needed manual handoffs.

I found two ways to coordinate that work. With a Supervisor, one agent can delegate to coordinated subagents in the same session. With a Choreographer, separate agents can work in terminals and communicate through a multiplexer such as Herdr. I choose between them based on the task and the balance of coordination, visibility, and setup it needs.

#### The workflow changes · Phase 6

# Phase 7 · Specialization

## A workflow that improved quality started slowing the work down

By this point, the workflow was improving itself. Reviews caught recurring problems, and saved feedback helped future tasks produce better results. But every lesson added another constraint for the agent to follow.

I found myself watching an agent spend nearly an hour on a change that would usually take about twenty minutes. The logs and reviews showed it repeatedly changing and re-reviewing small issues, such as a comment that did not feel quite right or a test case considered unsatisfying. My effort to define quality had worked, but too many quality checks on one agent and task had created an overly cautious, pedantic loop. The extra process had become negative leverage for productivity.

## Different work needed different review criteria

I started splitting work by responsibility: one agent could focus on implementation, another on tests, and another on documentation. Review could also be divided by rubric, with each reviewer focused on a concern such as functional behavior, conventions, or comment accuracy.

I start with the smallest model that can handle a task, then use the final human review to evaluate how well that choice worked. If review shows that a role repeatedly misses important issues, I can adjust the model or the task’s review process for future runs. Each role needs a clear responsibility, focused criteria, and enough review effort for the risk involved.

#### The workflow changes · Phase 7

# Conclusion

Agents are probabilistic, so their behavior can be unpredictable and occasionally head-bangingly frustrating. Like any software, building an agentic workflow means learning to harness that behavior and identify, articulate, and resolve the problems in your workflow.
