import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/layout/ProtectedRoute'
import AppLayout from './components/layout/AppLayout'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/admin/AdminDashboard'
import UserManagement from './pages/admin/UserManagement'
import TemplateManagement from './pages/admin/TemplateManagement'
import TemplateGallery from './pages/TemplateGallery'
import CVBuilder from './pages/CVBuilder'
import MyResumes from './pages/MyResumes'
import Applications from './pages/Applications'
import Reminders from './pages/Reminders'
import LandingPage from './pages/LandingPage'

export default function App() {
  return (
    <Routes>
      {/* PUBLIC ROUTES (Anyone can see these) */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* PROTECTED ROUTES (Locked by your Security Guard) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/templates" element={<TemplateGallery />} />
          <Route path="/resumes" element={<MyResumes />} />
          <Route path="/reminders" element={<Reminders />} />
          <Route path="/cv-builder" element={<CVBuilder />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/templates" element={<TemplateManagement />} />
        </Route>
      </Route>
    </Routes>
  )
}