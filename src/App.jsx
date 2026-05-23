import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/layout/ProtectedRoute'
import AppLayout from './components/layout/AppLayout'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/dashboard/Dashboard'

export default function App() {
  return (
    <Routes>
      {/* PUBLIC ROUTES (Anyone can see these) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* PROTECTED ROUTES (Locked by your Security Guard) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/applications" element={<div>Applications Page</div>} />
        </Route>
      </Route>
    </Routes>
  )
}