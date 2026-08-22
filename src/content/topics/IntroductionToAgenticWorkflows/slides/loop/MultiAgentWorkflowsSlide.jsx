/* Six micro-diagrams on one grid. Every SVG is drawn in a 300x110 viewBox and
   rendered at 300x110, so k = 1 and the numbers below are rendered px:
   node label 14, secondary label 11, stroke 1.5. */

const LINE = '#c6c3ba'
const VIOLET = '#6b5bf5'
const R = 15

function Node({ x, y, label, accent }) {
  return (
    <g>
      <circle
        cx={x} cy={y} r={R}
        fill={accent ? 'rgba(107,91,245,0.07)' : '#fff'}
        stroke={accent ? VIOLET : LINE}
        strokeWidth="1.5"
      />
      <text
        x={x} y={y + 5}
        textAnchor="middle"
        style={{ fontFamily: 'var(--mono)', fontSize: 14, fill: accent ? '#4b3ddb' : '#1b1e26' }}
      >
        {label}
      </text>
    </g>
  )
}

/* Draws from centre to centre but trims both ends by the node radius, so the
   arrowhead lands on the circle's edge whatever the angle. */
function Arrow({ x1, y1, x2, y2, accent, dashed, trimStart = R, trimEnd = R }) {
  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.hypot(dx, dy) || 1
  const ux = dx / len
  const uy = dy / len
  const sx = x1 + ux * trimStart
  const sy = y1 + uy * trimStart
  const ex = x2 - ux * trimEnd
  const ey = y2 - uy * trimEnd
  const hx = ex - ux * 7
  const hy = ey - uy * 7
  const px = -uy * 4
  const py = ux * 4
  const color = accent ? VIOLET : LINE
  return (
    <g>
      <line
        x1={sx} y1={sy} x2={hx} y2={hy}
        stroke={color} strokeWidth="1.5"
        strokeDasharray={dashed ? '4 3' : undefined}
      />
      <polygon points={`${ex},${ey} ${hx + px},${hy + py} ${hx - px},${hy - py}`} fill={color} />
    </g>
  )
}

function Cap({ x, y, children }) {
  return (
    <text
      x={x} y={y}
      textAnchor="middle"
      style={{ fontFamily: 'var(--mono)', fontSize: 11, fill: '#868da0' }}
    >
      {children}
    </text>
  )
}

function Fig({ children }) {
  return (
    <svg className="diag-svg" width="300" height="110" viewBox="0 0 300 110">
      {children}
    </svg>
  )
}

