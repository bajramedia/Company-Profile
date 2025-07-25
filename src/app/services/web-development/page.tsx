"use client";

import { Heading, Navbar, WhatsAppChat } from "@/components";
import { Globe, Code2, Database, Server, Cpu, Lock } from 'lucide-react';
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import Image from "next/image";
import DarkModeToggle from "@/components/DarkModeToggle";

export default function WebDevelopmentPage() {
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
                        <span className="text-[#00D084] font-medium">{t('services.webdev.breadcrumb') || 'Web Development'}</span>
                    </nav>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-16">
                    <Heading variant="h1" color="foreground" className="mb-4 text-[32px] md:text-[40px] lg:text-[48px] font-bold">
                        {t('services.webdev.title') || 'Jasa Web Development'}
                            </Heading>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        {t('services.webdev.description') || 'Kami menyediakan jasa pembuatan website profesional dengan teknologi modern dan performa tinggi'}
                    </p>
                    </div>

                {/* Technologies Section */}
                <div className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                            {t('services.webdev.tech.title') || 'Teknologi yang Kami Gunakan'}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            {t('services.webdev.tech.description') || 'Stack modern yang terpercaya untuk menghasilkan website berkualitas tinggi'}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-white/5 backdrop-blur-sm">
                            <Image src="/next.svg" alt="Next.js" width={40} height={40} className="mb-2" />
                            <h3 className="text-lg font-semibold text-center">
                                {t('services.webdev.tech.nextjs.title') || 'Next.js'}
                            </h3>
                            <p className="text-sm text-center text-gray-400">
                                {t('services.webdev.tech.nextjs.desc') || 'Modern React Framework'}
                            </p>
                        </div>

                        <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-white/5 backdrop-blur-sm">
                            <div className="text-purple-500 mb-2 text-3xl">
                                <code>&lt;/&gt;</code>
                                </div>
                            <h3 className="text-lg font-semibold text-center">
                                {t('services.webdev.tech.typescript.title') || 'TypeScript'}
                            </h3>
                            <p className="text-sm text-center text-gray-400">
                                {t('services.webdev.tech.typescript.desc') || 'Type-Safe JavaScript'}
                            </p>
                        </div>

                        <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-white/5 backdrop-blur-sm">
                            <Image src="/mysql-icon.svg" alt="MySQL" width={40} height={40} className="mb-2" />
                            <h3 className="text-lg font-semibold text-center">
                                {t('services.webdev.tech.mysql.title') || 'MySQL'}
                            </h3>
                            <p className="text-sm text-center text-gray-400">
                                {t('services.webdev.tech.mysql.desc') || 'Powerful Database'}
                            </p>
                                    </div>

                        <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-white/5 backdrop-blur-sm">
                            <Image src="/images/nodejs.svg" alt="Node.js" width={40} height={40} className="mb-2" />
                            <h3 className="text-lg font-semibold text-center">
                                {t('services.webdev.tech.nodejs.title') || 'Node.js'}
                                    </h3>
                            <p className="text-sm text-center text-gray-400">
                                {t('services.webdev.tech.nodejs.desc') || 'Server Runtime'}
                                    </p>
                                </div>

                        <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-white/5 backdrop-blur-sm">
                            <Image src="/laravel.svg" alt="Laravel" width={40} height={40} className="mb-2" />
                            <h3 className="text-lg font-semibold text-center">
                                {t('services.webdev.tech.laravel.title') || 'Laravel'}
                            </h3>
                            <p className="text-sm text-center text-gray-400">
                                {t('services.webdev.tech.laravel.desc') || 'PHP Framework'}
                            </p>
                        </div>

                        <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-white/5 backdrop-blur-sm">
                            <Image src="/vuejs.svg" alt="Vue.js" width={40} height={40} className="mb-2" />
                            <h3 className="text-lg font-semibold text-center">
                                {t('services.webdev.tech.vuejs.title') || 'Vue.js'}
                            </h3>
                            <p className="text-sm text-center text-gray-400">
                                {t('services.webdev.tech.vuejs.desc') || 'Progressive Framework'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Pricing Section */}
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Basic Package */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-8 hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800 flex flex-col">
                        <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                            {t('services.webdev.basic.title') || 'Basic Website'}
                        </h3>
                        <p className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                            {t('services.webdev.basic.price') || 'Rp 1.500.000'}<span className="text-base font-normal text-gray-600 dark:text-gray-400">/website</span>
                        </p>
                        <ul className="space-y-3 mb-8 flex-grow">
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.webdev.basic.features.pages') || '5 halaman website'}</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.webdev.basic.features.responsive') || 'Desain responsif'}</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.webdev.basic.features.seo') || 'Basic SEO'}</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.webdev.basic.features.contact') || 'Form kontak'}</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.webdev.basic.features.support') || 'Support 1 bulan'}</span>
                            </li>
                        </ul>
                        <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg transition-colors duration-300 mt-auto">
                            {t('common.choosePackage') || 'Pilih Paket Basic'}
                        </button>
                    </div>

                    {/* Pro Package */}
                    <div className="border-2 border-green-500 dark:border-green-400 rounded-lg p-8 hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800 flex flex-col relative">
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                            {t('common.popular') || 'POPULER'}
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                            {t('services.webdev.pro.title') || 'Pro Website'}
                        </h3>
                        <p className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                            {t('services.webdev.pro.price') || 'Rp 3.000.000'}<span className="text-base font-normal text-gray-600 dark:text-gray-400">/website</span>
                        </p>
                        <ul className="space-y-3 mb-8 flex-grow">
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.webdev.pro.features.pages') || '10 halaman website'}</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.webdev.pro.features.cms') || 'CMS Admin'}</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.webdev.pro.features.database') || 'Database custom'}</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.webdev.pro.features.analytics') || 'Analytics & tracking'}</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.webdev.pro.features.support') || 'Support 3 bulan'}</span>
                            </li>
                        </ul>
                        <button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg transition-colors duration-300">
                            {t('common.choosePackage') || 'Pilih Paket Pro'}
                        </button>
                        </div>

                    {/* Enterprise Package */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-8 hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800 flex flex-col">
                        <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                            {t('services.webdev.enterprise.title') || 'Enterprise Website'}
                        </h3>
                        <p className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                            {t('services.webdev.enterprise.price') || 'Rp 10.000.000'}<span className="text-base font-normal text-gray-600 dark:text-gray-400">/website</span>
                        </p>
                        <ul className="space-y-3 mb-8 flex-grow">
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.webdev.enterprise.features.unlimited') || 'Halaman unlimited'}</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.webdev.enterprise.features.custom') || 'Fitur custom'}</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.webdev.enterprise.features.api') || 'API Integration'}</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.webdev.enterprise.features.security') || 'Advanced security'}</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.webdev.enterprise.features.support') || 'Support 12 bulan'}</span>
                            </li>
                        </ul>
                        <button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg transition-colors duration-300">
                            {t('common.choosePackage') || 'Pilih Paket Enterprise'}
                        </button>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="mt-16 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                        {t('services.webdev.cta.title') || 'Siap untuk membuat website impian Anda?'}
                            </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                        {t('services.webdev.cta.description') || 'Konsultasikan kebutuhan website Anda dengan tim kami dan dapatkan solusi terbaik'}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/portfolio" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors duration-300">
                            {t('services.webdev.cta.portfolio') || 'Lihat Portfolio'}
                        </Link>
                        <button className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-green-600 bg-green-100 hover:bg-green-200 transition-colors duration-300">
                            {t('services.webdev.cta.consultation') || 'Konsultasi Gratis'}
                        </button>
                    </div>
                </div>

                {/* Dark Mode Toggle */}
                <DarkModeToggle />

                {/* WhatsApp Chat */}
                <WhatsAppChat message={t('services.webdev.whatsapp') || "Halo, saya tertarik dengan layanan web development Bajramedia"} />
            </div>
        </div>
    );
} 