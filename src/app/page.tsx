"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from 'react';
import { Button, Heading, Text, Logo, LanguageSwitcher, AnimatedText, SupportedBy, CTA, Blog, Portfolio, Team, WhatsAppChat, Navbar, Home, ServicesOverview } from "@/components";
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
            // Check localStorage
            const savedMode = localStorage.getItem('darkMode');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

            const shouldEnableDarkMode = savedMode === 'true' || (savedMode === null && prefersDark);

            setIsDarkMode(shouldEnableDarkMode);

            // Apply dark mode class if needed
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

            // Save preference to localStorage
            localStorage.setItem('darkMode', newMode ? 'true' : 'false');

            return newMode;
        });
    };

    return (
        <>
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
                {/* Header - Use Navbar component instead of hardcoded */}
                <Navbar activeTab="home" showDropdown={true} />

                {/* Main Content */}
                <main>
                    {/* Hero Section - Enhanced */}
                    <section className="relative min-h-screen bg-gradient-to-br from-white via-gray-50 to-green-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-all duration-300 pt-20">
                        {/* Background Image */}
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

                        {/* Animated background elements */}
                        <div className="absolute inset-0 overflow-hidden z-1">
                            <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/5 rounded-full blur-3xl animate-pulse"></div>
                            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
                        </div>

                        {/* Content Container */}
                        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-screen py-20">

                                {/* Text Content */}
                                <div className="lg:col-span-7 order-2 lg:order-1">
                                    <AnimatedText as="div">
                                        <div className="mb-6">
                                            <span className="text-green-500 font-semibold text-sm tracking-wider uppercase">
                                                {language === 'id' ? 'Solusi Digital Terdepan' : 'Leading Digital Solutions'}
                                            </span>
                                        </div>
                                    </AnimatedText>

                                    <AnimatedText as="div">
                                        <Heading variant="h1" color="foreground" className="mb-8 text-[36px] md:text-[44px] lg:text-[52px] xl:text-[56px] font-extrabold leading-[1.1] tracking-tight">
                                            {language === 'id' ? 'Kami Membangun ' : 'We Build '}
                                            <span className="text-green-500 relative inline-block">
                                                <span className="relative z-10">{language === 'id' ? 'Solusi Digital' : 'Digital Solutions'}</span>
                                            </span>
                                            <br />
                                            {language === 'id' ? 'Yang Mendorong Kesuksesan' : 'That Drive Success'}
                                        </Heading>
                                    </AnimatedText>

                                    <AnimatedText as="div">
                                        <Text color="secondary" className="mb-10 text-[16px] md:text-[18px] leading-relaxed max-w-2xl">
                                            {language === 'id'
                                                ? 'Transformasikan bisnis Anda dengan pengembangan web yang canggih, aplikasi mobile, dan solusi pemasaran digital yang disesuaikan dengan kebutuhan Anda.'
                                                : 'Transform your business with cutting-edge web development, mobile apps, and digital marketing solutions tailored to your needs.'
                                            }
                                        </Text>
                                    </AnimatedText>

                                    <AnimatedText as="div">
                                        <div className="flex flex-col sm:flex-row gap-4 mb-12">
                                            <Link href="/about">
                                                <Button variant="primary" size="lg" className="px-8 py-4 text-base font-semibold w-full sm:w-auto bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl">
                                                    {language === 'id' ? 'Konsultasi Gratis' : 'Get Free Consultation'}
                                                </Button>
                                            </Link>
                                            <Link href="/portfolio">
                                                <Button variant="outline" size="lg" className="px-8 py-4 text-base font-semibold border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white w-full sm:w-auto transform hover:scale-105 transition-all duration-300">
                                                    {language === 'id' ? 'Lihat Portfolio Kami' : 'View Our Portfolio'}
                                                </Button>
                                            </Link>
                                        </div>
                                    </AnimatedText>

                                    {/* Hero Image */}
                                </div>

                                {/* Hero Image */}
                                <div className="lg:col-span-5 order-1 lg:order-2">
                                    <AnimatedText as="div">
                                        <div className="relative">
                                            {/* Main Image Container */}
                                            <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-green-500/10 to-blue-500/10">
                                                <div className="absolute inset-0">
                                                    <Image
                                                        src="/images/team-meeting-2.jpg"
                                                        alt={language === 'id' ? 'Tim Bajramedia - Profesional Digital Agency' : 'Bajramedia Team - Professional Digital Agency'}
                                                        fill
                                                        style={{ objectFit: 'cover', objectPosition: 'center' }}
                                                        priority
                                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                                                        className="rounded-3xl transform hover:scale-105 transition-transform duration-700"
                                                        onError={(e) => {
                                                            // Multiple fallback images
                                                            const target = e.target as HTMLImageElement;
                                                            if (target.src.includes('team-meeting-2.jpg')) {
                                                                target.src = '/images/team-meeting.jpg';
                                                            } else if (target.src.includes('team-meeting.jpg')) {
                                                                target.src = '/images/team-meeting-alt.jpg';
                                                            } else if (target.src.includes('team-meeting-alt.jpg')) {
                                                                target.src = '/images/team.jpg';
                                                            }
                                                        }}
                                                    />
                                                </div>

                                                {/* Gradient Overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent rounded-3xl"></div>

                                                {/* Floating Badge */}
                                                <div className="absolute top-6 left-6 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg">
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                                            {language === 'id' ? 'Tim Professional' : 'Professional Team'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Decorative Elements */}
                                            <div className="absolute -top-6 -right-6 w-32 h-32 bg-green-500/10 rounded-full blur-2xl"></div>
                                            <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl"></div>
                                        </div>
                                    </AnimatedText>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* About Section */}
                    <section className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                {/* Text Content */}
                                <div>
                                    <div className="mb-6 flex items-center space-x-2">
                                        <span className="text-green-500 font-medium text-sm tracking-wider uppercase">
                                            {language === 'id' ? 'Tentang Kami' : 'About Us'}
                                        </span>
                                    </div>

                                    <Heading variant="h2" color="foreground" className="mb-6 text-[28px] md:text-[32px] lg:text-[36px] font-extrabold leading-[1.3] tracking-tight">
                                        {language === 'id'
                                            ? 'Menghadirkan Solusi Digital Terdepan untuk Bisnis Anda'
                                            : 'Delivering Cutting-Edge Digital Solutions for Your Business'
                                        }
                                    </Heading>


                                    <Text color="secondary" className="mb-8 text-base leading-relaxed">
                                        {language === 'id'
                                            ? 'Bajra Media (sebelumnya Reduktor Development) adalah perusahaan teknologi yang fokus pada pengembangan software inovatif dan solusi digital terintegrasi. Kami berdedikasi membantu bisnis dari berbagai skala untuk bertransformasi dan berkembang di era digital. Kami adalah partner terpercaya dalam merancang, membangun, dan mengelola teknologi yang mendorong efisiensi operasional serta keunggulan kompetitif untuk klien-klien kami.'
                                            : 'Bajra Media (formerly Reduktor Development) is a technology company specializing in innovative software development and integrated digital solutions. We are dedicated to helping businesses of all sizes transform and thrive in the digital age. We are a trusted partner in designing, building, and managing technology that drives operational efficiency and competitive advantage for our clients.'
                                        }
                                    </Text>

                               

                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <Link href="/about">
                                            <Button variant="primary" size="md" className="px-8 py-4 transform hover:scale-105 transition-all duration-300 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                                                {language === 'id' ? 'Pelajari Lebih Lanjut' : 'Learn More'}
                                            </Button>
                                        </Link>
                                        <Link href="/portfolio">
                                            <Button variant="outline" size="md" className="px-8 py-4 border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white transform hover:scale-105 transition-all duration-300">
                                                {language === 'id' ? 'Lihat Portfolio' : 'View Portfolio'}
                                            </Button>
                                        </Link>
                                    </div>
                                </div>

                                {/* Image */}
                                <div className="relative">
                                    <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-2xl">
                                        <Image
                                            src="/images/team.jpg"
                                            alt={language === 'id' ? 'Tim Bajramedia' : 'Bajramedia Team'}
                                            fill
                                            style={{ objectFit: 'cover' }}
                                            className="rounded-2xl transform hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-green-500/20 via-transparent to-transparent"></div>

                                        {/* Floating Card */}
                                        <div className="absolute bottom-6 left-6 right-6 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {language === 'id' ? 'Tim Professional Siap Membantu Anda' : 'Professional Team Ready to Help You'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Decorative Elements */}
                                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-green-500/10 rounded-full blur-xl"></div>
                                    <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"></div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Testimonials Section */}
                    <section className="py-16 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-12">
                                <div className="mb-6 flex items-center justify-center space-x-2">
                                    <span className="text-green-500 font-medium text-sm tracking-wider uppercase">
                                        {language === 'id' ? 'Testimoni Klien' : 'Client Testimonials'}
                                    </span>
                                </div>

                                <Heading variant="h2" color="foreground" className="mb-4 text-[28px] md:text-[32px] lg:text-[36px] font-extrabold">
                                    {language === 'id' ? 'Kata Mereka Tentang Kami' : 'What They Say About Us'}
                                </Heading>

                                <Text color="secondary" className="max-w-2xl mx-auto text-base leading-relaxed">
                                    {language === 'id'
                                        ? 'Kepercayaan klien adalah prioritas utama kami. Berikut testimoni dari klien yang telah merasakan layanan terbaik dari Bajramedia.'
                                        : 'Client trust is our top priority. Here are testimonials from clients who have experienced the best service from Bajramedia.'
                                    }
                                </Text>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {/* Testimonial 1 */}
                                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-200 dark:border-gray-600">
                                    <div className="flex items-center mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <Text color="secondary" className="mb-6 italic text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                                        &quot;{t('testimonials.1.text') || 'Bajramedia sangat membantu kami dalam mengembangkan website perusahaan. Tim mereka sangat profesional dan responsif.'}&quot;
                                    </Text>
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                                            A
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900 dark:text-white">{t('testimonials.1.author') || 'John Doe'}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">{t('testimonials.1.position') || 'CEO, Tech Corp'}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Testimonial 2 */}
                                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-200 dark:border-gray-600">
                                    <div className="flex items-center mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <Text color="secondary" className="mb-6 italic text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                                        &quot;{t('testimonials.2.text') || 'Desain yang mereka buat sangat modern dan sesuai dengan kebutuhan kami. Sangat merekomendasikan!'}&quot;
                                    </Text>
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                                            S
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900 dark:text-white">{t('testimonials.2.author') || 'Jane Smith'}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">{t('testimonials.2.position') || 'Marketing Director, Creative Agency'}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Testimonial 3 */}
                                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-200 dark:border-gray-600">
                                    <div className="flex items-center mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <Text color="secondary" className="mb-6 italic text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                                        &quot;{t('testimonials.3.text') || 'Proses pengembangan aplikasi berjalan lancar dan tepat waktu. Hasil akhirnya memuaskan!'}&quot;
                                    </Text>
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                                            R
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900 dark:text-white">{t('testimonials.3.author') || 'Mike Johnson'}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">{t('testimonials.3.position') || 'Product Manager, Startup Inc'}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Services Section */}
                    <ServicesOverview showFeatures={false} showAllServices={false} />

                    {/* Why Choose Us Section */}
                    <section className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-16">
                                <AnimatedText as="div">
                                    <span className="text-green-500 font-medium text-sm tracking-wider uppercase mb-6 block">
                                        {language === 'id' ? 'Mengapa Memilih Kami' : 'Why Choose Us'}
                                    </span>
                                    <Heading variant="h2" color="foreground" className="mb-4 text-[28px] md:text-[32px] lg:text-[36px] font-extrabold">
                                        {language === 'id' ? 'Keunggulan Bajramedia' : 'Bajramedia Advantages'}
                                    </Heading>
                                    <Text color="secondary" className="max-w-3xl mx-auto text-base leading-relaxed">
                                        {language === 'id'
                                            ? 'Kami memberikan nilai lebih dengan kombinasi keahlian teknis, kreativitas, dan komitmen untuk kesuksesan proyek Anda.'
                                            : 'We provide added value with a combination of technical expertise, creativity, and commitment to your project success.'
                                        }
                                    </Text>
                                </AnimatedText>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {/* Advantage 1 */}
                                <AnimatedText as="div">
                                    <div className="text-center">
                                        <div className="w-20 h-20 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                            {language === 'id' ? 'Kualitas Terjamin' : 'Quality Guaranteed'}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                            {language === 'id'
                                                ? 'Setiap proyek dikerjakan dengan standar kualitas tinggi dan testing menyeluruh sebelum delivery.'
                                                : 'Every project is executed with high quality standards and comprehensive testing before delivery.'
                                            }
                                        </p>
                                    </div>
                                </AnimatedText>

                                {/* Advantage 2 */}
                                <AnimatedText as="div">
                                    <div className="text-center">
                                        <div className="w-20 h-20 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                            <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                            {language === 'id' ? 'Tepat Waktu' : 'On Time Delivery'}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                            {language === 'id'
                                                ? 'Kami berkomitmen menyelesaikan proyek sesuai timeline yang telah disepakati dengan manajemen waktu yang baik.'
                                                : 'We are committed to completing projects according to agreed timelines with good time management.'
                                            }
                                        </p>
                                    </div>
                                </AnimatedText>

                                {/* Advantage 3 */}
                                <AnimatedText as="div">
                                    <div className="text-center">
                                        <div className="w-20 h-20 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                            <svg className="w-10 h-10 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                            {language === 'id' ? 'Support 24/7' : '24/7 Support'}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                            {language === 'id'
                                                ? 'Tim support kami siap membantu Anda kapan saja untuk memastikan sistem berjalan dengan lancar.'
                                                : 'Our support team is ready to help you anytime to ensure the system runs smoothly.'
                                            }
                                        </p>
                                    </div>
                                </AnimatedText>

                                {/* Advantage 4 */}
                                <AnimatedText as="div">
                                    <div className="text-center">
                                        <div className="w-20 h-20 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                            {language === 'id' ? 'Harga Terjangkau' : 'Affordable Price'}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                            {language === 'id'
                                                ? 'Solusi digital berkualitas tinggi dengan harga yang kompetitif dan sesuai dengan budget Anda.'
                                                : 'High-quality digital solutions at competitive prices that fit your budget.'
                                            }
                                        </p>
                                    </div>
                                </AnimatedText>
                            </div>
                        </div>
                    </section>

                    {/* Blog Section */}
                    <Blog />

                    {/* Portfolio Section */}
                    <Portfolio />

                    {/* Process Section */}
                    <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-16">
                                <AnimatedText as="div">
                                    <span className="text-green-500 font-medium text-sm tracking-wider uppercase mb-6 block">
                                        {language === 'id' ? 'Proses Kerja' : 'Work Process'}
                                    </span>
                                    <Heading variant="h2" color="foreground" className="mb-4 text-[28px] md:text-[32px] lg:text-[36px] font-extrabold">
                                        {language === 'id' ? 'Bagaimana Kami Bekerja' : 'How We Work'}
                                    </Heading>
                                    <Text color="secondary" className="max-w-3xl mx-auto text-base leading-relaxed">
                                        {language === 'id'
                                            ? 'Proses kerja yang terstruktur dan transparan untuk memastikan hasil terbaik bagi proyek Anda.'
                                            : 'Structured and transparent work process to ensure the best results for your project.'
                                        }
                                    </Text>
                                </AnimatedText>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {/* Step 1 */}
                                <AnimatedText as="div">
                                    <div className="text-center relative">
                                        <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl">
                                            1
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                            {language === 'id' ? 'Konsultasi' : 'Consultation'}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                            {language === 'id'
                                                ? 'Diskusi mendalam tentang kebutuhan, tujuan, dan visi proyek Anda.'
                                                : 'In-depth discussion about your project needs, goals, and vision.'
                                            }
                                        </p>
                                    </div>
                                </AnimatedText>

                                {/* Step 2 */}
                                <AnimatedText as="div">
                                    <div className="text-center relative">
                                        <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl">
                                            2
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                            {language === 'id' ? 'Perencanaan' : 'Planning'}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                            {language === 'id'
                                                ? 'Pembuatan roadmap detail, timeline, dan spesifikasi teknis proyek.'
                                                : 'Creating detailed roadmap, timeline, and technical specifications.'
                                            }
                                        </p>
                                    </div>
                                </AnimatedText>

                                {/* Step 3 */}
                                <AnimatedText as="div">
                                    <div className="text-center relative">
                                        <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl">
                                            3
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                            {language === 'id' ? 'Pengembangan' : 'Development'}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                            {language === 'id'
                                                ? 'Eksekusi proyek dengan update berkala dan komunikasi yang transparan.'
                                                : 'Project execution with regular updates and transparent communication.'
                                            }
                                        </p>
                                    </div>
                                </AnimatedText>

                                {/* Step 4 */}
                                <AnimatedText as="div">
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl">
                                            4
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                            {language === 'id' ? 'Delivery & Support' : 'Delivery & Support'}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                            {language === 'id'
                                                ? 'Penyerahan proyek yang telah teruji dan dukungan berkelanjutan.'
                                                : 'Delivery of tested project and ongoing support.'
                                            }
                                        </p>
                                    </div>
                                </AnimatedText>
                            </div>
                        </div>
                    </section>

                    {/* FAQ Section */}
                    <section className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
                        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-16">
                                <AnimatedText as="div">
                                    <span className="text-green-500 font-medium text-sm tracking-wider uppercase mb-6 block">
                                        {language === 'id' ? 'Pertanyaan Umum' : 'FAQ'}
                                    </span>
                                    <Heading variant="h2" color="foreground" className="mb-4 text-[28px] md:text-[32px] lg:text-[36px] font-extrabold">
                                        {language === 'id' ? 'Pertanyaan yang Sering Diajukan' : 'Frequently Asked Questions'}
                                    </Heading>
                                    <Text color="secondary" className="max-w-3xl mx-auto text-base leading-relaxed">
                                        {language === 'id'
                                            ? 'Temukan jawaban untuk pertanyaan-pertanyaan yang paling sering diajukan tentang layanan kami.'
                                            : 'Find answers to the most frequently asked questions about our services.'
                                        }
                                    </Text>
                                </AnimatedText>
                            </div>

                            <div className="space-y-6">
                                {/* FAQ 1 */}
                                <AnimatedText as="div">
                                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                                            {language === 'id' ? 'Berapa lama waktu pengerjaan proyek website?' : 'How long does it take to complete a website project?'}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                            {language === 'id'
                                                ? 'Waktu pengerjaan bervariasi tergantung kompleksitas proyek. Website company profile biasanya 2-4 minggu, sedangkan web aplikasi kompleks bisa 2-6 bulan. Kami akan memberikan estimasi waktu yang akurat setelah analisis kebutuhan.'
                                                : 'Development time varies depending on project complexity. Company profile websites typically take 2-4 weeks, while complex web applications can take 2-6 months. We will provide accurate time estimates after requirements analysis.'
                                            }
                                        </p>
                                    </div>
                                </AnimatedText>

                                {/* FAQ 2 */}
                                <AnimatedText as="div">
                                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                                            {language === 'id' ? 'Apakah ada garansi untuk proyek yang dikerjakan?' : 'Is there a warranty for completed projects?'}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                            {language === 'id'
                                                ? 'Ya, kami memberikan garansi 3 bulan untuk bug fixing dan 1 tahun untuk maintenance support. Kami juga menyediakan paket maintenance berkelanjutan dengan harga yang kompetitif.'
                                                : 'Yes, we provide a 3-month warranty for bug fixing and 1 year for maintenance support. We also offer ongoing maintenance packages at competitive prices.'
                                            }
                                        </p>
                                    </div>
                                </AnimatedText>

                                {/* FAQ 3 */}
                                <AnimatedText as="div">
                                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                                            {language === 'id' ? 'Bagaimana sistem pembayaran dan apakah bisa dicicil?' : 'How is the payment system and can it be paid in installments?'}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                            {language === 'id'
                                                ? 'Kami menerima pembayaran dengan sistem cicilan: 30% di awal, 40% saat development, dan 30% saat selesai. Pembayaran bisa melalui transfer bank, e-wallet, atau payment gateway lainnya.'
                                                : 'We accept payments with installment system: 30% at the start, 40% during development, and 30% upon completion. Payment can be made via bank transfer, e-wallet, or other payment gateways.'
                                            }
                                        </p>
                                    </div>
                                </AnimatedText>

                                {/* FAQ 4 */}
                                <AnimatedText as="div">
                                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                                            {language === 'id' ? 'Apakah bisa request revisi setelah proyek selesai?' : 'Can I request revisions after the project is completed?'}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                            {language === 'id'
                                                ? 'Tentu saja! Kami memberikan 2 kali revisi gratis dalam periode garansi. Revisi tambahan akan dikenakan biaya sesuai dengan kompleksitas perubahan yang diminta.'
                                                : 'Of course! We provide 2 free revisions during the warranty period. Additional revisions will be charged according to the complexity of the requested changes.'
                                            }
                                        </p>
                                    </div>
                                </AnimatedText>
                            </div>

                            <div className="text-center mt-12">
                                <AnimatedText as="div">
                                    <Text color="secondary" className="mb-6 text-base">
                                        {language === 'id' ? 'Masih ada pertanyaan lain?' : 'Still have other questions?'}
                                    </Text>
                                    <Link href="/about">
                                        <Button variant="primary" size="lg" className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-300">
                                            {language === 'id' ? 'Hubungi Kami' : 'Contact Us'}
                                        </Button>
                                    </Link>
                                </AnimatedText>
                            </div>
                        </div>
                    </section>

                    {/* CTA Section */}
                    <CTA />
                </main>

                {/* Footer */}
                {/* Footer will be handled by ClientLayout */}

                {/* Floating Dark Mode Toggle Button */}
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

                {/* WhatsApp Chat */}
                <WhatsAppChat
                    phoneNumber="6285739402436"
                    message="Halo! Saya tertarik dengan layanan Bajramedia. Bisa konsultasi gratis?"
                />
            </div>
        </>
    );
}


