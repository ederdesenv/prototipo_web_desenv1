import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.min.css'
import App from './App'
import { AuthProvider } from './Contexts/AuthContext'

// Bootstrap JS (necessário para o collapse do navbar)
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
