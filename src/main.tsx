import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
// Import local fonts (no CDN)
import '@fontsource/courier-prime/400.css'
import '@fontsource/roboto-condensed/700.css'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
