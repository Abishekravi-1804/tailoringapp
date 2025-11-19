import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // API URL - Change this to your backend URL
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

  useEffect(() => {
    // Check if user is logged in on mount
    const checkAuth = async () => {
      const savedUser = localStorage.getItem('user')
      const savedToken = localStorage.getItem('token')
      const accessToken = localStorage.getItem('access_token')

      if (savedUser && (savedToken || accessToken)) {
        try {
          // Verify token with backend (AWS Cognito validation)
          const token = accessToken || savedToken
          const response = await fetch(`${API_URL}/api/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })

          if (response.ok) {
            const data = await response.json()
            // Restore user from validated token
            const userData = JSON.parse(savedUser)
            setUser(userData)
          } else {
            // Token invalid, clear storage
            logout()
          }
        } catch (error) {
          console.error('Auth check failed:', error)
          // If validation fails, still restore user (offline mode)
          setUser(JSON.parse(savedUser))
        }
      }
      
      setLoading(false)
    }

    checkAuth()
  }, [API_URL])

  /**
   * Login user with AWS Cognito
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {boolean} isAdmin - Whether this is admin login
   * @returns {Object} - { success: boolean, message?: string }
   */
  const login = async (email, password, isAdmin = false) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          password, 
          is_admin: isAdmin 
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // AWS Cognito login successful
        const userData = {
          id: data.user.sub || data.user.email,
          email: data.user.email,
          name: data.user.name,
          role: isAdmin ? 'admin' : 'user',
          email_verified: data.user.email_verified,
          token: data.tokens.access_token
        }

        // Store user data and tokens
        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('token', data.tokens.access_token)
        localStorage.setItem('access_token', data.tokens.access_token)
        localStorage.setItem('id_token', data.tokens.id_token)
        
        if (data.tokens.refresh_token) {
          localStorage.setItem('refresh_token', data.tokens.refresh_token)
        }

        return { 
          success: true,
          user: userData
        }
      } else {
        // Login failed
        return { 
          success: false, 
          message: data.message || data.detail || 'Login failed'
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { 
        success: false, 
        message: 'Network error. Please check your connection and try again.'
      }
    }
  }

  /**
   * Signup new user with AWS Cognito
   * @param {string} name - User's full name
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @param {string} phone - Optional phone number
   * @returns {Object} - { success: boolean, message?: string, needsVerification?: boolean }
   */
  const signup = async (name, email, password, phone = null) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          email, 
          password,
          phone 
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        return { 
          success: true,
          message: data.message,
          needsVerification: true, // AWS Cognito requires email verification
          user_sub: data.user_sub
        }
      } else {
        return { 
          success: false, 
          message: data.message || data.detail || 'Signup failed'
        }
      }
    } catch (error) {
      console.error('Signup error:', error)
      return { 
        success: false, 
        message: 'Network error. Please try again.'
      }
    }
  }

  /**
   * Confirm email with verification code (AWS Cognito)
   * @param {string} email - User's email
   * @param {string} confirmationCode - 6-digit verification code
   * @returns {Object} - { success: boolean, message?: string }
   */
  const confirmEmail = async (email, confirmationCode) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          confirmation_code: confirmationCode 
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        return { 
          success: true,
          message: data.message
        }
      } else {
        return { 
          success: false, 
          message: data.message || data.detail || 'Verification failed'
        }
      }
    } catch (error) {
      console.error('Confirmation error:', error)
      return { 
        success: false, 
        message: 'Network error. Please try again.'
      }
    }
  }

  /**
   * Resend verification code to email (AWS Cognito)
   * @param {string} email - User's email
   * @returns {Object} - { success: boolean, message?: string }
   */
  const resendCode = async (email) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/resend-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        return { 
          success: true,
          message: data.message
        }
      } else {
        return { 
          success: false, 
          message: data.message || data.detail || 'Failed to resend code'
        }
      }
    } catch (error) {
      console.error('Resend code error:', error)
      return { 
        success: false, 
        message: 'Network error. Please try again.'
      }
    }
  }

  /**
   * Refresh access token using refresh token (AWS Cognito)
   * @returns {boolean} - Success status
   */
  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refresh_token')
    
    if (!refreshToken) {
      logout()
      return false
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Update tokens
        localStorage.setItem('access_token', data.tokens.access_token)
        localStorage.setItem('id_token', data.tokens.id_token)
        localStorage.setItem('token', data.tokens.access_token)
        
        // Update user object with new token
        const currentUser = { ...user, token: data.tokens.access_token }
        setUser(currentUser)
        localStorage.setItem('user', JSON.stringify(currentUser))
        
        return true
      } else {
        logout()
        return false
      }
    } catch (error) {
      console.error('Token refresh error:', error)
      logout()
      return false
    }
  }

  /**
   * Logout user and clear all tokens
   */
  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('access_token')
    localStorage.removeItem('id_token')
    localStorage.removeItem('refresh_token')
  }

  /**
   * Check if current user is admin
   * @returns {boolean}
   */
  const isAdmin = () => {
    return user?.role === 'admin'
  }

  /**
   * Check if current user is regular user
   * @returns {boolean}
   */
  const isUser = () => {
    return user?.role === 'user'
  }

  /**
   * Get current user's role
   * @returns {string|null} - 'admin', 'user', or null
   */
  const getRole = () => {
    return user?.role || null
  }

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  const isAuthenticated = () => {
    return !!user && !!user.token
  }

  /**
   * Get current user's token for API calls
   * @returns {string|null}
   */
  const getToken = () => {
    return user?.token || localStorage.getItem('access_token') || null
  }

  /**
   * Make authenticated API call with automatic token refresh
   * @param {string} url - API endpoint
   * @param {Object} options - Fetch options
   * @returns {Promise<Response>}
   */
  const authenticatedFetch = async (url, options = {}) => {
    const token = getToken()
    
    if (!token) {
      throw new Error('No authentication token available')
    }

    // Add authorization header
    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    }

    try {
      let response = await fetch(url, { ...options, headers })

      // If token expired, try to refresh
      if (response.status === 401) {
        const refreshed = await refreshAccessToken()
        
        if (refreshed) {
          // Retry request with new token
          const newToken = getToken()
          headers['Authorization'] = `Bearer ${newToken}`
          response = await fetch(url, { ...options, headers })
        } else {
          throw new Error('Session expired. Please login again.')
        }
      }

      return response
    } catch (error) {
      console.error('Authenticated fetch error:', error)
      throw error
    }
  }

  const value = {
    // State
    user,
    loading,
    
    // Auth functions
    login,
    signup,
    logout,
    confirmEmail,
    resendCode,
    refreshAccessToken,
    
    // Helper functions
    isAdmin,
    isUser,
    getRole,
    isAuthenticated,
    getToken,
    authenticatedFetch
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
