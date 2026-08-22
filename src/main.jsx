import React from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'

import '@fontsource-variable/bricolage-grotesque'
import '@fontsource-variable/newsreader'
import '@fontsource-variable/jetbrains-mono'
import './styles.css'

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
)
