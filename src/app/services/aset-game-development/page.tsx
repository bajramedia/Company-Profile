"use client";

import { Heading, LanguageSwitcher } from "@/components";
import { useLanguage } from "@/context/LanguageContext";

export default function GameAssetDevelopmentPage() {
    const { t } = useLanguage();

    return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <Heading variant="h1" color="foreground" className="mb-4">
          {t('services.gameAsset.title') || 'Jasa Pembuatan Asset Game'}
        </Heading>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {t('services.gameAsset.description') || 'Kami menyediakan jasa pembuatan aset game 2D dan 3D berkualitas tinggi untuk game Anda'}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* 2D Package */}
        <div className="border dark:border-gray-700 rounded-lg p-8 hover:shadow-lg transition-all bg-white dark:bg-gray-800">
          <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            2D Game Assets
          </h3>
          <p className="text-3xl font-bold mb-6 text-green-600 dark:text-green-500">
            Starting from Rp 7,500,000
          </p>
          <ul className="space-y-3 mb-8">
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span className="text-gray-700 dark:text-gray-300">Character sprites & animations</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span className="text-gray-700 dark:text-gray-300">Smooth 2D animations</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span className="text-gray-700 dark:text-gray-300">Game items & props</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span className="text-gray-700 dark:text-gray-300">Background environments</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span className="text-gray-700 dark:text-gray-300">Source files included</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span className="text-gray-700 dark:text-gray-300">3 revisions included</span>
            </li>
          </ul>
          <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg transition-colors">
            Pilih Paket 2D
          </button>
        </div>

        {/* 3D Package */}
        <div className="border dark:border-gray-700 rounded-lg p-8 hover:shadow-lg transition-all bg-green-50 dark:bg-gray-800/50 relative">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <div className="inline-block px-4 py-1 bg-green-500 text-white rounded-full text-sm font-medium">
              POPULER
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-4 mt-2 text-gray-900 dark:text-white">
            3D Game Assets
          </h3>
          <p className="text-3xl font-bold mb-6 text-green-600 dark:text-green-500">
            Starting from Rp 15,000,000
          </p>
          <ul className="space-y-3 mb-8">
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span className="text-gray-700 dark:text-gray-300">3D character models</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span className="text-gray-700 dark:text-gray-300">5 animations per character</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span className="text-gray-700 dark:text-gray-300">8 3D items/props</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span className="text-gray-700 dark:text-gray-300">2 environment scenes</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span className="text-gray-700 dark:text-gray-300">HD textures & materials</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span className="text-gray-700 dark:text-gray-300">Source files (FBX/OBJ/Blend)</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span className="text-gray-700 dark:text-gray-300">3 revisions included</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span className="text-gray-700 dark:text-gray-300">Performance optimization</span>
            </li>
          </ul>
          <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg transition-colors">
            Pilih Paket 3D
          </button>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center mt-16">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Siap Memulai Proyek Game Anda?</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          Konsultasi gratis untuk membahas kebutuhan aset game Anda. Tim ahli kami siap membantu mewujudkan visi game Anda!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg transition-colors">
            Konsultasi Gratis
          </button>
          <button className="border border-green-600 text-green-600 dark:text-green-500 dark:border-green-500 px-8 py-3 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors">
            Lihat Portfolio
          </button>
        </div>
      </div>
    </div>
    );
} 
