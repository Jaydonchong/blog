import { NavLink, Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom'
import { TOPICS } from './content/topics/index.js'
import TopicsGallery from './shared/components/TopicsGallery.jsx'
import Articles from './components/Articles.jsx'
import AppendixPage from './components/Appendix.jsx'

function TopicDeckRoute() {
  const { slug } = useParams()
  const Deck = TOPICS.find((D) => D.meta.slug === slug)
  if (!Deck) return <Navigate to="/slides" replace />
  return <Deck />
}

export default function App() {
  const { pathname } = useLocation()
  const presenting = pathname.startsWith('/slides/') && pathname !== '/slides'

  return (
    <div className={'shell' + (presenting ? ' shell--presenting' : '')}>
      {!presenting && (
        <header className="topbar">
          <div className="topbar__mark">
            <span className="topbar__dot" aria-hidden="true" />
            How to use and learn AI
          </div>
          <nav className="topbar__nav">
            <NavLink to="/slides" className={({ isActive }) => 'tab' + (isActive ? ' is-on' : '')}>
              Slides
            </NavLink>
            <NavLink to="/articles" className={({ isActive }) => 'tab' + (isActive ? ' is-on' : '')}>
              Articles
            </NavLink>
            <NavLink to="/appendix" className={({ isActive }) => 'tab' + (isActive ? ' is-on' : '')}>
              Appendix
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
        <Route path="/appendix" element={<AppendixPage />} />
        <Route path="*" element={<Navigate to="/slides" replace />} />
      </Routes>
    </div>
  )
}
