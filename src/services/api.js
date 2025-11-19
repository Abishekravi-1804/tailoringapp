import axios from 'axios'

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    console.log('API Request:', config.method.toUpperCase(), config.url, config.data); // Debug
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Handle responses
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data); // Debug
    return response
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data); // Debug
    
    if (error.response?.status === 401) {
      // Unauthorized - clear auth and redirect to login
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    
    return Promise.reject(error)
  }
)

export default api