import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/sweetalert2-custom.css'
import App from './App.jsx'
import { authService } from './services/authService'

// Initialize auth headers if token exists
authService.initializeAuth();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
