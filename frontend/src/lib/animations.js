/**
 * Framer Motion Animation Presets
 */

import { prefersReducedMotion } from './utils'

// Check if animations should be disabled
const shouldReduce = prefersReducedMotion()

/**
 * Page transition variants
 */
export const pageVariants = {
    initial: {
        opacity: 0,
        y: shouldReduce ? 0 : 20,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: shouldReduce ? 0 : 0.4,
            ease: 'easeOut',
        },
    },
    exit: {
        opacity: 0,
        y: shouldReduce ? 0 : -20,
        transition: {
            duration: shouldReduce ? 0 : 0.3,
        },
    },
}

/**
 * Fade in animation
 */
export const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
}

/**
 * Slide up animation
 */
export const slideUp = {
    initial: {
        opacity: 0,
        y: shouldReduce ? 0 : 50,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: shouldReduce ? 0 : 0.6,
            ease: [0.22, 1, 0.36, 1], // Custom easing
        },
    },
}

/**
 * Scale in animation
 */
export const scaleIn = {
    initial: {
        opacity: 0,
        scale: shouldReduce ? 1 : 0.9,
    },
    animate: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: shouldReduce ? 0 : 0.3,
            ease: 'easeOut',
        },
    },
}

/**
 * Stagger children animation
 */
export const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: shouldReduce ? 0 : 0.1,
        },
    },
}

/**
 * Stagger item animation
 */
export const staggerItem = {
    initial: {
        opacity: 0,
        y: shouldReduce ? 0 : 20,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: shouldReduce ? 0 : 0.5,
        },
    },
}

/**
 * Hover lift effect
 */
export const hoverLift = {
    rest: {
        y: 0,
        scale: 1,
    },
    hover: {
        y: shouldReduce ? 0 : -4,
        scale: shouldReduce ? 1 : 1.02,
        transition: {
            duration: 0.2,
            ease: 'easeOut',
        },
    },
}

/**
 * Button tap animation
 */
export const buttonTap = {
    scale: shouldReduce ? 1 : 0.98,
}

/**
 * Modal animation
 */
export const modalVariants = {
    hidden: {
        opacity: 0,
        scale: shouldReduce ? 1 : 0.95,
    },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: shouldReduce ? 0 : 0.2,
            ease: 'easeOut',
        },
    },
    exit: {
        opacity: 0,
        scale: shouldReduce ? 1 : 0.95,
        transition: {
            duration: shouldReduce ? 0 : 0.15,
        },
    },
}

/**
 * Backdrop animation
 */
export const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
}
