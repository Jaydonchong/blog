import { useEffect, useState } from 'react'
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { SLIDE_TOPICS } from '../content/topics/index.js'
import TopicsGallery from '@shared/components/TopicsGallery/TopicsGallery.jsx'
import ArticleTopicPage from './pages/ArticleTopicPage.jsx'
import AppendixPage from './pages/AppendixPage.jsx'
import SlideTopicPage from './pages/SlideTopicPage.jsx'
import './App.css'

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
    ? SLIDE_TOPICS.find((topic) => topic.meta.slug === pathname.split('/')[2])?.meta.title
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
          <Link className="topbar__mark" to="/slides">Jaydonchong</Link>
        </header>
      )}

      <Routes>
        <Route path="/" element={<Navigate to="/slides" replace />} />
        <Route path="/deck" element={<Navigate to="/slides" replace />} />
        <Route path="/deck/:n" element={<Navigate to="/slides" replace />} />
        <Route path="/slides" element={<TopicsGallery />} />
        <Route path="/slides/:slug" element={<SlideTopicPage />} />
        <Route path="/slides/:slug/:n" element={<SlideTopicPage />} />
        <Route path="/articles" element={<Navigate to="/slides" replace />} />
        <Route path="/articles/:slug" element={<ArticleTopicPage />} />
        <Route path="/articles/:slug/:section" element={<ArticleTopicPage />} />
        <Route path="/appendix" element={<AppendixPage />} />
        <Route path="*" element={<Navigate to="/slides" replace />} />
      </Routes>
    </div>
  )
}
