/* Anything in, three steps, one store, nearest chunks out. k = 1 (1080 wide on
   a 1080 viewBox): 16 primary, 11 secondary, 1.5 stroke. */

const LINE = '#c6c3ba'
const VIOLET = '#6b5bf5'
const INK = '#1b1e26'

const LABEL = { fontFamily: 'var(--mono)', fontSize: 16, fill: INK }
const NOTE = { fontFamily: 'var(--mono)', fontSize: 11, fill: 'var(--muted)' }

/* 24x24 glyphs, drawn from a top-left origin */
function BubbleIcon({ x, y }) {
  return (
    <g fill="none" stroke={INK} strokeWidth="1.5">
      <rect x={x + 1} y={y + 4} width="22" height="14" rx="4" />
      <polygon points={`${x + 7},${y + 17} ${x + 7},${y + 23} ${x + 14},${y + 17}`} fill={INK} stroke="none" />
    </g>
  )
}

function DocIcon({ x, y }) {
  return (
    <g fill="none" stroke={INK} strokeWidth="1.5">
      <path d={`M${x + 4} ${y + 3} H${x + 15} L${x + 20} ${y + 8} V${y + 21} H${x + 4} Z`} />
      <path d={`M${x + 15} ${y + 3} V${y + 8} H${x + 20}`} />
      <line x1={x + 8} y1={y + 13} x2={x + 16} y2={y + 13} stroke={LINE} />
      <line x1={x + 8} y1={y + 17} x2={x + 16} y2={y + 17} stroke={LINE} />
    </g>
  )
}

function RobotIcon({ x, y }) {
  return (
    <g fill="none" stroke={INK} strokeWidth="1.5">
      <line x1={x + 12} y1={y + 2} x2={x + 12} y2={y + 6} />
      <circle cx={x + 12} cy={y + 1} r="1.5" fill={INK} />
      <rect x={x + 2} y={y + 6} width="20" height="16" rx="5" />
      <circle cx={x + 8} cy={y + 14} r="2" fill={INK} stroke="none" />
      <circle cx={x + 16} cy={y + 14} r="2" fill={INK} stroke="none" />
    </g>
  )
}

const SOURCES = [
  { label: 'social', y: 0, Icon: BubbleIcon },
  { label: 'docs', y: 88, Icon: DocIcon },
  { label: 'agents', y: 176, Icon: RobotIcon },
]

function RagSlide() {
  return (
    <div className="diag-above">
      <div className="diag-figure">
        <svg className="diag-svg" width="1080" height="230" viewBox="0 0 1080 230">
          {/* Sources — the pipeline does not care which one it is */}
          {SOURCES.map(({ label, y, Icon }) => (
            <g key={label}>
              <rect x="0" y={y} width="150" height="54" rx="8" fill="#fff" stroke={LINE} strokeWidth="1.5" />
              <Icon x={16} y={y + 15} />
              <text x="54" y={y + 33} style={LABEL}>{label}</text>
              <line x1="150" y1={y + 27} x2="212" y2="115" stroke={LINE} strokeWidth="1.5" />
            </g>
          ))}
          <polygon points="210,110 220,115 210,120" fill={LINE} />

          {/* Chunk */}
          <rect x="220" y="75" width="140" height="80" rx="8" fill="#fff" stroke={LINE} strokeWidth="1.5" />
          <text x="290" y="110" textAnchor="middle" style={LABEL}>chunk</text>
          <text x="290" y="130" textAnchor="middle" style={NOTE}>split into pieces</text>
          <line x1="360" y1="115" x2="392" y2="115" stroke={VIOLET} strokeWidth="1.5" />
          <polygon points="388,110 398,115 388,120" fill={VIOLET} />

          {/* Embed */}
          <rect x="400" y="75" width="140" height="80" rx="8" fill="#fff" stroke={LINE} strokeWidth="1.5" />
          <text x="470" y="110" textAnchor="middle" style={LABEL}>embed</text>
          <text x="470" y="130" textAnchor="middle" style={NOTE}>[0.12 -0.44 …]</text>
          <line x1="540" y1="115" x2="572" y2="115" stroke={VIOLET} strokeWidth="1.5" />
          <polygon points="568,110 578,115 568,120" fill={VIOLET} />

          {/* Vector DB — a cylinder, because everyone already reads it as a store */}
          <path d="M580 70 V170 A85 14 0 0 0 750 170 V70 Z" fill="rgba(107,91,245,0.07)" stroke="none" />
          <path d="M580 70 V170 A85 14 0 0 0 750 170 V70" fill="none" stroke={VIOLET} strokeWidth="1.5" />
          <ellipse cx="665" cy="70" rx="85" ry="14" fill="rgba(107,91,245,0.07)" stroke={VIOLET} strokeWidth="1.5" />
          <text x="665" y="120" textAnchor="middle" style={{ ...LABEL, fill: '#4b3ddb' }}>vector db</text>
          <text x="665" y="140" textAnchor="middle" style={NOTE}>nearest first</text>

          {/* Query in, closest chunks out */}
          <rect x="820" y="30" width="200" height="54" rx="8" fill="#fff" stroke={LINE} strokeWidth="1.5" />
          <text x="836" y="63" style={LABEL}>your question</text>
          <line x1="818" y1="60" x2="762" y2="72" stroke={LINE} strokeWidth="1.5" />
          <polygon points="758,70 768,68 766,78" fill={LINE} />

          <rect x="820" y="146" width="200" height="54" rx="8" fill="rgba(107,91,245,0.07)" stroke={VIOLET} strokeWidth="1.5" />
          <text x="836" y="171" style={{ ...LABEL, fill: '#4b3ddb' }}>closest chunks</text>
          <text x="836" y="189" style={NOTE}>→ into the prompt</text>
          <line x1="756" y1="160" x2="812" y2="172" stroke={VIOLET} strokeWidth="1.5" />
          <polygon points="816,174 806,172 810,163" fill={VIOLET} />
        </svg>
      </div>

      <ul className="bullets">
        <li><span><span className="term">Chunk</span> — split the documents into pieces</span></li>
        <li><span><span className="term">Embed</span> — turn pieces into searchable meaning</span></li>
        <li><span><span className="term">Vector DB</span> — store them, fetch the closest ones</span></li>
      </ul>
      <p className="pull">YouTube does the same three steps to your video.</p>
    </div>
  )
}

RagSlide.meta = {
  title: 'RAG',
  section: 'context',
  sectionLabel: 'Context Engineering',
  notes: 'Point at the three sources first: posts, documents, other agents\' output — the pipeline is indifferent to which, which is why RAG shows up everywhere. Then the loop on the right: a question is embedded the same way, so retrieval is nearness in the same space. Resist internals; chunk strategies, embedding models and vector DB comparison are all article material. If pushed in Q&A: chunk boundaries are where most RAG quality is won or lost.',
}

export default RagSlide
