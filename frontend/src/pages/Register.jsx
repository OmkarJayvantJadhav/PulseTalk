/**
 * Premium Register Page
 * Glassmorphism design with animations
 */

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Sparkles, ArrowRight, Smile, Meh, Frown } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Card, { CardContent } from '../components/ui/Card'
import Alert from '../components/ui/Alert'
import { slideUp } from '../lib/animations'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await register(email, password, name)
      // Redirect to choice screen for trial or premium selection
      navigate('/choice-screen')
    } catch (err) {
      // Check for validation details
      if (err.response?.data?.details && err.response.data.details.length > 0) {
        setError(err.response.data.details[0].message)
      } else {
        setError(err.response?.data?.message || 'Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-google-green-50 via-white to-google-blue-50 dark:from-dark-bg-primary dark:via-dark-bg-secondary dark:to-dark-bg-primary py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-google-green-200/20 to-google-blue-200/20 rounded-full blur-3xl"
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
            Create Your Account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-dark-text-secondary">
            Start analyzing sentiment in minutes
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
                label="Full Name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                icon={User}
                placeholder="John Doe"
                autoComplete="name"
              />

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
                autoComplete="new-password"
                helperText="Must be 8+ chars with 1 uppercase, 1 lowercase, 1 number"
              />

              <div className="text-xs text-gray-600 dark:text-dark-text-secondary">
                By creating an account, you agree to our{' '}
                <Link to="/terms" className="text-google-blue-600 dark:text-google-blue-400 hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-google-blue-600 dark:text-google-blue-400 hover:underline">
                  Privacy Policy
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
                Create Account
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-dark-text-secondary">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-google-blue-600 dark:text-google-blue-400 hover:text-google-blue-700 dark:hover:text-google-blue-300"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 grid grid-cols-3 gap-4 text-center"
        >
          {['100 Free Credits', 'No Credit Card', 'Cancel Anytime'].map((feature) => (
            <div key={feature} className="text-xs text-gray-600 dark:text-dark-text-secondary">
              ✓ {feature}
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}
