import { useEffect, useRef, useState } from 'react'
import './WorkflowTransformation.css'

const phases = [
  {
    before: [['Request', 'human'], ['Plan', 'human'], ['Implement', 'human'], ['Review', 'human']],
    after: [['Request', 'human'], ['Plan', 'human'], ['Implement', 'agent', 'Agent takes the boilerplate'], ['Review', 'human']],
    added: [2],
  },
  {
    before: [['Plan', 'human'], ['Implement', 'agent'], ['Review', 'human']],
    after: [['Plan', 'human'], ['Align decisions', 'both', 'Resolve assumptions first'], ['Implement', 'agent'], ['Review', 'human']],
    added: [1],
  },
  {
    before: [['Plan + align', 'both'], ['Implement', 'agent'], ['Review', 'human']],
    after: [['Project context', 'both', 'Written standards and product rules'], ['Plan + align', 'both'], ['Implement', 'agent'], ['Review', 'human']],
    added: [0],
  },
  {
    before: [['Context', 'both'], ['Plan + align', 'both'], ['Implement', 'agent'], ['Review', 'human']],
    failure: [
      { from: 2, to: 1 },
      { from: 4, to: 3 },
    ],
    after: [
      ['Plan + align', 'both'],
      ['Implement task A', 'agent'],
      ['Review task A', 'human'],
      ['Implement task B', 'agent'],
      ['Review task B', 'human'],
      ['Done', 'none'],
    ],
  },
  {
    before: [['Plan + align', 'both'], ['Task set', 'both'], ['Implement', 'agent'], ['Final review', 'human']],
    failure: [
      { from: 3, to: 2 },
      { from: 4, to: 2 },
    ],
    after: [
      ['Plan + align', 'both'],
      ['Task set', 'both'],
      ['Implement', 'agent'],
      ['Static checks', 'script', 'Hooks · test · lint · build'],
      ['Agent review', 'agent', 'Rubric-based quality gate'],
      ['Final review', 'human'],
    ],
  },
  {
    before: [['Context', 'both'], ['Task set', 'both'], ['Implement', 'agent'], ['Static checks', 'script'], ['Agent review', 'agent'], ['Final review', 'human']],
    after: [['Context + learnings', 'both', 'Recurring feedback is carried forward'], ['Task set', 'both'], ['Implement', 'agent'], ['Static checks', 'script'], ['Agent review', 'agent'], ['Final review', 'human'], ['Record learnings', 'human']],
    added: [0, 6],
    feedback: true,
  },
  {
    before: [['Context + learnings', 'both'], ['Plan + align', 'both'], ['Task set', 'both'], ['Implement', 'agent'], ['Agent review', 'agent'], ['Final review', 'human']],
  },
  {
    before: [['Plan + align', 'both'], ['Orchestrate', 'agent'], ['Generalist', 'agent', 'Logic · tests · docs · review'], ['Agent review', 'agent'], ['Final review', 'human']],
  },
]

function HumanIcon() {
  return (
    <svg className="wf-icon wf-icon--human" viewBox="16 28 36 48" aria-hidden="true">
      <circle cx="34" cy="44" r="10" fill="var(--paper)" stroke="currentColor" strokeWidth="3" />
      <path d="M16 70a18 18 0 0 1 36 0" fill="none" stroke="currentColor" strokeWidth="3" />
    </svg>
  )
}

function AgentIcon() {
  return (
    <svg className="wf-icon wf-icon--agent" viewBox="-8 20 60 76" aria-hidden="true">
      <line x1="22" y1="34" x2="22" y2="25" stroke="currentColor" strokeWidth="3" />
      <circle cx="22" cy="21" r="3" fill="var(--paper)" stroke="currentColor" strokeWidth="3" />
      <rect x="0" y="34" width="44" height="36" rx="6" fill="var(--paper)" stroke="currentColor" strokeWidth="3" />
      <circle cx="13" cy="49" r="3.5" fill="var(--graphite)" />
      <circle cx="31" cy="49" r="3.5" fill="var(--graphite)" />
      <line x1="13" y1="62" x2="31" y2="62" stroke="currentColor" strokeWidth="3" />
      <rect x="-8" y="76" width="60" height="18" rx="4" fill="var(--paper)" stroke="currentColor" strokeWidth="3" />
    </svg>
  )
}

function ScriptIcon() {
  return <span className="wf-script-icon" aria-label="Deterministic script">⌘</span>
}

function Actors({ role }) {
  if (role === 'none') return null
  const icons = role === 'both' ? ['human', 'agent'] : [role]
  const label = role === 'both' ? 'Human and agent' : role === 'script' ? 'Deterministic script' : role

  return (
    <span className="wf-actors" aria-label={label}>
      {icons.map((icon) => (
        <span className="wf-actor" key={icon}>
          {icon === 'human' ? <HumanIcon /> : icon === 'agent' ? <AgentIcon /> : <ScriptIcon />}
        </span>
      ))}
    </span>
  )
}

