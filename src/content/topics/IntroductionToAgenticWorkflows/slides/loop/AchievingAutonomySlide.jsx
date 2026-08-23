/* Four ways a loop gets started, four figures. Each SVG is 500x112 on a
   500x112 viewBox, so k = 1: 14 primary, 11 secondary, 1.5 stroke. Height is
   capped at 112 because a 2x2 gallery row only clears ~190px of card.
   Every card ends in the same robot-plus-loop glyph — only the trigger
   on the left changes. */

const LINE = '#c6c3ba'
const VIOLET = '#6b5bf5'
const INK = '#1b1e26'

const LABEL = { fontFamily: 'var(--mono)', fontSize: 14, fill: INK }
const NOTE = { fontFamily: 'var(--mono)', fontSize: 11, fill: 'var(--muted)' }

/* the agent loop: a robot with its loop beside it. x is the robot's left edge */
function AgentLoop({ x, label }) {
  return (
    <g transform={`translate(${x},0)`}>
      {/* antenna */}
      <line x1="22" y1="34" x2="22" y2="25" stroke={INK} strokeWidth="1.5" />
      <circle cx="22" cy="21" r="3" fill="#fff" stroke={INK} strokeWidth="1.5" />

      {/* head */}
      <rect x="0" y="34" width="44" height="36" rx="6" fill="#fff" stroke={INK} strokeWidth="1.5" />
      <circle cx="13" cy="49" r="3.5" fill={INK} />
      <circle cx="31" cy="49" r="3.5" fill={INK} />
      <line x1="13" y1="62" x2="31" y2="62" stroke={INK} strokeWidth="1.5" />

      {/* body */}
      <rect x="-8" y="76" width="60" height="18" rx="4" fill="#fff" stroke={INK} strokeWidth="1.5" />

      {/* the loop, running beside it */}
      <path d="M86 42 A18 18 0 1 1 68 60" fill="none" stroke={VIOLET} strokeWidth="1.5" />
      <polygon points="64,58 68,50 72,58" fill={VIOLET} />

      <text x="44" y="106" textAnchor="middle" style={NOTE}>{label}</text>
    </g>
  )
}

/* trigger → loop, always the same run and the same height */
function Trigger({ from, note }) {
  return (
    <g>
      <line x1={from} y1="60" x2="274" y2="60" stroke={VIOLET} strokeWidth="1.5" />
      <polygon points="270,55 280,60 270,65" fill={VIOLET} />
      <text x={(from + 274) / 2} y="50" textAnchor="middle" style={NOTE}>{note}</text>
    </g>
  )
}

function AchievingAutonomySlide() {
  return (
    <div className="diag-above">
      <div className="diag-gallery diag-gallery--2">
        {/* Goal based — a person states the outcome */}
        <div className="diag-card diag-card--tight">
          <div className="diag-card__head">Goal based</div>
          <svg className="diag-svg" width="500" height="112" viewBox="0 0 500 112">
            <circle cx="34" cy="44" r="10" fill="#fff" stroke={INK} strokeWidth="1.5" />
            <path d="M16 70 a18 18 0 0 1 36 0" fill="none" stroke={INK} strokeWidth="1.5" />
            <text x="34" y="106" textAnchor="middle" style={NOTE}>human</text>

            <rect x="66" y="42" width="118" height="36" rx="6" fill="#fff" stroke={LINE} strokeWidth="1.5" />
            <text x="125" y="65" textAnchor="middle" style={LABEL}>prompt</text>

            <Trigger from={192} note="you ask" />
            <AgentLoop x={300} label="agent loop" />
          </svg>
          <p className="diag-card__cap">You state the outcome; the loop runs until it is met.</p>
        </div>

        {/* Timer based — a clock starts the run */}
        <div className="diag-card diag-card--tight">
          <div className="diag-card__head">Timer based</div>
          <svg className="diag-svg" width="500" height="112" viewBox="0 0 500 112">
            <rect x="79" y="22" width="14" height="9" rx="2" fill="#fff" stroke={INK} strokeWidth="1.5" />
            <circle cx="86" cy="60" r="27" fill="#fff" stroke={INK} strokeWidth="1.5" />
            <line x1="86" y1="60" x2="86" y2="42" stroke={INK} strokeWidth="1.5" />
            <line x1="86" y1="60" x2="100" y2="68" stroke={VIOLET} strokeWidth="1.5" />
            <text x="86" y="106" textAnchor="middle" style={NOTE}>every 30 min</text>

            <Trigger from={126} note="on a schedule" />
            <AgentLoop x={300} label="agent loop" />
          </svg>
          <p className="diag-card__cap">A clock starts the run — nobody has to be there.</p>
        </div>

        {/* Event driven — something outside fires */}
        <div className="diag-card diag-card--tight">
          <div className="diag-card__head">Event driven</div>
          <svg className="diag-svg" width="500" height="112" viewBox="0 0 500 112">
            <rect x="26" y="36" width="120" height="48" rx="6" fill="#fff" stroke={LINE} strokeWidth="1.5" />
            <path d="M26 38 L86 64 L146 38" fill="none" stroke={LINE} strokeWidth="1.5" />
            <text x="86" y="80" textAnchor="middle" style={LABEL}>API</text>
            <text x="86" y="106" textAnchor="middle" style={NOTE}>webhook fires</text>

            <Trigger from={158} note="on an event" />
            <AgentLoop x={300} label="agent loop" />
          </svg>
          <p className="diag-card__cap">Something outside — an API call, a webhook — kicks it off.</p>
        </div>

        {/* Agent based — a loop starts another loop */}
        <div className="diag-card diag-card--tight">
          <div className="diag-card__head">Agent based</div>
          <svg className="diag-svg" width="500" height="112" viewBox="0 0 500 112">
            <AgentLoop x={14} label="orchestrator" />

            <Trigger from={132} note="hands off work" />
            <AgentLoop x={300} label="sub-agent" />
          </svg>
          <p className="diag-card__cap">One loop starts another and waits on the result.</p>
        </div>
      </div>
    </div>
  )
}

AchievingAutonomySlide.meta = {
  title: 'Achieving autonomy',
  section: 'loop',
  sectionLabel: 'Loop Engineering',
  notes: 'The four triggers stack rather than compete: the same loop can be goal-, timer-, event-, and agent-started, and the trigger is the only thing that changes. Goal based is where everyone starts and the one that keeps a human in the critical path. Timer based is the first real step off it — a scheduled run needs a stopping condition and somewhere to write its result, or nobody sees what happened at 3am. Event driven is the same loop with an external trigger, and it inherits every input-validation problem the event source has. Agent based is the multi-agent handoff, and it is the one where an unbounded fan-out gets expensive fastest.',
}

export default AchievingAutonomySlide
