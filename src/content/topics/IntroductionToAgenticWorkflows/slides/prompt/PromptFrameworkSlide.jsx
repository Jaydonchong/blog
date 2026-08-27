function PromptFrameworkSlide() {
  return (
    <div className="diag-2col">
      <ul className="bullets">
        <li><span><span className="term">Situation</span> — tone, and where this lands</span></li>
        <li><span><span className="term">Scope</span> — goals, acceptance criteria, constraints</span></li>
        <li><span><span className="term">Steps</span> — the route, in order</span></li>
        <li><span><span className="term">Output</span> — the shape you want back</span></li>
        <li><span><span className="term">Examples</span> — show, don't describe</span></li>
      </ul>

      <div className="diag-stack diag-stack--violet">
        <div className="diag-stack__title">Prompt</div>
        <div className="diag-stack__slot">Situation</div>
        <div className="diag-stack__slot">Scope</div>
        <div className="diag-stack__slot">Steps</div>
        <div className="diag-stack__slot">Output</div>
        <div className="diag-stack__slot">Examples</div>
      </div>
    </div>
  )
}

PromptFrameworkSlide.meta = {
  title: 'Prompt Framework',
  section: 'prompt',
  sectionLabel: 'Prompt Engineering',
  notes: 'Naming settled: the first slot is Situation, not Context — Context is the whole layer two sections later, and reusing the word here makes the callback land wrong. This slot is Steps, not "Instruction" or "Workflow". Workflow is now reserved for the multi-stage pipeline at S27. Output structure is the mechanical link to the consistency column one slide back.',
}

export default PromptFrameworkSlide
