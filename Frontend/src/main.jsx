import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import { Provider } from "./Components/ui/provider.jsx"
import { Toaster } from './Components/ui/toaster.jsx'
import { AuthProvider } from "./Contexts/AuthContext"

// Vercel Web Analytics and Speed Insights (real-user page load metrics), only on Vercel builds
const VercelInsights = import.meta.env.VITE_VERCEL_ENV ? lazy(() => import('./lib/VercelInsights.jsx')) : () => null

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider>
      <AuthProvider>
        <Toaster />
        <App />
      </AuthProvider>
    </Provider>
    <Suspense fallback={null}>
      <VercelInsights />
    </Suspense>
  </StrictMode>,
)
