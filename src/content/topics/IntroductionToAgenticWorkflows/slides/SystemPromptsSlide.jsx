function SystemPromptsSlide() {
  return (
    <ul className="bullets">
      <li><span>A standing instruction applied to every message</span></li>
      <li><span className="mono">In practice, a file in your project: CLAUDE.md, AGENTS.md</span></li>
      <li><span>Rules you write — not state the model accumulates</span></li>
    </ul>
  )
}

SystemPromptsSlide.meta = {
  title: 'System prompts',
  section: 'prompt',
  sectionLabel: 'Prompt Engineering',
  notes: 'Naming discipline: three filenames across this slide and the memory slide. Always lead with the concept — "instruction file" here, "memory file" there. Settled: the full comparison table lives in article Part 2 and appendix A7, not in the presented deck. OpenAI vs Claude: both expose a separate system role; differences are adherence and length tolerance, not mechanism.',
}

export default SystemPromptsSlide
