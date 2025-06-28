"use client";

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Image from 'next/image';
import { FiUsers, FiPlus, FiEdit2, FiTrash2, FiSearch, FiEye, FiX, FiSave, FiLoader } from 'react-icons/fi';

interface TeamMember {
    id: string;
    name: string;
    role_en: string;
    role_id: string;
    bio_en: string;
    bio_id: string;
    image_url: string;
    linkedin_url?: string;
    github_url?: string;
    instagram_url?: string;
    behance_url?: string;
    sort_order: number;
    is_active: boolean;
    created_at?: string;
}

export default function AdminTeamPage() {
    const { t } = useLanguage();
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
    const [saving, setSaving] = useState(false);

    // Form state
    const [formData, setFormData] = useState<Partial<TeamMember>>({
        name: '',
        role_en: '',
        role_id: '',
        bio_en: '',
        bio_id: '',
        image_url: '',
        linkedin_url: '',
        github_url: '',
        instagram_url: '',
        behance_url: '',
        sort_order: 0,
        is_active: true
    });

    // Fetch team members
    const fetchTeamMembers = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/admin/team-members');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setTeamMembers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching team members:', error);
            setError('Failed to fetch team members');
            setTeamMembers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeamMembers();
    }, []);

    // Handle form changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    // Handle save
    const handleSave = async () => {
        try {
            setSaving(true);
            setError(null);

            // Validasi form
            if (!formData.name || !formData.role_en || !formData.role_id || !formData.bio_en || !formData.bio_id) {
                throw new Error('Mohon lengkapi semua field yang wajib diisi');
            }

            const url = editingMember
                ? `/api/admin/team-members/${editingMember.id}`
                : '/api/admin/team-members';

            const method = editingMember ? 'PUT' : 'POST';

            console.log('Sending team member data:', formData);

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Team member saved successfully:', result);

            await fetchTeamMembers();
            setShowModal(false);
            setEditingMember(null);
            setFormData({
                name: '',
                role_en: '',
                role_id: '',
                bio_en: '',
                bio_id: '',
                image_url: '',
                linkedin_url: '',
                github_url: '',
                instagram_url: '',
                behance_url: '',
                sort_order: 0,
                is_active: true
            });
        } catch (error) {
            console.error('Error saving team member:', error);
            setError(error instanceof Error ? error.message : 'Failed to save team member');
        } finally {
            setSaving(false);
        }
    };

    // Handle edit
    const handleEdit = (member: TeamMember) => {
        setEditingMember(member);
        setFormData({
            name: member.name,
            role_en: member.role_en,
            role_id: member.role_id,
            bio_en: member.bio_en,
            bio_id: member.bio_id,
            image_url: member.image_url,
            linkedin_url: member.linkedin_url || '',
            github_url: member.github_url || '',
            instagram_url: member.instagram_url || '',
            behance_url: member.behance_url || '',
            sort_order: member.sort_order,
            is_active: member.is_active
        });
        setShowModal(true);
    };

    // Handle delete
    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this team member?')) return;

        try {
            const response = await fetch(`/api/admin/team-members/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete team member');
            }

            await fetchTeamMembers();
        } catch (error) {
            console.error('Error deleting team member:', error);
            setError('Failed to delete team member');
        }
    };

    // Handle new member
    const handleNew = () => {
        setEditingMember(null);
        setFormData({
            name: '',
            role_en: '',
            role_id: '',
            bio_en: '',
            bio_id: '',
            image_url: '',
            linkedin_url: '',
            github_url: '',
            instagram_url: '',
            behance_url: '',
            sort_order: teamMembers.length,
            is_active: true
        });
        setShowModal(true);
    };

    // Filter team members
    const filteredMembers = teamMembers.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role_id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading team members...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                    <div className="flex items-start sm:items-center space-x-3">
                        <FiUsers className="text-green-500 h-6 w-6 sm:h-8 sm:w-8 mt-1 sm:mt-0" />
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                                Team Members Management
                            </h1>
                            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                                Manage your team members and their information
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleNew}
                        className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base w-full sm:w-auto justify-center"
                    >
                        <FiPlus className="h-4 w-4" />
                        <span>Add Team Member</span>
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

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <FiUsers className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Members</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{teamMembers.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <FiEye className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Members</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {teamMembers.filter(m => m.is_active).length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                        type="text"
                        placeholder="Search team members..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                </div>
            </div>

            {/* Team Members List */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                {filteredMembers.length === 0 ? (
                    <div className="text-center py-12 px-4">
                        <FiUsers className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            No team members found
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                            {teamMembers.length === 0 ? 'Get started by adding your first team member.' : 'Try adjusting your search criteria.'}
                        </p>
                        {teamMembers.length === 0 && (
                            <button
                                onClick={handleNew}
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                Add First Team Member
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-900">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Member
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Order
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredMembers.map((member) => (
                                    <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-12 w-12">
                                                    <Image
                                                        src={member.image_url || '/images/team/default-avatar.jpg'}
                                                        alt={member.name}
                                                        width={48}
                                                        height={48}
                                                        className="h-12 w-12 rounded-full object-cover"
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {member.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                                                        {member.bio_en.length > 50 ? member.bio_en.substring(0, 50) + '...' : member.bio_en}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm text-gray-900 dark:text-white">{member.role_en}</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">{member.role_id}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${member.is_active
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                }`}>
                                                {member.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            {member.sort_order}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    onClick={() => handleEdit(member)}
                                                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                >
                                                    <FiEdit2 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(member.id)}
                                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                >
                                                    <FiTrash2 className="h-4 w-4" />
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

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">
                                {editingMember ? 'Edit Team Member' : 'Add New Team Member'}
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
                            >
                                <FiX className="h-5 w-5 sm:h-6 sm:w-6" />
                            </button>
                        </div>

                        <div className="p-4 sm:p-6 space-y-4">
                            {/* Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Sort Order
                                    </label>
                                    <input
                                        type="number"
                                        name="sort_order"
                                        value={formData.sort_order}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>
                            </div>

                            {/* Roles */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Role (English) *
                                    </label>
                                    <input
                                        type="text"
                                        name="role_en"
                                        value={formData.role_en}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Role (Indonesian) *
                                    </label>
                                    <input
                                        type="text"
                                        name="role_id"
                                        value={formData.role_id}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Bio */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Bio (English) *
                                    </label>
                                    <textarea
                                        name="bio_en"
                                        value={formData.bio_en}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Bio (Indonesian) *
                                    </label>
                                    <textarea
                                        name="bio_id"
                                        value={formData.bio_id}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Image URL */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Profile Image URL
                                </label>
                                <input
                                    type="url"
                                    name="image_url"
                                    value={formData.image_url}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>

                            {/* Social Links */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        LinkedIn URL
                                    </label>
                                    <input
                                        type="url"
                                        name="linkedin_url"
                                        value={formData.linkedin_url}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="https://linkedin.com/in/..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        GitHub URL
                                    </label>
                                    <input
                                        type="url"
                                        name="github_url"
                                        value={formData.github_url}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="https://github.com/..."
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Instagram URL
                                    </label>
                                    <input
                                        type="url"
                                        name="instagram_url"
                                        value={formData.instagram_url}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="https://instagram.com/..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Behance URL
                                    </label>
                                    <input
                                        type="url"
                                        name="behance_url"
                                        value={formData.behance_url}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="https://behance.net/..."
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
                                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                />
                                <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                    Active (Display on website)
                                </label>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors w-full sm:w-auto"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-4 py-2 text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded-md transition-colors disabled:opacity-50 flex items-center justify-center space-x-2 w-full sm:w-auto"
                            >
                                {saving ? <FiLoader className="h-4 w-4 animate-spin" /> : <FiSave className="h-4 w-4" />}
                                <span>{saving ? 'Saving...' : 'Save Member'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 