function Node({ item, added = false, compact = false }) {
  const [label, role, detail] = item
  const className = [
    compact ? 'wf-step' : 'wf-node',
    added ? 'wf-node--added' : '',
  ].filter(Boolean).join(' ')

  return (
    <div className={className} role="group" aria-label={`${label}, ${role}`}>
      <Actors role={role} />
      <span className="wf-node__label">{label}</span>
      {detail && <span className="wf-node__detail">{detail}</span>}
    </div>
  )
}

function Flow({ items, added = [] }) {
  return (
    <div className="wf-flow" aria-label={items.map(([label]) => label).join(' then ')}>
      {items.map((item, index) => (
        <span className="wf-flow-part" key={`${item[0]}-${index}`}>
          {index > 0 && <span className={`wf-flow-arrow${added.includes(index) ? ' wf-flow-arrow--added' : ''}`} aria-hidden="true">→</span>}
          <Node item={item} added={added.includes(index)} />
        </span>
      ))}
    </div>
  )
}

function BranchNode({ label, role, detail, added = false }) {
  return <Node item={[label, role, detail]} added={added} />
}

function DownArrow() {
  return <span className="wf-down" aria-hidden="true">↓</span>
}

function FailureSequence({ phase, items, loops }) {
  const containerRef = useRef(null)
  const [paths, setPaths] = useState([])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined

    const update = () => {
      const bounds = container.getBoundingClientRect()
      const svg = container.querySelector('.wf-failure-lines')
      if (!svg) return
      svg.setAttribute('viewBox', `0 0 ${bounds.width} ${bounds.height}`)
      setPaths(loops.map(({ from, to }, index) => {
        const source = container.querySelector(`[data-stage="${from}"] .wf-node`).getBoundingClientRect()
        const target = container.querySelector(`[data-stage="${to}"] .wf-node`).getBoundingClientRect()
        const startX = source.right - bounds.left
        const startY = source.top + source.height / 2 - bounds.top
        const endX = target.right - bounds.left
        const endY = target.top + target.height / 2 - bounds.top
        const rail = Math.min(bounds.width - 4, startX + 26 + index * 27)
        return `M ${startX} ${startY} C ${rail} ${startY}, ${rail} ${startY}, ${rail} ${startY - 8} L ${rail} ${endY + 8} C ${rail} ${endY}, ${endX + 26} ${endY}, ${endX} ${endY}`
      }))
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(container)
    return () => observer.disconnect()
  }, [loops])

  return (
    <div className="wf-failure-layout" ref={containerRef} aria-label={phase === 3 ? 'Failed reviews return to the matching task implementation' : 'Static check and agent review failures return to implementation'}>
      <div className="wf-sequence">
        {items.map((item, index) => (
          <div className="wf-stage" data-stage={index} key={item[0]}>
            {index > 0 && <DownArrow />}
            <BranchNode label={item[0]} role={item[1]} detail={item[2]} added={index > 0 && index < items.length - 1} />
          </div>
        ))}
      </div>
      <svg className="wf-failure-lines" aria-hidden="true" preserveAspectRatio="none">
        <defs>
          <marker id={`wf-failure-arrow-${phase}`} markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0 0L8 4L0 8" fill="var(--rose)" />
          </marker>
        </defs>
        {loops.map((loop, index) => (
          <path className="wf-failure-path" key={`${loop.from}-${loop.to}`} d={paths[index] ?? ''} markerEnd={`url(#wf-failure-arrow-${phase})`} />
        ))}
      </svg>
    </div>
  )
}

function FanCard({ label, detail }) {
  return (
    <div className="wf-fan-card" role="group" aria-label={`${label}, agent`}>
      <AgentIcon />
      <span className="wf-node__label">{label}</span>
      <span className="wf-node__detail">{detail}</span>
    </div>
  )
}

function ParallelStep({ label, role }) {
  return <Node item={[label, role]} compact />
}

