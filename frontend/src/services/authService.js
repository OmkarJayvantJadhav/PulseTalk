/**
 * Authentication Service
 */

import api from './api'

export const authService = {
  /**
   * Register new user
   */
  async register(email, password, name) {
    const { data } = await api.post('/auth/register', {
      email,
      password,
      name
    })
    
    // Store access token
    if (data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken)
    }
    
    return data
  },

  /**
   * Login user
   */
  async login(email, password) {
    const { data } = await api.post('/auth/login', {
      email,
      password
    })
    
    // Store access token
    if (data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken)
    }
    
    return data
  },

  /**
   * Logout user
   */
  async logout() {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      // Continue with logout even if request fails
      console.error('Logout error:', error)
    } finally {
      // Clear local storage
      localStorage.removeItem('accessToken')
    }
  },

  /**
   * Get current user info
   */
  async getCurrentUser() {
    const { data } = await api.get('/auth/me')
    return data.user
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!localStorage.getItem('accessToken')
  }
}
