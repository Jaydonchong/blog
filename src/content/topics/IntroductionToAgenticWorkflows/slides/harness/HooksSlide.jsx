function HooksSlide() {
  return (
    <div>
      <ul className="bullets">
        <li><span>Code that fires at fixed points in a run</span></li>
        <li><span>Run tests after an edit · notify on completion</span></li>
        <li><span>Session end: run a prompt that updates memory</span></li>
      </ul>
      <p className="pull">Deterministic scaffolding around a non-deterministic core.</p>
    </div>
  )
}

HooksSlide.meta = {
  title: 'Hooks',
  section: 'harness',
  sectionLabel: 'Harness Engineering',
  notes: 'Direct callback to the characteristics slide. Worth saying out loud if time allows: every time you catch yourself asking the model to reliably remember to do something, that is a hook.',
}

export default HooksSlide