function WorkflowChoice({ mode, setMode }) {
  const supervisor = mode === 'supervisor'
  const lanes = (
    <div className={`wf-parallel-lanes${supervisor ? '' : ' wf-parallel-lanes--independent'}`}>
      <div className="wf-parallel-lane">
        <ParallelStep label="Task A" role="both" />
        <DownArrow />
        <ParallelStep label="Implement A" role="agent" />
        <DownArrow />
        <ParallelStep label="Agent review A" role="agent" />
      </div>
      <div className="wf-parallel-lane">
        <ParallelStep label="Task B" role="both" />
        <DownArrow />
        <ParallelStep label="Implement B" role="agent" />
        <DownArrow />
        <ParallelStep label="Agent review B" role="agent" />
      </div>
    </div>
  )

  return (
    <>
      <div className="wf-choice" role="group" aria-label="Choose workflow coordination style">
        <button type="button" aria-pressed={supervisor} onClick={() => setMode('supervisor')}>
          <strong>Supervisor</strong><span>coordinated subagents</span>
        </button>
        <button type="button" aria-pressed={!supervisor} onClick={() => setMode('choreographer')}>
          <strong>Choreographer</strong><span>separate terminals · visible handoffs</span>
        </button>
      </div>

      <div className="wf-workflow-mode" aria-label={`${supervisor ? 'Supervisor with coordinated subagents' : 'Choreographer with independent procedural steps'} workflow`}>
        <BranchNode label="Context + learnings" role="both" />
        <DownArrow />
        {supervisor ? (
          <>
            <BranchNode label="Plan + align" role="both" />
            <DownArrow />
            <div className="wf-supervisor-group" aria-label="Supervisor parent containing orchestrator and coordinated subagents">
              <span className="wf-supervisor-group__label">Supervisor · coordinated subagents</span>
              <BranchNode label="Orchestrator" role="agent" detail="Coordinates task subagents" />
              <DownArrow />
              {lanes}
            </div>
          </>
        ) : lanes}
        <div className="wf-merge" aria-hidden="true"><span>↓</span></div>
        <BranchNode label="Synthesizer" role="agent" detail="Confirm both reviews pass" />
        <DownArrow />
        <BranchNode label="Final review" role="human" />
        <p className="wf-mode-caption">
          {supervisor
            ? 'The Supervisor owns the orchestrator and coordinated subagents; the synthesizer checks both reviews before final review.'
            : 'The Choreographer connects independent task, implementation, and review steps; the synthesizer checks both reviews before final review.'}
        </p>
      </div>
    </>
  )
}

function Specialization() {
  return (
    <div className="wf-specialization" aria-label="Gather context, fan out to specialist planners, synthesize the plan, implement, fan out to specialist reviewers, synthesize review, final review">
      <BranchNode label="Gather context" role="both" />
      <DownArrow />
      <div className="wf-fan-pair">
        <FanCard label="Logic planner" detail="Implementation plan" />
        <FanCard label="Test planner" detail="Coverage plan" />
        <FanCard label="Docs planner" detail="Documentation plan" />
      </div>
      <div className="wf-join" aria-hidden="true"><span>↓</span></div>
      <BranchNode label="Planning synthesis" role="agent" detail="Combine the specialist plans" />
      <DownArrow />
      <BranchNode label="Implement" role="agent" />
      <DownArrow />
      <div className="wf-fan-pair">
        <FanCard label="Functional review" detail="Behavior and task fit" />
        <FanCard label="Convention review" detail="Repository patterns" />
        <FanCard label="Test review" detail="Coverage and assertions" />
      </div>
      <div className="wf-join" aria-hidden="true"><span>↓</span></div>
      <BranchNode label="Review synthesis" role="agent" detail="Combine review findings" />
      <DownArrow />
      <BranchNode label="Final review" role="human" />
    </div>
  )
}

function PhaseDiagram({ phase, isVisible }) {
  const config = phases[phase]
  const [mode, setMode] = useState('supervisor')
  let after

  if (phase === 3 || phase === 4) {
    after = <FailureSequence phase={phase} items={config.after} loops={config.failure} />
  } else if (phase === 6) {
    after = <WorkflowChoice mode={mode} setMode={setMode} />
  } else if (phase === 7) {
    after = <Specialization />
  } else {
    after = (
      <>
        <Flow items={config.after} added={config.added} />
        {config.feedback && <div className="wf-feedback">↶ Review feedback becomes reusable context</div>}
      </>
    )
  }

  return (
    <figure className={`wf-transformation${isVisible ? ' wf-transformation--visible' : ''}`} aria-label={`Phase ${phase} before and after workflow`}>
      <figcaption className="wf-transformation__header">
        <span>The workflow changes</span>
        <span>Before ↓ after</span>
      </figcaption>
      <div className="wf-state">
        <p className="wf-state__label">Before Phase {phase}</p>
        <Flow items={config.before} />
      </div>
      <div className="wf-state wf-state--after">
        <p className="wf-state__label">After Phase {phase}</p>
        {after}
      </div>
    </figure>
  )
}

export default function WorkflowTransformation({ phase }) {
  const rootRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const root = rootRef.current
    if (!root || !('IntersectionObserver' in window)) {
      setIsVisible(true)
      return undefined
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true)
        observer.disconnect()
      }
    }, { threshold: 0.15 })
    observer.observe(root)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={rootRef} className="wf-article-diagram">
      <PhaseDiagram phase={phase} isVisible={isVisible} />
    </div>
  )
}
