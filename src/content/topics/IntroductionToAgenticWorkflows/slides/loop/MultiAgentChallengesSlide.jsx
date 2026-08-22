/* Four failure modes, four figures. Each SVG is 500x104 on a 500x104 viewBox,
   so k = 1: 16/14 primary, 11 secondary, 1.5 stroke. Rose is the failure
   colour — this is the one slide in the deck that has earned it. */

const LINE = '#c6c3ba'
const VIOLET = '#6b5bf5'
const ROSE = 'var(--rose)'
const INK = '#1b1e26'

const LABEL = { fontFamily: 'var(--mono)', fontSize: 16, fill: INK }
const NOTE = { fontFamily: 'var(--mono)', fontSize: 11, fill: 'var(--muted)' }

/* Same glyph as the patterns slide, so an agent looks like an agent here too */
function Robot({ x, y, label, tone = INK }) {
  return (
    <g>
      <g fill="none" stroke={tone} strokeWidth="1.5">
        <line x1={x} y1={y - 13} x2={x} y2={y - 9} />
        <circle cx={x} cy={y - 14} r="1.5" fill={tone} />
        <rect x={x - 10} y={y - 8} width="20" height="16" rx="5" fill="#fff" />
        <circle cx={x - 5} cy={y} r="2" fill={tone} stroke="none" />
        <circle cx={x + 5} cy={y} r="2" fill={tone} stroke="none" />
      </g>
      {label && (
        <text x={x} y={y + 22} textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 14, fill: tone }}>
          {label}
        </text>
      )}
    </g>
  )
}

function Arrow({ x1, y1, x2, y2, tone = LINE }) {
  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.hypot(dx, dy) || 1
  const ux = dx / len
  const uy = dy / len
  const hx = x2 - ux * 7
  const hy = y2 - uy * 7
  const px = -uy * 4
  const py = ux * 4
  return (
    <g>
      <line x1={x1} y1={y1} x2={hx} y2={hy} stroke={tone} strokeWidth="1.5" />
      <polygon points={`${x2},${y2} ${hx + px},${hy + py} ${hx - px},${hy - py}`} fill={tone} />
    </g>
  )
}

function Fig({ children }) {
  return (
    <svg className="diag-svg" width="500" height="104" viewBox="0 0 500 104">
      {children}
    </svg>
  )
}

const COSTS = [
  { label: '1 agent', bar: 30, spend: '4k', y: 22 },
  { label: '3 agents', bar: 90, spend: '12k', y: 54 },
  { label: '9 agents', bar: 270, spend: '36k', y: 86 },
]

const CASCADE = ['agent A', 'agent B', 'agent C', 'agent D']

function MultiAgentChallengesSlide() {
  return (
    <div
      className="diag-gallery diag-gallery--2"
      style={{ gridAutoRows: 'auto', alignContent: 'center' }}
    >
      {/* Infinite retries — the loop with nothing to stop it */}
      <div className="diag-card diag-card--tight">
        <div className="diag-card__head">Infinite retries</div>
        <Fig>
          <rect x="10" y="28" width="110" height="40" rx="6" fill="#fff" stroke={LINE} strokeWidth="1.5" />
          <text x="65" y="53" textAnchor="middle" style={LABEL}>step</text>
          <Arrow x1={120} y1={48} x2={152} y2={48} />
          <circle cx="178" cy="48" r="14" fill="none" stroke={ROSE} strokeWidth="1.5" />
          <line x1="172" y1="42" x2="184" y2="54" stroke={ROSE} strokeWidth="1.5" />
          <line x1="184" y1="42" x2="172" y2="54" stroke={ROSE} strokeWidth="1.5" />

          <path d="M178 62 V 82 Q 178 88 172 88 H 71 Q 65 88 65 82 V 74" fill="none" stroke={LINE} strokeWidth="1.5" />
          <polygon points="65,66 61,74 69,74" fill={LINE} />
          <text x="122" y="83" textAnchor="middle" style={NOTE}>retry</text>

          <text x="240" y="44" style={LABEL}>attempt 47</text>
          <text x="240" y="64" style={{ ...NOTE, fill: ROSE }}>no budget cap</text>
        </Fig>
        <p className="diag-card__cap">A failed step re-runs forever without a budget cap.</p>
      </div>

      {/* Cost scalability — the bill is the shape */}
      <div className="diag-card diag-card--tight">
        <div className="diag-card__head">Cost scalability</div>
        <Fig>
          {COSTS.map(({ label, bar, spend, y }) => (
            <g key={label}>
              <text x="0" y={y + 5} style={{ ...LABEL, fontSize: 14 }}>{label}</text>
              <rect x="100" y={y - 7} width="300" height="14" rx="3" fill="var(--paper-2)" />
              <rect x="100" y={y - 7} width={bar} height="14" rx="3" fill={VIOLET} />
              <text x={410} y={y + 5} style={NOTE}>{spend} tokens</text>
            </g>
          ))}
        </Fig>
        <p className="diag-card__cap">Token spend multiplies with every parallel agent.</p>
      </div>

      {/* Cascading hallucination — one wrong answer, inherited */}
      <div className="diag-card diag-card--tight">
        <div className="diag-card__head">Cascading hallucination</div>
        <Fig>
          {CASCADE.map((label, i) => {
            const x = 55 + i * 130
            return (
              <g key={label}>
                <Robot x={x} y={38} label={label} tone={ROSE} />
                {i < CASCADE.length - 1 && <Arrow x1={x + 14} y1={38} x2={x + 116} y2={38} tone={ROSE} />}
              </g>
            )
          })}
          <text x="55" y="92" textAnchor="middle" style={{ ...NOTE, fill: ROSE }}>hallucinates</text>
          <text x="315" y="92" textAnchor="middle" style={NOTE}>inherits it, cannot tell</text>
        </Fig>
        <p className="diag-card__cap">One bad output poisons every downstream agent.</p>
      </div>

      {/* Coordination — two writers, one truth */}
      <div className="diag-card diag-card--tight">
        <div className="diag-card__head">Coordination</div>
        <Fig>
          <Robot x={60} y={26} label="agent A" />
          <Robot x={60} y={78} label="agent B" />
          <Arrow x1={110} y1={22} x2={268} y2={38} />
          <Arrow x1={110} y1={74} x2={268} y2={62} />
          <text x="190" y="14" textAnchor="middle" style={NOTE}>sets done</text>
          <text x="190" y="98" textAnchor="middle" style={NOTE}>sets retry</text>

          <rect x="276" y="22" width="200" height="56" rx="6" fill="#fff" stroke={VIOLET} strokeWidth="1.5" />
          <text x="292" y="44" style={NOTE}>SHARED STATE</text>
          <text x="292" y="66" style={{ ...LABEL, fill: '#4b3ddb' }}>status = ?</text>
        </Fig>
        <p className="diag-card__cap">Shared state and handoff boundaries are hard to get right.</p>
      </div>
    </div>
  )
}

MultiAgentChallengesSlide.meta = {
  title: 'Multiagent Challenges',
  subtitle: 'Challenges faced in distributed systems',
  section: 'multiagent',
  sectionLabel: 'Multi-agent',
  notes: 'Each challenge maps to a mitigation: retry budgets, per-agent token limits, verification gates between agents, explicit handoff contracts. The cascade card is the one to dwell on — a downstream agent has no way to tell a hallucinated input from a real one, which is why the gate has to be explicit. None of these are solved problems — they are design constraints.',
}

export default MultiAgentChallengesSlide
