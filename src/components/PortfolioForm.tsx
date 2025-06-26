"use client";

import { useState, useEffect } from 'react';
import { Button, RichTextEditor, ImageUpload } from '@/components';
import { useLanguage } from '@/context/LanguageContext';

interface PortfolioCategory {
  id: string;
  name: string;
  slug: string;
  color?: string;
  icon?: string;
}

interface PortfolioTag {
  id: string;
  name: string;
  slug: string;
  color?: string;
}

interface PortfolioFormData {
  title: string;
  slug: string;
  description: string;
  content: string;
  featuredImage: string;
  images: string[];
  clientName: string;
  projectUrl: string;
  githubUrl: string;
  featured: boolean;
  published: boolean;
  startDate: string;
  endDate: string;
  categoryId: string;
  tagIds: string[];
}

interface PortfolioFormProps {
  initialData?: Partial<PortfolioFormData>;
  categories: PortfolioCategory[];
  tags: PortfolioTag[];
  onSubmit: (data: PortfolioFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  isEditing?: boolean;
}

export default function PortfolioForm({
  initialData,
  categories,
  tags,
  onSubmit,
  onCancel,
  isLoading = false,
  isEditing = false
}: PortfolioFormProps) {
  const { t } = useLanguage();

  const [formData, setFormData] = useState<PortfolioFormData>({
    title: '',
    slug: '',
    description: '',
    content: '',
    featuredImage: '',
    images: [],
    clientName: '',
    projectUrl: '',
    githubUrl: '',
    featured: false,
    published: false,
    startDate: '',
    endDate: '',
    categoryId: '',
    tagIds: [],
    ...initialData
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Generate slug from title
  useEffect(() => {
    if (formData.title && !isEditing) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.title, isEditing]);

  const handleInputChange = (field: keyof PortfolioFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleTagToggle = (tagId: string) => {
    setFormData(prev => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter(id => id !== tagId)
        : [...prev.tagIds, tagId]
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = t('validation.titleRequired');
    if (!formData.slug.trim()) newErrors.slug = t('validation.slugRequired');
    if (!formData.description.trim()) newErrors.description = t('validation.descriptionRequired');
    if (!formData.content.trim()) newErrors.content = t('validation.contentRequired');
    if (!formData.featuredImage.trim()) newErrors.featuredImage = t('validation.featuredImageRequired');
    if (!formData.clientName.trim()) newErrors.clientName = t('validation.clientNameRequired');
    if (!formData.categoryId) newErrors.categoryId = t('validation.categoryRequired');

    // Validate URLs if provided
    if (formData.projectUrl && !isValidUrl(formData.projectUrl)) {
      newErrors.projectUrl = t('validation.invalidProjectUrl');
    }
    if (formData.githubUrl && !isValidUrl(formData.githubUrl)) {
      newErrors.githubUrl = t('validation.invalidGithubUrl');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          {t('portfolioForm.basicInfo')}
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('portfolioForm.projectTitle')} *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary ${errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              placeholder={t('portfolioForm.projectTitlePlaceholder')}
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('portfolioForm.slug')} *
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => handleInputChange('slug', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary ${errors.slug ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              placeholder={t('portfolioForm.slugPlaceholder')}
            />
            {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('portfolioForm.clientName')} *
            </label>
            <input
              type="text"
              value={formData.clientName}
              onChange={(e) => handleInputChange('clientName', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary ${errors.clientName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              placeholder={t('portfolioForm.clientNamePlaceholder')}
            />
            {errors.clientName && <p className="text-red-500 text-xs mt-1">{errors.clientName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('portfolioForm.category')} *
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => handleInputChange('categoryId', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary ${errors.categoryId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
            >
              <option value="">{t('portfolioForm.selectCategory')}</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId}</p>}
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('portfolioForm.shortDescription')} *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={3}
            className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary ${errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            placeholder={t('portfolioForm.shortDescriptionPlaceholder')}
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          {t('portfolioForm.detailContent')}
        </h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('portfolioForm.fullContent')} *
          </label>
          <RichTextEditor
            content={formData.content}
            onChange={(value) => handleInputChange('content', value)}
            placeholder={t('portfolioForm.fullContentPlaceholder')}
          />
          {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content}</p>}
        </div>
      </div>

      {/* Images */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          {t('portfolioForm.projectImages')}
        </h3>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('portfolioForm.mainImage')} *
            </label>
            <ImageUpload
              value={formData.featuredImage}
              onChange={(url) => handleInputChange('featuredImage', url)}
            />
            {errors.featuredImage && <p className="text-red-500 text-xs mt-1">{errors.featuredImage}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('portfolioForm.additionalImages')}
            </label>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              {t('portfolioForm.additionalImagesDesc')}
            </p>
            {/* Multiple image upload component would go here */}
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                Multiple image upload coming soon...
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Project Links */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          {t('portfolioForm.projectLinks')}
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('portfolioForm.projectUrl')}
            </label>
            <input
              type="url"
              value={formData.projectUrl}
              onChange={(e) => handleInputChange('projectUrl', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary ${errors.projectUrl ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              placeholder="https://project-website.com"
            />
            {errors.projectUrl && <p className="text-red-500 text-xs mt-1">{errors.projectUrl}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('portfolioForm.githubUrl')}
            </label>
            <input
              type="url"
              value={formData.githubUrl}
              onChange={(e) => handleInputChange('githubUrl', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary ${errors.githubUrl ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              placeholder="https://github.com/username/repo"
            />
            {errors.githubUrl && <p className="text-red-500 text-xs mt-1">{errors.githubUrl}</p>}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          {t('portfolioForm.timeline')}
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('portfolioForm.startDate')}
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('portfolioForm.endDate')}
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* Technologies */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          {t('portfolioForm.technologies')}
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {tags.map(tag => (
            <label
              key={tag.id}
              className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${formData.tagIds.includes(tag.id)
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
            >
              <input
                type="checkbox"
                checked={formData.tagIds.includes(tag.id)}
                onChange={() => handleTagToggle(tag.id)}
                className="hidden"
              />
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: tag.color || '#6B7280' }}
              />
              <span className="text-sm font-medium">{tag.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          {t('portfolioForm.settings')}
        </h3>

        <div className="space-y-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => handleInputChange('featured', e.target.checked)}
              className="w-5 h-5 text-primary focus:ring-primary border-gray-300 dark:border-gray-600 rounded"
            />
            <div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                ⭐ {t('portfolioForm.featuredProject')}
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t('portfolioForm.featuredProjectDesc')}
              </p>
            </div>
          </label>

          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={(e) => handleInputChange('published', e.target.checked)}
              className="w-5 h-5 text-primary focus:ring-primary border-gray-300 dark:border-gray-600 rounded"
            />
            <div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                ✅ {t('portfolioForm.publish')}
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t('portfolioForm.publishDesc')}
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={onCancel}
          disabled={isLoading}
        >
          {t('portfolioForm.cancel')}
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>{isEditing ? t('portfolioForm.updating') : t('portfolioForm.saving')}</span>
            </div>
          ) : (
            <span>{isEditing ? t('portfolioForm.updateProject') : t('portfolioForm.saveProject')}</span>
          )}
        </Button>
      </div>
    </form>
  );
} 