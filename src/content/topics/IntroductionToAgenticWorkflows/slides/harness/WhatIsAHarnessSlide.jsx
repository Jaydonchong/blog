const PARTS = [
  ['System prompt', 'the rules'],
  ['Tools', 'the reach'],
  ['Memory', 'the recall'],
  ['Verification', 'the checks'],
  ['Hooks', 'the guarantees'],
]

function WhatIsAHarnessSlide() {
  return (
    <div className="diag-above">
      {/* One container, everything from the first bullet inside it */}
      <div className="diag-figure">
        <div className="diag-stack diag-stack--violet" style={{ width: 960 }}>
          <div className="diag-stack__title">Harness</div>
          <div style={{ padding: 24, background: '#fff', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="dn dn--violet" style={{ alignSelf: 'center' }}>
              <span style={{ fontWeight: 700 }}>MODEL</span>
              <span className="dn__sub">the thing that reasons</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
              {PARTS.map(([name, sub]) => (
                <div className="dn" key={name}>
                  <span>{name}</span>
                  <span className="dn__sub">{sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ul className="bullets">
        <li><span className="strong">System prompt + tools + memory + verification + hooks</span></li>
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
  notes: 'Component map: System prompt and Memory from the context section, Tools from the tools section, Verification and Hooks come next. Lifecycle in one line: read, run, write, compact. Failure mode: memory that is read but never written is just a config file.',
}

export default WhatIsAHarnessSlide
