/**
 * Pricing & Payment Gateway Page
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, Copy, Share2, AlertCircle, ArrowLeft } from 'lucide-react'
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

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 299,
    duration: 'month',
    credits: 500,
    description: 'Perfect for getting started',
    features: [
      '500 credits/month',
      'Sentiment analysis',
      'Emotion detection',
      'Email support',
      'Basic analytics'
    ]
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 499,
    duration: 'month',
    credits: 2000,
    description: 'For active users',
    recommended: true,
    features: [
      '2000 credits/month',
      'Unlimited sentiment analysis',
      'Advanced emotion detection',
      'Priority support',
      'Advanced analytics',
      'Custom reports',
      'API access'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 999,
    duration: 'month',
    credits: 10000,
    description: 'For organizations',
    features: [
      '10000 credits/month',
      'Everything in Pro',
      'Dedicated support',
      'Advanced API',
      'Custom integrations',
      'Team management',
      'Analytics dashboard'
    ]
  }
]

const paymentMethods = [
  {
    id: 'upi',
    name: 'UPI',
    icon: '📱',
    details: 'pulsetalk@paytm'
  },
  {
    id: 'card',
    name: 'Credit/Debit Card',
    icon: '💳',
    details: 'Secure payment processing'
  },
  {
    id: 'bank',
    name: 'Bank Transfer',
    icon: '🏦',
    details: 'Direct account transfer'
  }
]

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { user, api } = useAuth()

  const handleCopyUPI = () => {
    navigator.clipboard.writeText('pulsetalk@paytm')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePayment = async () => {
    if (!selectedPlan) {
      setError('Please select a plan')
      return
    }

    setError('')
    setLoading(true)

    try {
      // In production, integrate with Razorpay or similar
      // For now, we'll call a placeholder endpoint
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Call backend to activate subscription
      const response = await api.post('/auth/activate-subscription', {
        plan: selectedPlan
      })

      console.log('Subscription activated:', response.data)
      
      // Redirect to dashboard
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Payment processing failed. Please try again.')
      console.error('Payment error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-google-blue-50 via-white to-google-green-50 dark:from-dark-bg-primary dark:via-dark-bg-secondary dark:to-dark-bg-primary py-12 px-4 sm:px-6 lg:px-8">
      {/* Back Button */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          Back
        </button>
      </div>

      <motion.div
        className="max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-google-blue to-google-green bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Choose the perfect plan for your sentiment analysis needs. Upgrade or downgrade anytime.
          </p>
        </motion.div>

        {error && (
          <motion.div className="mb-8" variants={itemVariants}>
            <Alert
              variant="error"
              icon={<AlertCircle />}
              title="Error"
              message={error}
            />
          </motion.div>
        )}

        {/* Plans Grid */}
        <motion.div className="grid md:grid-cols-3 gap-8 mb-16" variants={itemVariants}>
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
              onClick={() => setSelectedPlan(plan.id)}
              className="cursor-pointer group h-full"
            >
              <Card
                className={`h-full transition-all duration-300 ${
                  selectedPlan === plan.id
                    ? 'border-2 border-google-blue ring-2 ring-google-blue/20'
                    : 'border-2 border-gray-200 dark:border-gray-700'
                } ${plan.recommended ? 'md:scale-105 md:shadow-2xl' : ''}`}
              >
                {plan.recommended && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="px-4 py-1 bg-gradient-to-r from-google-blue to-google-red text-white rounded-full text-sm font-bold">
                      RECOMMENDED
                    </span>
                  </div>
                )}

                <CardContent className="p-8">
                  {/* Plan Name */}
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">{plan.description}</p>

                  {/* Price */}
                  <div className="mb-8">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold text-google-blue">₹{plan.price}</span>
                      <span className="text-gray-600 dark:text-gray-400">/{plan.duration}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      {plan.credits.toLocaleString()} credits per month
                    </p>
                  </div>

                  {/* CTA */}
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedPlan(plan.id)
                    }}
                    className={`w-full mb-8 transition-all ${
                      selectedPlan === plan.id
                        ? 'bg-gradient-to-r from-google-blue to-google-red'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {selectedPlan === plan.id ? '✓ Selected' : 'Select Plan'}
                  </Button>

                  {/* Features */}
                  <div className="space-y-4">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Check className="text-google-green flex-shrink-0 mt-1" size={20} />
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {selectedPlan && (
          <motion.div
            className="max-w-4xl mx-auto"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <Card className="mb-8 border-2 border-google-blue dark:border-google-blue/50">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                  <span className="text-3xl">💳</span>
                  Payment Method
                </h2>

                {/* Payment Options */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  {paymentMethods.map((method) => (
                    <motion.div
                      key={method.id}
                      onClick={() => setSelectedPayment(method.id)}
                      className="cursor-pointer group"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div
                        className={`p-6 rounded-lg border-2 transition-all duration-300 ${
                          selectedPayment === method.id
                            ? 'border-google-blue bg-google-blue/10 dark:bg-google-blue/20'
                            : 'border-gray-300 dark:border-gray-600 group-hover:border-google-blue'
                        }`}
                      >
                        <div className="text-4xl mb-3">{method.icon}</div>
                        <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                          {method.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {method.details}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* UPI Details */}
                {selectedPayment === 'upi' && (
                  <motion.div
                    className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mb-8"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                      <Share2 size={20} className="text-google-blue" />
                      UPI Payment
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between bg-white dark:bg-dark-bg-secondary p-4 rounded">
                        <code className="font-mono font-bold text-google-blue">pulsetalk@paytm</code>
                        <button
                          onClick={handleCopyUPI}
                          className="text-google-blue hover:text-google-blue/80 transition-colors"
                        >
                          <Copy size={20} />
                        </button>
                      </div>
                      {copied && (
                        <p className="text-sm text-green-600">✓ Copied to clipboard</p>
                      )}
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Use any UPI app (Google Pay, Paytm, WhatsApp Pay, etc.) to send payment to this UPI ID
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Bank Transfer Details */}
                {selectedPayment === 'bank' && (
                  <motion.div
                    className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mb-8"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h3 className="font-bold mb-4">Bank Transfer Details</h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Account Holder</p>
                        <p className="font-mono font-bold">PulseTalk Solutions</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Account Number</p>
                        <p className="font-mono font-bold">1234567890123456</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">IFSC Code</p>
                        <p className="font-mono font-bold">SBIN0001234</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* QR Code for demonstration */}
                {selectedPayment === 'upi' && (
                  <motion.div
                    className="text-center mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="inline-block p-4 bg-white dark:bg-dark-bg-secondary rounded-lg">
                      <div className="w-48 h-48 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-sm text-gray-600 dark:text-gray-400">QR Code</p>
                          <p className="text-4xl mt-4">📱</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                            Scan to pay
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Order Summary */}
                <div className="bg-gray-50 dark:bg-dark-bg-secondary p-6 rounded-lg mb-8">
                  <h3 className="font-bold mb-4">Order Summary</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Plan</span>
                      <span className="font-bold">
                        {plans.find((p) => p.id === selectedPlan)?.name} Plan
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Amount</span>
                      <span className="font-bold">
                        ₹{plans.find((p) => p.id === selectedPlan)?.price}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Duration</span>
                      <span className="font-bold">1 Month</span>
                    </div>
                    <div className="border-t border-gray-300 dark:border-gray-600 pt-3 flex justify-between">
                      <span className="font-bold">Total</span>
                      <span className="font-bold text-lg text-google-blue">
                        ₹{plans.find((p) => p.id === selectedPlan)?.price}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Info Message */}
                <Alert
                  variant="info"
                  title="Please Note"
                  message={`After payment confirmation, your account will be immediately upgraded to ${plans.find((p) => p.id === selectedPlan)?.name} plan. Your current data will be preserved.`}
                />
              </CardContent>
            </Card>

            {/* Checkout Button */}
            <Button
              onClick={handlePayment}
              disabled={loading || !selectedPayment}
              className="w-full bg-gradient-to-r from-google-blue to-google-green hover:shadow-lg text-white font-bold py-4 text-lg"
            >
              {loading ? 'Processing...' : `Pay ₹${plans.find((p) => p.id === selectedPlan)?.price}`}
            </Button>

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
              Your subscription will auto-renew monthly. You can cancel anytime from your account settings.
            </p>
          </motion.div>
        )}

        {/* FAQ Section */}
        <motion.div className="mt-20 max-w-2xl mx-auto" variants={itemVariants}>
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              {
                q: 'Can I change my plan later?',
                a: 'Yes, you can upgrade or downgrade your plan anytime. Changes take effect immediately.'
              },
              {
                q: 'What happens to my data if I cancel?',
                a: 'Your data is preserved. If you resubscribe, all your historical analyses will still be available.'
              },
              {
                q: 'Are there any setup fees?',
                a: 'No, there are no hidden fees or setup charges. You only pay the monthly subscription price.'
              },
              {
                q: 'Do credits expire?',
                a: 'Monthly credits are reset each month when your subscription renews. Unused credits do not carry over.'
              }
            ].map((item, index) => (
              <div key={index} className="bg-white dark:bg-dark-bg-secondary p-6 rounded-lg">
                <h3 className="font-bold mb-2 text-gray-900 dark:text-white">{item.q}</h3>
                <p className="text-gray-600 dark:text-gray-400">{item.a}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
