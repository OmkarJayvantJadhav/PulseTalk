/**
 * Premium Landing Page
 * Hero, Features, Pricing, CTA sections with animations
 */

import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
    Sparkles,
    Zap,
    Shield,
    TrendingUp,
    MessageSquare,
    BarChart3,
    Globe,
    Check,
    ArrowRight,
    Star,
} from 'lucide-react'
import Button from '../components/ui/Button'
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import { staggerContainer, staggerItem, slideUp } from '../lib/animations'

export default function Landing() {
    const navigate = useNavigate()
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-white via-google-blue-50 to-google-green-50 dark:from-dark-bg-primary dark:via-google-blue-900/10 dark:to-google-green-900/10 pt-32 pb-20">
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
                    <motion.div
                        animate={{
                            scale: [1.2, 1, 1.2],
                            rotate: [90, 0, 90],
                        }}
                        transition={{ duration: 20, repeat: Infinity }}
                        className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-google-red-200/20 to-google-yellow-200/20 rounded-full blur-3xl"
                    />
                </div>

                <div className="container-custom relative z-10">
                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        animate="animate"
                        className="max-w-4xl mx-auto text-center"
                    >
                        {/* Badge */}
                        <motion.div variants={staggerItem} className="flex justify-center mb-6">
                            <Badge variant="primary" animated className="text-sm px-4 py-2">
                            
                                AI-Powered Sentiment Analysis
                            </Badge>
                        </motion.div>

                        {/* Headline */}
                        <motion.h1
                            variants={staggerItem}
                            className="text-display-lg md:text-display-xl font-display font-bold text-gray-900 dark:text-dark-text-primary mb-6 text-balance"
                        >
                            Understand{' '}
                            <span className="gradient-text">Every Emotion</span>
                            {' '}Behind Your Content
                        </motion.h1>

                        {/* Subheadline */}
                        <motion.p
                            variants={staggerItem}
                            className="text-xl text-gray-600 dark:text-dark-text-secondary mb-8 max-w-2xl mx-auto"
                        >
                            Analyze sentiment from text and social media with cutting-edge AI.
                            Make data-driven decisions with confidence.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            variants={staggerItem}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        >
                            <Button
                                variant="gradient"
                                size="xl"
                                onClick={() => navigate('/register')}
                            >
                                Start Free Trial
                            </Button>
                            <Button
                                variant="outline"
                                size="xl"
                                icon={ArrowRight}
                                iconPosition="right"
                                onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                            >
                                See How It Works
                            </Button>
                        </motion.div>

                        {/* Social Proof */}
                        <motion.div
                            variants={staggerItem}
                            className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-600 dark:text-dark-text-secondary"
                        >
                            <div className="flex items-center gap-2">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map((i) => (
                                        <div
                                            key={i}
                                            className="h-8 w-8 rounded-full bg-gradient-google border-2 border-white dark:border-dark-bg-primary"
                                        />
                                    ))}
                                </div>
                                <span>1000+ happy users</span>
                            </div>
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Star key={i} className="h-4 w-4 fill-google-yellow-500 text-google-yellow-500" />
                                ))}
                                <span className="ml-1">4.9/5 rating</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="section-padding bg-white dark:bg-dark-bg-primary">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <Badge variant="primary" className="mb-4">Features</Badge>
                        <h2 className="text-display-md font-display font-bold text-gray-900 dark:text-dark-text-primary mb-4">
                            Everything You Need to Understand Sentiment
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-dark-text-secondary max-w-2xl mx-auto">
                            Powerful features designed for startups, marketers, and enterprises
                        </p>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {features.map((feature, index) => (
                            <motion.div key={feature.title} variants={staggerItem}>
                                <Card
                                    variant="default"
                                    hover="lift"
                                    animated
                                    className="h-full"
                                >
                                    <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${feature.gradient} mb-4`}>
                                        <feature.icon className="h-6 w-6 text-white" />
                                    </div>
                                    <CardHeader>
                                        <CardTitle>{feature.title}</CardTitle>
                                        <CardDescription>{feature.description}</CardDescription>
                                    </CardHeader>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="section-padding bg-gray-50 dark:bg-dark-bg-secondary">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <Badge variant="success" className="mb-4">Pricing</Badge>
                        <h2 className="text-display-md font-display font-bold text-gray-900 dark:text-dark-text-primary mb-4">
                            Simple, Transparent Pricing
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-dark-text-secondary max-w-2xl mx-auto">
                            Choose the plan that fits your needs. All plans include core features.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
                    >
                        {pricingPlans.map((plan, index) => (
                            <motion.div key={plan.name} variants={staggerItem}>
                                <Card
                                    variant={plan.popular ? 'gradient' : 'default'}
                                    hover="lift"
                                    animated
                                    className={`h-full relative ${plan.popular ? 'border-2 border-google-blue-500' : ''}`}
                                >
                                    {plan.popular && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                            <Badge variant="primary">Most Popular</Badge>
                                        </div>
                                    )}
                                    <CardHeader>
                                        <CardTitle className={plan.popular ? 'text-gray' : ''}>
                                            {plan.name}
                                        </CardTitle>
                                        <div className="mt-4">
                                            <span className={`text-4xl font-bold ${plan.popular ? 'text-gray' : 'text-gray-900 dark:text-dark-text-primary'}`}>
                                                ${plan.price}
                                            </span>
                                            <span className={plan.popular ? 'text-white/80' : 'text-gray-600 dark:text-dark-text-secondary'}>
                                                /month
                                            </span>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-3 mb-6 text-gray">
                                            {plan.features.map((feature) => (
                                                <li key={feature} className="flex items-start gap-2 text-gray">
                                                    <Check className={`h-5 w-5 flex-shrink-0 ${plan.popular ? 'text-gray' : 'text-google-green-500'}`} />
                                                    <span className={`text-sm ${plan.popular ? 'text-gray/90' : 'text-gray-600 dark:text-dark-text-secondary'}`}>
                                                        {feature}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                        <Button
                                            variant={plan.popular ? 'secondary' : 'primary'}
                                            size="lg"
                                            className="w-full"
                                            onClick={() => navigate('/register')}
                                        >
                                            Get Started
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="section-padding bg-gradient-google relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEyYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMTIgMTJjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
                <div className="container-custom relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="max-w-3xl mx-auto text-center text-white"
                    >
                        <h2 className="text-display-md font-display font-bold mb-4">
                            Ready to Understand Your Audience?
                        </h2>
                        <p className="text-xl mb-8 text-white/90">
                            Join thousands of teams using PulseTalk to make better decisions with sentiment analysis.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button
                                variant="secondary"
                                size="xl"
                                
                                onClick={() => navigate('/register')}
                            >
                                Start Free Trial
                            </Button>
                            <Button
                                variant="ghost"
                                size="xl"
                                className="text-white hover:bg-white/10"
                                onClick={() => navigate('/login')}
                            >
                                Sign In
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}

// Features data
const features = [
    {
        icon: MessageSquare,
        title: 'Text Analysis',
        description: 'Analyze any text for sentiment and emotions with advanced AI models.',
        gradient: 'from-google-blue-500 to-google-blue-600',
    },
    {
        icon: Globe,
        title: 'Social Media Integration',
        description: 'Extract and analyze content from YouTube, Twitter, Instagram, and more.',
        gradient: 'from-google-red-500 to-google-red-600',
    },
    {
        icon: BarChart3,
        title: 'Real-time Analytics',
        description: 'Get instant insights with beautiful charts and detailed breakdowns.',
        gradient: 'from-google-yellow-500 to-google-yellow-600',
    },
    {
        icon: Zap,
        title: 'Lightning Fast',
        description: 'Process thousands of texts in seconds with our optimized infrastructure.',
        gradient: 'from-google-green-500 to-google-green-600',
    },
    {
        icon: Shield,
        title: 'Enterprise Security',
        description: 'Your data is encrypted and secure with industry-standard protocols.',
        gradient: 'from-google-blue-600 to-google-blue-700',
    },
    {
        icon: TrendingUp,
        title: 'Historical Tracking',
        description: 'Track sentiment trends over time and identify patterns.',
        gradient: 'from-google-red-600 to-google-red-700',
    },
]

// Pricing plans
const pricingPlans = [
    {
        name: 'Starter',
        price: 0,
        popular: false,
        features: [
            '100 analyses per month',
            'Text analysis',
            'Basic sentiment detection',
            'Email support',
            'API access',
        ],
    },
    {
        name: 'Professional',
        price: 29,
        popular: true,
        features: [
            '1,000 analyses per month',
            'Text + URL analysis',
            'Advanced emotion detection',
            'Priority support',
            'API access',
            'Export data',
            'Team collaboration',
        ],
    },
    {
        name: 'Enterprise',
        price: 99,
        popular: false,
        features: [
            'Unlimited analyses',
            'All analysis types',
            'Custom AI models',
            '24/7 dedicated support',
            'Advanced API',
            'Custom integrations',
            'SLA guarantee',
            'White-label option',
        ],
    },
]
