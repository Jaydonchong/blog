/* One plug shape, three servers, and the bill each one runs up before the
   first prompt. k = 1 (900 wide on a 900 viewBox): 16 primary, 11 secondary. */

const LINE = '#c6c3ba'
const VIOLET = '#6b5bf5'

/* External servers get a dashed border — that edge is the data boundary */
const SERVERS = [
  { name: 'github mcp', where: 'external', tools: 14, y: 8, external: true },
  { name: 'postgres mcp', where: 'internal', tools: 8, y: 86, external: false },
  { name: 'slack mcp', where: 'external', tools: 22, y: 164, external: true },
]

const TOTAL_TOOLS = SERVERS.reduce((sum, s) => sum + s.tools, 0)

function McpModelContextProtocolSlide() {
  return (
    <div className="diag-above">
      <div className="diag-figure">
        <svg className="diag-svg" width="900" height="240" viewBox="0 0 900 240">
          {/* Agent */}
          <rect x="0" y="79" width="140" height="60" rx="8" fill="rgba(107,91,245,0.07)" stroke={VIOLET} strokeWidth="1.5" />
          <text x="70" y="114" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 16, fill: '#4b3ddb' }}>agent</text>
          <line x1="140" y1="109" x2="182" y2="109" stroke={VIOLET} strokeWidth="1.5" />

          {/* The plug — a shape, not a technology */}
          <rect x="184" y="69" width="106" height="80" rx="8" fill="rgba(107,91,245,0.07)" stroke={VIOLET} strokeWidth="1.5" />
          <text x="237" y="105" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 16, fill: '#4b3ddb' }}>MCP</text>
          <text x="237" y="124" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 11, fill: 'var(--muted)' }}>one plug shape</text>

          {SERVERS.map((s) => {
            const mid = s.y + 27
            return (
              <g key={s.name}>
                <line x1="290" y1="109" x2={352} y2={mid} stroke={LINE} strokeWidth="1.5" />
                <rect
                  x="360" y={s.y} width="200" height="54" rx="8"
                  fill="#fff" stroke={s.external ? LINE : VIOLET} strokeWidth="1.5"
                  strokeDasharray={s.external ? '4,3' : undefined}
                />
                <text x="376" y={s.y + 24} style={{ fontFamily: 'var(--mono)', fontSize: 16, fill: '#1b1e26' }}>{s.name}</text>
                <text x="376" y={s.y + 42} style={{ fontFamily: 'var(--mono)', fontSize: 11, fill: 'var(--muted)' }}>
                  {`${s.where} · ${s.tools} tools`}
                </text>

                {/* What that server costs you in context, every single turn */}
                <rect x="600" y={mid - 6} width="240" height="12" rx="3" fill="var(--paper-2)" />
                <rect x="600" y={mid - 6} width={s.tools * 8} height="12" rx="3" fill={VIOLET} />
              </g>
            )
          })}

          <text x="600" y="228" style={{ fontFamily: 'var(--mono)', fontSize: 16, fill: '#1b1e26' }}>
            {`${TOTAL_TOOLS} tool definitions`}
          </text>
          <text x="600" y="10" style={{ fontFamily: 'var(--mono)', fontSize: 11, fill: 'var(--muted)' }}>context spent before you type</text>
        </svg>
      </div>

      <ul className="bullets">
        <li><span>A standard plug shape, not new technology</span></li>
        <li><span><span className="term">External vs internal</span> — whose server, whose data boundary</span></li>
        <li><span>Every connected tool spends context before you type a word</span></li>
      </ul>
      <p className="pull">Connecting everything makes the model worse.</p>
    </div>
  )
}

McpModelContextProtocolSlide.meta = {
  title: 'MCP: Model Context Protocol',
  section: 'tools',
  sectionLabel: 'Tool, MCP',
  notes: 'Dashed border means external — that line is the data boundary, and it is the whole external-vs-internal bullet. The bars are tool count, standing in for tokens. Measure your own install and put the number on the slide — "my setup spends N tokens on tool definitions at startup" beats the general claim.',
}

export default McpModelContextProtocolSlide
