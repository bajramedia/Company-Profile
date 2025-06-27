"use client";

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { FiEdit2, FiSave, FiX, FiInfo, FiLoader, FiPlus } from 'react-icons/fi';

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
    const [editingContent, setEditingContent] = useState<AboutContent | null>(null);
    const [saving, setSaving] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // Form state
    const [formData, setFormData] = useState<Partial<AboutContent>>({
        section_key: '',
        title_en: '',
        title_id: '',
        content_en: '',
        content_id: '',
        is_active: true
    });

    // Fetch about content
    useEffect(() => {
        fetchAboutContent();
    }, []);

    // Handle form changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    // Handle edit
    const handleEdit = (content: AboutContent) => {
        setEditingContent(content);
        setFormData({
            section_key: content.section_key,
            title_en: content.title_en,
            title_id: content.title_id,
            content_en: content.content_en,
            content_id: content.content_id,
            is_active: content.is_active
        });
        setShowModal(true);
    };

    // Handle save
    const handleSave = async () => {
        try {
            setSaving(true);
            const url = editingContent
                ? `/api/admin/about-content/${editingContent.id}`
                : '/api/admin/about-content';

            const method = editingContent ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to save about content');
            }

            await fetchAboutContent();
            setShowModal(false);
            setEditingContent(null);
            setFormData({
                section_key: '',
                title_en: '',
                title_id: '',
                content_en: '',
                content_id: '',
                is_active: true
            });
        } catch (error) {
            console.error('Error saving about content:', error);
            setError('Failed to save about content');
        } finally {
            setSaving(false);
        }
    };

    // Handle new content
    const handleNew = () => {
        setEditingContent(null);
        setFormData({
            section_key: '',
            title_en: '',
            title_id: '',
            content_en: '',
            content_id: '',
            is_active: true
        });
        setShowModal(true);
    };

    const fetchAboutContent = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/admin/about-content');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setAboutContent(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching about content:', error);
            setError('Failed to fetch about content');
            setAboutContent([]);
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
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                    <div className="flex items-center space-x-3">
                        <FiInfo className="text-primary h-8 w-8" />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                About Content Management
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Manage the content displayed on the About Us page.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleNew}
                        className="flex items-center space-x-2 bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        <FiPlus className="h-4 w-4" />
                        <span>Add Content Section</span>
                    </button>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-100 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-4 rounded-r-lg">
                    <p>{error}</p>
                    <button 
                        onClick={() => setError(null)}
                        className="mt-2 text-sm underline hover:no-underline"
                    >
                        Dismiss
                    </button>
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
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleEdit(content)}
                                    className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                                >
                                    <FiEdit2 className="h-4 w-4" />
                                    <span className="text-sm">Edit</span>
                                </button>
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
                        
                        <div className="mt-4 flex items-center">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                content.is_active 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                                {content.is_active ? 'Active' : 'Inactive'}
                            </span>
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
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                        Get started by adding your first about content section.
                    </p>
                    <button
                        onClick={handleNew}
                        className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        Add First Content Section
                    </button>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                {editingContent ? 'Edit About Content' : 'Add New About Content'}
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <FiX className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Section Key */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Section Key *
                                </label>
                                <input
                                    type="text"
                                    name="section_key"
                                    value={formData.section_key}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="e.g., hero, mission, vision"
                                    required
                                />
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Unique identifier for this content section (lowercase, use underscores)
                                </p>
                            </div>

                            {/* Titles */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Title (English) *
                                    </label>
                                    <input
                                        type="text"
                                        name="title_en"
                                        value={formData.title_en}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Title (Indonesian) *
                                    </label>
                                    <input
                                        type="text"
                                        name="title_id"
                                        value={formData.title_id}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Content (English) *
                                    </label>
                                    <textarea
                                        name="content_en"
                                        value={formData.content_en}
                                        onChange={handleInputChange}
                                        rows={6}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Content (Indonesian) *
                                    </label>
                                    <textarea
                                        name="content_id"
                                        value={formData.content_id}
                                        onChange={handleInputChange}
                                        rows={6}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Status */}
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="is_active"
                                    checked={formData.is_active}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                />
                                <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                    Active (Display on website)
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/80 rounded-md transition-colors disabled:opacity-50 flex items-center space-x-2"
                            >
                                {saving ? <FiLoader className="h-4 w-4 animate-spin" /> : <FiSave className="h-4 w-4" />}
                                <span>{saving ? 'Saving...' : 'Save Content'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}