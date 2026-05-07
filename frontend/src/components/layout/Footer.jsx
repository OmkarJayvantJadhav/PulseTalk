/**
 * Premium Footer Component
 */

import { Link } from 'react-router-dom'
import { Sparkles, Twitter, Github, Linkedin, Mail, Smile, Meh, Frown } from 'lucide-react'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    const footerLinks = {
        Product: [
            { name: 'Features', href: '/#features' },
            { name: 'Pricing', href: '/#pricing' },
            { name: 'API', href: '/api' },
        ],
        Company: [
            { name: 'About', href: '/about' },
            { name: 'Blog', href: '/blog' },
            { name: 'Careers', href: '/careers' },
        ],
        Legal: [
            { name: 'Privacy', href: '/privacy' },
            { name: 'Terms', href: '/terms' },
            { name: 'Security', href: '/security' },
        ],
    }

    const socialLinks = [
        { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
        { icon: Github, href: 'https://github.com', label: 'GitHub' },
        { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
        { icon: Mail, href: 'mailto:hello@pulsetalk.com', label: 'Email' },
    ]

    return (
        <footer className="bg-gray-50 dark:bg-dark-bg-secondary border-t border-gray-200 dark:border-dark-border">
            <div className="container-custom py-12">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                    {/* Brand */}
                    <div className="col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex items-center gap-0.5">
                                <Smile className="h-6 w-6 text-google-blue-500" />
                                <Meh className="h-6 w-6 text-purple-500" />
                                <Frown className="h-6 w-6 text-pink-500" />
                            </div>
                            <span className="text-xl font-bold gradient-text-blue">PulseTalk</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-dark-text-secondary mb-4">
                            AI-powered sentiment analysis for modern teams. Understand emotions, improve communication.
                        </p>
                        <div className="flex items-center gap-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-bg-tertiary transition-colors"
                                    aria-label={social.label}
                                >
                                    <social.icon className="h-5 w-5 text-gray-600 dark:text-dark-text-secondary" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category}>
                            <h3 className="font-semibold text-gray-900 dark:text-dark-text-primary mb-3">
                                {category}
                            </h3>
                            <ul className="space-y-2">
                                {links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            to={link.href}
                                            className="text-sm text-gray-600 dark:text-dark-text-secondary hover:text-google-blue-600 dark:hover:text-google-blue-400 transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom */}
                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-dark-border">
                    <p className="text-center text-sm text-gray-600 dark:text-dark-text-secondary">
                        © {currentYear} PulseTalk. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}
