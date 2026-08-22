/* The message sequence, drawn at k = 1 (760 wide on a 760 viewBox): 16 is a
   lane or box label, 11 an arrow annotation, 1.5 a stroke. */

const LINE = '#c6c3ba'
const VIOLET = '#6b5bf5'

function ToolsProcessAsAFunctionSlide() {
  return (
    <div className="diag-above">
      <div className="diag-figure">
        <svg className="diag-svg" width="760" height="212" viewBox="0 0 760 212">
          {/* Lanes */}
          <rect x="20" y="0" width="180" height="34" rx="6" fill="rgba(107,91,245,0.07)" stroke={VIOLET} strokeWidth="1.5" />
          <text x="110" y="22" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 16, fill: '#4b3ddb' }}>MODEL</text>
          <rect x="560" y="0" width="180" height="34" rx="6" fill="#fff" stroke={LINE} strokeWidth="1.5" />
          <text x="650" y="22" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 16, fill: '#1b1e26' }}>YOUR CODE</text>
          <line x1="110" y1="34" x2="110" y2="204" stroke={LINE} strokeWidth="1.5" strokeDasharray="3,4" />
          <line x1="650" y1="34" x2="650" y2="204" stroke={LINE} strokeWidth="1.5" strokeDasharray="3,4" />

          {/* It asks — it does not run */}
          <text x="380" y="68" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 11, fill: 'var(--muted)' }}>tool_use — name + arguments</text>
          <line x1="110" y1="76" x2="642" y2="76" stroke={VIOLET} strokeWidth="1.5" />
          <polygon points="638,71 648,76 638,81" fill={VIOLET} />

          {/* You run it */}
          <rect x="590" y="94" width="120" height="32" rx="5" fill="#fff" stroke={LINE} strokeWidth="1.5" />
          <text x="650" y="115" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 16, fill: '#1b1e26' }}>execute</text>

          <text x="380" y="144" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 11, fill: 'var(--muted)' }}>tool_result — output or error</text>
          <line x1="650" y1="152" x2="118" y2="152" stroke={LINE} strokeWidth="1.5" />
          <polygon points="122,147 112,152 122,157" fill={LINE} />

          {/* Back to the model, which now has an observation it did not have */}
          <rect x="20" y="170" width="180" height="34" rx="6" fill="rgba(107,91,245,0.07)" stroke={VIOLET} strokeWidth="1.5" />
          <text x="110" y="192" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 16, fill: '#4b3ddb' }}>continue</text>
        </svg>
      </div>

      <ul className="bullets">
        <li><span>A tool is a function you describe to the model</span></li>
        <li><span className="strong">It doesn't run it — it asks you to run it</span></li>
        <li><span>Give it a terminal and every CLI becomes a tool</span></li>
      </ul>
    </div>
  )
}

ToolsProcessAsAFunctionSlide.meta = {
  title: 'Tools Process as a function',
  section: 'tools',
  sectionLabel: 'Tool, MCP',
  notes: 'Message sequence for Q&A: model emits tool_use, your code executes, you return tool_result, model continues. Point at the execute box — it sits on your lane, not the model\'s, and that is the whole slide. Terminal-as-a-tool is enormous leverage and an obvious blast radius; mitigation is allowlisting.',
}

export default ToolsProcessAsAFunctionSlide
