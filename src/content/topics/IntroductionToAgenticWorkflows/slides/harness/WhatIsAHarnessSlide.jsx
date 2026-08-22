function WhatIsAHarnessSlide() {
  return (
    <ul className="bullets">
      <li><span className="strong">Tools + memory + verification + hooks</span></li>
      <li><span>An agent is simply a model with a harness</span></li>
      <li><span>You already built half of it — sections 3 and 4</span></li>
    </ul>
  )
}

WhatIsAHarnessSlide.meta = {
  title: 'What is a harness',
  section: 'harness',
  sectionLabel: 'Harness Engineering',
  notes: 'Component map: Tools from the tools section, Memory from the context section, Verification and Hooks come next. Lifecycle in one line: read, run, write, compact. Failure mode: memory that is read but never written is just a config file.',
}

export default WhatIsAHarnessSlide
