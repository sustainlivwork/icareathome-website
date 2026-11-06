import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './App.jsx'
import './styles/index.css'

const container = document.getElementById('root')
const app = (
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>
)

// Published pages already contain the rendered HTML (see scripts/prerender.mjs),
// which React takes over. During `npm run dev` the page starts empty.
if (container.firstElementChild) hydrateRoot(container, app)
else createRoot(container).render(app)
