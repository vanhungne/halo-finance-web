import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import iconUrl from './assets/icon.png'
import { AuthProvider } from './contexts/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)

// Ensure favicon works in dev and build
const ensureFavicon = () => {
  const link = document.querySelector('link[rel="icon"]') || document.createElement('link')
  link.rel = 'icon'
  link.type = 'image/png'
  link.href = iconUrl
  if (!link.parentNode) document.head.appendChild(link)
}
ensureFavicon()
