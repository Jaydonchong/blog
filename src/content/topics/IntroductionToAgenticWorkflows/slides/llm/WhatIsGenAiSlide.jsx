function WhatIsGenAiSlide() {
  return (
    <div className="diag-figure">
      <div className="diag-flow" style={{ gap: 24 }}>
        <div className="dn">Human</div>
        <span className="da">→</span>
        <div className="dn dn--thin">ChatGPT</div>
        <span className="da">→</span>
        <div className="dn" style={{ padding: '20px 26px', gap: 12 }}>
          <span className="dn__sub" style={{ letterSpacing: '0.06em' }}>LLM</span>
          <svg className="diag-svg" width="310" height="186" viewBox="0 0 200 120">
            {/* Connections — draw before nodes so nodes sit on top */}
            <line x1="20" y1="60" x2="75" y2="20" stroke="#d9d5cf" strokeWidth="0.55"/>
            <line x1="20" y1="60" x2="75" y2="60" stroke="#d9d5cf" strokeWidth="0.55"/>
            <line x1="20" y1="60" x2="75" y2="100" stroke="#d9d5cf" strokeWidth="0.55"/>
            <line x1="75" y1="20" x2="130" y2="20" stroke="#d9d5cf" strokeWidth="0.55"/>
            <line x1="75" y1="20" x2="130" y2="60" stroke="#d9d5cf" strokeWidth="0.55"/>
            <line x1="75" y1="20" x2="130" y2="100" stroke="#d9d5cf" strokeWidth="0.55"/>
            <line x1="75" y1="60" x2="130" y2="20" stroke="#d9d5cf" strokeWidth="0.55"/>
            <line x1="75" y1="60" x2="130" y2="60" stroke="#d9d5cf" strokeWidth="0.55"/>
            <line x1="75" y1="60" x2="130" y2="100" stroke="#d9d5cf" strokeWidth="0.55"/>
            <line x1="75" y1="100" x2="130" y2="20" stroke="#d9d5cf" strokeWidth="0.55"/>
            <line x1="75" y1="100" x2="130" y2="60" stroke="#d9d5cf" strokeWidth="0.55"/>
            <line x1="75" y1="100" x2="130" y2="100" stroke="#d9d5cf" strokeWidth="0.55"/>
            <line x1="130" y1="20" x2="185" y2="20" stroke="#d9d5cf" strokeWidth="0.55"/>
            <line x1="130" y1="20" x2="185" y2="60" stroke="#d9d5cf" strokeWidth="0.55"/>
            <line x1="130" y1="20" x2="185" y2="100" stroke="#d9d5cf" strokeWidth="0.55"/>
            <line x1="130" y1="60" x2="185" y2="20" stroke="#d9d5cf" strokeWidth="0.55"/>
            <line x1="130" y1="60" x2="185" y2="60" stroke="#d9d5cf" strokeWidth="0.55"/>
            <line x1="130" y1="60" x2="185" y2="100" stroke="#d9d5cf" strokeWidth="0.55"/>
            <line x1="130" y1="100" x2="185" y2="20" stroke="#d9d5cf" strokeWidth="0.55"/>
            <line x1="130" y1="100" x2="185" y2="60" stroke="#d9d5cf" strokeWidth="0.55"/>
            <line x1="130" y1="100" x2="185" y2="100" stroke="#d9d5cf" strokeWidth="0.55"/>
            {/* Input node — violet */}
            <circle cx="20" cy="60" r="9" fill="#6b5bf5" stroke="#4b3ddb" strokeWidth="1"/>
            {/* H1 */}
            <circle cx="75" cy="20" r="7" fill="#f7f6f3" stroke="#2b3140" strokeWidth="0.8"/>
            <circle cx="75" cy="60" r="7" fill="#f7f6f3" stroke="#2b3140" strokeWidth="0.8"/>
            <circle cx="75" cy="100" r="7" fill="#f7f6f3" stroke="#2b3140" strokeWidth="0.8"/>
            {/* H2 */}
            <circle cx="130" cy="20" r="7" fill="#f7f6f3" stroke="#2b3140" strokeWidth="0.8"/>
            <circle cx="130" cy="60" r="7" fill="#f7f6f3" stroke="#2b3140" strokeWidth="0.8"/>
            <circle cx="130" cy="100" r="7" fill="#f7f6f3" stroke="#2b3140" strokeWidth="0.8"/>
            {/* Output */}
            <circle cx="185" cy="20" r="7" fill="#f7f6f3" stroke="#2b3140" strokeWidth="0.8"/>
            <circle cx="185" cy="60" r="7" fill="#f7f6f3" stroke="#2b3140" strokeWidth="0.8"/>
            <circle cx="185" cy="100" r="7" fill="#f7f6f3" stroke="#2b3140" strokeWidth="0.8"/>
          </svg>
          <span className="dn__sub" style={{ letterSpacing: '0.05em' }}>Neural Network</span>
        </div>
      </div>
    </div>
  )
}

WhatIsGenAiSlide.meta = {
  title: 'What is GenAI',
  subtitle: 'AI is the name of the phenomenon, Machine Learning is the practice to create it, and neural network is the technique used',
  section: 'llm',
  sectionLabel: 'What is an LLM',
  notes: 'One nesting: AI is the field, a model is the artefact, generative models produce content, and an LLM is the generative model that produces text by predicting the next token. Everything after this slide is a consequence of that last clause.',
}

export default WhatIsGenAiSlide
