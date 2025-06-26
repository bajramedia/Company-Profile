'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import { Button } from '@/components';
import { useLanguage } from '@/context/LanguageContext';

interface Category {
  id: string;
  name: string;
  slug: string;
  postCount?: number;
}

export default function CategoriesPage() {
  const { t } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState({ name: '', slug: '' });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/categories');
      if (!res.ok) throw new Error('Failed to fetch categories');
      const data = await res.json();
      setCategories(data);
      setError(null);
    } catch (err) {
      setError('Error loading categories');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete category');

      fetchCategories();
    } catch (err) {
      setError('Error deleting category');
      console.error(err);
    }
  };

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const category = editingCategory ? editingCategory : newCategory;
      const method = editingCategory ? 'PUT' : 'POST';
      const url = editingCategory
        ? `/api/admin/categories/${editingCategory.id}`
        : '/api/admin/categories';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(category),
      });

      if (!res.ok) throw new Error(`Failed to ${editingCategory ? 'update' : 'create'} category`);

      setNewCategory({ name: '', slug: '' });
      setEditingCategory(null);
      fetchCategories();
    } catch (err) {
      setError(`Error ${editingCategory ? 'updating' : 'creating'} category`);
      console.error(err);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>, isEditing: boolean) => {
    const name = e.target.value;
    const slug = generateSlug(name);

    if (isEditing) {
      setEditingCategory(prev => prev ? { ...prev, name, slug } : null);
    } else {
      setNewCategory({ name, slug });
    }
  };

  if (loading) return <div className="p-4 dark:text-white">{t('admin.loading')}</div>;

  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{t('admin.categoriesManagement')}</h1>
        <p className="text-gray-600 dark:text-gray-400">{t('admin.categoriesDescription')}</p>
      </div>

      {error && <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md mb-4">{error}</div>}

      <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm mb-6 border border-gray-200 dark:border-gray-700">
        <h2 className="font-semibold mb-3 text-gray-900 dark:text-white">
          {editingCategory ? t('admin.editCategory') : t('admin.createNewCategory')}
        </h2>
        <form onSubmit={handleCreateOrUpdate} className="space-y-3">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              {t('admin.categoryName')}
            </label>
            <input
              id="name"
              type="text"
              value={editingCategory ? editingCategory.name : newCategory.name}
              onChange={(e) => handleNameChange(e, !!editingCategory)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
          <div>
            <label htmlFor="slug" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              {t('admin.categorySlug')}
            </label>
            <input
              id="slug"
              type="text"
              value={editingCategory ? editingCategory.slug : newCategory.slug}
              onChange={(e) => editingCategory
                ? setEditingCategory({ ...editingCategory, slug: e.target.value })
                : setNewCategory({ ...newCategory, slug: e.target.value })
              }
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
          <div className="flex space-x-3">
            <Button type="submit" variant="primary">
              {editingCategory ? t('admin.updateCategory') : t('admin.createCategory')}
            </Button>
            {editingCategory && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {t('admin.cancel')}
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="font-semibold p-4 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">{t('admin.allCategories')}</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('admin.categoryName')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('admin.categorySlug')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('admin.posts')}</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('admin.actions')}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {categories.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">{t('admin.noCategoriesFound')}</td></tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {category.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {category.slug}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {category.postCount || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title={t('admin.edit')}
                        >
                          <FiEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          title={t('admin.delete')}
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
