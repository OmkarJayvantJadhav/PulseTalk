/**
 * Premium Analysis Page
 * Text and URL input with animated results
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText,
  Link as LinkIcon,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Youtube,
  Twitter,
  Instagram,
  Facebook,
  Linkedin,
  MessageCircle,
  ShoppingBag,
  Star,
} from 'lucide-react'
import { analysisService } from '../services/analysisService'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'
import Input, { Textarea } from '../components/ui/Input'
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Alert from '../components/ui/Alert'
import { slideUp, staggerContainer, staggerItem } from '../lib/animations'

export default function Analysis() {
  const [inputMode, setInputMode] = useState('text') // 'text' or 'url'
  const [text, setText] = useState('')
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)
  const [extractedText, setExtractedText] = useState(null)

  const { user } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setResult(null)
    setExtractedText(null)
    setLoading(true)

    try {
      let response
      if (inputMode === 'url') {
        response = await analysisService.createAnalysisFromUrl(url, title)
        setExtractedText(response.analysis.inputText)
      } else {
        response = await analysisService.createAnalysis(text, title)
      }

      setResult(response.analysis)
      setText('')
      setUrl('')
      setTitle('')
    } catch (err) {
      setError(err.response?.data?.message || 'Analysis failed')
    } finally {
      setLoading(false)
    }
  }

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-google-green-50 dark:bg-google-green-900/20 text-google-green-600 dark:text-google-green-400'
      case 'negative':
        return 'bg-google-red-50 dark:bg-google-red-900/20 text-google-red-600 dark:text-google-red-400'
      default:
        return 'bg-gray-50 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400'
    }
  }

  const getPlatformIcon = (platform) => {
    const icons = {
      youtube: Youtube,
      twitter: Twitter,
      instagram: Instagram,
      facebook: Facebook,
      linkedin: Linkedin,
      reddit: MessageCircle,
      tiktok: MessageCircle,
      amazon: ShoppingBag,
      reviews: Star,
      yelp: Star,
    }
    return icons[platform] || LinkIcon
  }

  const creditsRequired = inputMode === 'url' ? 3 : 1

  return (
    <div className="container-custom py-8">
      <motion.div
        variants={slideUp}
        initial="initial"
        animate="animate"
        className="max-w-4xl mx-auto space-y-6"
      >
        {/* Header */}
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-dark-text-primary">
            New Analysis
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-dark-text-secondary">
            Analyze text or social media posts for sentiment and emotions
          </p>
        </div>

        {/* Input Card */}
        <Card variant="default">
          <CardContent className="pt-6">
            {/* Tab Toggle */}
            <div className="flex space-x-1 mb-6 p-1 bg-gray-100 dark:bg-dark-bg-tertiary rounded-lg">
              <button
                type="button"
                onClick={() => setInputMode('text')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md font-medium text-sm transition-all ${inputMode === 'text'
                  ? 'bg-white dark:bg-dark-bg-secondary text-google-blue-600 dark:text-google-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-dark-text-secondary hover:text-gray-900 dark:hover:text-dark-text-primary'
                  }`}
              >
                <FileText className="h-4 w-4" />
                Text Input
              </button>
              <button
                type="button"
                onClick={() => setInputMode('url')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md font-medium text-sm transition-all ${inputMode === 'url'
                  ? 'bg-white dark:bg-dark-bg-secondary text-google-blue-600 dark:text-google-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-dark-text-secondary hover:text-gray-900 dark:hover:text-dark-text-primary'
                  }`}
              >
                <LinkIcon className="h-4 w-4" />
                Social Media URL
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Alert variant="error" message={error} onClose={() => setError(null)} />
                  </motion.div>
                )}
              </AnimatePresence>

              <Input
                label="Title (optional)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your analysis a title..."
                maxLength={200}
              />

              <AnimatePresence mode="wait">
                {inputMode === 'text' ? (
                  <motion.div
                    key="text"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <Textarea
                      label="Text to analyze *"
                      required
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      rows={8}
                      placeholder="Enter the text you want to analyze..."
                      maxLength={5000}
                    />
                    <p className="mt-2 text-sm text-gray-500 dark:text-dark-text-secondary">
                      {text.length} / 5,000 characters
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="url"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-3"
                  >
                    <Input
                      label="Social Media URL *"
                      type="url"
                      required
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      icon={LinkIcon}
                      placeholder="https://twitter.com/username/status/123..."
                    />
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs text-gray-600 dark:text-dark-text-secondary">Supported:</span>
                      {['YouTube', 'Twitter', 'Instagram', 'Reddit', 'Amazon', 'Reviews'].map((platform) => (
                        <Badge key={platform} variant="default" className="text-xs">
                          {platform}
                        </Badge>
                      ))}
                    </div>
                    <Alert
                      variant="warning"
                      message={`URL analysis costs ${creditsRequired} credits (vs 1 for text) due to content extraction`}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-dark-border">
                <div className="text-sm text-gray-600 dark:text-dark-text-secondary">
                  Credits: <span className="font-semibold text-gray-900 dark:text-dark-text-primary">{user?.analysisCredits}</span>
                  {' '} | Required: <span className="font-semibold">{creditsRequired}</span>
                </div>
                <Button
                  type="submit"
                  variant="gradient"
                  size="lg"
                  icon={Sparkles}
                  loading={loading}
                  disabled={
                    (inputMode === 'text' && !text.trim()) ||
                    (inputMode === 'url' && !url.trim()) ||
                    user?.analysisCredits < creditsRequired
                  }
                >
                  {loading ? (inputMode === 'url' ? 'Extracting & Analyzing...' : 'Analyzing...') : 'Analyze'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              exit={{ opacity: 0, y: 20 }}
            >
              <Card variant="default">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Analysis Results</CardTitle>
                      {result.platform && (
                        <div className="mt-2 flex items-center gap-2">
                          <Badge variant={result.platform} icon={getPlatformIcon(result.platform)}>
                            {result.platform.charAt(0).toUpperCase() + result.platform.slice(1)}
                          </Badge>
                          {result.sourceUrl && (
                            <a
                              href={result.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-google-blue-600 dark:text-google-blue-400 hover:underline flex items-center gap-1"
                            >
                              View Original <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={ArrowRight}
                      iconPosition="right"
                      onClick={() => navigate(`/analysis/${result._id}`)}
                    >
                      Full Details
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {extractedText && (
                    <motion.div variants={staggerItem}>
                      <Card variant="glass" padding="sm">
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-dark-text-primary mb-2">
                          Extracted Text:
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-dark-text-secondary whitespace-pre-wrap line-clamp-3">
                          {extractedText}
                        </p>
                      </Card>
                    </motion.div>
                  )}

                  {result.result.summary && (
                    <motion.div variants={staggerItem}>
                      <Card variant="glass" padding="md" className="bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-800">
                        <h3 className="text-sm font-semibold text-indigo-900 dark:text-indigo-100 mb-2 flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-indigo-500" />
                          AI Sentiment Summary
                        </h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                          {result.result.summary}
                        </p>
                      </Card>
                    </motion.div>
                  )}

                  <motion.div variants={staggerItem} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card variant="glass" padding="md" className={getSentimentColor(result.result.sentiment)}>
                      <p className="text-sm font-medium mb-1">Sentiment</p>
                      <p className="text-3xl font-bold capitalize">{result.result.sentiment}</p>
                      <p className="text-sm mt-2">
                        Score: {(result.result.sentimentScore * 100).toFixed(1)}%
                      </p>
                    </Card>

                    <Card variant="glass" padding="md" className="bg-google-blue-50 dark:bg-google-blue-900/20 text-google-blue-600 dark:text-google-blue-400">
                      <p className="text-sm font-medium mb-1">Confidence</p>
                      <p className="text-3xl font-bold">
                        {(result.result.confidence * 100).toFixed(1)}%
                      </p>
                    </Card>

                    <Card variant="glass" padding="md" className="bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
                      <p className="text-sm font-medium mb-1">Dominant Emotion</p>
                      <p className="text-3xl font-bold capitalize">{result.result.dominantEmotion}</p>
                    </Card>
                  </motion.div>

                  <motion.div variants={staggerItem}>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text-primary mb-4">
                      Emotion Breakdown
                    </h3>
                    <div className="space-y-3">
                      {result.result.emotions.map((emotion, index) => (
                        <motion.div
                          key={emotion.emotion}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-4"
                        >
                          <div className="w-28 text-sm font-medium text-gray-700 dark:text-dark-text-primary capitalize">
                            {emotion.emotion}
                          </div>
                          <div className="flex-1">
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${emotion.score * 100}%` }}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                                className="h-full bg-gradient-to-r from-google-blue-500 to-google-green-500"
                              />
                            </div>
                          </div>
                          <div className="text-sm font-medium text-gray-600 dark:text-dark-text-secondary w-14 text-right">
                            {(emotion.score * 100).toFixed(1)}%
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
