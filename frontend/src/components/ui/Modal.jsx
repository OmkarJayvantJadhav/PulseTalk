/**
 * Modal Component
 * Animated modal with backdrop
 */

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '../../lib/utils'
import { modalVariants, backdropVariants } from '../../lib/animations'

export default function Modal({
    isOpen,
    onClose,
    title,
    description,
    children,
    size = 'md',
    showClose = true,
    className,
}) {
    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <Dialog
                    as={motion.div}
                    static
                    open={isOpen}
                    onClose={onClose}
                    className="relative z-50"
                >
                    {/* Backdrop */}
                    <motion.div
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                        aria-hidden="true"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <Dialog.Panel
                            as={motion.div}
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className={cn(
                                'w-full bg-white dark:bg-dark-bg-secondary rounded-2xl shadow-2xl',
                                'border border-gray-200 dark:border-dark-border',
                                sizeClasses[size],
                                className
                            )}
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between p-6 border-b border-gray-200 dark:border-dark-border">
                                <div>
                                    {title && (
                                        <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-dark-text-primary">
                                            {title}
                                        </Dialog.Title>
                                    )}
                                    {description && (
                                        <Dialog.Description className="mt-1 text-sm text-gray-600 dark:text-dark-text-secondary">
                                            {description}
                                        </Dialog.Description>
                                    )}
                                </div>
                                {showClose && (
                                    <button
                                        onClick={onClose}
                                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-6">{children}</div>
                        </Dialog.Panel>
                    </div>
                </Dialog>
            )}
        </AnimatePresence>
    )
}
