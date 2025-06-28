"use client";

import { useState, useEffect } from 'react';
import { Button, ImageUpload } from '@/components';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';

interface Partner {
    id: string;
    name_en: string;
    name_id: string;
    description_en: string;
    description_id: string;
    logo_url: string;
    website_url: string;
    partner_type: string;
    sort_order: number;
    is_active: boolean;
}

export default function EditPartnerPage() {
    const router = useRouter();
    const params = useParams();
    const partnerId = params?.id as string;

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<Partner>({
        id: '',
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

    useEffect(() => {
        if (partnerId) {
            fetchPartner();
        }
    }, [partnerId]);

    const fetchPartner = async () => {
        try {
            setFetching(true);
            console.log('🔍 Fetching partner with ID:', partnerId);

            const response = await fetch(`/api/admin/partners/${partnerId}`);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Fetch error:', response.status, errorText);
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
            }

            const partner = await response.json();
            console.log('✅ Partner data received:', partner);
            console.log('🔍 Partner data keys:', Object.keys(partner));
            console.log('🔍 Raw partner data structure:', JSON.stringify(partner, null, 2));

            // Handle multiple possible field name formats from API
            const formattedPartner = {
                id: partner.id || partner.ID || '',
                name_en: partner.name_en || partner.nameEn || partner.name_english || partner.NameEn || '',
                name_id: partner.name_id || partner.nameId || partner.name_indonesian || partner.NameId || '',
                description_en: partner.description_en || partner.descriptionEn || partner.desc_en || partner.DescriptionEn || '',
                description_id: partner.description_id || partner.descriptionId || partner.desc_id || partner.DescriptionId || '',
                logo_url: partner.logo_url || partner.logoUrl || partner.logo || partner.Logo || partner.LogoUrl || '',
                website_url: partner.website_url || partner.websiteUrl || partner.website || partner.Website || partner.WebsiteUrl || '',
                partner_type: partner.partner_type || partner.partnerType || partner.type || partner.Type || partner.PartnerType || 'Strategic Partner',
                sort_order: parseInt(partner.sort_order || partner.sortOrder || partner.order || partner.Order || '0') || 0,
                is_active: partner.is_active !== undefined ? Boolean(partner.is_active) :
                    partner.isActive !== undefined ? Boolean(partner.isActive) :
                        partner.active !== undefined ? Boolean(partner.active) : true,
            };

            console.log('📝 Formatted partner data:', formattedPartner);
            setFormData(formattedPartner);
        } catch (error) {
            console.error('💥 Error fetching partner:', error);
            setError(error instanceof Error ? error.message : 'Failed to fetch partner');
        } finally {
            setFetching(false);
        }
    };

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
            const response = await fetch(`/api/admin/partners/${partnerId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update partner');
            }

            router.push('/admin/partners');
        } catch (error) {
            console.error('Error updating partner:', error);
            setError(error instanceof Error ? error.message : 'Failed to update partner');
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

    if (fetching) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded mb-6"></div>
                        <div className="h-96 bg-gray-300 dark:bg-gray-600 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
            <div className="max-w-4xl mx-auto">
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
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Partner</h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">Update partner information</p>
                        </div>
                    </div>
                </div>

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

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
                                />
                            </div>
                        </div>

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
                                />
                            </div>
                        </div>

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
                                />
                            </div>
                        </div>

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
                                />
                            </div>
                        </div>

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
                                {loading ? 'Updating...' : 'Update Partner'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
} 