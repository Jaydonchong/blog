/* One trace of one agent run: the spans, what each cost, and which one ate
   the run. 1000 wide on a 1000 viewBox, so k = 1: 16 primary, 11 secondary,
   1.5 stroke. Bars live in the 250..1000 gutter; span x/w are offsets in it. */

const LINE = '#c6c3ba'
const VIOLET = '#6b5bf5'
const INK = '#1b1e26'

const LABEL = { fontFamily: 'var(--mono)', fontSize: 16, fill: INK }
const NOTE = { fontFamily: 'var(--mono)', fontSize: 11, fill: 'var(--muted)' }

const BASE = 250

const SPANS = [
  { name: 'agent run',    depth: 0, x: 0,   w: 748, t: '4.8s' },
  { name: 'llm · think',  depth: 1, x: 0,   w: 120, t: '0.9s', llm: true },
  { name: 'read_file',    depth: 2, x: 124, w: 40,  t: '0.1s' },
  { name: 'llm · think',  depth: 1, x: 168, w: 110, t: '0.8s', llm: true },
  { name: 'edit_file',    depth: 2, x: 282, w: 46,  t: '0.1s' },
  { name: 'run_tests',    depth: 2, x: 332, w: 300, t: '2.4s', slow: true },
  { name: 'llm · verify', depth: 1, x: 636, w: 112, t: '0.5s', llm: true },
]

function ObservabilitySlide() {
  return (
    <div className="diag-above">
      <div className="diag-figure">
        <svg className="diag-svg" width="1000" height="232" viewBox="0 0 1000 232">
          <text x="0" y="14" style={NOTE}>TRACE · fix the failing test</text>
          <text x="1000" y="14" textAnchor="end" style={NOTE}>opus · 12.4k tokens · 7 tool calls</text>
          <line x1="0" y1="24" x2="1000" y2="24" stroke={LINE} strokeWidth="1.5" />

          {SPANS.map(({ name, depth, x, w, t, llm, slow }, i) => {
            const y = 48 + i * 26
            return (
              <g key={name + i}>
                <text x={depth * 18} y={y + 5} style={LABEL}>{name}</text>
                <rect
                  x={BASE + x} y={y - 7} width={w} height="14" rx="3"
                  fill={llm || slow ? VIOLET : 'var(--paper-2)'}
                  opacity={depth === 0 ? 0.35 : 1}
                />
                <text x={BASE + x + w + 8} y={y + 4} style={NOTE}>{t}</text>
              </g>
            )
          })}

          {/* the span that owns half the wall clock */}
          <text x={BASE + 332} y="222" style={NOTE}>run_tests is half the run — everything else is waiting on it</text>
        </svg>
      </div>

      <ul className="bullets">
        <li><span>Are your agents calling tools efficiently</span></li>
        <li><span>Are your agents processing tasks consistently</span></li>
        <li><span>Are your agents using the right model</span></li>
      </ul>
    </div>
  )
}

ObservabilitySlide.meta = {
  title: 'Observability',
  subtitle: 'Monitoring your agent',
  section: 'loop',
  sectionLabel: 'Loop Engineering',
  notes: 'A trace is one run broken into spans: every model call, every tool call, what each cost in time and tokens. Read it for three things — tool calls that repeat or fetch what the agent already had, runs of the same task that look different every time, and a big model doing work a small one would have done. Without this you cannot debug a loop, only restart it. Log every run: cost, context size, tool calls, outcome.',
}

export default ObservabilitySlide
