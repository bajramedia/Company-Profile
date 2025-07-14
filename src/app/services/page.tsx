"use client";

import Link from "next/link";
import { Button, Heading, Navbar, AnimatedText, WhatsAppChat, ServicesOverview } from "@/components";
import { useLanguage } from "@/context/LanguageContext";

export default function ServicesPage() {
    const { t, language } = useLanguage();

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
            {/* Header */}
            <Navbar variant="solid" activeTab="services" />

            {/* Breadcrumb */}
            <div className="pt-20 pb-6 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
                <div className="w-[95%] mx-auto px-4 sm:px-6 md:px-8">
                    <nav className="flex items-center space-x-2 text-sm">
                        <Link href="/" className="text-gray-500 dark:text-gray-400 hover:text-[#00D084] transition-colors">
                            {t('nav.home') || 'Home'}
                        </Link>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-[#00D084] font-medium">{t('nav.services') || 'Services'}</span>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <main>
                {/* Hero Section */}
                <section className="w-[95%] mx-auto px-4 sm:px-6 md:px-8 mb-20">
                    <div className="text-center">
                        <AnimatedText as="div">
                            <Heading variant="h1" color="foreground" className="mb-6 text-[32px] md:text-[40px] lg:text-[48px] font-bold" data-aos="fade-up">
                                {t('services.page.title.main')} {' '}
                                <span className="text-[#00D084] relative">
                                    <span className="relative z-10">{t('services.page.title.highlight')}</span>
                                    <span className="absolute bottom-1 left-0 w-full h-3 bg-[#00D084]/10 -z-0"></span>
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
                <ServicesOverview showFeatures={true} showAllServices={true} />

                {/* CTA Section */}
                <section className="w-[95%] mx-auto px-4 sm:px-6 md:px-8 mt-20">
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
                            <h3 className="text-2xl md:text-3xl font-bold mb-4">
                                {language === 'id' ? 'Siap Memulai Proyek?' : 'Ready to Start Your Project?'}
                            </h3>
                            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                                {language === 'id'
                                    ? 'Konsultasikan kebutuhan digital Anda dengan tim kami dan dapatkan solusi terbaik untuk bisnis Anda.'
                                    : 'Consult your digital needs with our team and get the best solution for your business.'
                                }
                            </p>
                            <Link href="/contact">
                                <Button variant="primary" size="lg" className="bg-[#00D084] hover:bg-[#00B873] text-white px-8 py-4 rounded-full transform hover:scale-105 transition-all duration-300">
                                    {language === 'id' ? 'Mulai Konsultasi Gratis' : 'Start Free Consultation'}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            {/* WhatsApp Chat */}
            <WhatsAppChat
                phoneNumber="6285739402436"
                message="Halo! Saya tertarik dengan layanan Bajramedia. Bisa konsultasi gratis?"
            />
        </div>
    );
} 