/**
 * Premium Navbar Component
 * Sticky navbar with animations and dark mode toggle
 */

import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Sun, Moon, Sparkles, LogOut, User, BarChart3, Smile, Meh, Frown } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../theme/ThemeProvider'
import Button from '../ui/Button'
import { cn } from '../../lib/utils'

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const { user, logout } = useAuth()
    const { theme, toggleTheme } = useTheme()
    const navigate = useNavigate()
    const location = useLocation()
    
    const navigateToPath = (path) => {
        if (path.startsWith('/#')) {
            const sectionId = path.substring(2)
            if (location.pathname !== '/') {
                navigate(`/#${sectionId}`)
                return
            }

            const element = document.getElementById(sectionId)
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' })
            }
            return
        }

        navigate(path)
    }

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const navLinks = user
        ? [
            { name: 'Dashboard', path: '/dashboard', icon: BarChart3 },
            { name: 'Analyze', path: '/analyze', icon: Sparkles },
            { name: 'History', path: '/history', icon: User },
        ]
        : [
            { name: 'Features', path: '/#features' },
            { name: 'Pricing', path: '/#pricing' },
        ]

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={cn(
                'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
                isScrolled
                    ? 'bg-white/80 dark:bg-dark-bg-primary/80 backdrop-blur-lg shadow-lg'
                    : 'bg-transparent'
            )}
        >
            <div className="container-custom">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                            className="flex items-center gap-0.5"
                        >
                            <Smile className="h-6 w-6 text-google-blue-500" />
                            <Meh className="h-6 w-6 text-purple-500" />
                            <Frown className="h-6 w-6 text-pink-500" />
                        </motion.div>
                        <span className="text-xl font-bold gradient-text-blue">PulseTalk</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <button
                                key={link.path}
                                onClick={() => navigateToPath(link.path)}
                                className={cn(
                                    'text-sm font-medium transition-colors',
                                    location.pathname === link.path
                                        ? 'text-google-blue-600 dark:text-google-blue-400'
                                        : 'text-gray-700 dark:text-dark-text-primary hover:text-google-blue-600 dark:hover:text-google-blue-400'
                                )}
                            >
                                {link.name}
                            </button>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="hidden md:flex items-center gap-3">
                        {/* Theme Toggle */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={toggleTheme}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary transition-colors"
                        >
                            {theme === 'light' ? (
                                <Moon className="h-5 w-5 text-gray-700 dark:text-dark-text-primary" />
                            ) : (
                                <Sun className="h-5 w-5 text-gray-700 dark:text-dark-text-primary" />
                            )}
                        </motion.button>

                        {user ? (
                            <>
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-dark-bg-tertiary">
                                    <User className="h-4 w-4 text-gray-600 dark:text-dark-text-secondary" />
                                    <span className="text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                                        {user.analysisCredits} credits
                                    </span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    icon={LogOut}
                                    onClick={handleLogout}
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => navigate('/login')}
                                >
                                    Login
                                </Button>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => navigate('/register')}
                                >
                                    Get Started
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary"
                    >
                        {isMobileMenuOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg-secondary"
                    >
                        <div className="container-custom py-4 space-y-3">
                            {navLinks.map((link) => (
                                <button
                                    key={link.path}
                                    onClick={() => {
                                        navigateToPath(link.path)
                                        setIsMobileMenuOpen(false)
                                    }}
                                    className="block px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-dark-text-primary hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary"
                                >
                                    {link.name}
                                </button>
                            ))}
                            <div className="pt-3 border-t border-gray-200 dark:border-dark-border space-y-2">
                                <button
                                    onClick={toggleTheme}
                                    className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-dark-text-primary hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary"
                                >
                                    {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                                    {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                                </button>
                                {user ? (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        icon={LogOut}
                                        onClick={handleLogout}
                                        className="w-full"
                                    >
                                        Logout
                                    </Button>
                                ) : (
                                    <>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                navigate('/login')
                                                setIsMobileMenuOpen(false)
                                            }}
                                            className="w-full"
                                        >
                                            Login
                                        </Button>
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={() => {
                                                navigate('/register')
                                                setIsMobileMenuOpen(false)
                                            }}
                                            className="w-full"
                                        >
                                            Get Started
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    )
}
