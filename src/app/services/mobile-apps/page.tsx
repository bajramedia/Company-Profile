"use client";

import Link from "next/link";
import { useState, useEffect } from 'react';
import { Button, Heading, Logo, LanguageSwitcher, Footer } from "@/components";
import { useLanguage } from "@/context/LanguageContext";
import AOS from 'aos';
import 'aos/dist/aos.css';

const pricingPlans = [
    {
        name: "Basic App",
        price: "25",
        description: "Aplikasi mobile sederhana dengan fitur dasar",
        features: [
            "Cross-platform (iOS & Android)",
            "3 screen utama",
            "Push notification basic",
            "Integrasi API dasar",
            "App store deployment",
            "1 bulan support"
        ]
    },
    {
        name: "Advanced App",
        price: "50",
        description: "Aplikasi mobile lengkap dengan fitur advanced",
        features: [
            "Cross-platform (iOS & Android)",
            "Unlimited screens",
            "Advanced push notifications",
            "Complex API integrations",
            "Offline support",
            "Admin panel",
            "App store deployment",
            "3 bulan support",
            "Analytics integration"
        ]
    }
];

export default function MobileAppsPage() {
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

                                        <Link href="/services/mobile-apps" className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400">
                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white text-sm">
                                                📱
                                            </div>
                                            <div>
                                                <div className="font-medium text-sm">Mobile Apps</div>
                                                <div className="text-xs opacity-70">iOS & Android apps</div>
                                            </div>
                                        </Link>

                                        <Link href="/services/uiux-design" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center text-white text-sm">
                                                🎨
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-white text-sm">UI/UX Design</div>
                                                <div className="text-gray-500 dark:text-gray-400 text-xs">Interface yang memukau</div>
                                            </div>
                                        </Link>

                                        <Link href="/services/digital-marketing" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center text-white text-sm">
                                                📢
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-white text-sm">Digital Marketing</div>
                                                <div className="text-gray-500 dark:text-gray-400 text-xs">Strategi marketing digital</div>
                                            </div>
                                        </Link>

                                        <Link href="/services/consulting" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center text-white text-sm">
                                                💼
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-white text-sm">Business Consulting</div>
                                                <div className="text-gray-500 dark:text-gray-400 text-xs">Konsultasi bisnis digital</div>
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
                    <nav className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mb-8" data-aos="fade-right">
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                            <Link href="/services" className="hover:text-green-500 transition-colors duration-300">
                                Services
                            </Link>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                            <span className="text-gray-900 dark:text-white">Mobile Apps</span>
                        </div>
                    </nav>
                </div>
            </div>

            <main className="py-16">
                {/* Hero Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mb-20">
                    <div className="text-center">
                        <Heading
                            variant="h1"
                            color="foreground"
                            className="mb-6 text-[32px] md:text-[40px] lg:text-[48px] font-bold"
                            data-aos="fade-up"
                        >
                            Mobile Apps {' '}
                            <span className="text-green-500 relative">
                                <span className="relative z-10">Development</span>
                                <span className="absolute bottom-1 left-0 w-full h-3 bg-green-500/10 -z-0"></span>
                            </span>
                        </Heading>

                        <p
                            className="text-gray-600 dark:text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-8"
                            data-aos="fade-up"
                            data-aos-delay="200"
                        >
                            Bangun aplikasi mobile cross-platform dengan React Native. Satu kode untuk Android & iOS,
                            performa native, dan pengalaman pengguna yang luar biasa.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button variant="primary" size="lg" className="px-8 py-4">
                                Konsultasi Project
                            </Button>
                            <Button variant="outline" size="lg" className="px-8 py-4">
                                Lihat Demo App
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mb-20">
                    <div className="text-center mb-12">
                        <h2
                            className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4"
                            data-aos="fade-up"
                        >
                            Kenapa Pilih Kami?
                        </h2>
                        <p
                            className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
                            data-aos="fade-up"
                            data-aos-delay="100"
                        >
                            Keunggulan aplikasi mobile yang kami kembangkan
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="group bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700" data-aos="fade-up" data-aos-delay="100">
                            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                📱
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Cross Platform</h3>
                            <p className="text-gray-600 dark:text-gray-400">iOS & Android</p>
                        </div>
                        <div className="group bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700" data-aos="fade-up" data-aos-delay="200">
                            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                ⚡
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Native Performance</h3>
                            <p className="text-gray-600 dark:text-gray-400">Performa optimal</p>
                        </div>
                        <div className="group bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700" data-aos="fade-up" data-aos-delay="300">
                            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                🔔
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Push Notifications</h3>
                            <p className="text-gray-600 dark:text-gray-400">Notifikasi real-time</p>
                        </div>
                        <div className="group bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700" data-aos="fade-up" data-aos-delay="400">
                            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                📴
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Offline Support</h3>
                            <p className="text-gray-600 dark:text-gray-400">Bisa offline</p>
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mb-20">
                    <div className="text-center mb-12">
                        <h2
                            className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4"
                            data-aos="fade-up"
                        >
                            Paket Layanan
                        </h2>
                        <p
                            className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
                            data-aos="fade-up"
                            data-aos-delay="100"
                        >
                            Pilih paket yang sesuai dengan kebutuhan aplikasi mobile kamu
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {pricingPlans.map((plan, index) => (
                            <div
                                key={plan.name}
                                className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 border-2 border-gray-200 dark:border-gray-700 hover:border-green-500/50 transition-all duration-300 hover:scale-105 flex flex-col h-full"
                                data-aos="fade-up"
                                data-aos-delay={index * 200}
                            >
                                <div className="flex-grow">
                                    <div className="text-center">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                                        <div className="mb-6">
                                            <span className="text-3xl font-bold text-green-500">Rp {plan.price}</span>
                                            <span className="text-gray-600 dark:text-gray-400 ml-1">juta</span>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-400 mb-6">{plan.description}</p>
                                    </div>

                                    <ul className="space-y-3 mb-8">
                                        {plan.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-center space-x-3">
                                                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <Button variant="primary" size="lg" className="w-full font-semibold mt-auto">
                                    Pilih Paket
                                </Button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                    <div
                        className="relative bg-gray-900 dark:bg-gray-800 rounded-3xl p-12 text-center text-white overflow-hidden"
                        data-aos="zoom-in"
                        data-aos-delay="400"
                    >
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
                        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/4 dark:bg-white/8 rounded-full blur-lg"></div>

                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                                Siap Membuat Aplikasi Mobile?
                            </h2>
                            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto leading-relaxed">
                                Konsultasi gratis untuk membahas ide aplikasi kamu. Tim mobile developer expert siap membantu!
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button variant="outline" size="lg" className="bg-white text-gray-900 border-white hover:bg-gray-50 hover:scale-105 transition-all duration-300 px-8 py-4 font-semibold shadow-lg">
                                    Konsultasi Gratis
                                </Button>
                                <Button variant="outline" size="lg" className="border-white/60 text-white hover:bg-white/10 dark:hover:bg-white/15 hover:scale-105 transition-all duration-300 px-8 py-4 font-semibold backdrop-blur-sm">
                                    Lihat Portfolio
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