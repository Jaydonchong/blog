function ContextSlide() {
  return (
    <div>
      <ul className="bullets">
        <li><span>Context makes request meaningful</span></li>
        <li><span>Context makes output correct</span></li>
        <li><span>Context makes process efficient and effective</span></li>
      </ul>
    </div>
  )
}

ContextSlide.meta = {
  title: 'Context',
  section: 'context',
  sectionLabel: 'Context Engineering',
  notes: 'The three reasons map to the three slides after this one: meaningful is why the window matters, correct is what memory and retrieval buy you, efficient is what management techniques buy you. State the ladder here so the section has a spine.',
}

export default ContextSlide
