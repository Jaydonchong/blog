/* The pipeline: five artefacts, four boundaries, and the dashed line back —
   a restart starts at a boundary, not at the beginning. 1000 wide on a 1000
   viewBox, so k = 1: 16 primary, 11 secondary, 1.5 stroke. */

const LINE = '#c6c3ba'
const VIOLET = '#6b5bf5'
const INK = '#1b1e26'

const LABEL = { fontFamily: 'var(--mono)', fontSize: 16, fill: INK }
const NOTE = { fontFamily: 'var(--mono)', fontSize: 11, fill: 'var(--muted)' }

const W = 148
const GAP = 62

const STAGES = [
  { name: 'PROMPT', sub: 'one sentence',  accent: true },
  { name: 'PRD',    sub: 'what & why' },
  { name: 'SPEC',   sub: 'how' },
  { name: 'PLAN',   sub: 'in what order' },
  { name: 'ISSUES', sub: 'who does what', stack: true },
]

/* a checkpoint on the boundary: approve, edit, or turn back */
function Gate({ x }) {
  return (
    <g>
      <circle cx={x} cy="92" r="9" fill="#fff" stroke={VIOLET} strokeWidth="1.5" />
      <path d={`M${x - 4} 92 L${x - 1} 95 L${x + 4} 88`} fill="none" stroke={VIOLET} strokeWidth="1.5" />
    </g>
  )
}

function DesigningAWorkflowSlide() {
  return (
    <div className="diag-above">
      <div className="diag-figure">
        <svg className="diag-svg" width="1000" height="210" viewBox="0 0 1000 210">
          <text x="0" y="16" style={NOTE}>every boundary is a checkpoint — approve, edit, or turn back</text>

          {STAGES.map(({ name, sub, accent, stack }, i) => {
            const x = i * (W + GAP)
            return (
              <g key={name}>
                {/* an issue set is many documents, not one */}
                {stack && (
                  <>
                    <rect x={x + 10} y="54" width={W} height="96" rx="8" fill="#fff" stroke={LINE} strokeWidth="1.5" />
                    <rect x={x + 5} y="49" width={W} height="96" rx="8" fill="#fff" stroke={LINE} strokeWidth="1.5" />
                  </>
                )}

                <rect
                  x={x} y="44" width={W} height="96" rx="8"
                  fill={accent ? 'rgba(107,91,245,0.06)' : '#fff'}
                  stroke={accent ? VIOLET : LINE}
                  strokeWidth="1.5"
                />

                {/* what is written on it */}
                <rect x={x + 16} y="62" width="116" height="6" rx="3" fill="var(--paper-2)" />
                <rect x={x + 16} y="76" width="116" height="6" rx="3" fill="var(--paper-2)" />
                <rect x={x + 16} y="90" width="76" height="6" rx="3" fill="var(--paper-2)" />

                <text x={x + W / 2} y="122" textAnchor="middle" style={NOTE}>{sub}</text>
                <text x={x + W / 2} y="172" textAnchor="middle" style={{ ...LABEL, fill: accent ? '#4b3ddb' : INK }}>{name}</text>
              </g>
            )
          })}

          {/* each stage hands its output to the next, through a checkpoint */}
          {STAGES.slice(1).map((stage, i) => {
            const right = i * (W + GAP) + W
            const gate = right + GAP / 2
            return (
              <g key={stage.name}>
                <line x1={right + 8} y1="92" x2={gate - 11} y2="92" stroke={VIOLET} strokeWidth="1.5" />
                <Gate x={gate} />
                <line x1={gate + 11} y1="92" x2={right + GAP - 12} y2="92" stroke={VIOLET} strokeWidth="1.5" />
                <polygon points={`${right + GAP - 4},92 ${right + GAP - 14},87 ${right + GAP - 14},97`} fill={VIOLET} />
              </g>
            )
          })}

          {/* turning back costs one stage, not the whole run */}
          <path
            d="M914 180 V 198 Q 914 204 908 204 H 500 Q 494 204 494 198 V 182"
            fill="none" stroke={LINE} strokeWidth="1.5" strokeDasharray="3,3"
          />
          <polygon points="490,184 494,176 498,184" fill={LINE} />
          <text x="704" y="197" textAnchor="middle" style={NOTE}>restart from a boundary, not from scratch</text>
        </svg>
      </div>

      <ul className="bullets">
        <li><span className="strong">Prompt → PRD → SPEC → PLAN → ISSUES</span></li>
        <li><span>Each stage's output is the next stage's context</span></li>
        <li><span>Every boundary is a cheap place to check, or restart</span></li>
      </ul>
    </div>
  )
}

DesigningAWorkflowSlide.meta = {
  title: 'Designing a workflow',
  section: 'loop',
  sectionLabel: 'Loop Engineering',
  notes: 'Real artefacts from a real feature are the most persuasive thing here; a genuine PRD the model wrote beats any diagram. The point of the checkpoints is economics: a wrong assumption caught at the PRD boundary costs one document, the same assumption caught at the issues boundary costs five. The dashed return line is the one people skip — when a stage comes out wrong you re-run that stage with better context, you do not start the prompt over.',
}

export default DesigningAWorkflowSlide