function MultiAgentWorkflowsSlide() {
  return (
    <div className="diag-gallery diag-gallery--3">
      {/* Pipeline — one line, no coordinator */}
      <div className="diag-card diag-card--tight">
        <div className="diag-card__head">Pipeline</div>
        <Fig>
          <Node x={50} y={58} label="A" />
          <Node x={150} y={58} label="B" />
          <Node x={250} y={58} label="C" />
          <Arrow x1={50} y1={58} x2={150} y2={58} accent />
          <Arrow x1={150} y1={58} x2={250} y2={58} accent />
          <Cap x={150} y={98}>fixed order, one direction</Cap>
        </Fig>
        <p className="diag-card__cap">Sequential. Each stage owns its own context.</p>
      </div>

      {/* Swarming — peers hand off, no centre */}
      <div className="diag-card diag-card--tight">
        <div className="diag-card__head">Swarming</div>
        <Fig>
          <Node x={60} y={78} label="A" />
          <Node x={150} y={26} label="B" />
          <Node x={240} y={78} label="C" />
          <Arrow x1={60} y1={78} x2={150} y2={26} accent />
          <Arrow x1={150} y1={26} x2={240} y2={78} accent />
          <Arrow x1={240} y1={78} x2={60} y2={78} accent />
          <Cap x={150} y={104}>whoever holds it, decides next</Cap>
        </Fig>
        <p className="diag-card__cap">Peers hand work off. No one holds the whole picture.</p>
      </div>

      {/* Orchestration — coordinator delegates and sequences */}
      <div className="diag-card diag-card--tight">
        <div className="diag-card__head">Orchestration</div>
        <Fig>
          <Node x={150} y={24} label="O" accent />
          <Node x={55} y={80} label="A" />
          <Node x={150} y={80} label="B" />
          <Node x={245} y={80} label="C" />
          <Arrow x1={150} y1={24} x2={55} y2={80} accent />
          <Arrow x1={150} y1={24} x2={150} y2={80} accent />
          <Arrow x1={150} y1={24} x2={245} y2={80} accent />
          <Arrow x1={55} y1={80} x2={150} y2={80} dashed />
          <Arrow x1={150} y1={80} x2={245} y2={80} dashed />
          <Cap x={150} y={106}>coordinator decides what runs next</Cap>
        </Fig>
        <p className="diag-card__cap">One coordinator delegates and keeps the flow.</p>
      </div>

      {/* Supervisor — delegates out, collects back */}
      <div className="diag-card diag-card--tight">
        <div className="diag-card__head">Supervisor</div>
        <Fig>
          <Node x={150} y={24} label="S" accent />
          <Node x={55} y={82} label="A" />
          <Node x={150} y={82} label="B" />
          <Node x={245} y={82} label="C" />
          <Arrow x1={142} y1={24} x2={47} y2={82} accent />
          <Arrow x1={140} y1={24} x2={140} y2={82} accent />
          <Arrow x1={158} y1={24} x2={253} y2={82} accent />
          <Arrow x1={63} y1={82} x2={158} y2={24} />
          <Arrow x1={160} y1={82} x2={160} y2={24} />
          <Arrow x1={237} y1={82} x2={142} y2={24} />
          <Cap x={150} y={106}>out to work, back with results</Cap>
        </Fig>
        <p className="diag-card__cap">Delegates in parallel, then collects the answers.</p>
      </div>

      {/* Router + Synthesizer — fan out, fan in */}
      <div className="diag-card diag-card--tight">
        <div className="diag-card__head">Router + Synthesizer</div>
        <Fig>
          <Node x={38} y={55} label="R" accent />
          <Node x={150} y={18} label="A" />
          <Node x={150} y={55} label="B" />
          <Node x={150} y={92} label="C" />
          <Node x={262} y={55} label="S" accent />
          <Arrow x1={38} y1={55} x2={150} y2={18} />
          <Arrow x1={38} y1={55} x2={150} y2={55} />
          <Arrow x1={38} y1={55} x2={150} y2={92} />
          <Arrow x1={150} y1={18} x2={262} y2={55} />
          <Arrow x1={150} y1={55} x2={262} y2={55} />
          <Arrow x1={150} y1={92} x2={262} y2={55} />
        </Fig>
        <p className="diag-card__cap">Fan out to specialists, fan in to one answer.</p>
      </div>

      {/* The tradeoff — a dial, not a menu */}
      <div className="diag-card diag-card--tight">
        <div className="diag-card__head">The tradeoff</div>
        <Fig>
          <line x1={40} y1={52} x2={260} y2={52} stroke={LINE} strokeWidth="1.5" />
          <line x1={40} y1={44} x2={40} y2={60} stroke={LINE} strokeWidth="1.5" />
          <line x1={260} y1={44} x2={260} y2={60} stroke={LINE} strokeWidth="1.5" />
          <circle cx={150} cy={52} r={8} fill="rgba(107,91,245,0.07)" stroke={VIOLET} strokeWidth="1.5" />
          <text x={40} y={30} textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 14, fill: '#1b1e26' }}>context</text>
          <text x={260} y={30} textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 14, fill: '#1b1e26' }}>efficiency</text>
          <Cap x={40} y={78}>clean, isolated</Cap>
          <Cap x={260} y={78}>fewer hops</Cap>
          <Cap x={150} y={100}>every pattern above sits somewhere here</Cap>
        </Fig>
        <p className="diag-card__cap">Context management vs efficiency — pick a point.</p>
      </div>
    </div>
  )
}

MultiAgentWorkflowsSlide.meta = {
  title: 'Multiagent Patterns',
  section: 'multiagent',
  sectionLabel: 'Multi-agent',
  notes: 'Same isolation-vs-coherence tension as subagents, now at system scale. Swarming suits pipelines with clean handoff boundaries; orchestration suits work where a global view is needed to decide what happens next.',
}

export default MultiAgentWorkflowsSlide
