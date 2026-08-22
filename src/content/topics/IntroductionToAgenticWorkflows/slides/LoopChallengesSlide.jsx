function LoopChallengesSlide() {
  return (
    <ul className="bullets">
      <li><span>Unattended means distributed: parallelism · retries · timeouts</span></li>
      <li><span>Loop 1 — finds PRs assigned to me and reviews them</span></li>
      <li><span>Loop 2 — watches the board: heartbeat for isolation, status for state</span></li>
    </ul>
  )
}

LoopChallengesSlide.meta = {
  title: 'Loop challenges',
  section: 'loop',
  sectionLabel: 'Loop Engineering',
  notes: 'Retrying a non-deterministic operation is not retrying an HTTP call — idempotency has to be designed in. Partial work on timeout is the case people forget. The heartbeat mechanism deserves its own diagram in the article.',
}

export default LoopChallengesSlide
