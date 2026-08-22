function PromptFrameworkSlide() {
  return (
    <div>
      <ul className="bullets">
        <li><span><span className="term">Context</span> — tone, and where this lands</span></li>
        <li><span><span className="term">Scope</span> — goals, acceptance criteria, constraints</span></li>
        <li><span><span className="term">Steps</span> — the route, in order</span></li>
        <li><span><span className="term">Output</span> — the shape you want back</span></li>
        <li><span><span className="term">Examples</span> — show, don't describe</span></li>
      </ul>
    </div>
  )
}

PromptFrameworkSlide.meta = {
  title: 'Prompt Framework',
  section: 'prompt',
  sectionLabel: 'Prompt Engineering',
  notes: 'Naming settled: this slot is Steps, not "Instruction" or "Workflow". Workflow is now reserved for the multi-stage pipeline at S27. Output structure is the mechanical link to the consistency column one slide back.',
}

export default PromptFrameworkSlide
