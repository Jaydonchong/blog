---
name: make-process-visual
description: Use in the Blog repo when creating or changing interactive process diagrams that accompany an article.
---

# Make process visuals

Create diagrams from the approved article and workflow decisions.
Treat workflow descriptions as visual source material, not article copy, unless the user asks to include them in prose.

## Visual structure

Place each phase's earlier workflow above its later workflow in the article's reading flow.
Show how the earlier diagram transforms into the later one as new capabilities appear.
Animate added nodes or transitions when the reader reaches the relevant phase.
Use human and agent icons to show who performs each step.
Add a distinct deterministic-script indicator when static checks are shown.
Keep the happy path clear and readable.

Draw failure loops from the failing check or review to the step that must run again.
Place return paths along the side so they do not cover the successful path.
Use red for failure paths and omit a separate failure legend.

Make diagrams responsive at narrow mobile widths.
Use accessible labels and keyboard-operable controls.
Respect reduced-motion preferences.
Use the repository's existing visual tokens and components.
When a visual layout is not agreed and production UI is in scope, use the available `mockup-before-code` skill to align on a mockup before implementation.

## Accepted agentic-workflow phase semantics

Preserve these decisions when making or updating the agentic workflow article's diagrams.
For a different article, derive its diagrams from that article's accepted workflow.

- Phase 3 runs serially: Plan + align → Implement task A → Human review task A → Implement task B → Review task B → Done.
  Each failed review returns to that task's implementation.
  Do not insert a separate task-set stage between planning and the serial task sequence.
- Phase 4 runs Plan + align → Task set → Implement → Static checks → Agent review → Final human review.
  Static-check failure and agent-review failure each return to Implement.
- Phase 5 adds Record learnings after Final review.
- Phase 6 offers two options.
  Supervisor owns the Orchestrator and coordinated subagents in one parent container.
  Task, implementation, and agent-review branches join at a Synthesizer, which confirms both reviews pass before Final review.
  Choreographer has no Orchestrator and gives Task, Implement, and Review distinct boxes.
- Phase 7 gathers context, fans out to specialist planners, synthesizes their plans, implements, fans out to specialist reviewers, synthesizes review, then reaches Final human review.
