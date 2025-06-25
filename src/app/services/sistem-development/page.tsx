"use client";

import Link from "next/link";
import { useState, useEffect } from 'react';
import { Button, Heading, Logo, LanguageSwitcher, Footer } from "@/components";
import { useLanguage } from "@/context/LanguageContext";
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function SistemDevelopmentPage() {
    const { t } = useLanguage();
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedMode = localStorage.getItem('darkMode');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const shouldEnableDarkMode = savedMode === 'true' || (savedMode === null && prefersDark);

            setIsDarkMode(shouldEnableDarkMode);
            if (shouldEnableDarkMode) {
                document.documentElement.classList.add('dark');
            }

            const handleStorageChange = (e: StorageEvent) => {
                if (e.key === 'darkMode') {
                    const newMode = e.newValue === 'true';
                    setIsDarkMode(newMode);
                    if (newMode) {
                        document.documentElement.classList.add('dark');
                    } else {
                        document.documentElement.classList.remove('dark');
                    }
                }
            };

            window.addEventListener('storage', handleStorageChange);
            return () => window.removeEventListener('storage', handleStorageChange);
        }
    }, []);

    // Initialize AOS
    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: 'ease-out',
            once: true,
            offset: 100,
        });
    }, []);

    const toggleDarkMode = () => {
        setIsDarkMode(prev => {
            const newMode = !prev;
            if (newMode) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
            localStorage.setItem('darkMode', newMode ? 'true' : 'false');
            return newMode;
        });
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 bg-white/95 dark:bg-gray-800/95 shadow-sm z-50 py-3 md:py-4 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 md:px-8">
                    <Logo size="md" />
                    <div className="hidden md:flex items-center space-x-7">
                        <nav className="flex space-x-6 md:space-x-8">
                            <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-green-500 transition-colors duration-300 text-[15px] font-medium">
                                {t('nav.home') || 'Home'}
                            </Link>
                            <div className="relative group">
                                <Link href="/services" className="text-green-500 transition-colors flex items-center text-[15px] font-medium">
                                    {t('nav.services') || 'Services'}
                                    <span className="inline-block ml-1 transform group-hover:rotate-180 transition-transform duration-200">
                                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </span>
                                </Link>

                                {/* Dropdown Menu */}
                                <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                    <div className="p-2">
                                        <Link href="/services/web-development" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm">
                                                🌐
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-white text-sm">Web Development</div>
                                                <div className="text-gray-500 dark:text-gray-400 text-xs">Website modern & responsif</div>
                                            </div>
                                        </Link>

                                        <Link href="/services/aset-game-development" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center text-white text-sm">
                                                🎮
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-white text-sm">Aset Game Development</div>
                                                <div className="text-gray-500 dark:text-gray-400 text-xs">Assets & character untuk game</div>
                                            </div>
                                        </Link>

                                        <Link href="/services/uiux-design" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-pink-500 to-pink-600 flex items-center justify-center text-white text-sm">
                                                🎨
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-white text-sm">UI/UX Design</div>
                                                <div className="text-gray-500 dark:text-gray-400 text-xs">Interface yang memukau</div>
                                            </div>
                                        </Link>

                                        <Link href="/services/sistem-development" className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400">
                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white text-sm">
                                                ⚙️
                                            </div>
                                            <div>
                                                <div className="font-medium text-sm">Sistem Development</div>
                                                <div className="text-xs opacity-70">Enterprise & custom system</div>
                                            </div>
                                        </Link>

                                        <Link href="/services/sosial-media-management" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center text-white text-sm">
                                                📱
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-white text-sm">Social Media Management</div>
                                                <div className="text-gray-500 dark:text-gray-400 text-xs">Kelola media sosial bisnis</div>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <Link href="/portfolio" className="text-gray-700 dark:text-gray-300 hover:text-green-500 transition-colors duration-300 text-[15px] font-medium">
                                {t('nav.portfolio') || 'Portfolio'}
                            </Link>
                            <Link href="/blog" className="text-gray-700 dark:text-gray-300 hover:text-green-500 transition-colors duration-300 text-[15px] font-medium">
                                {t('nav.blog') || 'Blog'}
                            </Link>
                        </nav>
                        <LanguageSwitcher className="mr-4 text-gray-700 dark:text-gray-300" />
                        <Button variant="primary" size="sm" className="px-5 py-2 rounded-md font-medium shadow-sm hover:shadow-lg hover:bg-green-600 transition-all duration-300">
                            {t('nav.contact') || 'Contact'}
                        </Button>
                    </div>
                </div>
            </header>

            {/* Breadcrumb */}
            <div className="pt-20 pb-6 bg-gray-50 dark:bg-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                    <nav className="flex items-center space-x-2 text-sm">
                        <Link href="/" className="text-gray-500 dark:text-gray-400 hover:text-green-500 transition-colors duration-300">Home</Link>
                        <span className="text-gray-400">→</span>
                        <Link href="/services" className="text-gray-500 dark:text-gray-400 hover:text-green-500 transition-colors duration-300">Services</Link>
                        <span className="text-gray-400">→</span>
                        <span className="text-green-500 font-medium">Sistem Development</span>
                    </nav>
                </div>
            </div>

            <main className="py-16">
                {/* Hero */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mb-20">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white text-2xl mb-6">
                            ⚙️
                        </div>
                        <Heading variant="h1" color="foreground" className="mb-6 text-[32px] md:text-[40px] lg:text-[48px] font-bold">
                            Sistem Development <span className="text-green-500">Enterprise</span>
                        </Heading>

                        <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-8 max-w-3xl mx-auto">
                            Bangun sistem enterprise yang scalable dan robust. Dari ERP, CRM hingga sistem manajemen custom
                            yang disesuaikan dengan workflow bisnis kamu.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button variant="primary" size="lg" className="px-8 py-4">
                                Konsultasi Sistem
                            </Button>
                            <Button variant="outline" size="lg" className="px-8 py-4">
                                Lihat Demo
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Services */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Jenis Sistem Enterprise</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center border border-gray-100 dark:border-gray-700">
                            <div className="text-3xl mb-3">📊</div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">ERP System</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">Enterprise Resource Planning</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center border border-gray-100 dark:border-gray-700">
                            <div className="text-3xl mb-3">👥</div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">CRM System</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">Customer Relationship Management</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center border border-gray-100 dark:border-gray-700">
                            <div className="text-3xl mb-3">📦</div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Inventory System</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">Warehouse & Stock Management</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center border border-gray-100 dark:border-gray-700">
                            <div className="text-3xl mb-3">💼</div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">HRIS</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">Human Resource Information System</p>
                        </div>
                    </div>
                </section>

                {/* Packages */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Paket Sistem Development</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-100 dark:border-gray-700 flex flex-col h-full">
                            <div className="flex-grow">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">CRM System</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">Customer management system</p>
                                <div className="mb-6">
                                    <span className="text-3xl font-bold text-green-500">25jt</span>
                                    <span className="text-gray-500"> - 40jt</span>
                                </div>
                                <ul className="space-y-2 mb-8 text-sm">
                                    <li className="flex items-center">
                                        <span className="text-green-500 mr-2">✓</span>
                                        <span className="text-gray-700 dark:text-gray-300">Customer Database</span>
                                    </li>
                                    <li className="flex items-center">
                                        <span className="text-green-500 mr-2">✓</span>
                                        <span className="text-gray-700 dark:text-gray-300">Sales Pipeline</span>
                                    </li>
                                    <li className="flex items-center">
                                        <span className="text-green-500 mr-2">✓</span>
                                        <span className="text-gray-700 dark:text-gray-300">Reporting & Analytics</span>
                                    </li>
                                </ul>
                            </div>
                            <Button variant="outline" size="lg" className="w-full mt-auto">Pilih Paket</Button>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border-2 border-green-500 relative flex flex-col h-full">
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm">Populer</span>
                            </div>
                            <div className="flex-grow">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">ERP System</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">Enterprise resource planning</p>
                                <div className="mb-6">
                                    <span className="text-3xl font-bold text-green-500">80jt</span>
                                    <span className="text-gray-500"> - 150jt</span>
                                </div>
                                <ul className="space-y-2 mb-8 text-sm">
                                    <li className="flex items-center">
                                        <span className="text-green-500 mr-2">✓</span>
                                        <span className="text-gray-700 dark:text-gray-300">Semua fitur CRM</span>
                                    </li>
                                    <li className="flex items-center">
                                        <span className="text-green-500 mr-2">✓</span>
                                        <span className="text-gray-700 dark:text-gray-300">Inventory Management</span>
                                    </li>
                                    <li className="flex items-center">
                                        <span className="text-green-500 mr-2">✓</span>
                                        <span className="text-gray-700 dark:text-gray-300">Financial Management</span>
                                    </li>
                                    <li className="flex items-center">
                                        <span className="text-green-500 mr-2">✓</span>
                                        <span className="text-gray-700 dark:text-gray-300">HR Management</span>
                                    </li>
                                </ul>
                            </div>
                            <Button variant="primary" size="lg" className="w-full mt-auto">Pilih Paket</Button>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-100 dark:border-gray-700 flex flex-col h-full">
                            <div className="flex-grow">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Custom System</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">Disesuaikan kebutuhan bisnis</p>
                                <div className="mb-6">
                                    <span className="text-3xl font-bold text-green-500">Konsultasi</span>
                                </div>
                                <ul className="space-y-2 mb-8 text-sm">
                                    <li className="flex items-center">
                                        <span className="text-green-500 mr-2">✓</span>
                                        <span className="text-gray-700 dark:text-gray-300">Analysis & Design</span>
                                    </li>
                                    <li className="flex items-center">
                                        <span className="text-green-500 mr-2">✓</span>
                                        <span className="text-gray-700 dark:text-gray-300">Custom Features</span>
                                    </li>
                                    <li className="flex items-center">
                                        <span className="text-green-500 mr-2">✓</span>
                                        <span className="text-gray-700 dark:text-gray-300">Integration Support</span>
                                    </li>
                                    <li className="flex items-center">
                                        <span className="text-green-500 mr-2">✓</span>
                                        <span className="text-gray-700 dark:text-gray-300">Dedicated Support</span>
                                    </li>
                                </ul>
                            </div>
                            <Button variant="outline" size="lg" className="w-full mt-auto">Konsultasi</Button>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                    <div className="relative bg-gray-900 dark:bg-gray-800 rounded-3xl p-12 text-center text-white overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-5 dark:opacity-10">
                            <div className="absolute inset-0" style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                                backgroundSize: '60px 60px'
                            }}></div>
                        </div>

                        {/* Floating Elements */}
                        <div className="absolute top-10 left-10 w-20 h-20 bg-white/3 dark:bg-white/5 rounded-full blur-xl"></div>
                        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/2 dark:bg-white/3 rounded-full blur-2xl"></div>
                        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-green-300/8 dark:bg-green-300/15 rounded-full blur-lg"></div>

                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                                Siap Digitalisasi Sistem Bisnis?
                            </h2>
                            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto leading-relaxed">
                                Konsultasi gratis untuk kebutuhan sistem enterprise kamu. Tim developer expert siap membantu analisis!
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button variant="outline" size="lg" className="bg-white text-gray-900 border-white hover:bg-gray-50 hover:scale-105 transition-all duration-300 px-8 py-4 font-semibold shadow-lg">
                                    Konsultasi Gratis
                                </Button>
                                <Button variant="outline" size="lg" className="border-white/60 text-white hover:bg-white/10 dark:hover:bg-white/15 hover:scale-105 transition-all duration-300 px-8 py-4 font-semibold backdrop-blur-sm">
                                    WhatsApp Kami
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <Footer />

            {/* Dark Mode Toggle */}
            <div className="fixed bottom-6 left-6 z-50">
                <button
                    onClick={toggleDarkMode}
                    className="w-14 h-14 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:shadow-xl transition-all duration-300"
                >
                    {isDarkMode ? <span className="text-2xl">☀️</span> : <span className="text-2xl">🌙</span>}
                </button>
            </div>
        </div>
    );
} 