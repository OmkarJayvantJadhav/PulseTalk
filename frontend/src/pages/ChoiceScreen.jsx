/**
 * Choice Screen - After Registration
 * Users choose between Free Trial or Premium Subscription
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, Zap, Check, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'
import Card, { CardContent } from '../components/ui/Card'
import Alert from '../components/ui/Alert'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

export default function ChoiceScreen() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { api } = useAuth()

  const handleTrialClick = async () => {
    setError('')
    setLoading(true)

    try {
      const response = await api.post('/auth/activate-trial')
      console.log('Trial activated:', response.data)
      
      // Redirect to dashboard after successful trial activation
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to activate trial. Please try again.')
      console.error('Trial activation error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleProClick = () => {
    // Redirect to pricing/payment page
    navigate('/pricing')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-google-blue-50 via-white to-google-green-50 dark:from-dark-bg-primary dark:via-dark-bg-secondary dark:to-dark-bg-primary py-12 px-4 sm:px-6 lg:px-8">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 right-20 w-96 h-96 bg-google-blue-200 dark:bg-google-blue-900 rounded-full blur-3xl opacity-20"
          animate={{ y: [0, 50, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-96 h-96 bg-google-green-200 dark:bg-google-green-900 rounded-full blur-3xl opacity-20"
          animate={{ y: [0, -50, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      {/* Content */}
      <motion.div
        className="relative max-w-6xl w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <motion.h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-google-blue via-google-red to-google-green bg-clip-text text-transparent mb-4">
            Welcome to PulseTalk! 🎉
          </motion.h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Choose your path to unlock AI-powered sentiment analysis
          </p>
        </motion.div>

        {error && (
          <motion.div className="mb-8" variants={itemVariants}>
            <Alert variant="error" title="Error" message={error} />
          </motion.div>
        )}

        {/* Choice Cards */}
        <motion.div className="grid md:grid-cols-2 gap-8 mb-12" variants={itemVariants}>
          {/* Free Trial Card */}
          <motion.div
            className="group h-full"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Card className="h-full bg-white dark:bg-dark-bg-secondary border-2 border-google-green/30 group-hover:border-google-green/60 dark:border-google-green/20 dark:group-hover:border-google-green/40 transition-all duration-300 relative overflow-hidden">
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-google-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <CardContent className="p-8 relative z-10">
                <div className="mb-6">
                  <div className="w-16 h-16 rounded-full bg-google-green/10 flex items-center justify-center mb-4">
                    <Sparkles className="text-google-green" size={28} />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Free Trial
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Get started risk-free
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <Check className="text-google-green flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">100 Credits</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Analyze text and URLs</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="text-google-green flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">14 Days Access</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Full features during trial period</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="text-google-green flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">No Credit Card</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Cancel anytime, no commitment</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="text-google-green flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Sentiment Analysis</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Emotion detection & summarization</p>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-8 p-4 bg-google-green/10 rounded-lg">
                  <p className="text-2xl font-bold text-google-green mb-1">Completely Free</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    No payment required to start
                  </p>
                </div>

                {/* CTA Button */}
                <Button
                  onClick={handleTrialClick}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-google-green to-google-blue hover:shadow-lg transform group-hover:scale-105 transition-all duration-300"
                >
                  {loading ? 'Activating...' : 'Start Free Trial'}
                  {!loading && <ArrowRight size={18} className="ml-2" />}
                </Button>

                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                  Trial expires in 14 days. Upgrade anytime before expiration.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Premium Subscription Card */}
          <motion.div
            className="group h-full md:scale-105"
            whileHover={{ scale: 1.08 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Card className="h-full bg-gradient-to-br from-google-blue/10 to-google-red/10 dark:from-dark-bg-secondary dark:to-dark-bg-secondary border-2 border-google-blue/50 dark:border-google-blue/30 relative overflow-hidden shadow-xl">
              {/* Premium Badge */}
              <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-google-blue to-google-red text-white rounded-full text-xs font-bold">
                RECOMMENDED
              </div>

              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-google-blue/10 via-google-red/10 to-transparent opacity-50" />

              <CardContent className="p-8 relative z-10">
                <div className="mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-google-blue to-google-red flex items-center justify-center mb-4">
                    <Zap className="text-white" size={28} />
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-google-blue to-google-red bg-clip-text text-transparent mb-2">
                    Premium Plan
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Unlimited analysis & priority support
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <Check className="text-google-blue flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Unlimited Credits</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Analyze unlimited texts & URLs</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="text-google-blue flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Advanced Analytics</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Detailed trends & insights</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="text-google-blue flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Priority Support</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">24/7 dedicated support team</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="text-google-blue flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">API Access</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Integrate into your apps</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="text-google-blue flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Custom Reports</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Export & schedule reports</p>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-8 p-4 bg-gradient-to-r from-google-blue/20 to-google-red/20 dark:from-google-blue/10 dark:to-google-red/10 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Starting at</p>
                  <p className="text-3xl font-bold text-google-blue">₹499<span className="text-lg text-gray-600 dark:text-gray-400">/month</span></p>
                </div>

                {/* CTA Button */}
                <Button
                  onClick={handleProClick}
                  className="w-full bg-gradient-to-r from-google-blue to-google-red hover:shadow-lg transform group-hover:scale-105 transition-all duration-300"
                >
                  Go Premium
                  <ArrowRight size={18} className="ml-2" />
                </Button>

                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                  Your current account will be upgraded. No data loss.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div className="text-center" variants={itemVariants}>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Not sure? You can always upgrade to Premium later.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Have questions?{' '}
            <a href="/privacy" className="text-google-blue hover:underline font-semibold">
              Learn more
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
