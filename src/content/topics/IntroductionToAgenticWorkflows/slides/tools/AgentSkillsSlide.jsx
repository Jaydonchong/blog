/* What the harness reads at startup vs what it reads on match. k = 1 (1000
   wide on a 1000 viewBox): 16 is file text, 11 an annotation, 1.5 a stroke. */

const LINE = '#c6c3ba'
const VIOLET = '#6b5bf5'

const MONO = { fontFamily: 'var(--mono)', fontSize: 16, fill: '#1b1e26' }
const NOTE = { fontFamily: 'var(--mono)', fontSize: 11, fill: 'var(--muted)' }

function AgentSkillsSlide() {
  return (
    <div className="diag-above">
      <div className="diag-figure">
        <svg className="diag-svg" width="1000" height="268" viewBox="0 0 1000 268">
          {/* The skill file */}
          <rect x="0" y="0" width="470" height="268" rx="8" fill="#fff" stroke={LINE} strokeWidth="1.5" />
          <rect x="1" y="1" width="468" height="27" rx="7" fill="var(--paper-2)" />
          <text x="14" y="19" style={NOTE}>~/.claude/skills/pr-review/SKILL.md</text>

          {/* Only this pair is resident */}
          <rect x="8" y="84" width="454" height="48" fill="rgba(107,91,245,0.1)" />

          <text x="16" y="52" style={NOTE}>---</text>
          <text x="16" y="76" style={MONO}>name: pr-review</text>
          <text x="16" y="100" style={{ ...MONO, fill: '#4b3ddb' }}>description: Use when reviewing</text>
          <text x="16" y="124" style={{ ...MONO, fill: '#4b3ddb' }}>{'  a PR diff or a branch'}</text>
          <text x="16" y="148" style={MONO}>model-invocation: auto</text>
          <text x="248" y="148" style={NOTE}># who may trigger</text>
          <text x="16" y="172" style={MONO}>permission: read-only</text>
          <text x="248" y="172" style={NOTE}># what it may touch</text>
          <text x="16" y="196" style={MONO}>subagent: true</text>
          <text x="248" y="196" style={NOTE}># where it runs</text>
          <text x="16" y="220" style={NOTE}>---</text>
          <text x="16" y="248" style={{ ...MONO, fill: 'var(--muted)' }}># full instructions…</text>

          {/* Startup: the description is copied out */}
          <text x="514" y="100" textAnchor="middle" style={NOTE}>at startup</text>
          <line x1="472" y1="110" x2="552" y2="110" stroke={VIOLET} strokeWidth="1.5" />
          <polygon points="548,105 558,110 548,115" fill={VIOLET} />

          <rect x="560" y="30" width="440" height="124" rx="8" fill="#fff" stroke={VIOLET} strokeWidth="1.5" />
          <rect x="561" y="31" width="438" height="25" rx="7" fill="rgba(107,91,245,0.12)" />
          <text x="574" y="48" style={{ ...NOTE, fill: '#4b3ddb' }}>SYSTEM PROMPT</text>
          <text x="574" y="80" style={{ ...MONO, fill: '#4b3ddb' }}>pr-review — Use when</text>
          <text x="574" y="102" style={{ ...MONO, fill: '#4b3ddb' }}>reviewing a PR diff</text>
          <text x="574" y="132" style={{ ...MONO, fill: 'var(--muted)' }}>deploy — Use when…</text>

          {/* On match: the body follows */}
          <text x="512" y="224" textAnchor="middle" style={NOTE}>on match</text>
          <line x1="472" y1="234" x2="552" y2="234" stroke={LINE} strokeWidth="1.5" strokeDasharray="4,3" />
          <polygon points="548,229 558,234 548,239" fill={LINE} />

          <rect x="560" y="176" width="440" height="76" rx="8" fill="none" stroke={LINE} strokeWidth="1.5" strokeDasharray="4,3" />
          <text x="574" y="212" style={MONO}>body: the instructions</text>
          <text x="574" y="234" style={NOTE}>read only once the description matches</text>
        </svg>
      </div>

      <ul className="bullets">
        <li><span>Loaded only when relevant — the YAML frontmatter decides</span></li>
        <li><span>Project skills ship with the repo, user skills follow you</span></li>
        <li><span>Build by interview, by documentation, or by walkthrough</span></li>
      </ul>
    </div>
  )
}

AgentSkillsSlide.meta = {
  title: 'Agent Skills',
  subtitle: 'Tool call, but personalized',
  section: 'tools',
  sectionLabel: 'Tool, MCP',
  notes: 'Trace the violet arrow: the description — and only the description — is copied into the system prompt at startup, so it is the one line that is always costing you context and the one line that decides whether the skill is ever found. The body is free until it matches. The other three keys answer who may trigger it, what it may touch, and whether it runs in a subagent. Bad scoping failure mode: a user skill that assumes a repo layout, or a project skill full of personal preference. PAUSE POINT.',
}

export default AgentSkillsSlide
