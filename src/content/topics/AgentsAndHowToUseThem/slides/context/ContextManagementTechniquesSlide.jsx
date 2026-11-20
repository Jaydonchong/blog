/* Three techniques, three figures. Each SVG is 300x150 drawn on a 300x150
   viewBox, so k = 1: 14 is a node label, 11 a secondary label, 1.5 a stroke. */

const LINE = '#c6c3ba'
const VIOLET = '#6b5bf5'

function ContextManagementTechniquesSlide() {
  return (
    <div className="diag-above">
      <div className="diag-gallery diag-gallery--3">
        {/* Compaction — many turns in, one summary out, some of it gone */}
        <div className="diag-card diag-card--tight">
          <div className="diag-card__head">Compaction</div>
          <svg className="diag-svg" width="300" height="150" viewBox="0 0 300 150">
            {[14, 32, 50, 68, 86].map((y) => (
              <rect key={y} x="10" y={y} width="90" height="14" rx="3" fill="var(--paper-2)" />
            ))}
            <line x1="110" y1="57" x2="148" y2="57" stroke={VIOLET} strokeWidth="1.5" />
            <polygon points="144,52 154,57 144,62" fill={VIOLET} />
            <rect x="160" y="37" width="110" height="40" rx="6" fill="rgba(107,91,245,0.07)" stroke={VIOLET} strokeWidth="1.5" />
            <text x="215" y="62" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 14, fill: '#4b3ddb' }}>summary</text>

            <rect x="10" y="110" width="90" height="12" rx="3" fill="none" stroke={LINE} strokeWidth="1.5" strokeDasharray="3,3" />
            <rect x="10" y="128" width="90" height="12" rx="3" fill="none" stroke={LINE} strokeWidth="1.5" strokeDasharray="3,3" />
            <text x="112" y="129" style={{ fontFamily: 'var(--mono)', fontSize: 11, fill: 'var(--muted)' }}>dropped</text>
          </svg>
          <p className="diag-card__cap">It summarises to fit — and quietly drops things.</p>
        </div>

        {/* Progressive disclosure — index resident, pages fetched */}
        <div className="diag-card diag-card--tight">
          <div className="diag-card__head">Progressive disclosure</div>
          <svg className="diag-svg" width="300" height="150" viewBox="0 0 300 150">
            <rect x="8" y="14" width="118" height="112" rx="6" fill="#fff" stroke={LINE} strokeWidth="1.5" />
            <text x="18" y="32" style={{ fontFamily: 'var(--mono)', fontSize: 11, fill: 'var(--muted)' }}>INDEX</text>
            <rect x="12" y="76" width="110" height="20" fill="rgba(107,91,245,0.1)" />
            <text x="20" y="58" style={{ fontFamily: 'var(--mono)', fontSize: 14, fill: '#1b1e26' }}>auth.md</text>
            <text x="20" y="91" style={{ fontFamily: 'var(--mono)', fontSize: 14, fill: '#4b3ddb' }}>billing.md</text>
            <text x="20" y="118" style={{ fontFamily: 'var(--mono)', fontSize: 14, fill: '#1b1e26' }}>deploy.md</text>

            <line x1="126" y1="70" x2="164" y2="70" stroke={VIOLET} strokeWidth="1.5" />
            <polygon points="160,65 170,70 160,75" fill={VIOLET} />
            <text x="148" y="62" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 11, fill: 'var(--muted)' }}>fetch</text>

            <rect x="176" y="30" width="112" height="80" rx="6" fill="#fff" stroke={VIOLET} strokeWidth="1.5" />
            <text x="186" y="48" style={{ fontFamily: 'var(--mono)', fontSize: 11, fill: '#4b3ddb' }}>billing.md</text>
            {[60, 74, 88].map((y) => (
              <rect key={y} x="186" y={y} width="92" height="8" rx="2" fill="var(--paper-2)" />
            ))}
          </svg>
          <p className="diag-card__cap">
            <span className="term">Indexing</span> — a good filename is a retrieval strategy.{' '}
            <span className="term">Knowledge graph</span> — store relationships, not just similarity.
          </p>
        </div>

        {/* Subagents — fresh context out, answer back */}
        <div className="diag-card diag-card--tight">
          <div className="diag-card__head">Subagents</div>
          <svg className="diag-svg" width="300" height="150" viewBox="0 0 300 150">
            <rect x="100" y="8" width="100" height="34" rx="6" fill="rgba(107,91,245,0.07)" stroke={VIOLET} strokeWidth="1.5" />
            <text x="150" y="30" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 14, fill: '#4b3ddb' }}>main</text>

            {/* out — violet; back — dashed grey, offset so they never sit on top */}
            <line x1="138" y1="42" x2="66" y2="76" stroke={VIOLET} strokeWidth="1.5" />
            <polygon points="62,72 60,81 70,79" fill={VIOLET} />
            <line x1="162" y1="42" x2="234" y2="76" stroke={VIOLET} strokeWidth="1.5" />
            <polygon points="238,72 240,81 230,79" fill={VIOLET} />
            <line x1="86" y1="76" x2="152" y2="46" stroke={LINE} strokeWidth="1.5" strokeDasharray="3,3" />
            <polygon points="156,44 146,44 150,53" fill={LINE} />
            <line x1="214" y1="76" x2="148" y2="46" stroke={LINE} strokeWidth="1.5" strokeDasharray="3,3" />
            <polygon points="144,44 154,44 150,53" fill={LINE} />

            <rect x="10" y="80" width="90" height="34" rx="6" fill="#fff" stroke={LINE} strokeWidth="1.5" />
            <text x="55" y="102" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 14, fill: '#1b1e26' }}>sub 1</text>
            <rect x="200" y="80" width="90" height="34" rx="6" fill="#fff" stroke={LINE} strokeWidth="1.5" />
            <text x="245" y="102" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 14, fill: '#1b1e26' }}>sub 2</text>

            {/* each starts with a near-empty window of its own */}
            <rect x="10" y="122" width="90" height="8" rx="2" fill="var(--paper-2)" />
            <rect x="10" y="122" width="22" height="8" rx="2" fill={VIOLET} />
            <rect x="200" y="122" width="90" height="8" rx="2" fill="var(--paper-2)" />
            <rect x="200" y="122" width="18" height="8" rx="2" fill={VIOLET} />
            <text x="150" y="130" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 11, fill: 'var(--muted)' }}>fresh context</text>
          </svg>
          <p className="diag-card__cap">Hand work to a fresh context. Only the answer comes back.</p>
        </div>
      </div>

      <p className="pull">Fetching on demand is a decision the model can get wrong.</p>
    </div>
  )
}

ContextManagementTechniquesSlide.meta = {
  title: 'Context management techniques',
  section: 'context',
  sectionLabel: 'Context Engineering',
  notes: 'Tradeoff in full: gain is lower context usage; cost one is non-deterministic execution — you traded guaranteed-present for probably-fetched; cost two is over-normalisation, fragments too small to mean anything. Knowledge graph is the answer to over-normalisation: relationships are what fragments lose, so store them explicitly. RESEARCH GAP: fine-tuning vs context engineering — do not improvise numbers.',
}

export default ContextManagementTechniquesSlide
