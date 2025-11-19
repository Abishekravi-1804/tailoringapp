import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading, isAdmin } = useAuth()

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // If not logged in, redirect to appropriate login page
  if (!user) {
    return <Navigate to={requireAdmin ? "/admin/login" : "/login"} replace />
  }

  // If admin route is required but user is not admin
  if (requireAdmin && !isAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
          <div className="text-red-500 text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            You do not have permission to access this page. Admin privileges required.
          </p>
          <Navigate to="/user/dashboard" replace />
        </div>
      </div>
    )
  }

  // If user is trying to access admin routes
  if (!requireAdmin && isAdmin()) {
    // Optionally redirect admins to admin dashboard
    // return <Navigate to="/admin/orders" replace />
  }

  return children
}

export default ProtectedRoute