"use client";

import { useState } from 'react';
import { Button, ImageUpload } from '@/components';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NewPartnerPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name_en: '',
        name_id: '',
        description_en: '',
        description_id: '',
        logo_url: '',
        website_url: '',
        partner_type: 'Strategic Partner',
        sort_order: 0,
        is_active: true,
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Validasi logo wajib ada
        if (!formData.logo_url) {
            setError('Partner logo is required. Please upload an image or provide an image URL.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/admin/partners', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create partner');
            }

            router.push('/admin/partners');
        } catch (error) {
            console.error('Error creating partner:', error);
            setError(error instanceof Error ? error.message : 'Failed to create partner');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
                type === 'number' ? parseInt(value) || 0 : value
        }));
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center space-x-4 mb-4">
                        <Link
                            href="/admin/partners"
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Add New Partner</h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">Create a new business partner</p>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                        <div className="flex">
                            <svg className="w-5 h-5 text-red-400 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <h3 className="text-red-800 dark:text-red-200 font-medium">Error</h3>
                                <p className="text-red-700 dark:text-red-300 text-sm mt-1">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Form */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Nama Partner */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name_en" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Partner Name (English) *
                                </label>
                                <input
                                    type="text"
                                    id="name_en"
                                    name="name_en"
                                    value={formData.name_en}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    placeholder="Enter partner name in English"
                                />
                            </div>
                            <div>
                                <label htmlFor="name_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Partner Name (Indonesian) *
                                </label>
                                <input
                                    type="text"
                                    id="name_id"
                                    name="name_id"
                                    value={formData.name_id}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    placeholder="Enter partner name in Indonesian"
                                />
                            </div>
                        </div>

                        {/* Deskripsi Partner */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="description_en" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Description (English)
                                </label>
                                <textarea
                                    id="description_en"
                                    name="description_en"
                                    rows={4}
                                    value={formData.description_en}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    placeholder="Enter description in English"
                                />
                            </div>
                            <div>
                                <label htmlFor="description_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Description (Indonesian)
                                </label>
                                <textarea
                                    id="description_id"
                                    name="description_id"
                                    rows={4}
                                    value={formData.description_id}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    placeholder="Enter description in Indonesian"
                                />
                            </div>
                        </div>

                        {/* Logo dan Website */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Partner Logo *
                                </label>
                                <ImageUpload
                                    value={formData.logo_url}
                                    onChange={(url) => setFormData(prev => ({ ...prev, logo_url: url }))}
                                    label="Upload partner logo"
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label htmlFor="website_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Website URL
                                </label>
                                <input
                                    type="url"
                                    id="website_url"
                                    name="website_url"
                                    value={formData.website_url}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    placeholder="https://example.com"
                                />
                            </div>
                        </div>

                        {/* Partner Type dan Sort Order */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="partner_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Partner Type *
                                </label>
                                <select
                                    id="partner_type"
                                    name="partner_type"
                                    value={formData.partner_type}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                >
                                    <option value="Strategic Partner">Strategic Partner</option>
                                    <option value="Technology Partner">Technology Partner</option>
                                    <option value="Business Partner">Business Partner</option>
                                    <option value="Integration Partner">Integration Partner</option>
                                    <option value="Reseller Partner">Reseller Partner</option>
                                    <option value="Sponsor">Sponsor</option>
                                    <option value="Client">Client</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="sort_order" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Sort Order
                                </label>
                                <input
                                    type="number"
                                    id="sort_order"
                                    name="sort_order"
                                    value={formData.sort_order}
                                    onChange={handleChange}
                                    min="0"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        {/* Status */}
                        <div>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="is_active"
                                    checked={formData.is_active}
                                    onChange={handleChange}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                                />
                                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Active</span>
                            </label>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-600">
                            <Link href="/admin/partners">
                                <Button variant="secondary" disabled={loading}>
                                    Cancel
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={loading}
                            >
                                {loading ? 'Creating...' : 'Create Partner'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
} 