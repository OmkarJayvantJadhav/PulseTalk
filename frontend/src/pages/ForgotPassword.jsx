import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft } from 'lucide-react'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Card, { CardContent } from '../components/ui/Card'
import Alert from '../components/ui/Alert'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-google-blue-50 via-white to-google-green-50 dark:from-dark-bg-primary dark:via-dark-bg-secondary dark:to-dark-bg-primary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card variant="glass-strong" className="backdrop-blur-xl">
          <CardContent className="pt-6">
            <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-dark-text-primary mb-2">
              Reset your password
            </h1>
            <p className="text-sm text-gray-600 dark:text-dark-text-secondary mb-6">
              Enter your account email and we'll send reset instructions.
            </p>

            {submitted && (
              <Alert
                variant="success"
                message="If an account exists for this email, password reset instructions have been sent."
              />
            )}

            <form onSubmit={handleSubmit} className="space-y-5 mt-4">
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

              <Button
                type="submit"
                variant="gradient"
                size="lg"
                className="w-full"
              >
                Send reset link
              </Button>
            </form>

            <div className="mt-6">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm text-google-blue-600 dark:text-google-blue-400 hover:text-google-blue-700 dark:hover:text-google-blue-300"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
