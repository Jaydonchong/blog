function WhatIsAPromptSlide() {
  return (
    <div>
      <ul className="bullets">
        <li><span>The chat box is a thin skin over an API call</span></li>
        <li><span><span className="term">Prompt engineering</span> — structuring the brief, not finding magic words</span></li>
        <li><span>Augment with structure and data to improve the prediction</span></li>
      </ul>
    </div>
  )
}

WhatIsAPromptSlide.meta = {
  title: 'What is a prompt',
  section: 'prompt',
  sectionLabel: 'Prompt Engineering',
  notes: "What the interface silently adds: system prompt, full conversation history, tool definitions. That invisible payload is why the same question behaves differently in two apps.",
}

export default WhatIsAPromptSlide
