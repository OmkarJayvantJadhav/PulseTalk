/**
 * Loading Components
 * Spinner, Skeleton, and Loading states
 */

import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/utils'

export function Spinner({ size = 'md', className }) {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
        xl: 'h-12 w-12',
    }

    return (
        <Loader2
            className={cn('animate-spin text-google-blue-500', sizeClasses[size], className)}
        />
    )
}

export function LoadingDots({ className }) {
    return (
        <div className={cn('flex items-center gap-1', className)}>
            {[0, 1, 2].map((i) => (
                <motion.div
                    key={i}
                    className="h-2 w-2 rounded-full bg-google-blue-500"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2,
                    }}
                />
            ))}
        </div>
    )
}

export function Skeleton({ className, ...props }) {
    return (
        <div
            className={cn(
                'animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800',
                className
            )}
            {...props}
        />
    )
}

export function SkeletonCard() {
    return (
        <div className="bg-white dark:bg-dark-bg-secondary rounded-xl p-6 border border-gray-200 dark:border-dark-border">
            <Skeleton className="h-6 w-3/4 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6 mb-4" />
            <div className="flex gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
            </div>
        </div>
    )
}

export function LoadingScreen({ message = 'Loading...' }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <Spinner size="xl" />
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-4 text-gray-600 dark:text-dark-text-secondary"
            >
                {message}
            </motion.p>
        </div>
    )
}
