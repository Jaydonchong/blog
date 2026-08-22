/* The run as a rail, with the fixed points hooks hang off. k = 1 (1000 wide on
   a 1000 viewBox): 14 primary, 11 secondary, 1.5 stroke. */

const LINE = '#c6c3ba'
const VIOLET = '#6b5bf5'

const PRIMARY = { fontFamily: 'var(--mono)', fontSize: 14, fill: '#1b1e26' }
const NOTE = { fontFamily: 'var(--mono)', fontSize: 11, fill: 'var(--muted)' }

const POINTS = [
  { at: 'SessionStart', x: 110, does: 'load MEMORY.md', when: 'every session' },
  { at: 'PreToolUse', x: 370, does: 'block rm -rf', when: 'before the call' },
  { at: 'PostToolUse', x: 630, does: 'run tests', when: 'after every edit' },
  { at: 'SessionEnd', x: 890, does: 'update memory', when: 'a prompt on exit' },
]

function HooksSlide() {
  return (
    <div className="diag-above">
      <div className="diag-figure">
        <svg className="diag-svg" width="1000" height="210" viewBox="0 0 1000 210">
          <text x="10" y="12" style={NOTE}>ONE RUN</text>
          <line x1="10" y1="46" x2="990" y2="46" stroke={LINE} strokeWidth="1.5" />

          {/* The tool call itself, sitting between its two hook points */}
          <rect x="450" y="32" width="100" height="28" rx="5" fill="#fff" stroke={LINE} strokeWidth="1.5" />
          <text x="500" y="51" textAnchor="middle" style={NOTE}>tool runs</text>

          {POINTS.map(({ at, x, does, when }) => (
            <g key={at}>
              <text x={x} y="24" textAnchor="middle" style={PRIMARY}>{at}</text>
              <circle cx={x} cy="46" r="6" fill={VIOLET} stroke="#4b3ddb" strokeWidth="1.5" />

              {/* dashed = the harness reaching out of the run into your code */}
              <line x1={x} y1="56" x2={x} y2="104" stroke={LINE} strokeWidth="1.5" strokeDasharray="4,3" />
              <polygon points={`${x - 4},102 ${x + 4},102 ${x},110`} fill={LINE} />

              <rect x={x - 100} y="112" width="200" height="62" rx="6" fill="#fff" stroke={VIOLET} strokeWidth="1.5" />
              <text x={x} y="140" textAnchor="middle" style={{ ...PRIMARY, fill: '#4b3ddb' }}>{does}</text>
              <text x={x} y="160" textAnchor="middle" style={NOTE}>{when}</text>
            </g>
          ))}

          <text x="500" y="198" textAnchor="middle" style={NOTE}>fires whether the model remembers to or not</text>
        </svg>
      </div>

      <ul className="bullets">
        <li><span>Code that fires at fixed points in a run</span></li>
        <li><span>Run tests after an edit · notify on completion</span></li>
        <li><span>Session end: run a prompt that updates memory</span></li>
      </ul>
      <p className="pull">Deterministic scaffolding around a non-deterministic core.</p>
    </div>
  )
}

HooksSlide.meta = {
  title: 'Hooks',
  section: 'harness',
  sectionLabel: 'Harness Engineering',
  notes: 'The rail is the run; the violet dots are the points the harness will stop at whatever the model is doing. Direct callback to the characteristics slide. Worth saying out loud if time allows: every time you catch yourself asking the model to reliably remember to do something, that is a hook.',
}

export default HooksSlide
