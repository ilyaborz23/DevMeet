import { Link, NavLink, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import MeetingsPage from './pages/MeetingsPage'
import AddMeetingPage from './pages/AddMeetingPage'
import EditMeetingPage from './pages/EditMeetingPage'

function App() {
  return (
    <>
      <header className="header">
        <Link to="/" className="wordmark" aria-label="DevMeet home">
          <span className="wordmark-mark" aria-hidden="true" />
          DevMeet
        </Link>
        <nav className="nav" aria-label="Main">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/meetings">Schedule</NavLink>
          <NavLink to="/add">New meeting</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>
      </header>

      <main className="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/meetings" element={<MeetingsPage />} />
          <Route path="/add" element={<AddMeetingPage />} />
          <Route path="/edit/:id" element={<EditMeetingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route
            path="*"
            element={
              <section className="not-found">
                <p className="overline">Error 404</p>
                <h1>This slot is empty.</h1>
                <Link to="/" className="button">Back home</Link>
              </section>
            }
          />
        </Routes>
      </main>

      <footer className="footer">
        <span>DevMeet — meetings on schedule</span>
        <span>Built by Ilya Borzyh · 2026</span>
      </footer>
    </>
  )
}

export default App
