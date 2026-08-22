function RagSlide() {
  return (
    <div>
      <ul className="bullets">
        <li><span><span className="term">Chunk</span> — split the documents into pieces</span></li>
        <li><span><span className="term">Embed</span> — turn pieces into searchable meaning</span></li>
        <li><span><span className="term">Vector DB</span> — store them, fetch the closest ones</span></li>
      </ul>
      <p className="pull">YouTube does the same three steps to your video.</p>
    </div>
  )
}

RagSlide.meta = {
  title: 'RAG',
  section: 'context',
  sectionLabel: 'Context Engineering',
  notes: 'Resist internals; chunk strategies, embedding models and vector DB comparison are all article material. If pushed in Q&A: chunk boundaries are where most RAG quality is won or lost.',
}

export default RagSlide
