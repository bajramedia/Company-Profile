"use client";

import Link from "next/link";
import { useState, useEffect } from 'react';
import { Button, Heading, Navbar, Logo, LanguageSwitcher, WhatsAppChat } from "@/components";
import { useLanguage } from "@/context/LanguageContext";
import { Sun, Moon } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const pricingPlans = [
    {
        name: "2D Asset Pack",
        price: "5",
        description: "Paket asset 2D lengkap untuk game sederhana",
        features: [
            "10 Character sprites",
            "20 UI Elements",
            "15 Background assets",
            "Sound effects pack",
            "Multiple formats (PNG, SVG)",
            "Source files included"
        ]
    },
    {
        name: "3D Asset Pack",
        price: "15",
        description: "Paket asset 3D premium untuk game modern",
        features: [
            "5 High-quality 3D models",
            "Character animations",
            "Environment assets",
            "Texture maps included",
            "Unity & Unreal compatible",
            "Custom rigging",
            "Source files (FBX, OBJ)",
            "Revision support",
            "Commercial license"
        ]
    }
];

export default function AsetGameDevelopmentPage() {
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
            <Navbar variant="solid" activeTab="services" />

            {/* Breadcrumb */}
            <div className="pt-20 pb-6 bg-gray-50 dark:bg-gray-800">
                <div className="w-[95%] mx-auto px-4 sm:px-6 md:px-8">
                    <nav className="w-[95%] mx-auto px-4 sm:px-6 md:px-8 mb-8" data-aos="fade-right">
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                            <Link href="/services" className="hover:text-green-500 transition-colors duration-300">
                                Services
                            </Link>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                            <span className="text-gray-900 dark:text-white">Aset Game Development</span>
                        </div>
                    </nav>
                </div>
            </div>

            <main className="py-16">
                {/* Hero Section */}
                <section className="w-[95%] mx-auto px-4 sm:px-6 md:px-8 mb-20">
                    <div className="text-center">
                        <Heading
                            variant="h1"
                            color="foreground"
                            className="mb-6 text-[32px] md:text-[40px] lg:text-[48px] font-bold"
                            data-aos="fade-up"
                        >
                            {t('service.gameAsset.title')}
                        </Heading>

                        <p
                            className="text-gray-600 dark:text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-8"
                            data-aos="fade-up"
                            data-aos-delay="200"
                        >
                            {t('service.gameAsset.subtitle')}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button variant="primary" size="lg" className="px-8 py-4">
                                {t('service.gameAsset.cta.discuss')}
                            </Button>
                            <Button variant="outline" size="lg" className="px-8 py-4">
                                {t('service.gameAsset.cta.gallery')}
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="w-[95%] mx-auto px-4 sm:px-6 md:px-8 mb-20">
                    <div className="text-center mb-12">
                        <h2
                            className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4"
                            data-aos="fade-up"
                        >
                            {t('service.gameAsset.sectionTitle')}
                        </h2>
                        <p
                            className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
                            data-aos="fade-up"
                            data-aos-delay="100"
                        >
                            {t('service.gameAsset.sectionSubtitle')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="group bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700" data-aos="fade-up" data-aos-delay="100">
                            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                👾
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">2D Sprites</h3>
                            <p className="text-gray-600 dark:text-gray-400">Character & object animations</p>
                        </div>
                        <div className="group bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700" data-aos="fade-up" data-aos-delay="200">
                            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                🏗️
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">3D Models</h3>
                            <p className="text-gray-600 dark:text-gray-400">Low poly & high poly assets</p>
                        </div>
                        <div className="group bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700" data-aos="fade-up" data-aos-delay="300">
                            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                🌍
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Environment</h3>
                            <p className="text-gray-600 dark:text-gray-400">Background & scenery design</p>
                        </div>
                        <div className="group bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700" data-aos="fade-up" data-aos-delay="400">
                            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                🎵
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Audio Assets</h3>
                            <p className="text-gray-600 dark:text-gray-400">SFX & background music</p>
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section className="w-[95%] mx-auto px-4 sm:px-6 md:px-8 mb-20">
                    <div className="text-center mb-12">
                        <h2
                            className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4"
                            data-aos="fade-up"
                        >
                            Paket Asset Game
                        </h2>
                        <p
                            className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
                            data-aos="fade-up"
                            data-aos-delay="100"
                        >
                            Pilih paket asset yang sesuai dengan jenis game yang kamu kembangkan
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-[90%] mx-auto">
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
                <section className="w-[95%] mx-auto px-4 sm:px-6 md:px-8">
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
                                Siap Ciptakan Game Impian?
                            </h2>
                            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto leading-relaxed">
                                Konsultasi gratis untuk diskusi asset game kamu. Tim game artist expert siap bantu wujudkan visi kreatif!
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button variant="outline" size="lg" className="bg-white text-gray-900 border-white hover:bg-gray-50 hover:scale-105 transition-all duration-300 px-8 py-4 font-semibold shadow-lg">
                                    Konsultasi Gratis
                                </Button>
                                <Button variant="outline" size="lg" className="border-white/60 text-white hover:bg-white/10 dark:hover:bg-white/15 hover:scale-105 transition-all duration-300 px-8 py-4 font-semibold backdrop-blur-sm">
                                    Lihat Gallery
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Dark Mode Toggle */}
            <div className="fixed bottom-6 left-6 z-50">
                <button
                    onClick={toggleDarkMode}
                    className="w-14 h-14 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:shadow-xl transition-all duration-300"
                >
                    {isDarkMode ? <Sun size={24} className="text-yellow-500" /> : <Moon size={24} className="text-blue-500" />}
                </button>
            </div>
        </div>
    );
} 
