/**
 * Premium Button Component
 * Supports multiple variants, sizes, icons, and loading states
 */

import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils'
import { buttonTap } from '../../lib/animations'

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus-ring disabled:opacity-50 disabled:cursor-not-allowed',
    {
        variants: {
            variant: {
                primary: 'bg-google-blue-500 text-white hover:bg-google-blue-600 shadow-md hover:shadow-lg',
                secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-dark-bg-tertiary dark:text-dark-text-primary dark:hover:bg-gray-700',
                outline: 'border-2 border-google-blue-500 text-google-blue-500 hover:bg-google-blue-50 dark:hover:bg-google-blue-500/10',
                ghost: 'text-gray-700 hover:bg-gray-100 dark:text-dark-text-primary dark:hover:bg-dark-bg-tertiary',
                danger: 'bg-google-red-500 text-white hover:bg-google-red-600 shadow-md hover:shadow-lg',
                success: 'bg-google-green-500 text-white hover:bg-google-green-600 shadow-md hover:shadow-lg',
                gradient: 'bg-gradient-google text-white shadow-lg hover:shadow-xl animated-gradient',
            },
            size: {
                sm: 'text-sm px-3 py-1.5',
                md: 'text-sm px-4 py-2',
                lg: 'text-base px-6 py-3',
                xl: 'text-lg px-8 py-4',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'md',
        },
    }
)

export default function Button({
    children,
    variant,
    size,
    icon: Icon,
    iconPosition = 'left',
    loading = false,
    disabled = false,
    className,
    ...props
}) {
    return (
        <motion.button
            whileTap={!disabled && !loading ? buttonTap : {}}
            className={cn(buttonVariants({ variant, size }), className)}
            disabled={disabled || loading}
            {...props}
        >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {!loading && Icon && iconPosition === 'left' && <Icon className="h-4 w-4" />}
            {children}
            {!loading && Icon && iconPosition === 'right' && <Icon className="h-4 w-4" />}
        </motion.button>
    )
}
