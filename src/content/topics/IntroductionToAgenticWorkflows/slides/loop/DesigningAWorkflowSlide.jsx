function DesigningAWorkflowSlide() {
  return (
    <div>
      <ul className="bullets">
        <li><span className="strong">Prompt → PRD → SPEC → PLAN → ISSUES</span></li>
        <li><span>Each stage's output is the next stage's context</span></li>
        <li><span>Every boundary is a cheap place to check, or restart</span></li>
      </ul>
    </div>
  )
}

DesigningAWorkflowSlide.meta = {
  title: 'Designing a workflow',
  section: 'loop',
  sectionLabel: 'Loop Engineering',
  notes: 'Real artefacts from a real feature are the most persuasive thing here; a genuine PRD the model wrote beats any diagram.',
}

export default DesigningAWorkflowSlide
