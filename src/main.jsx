import React from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'

import '@fontsource-variable/jetbrains-mono'
import '@fontsource-variable/manrope'
import '@fontsource-variable/source-serif-4'
import './styles.css'

import App from './app/App.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
)
