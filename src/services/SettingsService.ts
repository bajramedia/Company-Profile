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
    github: string;
    discord: string;
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
  adminEmail: 'admin.bajra@bajramedia.com',
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
    youtube: '',
    github: '',
    discord: '',
  },
  seoSettings: {
    metaTitle: 'Bajramedia - Creative Digital Agency',
    metaDescription: 'Professional digital agency providing creative solutions for your business needs.',
    metaKeywords: 'digital agency, creative, design, development, bali',
    ogImage: ''
  }
};

// Fallback settings if API fails
const fallbackSettings = {
  siteName: 'Bajramedia',
  tagline: 'Digital Solutions for Modern Business',
  siteUrl: 'https://bajramedia.com',
  adminEmail: 'admin.bajra@bajramedia.com',
  postsPerPage: 6,
  maintenanceMode: false,
  allowComments: true,
  socialLinks: {
    facebook: '',
    twitter: '',
    instagram: '',
    linkedin: '',
    youtube: '',
    github: '',
    discord: '',
  },
  seoSettings: {
    metaTitle: 'Bajramedia - Digital Solutions Agency',
    metaDescription: 'Professional digital solutions for your business growth',
    keywords: 'web development, mobile apps, UI/UX design, digital marketing'
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
  async getPublicSettings(): Promise<any> {
    try {
      const response = await fetch('/api/settings');
      if (!response.ok) {
        throw new Error('Failed to fetch public settings');
      }
      const data = await response.json();

      // Transform flat structure to nested structure for frontend consistency
      const settings: { [key: string]: any } = {};
      const socialLinks: { [key: string]: any } = {};

      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          if (key.startsWith('social_')) {
            const platform = key.replace('social_', '');
            socialLinks[platform] = data[key];
          } else {
            settings[key] = data[key];
          }
        }
      }

      return { ...settings, socialLinks };
    } catch (error) {
      console.error('Error in getPublicSettings:', error);
      return { socialLinks: {} }; // Return with empty socialLinks to prevent frontend errors
    }
  }
}

export const settingsService = new SettingsService();
