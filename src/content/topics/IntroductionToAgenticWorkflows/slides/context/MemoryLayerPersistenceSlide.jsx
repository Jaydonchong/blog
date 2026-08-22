function MemoryLayerPersistenceSlide() {
  return (
    <div className="diag-above">
      {/* Graphic — one fixed-width column so every tier shares an edge */}
      <div className="diag-figure">
        <div className="diag-column" style={{ width: 520 }}>
          {/* The three kinds sit above the file — they are what is in it */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, alignSelf: 'stretch' }}>
            <div className="dn">
              <span style={{ fontWeight: 700 }}>Episodic</span>
              <span className="dn__sub">happened</span>
            </div>
            <div className="dn">
              <span style={{ fontWeight: 700 }}>Semantic</span>
              <span className="dn__sub">true</span>
            </div>
            <div className="dn">
              <span style={{ fontWeight: 700 }}>Procedural</span>
              <span className="dn__sub">how</span>
            </div>
          </div>
          {/* 1fr | arrow | 1fr — the label rides in the right cell so it cannot
              shove the arrow off the column's centre line */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', alignSelf: 'stretch' }}>
            <span />
            <svg className="diag-svg" width="16" height="30" style={{ margin: 0 }}>
              <line x1="8" y1="0" x2="8" y2="23" stroke="#c6c3ba" strokeWidth="1.5"/>
              <polygon points="4,21 8,29 12,21" fill="#c6c3ba"/>
            </svg>
            <span className="dn__sub" style={{ paddingLeft: 8 }}>written down</span>
          </div>
          <div className="dn dn--violet" style={{ alignSelf: 'stretch' }}>MEMORY.md</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', alignSelf: 'stretch' }}>
            <span />
            <svg className="diag-svg" width="16" height="30" style={{ margin: 0 }}>
              <line x1="8" y1="0" x2="8" y2="23" stroke="#c6c3ba" strokeWidth="1.5"/>
              <polygon points="4,21 8,29 12,21" fill="#c6c3ba"/>
            </svg>
            <span className="dn__sub" style={{ paddingLeft: 8 }}>read on start</span>
          </div>
          <div className="dn" style={{ alignSelf: 'stretch' }}>Session</div>
        </div>
      </div>

      <ul className="bullets">
        <li><span className="mono"><span className="term">MEMORY.md</span> — a file it reads at the start of every session</span></li>
        <li><span>Three kinds: episodic (happened) · semantic (true) · procedural (how)</span></li>
        <li><span>Curation is the skill — a file that only grows becomes bloat</span></li>
      </ul>
    </div>
  )
}

MemoryLayerPersistenceSlide.meta = {
  title: 'Memory layer (persistence)',
  section: 'context',
  sectionLabel: 'Context Engineering',
  notes: 'The file is a feedback loop: corrections given once become permanent. Different staleness rules — episodic ages fastest, procedural changes when the team does, semantic when the system does.',
}

export default MemoryLayerPersistenceSlide
