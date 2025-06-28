"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components';
import Link from 'next/link';

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
    created_at: string;
}

export default function PartnersAdminPage() {
    const [partners, setPartners] = useState<Partner[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchPartners();
    }, []);

    const fetchPartners = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/admin/partners');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setPartners(data);
        } catch (error) {
            console.error('Failed to fetch partners:', error);
            setError(error instanceof Error ? error.message : 'Failed to load partners');
        } finally {
            setLoading(false);
        }
    };

    const deletePartner = async (id: string) => {
        if (!confirm('Are you sure you want to delete this partner?')) return;

        try {
            console.log('🗑️ Deleting partner with ID:', id);

            const response = await fetch(`/api/admin/partners/${id}`, {
                method: 'DELETE',
            });

            console.log('🗑️ Delete response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('🗑️ Delete failed response:', errorText);
                throw new Error(`HTTP error! status: ${response.status}, ${errorText}`);
            }

            const result = await response.json();
            console.log('🗑️ Delete result:', result);

            console.log('🔄 Refreshing partners list...');
            await fetchPartners(); // Refresh list
            console.log('✅ Partners list refreshed');
        } catch (error) {
            console.error('❌ Failed to delete partner:', error);
            alert('Failed to delete partner: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    };

    const toggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            const response = await fetch(`/api/admin/partners/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_active: !currentStatus }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            await fetchPartners(); // Refresh list
        } catch (error) {
            console.error('Failed to update partner status:', error);
            alert('Failed to update partner status');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded mb-6"></div>
                        <div className="h-32 bg-gray-300 dark:bg-gray-600 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Partners Management</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your business partners and collaborations</p>
                    </div>
                    <Link href="/admin/partners/new">
                        <Button variant="primary">Add New Partner</Button>
                    </Link>
                </div>

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                        <div className="flex">
                            <svg className="w-5 h-5 text-red-400 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <h3 className="text-red-800 dark:text-red-200 font-medium">Error Loading Partners</h3>
                                <p className="text-red-700 dark:text-red-300 text-sm mt-1">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Partners List */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                    {partners.length === 0 ? (
                        <div className="text-center py-12">
                            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6z" />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Partners</h3>
                            <p className="text-gray-500 dark:text-gray-400">Get started by adding your first partner.</p>
                            <Link href="/admin/partners/new" className="mt-4 inline-block">
                                <Button variant="primary">Add Partner</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Partner
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Website
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Order
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {partners.map((partner) => (
                                        <tr key={partner.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-12 w-12">
                                                        <img
                                                            className="h-12 w-12 rounded-lg object-contain bg-gray-100 dark:bg-gray-600"
                                                            src={partner.logo_url || '/images/logo.png'}
                                                            alt={partner.name_en}
                                                            onError={(e) => {
                                                                const target = e.target as HTMLImageElement;
                                                                target.src = '/images/logo.png';
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {partner.name_en}
                                                        </div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                                            {partner.name_id}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                    {partner.partner_type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                {partner.website_url ? (
                                                    <a
                                                        href={partner.website_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-primary hover:text-primary/80"
                                                    >
                                                        Visit Website
                                                    </a>
                                                ) : (
                                                    <span className="text-gray-400">No website</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => toggleStatus(partner.id, partner.is_active)}
                                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${partner.is_active
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                        }`}
                                                >
                                                    {partner.is_active ? 'Active' : 'Inactive'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                {partner.sort_order}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end space-x-3">
                                                    <Link
                                                        href={`/admin/partners/${partner.id}/edit`}
                                                        className="text-primary hover:text-primary/80 transition-colors"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            deletePartner(partner.id);
                                                        }}
                                                        className="text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 