function AiAsAToolNotASolutionSlide() {
  return (
    <div>
      <ul className="bullets">
        <li><span>Python hides C from you — this hides reasoning</span></li>
        <li><span>Where GenAI sits: AI → ML → deep learning → generative → LLMs</span></li>
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
