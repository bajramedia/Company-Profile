"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from 'react';
import { Button, Heading, Navbar, Footer, AnimatedText, WhatsAppChat } from "@/components";
import { useLanguage } from "@/context/LanguageContext";
import AOS from 'aos';
import 'aos/dist/aos.css';

// Data services
const services = [
    {
        id: 'web-development',
        title: 'Web Development',
        titleId: 'Website Modern & Responsif',
        description: 'Bangun website profesional dengan teknologi terbaru yang cepat, aman, dan mobile-friendly.',
        descriptionEn: 'Build professional websites with the latest technology that are fast, secure, and mobile-friendly.',
        icon: '🌐',
        color: 'from-blue-500 to-blue-600',
        features: ['Responsive Design', 'SEO Optimized', 'Fast Loading', 'Mobile First']
    },
    {
        id: 'aset-game-development',
        title: 'Game Asset Development',
        titleId: 'Aset Game Development',
        description: 'Ciptakan karakter, environment, dan asset game yang memukau untuk game modern.',
        descriptionEn: 'Create stunning characters, environments, and game assets for modern games.',
        icon: '🎮',
        color: 'from-purple-500 to-purple-600',
        features: ['2D Sprites', '3D Models', 'Environment Design', 'Audio Assets']
    },
    {
        id: 'uiux-design',
        title: 'UI/UX Design',
        titleId: 'Desain Interface yang Memukau',
        description: 'Ciptakan pengalaman pengguna yang luar biasa dengan desain yang intuitif dan menarik.',
        descriptionEn: 'Create extraordinary user experiences with intuitive and attractive designs.',
        icon: '🎨',
        color: 'from-pink-500 to-pink-600',
        features: ['User Research', 'Wireframing', 'Prototyping', 'Design System']
    },
    {
        id: 'sistem-development',
        title: 'System Development',
        titleId: 'Sistem Development Enterprise',
        description: 'Bangun sistem enterprise yang scalable untuk workflow bisnis yang kompleks.',
        descriptionEn: 'Build scalable enterprise systems for complex business workflows.',
        icon: '⚙️',
        color: 'from-green-500 to-green-600',
        features: ['ERP System', 'CRM System', 'Custom Development', 'Integration Support']
    },
    {
        id: 'sosial-media-management',
        title: 'Social Media Management',
        titleId: 'Social Media Management',
        description: 'Tingkatkan engagement dan brand awareness dengan strategi social media yang tepat.',
        descriptionEn: 'Increase engagement and brand awareness with effective social media strategies.',
        icon: '📱',
        color: 'from-orange-500 to-orange-600',
        features: ['Content Creation', 'Community Management', 'Analytics & Insights', 'Multi-platform']
    }
];

export default function ServicesPage() {
    const { t, language } = useLanguage();

    // Dark mode state
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Initialize dark mode
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedMode = localStorage.getItem('darkMode');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const shouldEnableDarkMode = savedMode === 'true' || (savedMode === null && prefersDark);

            setIsDarkMode(shouldEnableDarkMode);

            if (shouldEnableDarkMode) {
                document.documentElement.classList.add('dark');
            }

            // Listen for storage changes (untuk sync dengan tab lain)
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

    // Toggle dark mode
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
            <Navbar variant="solid" activeTab="services" />

            {/* Breadcrumb */}
            <div className="pt-20 pb-6 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                    <nav className="flex items-center space-x-2 text-sm">
                        <Link href="/" className="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">
                            {t('nav.home') || 'Home'}
                        </Link>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-primary font-medium">{t('nav.services') || 'Services'}</span>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <main className="py-16">
                {/* Hero Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mb-20">
                    <div className="text-center">
                        <AnimatedText as="div">
                            <Heading variant="h1" color="foreground" className="mb-6 text-[32px] md:text-[40px] lg:text-[48px] font-bold" data-aos="fade-up">
                                {t('services.page.title.main')} {' '}
                                <span className="text-primary relative">
                                    <span className="relative z-10">{t('services.page.title.highlight')}</span>
                                    <span className="absolute bottom-1 left-0 w-full h-3 bg-primary/10 -z-0"></span>
                                </span>
                                {' '} {t('services.page.title.end')}
                            </Heading>
                        </AnimatedText>

                        <AnimatedText as="div">
                            <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-8" data-aos="fade-up" data-aos-delay="200">
                                {t('services.page.subtitle')}
                            </p>
                        </AnimatedText>
                    </div>
                </section>

                {/* Services Grid */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <AnimatedText key={service.id} as="div">
                                <Link href={`/services/${service.id}`}>
                                    <div
                                        className="group bg-white dark:bg-slate-800/90 dark:backdrop-blur-sm dark:border dark:border-gray-700/50 rounded-2xl p-8 shadow-sm hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 cursor-pointer h-full flex flex-col"
                                        data-aos="fade-up"
                                        data-aos-delay={index * 100}
                                    >
                                        {/* Icon dengan gradient background */}
                                        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r ${service.color} text-white text-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                            {service.icon}
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary transition-colors">
                                            {language === 'id' ? service.titleId : service.title}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed flex-grow">
                                            {language === 'id' ? service.description : service.descriptionEn}
                                        </p>

                                        {/* Features */}
                                        <div className="space-y-2 mb-6">
                                            {service.features.map((feature, idx) => (
                                                <div key={idx} className="flex items-center space-x-2">
                                                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* CTA */}
                                        <div className="flex items-center text-primary font-medium group-hover:gap-3 transition-all duration-300 mt-auto">
                                            <span>Pelajari Lebih Lanjut</span>
                                            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </Link>
                            </AnimatedText>
                        ))}
                    </div>
                </section>

                {/* CTA Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-20">
                    <div className="relative bg-gray-900 dark:bg-gray-800 rounded-3xl p-12 text-center text-white overflow-hidden" data-aos="zoom-in" data-aos-delay="400">
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
                                Siap Memulai Proyek Impian Kamu?
                            </h2>
                            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto leading-relaxed">
                                Konsultasi gratis untuk membahas kebutuhan digital kamu. Tim expert kami siap membantu!
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

            {/* Floating Dark Mode Toggle */}
            <div className="fixed bottom-6 left-6 z-50">
                <button
                    onClick={toggleDarkMode}
                    className="w-14 h-14 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:shadow-xl transition-all duration-300 hover:scale-110 group"
                    aria-label="Toggle dark mode"
                >
                    {isDarkMode ? (
                        <svg className="w-6 h-6 text-yellow-500 transform group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6 text-gray-700 transform group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                    )}
                </button>
            </div>

            {/* WhatsApp Chat */}
            <WhatsAppChat
                phoneNumber="6285739402436"
                message="Halo! Saya tertarik dengan layanan Bajramedia. Bisa konsultasi gratis?"
            />
        </div>
    );
} 
