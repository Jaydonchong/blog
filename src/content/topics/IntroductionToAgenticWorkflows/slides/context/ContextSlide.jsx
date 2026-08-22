function ContextSlide() {
  return (
    <div className="diag-above">
      <div className="diag-figure">
        <div className="diag-compare3" style={{ width: '100%' }}>
          <div className="diag-compare3__col">
            "Make a landing page for my bakery"
          </div>
          <div className="diag-compare3__col">
            "Make a landing page for my bakery that specializes in Shio pan and Sourdough"
          </div>
          <div className="diag-compare3__col">
            "Make a landing page for my bakery in PJ that specializes in Shio pan and Sourdough using Japanese techniques"
          </div>
        </div>
      </div>

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
