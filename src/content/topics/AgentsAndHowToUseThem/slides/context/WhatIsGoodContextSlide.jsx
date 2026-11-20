const PILLARS = [
  {
    title: 'Quality',
    parts: [
      ['Recency', 'is it still true?'],
      ['Relevance', 'is it about this?'],
    ],
  },
  {
    title: 'Efficiency',
    parts: [
      ['Coverage', 'enough to answer'],
      ['Latency', 'cheap enough to fetch'],
    ],
  },
]

function WhatIsGoodContextSlide() {
  return (
    <div className="diag-above">
      <div className="diag-figure">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 28, width: 860 }}>
          {PILLARS.map(({ title, parts }) => (
            <div className="diag-stack diag-stack--violet" key={title}>
              <div className="diag-stack__title">{title}</div>
              {parts.map(([name, gloss]) => (
                <div className="diag-stack__slot" key={name}>
                  {name} <span className="dn__sub">— {gloss}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <ul className="bullets">
        <li><span>Good context avoids stale results</span></li>
        <li><span>Good context avoids unnecessary information</span></li>
        <li><span>Good context avoids unexpected outputs</span></li>
      </ul>
    </div>
  )
}

WhatIsGoodContextSlide.meta = {
  title: 'What is good context',
  subtitle: 'Context = Boundaries',
  section: 'context',
  sectionLabel: 'Context Engineering',
  notes: 'Two pillars, and the four names under them are the questions to ask of any piece of context before it goes in. Quality is about what the answer will be worth; efficiency is about what it costs to get there. The three bullets are the three failure modes, one per direction: stale is recency, unnecessary is relevance, unexpected is what happens when boundaries are missing altogether.',
}

export default WhatIsGoodContextSlide
