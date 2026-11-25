/* The loop from the feedback slide, with LEARN opened up: inside it sits the
   stack that does the grading — static checks under an LLM judge. Boxes are
   64 wide here to buy LEARN its extra width. k = 812/580 = 1.4, so 11.43
   renders at 16px and 7.86 at 11px. */

function EvalsSlide() {
  return (
    <div className="diag-above">
      <div className="diag-figure">
        <svg className="diag-svg" width="812" height="154" viewBox="0 0 580 110">
          {/* Think */}
          <rect x="84" y="8" width="64" height="40" rx="6" fill="#fff" stroke="#c6c3ba" strokeWidth="1.07"/>
          <text x="116" y="33" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 11.43, fill: '#1b1e26' }}>THINK</text>
          <line x1="148" y1="28" x2="166" y2="28" stroke="#6b5bf5" strokeWidth="1.07"/>
          <polygon points="162,24 170,28 162,32" fill="#6b5bf5"/>

          {/* Act */}
          <rect x="170" y="8" width="64" height="40" rx="6" fill="#fff" stroke="#c6c3ba" strokeWidth="1.07"/>
          <text x="202" y="33" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 11.43, fill: '#1b1e26' }}>ACT</text>
          <line x1="234" y1="28" x2="252" y2="28" stroke="#6b5bf5" strokeWidth="1.07"/>
          <polygon points="248,24 256,28 248,32" fill="#6b5bf5"/>

          {/* Verify */}
          <rect x="256" y="8" width="64" height="40" rx="6" fill="#fff" stroke="#c6c3ba" strokeWidth="1.07"/>
          <text x="288" y="33" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 11.43, fill: '#1b1e26' }}>VERIFY</text>
          <line x1="320" y1="28" x2="338" y2="28" stroke="#6b5bf5" strokeWidth="1.07"/>
          <polygon points="334,24 342,28 334,32" fill="#6b5bf5"/>

          {/* Learn, opened up — the evals are what is inside it */}
          <rect x="342" y="2" width="124" height="52" rx="6" fill="rgba(107,91,245,0.06)" stroke="#6b5bf5" strokeWidth="1.07"/>
          <text x="404" y="14" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 7.86, fill: '#4b3ddb' }}>LEARN</text>

          <rect x="350" y="19" width="108" height="14" rx="3" fill="#fff" stroke="#c6c3ba" strokeWidth="1.07"/>
          <text x="404" y="29" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 7.86, fill: '#1b1e26' }}>static</text>

          <rect x="350" y="36" width="108" height="14" rx="3" fill="#fff" stroke="#6b5bf5" strokeWidth="1.07"/>
          <text x="404" y="46" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 7.86, fill: '#4b3ddb' }}>judge</text>

          {/* Exit */}
          <line x1="466" y1="28" x2="484" y2="28" stroke="#c6c3ba" strokeWidth="1.07"/>
          <polygon points="480,24 488,28 480,32" fill="#c6c3ba"/>
          <rect x="488" y="8" width="60" height="40" rx="6" fill="#fff" stroke="#c6c3ba" strokeWidth="1.07"/>
          <text x="518" y="33" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 11.43, fill: '#1b1e26' }}>DONE</text>

          {/* The arc back, still out of Learn */}
          <path d="M404 54 V 70 Q 404 76 398 76 H 122 Q 116 76 116 70 V 56" fill="none" stroke="#6b5bf5" strokeWidth="1.07"/>
          <polygon points="112,58 116,50 120,58" fill="#6b5bf5"/>
          <text x="260" y="71" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 7.86, fill: '#868da0' }}>repeat</text>

          {/* The escalation — dotted and struck out, same as the slides before */}
          <path
            d="M288 48 V 90 Q 288 96 282 96 H 34 Q 28 96 28 90 V 46"
            fill="none" stroke="#c6c3ba" strokeWidth="1.07" strokeDasharray="2,2.5"
          />
          <polygon points="24,48 28,40 32,48" fill="#c6c3ba"/>
          <text x="216" y="92" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 7.86, fill: '#868da0' }}>needs a person</text>

          <circle cx="120" cy="96" r="10" fill="var(--paper)" />
          <line x1="114" y1="90" x2="126" y2="102" stroke="var(--rose)" strokeWidth="1.6"/>
          <line x1="126" y1="90" x2="114" y2="102" stroke="var(--rose)" strokeWidth="1.6"/>

          {/* Human */}
          <text x="28" y="9" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 7.86, fill: '#868da0' }}>human</text>
          <circle cx="28" cy="22" r="7" fill="none" stroke="#1b1e26" strokeWidth="1.07"/>
          <path d="M15 39 a13 13 0 0 1 26 0" fill="none" stroke="#1b1e26" strokeWidth="1.07"/>

          <line x1="46" y1="28" x2="76" y2="28" stroke="#6b5bf5" strokeWidth="1.07" strokeDasharray="2,2.5"/>
          <polygon points="76,24 84,28 76,32" fill="#6b5bf5"/>
          <text x="61" y="20" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 7.86, fill: '#868da0' }}>steer</text>
        </svg>
      </div>

      <ul className="bullets">
        <li><span>Objective vs subjective evaluation</span></li>
        <li><span><span className="term">LLM as a judge</span> → golden datasets</span></li>
        <li><span className="strong">A good eval should strive to be objective</span></li>
      </ul>
    </div>
  )
}

EvalsSlide.meta = {
  title: 'Evals',
  subtitle: 'Tests for your agents',
  section: 'loop',
  sectionLabel: 'Loop Engineering',
  notes: 'Open up LEARN and this is what is inside: static checks first — did it compile, validate, pass the tests — and a model judge only for what static checks cannot express. Objective beats subjective every time, so push each subjective criterion down into something checkable. LLM-as-judge needs calibrating against human labels before you trust it; watch for position and verbosity bias. Golden datasets need fewer hand-labelled examples than people expect to start being useful.',
}

export default EvalsSlide
