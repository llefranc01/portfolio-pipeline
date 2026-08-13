import './assets/App.css'
import './assets/Home.css'
import { Routes, Route, NavLink } from 'react-router-dom'
import Resume from './pages/Resume'
import About from './pages/About'
import TechStack from './pages/TechStack'

function App() {
  return (
    <>
      <nav className="navbar">
        <div className="nav-brand">My Portfolio</div>
        <div className="nav-links">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Home</NavLink>
          <NavLink to="/TechStack" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>About</NavLink>
        </div>
      </nav>

      <main className="module">
        <Routes>
          <Route path="/" element={<Resume />} />
          <Route path="/TechStack" element={<TechStack />} />
        </Routes>
      </main>
    </>
  )
}

export default App