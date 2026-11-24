---
name: write-process-articles
description: Use only in the Blog repo when evaluating or drafting a process article, creating its interactive workflow diagrams, or verifying those visuals in a browser.
---

# Write process articles

Use this skill for four stages: writing brainstorm, article drafting, process visual creation, and visual verification.
Run only the stages the user requests.
Keep the article, visual, and browser checks within the user's stated scope.

## Before you start

Read the repository's agent instructions and article conventions before editing its content or UI.
Inspect the supplied draft, outline, or existing article before suggesting changes.
Identify whether the user wants feedback, prose, diagrams, or browser verification.
Do not rewrite an article when the user only asked for critique.
Treat the user's latest explicit direction as authoritative for the current edit.

## Writing brainstorm

State the article's central point, intended reader, and narrative arc using the supplied material.
Check that each phase follows a clear progression from a concrete problem to a decision and a change in practice.
Identify ambiguities, unsupported claims, missing transitions, repeated ideas, and sections where the cause of a workflow change is unclear.
Show specific examples of sharper wording or structure so the author can choose a direction.
Ask only for facts or decisions needed to avoid inventing the author's experience.
Keep workflow notation out of article prose when the author wants it used only for diagrams.

## Write

Turn the approved outline into an article without replacing the author's point of view or altering material the user asked to preserve.
Use first-person narration for the author's experience.
Explain what happened during work, why it was frustrating, what the author decided to change, and what the change made possible.
Use generic examples across different tasks when requested, and tie each problem to work done with the described workflow.
Show capabilities accumulating over time when the phases describe incremental growth.
Use `Phase N` prefixes and split each phase into meaningful subsections.
Write concrete, story-like paragraphs instead of compressed summaries.
Keep claims proportional to the author's evidence and do not invent dates, metrics, quotations, or personal events.
For long Markdown articles, put each full sentence on its own source line and preserve paragraph breaks.

## Make process visuals

Derive diagrams from the approved article and the user's accepted workflow decisions.
Treat workflow instructions as visual source material, not article copy, unless the user asks otherwise.
For each phase, show the earlier workflow above the later workflow in the article's reading flow.
Animate added nodes or transitions as the reader reaches the later workflow.
Use distinct human, agent, and deterministic-script indicators when those roles matter.
Keep the successful path clear and route each failure loop from the failing check or review to the step that must run again.
Use red for failure loops and omit a separate failure legend.
Use the repository's existing visual tokens and components.
If the visual layout is not agreed, use the available `mockup-before-code` skill to align on a mockup before changing production UI.

For the agentic workflow article, preserve these accepted semantics:

- Phase 3 runs serially: Plan + align → Implement task A → Human review task A → Implement task B → Review task B → Done.
  Each failed review returns to that task's implementation.
  Do not add a separate task-set stage between planning and the serial task sequence.
- Phase 4 runs Plan + align → Task set → Implement → Static checks → Agent review → Final human review.
  Static-check failure and agent-review failure each return to Implement.
- Phase 5 adds Record learnings after Final review.
- Phase 6 offers two coordination choices.
  Supervisor owns the Orchestrator and coordinated subagents in one parent container.
  Task, implementation, and agent-review branches join at a Synthesizer, which confirms both reviews pass before Final review.
  Choreographer has no Orchestrator and gives Task, Implement, and Review their own boxes.
- Phase 7 gathers context, fans out to specialist planners, synthesizes their plans, implements, fans out to specialist reviewers, synthesizes review, then reaches Final human review.

Make diagrams responsive, accessible, and operable by keyboard.
Support reduced-motion preferences for nonessential animation.

## Verify visuals

Open the implemented article in the running blog site, not only a standalone mockup.
Check the article route, phase navigation, all diagrams, and any visual controls.
Scroll through the article to confirm node order and reveal animations.
Check a desktop viewport and a narrow mobile viewport for clipped labels, overlapping connectors, and horizontal overflow.
Use compact browser measurements first and capture screenshots when visual inspection adds evidence.
Check the browser's error surface for runtime errors.
Confirm reduced-motion preferences suppress nonessential animation when the visual uses motion.
Run the repository's documented production build when implementation is in scope.
Report what was verified and name any browser or device conditions that remain unverified.
Do not publish or push unless the user asks.
