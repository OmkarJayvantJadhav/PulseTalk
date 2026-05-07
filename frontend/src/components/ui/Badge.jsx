/**
 * Badge Component
 * For platform badges, status indicators, etc.
 */

import { motion } from 'framer-motion'
import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const badgeVariants = cva(
    'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors',
    {
        variants: {
            variant: {
                default: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
                primary: 'bg-google-blue-100 text-google-blue-800 dark:bg-google-blue-900/30 dark:text-google-blue-300',
                success: 'bg-google-green-100 text-google-green-800 dark:bg-google-green-900/30 dark:text-google-green-300',
                danger: 'bg-google-red-100 text-google-red-800 dark:bg-google-red-900/30 dark:text-google-red-300',
                warning: 'bg-google-yellow-100 text-google-yellow-800 dark:bg-google-yellow-900/30 dark:text-google-yellow-300',
                // Platform-specific
                youtube: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
                twitter: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
                instagram: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
                facebook: 'bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-200',
                reddit: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
                linkedin: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
                tiktok: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
                amazon: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
                reviews: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
                'review-site': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
)

export default function Badge({
    children,
    variant,
    icon: Icon,
    animated = false,
    className,
    ...props
}) {
    const Component = animated ? motion.span : 'span'
    const motionProps = animated
        ? {
            initial: { scale: 0.8, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            transition: { duration: 0.2 },
        }
        : {}

    return (
        <Component
            className={cn(badgeVariants({ variant }), className)}
            {...motionProps}
            {...props}
        >
            {Icon && <Icon className="h-3 w-3" />}
            {children}
        </Component>
    )
}
