function MemoryLayerPersistenceSlide() {
  return (
    <ul className="bullets">
      <li><span className="mono"><span className="term">MEMORY.md</span> — a file it reads at the start of every session</span></li>
      <li><span>Three kinds: episodic (happened) · semantic (true) · procedural (how)</span></li>
      <li><span>Curation is the skill — a file that only grows becomes bloat</span></li>
    </ul>
  )
}

MemoryLayerPersistenceSlide.meta = {
  title: 'Memory layer (persistence)',
  section: 'context',
  sectionLabel: 'Context Engineering',
  notes: 'The file is a feedback loop: corrections given once become permanent. Different staleness rules — episodic ages fastest, procedural changes when the team does, semantic when the system does.',
}

export default MemoryLayerPersistenceSlide
