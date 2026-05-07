/**
 * Analysis Service
 */

import api from './api'

export const analysisService = {
  /**
   * Create new analysis
   */
  async createAnalysis(text, title, description, tags) {
    const { data } = await api.post('/analysis', {
      text,
      title,
      description,
      tags
    })
    return data
  },

  /**
   * Create batch analysis
   */
  async createBatchAnalysis(texts, title) {
    const { data } = await api.post('/analysis/batch', {
      texts,
      title
    })
    return data
  },

  /**
   * Create analysis from social media URL
   */
  async createAnalysisFromUrl(url, title, description) {
    const { data } = await api.post('/analysis/url', {
      url,
      title,
      description
    })
    return data
  },

  /**
   * Get all analyses with pagination
   */
  async getAnalyses(page = 1, limit = 20, sentiment = null) {
    const params = { page, limit }
    if (sentiment) {
      params.sentiment = sentiment
    }

    const { data } = await api.get('/analysis', { params })
    return data
  },

  /**
   * Get single analysis by ID
   */
  async getAnalysis(id) {
    const { data } = await api.get(`/analysis/${id}`)
    return data.analysis
  },

  /**
   * Delete analysis
   */
  async deleteAnalysis(id) {
    const { data } = await api.delete(`/analysis/${id}`)
    return data
  },

  /**
   * Export analysis
   */
  async exportAnalysis(id, format = 'json') {
    const response = await api.get(`/analysis/${id}/export`, {
      params: { format },
      responseType: format === 'csv' ? 'blob' : 'json'
    })

    if (format === 'csv') {
      // Create download link for CSV
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `analysis-${id}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } else {
      // Return JSON data
      return response.data
    }
  },

  /**
   * Get analysis statistics
   */
  async getStats() {
    const { data } = await api.get('/analysis/stats')
    return data
  }
}
