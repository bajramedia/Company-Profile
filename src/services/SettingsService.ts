export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  adminEmail: string;
  postsPerPage: number;
  enableComments: boolean;
  enableSocialShare: boolean;
  analyticsCode: string;
  footerText: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  socialLinks: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    youtube: string;
  };
  seoSettings: {
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
    ogImage: string;
  };
}

export const defaultSettings: SiteSettings = {
  siteName: 'Bajramedia',
  siteDescription: 'Creative Digital Agency & Blog Platform',
  siteUrl: 'https://balimoonartandspeace.com',
  adminEmail: 'admin@bajramedia.com',
  postsPerPage: 10,
  enableComments: true,
  enableSocialShare: true,
  analyticsCode: '',
  footerText: '© 2025 Bajramedia. All rights reserved.',
  contactEmail: 'contact@bajramedia.com',
  contactPhone: '+6285739402436',
  contactAddress: 'Bali, Indonesia',
  socialLinks: {
    facebook: '',
    twitter: '',
    instagram: '',
    linkedin: '',
    youtube: ''
  },
  seoSettings: {
    metaTitle: 'Bajramedia - Creative Digital Agency',
    metaDescription: 'Professional digital agency providing creative solutions for your business needs.',
    metaKeywords: 'digital agency, creative, design, development, bali',
    ogImage: ''
  }
};

class SettingsService {
  private baseUrl = '/api/admin/settings';

  // Helper method untuk flatten nested objects untuk API compatibility
  private flattenSettings(settings: SiteSettings): Record<string, any> {
    const flattened: Record<string, any> = {};
    
    // Copy flat properties
    Object.keys(settings).forEach(key => {
      const value = (settings as any)[key];
      if (typeof value !== 'object' || value === null) {
        flattened[key] = value;
      }
    });

    // Flatten socialLinks
    Object.keys(settings.socialLinks).forEach(key => {
      flattened[`social_${key}`] = settings.socialLinks[key as keyof typeof settings.socialLinks];
    });

    // Flatten seoSettings
    Object.keys(settings.seoSettings).forEach(key => {
      flattened[`seo_${key}`] = settings.seoSettings[key as keyof typeof settings.seoSettings];
    });

    return flattened;
  }

  // Helper method untuk unflatten API response kembali ke nested structure
  private unflattenSettings(flatSettings: Record<string, any>): SiteSettings {
    const settings = { ...defaultSettings };
    
    // Copy flat properties
    Object.keys(flatSettings).forEach(key => {
      if (!key.startsWith('social_') && !key.startsWith('seo_')) {
        if (key in settings) {
          (settings as any)[key] = flatSettings[key];
        }
      }
    });

    // Reconstruct socialLinks
    Object.keys(flatSettings).forEach(key => {
      if (key.startsWith('social_')) {
        const socialKey = key.replace('social_', '');
        if (socialKey in settings.socialLinks) {
          (settings.socialLinks as any)[socialKey] = flatSettings[key];
        }
      }
    });

    // Reconstruct seoSettings
    Object.keys(flatSettings).forEach(key => {
      if (key.startsWith('seo_')) {
        const seoKey = key.replace('seo_', '');
        if (seoKey in settings.seoSettings) {
          (settings.seoSettings as any)[seoKey] = flatSettings[key];
        }
      }
    });

    return settings;
  }

  async getSettings(): Promise<SiteSettings> {
    try {
      const response = await fetch(this.baseUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }
      
      const flatSettings = await response.json();
      
      // Convert flat structure back to nested
      const settings = this.unflattenSettings(flatSettings);
      
      return settings;
    } catch (error) {
      console.error('Error fetching settings:', error);
      return defaultSettings;
    }
  }

  async saveSettings(settings: SiteSettings): Promise<boolean> {
    try {
      // Flatten settings structure untuk API compatibility
      const flatSettings = this.flattenSettings(settings);

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(flatSettings),
      });

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(`Failed to save settings: ${response.status} - ${responseText}`);
      }

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error('Invalid JSON response from server');
      }

      // Check if the response indicates success
      if (result && result.success !== undefined) {
        return result.success;
      }

      // Legacy support - if no success field, assume true if no error
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      return false;
    }
  }

  async getSetting(key: string): Promise<any> {
    try {
      const settings = await this.getSettings();
      return this.getNestedProperty(settings, key);
    } catch (error) {
      console.error(`Error getting setting ${key}:`, error);
      return null;
    }
  }

  async resetToDefaults(): Promise<boolean> {
    return this.saveSettings(defaultSettings);
  }

  private getNestedProperty(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  }

  // Method untuk mendapatkan public settings dari database
  async getPublicSettings() {
    try {
      const response = await fetch('/api/settings', {
        method: 'GET',
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      // Pastikan data dalam format yang benar untuk frontend
      return {
        siteName: data.siteName || defaultSettings.siteName,
        siteDescription: data.siteDescription || defaultSettings.siteDescription,
        siteUrl: data.siteUrl || defaultSettings.siteUrl,
        contactEmail: data.contactEmail || defaultSettings.contactEmail,
        contactPhone: data.contactPhone || defaultSettings.contactPhone,
        contactAddress: data.contactAddress || defaultSettings.contactAddress,
        socialLinks: {
          facebook: data.socialLinks?.facebook || data.social_facebook || '',
          twitter: data.socialLinks?.twitter || data.social_twitter || '',
          instagram: data.socialLinks?.instagram || data.social_instagram || '',
          linkedin: data.socialLinks?.linkedin || data.social_linkedin || '',
          youtube: data.socialLinks?.youtube || data.social_youtube || ''
        },
        footerText: data.footerText || defaultSettings.footerText,
        enableComments: data.enableComments ?? defaultSettings.enableComments,
        enableSocialShare: data.enableSocialShare ?? defaultSettings.enableSocialShare,
        seoSettings: {
          metaTitle: data.seoSettings?.metaTitle || data.seo_metaTitle || defaultSettings.seoSettings.metaTitle,
          metaDescription: data.seoSettings?.metaDescription || data.seo_metaDescription || defaultSettings.seoSettings.metaDescription,
          metaKeywords: data.seoSettings?.metaKeywords || data.seo_metaKeywords || defaultSettings.seoSettings.metaKeywords,
          ogImage: data.seoSettings?.ogImage || data.seo_ogImage || defaultSettings.seoSettings.ogImage
        }
      };
    } catch (error) {
      console.error('Error fetching public settings:', error);
      // Fallback ke default settings
      return {
        siteName: defaultSettings.siteName,
        siteDescription: defaultSettings.siteDescription,
        siteUrl: defaultSettings.siteUrl,
        contactEmail: defaultSettings.contactEmail,
        contactPhone: defaultSettings.contactPhone,
        contactAddress: defaultSettings.contactAddress,
        socialLinks: defaultSettings.socialLinks,
        footerText: defaultSettings.footerText,
        enableComments: defaultSettings.enableComments,
        enableSocialShare: defaultSettings.enableSocialShare,
        seoSettings: defaultSettings.seoSettings
      };
    }
  }
}

export const settingsService = new SettingsService();
