/* The cycle that makes a loop cheaper each time it runs, and the curve that
   earns it autonomy. k = 1 (1000 wide on a 1000 viewBox): 16 primary, 11
   secondary, 1.5 stroke. */

const LINE = '#c6c3ba'
const VIOLET = '#6b5bf5'
const INK = '#1b1e26'

const LABEL = { fontFamily: 'var(--mono)', fontSize: 16, fill: INK }
const NOTE = { fontFamily: 'var(--mono)', fontSize: 11, fill: 'var(--muted)' }

const STAGES = [
  { name: 'run', sub: 'it does the work', x: 40, y: 16, accent: false },
  { name: 'observe', sub: 'what did you correct?', x: 300, y: 16, accent: false },
  { name: 'write it down', sub: 'memory · skill · hook', x: 300, y: 140, accent: true },
  { name: 'next run', sub: 'one less correction', x: 40, y: 140, accent: false },
]

const RUNS = [
  ['run 1', 300],
  ['run 2', 190],
  ['run 3', 90],
  ['run 4', 30],
]

function FeedbackLoopSlide() {
  return (
    <div className="diag-above">
      <div className="diag-figure">
        <svg className="diag-svg" width="1000" height="216" viewBox="0 0 1000 216">
          {STAGES.map(({ name, sub, x, y, accent }) => (
            <g key={name}>
              <rect
                x={x} y={y} width="200" height="60" rx="8"
                fill={accent ? 'rgba(107,91,245,0.07)' : '#fff'}
                stroke={accent ? VIOLET : LINE}
                strokeWidth="1.5"
              />
              <text x={x + 100} y={y + 28} textAnchor="middle" style={{ ...LABEL, fill: accent ? '#4b3ddb' : INK }}>{name}</text>
              <text x={x + 100} y={y + 46} textAnchor="middle" style={NOTE}>{sub}</text>
            </g>
          ))}

          {/* round the cycle */}
          <line x1="240" y1="46" x2="292" y2="46" stroke={VIOLET} strokeWidth="1.5" />
          <polygon points="300,46 290,41 290,51" fill={VIOLET} />
          <line x1="400" y1="76" x2="400" y2="132" stroke={VIOLET} strokeWidth="1.5" />
          <polygon points="400,140 395,130 405,130" fill={VIOLET} />
          <line x1="300" y1="170" x2="248" y2="170" stroke={VIOLET} strokeWidth="1.5" />
          <polygon points="240,170 250,165 250,175" fill={VIOLET} />
          <line x1="140" y1="140" x2="140" y2="84" stroke={VIOLET} strokeWidth="1.5" />
          <polygon points="140,76 135,86 145,86" fill={VIOLET} />

          {/* what the cycle buys you */}
          <text x="600" y="14" style={NOTE}>corrections you had to make</text>
          {RUNS.map(([run, bar], i) => {
            const y = 44 + i * 38
            return (
              <g key={run}>
                <text x="600" y={y + 5} style={LABEL}>{run}</text>
                <rect x="680" y={y - 7} width="300" height="14" rx="3" fill="var(--paper-2)" />
                <rect x="680" y={y - 7} width={bar} height="14" rx="3" fill={VIOLET} />
              </g>
            )
          })}
          <text x="600" y="206" style={NOTE}>credibility → authority → autonomy</text>
        </svg>
      </div>

      <ul className="bullets">
        <li><span>Every correction is either a one-off or a rule — decide which, out loud</span></li>
        <li><span>A rule you wrote down is a correction you never make twice</span></li>
        <li><span className="strong">Corrections per run is the number that earns autonomy</span></li>
      </ul>
    </div>
  )
}

FeedbackLoopSlide.meta = {
  title: 'Feedback loop',
  subtitle: 'The ability to self improve is key to trust',
  section: 'loop',
  sectionLabel: 'Loop Engineering',
  notes: 'The cycle is the previous slide made concrete: you do not get autonomy by trusting harder, you get it by watching the correction count fall. Write it down means one of three places — memory for a fact, a skill for a procedure, a hook for a guarantee. Failure mode: correcting the same thing verbally every run and calling it collaboration.',
}

export default FeedbackLoopSlide
