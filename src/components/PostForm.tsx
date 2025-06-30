"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createPost, updatePost } from '@/actions/post-actions';
import { FiSave, FiX, FiEye, FiCalendar, FiClock, FiUser, FiTag, FiFolder, FiImage, FiFileText, FiGlobe, FiSettings } from 'react-icons/fi';
import ImageUpload from './ImageUpload';
import RichTextEditor from './RichTextEditor';
import { useLanguage } from '@/context/LanguageContext';
import { translationService, type BlogContent } from '@/services/TranslationService';

// Interface for the post form props
interface PostFormProps {
  postId?: string;
  initialData?: any;
}

export default function PostForm({ postId, initialData }: PostFormProps) {
  const router = useRouter();
  const { t } = useLanguage();
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
    tags: initialData?.tags || [],
    metaTitle: initialData?.metaTitle || '',
    metaDescription: initialData?.metaDescription || '',
    scheduledDate: initialData?.scheduledDate || '',
    keywords: initialData?.keywords || '',
    socialShareText: initialData?.socialShareText || '',
    isScheduled: initialData?.isScheduled || false
  });
  const [authors, setAuthors] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [allTags, setAllTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [activeTab, setActiveTab] = useState('content');
  const [wordCount, setWordCount] = useState(0);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');

  // Auto-translation states
  const [autoTranslateEnabled, setAutoTranslateEnabled] = useState(false);
  const [sourceLang, setSourceLang] = useState('id');
  const [targetLang, setTargetLang] = useState('en');
  const [translationStatus, setTranslationStatus] = useState<'idle' | 'detecting' | 'translating' | 'success' | 'error'>('idle');
  const [translatedContent, setTranslatedContent] = useState<BlogContent | null>(null);
  const [supportedLanguages, setSupportedLanguages] = useState<Array<{ code: string, name: string }>>([]);

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
    console.log('🚀 Form submission started');
    console.log('📝 Form data:', formData);

    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      const requiredFields = {
        title: formData.title?.trim(),
        excerpt: formData.excerpt?.trim(),
        content: formData.content?.trim(),
        authorId: formData.authorId,
        categoryId: formData.categoryId
      };

      const missingFields = Object.entries(requiredFields)
        .filter(([key, value]) => !value || value === '')
        .map(([key]) => key);

      if (missingFields.length > 0) {
        console.error('❌ Missing required fields:', missingFields);
        setError(`Please fill in required fields: ${missingFields.join(', ')}`);
        setLoading(false);
        return;
      }

      console.log('🔄 Calling internal API...');

      // Call internal API route instead of server action
      const apiEndpoint = isEditing ? `/api/admin/posts/${postId}` : '/api/admin/posts';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(apiEndpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      console.log('📊 API Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ API Error response:', errorData);
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('📊 API Result:', result);

      if (result.success) {
        console.log('✅ Post saved successfully, redirecting...');
        router.push('/admin/posts');
      } else {
        console.error('❌ Post save failed:', result.error);
        setError(result.error || 'Failed to save post');
      }
    } catch (err: any) {
      console.error('💥 Exception during form submission:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
      console.log('🏁 Form submission completed');
    }
  };

  // Calculate estimated read time based on content length
  const calculateReadTime = () => {
    const words = formData.content.replace(/<[^>]*>/g, '').trim().split(/\s+/).filter((word: string) => word.length > 0);
    const wordCount = words.length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200)); // Assuming 200 words per minute

    setWordCount(wordCount);
    setFormData(prev => ({ ...prev, readTime }));
  };

  // Auto-save draft function
  const autoSaveDraft = async () => {
    if (!formData.title.trim() || loading) return;

    setSaveStatus('saving');
    try {
      // Create a draft version
      const draftData = { ...formData, published: false };

      if (isEditing) {
        await updatePost(postId!, draftData);
      } else {
        // For new posts, we could save as draft to localStorage or database
        localStorage.setItem('blog_draft', JSON.stringify(draftData));
      }

      setSaveStatus('saved');
    } catch (error) {
      console.error('Auto-save failed:', error);
      setSaveStatus('unsaved');
    }
  };

  // Auto-save effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.title || formData.content) {
        autoSaveDraft();
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearTimeout(timer);
  }, [formData]);

  // Update word count when content changes
  useEffect(() => {
    calculateReadTime();
  }, [formData.content]);

  // Generate meta description from excerpt or content
  const generateMetaDescription = () => {
    let description = formData.excerpt;
    if (!description && formData.content) {
      description = formData.content
        .replace(/<[^>]*>/g, '')
        .substring(0, 155)
        .trim();
    }
    setFormData(prev => ({ ...prev, metaDescription: description }));
  };

  // Generate meta title from title
  const generateMetaTitle = () => {
    const metaTitle = formData.title + (formData.title ? ' | Bajramedia Blog' : '');
    setFormData(prev => ({ ...prev, metaTitle }));
  };  // Simple preview rendering of content
  const renderPreview = () => {
    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {formData.featuredImage && (
          <img
            src={formData.featuredImage}
            alt={formData.title}
            className="w-full h-64 object-cover"
          />
        )}
        <div className="p-8">
          <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <FiUser size={16} />
              {authors.find(a => a.id === formData.authorId)?.name || 'Unknown Author'}
            </span>
            <span className="flex items-center gap-1">
              <FiCalendar size={16} />
              {new Date().toLocaleDateString('id-ID')}
            </span>
            <span className="flex items-center gap-1">
              <FiClock size={16} />
              {formData.readTime} min read
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-4 text-gray-900">{formData.title || 'Untitled Post'}</h1>
          {formData.excerpt && (
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">{formData.excerpt}</p>
          )}
          <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: formData.content }} />

          {formData.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tagId: string) => {
                  const tag = allTags.find(t => t.id === tagId);
                  return tag ? (
                    <span key={tagId} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      #{tag.name}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const tabs = [
    { id: 'content', label: t('postForm.content'), icon: FiFileText },
    { id: 'settings', label: t('postForm.settings'), icon: FiSettings },
    { id: 'seo', label: t('postForm.seo'), icon: FiGlobe },
    { id: 'social', label: t('postForm.social'), icon: FiTag },
    { id: 'translation', label: t('autoTranslate.title'), icon: FiGlobe }
  ];
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {isEditing ? t('postForm.editPost') : t('postForm.createNew')}
              </h1>
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <FiFileText size={16} />
                  {wordCount} {t('postForm.words')}
                </span>
                <span className="flex items-center gap-1">
                  <FiClock size={16} />
                  {formData.readTime} {t('postForm.minRead')}
                </span>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  {saveStatus === 'saved' && <span className="text-green-600">✓ {t('postForm.saved')}</span>}
                  {saveStatus === 'saving' && <span className="text-yellow-600">⏳ {t('postForm.saving')}</span>}
                  {saveStatus === 'unsaved' && <span className="text-red-600">⚠ {t('postForm.unsaved')}</span>}
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setPreviewMode(!previewMode)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
              >
                <FiEye className="mr-2" size={16} />
                {previewMode ? t('postForm.edit') : t('postForm.preview')}
              </button>

              <button
                type="button"
                onClick={() => router.push('/admin/posts')}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
              >
                <FiX className="mr-2" size={16} />
                {t('postForm.cancel')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-100 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-4 mb-6 rounded-r-lg">
            <div className="flex items-center">
              <span className="mr-2">⚠</span>
              <p>{error}</p>
            </div>
          </div>
        )}

        {previewMode ? (
          <div className="w-[90%] mx-auto">
            {renderPreview()}
          </div>
        ) : (
          <div className="w-[95%] mx-auto">
            {/* Tab Navigation */}
            <div className="bg-white dark:bg-gray-800 rounded-t-lg border-b border-gray-200 dark:border-gray-700">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                    >
                      <Icon size={18} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Tab Content */}
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-b-lg shadow-lg">
              {activeTab === 'content' && (
                <div className="p-6 space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                      {t('postForm.title')} *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      onBlur={() => {
                        if (!formData.slug) generateSlug();
                        if (!formData.metaTitle) generateMetaTitle();
                      }}
                      placeholder={t('postForm.titlePlaceholder')}
                      className="w-full px-4 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Slug */}
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                      {t('postForm.slug')} *
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm">
                        /blog/
                      </span>
                      <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        placeholder={t('postForm.slugPlaceholder')}
                        className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                      <button
                        type="button"
                        onClick={generateSlug}
                        className="px-4 py-3 bg-gray-100 dark:bg-gray-600 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors text-gray-700 dark:text-gray-300"
                      >
                        {t('postForm.generate')}
                      </button>
                    </div>
                  </div>

                  {/* Featured Image */}
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                      {t('postForm.featuredImage')}
                    </label>
                    <ImageUpload
                      value={formData.featuredImage}
                      onChange={(url) => setFormData(prev => ({ ...prev, featuredImage: url }))}
                      label="Upload or paste image URL"
                      className="w-full"
                    />
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                      {t('postForm.excerpt')} *
                    </label>
                    <textarea
                      name="excerpt"
                      value={formData.excerpt}
                      onChange={handleChange}
                      onBlur={generateMetaDescription}
                      rows={3}
                      placeholder={t('postForm.excerptPlaceholder')}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {formData.excerpt.length}/300 characters
                    </p>
                  </div>

                  {/* Content Editor */}
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                      {t('postForm.content')} *
                    </label>
                    <RichTextEditor
                      content={formData.content}
                      onChange={(content) => {
                        setFormData(prev => ({ ...prev, content }));
                        setSaveStatus('unsaved');
                      }}
                      placeholder="Start writing your amazing blog post..."
                      className="w-full min-h-96"
                    />
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Author */}
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                        Author *
                      </label>
                      <select
                        name="authorId"
                        value={formData.authorId}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                        Category *
                      </label>
                      <select
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                    {/* Read Time */}
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                        Estimated Read Time (minutes)
                      </label>
                      <div className="flex">
                        <input
                          type="number"
                          name="readTime"
                          value={formData.readTime}
                          onChange={handleChange}
                          min="1"
                          max="60"
                          className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={calculateReadTime}
                          className="px-4 py-3 bg-gray-100 dark:bg-gray-600 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors text-gray-700 dark:text-gray-300"
                        >
                          Auto-calculate
                        </button>
                      </div>
                    </div>

                    {/* Publication Status */}
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                        Publication
                      </label>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="publicationStatus"
                            checked={!formData.isScheduled && formData.published}
                            onChange={() => setFormData(prev => ({ ...prev, published: true, isScheduled: false }))}
                            className="h-4 w-4 text-blue-600"
                          />
                          <span className="ml-2">Publish immediately</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="publicationStatus"
                            checked={!formData.published && !formData.isScheduled}
                            onChange={() => setFormData(prev => ({ ...prev, published: false, isScheduled: false }))}
                            className="h-4 w-4 text-blue-600"
                          />
                          <span className="ml-2">Save as draft</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="publicationStatus"
                            checked={formData.isScheduled}
                            onChange={() => setFormData(prev => ({ ...prev, isScheduled: true, published: false }))}
                            className="h-4 w-4 text-blue-600"
                          />
                          <span className="ml-2">Schedule for later</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Scheduled Date */}
                  {formData.isScheduled && (
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                        Scheduled Date & Time
                      </label>
                      <input
                        type="datetime-local"
                        name="scheduledDate"
                        value={formData.scheduledDate}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}

                  {/* Tags */}
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                      {allTags.map(tag => (
                        <label key={tag.id} className="flex items-center bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-lg cursor-pointer transition-colors">
                          <input
                            type="checkbox"
                            checked={formData.tags.includes(tag.id)}
                            onChange={() => handleTagChange(tag.id)}
                            className="h-4 w-4 text-blue-600 rounded"
                          />
                          <span className="ml-2 text-sm">{tag.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SEO Tab */}
              {activeTab === 'seo' && (
                <div className="p-6 space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-blue-900 mb-2">SEO Optimization</h3>
                    <p className="text-blue-700 text-sm">
                      Optimize your post for search engines to improve visibility and ranking.
                    </p>
                  </div>

                  {/* Meta Title */}
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      name="metaTitle"
                      value={formData.metaTitle}
                      onChange={handleChange}
                      placeholder="SEO-optimized title for search engines..."
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      maxLength={60}
                    />
                    <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <span>This will appear as the title in search results</span>
                      <span>{formData.metaTitle.length}/60</span>
                    </div>
                    <button
                      type="button"
                      onClick={generateMetaTitle}
                      className="text-blue-600 hover:text-blue-800 text-sm mt-1"
                    >
                      Generate from title
                    </button>
                  </div>

                  {/* Meta Description */}
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                      Meta Description
                    </label>
                    <textarea
                      name="metaDescription"
                      value={formData.metaDescription}
                      onChange={handleChange}
                      rows={3}
                      placeholder="A concise description that will appear in search results..."
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      maxLength={155}
                    />
                    <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <span>This will appear as the description in search results</span>
                      <span>{formData.metaDescription.length}/155</span>
                    </div>
                    <button
                      type="button"
                      onClick={generateMetaDescription}
                      className="text-blue-600 hover:text-blue-800 text-sm mt-1"
                    >
                      Generate from excerpt
                    </button>
                  </div>

                  {/* Keywords */}
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                      Focus Keywords
                    </label>
                    <input
                      type="text"
                      name="keywords"
                      value={formData.keywords}
                      onChange={handleChange}
                      placeholder="Enter keywords separated by commas..."
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Example: web development, react, javascript, tutorial
                    </p>
                  </div>
                </div>
              )}

              {/* Social Tab */}
              {activeTab === 'social' && (
                <div className="p-6 space-y-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-green-900 mb-2">Social Media Optimization</h3>
                    <p className="text-green-700 text-sm">
                      Customize how your post appears when shared on social media platforms.
                    </p>
                  </div>

                  {/* Social Share Text */}
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                      Social Share Text
                    </label>
                    <textarea
                      name="socialShareText"
                      value={formData.socialShareText}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Custom text that will be used when sharing this post..."
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      maxLength={280}
                    />
                    <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <span>Twitter-optimized length recommended</span>
                      <span>{formData.socialShareText.length}/280</span>
                    </div>
                  </div>

                  {/* Social Preview */}
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                      Social Media Preview
                    </label>
                    <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                      <div className="flex">
                        {formData.featuredImage && (
                          <img
                            src={formData.featuredImage}
                            alt="Preview"
                            className="w-20 h-20 object-cover rounded-lg mr-4"
                          />
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 line-clamp-2">
                            {formData.metaTitle || formData.title || 'Post Title'}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {formData.metaDescription || formData.excerpt || 'Post description...'}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">bajramedia.com</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    {saveStatus === 'saved' && '✓ All changes saved'}
                    {saveStatus === 'saving' && '⏳ Saving changes...'}
                    {saveStatus === 'unsaved' && '⚠ You have unsaved changes'}
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`${loading ? 'opacity-75 cursor-wait' : 'hover:bg-blue-700'
                      } bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors`}
                  >
                    {loading ? 'Saving...' : (
                      formData.published ? 'Publish Post' :
                        formData.isScheduled ? 'Schedule Post' : 'Save Draft'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
