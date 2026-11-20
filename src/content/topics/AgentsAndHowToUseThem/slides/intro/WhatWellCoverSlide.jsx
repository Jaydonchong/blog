/* The deck as a flow: one node per section, carrying the same words its
   divider card does. Four across, then the flow wraps to a second row.
   k = 1 (1120 wide on a 1120 viewBox): 16 primary, 11 secondary, 1.5 stroke. */

const LINE = '#c6c3ba'
const VIOLET = '#6b5bf5'
const INK = '#1b1e26'

const W = 250
const H = 86
const PITCH = 284
const ROW_1 = 40
const ROW_2 = 170

/* head is the section divider's subtitle, split where it will not fit */
const NODES = [
  { n: '01', head: ['Creating reasoning'],                 sub: 'LLM' },
  { n: '02', head: ['Taking on task'],                     sub: 'PROMPT' },
  { n: '03', head: ['Empowering with', 'information'],     sub: 'CONTEXT' },
  { n: '04', head: ['Allowing action'],                    sub: 'TOOLS' },
  { n: '05', head: ['Packaging environment'],              sub: 'HARNESS' },
  { n: '06', head: ['Providing Autonomy'],                 sub: 'LOOP' },
  { n: '07', head: ['Coordination and', 'Collaboration'],  sub: 'GRAPH', accent: true },
]

function WhatWellCoverSlide() {
  return (
    <div className="diag-above">
      <div className="diag-figure">
        <svg className="diag-svg" width="1120" height="272" viewBox="0 0 1120 272">
          {NODES.map(({ n, head, sub, accent }, i) => {
            const row = i < 4 ? 0 : 1
            const x = 10 + (i - row * 4) * PITCH
            const y = row === 0 ? ROW_1 : ROW_2
            const heads = head.length === 1 ? [y + 44] : [y + 34, y + 54]
            const lastInRow = i === 3 || i === NODES.length - 1
            return (
              <g key={n}>
                <rect
                  x={x} y={y} width={W} height={H} rx="8"
                  fill={accent ? 'rgba(107,91,245,0.07)' : '#fff'}
                  stroke={accent ? VIOLET : LINE}
                  strokeWidth="1.5"
                />
                <text x={x + W - 16} y={y + 22} textAnchor="end" style={{ fontFamily: 'var(--mono)', fontSize: 11, fill: 'var(--muted)' }}>{n}</text>

                {head.map((lineText, j) => (
                  <text
                    key={lineText}
                    x={x + 16} y={heads[j]}
                    style={{ fontFamily: 'var(--mono)', fontSize: 16, fill: accent ? '#4b3ddb' : INK }}
                  >
                    {lineText}
                  </text>
                ))}

                <text x={x + 16} y={y + 74} style={{ fontFamily: 'var(--mono)', fontSize: 11, fill: 'var(--muted)', letterSpacing: '0.12em' }}>{sub}</text>

                {/* on to the next one along the row */}
                {!lastInRow && (
                  <g>
                    <line x1={x + W + 6} y1={y + H / 2} x2={x + W + 20} y2={y + H / 2} stroke={VIOLET} strokeWidth="1.5" />
                    <polygon points={`${x + W + 28},${y + H / 2} ${x + W + 18},${y + H / 2 - 5} ${x + W + 18},${y + H / 2 + 5}`} fill={VIOLET} />
                  </g>
                )}
              </g>
            )
          })}

          {/* the flow wraps, the way a line of text does */}
          <path
            d="M987 126 V 140 Q 987 148 979 148 H 143 Q 135 148 135 156 V 162"
            fill="none" stroke={VIOLET} strokeWidth="1.5"
          />
          <polygon points="135,170 130,160 140,160" fill={VIOLET} />
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
  notes: 'One node per section, worded exactly like the divider card that opens it, so the callback at each section change is literal — name the node you are on. The order is the argument: nothing here is a new technology, each step is the same machinery with one more decision delegated. Only Graph is accented because that is where the talk is going, not where it starts.',
}

export default WhatWellCoverSlide
