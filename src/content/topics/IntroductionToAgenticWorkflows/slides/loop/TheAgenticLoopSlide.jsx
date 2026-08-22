function TheAgenticLoopSlide() {
  return (
    <>
      <ul className="bullets">
        <li><span className="strong">Think → Act → Verify → repeat</span></li>
        <li><span>The loop is where the agency comes from</span></li>
        <li><span>Stop on: max turns · budget cap · human approval</span></li>
      </ul>
      <p className="pull">Autonomy is cheap; verification is the expensive part.</p>
    </>
  )
}

TheAgenticLoopSlide.meta = {
  title: 'The agentic loop',
  section: 'loop',
  sectionLabel: 'Loop Engineering',
  notes: 'Verify is load-bearing, not decorative. The third stopping condition — human approval before anything irreversible — is what lets you leave a loop running overnight.',
}

export default TheAgenticLoopSlide
