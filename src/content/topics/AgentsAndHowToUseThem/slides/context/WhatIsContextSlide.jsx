function WhatIsContextSlide() {
  return (
    <div className="diag-figure">
      <div className="diag-gallery diag-gallery--2">
        <div className="diag-card">
          <div className="diag-card__head">Memory</div>
          <div className="diag-card__body">What is known so far outside of this conversation</div>
        </div>
        <div className="diag-card">
          <div className="diag-card__head">History</div>
          <div className="diag-card__body">What is known so far from this conversation</div>
        </div>
        <div className="diag-card">
          <div className="diag-card__head">Access</div>
          <div className="diag-card__body">What tools are available</div>
        </div>
        <div className="diag-card">
          <div className="diag-card__head">Instructions</div>
          <div className="diag-card__body">How do we go about it</div>
        </div>
      </div>
    </div>
  )
}

WhatIsContextSlide.meta = {
  title: 'Context in prompt',
  subtitle: 'Everything known outside of the goal is a context',
  section: 'context',
  sectionLabel: 'Context Engineering',
  notes: 'The four buckets map to the four slides after this one: memory is the persistence layer, history is the context window, access is the tools section, instructions are the prompt and system prompt.',
}

export default WhatIsContextSlide
