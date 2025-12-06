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
  const errorMsg = 'VITE_CONVEX_URL is not set. Please check Frontend/.env.local file exists (dev) or Vercel environment variables (production).'
  console.error('❌', errorMsg)
  // In production, show error in UI instead of crashing immediately
  if (import.meta.env.PROD) {
    document.body.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; height: 100vh; font-family: system-ui; padding: 20px; text-align: center;">
        <div>
          <h1 style="color: #ef4444; margin-bottom: 16px;">Configuration Error</h1>
          <p style="color: #6b7280; margin-bottom: 8px;">VITE_CONVEX_URL environment variable is not configured.</p>
          <p style="color: #6b7280; font-size: 14px;">Please configure this in your Vercel project settings.</p>
        </div>
      </div>
    `
  } else {
    throw new Error(errorMsg)
  }
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
