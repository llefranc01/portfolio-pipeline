import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
// Bootstrap's grid + utility layers only. The full bootstrap.css would
// also load Reboot and component styles, which reset fonts, headings,
// links and buttons and would fight the paper/ink design. These two
// files contain only opt-in classes (plus --bs-* variables), so they
// change nothing until a component uses a class. Loaded before our CSS
// so App.css wins any tie.
import 'bootstrap/dist/css/bootstrap-grid.min.css'
import 'bootstrap/dist/css/bootstrap-utilities.min.css'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
