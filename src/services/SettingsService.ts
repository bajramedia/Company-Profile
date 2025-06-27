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
  siteUrl: 'https://bajramedia.com',
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

  // Helper method to flatten nested objects for API compatibility
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

  // Helper method to unflatten API response back to nested structure
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
      console.log('Raw settings from API:', flatSettings);
      
      // Convert flat structure back to nested
      const settings = this.unflattenSettings(flatSettings);
      console.log('Converted settings:', settings);
      
      return settings;
    } catch (error) {
      console.error('Error fetching settings:', error);
      return defaultSettings;
    }
  }

  async saveSettings(settings: SiteSettings): Promise<boolean> {
    try {
      console.log('Original settings to save:', settings);
      
      // Flatten settings structure for API compatibility
      const flatSettings = this.flattenSettings(settings);
      console.log('Flattened settings for API:', flatSettings);

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(flatSettings),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Settings save error:', errorText);
        throw new Error(`Failed to save settings: ${response.status}`);
      }

      const result = await response.json();
      console.log('Settings save success:', result);
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

  // Helper method untuk mendapatkan settings yang sering digunakan
  async getPublicSettings() {
    try {
      console.log('Fetching public settings from /api/settings');
      const response = await fetch('/api/settings', {
        method: 'GET',
        cache: 'no-cache', // Always get fresh data
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch public settings: ${response.status}`);
      }
      
      const settings = await response.json();
      console.log('Public settings received:', settings);
      return settings;
    } catch (error) {
      console.error('Error fetching public settings:', error);
      // Fallback ke subset dari default settings
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
