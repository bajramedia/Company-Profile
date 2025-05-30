'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import Button from '@/components/Button';

interface Category {
  id: string;
  name: string;
  slug: string;
  postCount?: number;
}

export default function CategoriesPage() {
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

  if (loading) return <div className="p-4">Loading categories...</div>;

  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Categories Management</h1>
        <p className="text-gray-600">Create and manage blog categories.</p>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">{error}</div>}

      <div className="bg-white p-4 rounded-md shadow-sm mb-6">
        <h2 className="font-semibold mb-3">
          {editingCategory ? 'Edit Category' : 'Create New Category'}
        </h2>
        <form onSubmit={handleCreateOrUpdate} className="space-y-3">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={editingCategory ? editingCategory.name : newCategory.name}
              onChange={(e) => handleNameChange(e, !!editingCategory)}
              className="w-full border rounded-md px-3 py-2"
              required
            />
          </div>
          <div>
            <label htmlFor="slug" className="block text-sm font-medium mb-1">
              Slug
            </label>
            <input
              id="slug"
              type="text"
              value={editingCategory ? editingCategory.slug : newCategory.slug}
              onChange={(e) => editingCategory
                ? setEditingCategory({ ...editingCategory, slug: e.target.value })
                : setNewCategory({ ...newCategory, slug: e.target.value })
              }
              className="w-full border rounded-md px-3 py-2"
              required
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit">
              {editingCategory ? 'Update Category' : 'Create Category'}
            </Button>
            {editingCategory && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-md shadow-sm">
        <h2 className="font-semibold p-4 border-b">All Categories</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Posts
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    No categories found
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {category.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {category.slug}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {category.postCount || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <FiEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
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
