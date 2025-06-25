"use client";

import { Logo } from "@/components";
import { useLanguage } from "@/context/LanguageContext";
import { usePublicSettings } from "@/hooks/useSettings";

export default function Footer() {
    const { t } = useLanguage();
    const { settings: publicSettings } = usePublicSettings();

    return (
        <footer className="bg-gray-900 dark:bg-gray-950 text-white relative overflow-hidden transition-colors duration-300">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: '60px 60px'
                }}></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
                {/* Main Footer Content */}
                <div className="pt-16 pb-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

                        {/* Company Info */}
                        <div className="lg:col-span-2">
                            <div className="mb-6">
                                <Logo size="lg" variant="light" className="mb-4" />
                                <h3 className="text-xl font-bold mb-3 text-white">
                                    {publicSettings?.siteName || 'Bajramedia'}
                                </h3>
                                <p className="text-gray-400 leading-relaxed max-w-md">
                                    {t('description') || 'Solusi digital terpadu untuk mengembangkan bisnis Anda dengan teknologi terdepan.'}
                                </p>
                            </div>

                            {/* Social Media */}
                            <div className="space-y-4">
                                <h4 className="font-semibold text-white">{t('Follow Us') || 'Follow Us'}</h4>
                                <div className="flex space-x-4">
                                    <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-green-500 rounded-full flex items-center justify-center transition-colors duration-300 group">
                                        <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                        </svg>
                                    </a>
                                    <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-green-500 rounded-full flex items-center justify-center transition-colors duration-300 group">
                                        <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="font-semibold text-white mb-6">{t('Quick Links') || 'Quick Links'}</h4>
                            <ul className="space-y-3">
                                <li><a href="/" className="text-gray-400 hover:text-white transition-colors duration-300">{t('nav.home') || 'Home'}</a></li>
                                <li><a href="/#about" className="text-gray-400 hover:text-white transition-colors duration-300">{t('nav.about') || 'About Us'}</a></li>
                                <li><a href="/services" className="text-gray-400 hover:text-white transition-colors duration-300">{t('nav.services') || 'Services'}</a></li>
                                <li><a href="/portfolio" className="text-gray-400 hover:text-white transition-colors duration-300">{t('nav.portfolio') || 'Portfolio'}</a></li>
                                <li><a href="/blog" className="text-gray-400 hover:text-white transition-colors duration-300">{t('nav.blog') || 'Blog'}</a></li>
                                <li><a href="/#contact" className="text-gray-400 hover:text-white transition-colors duration-300">{t('nav.contact') || 'Contact'}</a></li>
                            </ul>
                        </div>

                        {/* Services */}
                        <div>
                            <h4 className="font-semibold text-white mb-6">{t('Services') || 'Services'}</h4>
                            <ul className="space-y-3">
                                <li><a href="/services/web-development" className="text-gray-400 hover:text-white transition-colors duration-300">{t('Web Development') || 'Web Development'}</a></li>
                                <li><a href="/services/aset-game-development" className="text-gray-400 hover:text-white transition-colors duration-300">{t('Game Assets') || 'Aset Game Development'}</a></li>
                                <li><a href="/services/uiux-design" className="text-gray-400 hover:text-white transition-colors duration-300">{t('Uiux Design') || 'UI/UX Design'}</a></li>
                                <li><a href="/services/sistem-development" className="text-gray-400 hover:text-white transition-colors duration-300">{t('System Development') || 'Sistem Development'}</a></li>
                                <li><a href="/services/sosial-media-management" className="text-gray-400 hover:text-white transition-colors duration-300">{t('Social Media') || 'Social Media Management'}</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Contact Info Bar */}
                <div className="py-8 border-t border-gray-800">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start space-x-3">
                            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">{t('Email') || 'Email'}</p>
                                <p className="text-white font-medium">hello@bajramedia.com</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-center md:justify-start space-x-3">
                            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">{t('Phone') || 'Phone'}</p>
                                <p className="text-white font-medium">+6285739402436</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-center md:justify-start space-x-3">
                            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">{t('Location') || 'Location'}</p>
                                <p className="text-white font-medium">Denpasar, Bali</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="py-6 border-t border-gray-800">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
                            <p className="text-gray-500 text-sm">
                                © {new Date().getFullYear()} {publicSettings?.siteName || 'Bajramedia'}. {t('rightsReserved') || 'All rights reserved.'}
                            </p>
                            <div className="flex space-x-6">
                                <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors duration-300">{t('privacy') || 'Privacy Policy'}</a>
                                <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors duration-300">{t('terms') || 'Terms of Service'}</a>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <span>{t('Made With') || 'Made with'}</span>
                            <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                            </svg>
                            <span>{t('Bajra Team') || 'in Bali'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
