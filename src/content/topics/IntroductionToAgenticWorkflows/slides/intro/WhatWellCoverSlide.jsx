/* The talk as a staircase: each step hands over one more thing. k = 1 (1120
   wide on a 1120 viewBox): 16 primary, 11 secondary, 1.5 stroke. */

const LINE = '#c6c3ba'
const VIOLET = '#6b5bf5'
const INK = '#1b1e26'

const BASE = 290

const STEPS = [
  { n: '01', name: 'What is AI', sub: 'the material', top: 200 },
  { n: '02', name: 'AI interaction', sub: 'prompt in, text out', top: 165 },
  { n: '03', name: 'Agents', sub: 'tools and a loop', top: 130 },
  { n: '04', name: 'Autonomous agents', sub: 'runs unattended', top: 95 },
  { n: '05', name: 'Agentic workflow', sub: 'many agents, one goal', top: 60 },
]

function WhatWellCoverSlide() {
  return (
    <div className="diag-above">
      <div className="diag-figure">
        <svg className="diag-svg" width="1120" height="320" viewBox="0 0 1120 320">
          {STEPS.map(({ n, name, sub, top }, i) => {
            const x = 20 + i * 220
            const last = i === STEPS.length - 1
            return (
              <g key={n}>
                <rect
                  x={x} y={top} width="200" height={BASE - top} rx="8"
                  fill={last ? 'rgba(107,91,245,0.07)' : '#fff'}
                  stroke={last ? VIOLET : LINE}
                  strokeWidth="1.5"
                />
                <text x={x + 16} y={top + 24} style={{ fontFamily: 'var(--mono)', fontSize: 11, fill: 'var(--muted)' }}>{n}</text>
                <text x={x + 16} y={top + 48} style={{ fontFamily: 'var(--mono)', fontSize: 16, fill: last ? '#4b3ddb' : INK }}>{name}</text>
                <text x={x + 16} y={top + 68} style={{ fontFamily: 'var(--mono)', fontSize: 11, fill: 'var(--muted)' }}>{sub}</text>

                {/* the riser between this step and the next */}
                {!last && (
                  <g>
                    <line x1={x + 200} y1={top + 10} x2={x + 212} y2={top + 10} stroke={VIOLET} strokeWidth="1.5" />
                    <polygon points={`${x + 220},${top + 10} ${x + 210},${top + 5} ${x + 210},${top + 15}`} fill={VIOLET} />
                  </g>
                )}
              </g>
            )
          })}

          <line x1="20" y1={BASE} x2="1100" y2={BASE} stroke={LINE} strokeWidth="1.5" />
          <text x="20" y="312" style={{ fontFamily: 'var(--mono)', fontSize: 11, fill: 'var(--muted)' }}>you hold everything</text>
          <text x="1100" y="312" textAnchor="end" style={{ fontFamily: 'var(--mono)', fontSize: 11, fill: 'var(--muted)' }}>it holds the loop</text>
        </svg>
      </div>

      <ul className="bullets">
        <li><span>Each step hands over one more thing</span></li>
        <li><span>When the output is bad, you'll know which step broke</span></li>
      </ul>
    </div>
  )
}

WhatWellCoverSlide.meta = {
  title: "What we'll cover",
  section: 'intro',
  sectionLabel: 'Introduction',
  notes: 'Return to this staircase verbally at each section change rather than reprinting it — name the step you are on. The rise is the argument: nothing here is a new technology, each step is the same machinery with one more decision delegated. Only the last step is accented because that is where the talk is going, not where it starts.',
}

export default WhatWellCoverSlide
