function WhatIsAiSlide() {
  return (
    <ul className="bullets">
      <li><span>AI, Model, Gen AIs and LLMs (Next token prediction)</span></li>
    </ul>
  )
}

WhatIsAiSlide.meta = {
  title: 'What is AI',
  section: 'llm',
  sectionLabel: 'What is an LLM',
  notes: 'One slide, one nesting: AI is the field, a model is the artefact, generative models produce content, and an LLM is the generative model that produces text by predicting the next token. Everything after this slide is a consequence of that last clause.',
}

export default WhatIsAiSlide
