// App Constants
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Tailoring App'
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0'
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// API Endpoints
export const ENDPOINTS = {
  USERS: '/users',
  ORDERS: '/orders',
  PRODUCTS: '/products',
}

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
}

