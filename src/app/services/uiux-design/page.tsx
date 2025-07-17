"use client";

import { Heading, Navbar, WhatsAppChat } from "@/components";
import DarkModeToggle from "@/components/DarkModeToggle";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

export default function UiUxDesignPage() {
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
                        <span className="text-[#00D084] font-medium">{t('services.uiux.breadcrumb') || 'UI/UX Design'}</span>
                    </nav>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-16">
                    <Heading variant="h1" color="foreground" className="mb-4 text-[32px] md:text-[40px] lg:text-[48px] font-bold">
                        {t('services.uiux.title') || 'Jasa UI/UX Design'}
                        </Heading>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        {t('services.uiux.description') || 'Kami menyediakan jasa pembuatan desain UI/UX profesional untuk aplikasi dan website Anda'}
                    </p>
                    </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Basic Package */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-8 hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800 flex flex-col">
                        <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                            {t('services.uiux.basic.title') || 'Basic Design'}
                        </h3>
                        <p className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                            {t('services.uiux.basic.price') || 'Rp 500.000'}<span className="text-base font-normal text-gray-600 dark:text-gray-400">/halaman</span>
                        </p>
                        <ul className="space-y-3 mb-8 flex-grow">
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.uiux.basic.features.wireframe') || '1 wireframe'}</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.uiux.basic.features.design') || '1 desain final'}</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.uiux.basic.features.revision') || '1x revisi'}</span>
                            </li>
                        </ul>
                        <button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg transition-colors duration-300">
                            {t('common.choosePackage') || 'Pilih Paket Basic'}
                        </button>
                    </div>

                    {/* Pro Package */}
                    <div className="border-2 border-green-500 dark:border-green-400 rounded-lg p-8 hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800 flex flex-col relative">
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                            {t('common.popular') || 'POPULER'}
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                            {t('services.uiux.pro.title') || 'Pro Design'}
                        </h3>
                        <p className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                            {t('services.uiux.pro.price') || 'Rp 2.000.000'}<span className="text-base font-normal text-gray-600 dark:text-gray-400">/project</span>
                        </p>
                        <ul className="space-y-3 mb-8 flex-grow">
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.uiux.pro.features.pages') || '5 halaman desain UI'}</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.uiux.pro.features.flow') || 'User flow & wireframe'}</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.uiux.pro.features.prototype') || 'Prototype interaktif'}</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.uiux.pro.features.revision') || '5x revisi'}</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.uiux.pro.features.system') || 'Design system'}</span>
                            </li>
                        </ul>
                        <button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg transition-colors duration-300">
                            {t('common.choosePackage') || 'Pilih Paket Pro'}
                        </button>
                    </div>

                    {/* Enterprise Package */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-8 hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800 flex flex-col">
                        <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                            {t('services.uiux.enterprise.title') || 'Enterprise Design'}
                        </h3>
                        <p className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                            {t('services.uiux.enterprise.price') || 'Custom'}<span className="text-base font-normal text-gray-600 dark:text-gray-400">/project</span>
                        </p>
                        <ul className="space-y-3 mb-8 flex-grow">
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.uiux.enterprise.features.pages') || 'Unlimited pages'}</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.uiux.enterprise.features.research') || 'UX research'}</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.uiux.enterprise.features.testing') || 'User testing'}</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.uiux.enterprise.features.revision') || 'Unlimited revisi'}</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.uiux.enterprise.features.consultation') || 'Konsultasi desain'}</span>
                            </li>
                        </ul>
                        <button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg transition-colors duration-300">
                            {t('common.contactUs') || 'Hubungi Kami'}
                        </button>
                    </div>
                        </div>

                {/* CTA Section */}
                <div className="text-center mt-16">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                        {t('services.uiux.cta.title') || 'Siap Memulai Project Design?'}
                            </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                        {t('services.uiux.cta.description') || 'Konsultasi gratis untuk membahas kebutuhan desain Anda. Tim ahli kami siap membantu mengembangkan desain impian Anda!'}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg transition-colors duration-300">
                            {t('common.freeConsultation') || 'Konsultasi Gratis'}
                        </button>
                        <button className="border border-green-600 text-green-600 dark:text-green-400 px-8 py-3 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors duration-300">
                            {t('common.viewPortfolio') || 'Lihat Portfolio'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Dark Mode Toggle */}
            <DarkModeToggle />

            {/* WhatsApp Chat */}
            <WhatsAppChat
                phoneNumber="6285739402436"
                message={t('services.uiux.whatsapp.message') || "Halo! Saya tertarik dengan layanan UI/UX Design Bajramedia. Bisa konsultasi gratis?"}
            />
        </div>
    );
} 