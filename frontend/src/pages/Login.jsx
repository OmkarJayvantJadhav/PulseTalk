/**
 * Premium Login Page
 * Glassmorphism design with animations
 */

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Sparkles, ArrowRight, Smile, Meh, Frown } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card'
import Alert from '../components/ui/Alert'
import { slideUp } from '../lib/animations'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-google-blue-50 via-white to-google-green-50 dark:from-dark-bg-primary dark:via-dark-bg-secondary dark:to-dark-bg-primary py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-google-blue-200/20 to-google-green-200/20 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        variants={slideUp}
        initial="initial"
        animate="animate"
        className="max-w-md w-full relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center gap-1 mb-4"
            >
              <Smile className="h-12 w-12 text-google-blue-500" />
              <Meh className="h-12 w-12 text-purple-500" />
              <Frown className="h-12 w-12 text-pink-500" />
            </motion.div>
          </Link>
          <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-dark-text-primary">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-dark-text-secondary">
            Sign in to continue to PulseTalk
          </p>
        </div>

        <Card variant="glass-strong" className="backdrop-blur-xl">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <Alert
                  variant="error"
                  message={error}
                  onClose={() => setError('')}
                />
              )}

              <Input
                label="Email Address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={Mail}
                placeholder="you@example.com"
                autoComplete="email"
              />

              <Input
                label="Password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={Lock}
                placeholder="••••••••"
                autoComplete="current-password"
              />

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-google-blue-500 focus:ring-google-blue-500"
                  />
                  <span className="text-gray-700 dark:text-dark-text-secondary">
                    Remember me
                  </span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-google-blue-600 dark:text-google-blue-400 hover:text-google-blue-700 dark:hover:text-google-blue-300"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                variant="gradient"
                size="lg"
                className="w-full"
                loading={loading}
                icon={ArrowRight}
                iconPosition="right"
              >
                Sign In
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-dark-text-secondary">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-medium text-google-blue-600 dark:text-google-blue-400 hover:text-google-blue-700 dark:hover:text-google-blue-300"
                >
                  Sign up for free
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Social proof */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center text-sm text-gray-600 dark:text-dark-text-secondary"
        >
          Trusted by 1000+ teams worldwide 🚀
        </motion.p>
      </motion.div>
    </div>
  )
}
