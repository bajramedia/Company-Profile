"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { Button, Heading, Text, AnimatedText } from "@/components";

export default function HeroSection() {
    const { language } = useLanguage();

    return (
        <section className="relative min-h-screen bg-gradient-to-br from-white via-gray-50 to-green-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-all duration-300 pt-20 overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute inset-0 overflow-hidden z-0">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-[95%] mx-auto px-4 sm:px-6 lg:px-8 h-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-screen py-20">

                    {/* Text Content */}
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

                        {/* Stats */}
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

                    {/* Hero Image */}
                    <div className="order-1 lg:order-2">
                        <AnimatedText as="div">
                            <div className="relative">
                                {/* Main Image Container */}
                                <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
                                    <Image
                                        src="/images/team-meeting-2.jpg"
                                        alt={language === 'id' ? 'Tim Bajramedia - Profesional Digital Agency' : 'Bajramedia Team - Professional Digital Agency'}
                                        fill
                                        style={{ objectFit: 'cover', objectPosition: 'center' }}
                                        priority
                                        className="rounded-3xl transform hover:scale-105 transition-transform duration-700"
                                        onError={(e) => {
                                            // Fallback ke gambar lain jika yang pertama gagal
                                            const target = e.target as HTMLImageElement;
                                            if (target.src.includes('team-meeting-2.jpg')) {
                                                target.src = '/images/team-meeting.jpg';
                                            } else if (target.src.includes('team-meeting.jpg')) {
                                                target.src = '/images/team.jpg';
                                            }
                                        }}
                                    />

                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-3xl"></div>

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

                                {/* Logo Float */}
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
    );
} 