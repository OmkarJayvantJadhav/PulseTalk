/**
 * Premium Dashboard Page
 * Stats cards, charts, and recent analyses with animations
 */

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  BarChart3,
  TrendingUp,
  Smile,
  Frown,
  Meh,
  Sparkles,
  ArrowRight,
  Clock,
} from 'lucide-react'
import { analysisService } from '../services/analysisService'
import SentimentChart from '../components/charts/SentimentChart'
import EmotionRadarChart from '../components/charts/EmotionRadarChart'
import TimelineChart from '../components/charts/TimelineChart'
import Button from '../components/ui/Button'
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card'
import { Spinner, SkeletonCard } from '../components/ui/Loader'
import Alert from '../components/ui/Alert'
import { staggerContainer, staggerItem } from '../lib/animations'
import { formatNumber } from '../lib/utils'

export default function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [emotionDistribution, setEmotionDistribution] = useState(null)
  const [timeline, setTimeline] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setLoading(true)
      const data = await analysisService.getStats()
      setStats(data.stats)
      setEmotionDistribution(data.emotionDistribution)
      setTimeline(data.timeline)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load statistics')
      console.error('Failed to load stats:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container-custom py-8 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded mt-2 animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container-custom py-8">
        <Alert variant="error" title="Error Loading Dashboard" message={error} />
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Analyses',
      value: stats?.total || 0,
      icon: BarChart3,
      gradient: 'from-google-blue-500 to-google-blue-600',
      bgColor: 'bg-google-blue-50 dark:bg-google-blue-900/20',
      textColor: 'text-google-blue-600 dark:text-google-blue-400',
    },
    {
      title: 'Positive',
      value: stats?.positive || 0,
      icon: Smile,
      gradient: 'from-google-green-500 to-google-green-600',
      bgColor: 'bg-google-green-50 dark:bg-google-green-900/20',
      textColor: 'text-google-green-600 dark:text-google-green-400',
    },
    {
      title: 'Negative',
      value: stats?.negative || 0,
      icon: Frown,
      gradient: 'from-google-red-500 to-google-red-600',
      bgColor: 'bg-google-red-50 dark:bg-google-red-900/20',
      textColor: 'text-google-red-600 dark:text-google-red-400',
    },
    {
      title: 'Neutral',
      value: stats?.neutral || 0,
      icon: Meh,
      gradient: 'from-gray-500 to-gray-600',
      bgColor: 'bg-gray-50 dark:bg-gray-900/20',
      textColor: 'text-gray-600 dark:text-gray-400',
    },
  ]

  return (
    <div className="container-custom py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-dark-text-primary">
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-dark-text-secondary">
              Overview of your sentiment analysis
            </p>
          </div>
          <Button
            variant="gradient"
            size="lg"
            icon={Sparkles}
            onClick={() => navigate('/analyze')}
          >
            New Analysis
          </Button>
        </div>

        {/* Stats Cards */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {statCards.map((stat, index) => (
            <motion.div key={stat.title} variants={staggerItem}>
              <Card
                variant="default"
                hover="lift"
                animated
                className="relative overflow-hidden"
              >
                {/* Background gradient */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full -mr-16 -mt-16`} />

                <CardContent className="relative">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-dark-text-secondary">
                        {stat.title}
                      </p>
                      <motion.p
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.2 }}
                        className={`text-3xl font-bold mt-2 ${stat.textColor}`}
                      >
                        {formatNumber(stat.value)}
                      </motion.p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts */}
        {stats && stats.total > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SentimentChart stats={stats} />
              <EmotionRadarChart emotionDistribution={emotionDistribution} />
            </div>

            <TimelineChart timeline={timeline} />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
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
                    Get started by creating your first sentiment analysis and unlock powerful insights
                  </p>
                  <Button
                    variant="secondary"
                    size="lg"
                    icon={ArrowRight}
                    iconPosition="right"
                    onClick={() => navigate('/analyze')}
                  >
                    Create Your First Analysis
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
