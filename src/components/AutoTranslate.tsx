"use client";

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { FiGlobe, FiCheck, FiX, FiRotateCw } from 'react-icons/fi';
import { Button } from '@/components';

interface BlogContent {
    title: string;
    excerpt: string;
    content: string;
    metaTitle?: string;
    metaDescription?: string;
    socialShareText?: string;
}

interface AutoTranslateProps {
    content: BlogContent;
    onTranslationApply: (translatedContent: BlogContent) => void;
    className?: string;
}

export default function AutoTranslate({ content, onTranslationApply, className = '' }: AutoTranslateProps) {
    const { t } = useLanguage();
    const [isEnabled, setIsEnabled] = useState(false);
    const [sourceLang, setSourceLang] = useState('id');
    const [targetLang, setTargetLang] = useState('en');
    const [isTranslating, setIsTranslating] = useState(false);
    const [translatedContent, setTranslatedContent] = useState<BlogContent | null>(null);
    const [supportedLanguages, setSupportedLanguages] = useState<Array<{ code: string, name: string }>>([]);
    const [error, setError] = useState<string | null>(null);

    // Fetch supported languages on component mount
    useEffect(() => {
        const fetchLanguages = async () => {
            try {
                const response = await fetch('/api/admin/translate');
                const data = await response.json();

                if (data.success) {
                    setSupportedLanguages(data.languages);
                }
            } catch (error) {
                console.error('Failed to fetch supported languages:', error);
                // Fallback languages
                setSupportedLanguages([
                    { code: 'id', name: 'Indonesian' },
                    { code: 'en', name: 'English' },
                    { code: 'ms', name: 'Malay' },
                    { code: 'zh', name: 'Chinese' },
                    { code: 'ja', name: 'Japanese' },
                    { code: 'ko', name: 'Korean' },
                ]);
            }
        };

        fetchLanguages();
    }, []);

    const handleTranslate = async () => {
        if (!content.title || !content.excerpt || !content.content) {
            setError('Please fill in title, excerpt, and content before translating');
            return;
        }

        setIsTranslating(true);
        setError(null);

        try {
            const response = await fetch('/api/admin/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content,
                    targetLang,
                    sourceLang: sourceLang === 'auto' ? undefined : sourceLang
                })
            });

            const data = await response.json();

            if (data.success) {
                setTranslatedContent(data.translatedContent);
            } else {
                setError(data.error || 'Translation failed');
            }
        } catch (error) {
            console.error('Translation error:', error);
            setError('Network error occurred during translation');
        } finally {
            setIsTranslating(false);
        }
    };

    const handleApplyTranslation = () => {
        if (translatedContent) {
            onTranslationApply(translatedContent);
            setTranslatedContent(null);
            setIsEnabled(false);
        }
    };

    const handleCancelTranslation = () => {
        setTranslatedContent(null);
        setError(null);
    };

    if (!isEnabled) {
        return (
            <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 ${className}`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-500 rounded-lg">
                            <FiGlobe className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">{t('autoTranslate.title')}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{t('autoTranslate.description')}</p>
                        </div>
                    </div>
                    <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={() => setIsEnabled(true)}
                    >
                        {t('autoTranslate.enable')}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 ${className}`}>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <FiGlobe className="w-5 h-5 mr-2 text-blue-500" />
                    {t('autoTranslate.title')}
                </h3>
                <button
                    onClick={() => {
                        setIsEnabled(false);
                        setTranslatedContent(null);
                        setError(null);
                    }}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                    <FiX size={20} />
                </button>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-3 mb-4">
                    <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('autoTranslate.sourceLang')}
                    </label>
                    <select
                        value={sourceLang}
                        onChange={(e) => setSourceLang(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                        <option value="auto">Auto-detect</option>
                        {supportedLanguages.map(lang => (
                            <option key={lang.code} value={lang.code}>
                                {lang.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('autoTranslate.targetLang')}
                    </label>
                    <select
                        value={targetLang}
                        onChange={(e) => setTargetLang(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                        {supportedLanguages.map(lang => (
                            <option key={lang.code} value={lang.code}>
                                {lang.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {!translatedContent ? (
                <div className="flex justify-center">
                    <Button
                        type="button"
                        variant="primary"
                        onClick={handleTranslate}
                        disabled={isTranslating || sourceLang === targetLang}
                        className="flex items-center space-x-2"
                    >
                        {isTranslating ? (
                            <>
                                <FiRotateCw className="w-4 h-4 animate-spin" />
                                <span>{t('autoTranslate.translating')}</span>
                            </>
                        ) : (
                            <>
                                <FiGlobe className="w-4 h-4" />
                                <span>Translate Content</span>
                            </>
                        )}
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
                        <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                            {t('autoTranslate.success')}
                        </h4>
                        <p className="text-sm text-green-600 dark:text-green-400">
                            Content has been translated from {supportedLanguages.find(l => l.code === sourceLang)?.name || sourceLang} to {supportedLanguages.find(l => l.code === targetLang)?.name || targetLang}
                        </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <h5 className="font-medium text-gray-900 dark:text-white mb-2">{t('autoTranslate.previewTranslation')}:</h5>
                        <div className="space-y-2 text-sm">
                            <div>
                                <span className="font-medium text-gray-700 dark:text-gray-300">Title:</span>
                                <p className="text-gray-600 dark:text-gray-400">{translatedContent.title}</p>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700 dark:text-gray-300">Excerpt:</span>
                                <p className="text-gray-600 dark:text-gray-400">{translatedContent.excerpt}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex space-x-3">
                        <Button
                            type="button"
                            variant="primary"
                            onClick={handleApplyTranslation}
                            className="flex items-center space-x-2"
                        >
                            <FiCheck className="w-4 h-4" />
                            <span>{t('autoTranslate.applyTranslation')}</span>
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancelTranslation}
                            className="flex items-center space-x-2"
                        >
                            <FiX className="w-4 h-4" />
                            <span>{t('autoTranslate.cancelTranslation')}</span>
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
} 