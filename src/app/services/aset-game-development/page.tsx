"use client";

import { Heading, Navbar, WhatsAppChat } from "@/components";
import DarkModeToggle from "@/components/DarkModeToggle";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

export default function GameAssetDevelopmentPage() {
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
                        <span className="text-[#00D084] font-medium">{t('services.gameAsset.breadcrumb') || 'Game Asset Development'}</span>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-16">
                    <Heading variant="h1" color="foreground" className="mb-4">
                        {t('services.gameAsset.title') || 'Jasa Pembuatan Asset Game'}
                        </Heading>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        {t('services.gameAsset.description') || 'Kami menyediakan jasa pembuatan aset game 2D dan 3D berkualitas tinggi untuk game Anda'}
                    </p>
                    </div>

                {/* Packages Grid */}
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* 2D Package */}
                    <div className="border dark:border-gray-700 rounded-lg p-8 hover:shadow-lg transition-all bg-white dark:bg-gray-800 flex flex-col">
                        <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                            {t('services.gameAsset.2d.title') || '2D Game Assets'}
                        </h3>
                        <p className="text-3xl font-bold mb-6 text-green-600 dark:text-green-500">
                            {t('services.gameAsset.2d.price') || 'Starting from Rp 7,500,000'}
                        </p>
                        <ul className="space-y-3 mb-8">
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.gameAsset.2d.features.sprites') || 'Character sprites & animations'}</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.gameAsset.2d.features.animations') || 'Smooth 2D animations'}</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.gameAsset.2d.features.items') || 'Game items & props'}</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.gameAsset.2d.features.backgrounds') || 'Background environments'}</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.gameAsset.2d.features.source') || 'Source files included'}</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.gameAsset.2d.features.revisions') || '3 revisions included'}</span>
                            </li>
                        </ul>
                        <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg transition-colors">
                            {t('services.gameAsset.2d.cta') || 'Pilih Paket 2D'}
                        </button>
                    </div>

                    {/* 3D Package */}
                    <div className="border dark:border-gray-700 rounded-lg p-8 hover:shadow-lg transition-all bg-green-50 dark:bg-gray-800/50 relative flex flex-col">
                        {/* Badge Populer di tengah atas */}
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                            {t('common.popular') || 'POPULER'}
                        </div>
                        <h3 className="text-2xl font-bold mb-4 mt-2 text-gray-900 dark:text-white">
                            {t('services.gameAsset.3d.title') || '3D Game Assets'}
                        </h3>
                        <p className="text-3xl font-bold mb-6 text-green-600 dark:text-green-500">
                            {t('services.gameAsset.3d.price') || 'Starting from Rp 15,000,000'}
                        </p>
                                    <ul className="space-y-3 mb-8">
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.gameAsset.3d.features.models') || '3D character models'}</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.gameAsset.3d.features.animations') || '5 animations per character'}</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.gameAsset.3d.features.items') || '8 3D items/props'}</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.gameAsset.3d.features.scenes') || '2 environment scenes'}</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.gameAsset.3d.features.textures') || 'HD textures & materials'}</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.gameAsset.3d.features.source') || 'Source files (FBX/OBJ/Blend)'}</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.gameAsset.3d.features.revisions') || '3 revisions included'}</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.gameAsset.3d.features.optimization') || 'Performance optimization'}</span>
                                            </li>
                                    </ul>
                        <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg transition-colors mt-auto">
                            {t('services.gameAsset.3d.cta') || 'Pilih Paket 3D'}
                        </button>
                    </div>

                    {/* Enterprise/Custom Package */}
                    <div className="border dark:border-gray-700 rounded-lg p-8 hover:shadow-lg transition-all bg-white dark:bg-gray-800 flex flex-col">
                        <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                            {t('services.gameAsset.enterprise.title') || 'Enterprise/Custom'}
                        </h3>
                        <p className="text-3xl font-bold mb-6 text-green-600 dark:text-green-500">
                            {t('services.gameAsset.enterprise.price') || 'Hubungi Kami'}
                        </p>
                        <ul className="space-y-3 mb-8 flex-grow">
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.gameAsset.enterprise.features.unlimited') || 'Jumlah aset tidak terbatas'}</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.gameAsset.enterprise.features.custom') || 'Fitur dan style custom'}</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.gameAsset.enterprise.features.support') || 'Dukungan prioritas'}</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                <span className="text-gray-700 dark:text-gray-300">{t('services.gameAsset.enterprise.features.revisions') || 'Revisi tidak terbatas'}</span>
                            </li>
                        </ul>
                        <button className="w-full bg-gray-700 hover:bg-gray-800 text-white py-3 px-6 rounded-lg transition-colors mt-auto">
                            {t('common.contactUs') || 'Hubungi Kami'}
                        </button>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center mt-16">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                        {t('services.gameAsset.cta.title') || 'Siap Memulai Proyek Game Anda?'}
                            </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                        {t('services.gameAsset.cta.description') || 'Konsultasi gratis untuk membahas kebutuhan aset game Anda. Tim ahli kami siap membantu mewujudkan visi game Anda!'}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg transition-colors">
                            {t('services.gameAsset.cta.consult') || 'Konsultasi Gratis'}
                        </button>
                        <button className="border border-green-600 text-green-600 dark:text-green-500 dark:border-green-500 px-8 py-3 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors">
                            {t('services.gameAsset.cta.portfolio') || 'Lihat Portfolio'}
                        </button>
                            </div>
                        </div>
                    </div>

            {/* Dark Mode Toggle */}
            <DarkModeToggle />

            {/* WhatsApp Chat */}
            <WhatsAppChat
                phoneNumber="6285739402436"
                message={t('services.gameAsset.whatsapp.message') || "Halo! Saya tertarik dengan layanan Game Asset Development Bajramedia. Bisa konsultasi gratis?"}
            />
        </div>
    );
} 
