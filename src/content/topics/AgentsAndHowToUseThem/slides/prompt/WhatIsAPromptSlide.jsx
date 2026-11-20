function WhatIsAPromptSlide() {
  return (
    <div className="diag-above">
      {/* Graphic: Human → [Prompt↓] → ChatGPT(thin) → LLM(big) */}
      <div className="diag-figure">
        <div className="diag-flow" style={{ gap: 14, alignItems: 'flex-end' }}>
          <div className="dn">Human</div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
            <div className="dn dn--violet">Prompt</div>
            <svg className="diag-svg" width="2" height="26" style={{ margin: 0 }}>
              <line x1="1" y1="0" x2="1" y2="26" stroke="#6b5bf5" strokeWidth="1.5"/>
            </svg>
            <svg className="diag-svg" width="62" height="18" style={{ margin: 0 }}>
              <line x1="0" y1="9" x2="55" y2="9" stroke="#6b5bf5" strokeWidth="1.5"/>
              <polygon points="51,4 58,9 51,14" fill="#6b5bf5"/>
            </svg>
          </div>
          <div className="dn dn--thin">ChatGPT</div>
          <span className="da">→</span>
          <div className="dn" style={{ padding: '20px 34px' }}>LLM</div>
        </div>
      </div>

      <ul className="bullets">
        <li><span>The chat box is a thin skin over an API call</span></li>
        <li><span><span className="term">Prompt engineering</span> — structuring the brief, not finding magic words</span></li>
        <li><span>Augment with structure and data to improve the prediction</span></li>
      </ul>
    </div>
  )
}

WhatIsAPromptSlide.meta = {
  title: 'What is a prompt',
  section: 'prompt',
  sectionLabel: 'Prompt Engineering',
  notes: "What the interface silently adds: system prompt, full conversation history, tool definitions. That invisible payload is why the same question behaves differently in two apps.",
}

export default WhatIsAPromptSlide
