import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { Link } from 'react-router-dom'
import Slide from '../Slide/Slide.jsx'
import './SlideDeck.css'

const WIDTH = 1280
const HEIGHT = 720
const MOBILE_QUERY = '(max-width: 620px)'

function subscribeToMobileLayout(callback) {
  const query = window.matchMedia(MOBILE_QUERY)
  query.addEventListener('change', callback)
  return () => query.removeEventListener('change', callback)
}

function getMobileLayoutSnapshot() {
  return window.matchMedia(MOBILE_QUERY).matches
}

function subscribeToDeckFullscreen(callback) {
  document.addEventListener('fullscreenchange', callback)
  return () => document.removeEventListener('fullscreenchange', callback)
}

function useMobileLayout() {
  return useSyncExternalStore(subscribeToMobileLayout, getMobileLayoutSnapshot)
}

function SlideContent({ SlideComponent }) {
  return (
    <Slide meta={SlideComponent.meta}>
      <SlideComponent />
    </Slide>
  )
}

function Overview({ slides, current, onSelect }) {
  return (
    <nav className="deckoverview" aria-label="All slides">
      {slides.map((SlideComponent, index) => (
        <button
          key={SlideComponent.meta.title}
          className={'deckoverview__item' + (current === index + 1 ? ' is-on' : '')}
          aria-current={current === index + 1 ? 'step' : undefined}
          onClick={() => onSelect(index + 1)}
        >
          <span className="deckoverview__number">{String(index + 1).padStart(2, '0')}</span>
          <span className="deckoverview__title">{SlideComponent.meta.title}</span>
          {SlideComponent.meta.sectionLabel && (
            <span className="deckoverview__section">{SlideComponent.meta.sectionLabel}</span>
          )}
        </button>
      ))}
    </nav>
  )
}

function LayerBar({ slides, sections, current, onJump }) {
  return (
    <nav className="deckbar__layers" aria-label="Sections">
      {sections.map((section) => {
        const sectionSlides = slides.filter((SlideComponent) => SlideComponent.meta.section === section.id)
        const first = slides.indexOf(sectionSlides[0]) + 1
        const here = current >= first && current < first + sectionSlides.length
        const done = current >= first + sectionSlides.length
        const progress = here
          ? ((current - first + 1) / sectionSlides.length) * 100
          : done ? 100 : 0

        return (
          <button
            key={section.id}
            className={
              'layer' + (here ? ' is-on' : '') + (done ? ' is-past' : '') +
              (section.minor ? ' is-minor' : '')
            }
            style={{ flexGrow: sectionSlides.length }}
            onClick={() => onJump(first)}
            aria-current={here ? 'step' : undefined}
            title={`${section.label} — ${sectionSlides.length} slide${sectionSlides.length > 1 ? 's' : ''}`}
          >
            <span className="layer__label">{section.short}</span>
            <span className="layer__bar">
              <span className="layer__fill" style={{ width: `${progress}%` }} />
            </span>
          </button>
        )
      })}
    </nav>
  )
}

