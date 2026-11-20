function TitleSlide() {
  return (
    <div>
      <div className="asset">Screenshot: a confident, wrong answer</div>
      <p className="pull">Confident. Fluent. Wrong.</p>
    </div>
  )
}

TitleSlide.meta = {
  kind: 'title',
  title: 'Agents and how to use them',
  subtitle: 'From the chat box to the unattended loop',
  section: 'intro',
  sectionLabel: 'Introduction',
  notes: 'Pick a failure the non-technical half can independently judge as wrong. A fabricated citation works for everyone; a fake API method only lands for engineers.',
}

export default TitleSlide
