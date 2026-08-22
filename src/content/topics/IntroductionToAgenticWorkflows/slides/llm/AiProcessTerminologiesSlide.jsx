function AiProcessTerminologiesSlide() {
  return (
    <ul className="bullets">
      <li><span><span className="term">Sampling</span> — it rolls a weighted die, not a lookup</span></li>
      <li><span><span className="term">Tokens</span> — the unit of cost and the unit of space</span></li>
    </ul>
  )
}

AiProcessTerminologiesSlide.meta = {
  title: 'AI process terminologies',
  section: 'llm',
  sectionLabel: 'What is an LLM',
  notes: 'Show one badly-split tokenised sentence if you want a visual. Pricing for Q&A: input and output bill at different rates, output is dearer. Tokens are the through-line to token bloat and to connection cost in the tools section.',
}

export default AiProcessTerminologiesSlide
