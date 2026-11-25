function AiProcessTerminologiesSlide() {
  return (
    <div className="diag-above">
      {/* Top: two graphics side by side */}
      <div className="diag-2col" style={{ flex: 1, gap: 24 }}>
        {/* Left: token sequence with probabilities */}
        <svg className="diag-svg" width="409" height="248" viewBox="0 0 280 170">
          {/* Tokens — 46 wide on a 50 pitch, so the row ends at 246 and the
              blank token at 252 clears it */}
          {[['The', 0], ['cat', 50], ['sat', 100], ['on', 150], ['the', 200]].map(([word, x]) => (
            <g key={word + x}>
              <rect x={x} y="10" width="46" height="30" rx="4" fill="#fff" stroke="#c6c3ba" strokeWidth="1.05"/>
              <text x={x + 23} y="30" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 11, fill: '#1b1e26' }}>{word}</text>
            </g>
          ))}
          <rect x="252" y="10" width="28" height="30" rx="4" fill="#fff" stroke="#c6c3ba" strokeWidth="1.05" strokeDasharray="3,2"/>
          <text x="266" y="30" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 11, fill: '#c6c3ba' }}>___</text>

          {/* Branch lines from blank token */}
          <line x1="266" y1="40" x2="40" y2="72" stroke="#c6c3ba" strokeWidth="0.7"/>
          <line x1="266" y1="40" x2="140" y2="72" stroke="#c6c3ba" strokeWidth="0.7"/>
          <line x1="266" y1="40" x2="240" y2="72" stroke="#c6c3ba" strokeWidth="0.7"/>

          {/* "mat" */}
          <text x="40" y="88" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 11, fill: '#1b1e26' }}>"mat"</text>
          <rect x="10" y="96" width="60" height="8" rx="2" fill="#e8e4dc"/>
          <rect x="10" y="96" width="43" height="8" rx="2" fill="#6b5bf5"/>
          <text x="40" y="120" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 11, fill: '#6b5bf5', fontWeight: 600 }}>72%</text>

          {/* "floor" */}
          <text x="140" y="88" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 11, fill: '#1b1e26' }}>"floor"</text>
          <rect x="110" y="96" width="60" height="8" rx="2" fill="#e8e4dc"/>
          <rect x="110" y="96" width="11" height="8" rx="2" fill="#6b5bf5"/>
          <text x="140" y="120" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 11, fill: '#868da0' }}>18%</text>

          {/* "roof" */}
          <text x="240" y="88" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 11, fill: '#1b1e26' }}>"roof"</text>
          <rect x="210" y="96" width="60" height="8" rx="2" fill="#e8e4dc"/>
          <rect x="210" y="96" width="6" height="8" rx="2" fill="#6b5bf5"/>
          <text x="240" y="120" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 11, fill: '#868da0' }}>10%</text>
        </svg>

        {/* Right: NN sampling with output labels */}
        <svg className="diag-svg" width="496" height="233" viewBox="0 0 340 160">
          <line x1="20" y1="80" x2="85" y2="30" stroke="#d9d5cf" strokeWidth="0.6"/>
          <line x1="20" y1="80" x2="85" y2="80" stroke="#d9d5cf" strokeWidth="0.6"/>
          <line x1="20" y1="80" x2="85" y2="130" stroke="#d9d5cf" strokeWidth="0.6"/>
          <line x1="85" y1="30" x2="150" y2="30" stroke="#d9d5cf" strokeWidth="0.6"/>
          <line x1="85" y1="30" x2="150" y2="80" stroke="#d9d5cf" strokeWidth="0.6"/>
          <line x1="85" y1="30" x2="150" y2="130" stroke="#d9d5cf" strokeWidth="0.6"/>
          <line x1="85" y1="80" x2="150" y2="30" stroke="#d9d5cf" strokeWidth="0.6"/>
          <line x1="85" y1="80" x2="150" y2="80" stroke="#d9d5cf" strokeWidth="0.6"/>
          <line x1="85" y1="80" x2="150" y2="130" stroke="#d9d5cf" strokeWidth="0.6"/>
          <line x1="85" y1="130" x2="150" y2="30" stroke="#d9d5cf" strokeWidth="0.6"/>
          <line x1="85" y1="130" x2="150" y2="80" stroke="#d9d5cf" strokeWidth="0.6"/>
          <line x1="85" y1="130" x2="150" y2="130" stroke="#d9d5cf" strokeWidth="0.6"/>
          <line x1="150" y1="30" x2="215" y2="30" stroke="#d9d5cf" strokeWidth="0.6"/>
          <line x1="150" y1="30" x2="215" y2="80" stroke="#d9d5cf" strokeWidth="0.6"/>
          <line x1="150" y1="30" x2="215" y2="130" stroke="#d9d5cf" strokeWidth="0.6"/>
          <line x1="150" y1="80" x2="215" y2="30" stroke="#d9d5cf" strokeWidth="0.6"/>
          <line x1="150" y1="80" x2="215" y2="80" stroke="#d9d5cf" strokeWidth="0.6"/>
          <line x1="150" y1="80" x2="215" y2="130" stroke="#d9d5cf" strokeWidth="0.6"/>
          <line x1="150" y1="130" x2="215" y2="30" stroke="#d9d5cf" strokeWidth="0.6"/>
          <line x1="150" y1="130" x2="215" y2="80" stroke="#d9d5cf" strokeWidth="0.6"/>
          <line x1="150" y1="130" x2="215" y2="130" stroke="#d9d5cf" strokeWidth="0.6"/>
          <circle cx="20" cy="80" r="9" fill="#6b5bf5" stroke="#4b3ddb" strokeWidth="1.05"/>
          <circle cx="85" cy="30" r="7" fill="#f7f6f3" stroke="#2b3140" strokeWidth="0.85"/>
          <circle cx="85" cy="80" r="7" fill="#f7f6f3" stroke="#2b3140" strokeWidth="0.85"/>
          <circle cx="85" cy="130" r="7" fill="#f7f6f3" stroke="#2b3140" strokeWidth="0.85"/>
          <circle cx="150" cy="30" r="7" fill="#f7f6f3" stroke="#2b3140" strokeWidth="0.85"/>
          <circle cx="150" cy="80" r="7" fill="#f7f6f3" stroke="#2b3140" strokeWidth="0.85"/>
          <circle cx="150" cy="130" r="7" fill="#f7f6f3" stroke="#2b3140" strokeWidth="0.85"/>
          <circle cx="215" cy="30" r="7" fill="#f7f6f3" stroke="#2b3140" strokeWidth="0.85"/>
          <circle cx="215" cy="80" r="7" fill="#f7f6f3" stroke="#2b3140" strokeWidth="0.85"/>
          <circle cx="215" cy="130" r="7" fill="#f7f6f3" stroke="#2b3140" strokeWidth="0.85"/>
          <text x="226" y="34" style={{ fontFamily: 'var(--mono)', fontSize: 11, fill: '#1b1e26' }}>"mat"  72%</text>
          <text x="226" y="84" style={{ fontFamily: 'var(--mono)', fontSize: 11, fill: '#1b1e26' }}>"floor" 18%</text>
          <text x="226" y="134" style={{ fontFamily: 'var(--mono)', fontSize: 11, fill: '#1b1e26' }}>"roof"  10%</text>
        </svg>
      </div>

      {/* Bottom: bullets */}
      <ul className="bullets">
        <li><span><span className="term">Tokens</span> — the unit of cost and the unit of space</span></li>
        <li><span><span className="term">Sampling</span> — it rolls a weighted die, not a lookup</span></li>
      </ul>
    </div>
  )
}

AiProcessTerminologiesSlide.meta = {
  title: 'Next token prediction',
  section: 'llm',
  sectionLabel: 'What is an LLM',
  notes: 'Show one badly-split tokenised sentence if you want a visual. Pricing for Q&A: input and output bill at different rates, output is dearer. Tokens are the through-line to token bloat and to connection cost in the tools section.',
}

export default AiProcessTerminologiesSlide
