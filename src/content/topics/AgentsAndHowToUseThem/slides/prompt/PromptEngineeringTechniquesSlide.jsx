function PromptEngineeringTechniquesSlide() {
  return (
    <div>
      <ul className="bullets">
        <li><span><span className="term">Chain of thought</span> — reasoning before the answer</span></li>
        <li><span><span className="term">ReAct</span> — reasoning and acting, interleaved</span></li>
        <li><span><span className="term">Few-shot</span> — examples that teach the pattern, not the exception</span></li>
      </ul>
    </div>
  )
}

PromptEngineeringTechniquesSlide.meta = {
  title: 'Prompt Engineering: Techniques',
  section: 'prompt',
  sectionLabel: 'Prompt Engineering',
  notes: 'Chain of thought buys computation before commitment, costs tokens, and does not help on simple tasks. Naming settled: chain of thought, not "chain of action" — it is what people search for. PAUSE POINT.',
}

export default PromptEngineeringTechniquesSlide
