import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// removed theme.css (dark mode)
import './styles/global.css'
import App from './App.jsx'
import './i18n'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
