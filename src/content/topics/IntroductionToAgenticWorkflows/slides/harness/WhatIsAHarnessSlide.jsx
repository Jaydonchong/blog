/* You and the model sit outside the box; the harness is the part you build.
   k = 1 (1100 wide on a 1100 viewBox): 16 primary, 11 secondary, 1.5 stroke. */

const LINE = '#c6c3ba'
const VIOLET = '#6b5bf5'
const INK = '#1b1e26'

const LABEL = { fontFamily: 'var(--mono)', fontSize: 16, fill: INK }
const NOTE = { fontFamily: 'var(--mono)', fontSize: 11, fill: 'var(--muted)' }

const PARTS = [
  ['System prompt', 'the rules'],
  ['Tools', 'the reach'],
  ['Memory', 'the recall'],
  ['Hooks', 'the guarantees'],
]

function WhatIsAHarnessSlide() {
  return (
    <div className="diag-above">
      <div className="diag-figure">
        <svg className="diag-svg" width="1100" height="250" viewBox="0 0 1100 250">
          {/* You */}
          <circle cx="40" cy="86" r="13" fill="none" stroke={INK} strokeWidth="1.5" />
          <path d="M16 126 a24 24 0 0 1 48 0" fill="none" stroke={INK} strokeWidth="1.5" />
          <text x="40" y="148" textAnchor="middle" style={LABEL}>You</text>

          {/* The harness */}
          <rect x="150" y="20" width="740" height="210" rx="10" fill="#fff" stroke={VIOLET} strokeWidth="1.5" />
          <text x="168" y="44" style={{ ...NOTE, fill: '#4b3ddb', letterSpacing: '0.12em' }}>HARNESS</text>

          {/* …and the prompt you write, which is what the arrow is aimed at */}
          <rect x="190" y="58" width="200" height="54" rx="8" fill="rgba(107,91,245,0.07)" stroke={VIOLET} strokeWidth="1.5" />
          <text x="290" y="82" textAnchor="middle" style={{ ...LABEL, fill: '#4b3ddb', fontWeight: 700 }}>PROMPT</text>
          <text x="290" y="100" textAnchor="middle" style={NOTE}>what you asked for</text>

          {/* You -> PROMPT, straight through the container wall */}
          <line x1="72" y1="104" x2="180" y2="88" stroke={VIOLET} strokeWidth="1.5" />
          <polygon points="188,87 178,83 179,93" fill={VIOLET} />
          <text x="126" y="80" textAnchor="middle" style={NOTE}>you write it</text>

          {PARTS.map(([name, sub], i) => {
            const x = 190 + i * 168
            return (
              <g key={name}>
                <rect x={x} y="140" width="154" height="62" rx="8" fill="#fff" stroke={LINE} strokeWidth="1.5" />
                <text x={x + 77} y="170" textAnchor="middle" style={LABEL}>{name}</text>
                <text x={x + 77} y="188" textAnchor="middle" style={NOTE}>{sub}</text>
              </g>
            )
          })}

          {/* …and out to the model, which only ever sees what came out the end */}
          <line x1="890" y1="125" x2="942" y2="125" stroke={VIOLET} strokeWidth="1.5" />
          <polygon points="950,125 940,120 940,130" fill={VIOLET} />
          <rect x="954" y="98" width="142" height="54" rx="8" fill="rgba(107,91,245,0.07)" stroke={VIOLET} strokeWidth="1.5" />
          <text x="1025" y="122" textAnchor="middle" style={{ ...LABEL, fill: '#4b3ddb', fontWeight: 700 }}>MODEL</text>
          <text x="1025" y="140" textAnchor="middle" style={NOTE}>the reasoner</text>
        </svg>
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
  notes: 'Read the row left to right: you write the prompt, the harness wraps it in everything else, the model only ever sees what came out the far end. You and the model are both outside the box — the harness is the part you build. Component map: System prompt and Memory from the context section, Tools from the tools section, Hooks come next. Lifecycle in one line: read, run, write, compact. Failure mode: memory that is read but never written is just a config file.',
}

export default WhatIsAHarnessSlide
