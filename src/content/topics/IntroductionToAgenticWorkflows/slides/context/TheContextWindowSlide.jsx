/* A recreation of Claude Code's `/context` readout, not a screenshot: one cell
   per 1k of a 200k window, coloured by what is occupying it. Drawn at k = 1
   (480 wide on a 480 viewBox), so 16 and 11 are literal rendered px. */

const WINDOW_K = 200
const COLS = 20
const PITCH = 24
const CELL = 19
const GRID_TOP = 34

const SEGMENTS = [
  { label: 'System prompt', k: 3, color: 'var(--violet-d)' },
  { label: 'System tools', k: 12, color: 'var(--violet)' },
  { label: 'Memory files', k: 5, color: 'var(--amber)' },
  { label: 'Messages', k: 42, color: 'var(--muted)' },
  { label: 'Free space', k: 138, color: 'var(--paper-2)' },
]

const USED_K = WINDOW_K - SEGMENTS[SEGMENTS.length - 1].k

/* Flatten the segments into one cell per 1k, filled row-major */
const CELLS = SEGMENTS.flatMap((seg) => Array.from({ length: seg.k }, () => seg.color))

function TheContextWindowSlide() {
  return (
    <div className="diag-2col">
      {/* Left: the readout */}
      <div className="diag-stack">
        <div className="diag-stack__title">claude-code — /context</div>
        <div style={{ padding: 16, background: '#fff' }}>
          <svg className="diag-svg" width="480" height="400" viewBox="0 0 480 400">
            <text x="0" y="16" style={{ fontFamily: 'var(--mono)', fontSize: 16, fill: 'var(--graphite)' }}>
              {`${USED_K}k/${WINDOW_K}k tokens (${Math.round((USED_K / WINDOW_K) * 100)}%)`}
            </text>

            {CELLS.map((color, i) => (
              <rect
                key={i}
                x={(i % COLS) * PITCH}
                y={GRID_TOP + Math.floor(i / COLS) * PITCH}
                width={CELL}
                height={CELL}
                rx="3"
                fill={color}
              />
            ))}

            {SEGMENTS.map((seg, i) => {
              const y = 300 + i * 19
              return (
                <g key={seg.label}>
                  <rect x="0" y={y - 11} width="12" height="12" rx="3" fill={seg.color} />
                  <text x="22" y={y} style={{ fontFamily: 'var(--mono)', fontSize: 16, fill: 'var(--graphite)' }}>{seg.label}</text>
                  <text x="480" y={y} textAnchor="end" style={{ fontFamily: 'var(--mono)', fontSize: 16, fill: 'var(--muted)' }}>
                    {`${seg.k}.0k  ${((seg.k / WINDOW_K) * 100).toFixed(1)}%`}
                  </text>
                </g>
              )
            })}

            <text x="0" y="396" style={{ fontFamily: 'var(--mono)', fontSize: 11, fill: 'var(--muted)' }}>
              one cell = 1k tokens · illustrative figures
            </text>
          </svg>
        </div>
      </div>

      {/* Right: bullets */}
      <div>
        <ul className="bullets">
          <li><span>A desk, not a filing cabinet — finite surface</span></li>
          <li><span>More context is not better</span></li>
          <li><span>Bloat costs you money and quality at the same time</span></li>
          <li><span className="mono">Run <span className="term">/context</span> — the bill is itemised</span></li>
        </ul>
        <p className="pull">Tools and memory files bill you every turn, whether or not they get used.</p>
      </div>
    </div>
  )
}

TheContextWindowSlide.meta = {
  title: 'The context window',
  section: 'context',
  sectionLabel: 'Context Engineering',
  notes: 'The readout is a recreation of Claude Code\'s /context, not a screenshot — run the real command live if the room has it installed, the numbers land harder when they are yours. Point at the tools band: that cost is paid on every single turn before you have typed anything. Bring your own numbers if you have them: same task at three context sizes, quality and cost for each. Q&A terms: lost-in-the-middle, instruction drift.',
}

export default TheContextWindowSlide
