/**
 * Premium Analysis Detail Page
 * Full analysis results with charts and export options
 */

import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Download,
  Trash2,
  ExternalLink,
  Clock,
  FileText,
  BarChart3,
  Sparkles,
} from 'lucide-react'
import { analysisService } from '../services/analysisService'
import Button from '../components/ui/Button'
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import { LoadingScreen } from '../components/ui/Loader'
import Alert from '../components/ui/Alert'
import Modal from '../components/ui/Modal'
import { slideUp, staggerContainer, staggerItem } from '../lib/animations'
import { formatDate } from '../lib/utils'

export default function AnalysisDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteModal, setDeleteModal] = useState(false)

  useEffect(() => {
    loadAnalysis()
  }, [id])

  const loadAnalysis = async () => {
    try {
      setLoading(true)
      const data = await analysisService.getAnalysis(id)
      setAnalysis(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load analysis')
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async (format) => {
    try {
      await analysisService.exportAnalysis(id, format)
    } catch (err) {
      alert('Export failed')
    }
  }

  const handleDelete = async () => {
    try {
      await analysisService.deleteAnalysis(id)
      navigate('/history')
    } catch (err) {
      alert('Failed to delete analysis')
    }
  }

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-google-green-50 dark:bg-google-green-900/20 text-google-green-600 dark:text-google-green-400 border-google-green-200 dark:border-google-green-800'
      case 'negative':
        return 'bg-google-red-50 dark:bg-google-red-900/20 text-google-red-600 dark:text-google-red-400 border-google-red-200 dark:border-google-red-800'
      default:
        return 'bg-gray-50 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700'
    }
  }

  if (loading) {
    return <LoadingScreen />
  }

  if (error || !analysis) {
    return (
      <div className="container-custom py-8">
        <Alert
          variant="error"
          title="Error"
          message={error || 'Analysis not found'}
        />
        <div className="mt-4">
          <Link to="/history">
            <Button variant="outline" icon={ArrowLeft}>
              Back to History
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container-custom py-8">
      <motion.div
        variants={slideUp}
        initial="initial"
        animate="animate"
        className="max-w-4xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <Link to="/history">
              <Button variant="ghost" size="sm" icon={ArrowLeft} className="mb-4">
                Back to History
              </Button>
            </Link>
            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-dark-text-primary">
              {analysis.title || 'Untitled Analysis'}
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <p className="text-sm text-gray-600 dark:text-dark-text-secondary flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formatDate(analysis.createdAt)}
              </p>
              {analysis.platform && (
                <>
                  <Badge variant={analysis.platform}>
                    {analysis.platform}
                  </Badge>
                  {analysis.sourceUrl && (
                    <a
                      href={analysis.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-google-blue-600 dark:text-google-blue-400 hover:underline flex items-center gap-1"
                    >
                      View Source <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={Download}
              onClick={() => handleExport('json')}
            >
              Export
            </Button>
            <Button
              variant="ghost"
              size="sm"
              icon={Trash2}
              onClick={() => setDeleteModal(true)}
              className="text-google-red-600 hover:text-google-red-700 hover:bg-google-red-50 dark:hover:bg-google-red-900/20"
            />
          </div>
        </div>

        {/* Input Text */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Analyzed Text
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 dark:text-dark-text-primary whitespace-pre-wrap">
              {analysis.inputText}
            </p>
          </CardContent>
        </Card>

        {/* Results */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-6"
        >
          {/* Summary */}
          {analysis.result.summary && (
            <motion.div variants={staggerItem}>
              <Card variant="glass" padding="md" className="bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-800">
                <h3 className="text-sm font-semibold text-indigo-900 dark:text-indigo-100 mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-indigo-500" />
                  AI Sentiment Summary
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {analysis.result.summary}
                </p>
              </Card>
            </motion.div>
          )}

          {/* Main Stats */}
          <motion.div variants={staggerItem} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card
              variant="glass"
              padding="md"
              className={`border-2 ${getSentimentColor(analysis.result.sentiment)}`}
            >
              <p className="text-sm font-medium mb-1">Sentiment</p>
              <p className="text-4xl font-bold capitalize mb-2">{analysis.result.sentiment}</p>
              <p className="text-sm">
                Score: {(analysis.result.sentimentScore * 100).toFixed(1)}%
              </p>
            </Card>

            <Card
              variant="glass"
              padding="md"
              className="bg-google-blue-50 dark:bg-google-blue-900/20 text-google-blue-600 dark:text-google-blue-400"
            >
              <p className="text-sm font-medium mb-1">Confidence</p>
              <p className="text-4xl font-bold mb-2">
                {(analysis.result.confidence * 100).toFixed(1)}%
              </p>
              <p className="text-sm">Analysis certainty</p>
            </Card>

            <Card
              variant="glass"
              padding="md"
              className="bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
            >
              <p className="text-sm font-medium mb-1">Dominant Emotion</p>
              <p className="text-3xl font-bold capitalize mb-2">{analysis.result.dominantEmotion}</p>
              <p className="text-sm">Primary feeling</p>
            </Card>
          </motion.div>

          {/* Emotion Breakdown */}
          <motion.div variants={staggerItem}>
            <Card variant="default">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Emotion Breakdown
                </CardTitle>
                <CardDescription>
                  Detailed analysis of emotional content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysis.result.emotions.map((emotion, index) => (
                    <motion.div
                      key={emotion.emotion}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 dark:text-dark-text-primary capitalize">
                          {emotion.emotion}
                        </span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-dark-text-primary">
                          {(emotion.score * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${emotion.score * 100}%` }}
                          transition={{ duration: 0.8, delay: index * 0.1 }}
                          className="h-full bg-gradient-to-r from-google-blue-500 via-google-green-500 to-google-yellow-500"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Metadata */}
          <motion.div variants={staggerItem}>
            <Card variant="glass">
              <CardHeader>
                <CardTitle>Analysis Metadata</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-dark-text-secondary">Analysis ID</p>
                    <p className="font-mono text-xs text-gray-900 dark:text-dark-text-primary truncate">
                      {analysis._id}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-dark-text-secondary">Source</p>
                    <p className="font-medium text-gray-900 dark:text-dark-text-primary capitalize">
                      {analysis.metadata?.source || 'Text'}
                    </p>
                  </div>
                  {analysis.metadata?.commentsAnalyzed && (
                    <div>
                      <p className="text-gray-600 dark:text-dark-text-secondary">Comments</p>
                      <p className="font-medium text-gray-900 dark:text-dark-text-primary">
                        {analysis.metadata.commentsAnalyzed} Analyzed
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-gray-600 dark:text-dark-text-secondary">Credits Used</p>
                    <p className="font-medium text-gray-900 dark:text-dark-text-primary">
                      {analysis.urlAnalysisCost || 1}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-dark-text-secondary">Created</p>
                    <p className="font-medium text-gray-900 dark:text-dark-text-primary">
                      {new Date(analysis.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Delete Analysis"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-dark-text-secondary">
            Are you sure you want to delete this analysis? This action cannot be undone.
          </p>
          <div className="flex items-center justify-end gap-3">
            <Button variant="ghost" onClick={() => setDeleteModal(false)}>
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
