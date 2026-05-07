/**
 * API Service - Axios-based HTTP client for backend communication
 */

import axios from 'axios'

const resolveApiUrl = () => {
  const raw = (import.meta.env.VITE_API_URL || '').trim()
  const fallback = 'http://localhost:5000/api'

  if (!raw) return fallback

  // Allow users to provide either backend base URL or full /api URL.
  return raw.endsWith('/api') ? raw : `${raw.replace(/\/+$/, '')}/api`
}

const API_URL = resolveApiUrl()

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 300000,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Enable cookies for refresh tokens
})

// Request interceptor - add access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Try to refresh the token
        const { data } = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        )

        // Store new access token
        localStorage.setItem('accessToken', data.accessToken)

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        // Refresh failed - clear tokens and redirect to login
        localStorage.removeItem('accessToken')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api
