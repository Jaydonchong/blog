/* Six micro-diagrams on one grid. Every SVG is drawn in a 300x134 viewBox and
   rendered at 300x134, so k = 1 and the numbers below are rendered px:
   node label 14, secondary label 11, stroke 1.5. */

const LINE = '#c6c3ba'
const VIOLET = '#6b5bf5'
const INK = '#1b1e26'

/* A robot centred on (x, y): antenna at y-14, head y-8..y+8, label at y+22.
   Arrows are supplied pre-trimmed, so the icon's own extent lives here only. */
function Node({ x, y, label, accent }) {
  const stroke = accent ? VIOLET : INK
  const text = accent ? '#4b3ddb' : INK
  return (
    <g>
      <g fill="none" stroke={stroke} strokeWidth="1.5">
        <line x1={x} y1={y - 13} x2={x} y2={y - 9} />
        <circle cx={x} cy={y - 14} r="1.5" fill={stroke} />
        <rect x={x - 10} y={y - 8} width="20" height="16" rx="5" fill={accent ? 'rgba(107,91,245,0.07)' : '#fff'} />
        <circle cx={x - 5} cy={y} r="2" fill={stroke} stroke="none" />
        <circle cx={x + 5} cy={y} r="2" fill={stroke} stroke="none" />
      </g>
      <text x={x} y={y + 22} textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 14, fill: text }}>
        {label}
      </text>
    </g>
  )
}

function Arrow({ x1, y1, x2, y2, accent, dashed }) {
  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.hypot(dx, dy) || 1
  const ux = dx / len
  const uy = dy / len
  const hx = x2 - ux * 7
  const hy = y2 - uy * 7
  const px = -uy * 4
  const py = ux * 4
  const color = accent ? VIOLET : LINE
  return (
    <g>
      <line x1={x1} y1={y1} x2={hx} y2={hy} stroke={color} strokeWidth="1.5" strokeDasharray={dashed ? '4 3' : undefined} />
      <polygon points={`${x2},${y2} ${hx + px},${hy + py} ${hx - px},${hy - py}`} fill={color} />
    </g>
  )
}

/* A head at both ends — the edge is a handoff either way */
function Link({ x1, y1, x2, y2, accent }) {
  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.hypot(dx, dy) || 1
  const ux = dx / len
  const uy = dy / len
  const px = -uy * 4
  const py = ux * 4
  const ax = x1 + ux * 7
  const ay = y1 + uy * 7
  const bx = x2 - ux * 7
  const by = y2 - uy * 7
  const color = accent ? VIOLET : LINE
  return (
    <g>
      <line x1={ax} y1={ay} x2={bx} y2={by} stroke={color} strokeWidth="1.5" />
      <polygon points={`${x1},${y1} ${ax + px},${ay + py} ${ax - px},${ay - py}`} fill={color} />
      <polygon points={`${x2},${y2} ${bx + px},${by + py} ${bx - px},${by - py}`} fill={color} />
    </g>
  )
}

function Cap({ x, y, children }) {
  return (
    <text x={x} y={y} textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 11, fill: 'var(--muted)' }}>
      {children}
    </text>
  )
}

function Fig({ children }) {
  return (
    <svg className="diag-svg" width="300" height="134" viewBox="0 0 300 134">
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
          <Node x={48} y={52} label="agent A" />
          <Node x={150} y={52} label="agent B" />
          <Node x={252} y={52} label="agent C" />
          <Arrow x1={62} y1={52} x2={136} y2={52} accent />
          <Arrow x1={164} y1={52} x2={238} y2={52} accent />
          <Cap x={150} y={104}>fixed order, one direction</Cap>
        </Fig>
        <p className="diag-card__cap">Sequential. Each stage owns its own context.</p>
      </div>

      {/* Swarming — peers hand off, no centre */}
      <div className="diag-card diag-card--tight">
        <div className="diag-card__head">Swarming</div>
        <Fig>
          <Node x={150} y={30} label="agent B" />
          <Node x={55} y={96} label="agent A" />
          <Node x={245} y={96} label="agent C" />
          {/* every pair, both directions */}
          <Link x1={70} y1={86} x2={135} y2={40} accent />
          <Link x1={165} y1={40} x2={230} y2={86} accent />
          <Link x1={71} y1={96} x2={229} y2={96} accent />
        </Fig>
        <p className="diag-card__cap">Any peer hands to any peer. No one holds the whole picture.</p>
      </div>

      {/* Orchestration — coordinator delegates and sequences */}
      <div className="diag-card diag-card--tight">
        <div className="diag-card__head">Orchestration</div>
        <Fig>
          <Node x={150} y={26} label="orchestrator" accent />
          <Node x={45} y={100} label="agent A" />
          <Node x={150} y={100} label="agent B" />
          <Node x={255} y={100} label="agent C" />
          <Arrow x1={138} y1={54} x2={55} y2={83} accent />
          <Arrow x1={150} y1={54} x2={150} y2={85} accent />
          <Arrow x1={162} y1={54} x2={245} y2={83} accent />
          <Arrow x1={61} y1={100} x2={134} y2={100} dashed />
          <Arrow x1={166} y1={100} x2={239} y2={100} dashed />
        </Fig>
        <p className="diag-card__cap">One coordinator delegates and keeps the flow.</p>
      </div>

      {/* Supervisor — delegates out, collects back */}
      <div className="diag-card diag-card--tight">
        <div className="diag-card__head">Supervisor</div>
        <Fig>
          <Node x={150} y={26} label="supervisor" accent />
          <Node x={45} y={100} label="agent A" />
          <Node x={150} y={100} label="agent B" />
          <Node x={255} y={100} label="agent C" />
          <Arrow x1={134} y1={54} x2={48} y2={84} accent />
          <Arrow x1={144} y1={54} x2={144} y2={85} accent />
          <Arrow x1={166} y1={54} x2={252} y2={84} accent />
          <Arrow x1={60} y1={88} x2={142} y2={56} />
          <Arrow x1={156} y1={85} x2={156} y2={56} />
          <Arrow x1={240} y1={88} x2={158} y2={56} />
        </Fig>
        <p className="diag-card__cap">Delegates in parallel, then collects the answers.</p>
      </div>

      {/* Router + Synthesizer — fan out, fan in */}
      <div className="diag-card diag-card--tight">
        <div className="diag-card__head">Router + Synthesizer</div>
        <Fig>
          <Node x={40} y={67} label="router" accent />
          <Node x={150} y={25} label="agent A" />
          <Node x={150} y={67} label="agent B" />
          <Node x={150} y={109} label="agent C" />
          <Node x={260} y={67} label="synth" accent />
          <Arrow x1={57} y1={61} x2={133} y2={31} />
          <Arrow x1={56} y1={67} x2={134} y2={67} />
          <Arrow x1={57} y1={73} x2={133} y2={103} />
          <Arrow x1={167} y1={31} x2={243} y2={61} />
          <Arrow x1={166} y1={67} x2={244} y2={67} />
          <Arrow x1={167} y1={103} x2={243} y2={73} />
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
          <text x={40} y={30} textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 14, fill: INK }}>context</text>
          <text x={260} y={30} textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 14, fill: INK }}>efficiency</text>
          <Cap x={40} y={78}>clean, isolated</Cap>
          <Cap x={260} y={78}>fewer hops</Cap>
          <Cap x={150} y={104}>every pattern above sits somewhere here</Cap>
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