export default function SlideDeck({ slides, sections, current, onSelect }) {
  const mobile = useMobileLayout()
  const deckRef = useRef(null)
  const stageRef = useRef(null)
  const sequenceRef = useRef(null)
  const currentRef = useRef(current)
  const onSelectRef = useRef(onSelect)
  const [scale, setScale] = useState(1)
  const [overview, setOverview] = useState(false)
  const [showNotes, setShowNotes] = useState(false)
  const fullscreen = useSyncExternalStore(
    subscribeToDeckFullscreen,
    () => Boolean(deckRef.current && document.fullscreenElement === deckRef.current)
  )

  currentRef.current = current
  onSelectRef.current = onSelect

  const selectSlide = useCallback((requested) => {
    const target = Math.min(Math.max(requested, 1), slides.length)
    onSelectRef.current(target)

    if (mobile) {
      sequenceRef.current
        ?.querySelector(`[data-slide-index="${target}"]`)
        ?.scrollIntoView({ block: 'start', behavior: 'smooth' })
    }
  }, [mobile, slides.length])

  useEffect(() => {
    if (mobile || !stageRef.current) return

    const resizeObserver = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      const nextScale = Math.min((width * 0.93) / WIDTH, (height * 0.93) / HEIGHT, 1.6)
      setScale(Math.max(nextScale, 0.1))
    })
    resizeObserver.observe(stageRef.current)
    return () => resizeObserver.disconnect()
  }, [mobile])

  useEffect(() => {
    if (!mobile || !sequenceRef.current) return

    const sequence = sequenceRef.current
    const visible = new Set()
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visible.add(entry.target)
        else visible.delete(entry.target)
      })

      const rootRect = sequence.getBoundingClientRect()
      const anchor = rootRect.top + rootRect.height * 0.42
      const active = [...visible]
        .filter((element) => {
          const rect = element.getBoundingClientRect()
          return rect.bottom > rootRect.top && rect.top < rootRect.bottom
        })
        .sort((a, b) => {
          const aCenter = (a.getBoundingClientRect().top + a.getBoundingClientRect().bottom) / 2
          const bCenter = (b.getBoundingClientRect().top + b.getBoundingClientRect().bottom) / 2
          return Math.abs(aCenter - anchor) - Math.abs(bCenter - anchor)
        })[0]

      const target = Number(active?.dataset.slideIndex)
      if (target && target !== currentRef.current) onSelectRef.current(target)
    }, { root: sequence, rootMargin: '-8% 0px -8% 0px', threshold: 0 })

    const slideElements = sequence.querySelectorAll('[data-slide-index]')
    slideElements.forEach((element) => observer.observe(element))

    const initialSlide = sequence.querySelector(`[data-slide-index="${currentRef.current}"]`)
    if (initialSlide && currentRef.current !== 1) {
      requestAnimationFrame(() => initialSlide.scrollIntoView({ block: 'start' }))
    }

    return () => observer.disconnect()
  }, [mobile, slides.length])

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen()
    else deckRef.current?.requestFullscreen?.()
  }, [])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return
      if (event.target instanceof HTMLElement && (
        event.target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)
      )) return

      const key = event.key.toLowerCase()
      if (key === 'escape' && (overview || showNotes)) {
        setOverview(false)
        setShowNotes(false)
      } else if (key === 'arrowright' || key === 'arrowdown' || key === 'pagedown') {
        event.preventDefault()
        selectSlide(currentRef.current + 1)
      } else if (key === 'arrowleft' || key === 'arrowup' || key === 'pageup') {
        event.preventDefault()
        selectSlide(currentRef.current - 1)
      } else if (key === 'home') {
        event.preventDefault()
        selectSlide(1)
      } else if (key === 'end') {
        event.preventDefault()
        selectSlide(slides.length)
      } else if (key === 'g' && !mobile) {
        setOverview((open) => !open)
      } else if (key === 'f') {
        toggleFullscreen()
      } else if (key === 's' || key === 'n') {
        setShowNotes((open) => !open)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [mobile, overview, selectSlide, showNotes, slides.length, toggleFullscreen])

  const activeSlide = slides[current - 1]
  const frameStyle = { width: WIDTH * scale, height: HEIGHT * scale }
  const contentStyle = { transform: `scale(${scale})` }

  return (
    <div className="deckview" ref={deckRef}>
      {mobile ? (
        <div className="decksequence" ref={sequenceRef}>
          {slides.map((SlideComponent, index) => (
            <section
              key={SlideComponent.meta.title}
              className="decksequence__slide"
              data-slide-index={index + 1}
              aria-label={`Slide ${index + 1}: ${SlideComponent.meta.title}`}
            >
              <SlideContent SlideComponent={SlideComponent} />
              {showNotes && index + 1 === current && SlideComponent.meta.notes && (
                <aside className="decknotes" aria-label="Speaker notes">
                  {SlideComponent.meta.notes}
                </aside>
              )}
            </section>
          ))}
        </div>
      ) : (
        <div className="deckstage" ref={stageRef}>
          <div className="deckstage__frame" style={frameStyle} aria-live="polite">
            <div className="deckstage__content" style={contentStyle}>
              <SlideContent SlideComponent={activeSlide} />
            </div>
          </div>
        </div>
      )}

      {!mobile && (
        <nav className="decknav" aria-label="Slide navigation">
          <button
            className="decknav__button decknav__button--previous"
            aria-label="Previous slide"
            disabled={current === 1}
            onClick={() => selectSlide(current - 1)}
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            className="decknav__button decknav__button--next"
            aria-label="Next slide"
            disabled={current === slides.length}
            onClick={() => selectSlide(current + 1)}
          >
            <span aria-hidden="true">→</span>
          </button>
        </nav>
      )}

      {!mobile && overview && (
        <Overview slides={slides} current={current} onSelect={(target) => {
          setOverview(false)
          selectSlide(target)
        }} />
      )}

      {!mobile && showNotes && activeSlide.meta.notes && (
        <aside className="decknotes decknotes--overlay" aria-label="Speaker notes">
          {activeSlide.meta.notes}
        </aside>
      )}

      <div className="deckbar">
        <LayerBar slides={slides} sections={sections} current={current} onJump={selectSlide} />
        <div className="deckbar__meta">
          <span className="deckbar__count">
            <b>{String(current).padStart(2, '0')}</b> / {slides.length}
          </span>
          <span className="deckbar__keys">
            <kbd>G</kbd> grid <kbd>F</kbd> full <kbd>S</kbd> notes
          </span>
          <Link className="deckbar__link" to="/appendix">
            Appendix
          </Link>
          <button className="deckbar__fullscreen" onClick={toggleFullscreen} aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}>
            {fullscreen ? 'Exit full' : 'Full screen'}
          </button>
        </div>
      </div>
    </div>
  )
}
