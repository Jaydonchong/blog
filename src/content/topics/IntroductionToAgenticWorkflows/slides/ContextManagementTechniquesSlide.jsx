function ContextManagementTechniquesSlide() {
  return (
    <>
      <ul className="bullets">
        <li><span><span className="term">Compaction</span> — it summarises to fit, and quietly drops things</span></li>
        <li>
          <span><span className="term">Progressive disclosure</span> — load an index, fetch pages on demand</span>
          <ul className="bullets__sub">
            <li><span className="term">Indexing</span> — a good filename is a retrieval strategy</li>
            <li><span className="term">Knowledge graph</span> — store relationships, not just similarity</li>
          </ul>
        </li>
        <li><span><span className="term">Subagents</span> — hand work to a fresh context</span></li>
      </ul>
      <p className="pull">Fetching on demand is a decision the model can get wrong.</p>
    </>
  )
}

ContextManagementTechniquesSlide.meta = {
  title: 'Context management techniques',
  section: 'context',
  sectionLabel: 'Context Engineering',
  notes: 'Tradeoff in full: gain is lower context usage; cost one is non-deterministic execution — you traded guaranteed-present for probably-fetched; cost two is over-normalisation, fragments too small to mean anything. Knowledge graph is the answer to over-normalisation: relationships are what fragments lose, so store them explicitly. RESEARCH GAP: fine-tuning vs context engineering — do not improvise numbers.',
}

export default ContextManagementTechniquesSlide
