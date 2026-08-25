/* The close: one person, one setup, three loops running inside it — the
   trigger glyphs from "Achieving autonomy" and the robot-and-loop from the
   same slide, composed into the thing they add up to. 1000 wide on a 1000
   viewBox, so k = 1: 16 primary, 11 secondary, 1.5 stroke. */

const LINE = '#c6c3ba'
const VIOLET = '#6b5bf5'
const INK = '#1b1e26'

const LABEL = { fontFamily: 'var(--mono)', fontSize: 16, fill: INK }
const NOTE = { fontFamily: 'var(--mono)', fontSize: 11, fill: 'var(--muted)' }

/* the same robot-and-loop as the autonomy slide. Its natural centre line sits
   at y = 57 inside the group, so it is placed by row centre. */
function AgentLoop({ x, y, label }) {
  return (
    <g transform={`translate(${x},${y - 57})`}>
      <line x1="22" y1="34" x2="22" y2="25" stroke={INK} strokeWidth="1.5" />
      <circle cx="22" cy="21" r="3" fill="#fff" stroke={INK} strokeWidth="1.5" />

      <rect x="0" y="34" width="44" height="36" rx="6" fill="#fff" stroke={INK} strokeWidth="1.5" />
      <circle cx="13" cy="49" r="3.5" fill={INK} />
      <circle cx="31" cy="49" r="3.5" fill={INK} />
      <line x1="13" y1="62" x2="31" y2="62" stroke={INK} strokeWidth="1.5" />

      <rect x="-8" y="76" width="60" height="18" rx="4" fill="#fff" stroke={INK} strokeWidth="1.5" />

      <path d="M86 42 A18 18 0 1 1 68 60" fill="none" stroke={VIOLET} strokeWidth="1.5" />
      <polygon points="64,58 68,50 72,58" fill={VIOLET} />

      <text x="44" y="106" textAnchor="middle" style={NOTE}>{label}</text>
    </g>
  )
}

function Arrow({ from, to, y }) {
  return (
    <g>
      <line x1={from} y1={y} x2={to - 10} y2={y} stroke={VIOLET} strokeWidth="1.5" />
      <polygon points={`${to},${y} ${to - 10},${y - 5} ${to - 10},${y + 5}`} fill={VIOLET} />
    </g>
  )
}

const ROWS = [100, 215, 330]

function PuttingItTogetherSlide() {
  return (
    <div className="diag-above">
      <div className="diag-figure">
        <svg className="diag-svg" width="1000" height="410" viewBox="0 0 1000 410">
          {/* you — the same figure that has been standing beside every loop */}
          <circle cx="44" cy="195" r="20" fill="#fff" stroke={INK} strokeWidth="1.5" />
          <path d="M8 245 a36 36 0 0 1 72 0" fill="none" stroke={INK} strokeWidth="1.5" />
          <text x="44" y="272" textAnchor="middle" style={LABEL}>you</text>

          <Arrow from={92} to={158} y={215} />
          <text x="125" y="205" textAnchor="middle" style={NOTE}>set up once</text>

          {/* everything inside this box runs whether you are there or not */}
          <rect x="164" y="16" width="826" height="380" rx="12" fill="rgba(107,91,245,0.04)" stroke={VIOLET} strokeWidth="1.5" strokeDasharray="5,4" />
          <text x="182" y="38" style={{ ...NOTE, fill: '#4b3ddb' }}>RUNS WITHOUT YOU</text>

          {/* 1 — a clock starts it, an email is what you see */}
          <rect x="243" y={ROWS[0] - 44} width="14" height="9" rx="2" fill="#fff" stroke={INK} strokeWidth="1.5" />
          <circle cx="250" cy={ROWS[0]} r="27" fill="#fff" stroke={INK} strokeWidth="1.5" />
          <line x1="250" y1={ROWS[0]} x2="250" y2={ROWS[0] - 18} stroke={INK} strokeWidth="1.5" />
          <line x1="250" y1={ROWS[0]} x2="264" y2={ROWS[0] + 8} stroke={VIOLET} strokeWidth="1.5" />
          <text x="250" y={ROWS[0] + 49} textAnchor="middle" style={NOTE}>every morning</text>

          <Arrow from={288} to={366} y={ROWS[0]} />
          <AgentLoop x={380} y={ROWS[0]} label="agent loop" />

          <Arrow from={500} to={574} y={ROWS[0]} />
          <rect x="586" y={ROWS[0] - 24} width="120" height="48" rx="6" fill="#fff" stroke={LINE} strokeWidth="1.5" />
          <path d={`M586 ${ROWS[0] - 22} L646 ${ROWS[0] + 4} L706 ${ROWS[0] - 22}`} fill="none" stroke={LINE} strokeWidth="1.5" />
          <text x="646" y={ROWS[0] + 20} textAnchor="middle" style={LABEL}>email</text>
          <text x="646" y={ROWS[0] + 49} textAnchor="middle" style={NOTE}>in your inbox by 7am</text>

          {/* 2 — the loop that keeps the docs honest */}
          <AgentLoop x={380} y={ROWS[1]} label="agent loop" />
          <text x="250" y={ROWS[1] + 5} textAnchor="middle" style={NOTE}>on every merge</text>
          <rect x="524" y={ROWS[1] - 22} width="182" height="44" rx="6" fill="rgba(107,91,245,0.06)" stroke={VIOLET} strokeWidth="1.5" />
          <text x="615" y={ROWS[1] + 5} textAnchor="middle" style={{ ...LABEL, fill: '#4b3ddb' }}>Documentation</text>

          {/* 3 — you, from your phone, into a loop */}
          <path
            d={`M222 ${ROWS[2] - 16} L286 ${ROWS[2]} L222 ${ROWS[2] + 16} L232 ${ROWS[2]} Z`}
            fill="#fff" stroke={INK} strokeWidth="1.5" strokeLinejoin="round"
          />
          <line x1="232" y1={ROWS[2]} x2="286" y2={ROWS[2]} stroke={LINE} strokeWidth="1.5" />
          <text x="250" y={ROWS[2] + 49} textAnchor="middle" style={NOTE}>Telegram</text>

          <Arrow from={300} to={366} y={ROWS[2]} />
          <AgentLoop x={380} y={ROWS[2]} label="agent loop" />
          <text x="524" y={ROWS[2] + 5} style={NOTE}>ask it anything, from anywhere</text>
        </svg>
      </div>
    </div>
  )
}

PuttingItTogetherSlide.meta = {
  title: 'Putting it together',
  section: 'close',
  sectionLabel: 'Close',
  notes: 'This is the last slide, so land the close on the picture: same person, same model, three loops that now run without being asked — a timer that mails you a digest, a merge hook that keeps the documentation true, and a Telegram thread that is a loop you can talk to from a queue. Nothing here is a new capability; every piece is a layer from earlier in the deck wired to a trigger. Then give the one action each — non-technical, write a memory file for your most-repeated task; technical, add a verification step to one loop you already run. Only works if the example is genuinely yours and you can speak to it without reading.',
}

export default PuttingItTogetherSlide
