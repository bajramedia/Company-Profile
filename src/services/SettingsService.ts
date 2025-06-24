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
  contactPhone: '+62 123 456 7890',
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

  async getSettings(): Promise<SiteSettings> {
    try {
      const response = await fetch(this.baseUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }
      
      const settings = await response.json();
      
      // Merge dengan default settings untuk memastikan semua field ada
      return { ...defaultSettings, ...settings };
    } catch (error) {
      console.error('Error fetching settings:', error);
      return defaultSettings;
    }
  }

  async saveSettings(settings: SiteSettings): Promise<boolean> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }

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
      const response = await fetch('/api/settings');
      if (!response.ok) {
        throw new Error('Failed to fetch public settings');
      }
      
      const settings = await response.json();
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
