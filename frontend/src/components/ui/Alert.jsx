/**
 * Alert/Toast Component
 * For notifications and alerts
 */

import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { cn } from '../../lib/utils'

const alertVariants = {
    success: {
        icon: CheckCircle,
        className: 'bg-google-green-50 border-google-green-200 text-google-green-800 dark:bg-google-green-900/20 dark:border-google-green-800 dark:text-google-green-300',
    },
    error: {
        icon: AlertCircle,
        className: 'bg-google-red-50 border-google-red-200 text-google-red-800 dark:bg-google-red-900/20 dark:border-google-red-800 dark:text-google-red-300',
    },
    warning: {
        icon: AlertTriangle,
        className: 'bg-google-yellow-50 border-google-yellow-200 text-google-yellow-800 dark:bg-google-yellow-900/20 dark:border-google-yellow-800 dark:text-google-yellow-300',
    },
    info: {
        icon: Info,
        className: 'bg-google-blue-50 border-google-blue-200 text-google-blue-800 dark:bg-google-blue-900/20 dark:border-google-blue-800 dark:text-google-blue-300',
    },
}

export default function Alert({
    variant = 'info',
    title,
    message,
    onClose,
    className,
}) {
    const { icon: Icon, className: variantClassName } = alertVariants[variant]

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={cn(
                'flex items-start gap-3 p-4 rounded-lg border',
                variantClassName,
                className
            )}
        >
            <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
                {title && <p className="font-medium">{title}</p>}
                {message && <p className={cn('text-sm', title && 'mt-1')}>{message}</p>}
            </div>
            {onClose && (
                <button
                    onClick={onClose}
                    className="flex-shrink-0 hover:opacity-70 transition-opacity"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </motion.div>
    )
}

// Toast container for notifications
export function ToastContainer({ toasts = [], onRemove }) {
    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <Alert
                        key={toast.id}
                        variant={toast.variant}
                        title={toast.title}
                        message={toast.message}
                        onClose={() => onRemove(toast.id)}
                    />
                ))}
            </AnimatePresence>
        </div>
    )
}
