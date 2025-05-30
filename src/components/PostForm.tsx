"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createPost, updatePost } from '@/actions/post-actions';
import { FiSave, FiX, FiEye } from 'react-icons/fi';
import ImageUpload from './ImageUpload';
import RichTextEditor from './RichTextEditor';

// Interface for the post form props
interface PostFormProps {
  postId?: string;
  initialData?: any;
}

export default function PostForm({ postId, initialData }: PostFormProps) {
  const router = useRouter();
  const isEditing = !!postId;
  
  // Form state
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    excerpt: initialData?.excerpt || '',
    content: initialData?.content || '',
    featuredImage: initialData?.featuredImage || '',
    published: initialData?.published || false,
    readTime: initialData?.readTime || 3,
    authorId: initialData?.author?.id || '',
    categoryId: initialData?.category?.id || '',
    tags: initialData?.tags || []
  });
  
  const [authors, setAuthors] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [allTags, setAllTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  
  // Fetch authors, categories and tags on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch authors
        const authorsRes = await fetch('/api/admin/authors');
        const authorsData = await authorsRes.json();
        setAuthors(authorsData);
        
        // Fetch categories
        const categoriesRes = await fetch('/api/admin/categories');
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData);
        
        // Fetch tags
        const tagsRes = await fetch('/api/admin/tags');
        const tagsData = await tagsRes.json();
        setAllTags(tagsData);
        
        // Set default values if not editing
        if (!isEditing && authorsData.length > 0 && categoriesData.length > 0) {
          setFormData(prev => ({
            ...prev,
            authorId: prev.authorId || authorsData[0].id,
            categoryId: prev.categoryId || categoriesData[0].id
          }));
        }
      } catch (error) {
        console.error('Error fetching form data:', error);
        setError('Failed to load form data. Please try refreshing the page.');
      }
    };
    
    fetchData();
  }, [isEditing]);
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : value
    }));
  };
  
  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  // Handle tag selection changes
  const handleTagChange = (tagId: string) => {
    setFormData(prev => {
      const currentTags = [...prev.tags];
      
      if (currentTags.includes(tagId)) {
        return { ...prev, tags: currentTags.filter(id => id !== tagId) };
      } else {
        return { ...prev, tags: [...currentTags, tagId] };
      }
    });
  };
  
  // Auto-generate slug from title
  const generateSlug = () => {
    if (!formData.title) return;
    
    const slug = formData.title
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '-');
    
    setFormData(prev => ({ ...prev, slug }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const result = isEditing 
        ? await updatePost(postId!, formData)
        : await createPost(formData);
      
      if (result.success) {
        router.push('/admin/posts');
      } else {
        setError(result.error || 'Failed to save post');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  // Calculate estimated read time based on content length
  const calculateReadTime = () => {
    const wordCount = formData.content.trim().split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200)); // Assuming 200 words per minute
    
    setFormData(prev => ({ ...prev, readTime }));
  };
    // Simple preview rendering of content
  const renderPreview = () => {
    return (
      <div className="bg-white rounded-md shadow-md p-8">
        <h1 className="text-3xl font-bold mb-4">{formData.title}</h1>
        <p className="text-gray-600 mb-8">{formData.excerpt}</p>
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: formData.content }} />
      </div>
    );
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">
          {isEditing ? 'Edit Post' : 'Create New Post'}
        </h1>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center"
          >
            <FiEye className="mr-2" /> {previewMode ? 'Edit' : 'Preview'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/posts')}
            className="bg-gray-500 text-white px-4 py-2 rounded-md flex items-center"
          >
            <FiX className="mr-2" /> Cancel
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}
      
      {previewMode ? (
        renderPreview()
      ) : (
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="col-span-2">
              <label className="block text-gray-700 font-medium mb-2">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                onBlur={() => !formData.slug && generateSlug()}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            
            {/* Slug */}
            <div className="col-span-2 md:col-span-1">
              <label className="block text-gray-700 font-medium mb-2">
                Slug
              </label>
              <div className="flex">
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <button
                  type="button"
                  onClick={generateSlug}
                  className="ml-2 px-3 py-2 bg-gray-200 rounded-md"
                >
                  Generate
                </button>
              </div>
            </div>
            
            {/* Read Time */}
            <div className="col-span-2 md:col-span-1">
              <label className="block text-gray-700 font-medium mb-2">
                Read Time (minutes)
              </label>
              <div className="flex">
                <input
                  type="number"
                  name="readTime"
                  value={formData.readTime}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={calculateReadTime}
                  className="ml-2 px-3 py-2 bg-gray-200 rounded-md"
                >
                  Calculate
                </button>
              </div>
            </div>
            
            {/* Featured Image */}
            <div className="col-span-2">
              <label className="block text-gray-700 font-medium mb-2">
                Featured Image URL
              </label>              <ImageUpload
                value={formData.featuredImage}
                onChange={(url) => setFormData(prev => ({ ...prev, featuredImage: url }))}
                label=""
                className="w-full"
              />
            </div>
            
            {/* Excerpt */}
            <div className="col-span-2">
              <label className="block text-gray-700 font-medium mb-2">
                Excerpt
              </label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
              {/* Content */}
            <div className="col-span-2">
              <label className="block text-gray-700 font-medium mb-2">
                Content
              </label>
              <RichTextEditor
                content={formData.content}
                onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                placeholder="Write your blog post content here..."
                className="w-full"
              />
            </div>
            
            {/* Author */}
            <div className="col-span-2 md:col-span-1">
              <label className="block text-gray-700 font-medium mb-2">
                Author
              </label>
              <select
                name="authorId"
                value={formData.authorId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Select an author</option>
                {authors.map(author => (
                  <option key={author.id} value={author.id}>
                    {author.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Category */}
            <div className="col-span-2 md:col-span-1">
              <label className="block text-gray-700 font-medium mb-2">
                Category
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Tags */}
            <div className="col-span-2">
              <label className="block text-gray-700 font-medium mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mt-2">
                {allTags.map(tag => (
                  <label key={tag.id} className="inline-flex items-center bg-gray-100 px-3 py-1 rounded-full">
                    <input
                      type="checkbox"
                      checked={formData.tags.includes(tag.id)}
                      onChange={() => handleTagChange(tag.id)}
                      className="form-checkbox h-4 w-4 text-primary rounded"
                    />
                    <span className="ml-2 text-sm">{tag.name}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Published Status */}
            <div className="col-span-2">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="published"
                  checked={formData.published}
                  onChange={handleCheckboxChange}
                  className="form-checkbox h-5 w-5 text-primary rounded"
                />
                <span className="ml-2 text-gray-700">Publish immediately</span>
              </label>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`${
                loading ? 'opacity-75 cursor-wait' : ''
              } bg-primary text-white px-6 py-3 rounded-md flex items-center`}
            >
              <FiSave className="mr-2" />
              {loading ? 'Saving...' : 'Save Post'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
