"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo, LanguageSwitcher, Button, AnimatedText } from '@/components';
import { useLanguage } from '@/context/LanguageContext';

interface NavbarProps {
    variant?: 'default' | 'solid';
    className?: string;
    showDropdown?: boolean;
    activeTab?: string;
}

export default function Navbar({
    variant = 'default',
    className = '',
    showDropdown = true,
    activeTab
}: NavbarProps) {
    const { t } = useLanguage();
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Check for dark mode on mount
    useEffect(() => {
        const darkMode = localStorage.getItem('darkMode') === 'true';
        setIsDarkMode(darkMode);
        if (darkMode) {
            document.documentElement.classList.add('dark');
        }
    }, []);

    // Toggle dark mode
    const toggleDarkMode = () => {
        const newDarkMode = !isDarkMode;
        setIsDarkMode(newDarkMode);
        localStorage.setItem('darkMode', newDarkMode.toString());
        
        if (newDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    // Determine active tab based on current path or prop
    const currentTab = activeTab || (() => {
        if (pathname === '/') return 'home';
        if (pathname.startsWith('/about')) return 'about';
        if (pathname.startsWith('/services')) return 'services';
        if (pathname.startsWith('/portfolio')) return 'portfolio';
        if (pathname.startsWith('/blog')) return 'blog';
        return '';
    })();

    // Get navbar styles based on variant
    const getNavbarStyles = () => {
        switch (variant) {
            case 'solid':
                return 'bg-white dark:bg-gray-800 shadow-sm';
            default:
                return 'bg-[var(--navbar-background)] dark:bg-gray-800/95 shadow-sm backdrop-blur-sm';
        }
    };

    // Get text color classes for navigation links
    const getLinkStyles = (isActive: boolean) => {
        return isActive
            ? 'text-green-500'
            : 'text-white-700 dark:text-white-300 hover:text-green-500';
    };

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 py-3 md:py-4 transition-colors duration-300 border-b border-gray-100/50 dark:border-gray-700/50 ${getNavbarStyles()} ${className}`}>
            <div className="w-full max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8">
                <div className="flex items-center">
                    <Logo size="md" />
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-7">
                    <nav className="flex space-x-6 md:space-x-8">
                        <AnimatedText as="span">
                            <Link
                                href="/"
                                className={`transition-colors duration-300 text-[15px] font-medium ${getLinkStyles(currentTab === 'home')}`}
                            >
                                {t('nav.home')}
                            </Link>
                        </AnimatedText>

                        <AnimatedText as="span">
                            <Link
                                href="/about"
                                className={`transition-colors duration-300 text-[15px] font-medium ${getLinkStyles(currentTab === 'about')}`}
                            >
                                {t('nav.about')}
                            </Link>
                        </AnimatedText>

                        <AnimatedText as="span">
                            <div className="relative group">
                                <Link
                                    href="/services"
                                    className={`transition-colors duration-300 text-[15px] font-medium relative group flex items-center ${getLinkStyles(currentTab === 'services')}`}
                                >
                                    {t('nav.services')}
                                    {showDropdown && (
                                        <span className="inline-block ml-1 transform group-hover:rotate-180 transition-transform duration-200">
                                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </span>
                                    )}
                                </Link>

                                {/* Dropdown Menu */}
                                {showDropdown && (
                                    <div className="navbar-services-dropdown">
                                        <div className="p-2">
                                            <Link
                                                href="/services/web-development"
                                                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm">
                                                    🌐
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900 dark:text-white text-sm">Web Development</div>
                                                    <div className="text-gray-500 dark:text-gray-400 text-xs">Website modern & responsif</div>
                                                </div>
                                            </Link>

                                            <Link
                                                href="/services/aset-game-development"
                                                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center text-white text-sm">
                                                    🎮
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900 dark:text-white text-sm">Aset Game Development</div>
                                                    <div className="text-gray-500 dark:text-gray-400 text-xs">Assets & character untuk game</div>
                                                </div>
                                            </Link>

                                            <Link
                                                href="/services/uiux-design"
                                                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center text-white text-sm">
                                                    🎨
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900 dark:text-white text-sm">UI/UX Design</div>
                                                    <div className="text-gray-500 dark:text-gray-400 text-xs">Interface yang memukau</div>
                                                </div>
                                            </Link>

                                            <Link
                                                href="/services/mobile-apps"
                                                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-teal-500 to-teal-600 flex items-center justify-center text-white text-sm">
                                                    📱
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900 dark:text-white text-sm">Mobile App Development</div>
                                                    <div className="text-gray-500 dark:text-gray-400 text-xs">Aplikasi iOS & Android</div>
                                                </div>
                                            </Link>

                                            <Link
                                                href="/services/sistem-development"
                                                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white text-sm">
                                                    ⚙️
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900 dark:text-white text-sm">Sistem Development</div>
                                                    <div className="text-gray-500 dark:text-gray-400 text-xs">Enterprise & custom system</div>
                                                </div>
                                            </Link>

                                            <Link
                                                href="/services/sosial-media-management"
                                                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center text-white text-sm">
                                                    📱
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900 dark:text-white text-sm">Social Media Management</div>
                                                    <div className="text-gray-500 dark:text-gray-400 text-xs">Kelola media sosial bisnis</div>
                                                </div>
                                            </Link>

                                            <div className="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2">
                                                <Link
                                                    href="/services"
                                                    className="flex items-center justify-center px-3 py-2 rounded-lg bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors duration-200"
                                                >
                                                    <span className="text-green-600 dark:text-green-400 font-medium text-sm">Lihat Semua Layanan</span>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </AnimatedText>

                        <AnimatedText as="span">
                            <Link
                                href="/portfolio"
                                className={`transition-colors duration-300 text-[15px] font-medium ${getLinkStyles(currentTab === 'portfolio')}`}
                            >
                                {t('nav.portfolio')}
                            </Link>
                        </AnimatedText>

                        <AnimatedText as="span">
                            <Link
                                href="/blog"
                                className={`transition-colors duration-300 text-[15px] font-medium ${getLinkStyles(currentTab === 'blog')}`}
                            >
                                {t('nav.blog')}
                            </Link>
                        </AnimatedText>
                    </nav>

                    <LanguageSwitcher className="mr-4 text-white-700 dark:text-white-300" />

                    {/* Dark Mode Toggle */}
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-lg text-white-700 dark:text-white-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mr-4"
                        aria-label="Toggle dark mode"
                    >
                        {isDarkMode ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                        )}
                    </button>

                    <AnimatedText as="span">
                        <Button
                            variant="primary"
                            size="sm"
                            className="px-5 py-2 rounded-md font-medium shadow-sm hover:shadow-lg hover:bg-green-600 transition-all duration-300"
                        >
                            <Link href="https://wa.me/6285739402436?text=Halo%20Bajramedia!%20Saya%20ingin%20berkonsultasi%20tentang%20layanan%20digital.%20Bisa%20dibantu?" target="_blank">{t('nav.contact')}</Link>
                        </Button>
                    </AnimatedText>
                </div>

                {/* Mobile Menu Button */}
                <div className="flex items-center space-x-4 md:hidden">
                    <LanguageSwitcher className="text-foreground" />
                    
                    {/* Dark Mode Toggle for Mobile */}
                    <button
                        onClick={toggleDarkMode}
                        className="text-foreground p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        aria-label="Toggle dark mode"
                    >
                        {isDarkMode ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                        )}
                    </button>
                    
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="text-foreground p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen
                ? 'max-h-96 opacity-100'
                : 'max-h-0 opacity-0 overflow-hidden'
                } bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700`}>
                <div className="px-4 py-6 space-y-4 max-w-full">
                    <Link
                        href="/"
                        className={`block py-2 text-base font-medium transition-colors ${getLinkStyles(currentTab === 'home')}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        {t('nav.home')}
                    </Link>
                    <Link
                        href="/about"
                        className={`block py-2 text-base font-medium transition-colors ${getLinkStyles(currentTab === 'about')}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        {t('nav.about')}
                    </Link>
                    <Link
                        href="/services"
                        className={`block py-2 text-base font-medium transition-colors ${getLinkStyles(currentTab === 'services')}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        {t('nav.services')}
                    </Link>
                    <Link
                        href="/portfolio"
                        className={`block py-2 text-base font-medium transition-colors ${getLinkStyles(currentTab === 'portfolio')}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        {t('nav.portfolio')}
                    </Link>
                    <Link
                        href="/blog"
                        className={`block py-2 text-base font-medium transition-colors ${getLinkStyles(currentTab === 'blog')}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        {t('nav.blog')}
                    </Link>
                    <div className="pt-4">
                        <Button
                            variant="primary"
                            size="sm"
                            className="w-full justify-center"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <Link href="https://wa.me/6285739402436?text=Halo%20Bajramedia!%20Saya%20ingin%20berkonsultasi%20tentang%20layanan%20digital.%20Bisa%20dibantu?" target="_blank">{t('nav.contact')}</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
} 
