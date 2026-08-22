import { NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Deck from './components/Deck.jsx'
import Articles from './components/Articles.jsx'
import AppendixPage from './components/Appendix.jsx'
import { SLIDES } from './content/slides.js'

export default function App() {
  // The deck presents full-bleed: reveal owns the whole window, so the site
  // header is hidden there and the deck's own bottom bar carries navigation.
  const presenting = useLocation().pathname.startsWith('/deck')

  return (
    <div className={'shell' + (presenting ? ' shell--presenting' : '')}>
      {!presenting && (
        <header className="topbar">
          <div className="topbar__mark">
            <span className="topbar__dot" aria-hidden="true" />
            How to use and learn AI
          </div>
          <nav className="topbar__nav">
            <NavLink to="/deck" className={({ isActive }) => 'tab' + (isActive ? ' is-on' : '')}>
              Deck
            </NavLink>
            <NavLink to="/articles" className={({ isActive }) => 'tab' + (isActive ? ' is-on' : '')}>
              Articles
            </NavLink>
            <NavLink to="/appendix" className={({ isActive }) => 'tab' + (isActive ? ' is-on' : '')}>
              Appendix
            </NavLink>
          </nav>
          <div className="topbar__meta">{SLIDES.length} slides · 45 min</div>
        </header>
      )}

      <Routes>
        <Route path="/" element={<Navigate to="/deck" replace />} />
        <Route path="/deck" element={<Deck />} />
        <Route path="/deck/:n" element={<Deck />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/appendix" element={<AppendixPage />} />
        <Route path="*" element={<Navigate to="/deck" replace />} />
      </Routes>
    </div>
  )
}
