/**
 * The deck, presented by reveal.js.
 *
 * Why reveal: it renders every slide into a fixed 1280x720 logical box and
 * CSS-scales that box to fit the window. A slide therefore cannot be taller
 * than the screen — no scrolling on a laptop, no per-viewport overflow bugs,
 * and no container queries in the slide CSS.
 *
 * Routing: HashRouter already owns the URL hash, so reveal's own `hash`
 * option is off. The route is the single source of truth for which slide is
 * showing; `slidechanged` writes back to the route.
 *
 * Keys (reveal's own): ← → move · Esc slide grid · F fullscreen · S speaker
 * notes in a second window · B blank the screen.
 */
import { useEffect, useRef } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Reveal from 'reveal.js'
import RevealNotes from 'reveal.js/plugin/notes'
import 'reveal.js/reveal.css'
import { SECTIONS, SLIDES } from '../content/slides.js'
import Surface from './Surface.jsx'

// Where each section starts and how many slides it spans, for the layer bar.
const SPANS = SECTIONS.map((section) => {
  const slides = SLIDES.filter((s) => s.section === section.id)
  return { ...section, first: slides[0].n, count: slides.length }
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

export default function Deck() {
  const { n } = useParams()
  const navigate = useNavigate()
  const rootRef = useRef(null)
  const deckRef = useRef(null)
  // Read by the slidechanged listener, which is registered once.
  const navRef = useRef(navigate)
  navRef.current = navigate

  const current = Math.min(Math.max(parseInt(n, 10) || 1, 1), SLIDES.length)
  const startRef = useRef(current)

  useEffect(() => {
    const deck = new Reveal(rootRef.current, {
      // The logical slide. Everything in the slide CSS is a px in this box.
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
      // Vertical arrows would imply stacks we do not have.
      navigationMode: 'linear',
      plugins: [RevealNotes],
    })

    deck.initialize().then(() => {
      deckRef.current = deck
      if (startRef.current !== 1) deck.slide(startRef.current - 1)
      deck.on('slidechanged', (e) => {
        navRef.current(`/deck/${e.indexh + 1}`, { replace: true })
      })
    })

    return () => {
      deckRef.current = null
      try {
        deck.destroy()
      } catch {
        /* reveal throws if initialize() has not resolved yet */
      }
    }
  }, [])

  // Route → reveal. No loop: reveal's own change lands here already in sync.
  useEffect(() => {
    const deck = deckRef.current
    if (deck && deck.getIndices().h !== current - 1) deck.slide(current - 1)
  }, [current])

  const jump = (target) => {
    const deck = deckRef.current
    if (deck) deck.slide(target - 1)
    else navigate(`/deck/${target}`, { replace: true })
  }

  return (
    <div className="deckview">
      <div className="reveal" ref={rootRef}>
        <div className="slides">
          {SLIDES.map((slide) => (
            <section key={slide.n}>
              <Surface slide={slide} />
              <aside className="notes">{slide.notes}</aside>
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
