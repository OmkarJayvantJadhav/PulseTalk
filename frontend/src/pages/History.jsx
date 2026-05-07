/**
 * Premium History Page
 * Card grid of past analyses with filters and pagination
 */

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Filter,
  Trash2,
  ExternalLink,
  Clock,
  ChevronLeft,
  ChevronRight,
  BarChart3,
} from 'lucide-react'
import { analysisService } from '../services/analysisService'
import Button from '../components/ui/Button'
import Card, { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import { Spinner, SkeletonCard } from '../components/ui/Loader'
import Alert from '../components/ui/Alert'
import Modal from '../components/ui/Modal'
import { staggerContainer, staggerItem } from '../lib/animations'
import { formatDate, truncate } from '../lib/utils'

export default function History() {
  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(null)
  const [filter, setFilter] = useState(null)
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null })

  useEffect(() => {
    loadAnalyses()
  }, [page, filter])

  const loadAnalyses = async () => {
    try {
      setLoading(true)
      const data = await analysisService.getAnalyses(page, 12, filter)
      setAnalyses(data.analyses)
      setPagination(data.pagination)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load analyses')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      await analysisService.deleteAnalysis(deleteModal.id)
      setDeleteModal({ open: false, id: null })
      loadAnalyses()
    } catch (err) {
      alert('Failed to delete analysis')
    }
  }

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return 'success'
      case 'negative':
        return 'danger'
      default:
        return 'default'
    }
  }

  if (loading && analyses.length === 0) {
    return (
      <div className="container-custom py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-dark-text-primary">
            Analysis History
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-dark-text-secondary">
            View and manage your past analyses
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container-custom py-8">
        <Alert variant="error" title="Error Loading History" message={error} />
      </div>
    )
  }

  return (
    <div className="container-custom py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-dark-text-primary">
              Analysis History
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-dark-text-secondary">
              {pagination?.total || 0} total analyses
            </p>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <select
              value={filter || ''}
              onChange={(e) => {
                setFilter(e.target.value || null)
                setPage(1)
              }}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-bg-secondary text-sm focus:ring-2 focus:ring-google-blue-500 focus:border-transparent"
            >
              <option value="">All Sentiments</option>
              <option value="positive">Positive</option>
              <option value="negative">Negative</option>
              <option value="neutral">Neutral</option>
            </select>
          </div>
        </div>

        {/* Analysis Grid */}
        {analyses.length > 0 ? (
          <>
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {analyses.map((analysis) => (
                <motion.div key={analysis._id} variants={staggerItem}>
                  <Card variant="default" hover="lift" animated className="h-full flex flex-col">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="truncate">
                            {analysis.title || 'Untitled Analysis'}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(analysis.createdAt)}
                          </CardDescription>
                        </div>
                        <Badge variant={getSentimentColor(analysis.result.sentiment)}>
                          {analysis.result.sentiment}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="flex-1">
                      {analysis.platform && (
                        <div className="mb-3">
                          <Badge variant={analysis.platform} className="text-xs">
                            {analysis.platform}
                          </Badge>
                          {analysis.sourceUrl && (
                            <a
                              href={analysis.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-2 text-xs text-google-blue-600 dark:text-google-blue-400 hover:underline inline-flex items-center gap-1"
                            >
                              Source <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      )}

                      <p className="text-sm text-gray-600 dark:text-dark-text-secondary line-clamp-3">
                        {truncate(analysis.inputText, 120)}
                      </p>

                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="text-center p-2 bg-gray-50 dark:bg-dark-bg-tertiary rounded-lg">
                          <p className="text-xs text-gray-600 dark:text-dark-text-secondary">Confidence</p>
                          <p className="text-lg font-bold text-google-blue-600 dark:text-google-blue-400">
                            {(analysis.result.confidence * 100).toFixed(0)}%
                          </p>
                        </div>
                        <div className="text-center p-2 bg-gray-50 dark:bg-dark-bg-tertiary rounded-lg">
                          <p className="text-xs text-gray-600 dark:text-dark-text-secondary">Emotion</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-dark-text-primary capitalize truncate">
                            {analysis.result.dominantEmotion}
                          </p>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="flex items-center justify-between gap-2">
                      <Link to={`/analysis/${analysis._id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          View Details
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Trash2}
                        onClick={() => setDeleteModal({ open: true, id: analysis._id })}
                        className="text-google-red-600 hover:text-google-red-700 hover:bg-google-red-50 dark:hover:bg-google-red-900/20"
                      />
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  icon={ChevronLeft}
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600 dark:text-dark-text-secondary px-4">
                  Page {page} of {pagination.pages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  icon={ChevronRight}
                  iconPosition="right"
                  onClick={() => setPage(page + 1)}
                  disabled={page === pagination.pages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <Card variant="gradient" className="text-center py-16">
            <CardContent>
              <div className="max-w-md mx-auto">
                <div className="inline-flex p-4 rounded-full bg-white/20 mb-6">
                  <BarChart3 className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  No analyses yet
                </h3>
                <p className="text-white/80 mb-8">
                  Start analyzing text or social media posts to see your history here
                </p>
                <Link to="/analyze">
                  <Button variant="secondary" size="lg">
                    Create Your First Analysis
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null })}
        title="Delete Analysis"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-dark-text-secondary">
            Are you sure you want to delete this analysis? This action cannot be undone.
          </p>
          <div className="flex items-center justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() => setDeleteModal({ open: false, id: null })}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
