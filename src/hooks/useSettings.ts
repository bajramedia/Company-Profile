import { useState, useEffect } from 'react';
import { settingsService, SiteSettings, defaultSettings } from '@/services/SettingsService';

export function useSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const loadedSettings = await settingsService.getSettings();
      setSettings(loadedSettings);
    } catch (err) {
      console.error('Error loading settings:', err);
      setError('Failed to load settings');
      setSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      const success = await settingsService.saveSettings(updatedSettings);
      
      if (success) {
        setSettings(updatedSettings);
        return true;
      } else {
        setError('Failed to update settings');
        return false;
      }
    } catch (err) {
      console.error('Error updating settings:', err);
      setError('Failed to update settings');
      return false;
    }
  };

  const getSetting = (key: keyof SiteSettings) => {
    return settings[key];
  };

  const getNestedSetting = (path: string) => {
    return path.split('.').reduce((current: any, key: string) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, settings);
  };

  return {
    settings,
    loading,
    error,
    loadSettings,
    updateSettings,
    getSetting,
    getNestedSetting
  };
}

// Hook khusus untuk settings publik (tidak termasuk admin settings)
export function usePublicSettings() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPublicSettings();
  }, []);

  const loadPublicSettings = async () => {
    try {
      setLoading(true);
      const publicSettings = await settingsService.getPublicSettings();
      setSettings(publicSettings);
    } catch (err) {
      // Fallback ke default settings publik tanpa spam console
      setSettings({
        siteName: defaultSettings.siteName,
        siteDescription: defaultSettings.siteDescription,
        contactEmail: defaultSettings.contactEmail,
        contactPhone: defaultSettings.contactPhone,
        contactAddress: defaultSettings.contactAddress,
        socialLinks: defaultSettings.socialLinks,
        footerText: defaultSettings.footerText,
        seoSettings: defaultSettings.seoSettings
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    settings,
    loading,
    reload: loadPublicSettings
  };
}
