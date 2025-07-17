"use client";

import { Heading, Navbar, WhatsAppChat } from "@/components";
import DarkModeToggle from "@/components/DarkModeToggle";
import { Settings, Database, Shield, BarChart } from 'lucide-react';
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

export default function SystemDevelopmentPage() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
            {/* Header */}
            <Navbar variant="solid" activeTab="services" />

            {/* Breadcrumb */}
            <div className="pt-20 pb-6 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
                <div className="container mx-auto px-4">
                    <nav className="flex items-center space-x-2 text-sm">
                        <Link href="/" className="text-gray-500 dark:text-gray-400 hover:text-[#00D084] transition-colors">
                            {t('nav.home') || 'Home'}
                        </Link>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                        <Link href="/services" className="text-gray-500 dark:text-gray-400 hover:text-[#00D084] transition-colors">
                            {t('nav.services') || 'Services'}
                        </Link>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-[#00D084] font-medium">{t('services.system.breadcrumb') || 'System Development'}</span>
                    </nav>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-16">
                    <Heading variant="h1" color="foreground" className="mb-4 text-[32px] md:text-[40px] lg:text-[48px] font-bold">
                        {t('services.system.title') || 'Jasa Sistem Development'}
                    </Heading>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        {t('services.system.description') || 'Kami menyediakan jasa pembuatan sistem dan aplikasi enterprise untuk mengoptimalkan proses bisnis Anda'}
                    </p>
                        </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Basic Package */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-8 hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800 flex flex-col">
                        <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                            {t('services.system.basic.title') || 'Basic System'}
                        </h3>
                        <p className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                            {t('services.system.basic.price') || 'Rp 10.000.000'}<span className="text-base font-normal text-gray-600 dark:text-gray-400">/sistem</span>
                        </p>
                        <ul className="space-y-3 mb-8 flex-grow">
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.system.basic.features.modules') || '3 modul utama'}</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.system.basic.features.users') || '5 user'}</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.system.basic.features.support') || 'Support 1 bulan'}</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.system.basic.features.training') || 'Training 1x'}</span>
                            </li>
                        </ul>
                        <Link href="https://wa.me/6285739402436?text=Halo%20saya%20tertarik%20dengan%20paket%20Basic%20System" className="block">
                            <button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300">
                                {t('common.contactUs') || 'Hubungi Kami'}
                            </button>
                        </Link>
                    </div>

                    {/* Pro Package */}
                    <div className="border-2 border-green-500 dark:border-green-400 rounded-lg p-8 hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800 flex flex-col relative">
                        {/* Badge Populer di tengah atas */}
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                            {t('common.popular') || 'POPULER'}
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                            {t('services.system.pro.title') || 'Pro System'}
                        </h3>
                        <p className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                            {t('services.system.pro.price') || 'Rp 20.000.000'}<span className="text-base font-normal text-gray-600 dark:text-gray-400">/sistem</span>
                        </p>
                        <ul className="space-y-3 mb-8 flex-grow">
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.system.pro.features.modules') || '6 modul utama'}</span>
                                    </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.system.pro.features.users') || '15 user'}</span>
                                    </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.system.pro.features.support') || 'Support 3 bulan'}</span>
                                    </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.system.pro.features.training') || 'Training 3x'}</span>
                                    </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.system.pro.features.api') || 'API integration'}</span>
                                    </li>
                                </ul>
                        <Link href="https://wa.me/6285739402436?text=Halo%20saya%20tertarik%20dengan%20paket%20Pro%20System" className="block">
                            <button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300">
                                {t('common.contactUs') || 'Hubungi Kami'}
                            </button>
                        </Link>
                        </div>

                    {/* Enterprise Package */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-8 hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800 flex flex-col">
                        <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                            {t('services.system.enterprise.title') || 'Enterprise System'}
                        </h3>
                        <p className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                            {t('services.system.enterprise.price') || 'Custom'}<span className="text-base font-normal text-gray-600 dark:text-gray-400">/project</span>
                        </p>
                        <ul className="space-y-3 mb-8 flex-grow">
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.system.enterprise.features.modules') || 'Unlimited modul'}</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.system.enterprise.features.users') || 'Unlimited user'}</span>
                                    </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.system.enterprise.features.support') || 'Support 6 bulan'}</span>
                                    </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.system.enterprise.features.training') || 'Training unlimited'}</span>
                                    </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.system.enterprise.features.custom') || 'Custom integration'}</span>
                                    </li>
                                </ul>
                        <Link href="https://wa.me/6285739402436?text=Halo%20saya%20tertarik%20dengan%20paket%20Enterprise%20System" className="block">
                            <button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300">
                                {t('common.contactUs') || 'Hubungi Kami'}
                            </button>
                        </Link>
                        </div>
                    </div>

                    {/* Features Section */}
                    <div className="mb-20">
                        <div className="text-center mb-12">
                            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                                {t('services.system.features.title') || 'Fitur Unggulan'}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                                {t('services.system.features.description') || 'Sistem yang kami kembangkan dilengkapi dengan fitur-fitur modern'}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
                                <div className="text-4xl mb-3 text-blue-500 flex justify-center">
                                    <Settings className="w-12 h-12" />
                                </div>
                                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
                                    {t('services.system.features.customization.title') || 'Customizable'}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {t('services.system.features.customization.desc') || 'Sistem yang dapat disesuaikan'}
                                </p>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
                                <div className="text-4xl mb-3 text-green-500 flex justify-center">
                                    <Database className="w-12 h-12" />
                                </div>
                                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
                                    {t('services.system.features.database.title') || 'Database'}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {t('services.system.features.database.desc') || 'Database yang terstruktur'}
                                </p>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
                                <div className="text-4xl mb-3 text-red-500 flex justify-center">
                                    <Shield className="w-12 h-12" />
                                </div>
                                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
                                    {t('services.system.features.security.title') || 'Security'}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {t('services.system.features.security.desc') || 'Keamanan tingkat tinggi'}
                                </p>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
                                <div className="text-4xl mb-3 text-orange-500 flex justify-center">
                                    <BarChart className="w-12 h-12" />
                                </div>
                                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
                                    {t('services.system.features.analytics.title') || 'Analytics'}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {t('services.system.features.analytics.desc') || 'Laporan dan analisis'}
                                </p>
                            </div>
                        </div>
                    </div>
            </div>

            {/* Dark Mode Toggle */}
            <DarkModeToggle />

            {/* WhatsApp Chat */}
            <WhatsAppChat
                phoneNumber="6285739402436"
                message="Halo! Saya tertarik dengan layanan System Development Bajramedia. Bisa konsultasi gratis?"
            />
        </div>
    );
} 
