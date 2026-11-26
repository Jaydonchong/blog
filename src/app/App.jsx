import { useSyncExternalStore } from 'react'
import { Link, Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom'
import { TOPICS } from '../content/topics/index.js'
import TopicsGallery from '@shared/components/TopicsGallery/TopicsGallery.jsx'
import AppendixPage from './pages/AppendixPage.jsx'
import TopicPage from './pages/TopicPage.jsx'
import './App.css'

function LegacyTopicRedirect({ kind }) {
  const { slug, n, section } = useParams()
  const location = useLocation()
  const search = new URLSearchParams(location.search)
  let hash = location.hash

  if (kind === 'slides' && n) search.set('slide', n)
  if (kind === 'articles' && section) hash = `#${section}`

  return (
    <Navigate
      to={{
        pathname: `/topic/${slug}`,
        search: search.toString() ? `?${search}` : '',
        hash,
      }}
      replace
    />
  )
}

/* The deck's F key uses the browser Fullscreen API. */
function subscribeToFullscreen(callback) {
  document.addEventListener('fullscreenchange', callback)
  document.addEventListener('webkitfullscreenchange', callback)
  return () => {
    document.removeEventListener('fullscreenchange', callback)
    document.removeEventListener('webkitfullscreenchange', callback)
  }
}

function getFullscreenSnapshot() {
  return Boolean(document.fullscreenElement || document.webkitFullscreenElement)
}

function useFullscreen() {
  return useSyncExternalStore(subscribeToFullscreen, getFullscreenSnapshot)
}

export default function App() {
  const { pathname } = useLocation()
  const topicId = pathname.startsWith('/topic/') ? pathname.split('/')[2] : null
  const activeTopic = TOPICS.find((topic) => topic.meta.slug === topicId)
  const presenting = activeTopic?.kind === 'slides'
  const fullscreen = useFullscreen()

  /* While presenting — and only out of fullscreen — the deck keeps a slim bar
     with the way back to the topic picker. */
  const deckChrome = presenting && !fullscreen
  const deckTitle = deckChrome ? activeTopic.meta.title : null

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
        <Route path="/topic/:topicId" element={<TopicPage />} />
        <Route path="/slides/:slug" element={<LegacyTopicRedirect kind="slides" />} />
        <Route path="/slides/:slug/:n" element={<LegacyTopicRedirect kind="slides" />} />
        <Route path="/articles" element={<Navigate to="/slides" replace />} />
        <Route path="/articles/:slug" element={<LegacyTopicRedirect kind="articles" />} />
        <Route path="/articles/:slug/:section" element={<LegacyTopicRedirect kind="articles" />} />
        <Route path="/appendix" element={<AppendixPage />} />
        <Route path="*" element={<Navigate to="/slides" replace />} />
      </Routes>
    </div>
  )
}
