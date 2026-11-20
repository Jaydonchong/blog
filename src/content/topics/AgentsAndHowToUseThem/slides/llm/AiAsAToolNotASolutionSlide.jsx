function AiAsAToolNotASolutionSlide() {
  return (
    <div className="diag-above">
      {/* Horizontal flow graphic */}
      <div className="diag-figure">
        <div className="diag-flow" style={{ gap: 10 }}>
          <div className="dn">Human</div>
          <span className="da">→</span>
          <div className="dn dn--violet" style={{ fontWeight: 700 }}>AI</div>
          <span className="da">→</span>
          <div className="dn">
            <span>Python</span>
            <code className="dn__sub">print("Hello world")</code>
          </div>
          <span className="da">→</span>
          <div className="dn">
            <span>C</span>
            <code className="dn__sub">printf("Hello world")</code>
          </div>
          <span className="da">→</span>
          <div className="dn">Compiler</div>
          <span className="da">→</span>
          <div className="dn">
            <span>Machine Code</span>
            <code className="dn__sub">001010101</code>
          </div>
        </div>
      </div>

      <ul className="bullets">
        <li><span>Python hides C from you — this hides reasoning</span></li>
        <li><span className="strong">Every abstraction before this one was deterministic</span></li>
      </ul>
    </div>
  )
}

AiAsAToolNotASolutionSlide.meta = {
  title: 'AI as a tool, not a solution',
  section: 'llm',
  sectionLabel: 'What is an LLM',
  notes: 'Three ways it fails, each pointing forward: Python is deterministic (section 2), Python has a readable spec (section 3), Python will not invent a function that does not exist (hallucination). Use one out loud, keep the others for Q&A.',
}

export default AiAsAToolNotASolutionSlide
