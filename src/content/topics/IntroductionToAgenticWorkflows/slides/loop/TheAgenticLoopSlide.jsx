function TheAgenticLoopSlide() {
  return (
    <div className="diag-above">
      {/* Think → Act → Verify, the arc back, and the three ways out.
          k = 672/480 = 1.4, so 11.43 renders at 16px and 7.86 at 11px. */}
      <div className="diag-figure">
        <svg className="diag-svg" width="672" height="196" viewBox="0 0 480 140">
          {/* Think */}
          <rect x="0" y="8" width="96" height="40" rx="6" fill="#fff" stroke="#c6c3ba" strokeWidth="1.07"/>
          <text x="48" y="33" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 11.43, fill: '#1b1e26' }}>THINK</text>
          <line x1="96" y1="28" x2="134" y2="28" stroke="#6b5bf5" strokeWidth="1.07"/>
          <polygon points="130,24 138,28 130,32" fill="#6b5bf5"/>

          {/* Act */}
          <rect x="140" y="8" width="96" height="40" rx="6" fill="#fff" stroke="#c6c3ba" strokeWidth="1.07"/>
          <text x="188" y="33" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 11.43, fill: '#1b1e26' }}>ACT</text>
          <line x1="236" y1="28" x2="270" y2="28" stroke="#6b5bf5" strokeWidth="1.07"/>
          <polygon points="266,24 274,28 266,32" fill="#6b5bf5"/>

          {/* Verify — the load-bearing step, so it carries the accent */}
          <rect x="276" y="8" width="96" height="40" rx="6" fill="rgba(107,91,245,0.06)" stroke="#6b5bf5" strokeWidth="1.07"/>
          <text x="324" y="33" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 11.43, fill: '#4b3ddb' }}>VERIFY</text>

          {/* Exit — only taken when a stopping condition fires */}
          <line x1="372" y1="28" x2="406" y2="28" stroke="#c6c3ba" strokeWidth="1.07"/>
          <polygon points="402,24 410,28 402,32" fill="#c6c3ba"/>
          <rect x="412" y="8" width="68" height="40" rx="6" fill="#fff" stroke="#c6c3ba" strokeWidth="1.07"/>
          <text x="446" y="33" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 11.43, fill: '#1b1e26' }}>DONE</text>

          {/* Stopping conditions, hung under the exit */}
          <text x="412" y="64" style={{ fontFamily: 'var(--mono)', fontSize: 7.86, fill: '#868da0' }}>stop on:</text>
          <text x="412" y="76" style={{ fontFamily: 'var(--mono)', fontSize: 7.86, fill: '#868da0' }}>max turns</text>
          <text x="412" y="88" style={{ fontFamily: 'var(--mono)', fontSize: 7.86, fill: '#868da0' }}>budget cap</text>
          <text x="412" y="100" style={{ fontFamily: 'var(--mono)', fontSize: 7.86, fill: '#868da0' }}>human approval</text>

          {/* The arc back — Verify's default outcome is another turn */}
          <path d="M312 48 V 70 Q 312 76 306 76 H 54 Q 48 76 48 70 V 56" fill="none" stroke="#6b5bf5" strokeWidth="1.07"/>
          <polygon points="44,58 48,50 52,58" fill="#6b5bf5"/>
          <text x="180" y="71" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 7.86, fill: '#868da0' }}>repeat</text>

          {/* The other outcome: hand it to a person */}
          <path d="M348 48 V 106 Q 348 112 342 112 H 122" fill="none" stroke="#c6c3ba" strokeWidth="1.07"/>
          <polygon points="116,112 124,108 124,116" fill="#c6c3ba"/>
          <text x="238" y="108" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 7.86, fill: '#868da0' }}>needs a person</text>

          {/* Human in the loop */}
          <circle cx="100" cy="104" r="7" fill="none" stroke="#1b1e26" strokeWidth="1.07"/>
          <path d="M87 121 a13 13 0 0 1 26 0" fill="none" stroke="#1b1e26" strokeWidth="1.07"/>
          <text x="72" y="110" textAnchor="end" style={{ fontFamily: 'var(--mono)', fontSize: 7.86, fill: '#868da0' }}>human</text>

          {/* …and back into Think — dotted, because it is optional and irregular */}
          <line x1="94" y1="96" x2="58" y2="56" stroke="#6b5bf5" strokeWidth="1.07" strokeDasharray="2,2.5"/>
          <polygon points="54,52 62,54 56,60" fill="#6b5bf5"/>
          <text x="120" y="136" style={{ fontFamily: 'var(--mono)', fontSize: 7.86, fill: '#868da0' }}>approve · steer · correct</text>
        </svg>
      </div>

      <ul className="bullets">
        <li><span className="strong">Think → Act → Verify → repeat</span></li>
        <li><span>The loop is where the agency comes from</span></li>
        <li><span>Stop on: max turns · budget cap · human approval</span></li>
      </ul>
      <p className="pull">Autonomy is cheap; verification is the expensive part.</p>
    </div>
  )
}

TheAgenticLoopSlide.meta = {
  title: 'The agentic loop',
  section: 'loop',
  sectionLabel: 'Loop Engineering',
  notes: 'Verify is load-bearing, not decorative. The third stopping condition — human approval before anything irreversible — is what lets you leave a loop running overnight. The human return line is dotted on purpose: it fires rarely and on no schedule, and a loop that needs it every turn is a loop you have not finished designing.',
}

export default TheAgenticLoopSlide
