import { useEffect, useRef } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Reveal from 'reveal.js'
import RevealNotes from 'reveal.js/plugin/notes'
import 'reveal.js/reveal.css'
import Slide from '@shared/components/Slide.jsx'
import { SECTIONS, SLIDES } from './IntroductionToAgenticWorkflowsSlide.jsx'

const SPANS = SECTIONS.map((section) => {
  const sectionSlides = SLIDES.filter((S) => S.meta.section === section.id)
  const firstIdx = SLIDES.indexOf(sectionSlides[0])
  return { ...section, first: firstIdx + 1, count: sectionSlides.length }
})

function LayerBar({ current, onJump }) {
  return (
    <nav className="deckbar__layers" aria-label="Sections">
      {SPANS.map((s) => {
        const last = s.first + s.count - 1
        const here = current >= s.first && current <= last
        const done = current > last
        const progress = here ? ((current - s.first + 1) / s.count) * 100 : done ? 100 : 0
        return (
          <button
            key={s.id}
            className={
              'layer' + (here ? ' is-on' : '') + (done ? ' is-past' : '') +
              (s.minor ? ' is-minor' : '')
            }
            style={{ flexGrow: s.count }}
            onClick={() => onJump(s.first)}
            aria-current={here ? 'step' : undefined}
            title={`${s.label} — ${s.count} slide${s.count > 1 ? 's' : ''}`}
          >
            <span className="layer__label">{s.short}</span>
            <span className="layer__bar">
              <span className="layer__fill" style={{ width: `${progress}%` }} />
            </span>
          </button>
        )
      })}
    </nav>
  )
}

function IntroductionToAgenticWorkflowsDeck() {
  const { n } = useParams()
  const navigate = useNavigate()
  const rootRef = useRef(null)
  const deckRef = useRef(null)
  const navRef = useRef(navigate)
  navRef.current = navigate

  const slug = IntroductionToAgenticWorkflowsDeck.meta.slug
  const current = Math.min(Math.max(parseInt(n, 10) || 1, 1), SLIDES.length)
  const startRef = useRef(current)

  useEffect(() => {
    const deck = new Reveal(rootRef.current, {
      width: 1280,
      height: 720,
      margin: 0.035,
      minScale: 0.1,
      maxScale: 1.6,
      center: false,
      hash: false,
      history: false,
      progress: false,
      slideNumber: false,
      controlsTutorial: false,
      controlsLayout: 'edges',
      transition: 'fade',
      transitionSpeed: 'fast',
      navigationMode: 'linear',
      plugins: [RevealNotes],
    })

    deck.initialize().then(() => {
      deckRef.current = deck
      if (startRef.current !== 1) deck.slide(startRef.current - 1)
      deck.on('slidechanged', (e) => {
        navRef.current(`/slides/${slug}/${e.indexh + 1}`, { replace: true })
      })
    })

    return () => {
      deckRef.current = null
      try { deck.destroy() } catch { /* reveal throws if initialize() has not resolved */ }
    }
  }, [slug])

  useEffect(() => {
    const deck = deckRef.current
    if (deck && deck.getIndices().h !== current - 1) deck.slide(current - 1)
  }, [current])

  const jump = (target) => {
    const deck = deckRef.current
    if (deck) deck.slide(target - 1)
    else navigate(`/slides/${slug}/${target}`, { replace: true })
  }

  return (
    <div className="deckview">
      <div className="reveal" ref={rootRef}>
        <div className="slides">
          {SLIDES.map((SlideComp, i) => (
            <section key={i}>
              <Slide meta={SlideComp.meta}>
                <SlideComp />
              </Slide>
              {SlideComp.meta.notes && (
                <aside className="notes">{SlideComp.meta.notes}</aside>
              )}
            </section>
          ))}
        </div>
      </div>

      <div className="deckbar">
        <LayerBar current={current} onJump={jump} />
        <div className="deckbar__meta">
          <span className="deckbar__count">
            <b>{String(current).padStart(2, '0')}</b> / {SLIDES.length}
          </span>
          <span className="deckbar__keys">
            <kbd>Esc</kbd> grid <kbd>F</kbd> full <kbd>S</kbd> notes
          </span>
          <Link className="deckbar__link" to="/appendix">
            Appendix
          </Link>
        </div>
      </div>
    </div>
  )
}

IntroductionToAgenticWorkflowsDeck.meta = {
  title: 'Introduction to Agentic Workflows',
  slug: 'introduction-to-agentic-workflows',
  description: 'From the chat box to the unattended loop — six layers that turn a prompt into an autonomous agent.',
}

export default IntroductionToAgenticWorkflowsDeck
