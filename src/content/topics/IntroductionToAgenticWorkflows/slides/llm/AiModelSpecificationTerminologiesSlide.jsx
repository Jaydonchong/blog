function AiModelSpecificationTerminologiesSlide() {
  return (
    <div className="diag-2col">
      {/* Left: bullets */}
      <ul className="bullets">
        <li><span><span className="term">Weights</span> — frozen at training; chatting teaches it nothing</span></li>
        <li><span><span className="term">Inference</span> — one pass through those weights, and your bill</span></li>
        <li><span><span className="term">Quantization</span> — smaller numbers, smaller hardware, slightly worse</span></li>
      </ul>

      {/* Right: NN diagram with weight/inference labels + quantization cells */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <svg className="diag-svg" width="453" height="307" viewBox="0 0 310 210">
          {/* All connections (regular) */}
          <line x1="25" y1="80" x2="90" y2="30" stroke="#d9d5cf" strokeWidth="0.6"/>
          <line x1="25" y1="80" x2="90" y2="80" stroke="#d9d5cf" strokeWidth="0.6"/>
          <line x1="25" y1="80" x2="90" y2="130" stroke="#d9d5cf" strokeWidth="0.6"/>
          <line x1="90" y1="30" x2="155" y2="30" stroke="#d9d5cf" strokeWidth="0.6"/>
          <line x1="90" y1="30" x2="155" y2="80" stroke="#d9d5cf" strokeWidth="0.6"/>
          <line x1="90" y1="30" x2="155" y2="130" stroke="#d9d5cf" strokeWidth="0.6"/>
          <line x1="90" y1="80" x2="155" y2="30" stroke="#d9d5cf" strokeWidth="0.6"/>
          <line x1="90" y1="80" x2="155" y2="80" stroke="#d9d5cf" strokeWidth="0.6"/>
          <line x1="90" y1="80" x2="155" y2="130" stroke="#d9d5cf" strokeWidth="0.6"/>
          <line x1="90" y1="130" x2="155" y2="30" stroke="#d9d5cf" strokeWidth="0.6"/>
          <line x1="90" y1="130" x2="155" y2="80" stroke="#d9d5cf" strokeWidth="0.6"/>
          <line x1="90" y1="130" x2="155" y2="130" stroke="#d9d5cf" strokeWidth="0.6"/>
          <line x1="155" y1="30" x2="220" y2="30" stroke="#d9d5cf" strokeWidth="0.6"/>
          <line x1="155" y1="30" x2="220" y2="30" stroke="#d9d5cf" strokeWidth="0.6"/>
          <line x1="155" y1="30" x2="220" y2="130" stroke="#d9d5cf" strokeWidth="0.6"/>
          <line x1="155" y1="80" x2="220" y2="30" stroke="#d9d5cf" strokeWidth="0.6"/>
          <line x1="155" y1="80" x2="220" y2="130" stroke="#d9d5cf" strokeWidth="0.6"/>
          <line x1="155" y1="130" x2="220" y2="30" stroke="#d9d5cf" strokeWidth="0.6"/>
          <line x1="155" y1="130" x2="220" y2="130" stroke="#d9d5cf" strokeWidth="0.6"/>
          {/* Highlighted inference edge — H2 mid → Output mid, thick violet */}
          <line x1="155" y1="80" x2="220" y2="80" stroke="#6b5bf5" strokeWidth="1.7"/>
          <text x="183" y="73" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 8, fill: '#6b5bf5' }}>inference</text>
          {/* Input node */}
          <circle cx="25" cy="80" r="8" fill="#f7f6f3" stroke="#2b3140" strokeWidth="0.85"/>
          {/* H1 — top node highlighted as weight */}
          <circle cx="90" cy="30" r="8" fill="#6b5bf5" stroke="#4b3ddb" strokeWidth="1.05"/>
          <text x="102" y="26" style={{ fontFamily: 'var(--mono)', fontSize: 8, fill: '#4b3ddb' }}>weight</text>
          <circle cx="90" cy="80" r="7" fill="#f7f6f3" stroke="#2b3140" strokeWidth="0.85"/>
          <circle cx="90" cy="130" r="7" fill="#f7f6f3" stroke="#2b3140" strokeWidth="0.85"/>
          {/* H2 */}
          <circle cx="155" cy="30" r="7" fill="#f7f6f3" stroke="#2b3140" strokeWidth="0.85"/>
          <circle cx="155" cy="80" r="7" fill="#f7f6f3" stroke="#2b3140" strokeWidth="0.85"/>
          <circle cx="155" cy="130" r="7" fill="#f7f6f3" stroke="#2b3140" strokeWidth="0.85"/>
          {/* Output */}
          <circle cx="220" cy="30" r="7" fill="#f7f6f3" stroke="#2b3140" strokeWidth="0.85"/>
          <circle cx="220" cy="80" r="7" fill="#f7f6f3" stroke="#2b3140" strokeWidth="0.85"/>
          <circle cx="220" cy="130" r="7" fill="#f7f6f3" stroke="#2b3140" strokeWidth="0.85"/>

          {/* Quantization cells + arrows */}
          {/* Cell 1 → Input (25, 80) */}
          <line x1="25" y1="168" x2="25" y2="90" stroke="#c6c3ba" strokeWidth="0.7" strokeDasharray="3,2"/>
          <polygon points="22,92 25,86 28,92" fill="#c6c3ba"/>
          <rect x="5" y="170" width="40" height="30" rx="4" fill="#fff" stroke="#c6c3ba" strokeWidth="1.05"/>
          <text x="25" y="190" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 11, fill: '#1b1e26' }}>w₁</text>

          {/* Cell 2 → H1 top (90, 30) */}
          <line x1="100" y1="168" x2="91" y2="40" stroke="#c6c3ba" strokeWidth="0.7" strokeDasharray="3,2"/>
          <polygon points="88,42 91,36 94,42" fill="#c6c3ba"/>
          <rect x="80" y="170" width="40" height="30" rx="4" fill="#fff" stroke="#c6c3ba" strokeWidth="1.05"/>
          <text x="100" y="190" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 11, fill: '#1b1e26' }}>w₂</text>

          {/* Cell 3 → Output bottom (220, 130) */}
          <line x1="210" y1="168" x2="220" y2="140" stroke="#c6c3ba" strokeWidth="0.7" strokeDasharray="3,2"/>
          <polygon points="217,141 220,135 223,141" fill="#c6c3ba"/>
          <rect x="190" y="170" width="40" height="30" rx="4" fill="#fff" stroke="#c6c3ba" strokeWidth="1.05"/>
          <text x="210" y="190" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 11, fill: '#1b1e26' }}>w₃</text>
        </svg>
      </div>
    </div>
  )
}

AiModelSpecificationTerminologiesSlide.meta = {
  title: 'Model specification terminologies',
  section: 'llm',
  sectionLabel: 'What is an LLM',
  notes: 'Kill the misconception directly: your conversation does not train the model. Quantization only matters if you self-host; give the decision rule, not the precision levels. PAUSE POINT — ask the room a question before moving on.',
}

export default AiModelSpecificationTerminologiesSlide
