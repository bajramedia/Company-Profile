"use client";

import Link from "next/link";
import { useState, useEffect } from 'react';
import { Button, Heading, Navbar, Footer, AnimatedText } from "@/components";
import { useLanguage } from "@/context/LanguageContext";
import AOS from 'aos';
import 'aos/dist/aos.css';

const technologies = [
    { name: 'React', icon: '⚛️', description: 'Modern UI framework' },
    { name: 'Next.js', icon: '▲', description: 'Full-stack framework' },
    { name: 'TypeScript', icon: '📘', description: 'Type-safe JavaScript' },
    { name: 'Tailwind', icon: '🎨', description: 'Utility-first CSS' }
];

export default function WebDevelopmentPage() {
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
            <div className="pt-20 pb-6 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                    <nav className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mb-8" data-aos="fade-right">
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                            <Link href="/services" className="hover:text-green-500 transition-colors duration-300">
                                Services
                            </Link>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                            <span className="text-gray-900 dark:text-white">Web Development</span>
                        </div>
                    </nav>
                </div>
            </div>

            <main className="py-16">
                {/* Hero Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mb-20">
                    <div className="text-center">
                        <AnimatedText as="div">
                            <Heading
                                variant="h1"
                                color="foreground"
                                className="mb-6 text-[32px] md:text-[40px] lg:text-[48px] font-bold"
                                data-aos="fade-up"
                            >
                                Web Development {' '}
                                <span className="text-green-500 relative">
                                    <span className="relative z-10">Profesional</span>
                                    <span className="absolute bottom-1 left-0 w-full h-3 bg-green-500/10 -z-0"></span>
                                </span>
                            </Heading>
                        </AnimatedText>

                        <AnimatedText as="div">
                            <p
                                className="text-gray-600 dark:text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-8"
                                data-aos="fade-up"
                                data-aos-delay="200"
                            >
                                Bangun website modern dan responsif dengan teknologi terdepan. Dari landing page hingga e-commerce kompleks,
                                kami siap mewujudkan visi digital kamu dengan performa optimal.
                            </p>
                        </AnimatedText>
                    </div>
                </section>

                {/* Technologies */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mb-20">
                    <div className="text-center mb-12">
                        <h2
                            className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4"
                            data-aos="fade-up"
                        >
                            Teknologi yang Kami Gunakan
                        </h2>
                        <p
                            className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
                            data-aos="fade-up"
                            data-aos-delay="100"
                        >
                            Stack modern yang terpercaya untuk menghasilkan website berkualitas tinggi
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {technologies.map((tech, index) => (
                            <div
                                key={tech.name}
                                className="group bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
                                data-aos="fade-up"
                                data-aos-delay={index * 100}
                            >
                                <div className={`text-4xl mb-3 group-hover:scale-110 transition-transform duration-300`}>
                                    {tech.icon}
                                </div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{tech.name}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{tech.description}</p>
                            </div>
                        ))}
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
                            Pilih paket yang sesuai dengan kebutuhan bisnis kamu
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-100 dark:border-gray-700 flex flex-col h-full">
                            <div className="flex-grow">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Landing Page</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">Website satu halaman yang powerful</p>
                                <div className="mb-6">
                                    <span className="text-3xl font-bold text-green-500">Mulai 2.5jt</span>
                                </div>
                            </div>
                            <Button variant="outline" size="lg" className="w-full mt-auto">Pilih Paket</Button>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border-2 border-green-500 ring-2 ring-green-500/20 relative flex flex-col h-full">
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                                    Paling Populer
                                </span>
                            </div>
                            <div className="flex-grow">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Company Profile</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">Website perusahaan yang profesional</p>
                                <div className="mb-6">
                                    <span className="text-3xl font-bold text-green-500">Mulai 5jt</span>
                                </div>
                            </div>
                            <Button variant="primary" size="lg" className="w-full mt-auto">Pilih Paket</Button>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-100 dark:border-gray-700 flex flex-col h-full">
                            <div className="flex-grow">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">E-Commerce</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">Toko online dengan payment gateway</p>
                                <div className="mb-6">
                                    <span className="text-3xl font-bold text-green-500">Mulai 15jt</span>
                                </div>
                            </div>
                            <Button variant="outline" size="lg" className="w-full mt-auto">Pilih Paket</Button>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                    <div
                        className="relative bg-gray-900 dark:bg-gray-800 rounded-3xl p-12 text-center text-white overflow-hidden"
                        data-aos="zoom-in"
                        data-aos-delay="300"
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
                                Siap Membangun Website Impian?
                            </h2>
                            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto leading-relaxed">
                                Konsultasi gratis untuk membahas kebutuhan website kamu. Tim developer expert siap membantu!
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
                    className="w-14 h-14 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:shadow-xl transition-all duration-300 hover:scale-110 group"
                >
                    {isDarkMode ? <span className="text-2xl">☀️</span> : <span className="text-2xl">🌙</span>}
                </button>
            </div>
        </div>
    );
} 