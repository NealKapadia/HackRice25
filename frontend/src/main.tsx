import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Auth0Provider } from '@auth0/auth0-react'

const domain = (import.meta as any).env.VITE_AUTH0_DOMAIN as string | undefined
const clientId = (import.meta as any).env.VITE_AUTH0_CLIENT_ID as string | undefined

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Auth0Provider
      domain={domain || 'YOUR_AUTH0_DOMAIN'}
      clientId={clientId || 'YOUR_AUTH0_CLIENT_ID'}
      authorizationParams={{ redirect_uri: window.location.origin }}
    >
      <App />
    </Auth0Provider>
  </StrictMode>,
)
