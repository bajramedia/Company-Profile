'use client';

import { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiX } from 'react-icons/fi';
import Button from '@/components/Button';

interface Tag {
  id: string;
  name: string;
  postCount?: number;
}

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTagName, setNewTagName] = useState('');
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  
  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/tags');
      if (!res.ok) throw new Error('Failed to fetch tags');
      const data = await res.json();
      setTags(data);
      setError(null);
    } catch (err) {
      setError('Error loading tags');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTagName.trim()) return;
    
    try {
      const res = await fetch('/api/admin/tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newTagName.trim() }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create tag');
      }
      
      setNewTagName('');
      fetchTags();
    } catch (err: any) {
      setError(err.message || 'Error creating tag');
      console.error(err);
    }
  };

  const handleUpdateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingTag || !editingTag.name.trim()) return;
    
    try {
      const res = await fetch(`/api/admin/tags/${editingTag.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: editingTag.name.trim() }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update tag');
      }
      
      setEditingTag(null);
      fetchTags();
    } catch (err: any) {
      setError(err.message || 'Error updating tag');
      console.error(err);
    }
  };

  const handleDeleteTag = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tag?')) return;
    
    try {
      const res = await fetch(`/api/admin/tags/${id}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete tag');
      }
      
      fetchTags();
    } catch (err: any) {
      setError(err.message || 'Error deleting tag');
      console.error(err);
    }
  };

  const startEditing = (tag: Tag) => {
    setEditingTag({ ...tag });
  };

  const cancelEditing = () => {
    setEditingTag(null);
  };

  if (loading) return <div className="p-4">Loading tags...</div>;

  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Tags Management</h1>
        <p className="text-gray-600">Create and manage blog tags.</p>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">{error}</div>}

      <div className="bg-white p-4 rounded-md shadow-sm mb-6">
        <h2 className="font-semibold mb-3">Create New Tag</h2>
        <form onSubmit={handleCreateTag} className="flex gap-3">
          <input
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            className="flex-grow border rounded-md px-3 py-2"
            placeholder="Enter tag name"
            required
          />
          <Button type="submit">Add Tag</Button>
        </form>
      </div>

      {editingTag && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit Tag</h3>
              <button onClick={cancelEditing} className="text-gray-500 hover:text-gray-700">
                <FiX size={24} />
              </button>
            </div>
            <form onSubmit={handleUpdateTag}>
              <div className="mb-4">
                <label htmlFor="tagName" className="block text-sm font-medium mb-1">
                  Tag Name
                </label>
                <input
                  id="tagName"
                  type="text"
                  value={editingTag.name}
                  onChange={(e) => setEditingTag({ ...editingTag, name: e.target.value })}
                  className="w-full border rounded-md px-3 py-2"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={cancelEditing}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm"
                >
                  Cancel
                </button>
                <Button type="submit">Update Tag</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-md shadow-sm">
        <h2 className="font-semibold p-4 border-b">All Tags</h2>
        <div className="p-4">
          {tags.length === 0 ? (
            <p className="text-gray-500 text-sm">No tags found</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <div key={tag.id} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                  <span className="mr-2">{tag.name}</span>
                  <span className="text-xs text-gray-500 mr-2">({tag.postCount || 0})</span>
                  <div className="flex items-center">
                    <button
                      onClick={() => startEditing(tag)}
                      className="text-blue-600 hover:text-blue-900 mr-1"
                      title="Edit"
                    >
                      <FiEdit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteTag(tag.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
