/**
 * Premium Input Component
 * Supports icons, labels, errors, and focus animations
 */

import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

export default function Input({
    label,
    error,
    icon: Icon,
    iconPosition = 'left',
    helperText,
    className,
    ...props
}) {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-primary mb-2">
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && iconPosition === 'left' && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Icon className="h-5 w-5" />
                    </div>
                )}
                <motion.input
                    whileFocus={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                        'w-full px-4 py-2.5 rounded-lg border transition-all duration-200',
                        'bg-white dark:bg-dark-bg-secondary',
                        'border-gray-300 dark:border-dark-border',
                        'text-gray-900 dark:text-dark-text-primary',
                        'placeholder:text-gray-400 dark:placeholder:text-dark-text-tertiary',
                        'focus:outline-none focus:ring-2 focus:ring-google-blue-500 focus:border-transparent',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                        error && 'border-google-red-500 focus:ring-google-red-500',
                        Icon && iconPosition === 'left' && 'pl-10',
                        Icon && iconPosition === 'right' && 'pr-10',
                        className
                    )}
                    {...props}
                />
                {Icon && iconPosition === 'right' && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Icon className="h-5 w-5" />
                    </div>
                )}
            </div>
            {helperText && !error && (
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {helperText}
                </p>
            )}
            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-google-red-500"
                >
                    {error}
                </motion.p>
            )}
        </div>
    )
}

export function Textarea({
    label,
    error,
    className,
    ...props
}) {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-primary mb-2">
                    {label}
                </label>
            )}
            <motion.textarea
                whileFocus={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
                className={cn(
                    'w-full px-4 py-2.5 rounded-lg border transition-all duration-200',
                    'bg-white dark:bg-dark-bg-secondary',
                    'border-gray-300 dark:border-dark-border',
                    'text-gray-900 dark:text-dark-text-primary',
                    'placeholder:text-gray-400 dark:placeholder:text-dark-text-tertiary',
                    'focus:outline-none focus:ring-2 focus:ring-google-blue-500 focus:border-transparent',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    'resize-none',
                    error && 'border-google-red-500 focus:ring-google-red-500',
                    className
                )}
                {...props}
            />
            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-google-red-500"
                >
                    {error}
                </motion.p>
            )}
        </div>
    )
}
