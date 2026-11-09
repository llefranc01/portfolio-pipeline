import './assets/App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import SiteNav from './components/SiteNav'
import { ROUTES } from './routes'
import Resume from './pages/Resume'
import TechStack from './pages/TechStack'

function App() {
  return (
    <>
      <SiteNav />

      <main id="main" className="site-main" tabIndex={-1}>
        <Routes>
          <Route path={ROUTES.resume} element={<Resume />} />
          <Route path={ROUTES.stack} element={<TechStack />} />
          {/* Old path kept working for any links already shared. */}
          <Route path="/TechStack" element={<Navigate to={ROUTES.stack} replace />} />
          <Route path="*" element={<Navigate to={ROUTES.resume} replace />} />
        </Routes>
      </main>
    </>
  )
}

export default App
