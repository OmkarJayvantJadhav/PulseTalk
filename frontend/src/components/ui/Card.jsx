/**
 * Premium Card Component
 * Supports glassmorphism, hover effects, and animations
 */

import { motion } from 'framer-motion'
import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils'
import { hoverLift } from '../../lib/animations'

const cardVariants = cva(
    'rounded-xl transition-all duration-300',
    {
        variants: {
            variant: {
                default: 'bg-white dark:bg-dark-bg-secondary border border-gray-200 dark:border-dark-border shadow-sm',
                glass: 'glass',
                'glass-strong': 'glass-strong',
                gradient: 'bg-gradient-to-br from-google-blue-50 to-google-green-50 dark:from-google-blue-900/20 dark:to-google-green-900/20 border border-google-blue-200 dark:border-google-blue-800',
            },
            padding: {
                none: '',
                sm: 'p-4',
                md: 'p-6',
                lg: 'p-8',
            },
            hover: {
                none: '',
                lift: 'hover:shadow-xl hover:-translate-y-1',
                glow: 'hover:shadow-glow-blue',
                scale: 'hover:scale-[1.02]',
            },
        },
        defaultVariants: {
            variant: 'default',
            padding: 'md',
            hover: 'none',
        },
    }
)

export default function Card({
    children,
    variant,
    padding,
    hover,
    animated = false,
    className,
    ...props
}) {
    const Component = animated ? motion.div : 'div'
    const motionProps = animated
        ? {
            initial: hoverLift.rest,
            whileHover: hover === 'lift' ? hoverLift.hover : {},
        }
        : {}

    return (
        <Component
            className={cn(cardVariants({ variant, padding, hover }), className)}
            {...motionProps}
            {...props}
        >
            {children}
        </Component>
    )
}

export function CardHeader({ children, className, ...props }) {
    return (
        <div className={cn('mb-4', className)} {...props}>
            {children}
        </div>
    )
}

export function CardTitle({ children, className, ...props }) {
    return (
        <h3 className={cn('text-lg font-semibold text-gray-900 dark:text-dark-text-primary', className)} {...props}>
            {children}
        </h3>
    )
}

export function CardDescription({ children, className, ...props }) {
    return (
        <p className={cn('text-sm text-gray-600 dark:text-dark-text-secondary', className)} {...props}>
            {children}
        </p>
    )
}

export function CardContent({ children, className, ...props }) {
    return (
        <div className={cn('', className)} {...props}>
            {children}
        </div>
    )
}

export function CardFooter({ children, className, ...props }) {
    return (
        <div className={cn('mt-4 flex items-center gap-2', className)} {...props}>
            {children}
        </div>
    )
}
