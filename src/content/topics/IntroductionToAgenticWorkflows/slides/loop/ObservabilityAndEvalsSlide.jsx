function ObservabilityAndEvalsSlide() {
  return (
    <div>
      <ul className="bullets">
        <li><span><span className="term">LLM as judge</span> — a second model grades the first</span></li>
        <li><span><span className="term">Golden datasets</span> — hand-labelled, known-good answers</span></li>
        <li><span><span className="term">Static evals</span> — did it compile, validate, pass the tests</span></li>
      </ul>
      <p className="pull">Log every run: cost, context size, tool calls, outcome.</p>
    </div>
  )
}

ObservabilityAndEvalsSlide.meta = {
  title: 'Observability and evals',
  section: 'loop',
  sectionLabel: 'Loop Engineering',
  notes: 'LLM-as-judge needs calibrating against human labels before you trust it; watch for position and verbosity bias. Golden datasets need fewer examples than people think to start. Without logging you cannot debug a loop, only restart it.',
}

export default ObservabilityAndEvalsSlide
