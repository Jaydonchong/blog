/* Cause and effect, side by side. Each SVG is 500x360 on a 500x360 viewBox,
   so k = 1: 16 primary, 11 secondary, 1.5 stroke. Rose marks the point where
   the window stops working for you. */

const LINE = '#c6c3ba'
const VIOLET = '#6b5bf5'
const INK = '#1b1e26'

const LABEL = { fontFamily: 'var(--mono)', fontSize: 16, fill: INK }
const NOTE = { fontFamily: 'var(--mono)', fontSize: 11, fill: 'var(--muted)' }
const TAG = { fontFamily: 'var(--mono)', fontSize: 11, fill: '#4b3ddb', letterSpacing: '0.12em' }
const WARN = { fontFamily: 'var(--mono)', fontSize: 11, fill: 'var(--rose)' }

/* one window, five points in the same session */
const TURNS = [
  { label: 'turn 1', fill: 0.15 },
  { label: 'turn 5', fill: 0.35 },
  { label: 'turn 10', fill: 0.6 },
  { label: 'turn 20', fill: 0.85 },
  { label: 'turn 40', fill: 1 },
]

const TOP = 60
const BOT = 300
const H = BOT - TOP

function ContextIsAResourceThatDoesNotScaleSlide() {
  return (
    <div className="diag-above">
      <div className="diag-gallery diag-gallery--2">
        {/* Cause — it only ever fills up */}
        <div className="diag-card diag-card--tight">
          <div className="diag-card__head">Context bloat</div>
          <svg className="diag-svg" width="500" height="360" viewBox="0 0 500 360">
            <text x="0" y="22" style={NOTE}>one window · every turn adds to it</text>
            <text x="500" y="22" textAnchor="end" style={TAG}>CAUSE</text>

            {TURNS.map(({ label, fill }, i) => {
              const x = 20 + i * 100
              const h = H * fill
              return (
                <g key={label}>
                  <rect x={x} y={TOP} width="60" height={H} rx="4" fill="var(--paper-2)" stroke={LINE} strokeWidth="1.5" />
                  <rect x={x} y={BOT - h} width="60" height={h} rx="4" fill={VIOLET} />
                  <text x={x + 30} y="322" textAnchor="middle" style={NOTE}>{label}</text>
                </g>
              )
            })}

            {/* the last column has nowhere left to put anything */}
            <line x1="414" y1={TOP} x2="486" y2={TOP} stroke="var(--rose)" strokeWidth="1.5" />
            <text x="486" y={TOP - 8} textAnchor="end" style={WARN}>no room left</text>

            <text x="0" y="352" style={NOTE}>tools, memory and history are paid for again on every turn</text>
          </svg>
          <p className="diag-card__cap">Nothing leaves unless you make it leave.</p>
        </div>

        {/* Effect — the fuller it is, the worse it reads */}
        <div className="diag-card diag-card--tight">
          <div className="diag-card__head">Context rot</div>
          <svg className="diag-svg" width="500" height="360" viewBox="0 0 500 360">
            <text x="0" y="22" style={NOTE}>how well it uses what is in there</text>
            <text x="500" y="22" textAnchor="end" style={TAG}>EFFECT</text>

            <line x1="50" y1={TOP} x2="50" y2={BOT} stroke={LINE} strokeWidth="1.5" />
            <line x1="50" y1={BOT} x2="486" y2={BOT} stroke={LINE} strokeWidth="1.5" />
            <text x="50" y="52" style={NOTE}>quality</text>

            {/* flat for a while, then it falls off */}
            <path d="M50 82 C 200 92, 300 130, 486 272" fill="none" stroke={VIOLET} strokeWidth="1.5" />

            <line x1="50" y1="190" x2="486" y2="190" stroke={LINE} strokeWidth="1.5" strokeDasharray="4,4" />
            <text x="56" y="184" style={NOTE}>still usable</text>

            <line x1="392" y1={TOP} x2="392" y2={BOT} stroke="var(--rose)" strokeWidth="1.5" strokeDasharray="4,4" />
            <text x="386" y="76" textAnchor="end" style={WARN}>you start re-explaining</text>

            <text x="50" y="322" style={NOTE}>empty</text>
            <text x="486" y="322" textAnchor="end" style={NOTE}>full</text>

            <text x="0" y="352" style={NOTE}>instructions in the middle are the first to be missed</text>
          </svg>
          <p className="diag-card__cap">A full window follows what is in it worse than a lean one.</p>
        </div>
      </div>
    </div>
  )
}

ContextIsAResourceThatDoesNotScaleSlide.meta = {
  title: 'Context is a resource that does not scale',
  section: 'context',
  sectionLabel: 'Context Engineering',
  notes: 'Two halves of one problem. Bloat is mechanical: the window only fills, and tools, memory files and history are re-billed every turn whether or not they are used. Rot is what bloat buys you — recall and instruction-following degrade well before the window is technically full, and the middle of a long context is what goes first. The practical read: a bigger window is not the fix, because the curve moves right but keeps its shape. The fix is deciding what does not go in.',
}

export default ContextIsAResourceThatDoesNotScaleSlide
