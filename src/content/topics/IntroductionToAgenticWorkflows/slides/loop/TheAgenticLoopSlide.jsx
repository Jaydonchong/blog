function TheAgenticLoopSlide() {
  return (
    <div className="diag-above">
      {/* Think → Act → Verify, the arc back, and the person on the left who
          can be pulled in — sitting on the row's centre line, y = 28.
          k = 812/580 = 1.4, so 11.43 renders at 16px and 7.86 at 11px. */}
      <div className="diag-figure">
        <svg className="diag-svg" width="812" height="154" viewBox="0 0 580 110">
          {/* Think */}
          <rect x="84" y="8" width="96" height="40" rx="6" fill="#fff" stroke="#c6c3ba" strokeWidth="1.07"/>
          <text x="132" y="33" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 11.43, fill: '#1b1e26' }}>THINK</text>
          <line x1="180" y1="28" x2="218" y2="28" stroke="#6b5bf5" strokeWidth="1.07"/>
          <polygon points="214,24 222,28 214,32" fill="#6b5bf5"/>

          {/* Act */}
          <rect x="224" y="8" width="96" height="40" rx="6" fill="#fff" stroke="#c6c3ba" strokeWidth="1.07"/>
          <text x="272" y="33" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 11.43, fill: '#1b1e26' }}>ACT</text>
          <line x1="320" y1="28" x2="358" y2="28" stroke="#6b5bf5" strokeWidth="1.07"/>
          <polygon points="354,24 362,28 354,32" fill="#6b5bf5"/>

          {/* Verify — the load-bearing step, so it carries the accent */}
          <rect x="364" y="8" width="96" height="40" rx="6" fill="rgba(107,91,245,0.06)" stroke="#6b5bf5" strokeWidth="1.07"/>
          <text x="412" y="33" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 11.43, fill: '#4b3ddb' }}>VERIFY</text>

          {/* Exit */}
          <line x1="460" y1="28" x2="494" y2="28" stroke="#c6c3ba" strokeWidth="1.07"/>
          <polygon points="490,24 498,28 490,32" fill="#c6c3ba"/>
          <rect x="500" y="8" width="68" height="40" rx="6" fill="#fff" stroke="#c6c3ba" strokeWidth="1.07"/>
          <text x="534" y="33" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 11.43, fill: '#1b1e26' }}>DONE</text>

          {/* The arc back — Verify's default outcome is another turn */}
          <path d="M400 48 V 70 Q 400 76 394 76 H 138 Q 132 76 132 70 V 56" fill="none" stroke="#6b5bf5" strokeWidth="1.07"/>
          <polygon points="128,58 132,50 136,58" fill="#6b5bf5"/>
          <text x="266" y="71" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 7.86, fill: '#868da0' }}>repeat</text>

          {/* The other outcome: down, back along the bottom, and up into the
              person — who sits on the flow's centre line at the far left */}
          <path d="M436 48 V 90 Q 436 96 430 96 H 34 Q 28 96 28 90 V 46" fill="none" stroke="#c6c3ba" strokeWidth="1.07"/>
          <polygon points="24,48 28,40 32,48" fill="#c6c3ba"/>
          <text x="240" y="92" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 7.86, fill: '#868da0' }}>needs a person</text>

          {/* Human in the loop — label above, so the return path has a clear
              run up into the figure */}
          <text x="28" y="9" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 7.86, fill: '#868da0' }}>human</text>
          <circle cx="28" cy="22" r="7" fill="none" stroke="#1b1e26" strokeWidth="1.07"/>
          <path d="M15 39 a13 13 0 0 1 26 0" fill="none" stroke="#1b1e26" strokeWidth="1.07"/>

          {/* …and back into Think — dotted, because it is optional and irregular */}
          <line x1="46" y1="28" x2="76" y2="28" stroke="#6b5bf5" strokeWidth="1.07" strokeDasharray="2,2.5"/>
          <polygon points="76,24 84,28 76,32" fill="#6b5bf5"/>
          <text x="61" y="20" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 7.86, fill: '#868da0' }}>steer</text>
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
