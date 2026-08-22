function UsingLlmsSlide() {
  return (
    <div>
      <ul className="bullets">
        <li><span><span className="term">Stateless</span> — remembers nothing between messages</span></li>
        <li><span><span className="term">Non-deterministic</span> — same question, different answer</span></li>
        <li><span><span className="term">Blackbox, response-only</span> — can't explain itself, won't act first</span></li>
      </ul>
      <p className="pull">A brilliant contractor with total amnesia. You re-brief them every morning. They never admit they've forgotten.</p>
    </div>
  )
}

UsingLlmsSlide.meta = {
  title: 'Using LLMs',
  section: 'llm',
  sectionLabel: 'What is an LLM',
  notes: 'Consequences to draw on later: stateless means section 3 exists. Non-deterministic means you cannot test with one run. Response-only means the loop is not a nice-to-have, it is the source of agency. Hallucination if asked: a completion engine always completes, so it rarely abstains.',
}

export default UsingLlmsSlide
