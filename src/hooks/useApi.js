import { useState, useEffect } from 'react'
import api from '../services/api'

/**
 * Custom hook for API calls
 * @param {string} url - API endpoint
 * @param {object} options - Request options (method, data, etc.)
 * @param {boolean} immediate - Whether to call API immediately
 */
export const useApi = (url, options = {}, immediate = true) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(immediate)
  const [error, setError] = useState(null)

  const execute = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api({
        url,
        ...options,
      })
      setData(response.data)
      return response.data
    } catch (err) {
      setError(err.response?.data || err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [url])

  return { data, loading, error, execute }
}

export default useApi

