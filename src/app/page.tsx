"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from 'react';
import { Button, Heading, Text, AnimatedText, SupportedBy, Blog, Portfolio, WhatsAppChat, Navbar } from "@/components";
import { useLanguage } from "@/context/LanguageContext";
import { usePublicSettings } from "@/hooks/useSettings";
import EnhancedSEO from '@/components/EnhancedSEO';

export default function HomePage() {
    const { t, language } = useLanguage();
    const { settings: publicSettings, loading: settingsLoading } = usePublicSettings();

    // Dark mode state
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Initialize dark mode based on user preference
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedMode = localStorage.getItem('darkMode');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const shouldEnableDarkMode = savedMode === 'true' || (savedMode === null && prefersDark);

            setIsDarkMode(shouldEnableDarkMode);

            if (shouldEnableDarkMode) {
                document.documentElement.classList.add('dark');
            }
        }
    }, []);

    // Toggle dark mode function
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
        <React.Fragment>
            <EnhancedSEO
                title="Professional Digital Solutions Agency"
                description="Transform your business with our comprehensive digital solutions. Web development, mobile apps, UI/UX design, digital marketing, and more. Based in Bali, serving globally."
                keywords={[
                    'digital agency Bali',
                    'web development Indonesia',
                    'mobile app development',
                    'UI UX design services',
                    'digital marketing agency',
                    'system development',
                    'game development',
                    'creative agency Bali',
                    'software development Indonesia',
                    'digital transformation'
                ]}
                type="website"
                schema="Organization"
                organization={{
                    name: 'Bajramedia',
                    url: 'https://bajramedia.com',
                    logo: 'https://bajramedia.com/images/logo.png',
                    sameAs: [
                        'https://instagram.com/bajramedia',
                        'https://linkedin.com/company/bajramedia',
                        'https://github.com/bajramedia'
                    ]
                }}
                services={[
                    {
                        name: 'Web Development',
                        description: 'Custom website and web application development using latest technologies',
                        url: 'https://bajramedia.com/services/web-development'
                    },
                    {
                        name: 'Mobile App Development',
                        description: 'Native and cross-platform mobile application development',
                        url: 'https://bajramedia.com/services/mobile-apps'
                    },
                    {
                        name: 'UI/UX Design',
                        description: 'User-centered design for web and mobile applications',
                        url: 'https://bajramedia.com/services/uiux-design'
                    },
                    {
                        name: 'Digital Marketing',
                        description: 'Comprehensive digital marketing strategies and implementation',
                        url: 'https://bajramedia.com/services/digital-marketing'
                    },
                    {
                        name: 'System Development',
                        description: 'Enterprise system development and integration solutions',
                        url: 'https://bajramedia.com/services/sistem-development'
                    }
                ]}
                faq={[
                    {
                        question: 'What services does Bajramedia offer?',
                        answer: 'Bajramedia offers comprehensive digital solutions including web development, mobile app development, UI/UX design, digital marketing, system development, and game development services.'
                    },
                    {
                        question: 'Where is Bajramedia located?',
                        answer: 'Bajramedia is based in Bali, Indonesia, but we serve clients globally with our digital solutions and remote collaboration capabilities.'
                    },
                    {
                        question: 'How long does a typical project take?',
                        answer: 'Project timelines vary based on scope and complexity. Web development projects typically take 4-12 weeks, while mobile apps may take 8-16 weeks. We provide detailed timelines during project planning.'
                    },
                    {
                        question: 'Do you provide ongoing support after project completion?',
                        answer: 'Yes, we offer comprehensive maintenance and support packages to ensure your digital solutions continue to perform optimally after launch.'
                    }
                ]}
                breadcrumbs={[
                    { name: 'Home', url: 'https://bajramedia.com' }
                ]}
            />

            <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 overflow-x-hidden">
                <Navbar activeTab="home" showDropdown={true} />

                <main>
                    <section className="relative min-h-screen bg-gradient-to-br from-white via-gray-50 to-green-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-all duration-300 pt-20">
                        <div className="absolute inset-0 z-0">
                            <Image
                                src="/images/team-meeting.jpg"
                                alt="Bajramedia Team Background"
                                fill
                                style={{ objectFit: 'cover', objectPosition: 'center' }}
                                priority
                                className="opacity-10 dark:opacity-5"
                            />
                            <div className="absolute inset-0 bg-white/85 dark:bg-gray-900/85"></div>
                        </div>

                        <div className="absolute inset-0 overflow-hidden z-0">
                            <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/5 rounded-full blur-3xl"></div>
                            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
                        </div>

                        <div className="relative z-10 w-[95%] mx-auto px-4 sm:px-6 lg:px-8 h-full">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-screen py-20">
                                <div className="order-2 lg:order-1 space-y-8">
                                    <AnimatedText as="div">
                                        <div className="flex items-center space-x-3 mb-6">
                                            <div className="w-16 h-0.5 bg-green-500"></div>
                                            <span className="text-green-500 font-semibold text-sm tracking-wider uppercase">
                                                {language === 'id' ? 'Solusi Digital Terdepan' : 'Leading Digital Solutions'}
                                            </span>
                                        </div>
                                    </AnimatedText>

                                    <AnimatedText as="div">
                                        <Heading variant="h1" color="foreground" className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
                                            {language === 'id' ? 'Kami Membangun ' : 'We Build '}
                                            <span className="text-green-500 relative inline-block">
                                                <span className="relative z-10">
                                                    {language === 'id' ? 'Solusi Digital' : 'Digital Solutions'}
                                                </span>
                                            </span>
                                            <br />
                                            {language === 'id' ? 'Yang Mendorong' : 'That Drive'}
                                            <br />
                                            <span className="text-gray-900 dark:text-white">
                                                {language === 'id' ? 'Kesuksesan' : 'Success'}
                                            </span>
                                        </Heading>
                                    </AnimatedText>

                                    <AnimatedText as="div">
                                        <Text color="secondary" className="text-lg md:text-xl leading-relaxed max-w-xl">
                                            {language === 'id'
                                                ? 'Transformasikan bisnis Anda dengan pengembangan web yang canggih, aplikasi mobile, dan solusi pemasaran digital yang disesuaikan dengan kebutuhan Anda.'
                                                : 'Transform your business with cutting-edge web development, mobile apps, and digital marketing solutions tailored to your needs.'
                                            }
                                        </Text>
                                    </AnimatedText>

                                    <AnimatedText as="div">
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <Link href="/about">
                                                <Button
                                                    variant="primary"
                                                    size="lg"
                                                    className="px-8 py-4 text-lg font-semibold w-full sm:w-auto bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
                                                >
                                                    {language === 'id' ? 'Konsultasi Gratis' : 'Get Free Consultation'}
                                                </Button>
                                            </Link>
                                            <Link href="/portfolio">
                                                <Button
                                                    variant="outline"
                                                    size="lg"
                                                    className="px-8 py-4 text-lg font-semibold border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white w-full sm:w-auto transform hover:scale-105 transition-all duration-300"
                                                >
                                                    {language === 'id' ? 'Lihat Portfolio Kami' : 'View Our Portfolio'}
                                                </Button>
                                            </Link>
                                        </div>
                                    </AnimatedText>

                                    <AnimatedText as="div">
                                        <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                                            <div className="text-center">
                                                <div className="text-3xl font-bold text-green-500 mb-2">50+</div>
                                                <div className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                                                    {language === 'id' ? 'Projects Done' : 'Projects Done'}
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-3xl font-bold text-green-500 mb-2">5+</div>
                                                <div className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                                                    {language === 'id' ? 'Years Experience' : 'Years Experience'}
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-3xl font-bold text-green-500 mb-2">24/7</div>
                                                <div className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                                                    {language === 'id' ? 'Support' : 'Support'}
                                                </div>
                                            </div>
                                        </div>
                                    </AnimatedText>
                                </div>

                                <div className="order-1 lg:order-2">
                                    <AnimatedText as="div">
                                        <div className="relative">
                                            <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
                                                <Image
                                                    src="/images/team-meeting-2.jpg"
                                                    alt={language === 'id' ? 'Tim Bajramedia - Profesional Digital Agency' : 'Bajramedia Team - Professional Digital Agency'}
                                                    fill
                                                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                                                    priority
                                                    className="rounded-3xl transform hover:scale-105 transition-transform duration-700"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        if (target.src.includes('team-meeting-2.jpg')) {
                                                            target.src = '/images/team-meeting.jpg';
                                                        } else if (target.src.includes('team-meeting.jpg')) {
                                                            target.src = '/images/team.jpg';
                                                        }
                                                    }}
                                                />

                                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-3xl"></div>

                                                <div className="absolute top-6 left-6 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg">
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                                            {language === 'id' ? 'Tim Professional' : 'Professional Team'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="absolute -top-6 -right-6 w-32 h-32 bg-green-500/10 rounded-full blur-2xl"></div>
                                            <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl"></div>

                                            <div className="absolute -top-4 -left-4 w-20 h-20 rounded-2xl overflow-hidden shadow-lg bg-white dark:bg-gray-800 p-2 hidden lg:block">
                                                <Image
                                                    src="/images/Bajra.png"
                                                    alt="Bajramedia Logo"
                                                    fill
                                                    style={{ objectFit: 'contain' }}
                                                    className="rounded-xl"
                                                />
                                            </div>
                                        </div>
                                    </AnimatedText>
                                </div>
                            </div>
                        </div>
                    </section>

                    <WhatsAppChat />
                    <SupportedBy />

                    <section className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
                        <div className="w-[95%] mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-16">
                                <AnimatedText as="h2">
                                    <Heading variant="h2" color="foreground" className="text-3xl md:text-4xl font-bold mb-4">
                                        {language === 'id' ? 'Artikel & Insights Terbaru' : 'Latest Articles & Insights'}
                                    </Heading>
                                </AnimatedText>
                                <AnimatedText as="p">
                                    <Text color="secondary" className="text-lg md:text-xl max-w-2xl mx-auto">
                                        {language === 'id'
                                            ? 'Pelajari tips, tren, dan insight terbaru dari dunia teknologi dan digital marketing'
                                            : 'Learn the latest tips, trends, and insights from the world of technology and digital marketing'
                                        }
                                    </Text>
                                </AnimatedText>
                            </div>

                            <Blog />

                            <div className="text-center mt-12">
                                <Link href="/blog">
                                    <Button variant="outline" size="lg" className="px-8 py-4">
                                        {language === 'id' ? 'Lihat Semua Artikel' : 'View All Articles'}
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </section>

                    <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
                        <div className="w-[95%] mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-16">
                                <AnimatedText as="h2">
                                    <Heading variant="h2" color="foreground" className="text-3xl md:text-4xl font-bold mb-4">
                                        {language === 'id' ? 'Portfolio Kami' : 'Our Portfolio'}
                                    </Heading>
                                </AnimatedText>
                                <AnimatedText as="p">
                                    <Text color="secondary" className="text-lg md:text-xl max-w-2xl mx-auto">
                                        {language === 'id'
                                            ? 'Lihat beberapa karya terbaik yang telah kami buat untuk klien-klien kami'
                                            : 'See some of the best work we have created for our clients'
                                        }
                                    </Text>
                                </AnimatedText>
                            </div>

                            <Portfolio />

                            <div className="text-center mt-12">
                                <Link href="/portfolio">
                                    <Button variant="outline" size="lg" className="px-8 py-4">
                                        {language === 'id' ? 'Lihat Portfolio Lengkap' : 'View Complete Portfolio'}
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </section>

                    <section className="py-20 bg-gradient-to-r from-green-500 to-green-600 text-white">
                        <div className="w-[95%] mx-auto px-4 sm:px-6 lg:px-8 text-center">
                            <AnimatedText as="h2">
                                <Heading variant="h2" className="text-3xl md:text-4xl font-bold mb-6 text-white">
                                    {language === 'id' ? 'Siap Mengembangkan Bisnis Anda?' : 'Ready to Grow Your Business?'}
                                </Heading>
                            </AnimatedText>
                            <AnimatedText as="p">
                                <Text className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
                                    {language === 'id'
                                        ? 'Mari diskusikan bagaimana kami dapat membantu mewujudkan visi digital Anda'
                                        : 'Let\'s discuss how we can help bring your digital vision to life'
                                    }
                                </Text>
                            </AnimatedText>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <Link href="/about">
                                    <Button variant="outline" size="lg" className="bg-white text-green-600 border-white hover:bg-gray-50 px-8 py-4">
                                        {language === 'id' ? 'Konsultasi Gratis' : 'Free Consultation'}
                                    </Button>
                                </Link>
                                <div className="flex items-center space-x-2 text-white/90">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <span className="text-sm font-medium">
                                        {language === 'id' ? 'Response dalam 24 jam' : '24h Response Time'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                <div className="fixed bottom-6 left-6 z-50">
                    <button
                        onClick={toggleDarkMode}
                        className="w-14 h-14 rounded-full bg-white dark:bg-gray-800 shadow-2xl transform hover:scale-105 transition-transform duration-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:shadow-xl transition-all duration-300 hover:scale-110 group dark-mode-button"
                        aria-label="Toggle dark mode"
                        title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                    >
                        {isDarkMode ? (
                            <svg
                                className="w-6 h-6 text-yellow-500 transform group-hover:rotate-180 transition-transform duration-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                                />
                            </svg>
                        ) : (
                            <svg
                                className="w-6 h-6 text-gray-700 transform group-hover:rotate-12 transition-transform duration-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                                />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </React.Fragment>
    );
} 