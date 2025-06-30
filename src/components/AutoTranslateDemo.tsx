"use client";

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components';

interface BlogContent {
    title: string;
    excerpt: string;
    content: string;
}

export default function AutoTranslateDemo() {
    const { t } = useLanguage();
    const [isTranslating, setIsTranslating] = useState(false);
    const [originalContent, setOriginalContent] = useState<BlogContent>({
        title: '',
        excerpt: '',
        content: ''
    });
    const [translatedContent, setTranslatedContent] = useState<BlogContent | null>(null);
    const [targetLang, setTargetLang] = useState('en');

    const handleTranslate = async () => {
        if (!originalContent.title && !originalContent.excerpt && !originalContent.content) {
            alert('Please fill in some content first!');
            return;
        }

        setIsTranslating(true);

        try {
            const response = await fetch('/api/admin/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: originalContent,
                    targetLang: targetLang,
                    sourceLang: 'id' // Default source is Indonesian
                })
            });

            const data = await response.json();

            if (data.success) {
                setTranslatedContent(data.translatedContent);
                alert('✅ Translation completed successfully!');
            } else {
                alert('❌ Translation failed: ' + data.error);
            }
        } catch (error) {
            console.error('Translation error:', error);
            alert('❌ Network error occurred during translation');
        } finally {
            setIsTranslating(false);
        }
    };

    return (
        <div className="w-[90%] mx-auto p-6 space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    🌍 Auto Translation Demo
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Test the auto-translation functionality for blog content
                </p>
            </div>

            {/* Language Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Target Language
                </label>
                <select
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                    <option value="en">English</option>
                    <option value="id">Indonesian</option>
                    <option value="zh">Chinese</option>
                    <option value="ja">Japanese</option>
                    <option value="ko">Korean</option>
                </select>
            </div>

            {/* Original Content Input */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    📝 Original Content (Indonesian)
                </h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Title
                        </label>
                        <input
                            type="text"
                            value={originalContent.title}
                            onChange={(e) => setOriginalContent(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Masukkan judul artikel..."
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Excerpt
                        </label>
                        <textarea
                            value={originalContent.excerpt}
                            onChange={(e) => setOriginalContent(prev => ({ ...prev, excerpt: e.target.value }))}
                            placeholder="Masukkan ringkasan artikel..."
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Content
                        </label>
                        <textarea
                            value={originalContent.content}
                            onChange={(e) => setOriginalContent(prev => ({ ...prev, content: e.target.value }))}
                            placeholder="Masukkan konten artikel..."
                            rows={6}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>
                </div>
            </div>

            {/* Translate Button */}
            <div className="text-center">
                <Button
                    type="button"
                    variant="primary"
                    onClick={handleTranslate}
                    disabled={isTranslating}
                    className="px-8 py-3 text-lg"
                >
                    {isTranslating ? (
                        <div className="flex items-center space-x-2">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Translating...</span>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-2">
                            <span>🌍</span>
                            <span>Translate to {targetLang.toUpperCase()}</span>
                        </div>
                    )}
                </Button>
            </div>

            {/* Translated Content Display */}
            {translatedContent && (
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-700">
                    <h2 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-4">
                        ✅ Translated Content ({targetLang.toUpperCase()})
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-green-700 dark:text-green-300 mb-2">
                                Title
                            </label>
                            <div className="p-3 bg-white dark:bg-gray-800 rounded border border-green-300 dark:border-green-600 text-gray-900 dark:text-white">
                                {translatedContent.title}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-green-700 dark:text-green-300 mb-2">
                                Excerpt
                            </label>
                            <div className="p-3 bg-white dark:bg-gray-800 rounded border border-green-300 dark:border-green-600 text-gray-900 dark:text-white">
                                {translatedContent.excerpt}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-green-700 dark:text-green-300 mb-2">
                                Content
                            </label>
                            <div className="p-3 bg-white dark:bg-gray-800 rounded border border-green-300 dark:border-green-600 text-gray-900 dark:text-white whitespace-pre-wrap">
                                {translatedContent.content}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
