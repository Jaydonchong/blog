const PARTS = [
  ['System prompt', 'the rules'],
  ['Tools', 'the reach'],
  ['Memory', 'the recall'],
  ['Hooks', 'the guarantees'],
]

function WhatIsAHarnessSlide() {
  return (
    <div className="diag-above">
      {/* You are outside the box; so is the model. The harness is what sits
          between them, and everything in the first bullet lives in it. */}
      <div className="diag-figure">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div className="dn">
            <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
              <circle cx="13" cy="8" r="5" fill="none" stroke="#1b1e26" strokeWidth="1.5" />
              <path d="M3 24 a10 10 0 0 1 20 0" fill="none" stroke="#1b1e26" strokeWidth="1.5" />
            </svg>
            <span>You</span>
          </div>
          <span className="da">→</span>

          <div className="diag-stack diag-stack--violet" style={{ width: 760 }}>
            <div className="diag-stack__title">Harness</div>
            <div style={{ padding: 24, background: '#fff', display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="dn dn--violet" style={{ alignSelf: 'center' }}>
                <span style={{ fontWeight: 700 }}>PROMPT</span>
                <span className="dn__sub">what you asked for</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${PARTS.length}, 1fr)`, gap: 12 }}>
                {PARTS.map(([name, sub]) => (
                  <div className="dn" key={name}>
                    <span>{name}</span>
                    <span className="dn__sub">{sub}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <span className="da">→</span>
          <div className="dn dn--violet">
            <span style={{ fontWeight: 700 }}>MODEL</span>
            <span className="dn__sub">the thing that reasons</span>
          </div>
        </div>
      </div>

      <ul className="bullets">
        <li><span className="strong">System prompt + tools + memory + hooks</span></li>
        <li><span>An agent is simply a model with a harness</span></li>
        <li><span>You already built half of it — sections 3 and 4</span></li>
      </ul>
    </div>
  )
}

WhatIsAHarnessSlide.meta = {
  title: 'What is a harness',
  section: 'harness',
  sectionLabel: 'Harness Engineering',
  notes: 'Read the row left to right: you supply a prompt, the harness wraps it in everything else, the model only ever sees what came out the far end. You and the model are both outside the box — the harness is the part you build. Component map: System prompt and Memory from the context section, Tools from the tools section, Hooks come next. Lifecycle in one line: read, run, write, compact. Failure mode: memory that is read but never written is just a config file.',
}

export default WhatIsAHarnessSlide
