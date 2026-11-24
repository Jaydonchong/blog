---
name: verify-visual
description: Use in the Blog repo when checking an article's rendered diagrams, interactions, animation, and mobile layout in a browser.
---

# Verify article visuals

Inspect the implemented article in the running blog site.
Use the standalone mockup only as a design reference; verify the production route separately.
Do not change the implementation during a review unless the user also asked for fixes.

## Browser checks

Open the article route and follow its phase navigation to each diagram.
Confirm the displayed labels, node order, actor icons, connectors, and failure returns match the accepted article workflow.
Scroll to diagrams to check reveal animations and confirm added nodes appear at the intended phase.
Exercise every diagram control and confirm that the visual state changes as labeled.

Check a desktop viewport and a narrow mobile viewport, including a 320px-wide viewport when practical.
Look for clipped labels, overlapping connectors, unreadable nodes, and horizontal page overflow.
Use compact measurements such as `document.documentElement.scrollWidth` and `innerWidth` to check overflow.
Capture screenshots when a visual judgment needs evidence.
Check the browser error surface for runtime errors.
Confirm reduced-motion preferences suppress nonessential animation when the visual uses motion.

Do not treat a static screenshot as evidence that a control or animation works.
If browser access is unavailable, report that limitation instead of claiming visual verification.
When implementation changes are in scope, run the repository's documented production build.
Report each finding with the affected phase and observable evidence.
