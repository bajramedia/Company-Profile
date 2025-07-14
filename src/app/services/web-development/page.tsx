"use client";

import { Heading, LanguageSwitcher } from "@/components";
import { Globe, Code2, Database, Server, Cpu, Lock } from 'lucide-react';
import { useLanguage } from "@/context/LanguageContext";

export default function WebDevelopmentPage() {
  const { t } = useLanguage();

    return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <Heading variant="h1" color="foreground" className="mb-4 text-[32px] md:text-[40px] lg:text-[48px] font-bold">
          {t('services.web.title') || 'Jasa Web Development'}
                            </Heading>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {t('services.web.description') || 'Kami menyediakan jasa pembuatan website profesional dengan teknologi modern dan performa tinggi untuk mengembangkan bisnis Anda'}
                        </p>
                    </div>

      {/* Technologies Section */}
      <div className="mb-20">
                    <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            {t('services.web.tech.title') || 'Teknologi yang Kami Gunakan'}
                        </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('services.web.tech.description') || 'Stack modern yang terpercaya untuk menghasilkan website berkualitas tinggi'}
                        </p>
                    </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
          <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="text-4xl mb-3 text-blue-500 flex justify-center">
              <Globe className="w-12 h-12" />
                                </div>
            <h3 className="font-semibold mb-2">Next.js</h3>
            <p className="text-sm text-gray-600">Modern React Framework</p>
                        </div>

          <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="text-4xl mb-3 text-purple-500 flex justify-center">
              <Code2 className="w-12 h-12" />
                            </div>
            <h3 className="font-semibold mb-2">TypeScript</h3>
            <p className="text-sm text-gray-600">Type-Safe JavaScript</p>
                                </div>

          <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="text-4xl mb-3 text-green-500 flex justify-center">
              <Database className="w-12 h-12" />
                            </div>
            <h3 className="font-semibold mb-2">PostgreSQL</h3>
            <p className="text-sm text-gray-600">Advanced Database</p>
                        </div>

          <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="text-4xl mb-3 text-orange-500 flex justify-center">
              <Server className="w-12 h-12" />
                                </div>
            <h3 className="font-semibold mb-2">Node.js</h3>
            <p className="text-sm text-gray-600">Backend Runtime</p>
                            </div>

          <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="text-4xl mb-3 text-red-500 flex justify-center">
              <Cpu className="w-12 h-12" />
                        </div>
            <h3 className="font-semibold mb-2">Redis</h3>
            <p className="text-sm text-gray-600">High Performance Cache</p>
                        </div>

          <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="text-4xl mb-3 text-gray-700 flex justify-center">
              <Lock className="w-12 h-12" />
            </div>
            <h3 className="font-semibold mb-2">Auth0</h3>
            <p className="text-sm text-gray-600">Enterprise Security</p>
                            </div>
                        </div>
                    </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Basic Package */}
        <div className="border rounded-lg p-8 hover:shadow-lg transition-shadow">
          <h3 className="text-2xl font-bold mb-4">Basic</h3>
          <p className="text-3xl font-bold mb-6">Rp 1.000.000</p>
          <ul className="space-y-3 mb-8">
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Landing page sederhana</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Desain responsif</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>3 halaman website</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Optimasi SEO dasar</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>1x revisi minor</span>
            </li>
          </ul>
        </div>

        {/* Standard Package */}
        <div className="border rounded-lg p-8 hover:shadow-lg transition-shadow bg-green-50">
          <div className="inline-block px-4 py-1 bg-green-500 text-white rounded-full text-sm mb-4">POPULER</div>
          <h3 className="text-2xl font-bold mb-4">Standard</h3>
          <p className="text-3xl font-bold mb-6">Rp 3.000.000</p>
          <ul className="space-y-3 mb-8">
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Website company profile lengkap</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Desain responsif premium</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>8 halaman website</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Optimasi SEO menengah</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>CMS untuk update konten</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>3x revisi</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Support teknis 1 bulan</span>
            </li>
          </ul>
        </div>

        {/* Premium Package */}
        <div className="border rounded-lg p-8 hover:shadow-lg transition-shadow">
          <h3 className="text-2xl font-bold mb-4">Premium</h3>
          <p className="text-3xl font-bold mb-6">Rp 5.000.000</p>
          <ul className="space-y-3 mb-8">
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Website custom sesuai kebutuhan</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Desain premium & animasi</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Halaman unlimited</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Optimasi SEO profesional</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>CMS custom & training</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Integrasi sistem & API</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>5x revisi major</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Support teknis 3 bulan</span>
            </li>
          </ul>
        </div>
            </div>
        </div>
    );
} 