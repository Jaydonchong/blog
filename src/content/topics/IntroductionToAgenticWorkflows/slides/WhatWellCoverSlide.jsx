const MAP = `  YOU ─► [ PROMPT ] ─► ( MODEL ) ─► OUTPUT
              │
              ├── CONTEXT    what it knows
              ├── TOOLS      what it can touch
              ├── HARNESS    what it runs inside
              └── LOOP       how many times it goes around`

function WhatWellCoverSlide() {
  return (
    <>
      <ul className="bullets">
        <li><span>Six layers, one section each</span></li>
        <li><span>Each layer is one more thing you hand over</span></li>
        <li><span>When the output is bad, you'll know which layer broke</span></li>
      </ul>
      <pre className="map" aria-label="The six-layer map">{MAP}</pre>
    </>
  )
}

WhatWellCoverSlide.meta = {
  title: "What we'll cover",
  section: 'intro',
  sectionLabel: 'Introduction',
  notes: 'Return to this diagram verbally at each section change rather than reprinting it. Saves five slides.',
}

export default WhatWellCoverSlide
