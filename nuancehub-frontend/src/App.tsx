import { Link, BrowserRouter, Routes, Route } from 'react-router-dom'
// @ts-ignore
import Login from './pages/auth/Login'
// TypeScript: this JSX module has no declaration file; ignore the type-check for this import
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Register from './pages/auth/Register'
import './App.css'



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <>
            <h1>Welcome Hub Tect</h1>
            <div className="card">
              <button>
                <Link to="/login">Login</Link>
              </button>
              <button>
                <Link to="/register">Register</Link>
              </button>
            </div>
          </>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
