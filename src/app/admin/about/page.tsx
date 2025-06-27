"use client";

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { FiEdit2, FiSave, FiX, FiInfo } from 'react-icons/fi';

interface AboutContent {
    id: string;
    section_key: string;
    title_en: string;
    title_id: string;
    content_en: string;
    content_id: string;
    is_active: boolean;
}

export default function AdminAboutPage() {
    const { t } = useLanguage();
    const [aboutContent, setAboutContent] = useState<AboutContent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch about content
    useEffect(() => {
        fetchAboutContent();
    }, []);

    const fetchAboutContent = async () => {
        try {
            setLoading(true);
            // Mock data for now
            setAboutContent([
                {
                    id: '1',
                    section_key: 'hero',
                    title_en: 'About Bajramedia',
                    title_id: 'Tentang Bajramedia',
                    content_en: 'We are a creative digital agency dedicated to helping businesses grow.',
                    content_id: 'Kami adalah agensi digital kreatif yang berdedikasi membantu bisnis berkembang.',
                    is_active: true
                }
            ]);
        } catch (error) {
            console.error('Error fetching about content:', error);
            setError('Failed to fetch about content');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3 mb-2">
                    <FiInfo className="text-primary h-6 w-6" />
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        About Content Management
                    </h1>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                    Manage the content displayed on the About Us page.
                </p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-100 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-4 rounded-r-lg">
                    <p>{error}</p>
                </div>
            )}

            {/* Content List */}
            <div className="space-y-4">
                {aboutContent.map((content) => (
                    <div
                        key={content.id}
                        className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                                    {content.section_key.replace('_', ' ')}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Section: {content.section_key}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                    English Version
                                </h4>
                                <h5 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                                    {content.title_en}
                                </h5>
                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                    {content.content_en}
                                </p>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                    Indonesian Version
                                </h4>
                                <h5 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                                    {content.title_id}
                                </h5>
                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                    {content.content_id}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {aboutContent.length === 0 && !loading && (
                <div className="text-center py-12">
                    <FiInfo className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No content available
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                        About content will appear here when available.
                    </p>
                </div>
            )}
        </div>
    );
}