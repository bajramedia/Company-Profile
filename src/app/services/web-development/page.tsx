"use client";

import { Heading, Navbar, WhatsAppChat } from "@/components";
import { Globe, Code2, Database, Server, Cpu, Lock } from 'lucide-react';
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

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
                            Home
                        </Link>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                        <Link href="/services" className="text-gray-500 dark:text-gray-400 hover:text-[#00D084] transition-colors">
                                Services
                            </Link>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        <span className="text-[#00D084] font-medium">Web Development</span>
                    </nav>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-16">
                    <Heading variant="h1" color="foreground" className="mb-4 text-[32px] md:text-[40px] lg:text-[48px] font-bold">
                        Jasa Web Development
                    </Heading>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Kami menyediakan jasa pembuatan website profesional dengan teknologi modern dan performa tinggi
                    </p>
                </div>

                {/* Technologies Section */}
                <div className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                            Teknologi yang Kami Gunakan
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Stack modern yang terpercaya untuk menghasilkan website berkualitas tinggi
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
                            <div className="text-4xl mb-3 text-blue-500 flex justify-center">
                                <Globe className="w-12 h-12" />
                                </div>
                            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Next.js</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Modern React Framework</p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
                            <div className="text-4xl mb-3 text-purple-500 flex justify-center">
                                <Code2 className="w-12 h-12" />
                                    </div>
                            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">TypeScript</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Type-Safe JavaScript</p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
                            <div className="text-4xl mb-3 text-green-500 flex justify-center">
                                <Database className="w-12 h-12" />
                            </div>
                            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">PostgreSQL</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Advanced Database</p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
                            <div className="text-4xl mb-3 text-orange-500 flex justify-center">
                                <Server className="w-12 h-12" />
                            </div>
                            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Node.js</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Server Runtime</p>
                                </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
                            <div className="text-4xl mb-3 text-red-500 flex justify-center">
                                <Cpu className="w-12 h-12" />
                            </div>
                            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Redis</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">High Performance Cache</p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
                            <div className="text-4xl mb-3 text-gray-500 flex justify-center">
                                <Lock className="w-12 h-12" />
                            </div>
                            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Security</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Advanced Protection</p>
                        </div>
                    </div>
                        </div>

                {/* Pricing Section */}
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Basic Package */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-8 hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800 flex flex-col">
                        <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                            Basic Website
                        </h3>
                        <p className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                            Rp 3.000.000<span className="text-base font-normal text-gray-600 dark:text-gray-400">/website</span>
                        </p>
                        <ul className="space-y-3 mb-8 flex-grow">
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">5 halaman website</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">Desain responsif</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">Basic SEO</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">Form kontak</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">Support 1 bulan</span>
                            </li>
                        </ul>
                        <button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg transition-colors duration-300">
                            Pilih Paket Basic
                        </button>
                    </div>

                    {/* Pro Package */}
                    <div className="border-2 border-green-500 dark:border-green-400 rounded-lg p-8 hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800 flex flex-col relative">
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                            POPULER
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                            Pro Website
                        </h3>
                        <p className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                            Rp 5.000.000<span className="text-base font-normal text-gray-600 dark:text-gray-400">/website</span>
                        </p>
                        <ul className="space-y-3 mb-8 flex-grow">
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">10 halaman website</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">CMS Admin</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">Database custom</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">Analytics & tracking</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">Support 3 bulan</span>
                            </li>
                        </ul>
                        <button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg transition-colors duration-300">
                            Pilih Paket Pro
                        </button>
                    </div>

                    {/* Enterprise Package */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-8 hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800 flex flex-col">
                        <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                            Enterprise Website
                        </h3>
                        <p className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                            Custom<span className="text-base font-normal text-gray-600 dark:text-gray-400">/project</span>
                        </p>
                        <ul className="space-y-3 mb-8 flex-grow">
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">Unlimited pages</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">Custom development</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">API integration</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">Advanced security</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">Support 6 bulan</span>
                            </li>
                        </ul>
                        <button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg transition-colors duration-300">
                            Hubungi Kami
                        </button>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center mt-16">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Siap Memulai Project Website?</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                        Konsultasi gratis untuk membahas kebutuhan website Anda. Tim ahli kami siap membantu mengembangkan website impian Anda!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg transition-colors duration-300">
                            Konsultasi Gratis
                        </button>
                        <button className="border border-green-600 text-green-600 dark:text-green-400 px-8 py-3 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors duration-300">
                            Lihat Portfolio
                        </button>
                    </div>
                </div>
            </div>

            {/* WhatsApp Chat */}
            <WhatsAppChat
                phoneNumber="6285739402436"
                message="Halo! Saya tertarik dengan layanan Web Development Bajramedia. Bisa konsultasi gratis?"
            />
        </div>
    );
} 