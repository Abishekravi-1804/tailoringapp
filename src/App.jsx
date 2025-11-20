import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home/Home'
import About from './pages/About/About'
import Orders from './pages/Orders/Orders'
import UserLogin from './pages/auth/UserLogin'
import AdminLogin from './pages/auth/AdminLogin'
import Dashboard from './pages/User/Dashboard'
import Menu from './pages/User/Menu'
import TailorProfile from './pages/User/TailorProfile'
import Signup from './pages/auth/Signup'
import VerifyEmail from './pages/auth/VerifyEmail'
import UserProfile from './pages/User/UserProfile'
import './styles/App.css'

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/about" element={<Layout><About /></Layout>} />
            <Route path="/login" element={<UserLogin />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/user/menu" element={<Layout><Menu /></Layout>} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/user/profile" element={<UserProfile />} />

            {/* User Protected Routes (requireAdmin = false) */}
            <Route 
              path="/user/dashboard" 
              element={
                <ProtectedRoute requireAdmin={false}>
                  <Layout><Dashboard /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute requireAdmin={false}>
                  <Layout><TailorProfile /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/user/orders" 
              element={
                <ProtectedRoute requireAdmin={false}>
                  <Layout><Orders /></Layout>
                </ProtectedRoute>
              } 
            />
            
            {/* Admin Protected Routes (requireAdmin = true) */}
            <Route 
              path="/admin/orders" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <Layout><Orders /></Layout>
                </ProtectedRoute>
              } 
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  )
}

export default App