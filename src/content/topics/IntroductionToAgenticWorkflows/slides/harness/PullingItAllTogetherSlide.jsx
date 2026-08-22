/* You -> a harness -> a model. Both columns are swappable, and the wiring
   between them is a choice. k = 1 (1100 wide on a 1100 viewBox): 16 primary,
   11 secondary, 1.5 stroke. */

const LINE = '#c6c3ba'
const VIOLET = '#6b5bf5'
const INK = '#1b1e26'

const LABEL = { fontFamily: 'var(--mono)', fontSize: 16, fill: INK }
const NOTE = { fontFamily: 'var(--mono)', fontSize: 11, fill: 'var(--muted)' }

const ROWS = [10, 84, 158, 232]
const MID = ROWS.map((y) => y + 26)

const HARNESSES = [
  ['Opencode', 'terminal'],
  ['Codex', 'CLI + cloud'],
  ['ChatGPT', 'chat app'],
  ['Claude Code', 'terminal'],
]

const MODELS = [
  ['Claude Sonnet', 'Anthropic'],
  ['Claude Opus', 'Anthropic'],
  ['GPT Terra', 'OpenAI'],
  ['DeepSeek V4', 'DeepSeek'],
]

/* [harness index, model index, is the accented pairing] */
const WIRES = [
  [0, 0, false],
  [0, 2, false],
  [0, 3, false],
  [1, 2, false],
  [2, 2, false],
  [3, 0, true],
  [3, 1, true],
]

function PullingItAllTogetherSlide() {
  return (
    <div className="diag-above">
      <div className="diag-figure">
        <svg className="diag-svg" width="1100" height="305" viewBox="0 0 1100 305">
          {/* You */}
          <circle cx="45" cy="118" r="13" fill="none" stroke={INK} strokeWidth="1.5" />
          <path d="M21 158 a24 24 0 0 1 48 0" fill="none" stroke={INK} strokeWidth="1.5" />
          <text x="45" y="180" textAnchor="middle" style={LABEL}>You</text>

          {/* You -> every harness: the one you open is a choice too */}
          {MID.map((y) => (
            <g key={y}>
              <line x1="92" y1="140" x2={242} y2={y} stroke={LINE} strokeWidth="1.5" />
              <polygon points={`250,${y} 240,${y - 5} 240,${y + 5}`} fill={LINE} />
            </g>
          ))}

          {/* Harness -> model */}
          {WIRES.map(([h, m, accent]) => (
            <g key={`${h}-${m}`}>
              <line x1="530" y1={MID[h]} x2={792} y2={MID[m]} stroke={accent ? VIOLET : LINE} strokeWidth="1.5" />
              <polygon
                points={`800,${MID[m]} 790,${MID[m] - 5} 790,${MID[m] + 5}`}
                fill={accent ? VIOLET : LINE}
              />
            </g>
          ))}

          {HARNESSES.map(([name, sub], i) => (
            <g key={name}>
              <rect x="250" y={ROWS[i]} width="280" height="52" rx="8" fill="#fff" stroke={VIOLET} strokeWidth="1.5" />
              <text x="390" y={ROWS[i] + 24} textAnchor="middle" style={{ ...LABEL, fill: '#4b3ddb' }}>{name}</text>
              <text x="390" y={ROWS[i] + 42} textAnchor="middle" style={NOTE}>{sub}</text>
            </g>
          ))}

          {MODELS.map(([name, sub], i) => (
            <g key={name}>
              <rect x="800" y={ROWS[i]} width="290" height="52" rx="8" fill="#fff" stroke={LINE} strokeWidth="1.5" />
              <text x="945" y={ROWS[i] + 24} textAnchor="middle" style={LABEL}>{name}</text>
              <text x="945" y={ROWS[i] + 42} textAnchor="middle" style={NOTE}>{sub}</text>
            </g>
          ))}

          <text x="390" y="300" textAnchor="middle" style={NOTE}>the harness — everything in this section</text>
          <text x="945" y="300" textAnchor="middle" style={NOTE}>the model — swap it and the harness stands</text>
        </svg>
      </div>

      <ul className="bullets">
        <li><span>One harness, many models — and the same model behind many harnesses</span></li>
        <li><span>The harness is the part you choose and the part you build</span></li>
        <li><span className="strong">Change the model and your layers survive; change the layers and everything does</span></li>
      </ul>
    </div>
  )
}

PullingItAllTogetherSlide.meta = {
  title: 'Pulling it all together',
  subtitle: 'The same layers, whichever tool you open',
  section: 'harness',
  sectionLabel: 'Harness Engineering',
  notes: 'Point at any harness box and name the five things inside it from the previous slide — they are all there, under different names and file formats. The violet pair is the one most of the room will recognise; the grey lines are the point, which is that the wiring is a config line rather than a property of the tool. Model names are illustrative — check them before presenting, this list ages in weeks.',
}

export default PullingItAllTogetherSlide
