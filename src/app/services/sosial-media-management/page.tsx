"use client";

import { Heading, Navbar, WhatsAppChat } from "@/components";
import { Instagram, MessageCircle, TrendingUp, BarChart2 } from 'lucide-react';
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

export default function SocialMediaManagementPage() {
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
                        <span className="text-[#00D084] font-medium">{t('services.social.breadcrumb') || 'Social Media Management'}</span>
                    </nav>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-16">
                    <Heading variant="h1" color="foreground" className="mb-4 text-[32px] md:text-[40px] lg:text-[48px] font-bold">
                        {t('services.social.title') || 'Jasa Social Media Management'}
                    </Heading>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        {t('services.social.description') || 'Kami menyediakan jasa pengelolaan media sosial profesional untuk meningkatkan presence dan engagement brand Anda'}
                    </p>
                </div>

                {/* Features Section */}
                <div className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                            {t('services.social.features.title') || 'Layanan Unggulan'}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            {t('services.social.features.description') || 'Layanan sosial media yang kami sediakan'}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
                            <div className="text-4xl mb-3 text-pink-500 flex justify-center">
                                <Instagram className="w-12 h-12" />
                            </div>
                            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
                                {t('services.social.features.content.title') || 'Content Creation'}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {t('services.social.features.content.desc') || 'Pembuatan konten menarik'}
                            </p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
                            <div className="text-4xl mb-3 text-blue-500 flex justify-center">
                                <MessageCircle className="w-12 h-12" />
                            </div>
                            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
                                {t('services.social.features.engagement.title') || 'Engagement'}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {t('services.social.features.engagement.desc') || 'Interaksi dengan followers'}
                            </p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
                            <div className="text-4xl mb-3 text-green-500 flex justify-center">
                                <TrendingUp className="w-12 h-12" />
                            </div>
                            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
                                {t('services.social.features.growth.title') || 'Growth Strategy'}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {t('services.social.features.growth.desc') || 'Strategi pertumbuhan'}
                            </p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
                            <div className="text-4xl mb-3 text-purple-500 flex justify-center">
                                <BarChart2 className="w-12 h-12" />
                            </div>
                            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
                                {t('services.social.features.analytics.title') || 'Analytics'}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {t('services.social.features.analytics.desc') || 'Laporan performa'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Basic Package */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-8 hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800 flex flex-col">
                        <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                            {t('services.social.basic.title') || 'Basic Social Media'}
                        </h3>
                        <p className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                            {t('services.social.basic.price') || 'Rp 2.000.000'}<span className="text-base font-normal text-gray-600 dark:text-gray-400">/bulan</span>
                        </p>
                        <ul className="space-y-3 mb-8 flex-grow">
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.social.basic.features.posts') || '12 post/bulan'}</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.social.basic.features.platform') || '1 platform'}</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.social.basic.features.report') || 'Report bulanan'}</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.social.basic.features.admin') || '1 admin'}</span>
                            </li>
                        </ul>
                        <Link href="https://wa.me/6285739402436?text=Halo%20saya%20tertarik%20dengan%20paket%20Basic%20Social%20Media" className="block">
                            <button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300">
                                {t('common.contactUs') || 'Hubungi Kami'}
                            </button>
                        </Link>
                    </div>

                    {/* Pro Package */}
                    <div className="border-2 border-green-500 dark:border-green-400 rounded-lg p-8 hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800 flex flex-col relative">
                        <div className="absolute top-0 right-0 bg-green-500 text-white px-4 py-1 rounded-bl-lg rounded-tr-lg text-sm font-semibold">
                            {t('common.popular') || 'POPULER'}
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                            {t('services.social.pro.title') || 'Pro Social Media'}
                        </h3>
                        <p className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                            {t('services.social.pro.price') || 'Rp 3.500.000'}<span className="text-base font-normal text-gray-600 dark:text-gray-400">/bulan</span>
                        </p>
                        <ul className="space-y-3 mb-8 flex-grow">
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.social.pro.features.posts') || '20 post/bulan'}</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.social.pro.features.platform') || '2 platform'}</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.social.pro.features.report') || 'Report mingguan'}</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.social.pro.features.admin') || '2 admin'}</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.social.pro.features.ads') || 'Basic ads management'}</span>
                            </li>
                        </ul>
                        <Link href="https://wa.me/6285739402436?text=Halo%20saya%20tertarik%20dengan%20paket%20Pro%20Social%20Media" className="block">
                            <button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300">
                                {t('common.contactUs') || 'Hubungi Kami'}
                            </button>
                        </Link>
                    </div>

                    {/* Enterprise Package */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-8 hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800 flex flex-col">
                        <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                            {t('services.social.enterprise.title') || 'Enterprise Social Media'}
                        </h3>
                        <p className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                            {t('services.social.enterprise.price') || 'Custom'}<span className="text-base font-normal text-gray-600 dark:text-gray-400">/project</span>
                        </p>
                        <ul className="space-y-3 mb-8 flex-grow">
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.social.enterprise.features.posts') || 'Unlimited post'}</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.social.enterprise.features.platform') || 'All platform'}</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.social.enterprise.features.report') || 'Report harian'}</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.social.enterprise.features.admin') || 'Dedicated team'}</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.social.enterprise.features.ads') || 'Full ads management'}</span>
                            </li>
                        </ul>
                        <Link href="https://wa.me/6285739402436?text=Halo%20saya%20tertarik%20dengan%20paket%20Enterprise%20Social%20Media" className="block">
                            <button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300">
                                {t('common.contactUs') || 'Hubungi Kami'}
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* WhatsApp Chat */}
            <WhatsAppChat
                phoneNumber="6285739402436"
                message="Halo! Saya tertarik dengan layanan Social Media Management Bajramedia. Bisa konsultasi gratis?"
            />
        </div>
    );
} 
