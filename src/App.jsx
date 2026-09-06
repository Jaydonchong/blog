import { useEffect, useState } from 'react'
import { Link, NavLink, Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom'
import { TOPICS } from './content/topics/index.js'
import TopicsGallery from './shared/components/TopicsGallery.jsx'
import Articles from './components/Articles.jsx'
import ArticleReader from './components/ArticleReader.jsx'

function TopicDeckRoute() {
  const { slug } = useParams()
  const Deck = TOPICS.find((D) => D.meta.slug === slug)
  if (!Deck) return <Navigate to="/slides" replace />
  return <Deck />
}

/* Reveal's F key calls requestFullscreen, so the browser's own flag is the
   single source of truth for "is the slide filling the screen". */
function useFullscreen() {
  const [full, setFull] = useState(false)
  useEffect(() => {
    const sync = () => setFull(Boolean(document.fullscreenElement || document.webkitFullscreenElement))
    sync()
    document.addEventListener('fullscreenchange', sync)
    document.addEventListener('webkitfullscreenchange', sync)
    return () => {
      document.removeEventListener('fullscreenchange', sync)
      document.removeEventListener('webkitfullscreenchange', sync)
    }
  }, [])
  return full
}

export default function App() {
  const { pathname } = useLocation()
  const presenting = pathname.startsWith('/slides/') && pathname !== '/slides'
  const fullscreen = useFullscreen()

  /* While presenting — and only out of fullscreen — the deck keeps a slim bar
     with the way back to the topic picker. */
  const deckChrome = presenting && !fullscreen
  const deckTitle = deckChrome
    ? TOPICS.find((D) => D.meta.slug === pathname.split('/')[2])?.meta.title
    : null

  return (
    <div className={'shell' + (presenting ? ' shell--presenting' : '') + (deckChrome ? ' shell--deckchrome' : '')}>
      {deckChrome && (
        <header className="deckchrome">
          <Link className="deckchrome__back" to="/slides">
            <span aria-hidden="true">←</span> All topics
          </Link>
          {deckTitle && <span className="deckchrome__title">{deckTitle}</span>}
        </header>
      )}

      {!presenting && (
        <header className="topbar">
          <div className="topbar__mark">
            <span className="topbar__dot" aria-hidden="true" />
            Jaydon's Notes
          </div>
          <nav className="topbar__nav">
            <NavLink to="/slides" className={({ isActive }) => 'tab' + (isActive ? ' is-on' : '')}>
              Slides
            </NavLink>
            <NavLink to="/articles" className={({ isActive }) => 'tab' + (isActive ? ' is-on' : '')}>
              Articles
            </NavLink>
          </nav>
          <div className="topbar__meta">{TOPICS.length} topic{TOPICS.length !== 1 ? 's' : ''}</div>
        </header>
      )}

      <Routes>
        <Route path="/" element={<Navigate to="/slides" replace />} />
        <Route path="/deck" element={<Navigate to="/slides" replace />} />
        <Route path="/deck/:n" element={<Navigate to="/slides" replace />} />
        <Route path="/slides" element={<TopicsGallery />} />
        <Route path="/slides/:slug" element={<TopicDeckRoute />} />
        <Route path="/slides/:slug/:n" element={<TopicDeckRoute />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/articles/:slug" element={<ArticleReader />} />
        <Route path="*" element={<Navigate to="/slides" replace />} />
      </Routes>
    </div>
  )
}
