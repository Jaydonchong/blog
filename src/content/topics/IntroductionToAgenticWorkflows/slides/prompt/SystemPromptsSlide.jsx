function SystemPromptsSlide() {
  return (
    <div className="diag-above">
      {/* SVG: Human → ChatGPT → LLM with System Prompt stack pointing at midpoint of ChatGPT→LLM arrow */}
      <div className="diag-figure">
        <svg className="diag-svg" width="720" height="298" viewBox="0 0 520 215">
          {/* System Prompt stack — centered at x=254, bottom at y=146 */}
          <rect x="172" y="2" width="164" height="144" rx="6" fill="rgba(107,91,245,0.06)" stroke="#6b5bf5" strokeWidth="1.1"/>
          {/* Title bar */}
          <rect x="173" y="3" width="162" height="23" rx="5" fill="rgba(107,91,245,0.14)"/>
          <text x="254" y="18" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 8, fill: '#4b3ddb', letterSpacing: '0.1em', textTransform: 'uppercase' }}>System Prompt</text>
          {/* Slot dividers + labels — five slots of 24, tops at 26/50/74/98/122,
              every baseline at slot centre + 4 */}
          <line x1="173" y1="26" x2="335" y2="26" stroke="#dbd7f0" strokeWidth="0.7"/>
          <text x="184" y="42" style={{ fontFamily: 'var(--mono)', fontSize: 11.5, fill: '#1b1e26' }}>Tool</text>
          <line x1="173" y1="50" x2="335" y2="50" stroke="#dbd7f0" strokeWidth="0.7"/>
          <text x="184" y="66" style={{ fontFamily: 'var(--mono)', fontSize: 11.5, fill: '#1b1e26' }}>History</text>
          <line x1="173" y1="74" x2="335" y2="74" stroke="#dbd7f0" strokeWidth="0.7"/>
          <text x="184" y="90" style={{ fontFamily: 'var(--mono)', fontSize: 11.5, fill: '#1b1e26' }}>Provider Prompt</text>
          <line x1="173" y1="98" x2="335" y2="98" stroke="#dbd7f0" strokeWidth="0.7"/>
          <text x="184" y="114" style={{ fontFamily: 'var(--mono)', fontSize: 11.5, fill: '#1b1e26' }}>Provider Guardrail</text>
          <line x1="173" y1="122" x2="335" y2="122" stroke="#dbd7f0" strokeWidth="0.7"/>
          <text x="184" y="138" style={{ fontFamily: 'var(--mono)', fontSize: 11.5, fill: '#1b1e26' }}>Your Prompt</text>

          {/* Connector from stack bottom (254, 146) to arrow midpoint (254, 174) */}
          <line x1="254" y1="146" x2="254" y2="172" stroke="#6b5bf5" strokeWidth="1.1"/>
          <polygon points="251,170 254,176 257,170" fill="#6b5bf5"/>

          {/* Main flow row — center y=183 */}
          {/* Human */}
          <rect x="2" y="163" width="76" height="40" rx="6" fill="#fff" stroke="#c6c3ba" strokeWidth="1.1"/>
          <text x="40" y="188" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 11.5, fill: '#1b1e26' }}>Human</text>
          {/* Arrow Human → ChatGPT */}
          <line x1="78" y1="183" x2="110" y2="183" stroke="#6b5bf5" strokeWidth="1.1"/>
          <polygon points="106,179 112,183 106,187" fill="#6b5bf5"/>
          {/* ChatGPT thin box */}
          <rect x="112" y="155" width="22" height="56" rx="4" fill="#fff" stroke="#c6c3ba" strokeWidth="1.1"/>
          <text x="123" y="183" textAnchor="middle" transform="rotate(-90, 123, 183)" style={{ fontFamily: 'var(--mono)', fontSize: 9.4, fill: '#1b1e26' }}>ChatGPT</text>
          {/* Arrow ChatGPT → LLM — midpoint x = (134+370)/2 = 252 ≈ stack center 254 */}
          <line x1="134" y1="183" x2="368" y2="183" stroke="#6b5bf5" strokeWidth="1.1"/>
          <polygon points="364,179 370,183 364,187" fill="#6b5bf5"/>
          {/* LLM box */}
          <rect x="370" y="163" width="140" height="40" rx="6" fill="#fff" stroke="#c6c3ba" strokeWidth="1.1"/>
          <text x="440" y="188" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 11.5, fill: '#1b1e26' }}>LLM</text>
        </svg>
      </div>

      <ul className="bullets">
        <li><span>A standing instruction applied to every message</span></li>
        <li><span className="mono">In practice, a file in your project: CLAUDE.md, AGENTS.md</span></li>
        <li><span>Rules you write — not state the model accumulates</span></li>
      </ul>
    </div>
  )
}

SystemPromptsSlide.meta = {
  title: 'System prompts',
  section: 'prompt',
  sectionLabel: 'Prompt Engineering',
  notes: 'Naming discipline: three filenames across this slide and the memory slide. Always lead with the concept — "instruction file" here, "memory file" there. Settled: the full comparison table lives in article Part 2 and appendix A7, not in the presented deck. OpenAI vs Claude: both expose a separate system role; differences are adherence and length tolerance, not mechanism.',
}

export default SystemPromptsSlide
