"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components';

// Types
interface Technology {
    id: number;
    name: string;
    icon: string;
    description_en: string;
    description_id: string;
    category: string;
    color: string;
    sort_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface Category {
    value: string;
    label: string;
    color: string;
    description?: string;
}

export default function TechnologiesAdminPage() {
    const [technologies, setTechnologies] = useState<Technology[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingTech, setEditingTech] = useState<Technology | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        icon: '',
        description_en: '',
        description_id: '',
        category: 'general',
        color: '#6B7280',
        sort_order: 0,
        is_active: true,
    });

    // Fetch categories from database
    const fetchCategories = async () => {
        try {
            setLoadingCategories(true);
            const response = await fetch('/api/admin/technology-categories');
            if (response.ok) {
                const data = await response.json();
                setCategories(data);

                // Set default category untuk form
                if (data.length > 0 && !formData.category) {
                    setFormData(prev => ({ ...prev, category: data[0].value }));
                }
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            // Fallback jika error
            setCategories([
                { value: 'general', label: 'General', color: '#6B7280' }
            ]);
        } finally {
            setLoadingCategories(false);
        }
    };

    // Fetch technologies
    const fetchTechnologies = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/admin/technologies?include_inactive=true');
            if (response.ok) {
                const data = await response.json();
                setTechnologies(data);
            }
        } catch (error) {
            console.error('Error fetching technologies:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchTechnologies();
    }, [fetchCategories, fetchTechnologies]);

    // Get category info by value
    const getCategoryInfo = (categoryValue: string) => {
        return categories.find(cat => cat.value === categoryValue) ||
            { value: categoryValue, label: categoryValue, color: '#6B7280' };
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editingTech
                ? `/api/admin/technologies/${editingTech.id}`
                : '/api/admin/technologies';

            const method = editingTech ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                await fetchTechnologies();
                resetForm();
                setIsFormOpen(false);
            } else {
                const error = await response.json();
                alert(error.error || 'Terjadi kesalahan');
            }
        } catch (error) {
            console.error('Error saving technology:', error);
            alert('Terjadi kesalahan saat menyimpan');
        }
    };

    // Handle delete
    const handleDelete = async (id: number) => {
        if (confirm('Yakin ingin menghapus teknologi ini?')) {
            try {
                const response = await fetch(`/api/admin/technologies/${id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    await fetchTechnologies();
                } else {
                    alert('Gagal menghapus teknologi');
                }
            } catch (error) {
                console.error('Error deleting technology:', error);
                alert('Terjadi kesalahan saat menghapus');
            }
        }
    };

    // Handle edit
    const handleEdit = (tech: Technology) => {
        setEditingTech(tech);
        setFormData({
            name: tech.name,
            icon: tech.icon,
            description_en: tech.description_en,
            description_id: tech.description_id,
            category: tech.category,
            color: tech.color,
            sort_order: tech.sort_order,
            is_active: tech.is_active,
        });
        setIsFormOpen(true);
    };

    // Reset form
    const resetForm = () => {
        setEditingTech(null);
        setFormData({
            name: '',
            icon: '',
            description_en: '',
            description_id: '',
            category: 'general',
            color: '#6B7280',
            sort_order: 0,
            is_active: true,
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="w-[95%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Technologies Management
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Kelola teknologi yang digunakan dalam portfolio dan layanan
                    </p>
                </div>

                {/* Action Bar */}
                <div className="mb-6 flex justify-between items-center">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        Total: {technologies.length} teknologi
                    </div>
                    <Button
                        variant="primary"
                        onClick={() => {
                            resetForm();
                            setIsFormOpen(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        + Tambah Teknologi
                    </Button>
                </div>

                {/* Technologies Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow animate-pulse">
                                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {technologies.map((tech) => (
                            <div
                                key={tech.id}
                                className={`bg-white dark:bg-gray-800 rounded-lg p-6 shadow hover:shadow-lg transition-all duration-200 border ${tech.is_active
                                    ? 'border-gray-200 dark:border-gray-700'
                                    : 'border-red-200 dark:border-red-800 opacity-60'
                                    }`}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div
                                            className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                                            style={{ backgroundColor: `${tech.color}20`, color: tech.color }}
                                        >
                                            {tech.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                                {tech.name}
                                            </h3>
                                            <span
                                                className="text-xs px-2 py-1 rounded-full font-medium"
                                                style={{
                                                    backgroundColor: `${getCategoryInfo(tech.category)?.color}20`,
                                                    color: getCategoryInfo(tech.category)?.color
                                                }}
                                            >
                                                {getCategoryInfo(tech.category)?.label}
                                            </span>
                                        </div>
                                    </div>
                                    {!tech.is_active && (
                                        <span className="text-xs bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 px-2 py-1 rounded-full">
                                            Nonaktif
                                        </span>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                        <span className="font-medium">EN:</span> {tech.description_en || '-'}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        <span className="font-medium">ID:</span> {tech.description_id || '-'}
                                    </p>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        Order: {tech.sort_order}
                                    </span>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEdit(tech)}
                                            className="px-3 py-1 text-xs bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(tech.id)}
                                            className="px-3 py-1 text-xs bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-400 rounded hover:bg-red-100 dark:hover:bg-red-800 transition-colors"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Form Modal */}
                {isFormOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                                {editingTech ? 'Edit Teknologi' : 'Tambah Teknologi Baru'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Nama Teknologi *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Icon/Emoji *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.icon}
                                            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="⚛️"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Deskripsi (English)
                                    </label>
                                    <textarea
                                        value={formData.description_en}
                                        onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                                        rows={2}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Deskripsi (Indonesia)
                                    </label>
                                    <textarea
                                        value={formData.description_id}
                                        onChange={(e) => setFormData({ ...formData, description_id: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                                        rows={2}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Kategori
                                        </label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            {categories.map((cat) => (
                                                <option key={cat.value} value={cat.value}>
                                                    {cat.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Warna
                                        </label>
                                        <input
                                            type="color"
                                            value={formData.color}
                                            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                            className="w-full h-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Urutan
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.sort_order}
                                            onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="is_active"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label htmlFor="is_active" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Aktif
                                    </label>
                                </div>

                                <div className="flex justify-end space-x-3 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsFormOpen(false)}
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        className="bg-blue-600 hover:bg-blue-700"
                                    >
                                        {editingTech ? 'Update' : 'Simpan'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 