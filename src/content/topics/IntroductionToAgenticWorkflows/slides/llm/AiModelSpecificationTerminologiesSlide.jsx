function AiModelSpecificationTerminologiesSlide() {
  return (
    <div>
      <ul className="bullets">
        <li><span><span className="term">Weights</span> — frozen at training; chatting teaches it nothing</span></li>
        <li><span><span className="term">Inference</span> — one pass through those weights, and your bill</span></li>
        <li><span><span className="term">Quantization</span> — smaller numbers, smaller hardware, slightly worse</span></li>
      </ul>
    </div>
  )
}

AiModelSpecificationTerminologiesSlide.meta = {
  title: 'AI Model specification terminologies',
  section: 'llm',
  sectionLabel: 'What is an LLM',
  notes: 'Kill the misconception directly: your conversation does not train the model. Quantization only matters if you self-host; give the decision rule, not the precision levels. PAUSE POINT — ask the room a question before moving on.',
}

export default AiModelSpecificationTerminologiesSlide
