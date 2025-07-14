"use client";

import { Heading, LanguageSwitcher } from "@/components";
import { useLanguage } from "@/context/LanguageContext";

export default function MobileAppsPage() {
    const { t } = useLanguage();

    return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <Heading variant="h1" color="foreground" className="mb-4 text-[32px] md:text-[40px] lg:text-[48px] font-bold">
          {t('services.mobile.title') || 'Jasa Mobile App Development'}
                        </Heading>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {t('services.mobile.description') || 'Kami menyediakan jasa pembuatan aplikasi mobile profesional untuk iOS dan Android'}
                        </p>
                    </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Basic Package */}
        <div className="border rounded-lg p-8 hover:shadow-lg transition-shadow">
          <h3 className="text-2xl font-bold mb-4">
            {t('services.mobile.basic.title') || 'Basic App'}
          </h3>
          <p className="text-3xl font-bold mb-6">
            {t('services.mobile.basic.price') || 'Rp 25.000.000'}
          </p>
                                    <ul className="space-y-3 mb-8">
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>{t('services.mobile.basic.features.platform') || 'Cross-platform (iOS & Android)'}</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>{t('services.mobile.basic.features.screens') || '3 screen utama'}</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>{t('services.mobile.basic.features.notification') || 'Push notification basic'}</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>{t('services.mobile.basic.features.api') || 'Integrasi API dasar'}</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>{t('services.mobile.basic.features.deployment') || 'App store deployment'}</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                </svg>
              <span>{t('services.mobile.basic.features.support') || '1 bulan support'}</span>
                                            </li>
                                    </ul>
                                </div>

        {/* Advanced Package */}
        <div className="border rounded-lg p-8 hover:shadow-lg transition-shadow bg-green-50">
          <div className="inline-block px-4 py-1 bg-green-500 text-white rounded-full text-sm mb-4">POPULER</div>
          <h3 className="text-2xl font-bold mb-4">
            {t('services.mobile.advanced.title') || 'Advanced App'}
          </h3>
          <p className="text-3xl font-bold mb-6">
            {t('services.mobile.advanced.price') || 'Rp 50.000.000'}
          </p>
          <ul className="space-y-3 mb-8">
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>{t('services.mobile.advanced.features.platform') || 'Cross-platform (iOS & Android)'}</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>{t('services.mobile.advanced.features.screens') || 'Unlimited screens'}</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>{t('services.mobile.advanced.features.notification') || 'Advanced push notifications'}</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>{t('services.mobile.advanced.features.api') || 'Complex API integrations'}</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>{t('services.mobile.advanced.features.offline') || 'Offline support'}</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>{t('services.mobile.advanced.features.admin') || 'Admin panel'}</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>{t('services.mobile.advanced.features.deployment') || 'App store deployment'}</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>{t('services.mobile.advanced.features.support') || '3 bulan support'}</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>{t('services.mobile.advanced.features.analytics') || 'Analytics integration'}</span>
            </li>
          </ul>
                            </div>
            </div>
        </div>
    );
} 
