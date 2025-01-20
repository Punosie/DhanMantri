import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// import { Provider } from "@/components/ui/provider.jsx"
import {Provider} from "./Components/ui/provider.jsx"
import { Toaster } from './Components/ui/toaster.jsx'
import { AuthProvider } from "./Contexts/AuthContext"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider>
      <AuthProvider>
      <Toaster />
      <App />
      </AuthProvider>
    </Provider>
  </StrictMode>,
)
