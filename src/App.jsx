import { useEffect, useState } from 'react'
import { Link, NavLink, Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom'
import { TOPICS } from './content/topics/index.js'
import TopicsGallery from './shared/components/TopicsGallery.jsx'
import ArticleIndex from './shared/components/ArticleIndex.jsx'
import Articles from './components/Articles.jsx'

function TopicDeckRoute() {
  const { slug } = useParams()
  const Deck = TOPICS.find((D) => D.meta.slug === slug)
  if (!Deck) return <Navigate to="/slides" replace />
  return <Deck />
}

/* The deck's F key uses the browser Fullscreen API. */
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
              Jaydonchong
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
        <Route path="/articles" element={<ArticleIndex />} />
        <Route path="/articles/llms-prompts-agents" element={<Articles />} />
        <Route path="/appendix" element={<Navigate to="/articles/llms-prompts-agents#appendix" replace />} />
        <Route path="*" element={<Navigate to="/slides" replace />} />
      </Routes>
    </div>
  )
}
