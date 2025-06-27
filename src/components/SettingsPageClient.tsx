'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/Button';
import Heading from '@/components/Heading';
import { settingsService, SiteSettings, defaultSettings } from '@/services/SettingsService';

export default function SettingsPageClient() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setInitialLoading(true);
      const loadedSettings = await settingsService.getSettings();
      setSettings(loadedSettings);
      setError(null);
    } catch (error) {
      console.error('Error loading settings:', error);
      setError('Failed to load settings. Using default values.');
    } finally {
      setInitialLoading(false);
    }
  };

  const saveSettings = async () => {
    setLoading(true);
    setSaved(false);
    setError(null);

    try {
      // DEBUG: Alert untuk memastikan function terpanggil
      if (process.env.NODE_ENV === 'development') {
        alert('🔥 DEBUG: Save function called!');
      }

      // DEBUG: Log data yang akan dikirim
      console.log('🔥 CLIENT DEBUG: Settings to save:', settings);
      console.log('🔥 CLIENT DEBUG: Settings keys:', Object.keys(settings));
      console.log('🔥 CLIENT DEBUG: Sample nested data:', {
        siteName: settings.siteName,
        socialLinks: settings.socialLinks,
        seoSettings: settings.seoSettings
      });

      const success = await settingsService.saveSettings(settings);

      console.log('🔥 CLIENT DEBUG: Save result:', success);

      // DEBUG: Alert hasil save
      if (process.env.NODE_ENV === 'development') {
        alert(`🔥 DEBUG: Save result: ${success}`);
      }

      if (success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError('Failed to save settings. Please try again.');
      }
    } catch (error) {
      console.error('🔥 CLIENT DEBUG: Error saving settings:', error);

      // DEBUG: Alert error
      if (process.env.NODE_ENV === 'development') {
        alert(`🔥 DEBUG: Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      setError(`Failed to save settings: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const resetToDefaults = async () => {
    if (confirm('Are you sure you want to reset all settings to default values? This cannot be undone.')) {
      setLoading(true);
      try {
        const success = await settingsService.resetToDefaults();
        if (success) {
          setSettings(defaultSettings);
          setSaved(true);
          setTimeout(() => setSaved(false), 3000);
        } else {
          setError('Failed to reset settings.');
        }
      } catch (error) {
        console.error('Error resetting settings:', error);
        setError('Failed to reset settings.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleInputChange = (section: keyof SiteSettings, field: string, value: any) => {
    setSettings(prev => {
      if (section === 'socialLinks' || section === 'seoSettings') {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [field]: value
          }
        };
      } else {
        return {
          ...prev,
          [section]: value
        };
      }
    });
  };

  const tabs = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'contact', label: 'Contact', icon: '📞' },
    { id: 'social', label: 'Social Media', icon: '🌐' },
    { id: 'seo', label: 'SEO', icon: '🔍' },
    { id: 'advanced', label: 'Advanced', icon: '🛠️' }
  ];

  if (initialLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading settings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Configure your site settings and preferences</p>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-lg shadow-sm border">
            <nav className="p-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition-colors flex items-center gap-3 ${activeTab === tab.id
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:w-3/4">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div>
                <h3 className="text-lg font-semibold mb-6">General Settings</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site Name
                    </label>
                    <input
                      type="text"
                      value={settings.siteName}
                      onChange={(e) => handleInputChange('siteName', '', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site Description
                    </label>
                    <textarea
                      value={settings.siteDescription}
                      onChange={(e) => handleInputChange('siteDescription', '', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site URL
                    </label>
                    <input
                      type="url"
                      value={settings.siteUrl}
                      onChange={(e) => handleInputChange('siteUrl', '', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Admin Email
                    </label>
                    <input
                      type="email"
                      value={settings.adminEmail}
                      onChange={(e) => handleInputChange('adminEmail', '', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Posts Per Page
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={settings.postsPerPage}
                      onChange={(e) => handleInputChange('postsPerPage', '', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="enableComments"
                        checked={settings.enableComments}
                        onChange={(e) => handleInputChange('enableComments', '', e.target.checked)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="enableComments" className="ml-2 text-sm text-gray-700">
                        Enable Comments
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="enableSocialShare"
                        checked={settings.enableSocialShare}
                        onChange={(e) => handleInputChange('enableSocialShare', '', e.target.checked)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="enableSocialShare" className="ml-2 text-sm text-gray-700">
                        Enable Social Sharing
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Contact Settings */}
            {activeTab === 'contact' && (
              <div>
                <h3 className="text-lg font-semibold mb-6">Contact Information</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={settings.contactEmail}
                      onChange={(e) => handleInputChange('contactEmail', '', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      value={settings.contactPhone}
                      onChange={(e) => handleInputChange('contactPhone', '', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Address
                    </label>
                    <textarea
                      value={settings.contactAddress}
                      onChange={(e) => handleInputChange('contactAddress', '', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Footer Text
                    </label>
                    <input
                      type="text"
                      value={settings.footerText}
                      onChange={(e) => handleInputChange('footerText', '', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Social Media Settings */}
            {activeTab === 'social' && (
              <div>
                <h3 className="text-lg font-semibold mb-6">Social Media Links</h3>
                <div className="space-y-6">
                  {Object.entries(settings.socialLinks).map(([platform, url]) => (
                    <div key={platform}>
                      <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                        {platform}
                      </label>
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => handleInputChange('socialLinks', platform, e.target.value)}
                        placeholder={`https://${platform}.com/yourprofile`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SEO Settings */}
            {activeTab === 'seo' && (
              <div>
                <h3 className="text-lg font-semibold mb-6">SEO Settings</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      value={settings.seoSettings.metaTitle}
                      onChange={(e) => handleInputChange('seoSettings', 'metaTitle', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Description
                    </label>
                    <textarea
                      value={settings.seoSettings.metaDescription}
                      onChange={(e) => handleInputChange('seoSettings', 'metaDescription', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Keywords
                    </label>
                    <input
                      type="text"
                      value={settings.seoSettings.metaKeywords}
                      onChange={(e) => handleInputChange('seoSettings', 'metaKeywords', e.target.value)}
                      placeholder="keyword1, keyword2, keyword3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Open Graph Image URL
                    </label>
                    <input
                      type="url"
                      value={settings.seoSettings.ogImage}
                      onChange={(e) => handleInputChange('seoSettings', 'ogImage', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Advanced Settings */}
            {activeTab === 'advanced' && (
              <div>
                <h3 className="text-lg font-semibold mb-6">Advanced Settings</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Google Analytics Code
                    </label>
                    <input
                      type="text"
                      value={settings.analyticsCode}
                      onChange={(e) => handleInputChange('analyticsCode', '', e.target.value)}
                      placeholder="GA-XXXXXXXXX-X"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Enter your Google Analytics tracking ID
                    </p>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                    <h4 className="font-medium text-yellow-800 mb-2">Database Information</h4>
                    <div className="text-sm text-yellow-700 space-y-1">
                      <p><strong>Database:</strong> MySQL</p>
                      <p><strong>Host:</strong> localhost:3306</p>
                      <p><strong>Database Name:</strong> db_bajramedia</p>
                      <p><strong>Status:</strong> <span className="text-green-600">Connected</span></p>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                    <h4 className="font-medium text-blue-800 mb-2">Cache Settings</h4>
                    <div className="space-y-2">
                      <button
                        className="px-4 py-2 border border-blue-300 text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                        onClick={() => {
                          alert('Cache cleared successfully!');
                        }}
                      >
                        Clear Cache
                      </button>
                      <p className="text-sm text-blue-700">
                        Clear application cache to refresh data
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {saved && (
                    <span className="text-green-600 text-sm flex items-center gap-2">
                      ✅ Settings saved successfully!
                    </span>
                  )}
                  {error && (
                    <span className="text-red-600 text-sm">
                      {error}
                    </span>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={resetToDefaults}
                    disabled={loading}
                    className="px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors"
                  >
                    Reset to Defaults
                  </button>
                  <button
                    onClick={saveSettings}
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {loading ? 'Saving...' : 'Save Settings'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
