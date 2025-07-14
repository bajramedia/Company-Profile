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
        <p className="text-gray-600 max-w-2xl mx-auto">
          {t('services.gameAsset.description') || 'Kami menyediakan jasa pembuatan aset game 2D dan 3D berkualitas tinggi untuk game Anda'}
                        </p>
                    </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* 2D Package */}
        <div className="border rounded-lg p-8 hover:shadow-lg transition-shadow">
          <h3 className="text-2xl font-bold mb-4">
            {t('services.gameAsset.2d.title') || '2D Asset Package'}
          </h3>
          <p className="text-3xl font-bold mb-6">
            {t('services.gameAsset.2d.price') || 'Rp 1.000.000'}
          </p>
                                    <ul className="space-y-3 mb-8">
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>{t('services.gameAsset.2d.features.characters') || '5 karakter 2D'}</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>{t('services.gameAsset.2d.features.animations') || '3 animasi per karakter'}</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>{t('services.gameAsset.2d.features.items') || '10 item/prop'}</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>{t('services.gameAsset.2d.features.backgrounds') || '3 background scene'}</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>{t('services.gameAsset.2d.features.source') || 'File sumber (PSD/AI)'}</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                </svg>
              <span>{t('services.gameAsset.2d.features.revisions') || '2x revisi'}</span>
                                            </li>
                                    </ul>
                                </div>

        {/* 3D Package */}
        <div className="border rounded-lg p-8 hover:shadow-lg transition-shadow bg-green-50">
          <div className="inline-block px-4 py-1 bg-green-500 text-white rounded-full text-sm mb-4">POPULER</div>
          <h3 className="text-2xl font-bold mb-4">
            {t('services.gameAsset.3d.title') || '3D Asset Package'}
          </h3>
          <p className="text-3xl font-bold mb-6">
            {t('services.gameAsset.3d.price') || 'Rp 3.500.000'}
          </p>
          <ul className="space-y-3 mb-8">
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>{t('services.gameAsset.3d.features.characters') || '3 karakter 3D'}</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>{t('services.gameAsset.3d.features.animations') || '5 animasi per karakter'}</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>{t('services.gameAsset.3d.features.items') || '8 item/prop 3D'}</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>{t('services.gameAsset.3d.features.environments') || '2 environment scene'}</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>{t('services.gameAsset.3d.features.textures') || 'Tekstur & material HD'}</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>{t('services.gameAsset.3d.features.source') || 'File sumber (FBX/OBJ/Blend)'}</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>{t('services.gameAsset.3d.features.revisions') || '3x revisi'}</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>{t('services.gameAsset.3d.features.optimization') || 'Optimasi performa'}</span>
            </li>
          </ul>
                            </div>
            </div>
        </div>
    );
} 
