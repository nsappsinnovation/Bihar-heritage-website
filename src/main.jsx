import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './fonts.js'
import './index.css'
import App from './App.jsx'
import { clearLegacyStorage } from './utils/clearLegacyStorage.js'

clearLegacyStorage()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
