function WhatWellCoverSlide() {
  return (
    <div className="diag-2col">
      {/* Left: bullets */}
      <ul className="bullets">
        <li><span>Six layers, one section each</span></li>
        <li><span>Each layer is one more thing you hand over</span></li>
        <li><span>When the output is bad, you'll know which layer broke</span></li>
      </ul>

      {/* Right: SVG map */}
      <svg className="diag-svg" width="546" height="287" viewBox="0 0 390 205">
        <rect x="2" y="60" width="54" height="32" rx="5" fill="#fff" stroke="#c6c3ba" strokeWidth="1.1"/>
        <text x="29" y="81" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 11.5, fill: '#1b1e26' }}>YOU</text>
        <line x1="56" y1="76" x2="82" y2="76" stroke="#6b5bf5" strokeWidth="1.1"/>
        <polygon points="78,72 84,76 78,80" fill="#6b5bf5"/>
        <rect x="84" y="58" width="84" height="36" rx="5" fill="rgba(107,91,245,0.07)" stroke="#6b5bf5" strokeWidth="1.1"/>
        <text x="126" y="81" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 11.5, fill: '#4b3ddb' }}>PROMPT</text>
        <line x1="168" y1="76" x2="194" y2="76" stroke="#6b5bf5" strokeWidth="1.1"/>
        <polygon points="190,72 196,76 190,80" fill="#6b5bf5"/>
        <rect x="196" y="60" width="72" height="32" rx="5" fill="#fff" stroke="#c6c3ba" strokeWidth="1.1"/>
        <text x="232" y="81" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 11.5, fill: '#1b1e26' }}>MODEL</text>
        <line x1="268" y1="76" x2="294" y2="76" stroke="#6b5bf5" strokeWidth="1.1"/>
        <polygon points="290,72 296,76 290,80" fill="#6b5bf5"/>
        <rect x="296" y="60" width="76" height="32" rx="5" fill="#fff" stroke="#c6c3ba" strokeWidth="1.1"/>
        <text x="334" y="81" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 11.5, fill: '#1b1e26' }}>OUTPUT</text>

        <line x1="126" y1="94" x2="126" y2="128" stroke="#c6c3ba" strokeWidth="1.1"/>
        <line x1="46" y1="128" x2="312" y2="128" stroke="#c6c3ba" strokeWidth="1.1"/>
        <line x1="46" y1="128" x2="46" y2="148" stroke="#c6c3ba" strokeWidth="1.1"/>
        <line x1="134" y1="128" x2="134" y2="148" stroke="#c6c3ba" strokeWidth="1.1"/>
        <line x1="224" y1="128" x2="224" y2="148" stroke="#c6c3ba" strokeWidth="1.1"/>
        <line x1="312" y1="128" x2="312" y2="148" stroke="#c6c3ba" strokeWidth="1.1"/>

        <rect x="0" y="148" width="92" height="52" rx="5" fill="#fff" stroke="#c6c3ba" strokeWidth="1.1"/>
        <text x="46" y="169" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 11.5, fontWeight: 600, fill: '#1b1e26' }}>CONTEXT</text>
        <text x="46" y="185" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 8, fill: '#868da0' }}>what it knows</text>

        <rect x="99" y="148" width="70" height="52" rx="5" fill="#fff" stroke="#c6c3ba" strokeWidth="1.1"/>
        <text x="134" y="169" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 11.5, fontWeight: 600, fill: '#1b1e26' }}>TOOLS</text>
        <text x="134" y="185" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 8, fill: '#868da0' }}>can touch</text>

        <rect x="178" y="148" width="92" height="52" rx="5" fill="#fff" stroke="#c6c3ba" strokeWidth="1.1"/>
        <text x="224" y="169" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 11.5, fontWeight: 600, fill: '#1b1e26' }}>HARNESS</text>
        <text x="224" y="185" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 8, fill: '#868da0' }}>runs inside</text>

        <rect x="272" y="148" width="80" height="52" rx="5" fill="#fff" stroke="#c6c3ba" strokeWidth="1.1"/>
        <text x="312" y="169" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 11.5, fontWeight: 600, fill: '#1b1e26' }}>LOOP</text>
        <text x="312" y="185" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 8, fill: '#868da0' }}>how many times</text>
      </svg>
    </div>
  )
}

WhatWellCoverSlide.meta = {
  title: "What we'll cover",
  section: 'intro',
  sectionLabel: 'Introduction',
  notes: 'Return to this diagram verbally at each section change rather than reprinting it. Saves five slides.',
}

export default WhatWellCoverSlide
