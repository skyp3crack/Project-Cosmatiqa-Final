import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import { UserProvider } from './context/UserContext'
import './index.css'
import App from './App.jsx'

// Initialize Convex client
const convexUrl = import.meta.env.VITE_CONVEX_URL

if (!convexUrl) {
  throw new Error('VITE_CONVEX_URL is not set. Please check Frontend/.env.local file exists and restart the dev server.')
}

const convex = new ConvexReactClient(convexUrl)
console.log('✅ Convex client connected to:', convexUrl)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConvexProvider client={convex}>
      <BrowserRouter>
        <UserProvider>
          <App />
        </UserProvider>
      </BrowserRouter>
    </ConvexProvider>
  </StrictMode>,
)
