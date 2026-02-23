import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import CritterCrank from './CritterCrank.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CritterCrank />
  </StrictMode>
)
