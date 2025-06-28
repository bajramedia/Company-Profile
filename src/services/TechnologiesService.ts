export interface Technology {
    id: number;
    name: string;
    icon: string;
    description_en: string;
    description_id: string;
    category: string; // Changed from enum to string to support dynamic categories
    color: string;
    sort_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Category {
    value: string;
    label: string;
    color: string;
    description?: string;
}

class TechnologiesService {
    private cache: Map<string, { data: Technology[]; timestamp: number }> = new Map();
    private categoriesCache: { data: Category[]; timestamp: number } | null = null;
    private cacheDuration = 5 * 60 * 1000; // 5 minutes

    async getCategories(useCache = true): Promise<Category[]> {
        // Check cache first
        if (useCache && this.categoriesCache) {
            if (Date.now() - this.categoriesCache.timestamp < this.cacheDuration) {
                return this.categoriesCache.data;
            }
        }

        try {
            const response = await fetch('/api/admin/technology-categories', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                cache: 'no-store',
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch categories: ${response.status}`);
            }

            const categories: Category[] = await response.json();
            
            // Cache the result
            this.categoriesCache = {
                data: categories,
                timestamp: Date.now()
            };

            return categories;
        } catch (error) {
            console.error('Error fetching categories:', error);
            // Return cached data if available, even if expired
            if (this.categoriesCache) {
                return this.categoriesCache.data;
            }
            
            // Ultimate fallback
            return [
                { value: 'general', label: 'General', color: '#6B7280' }
            ];
        }
    }

    async getTechnologies(category?: string, useCache = true): Promise<Technology[]> {
        const cacheKey = category || 'all';
        
        // Check cache first
        if (useCache && this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey)!;
            if (Date.now() - cached.timestamp < this.cacheDuration) {
                return cached.data;
            }
        }

        try {
            let url = '/api/admin/technologies';
            if (category) {
                url += `?category=${category}`;
            }

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                cache: 'no-store',
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch technologies: ${response.status}`);
            }

            const technologies: Technology[] = await response.json();
            
            // Cache the result
            this.cache.set(cacheKey, {
                data: technologies,
                timestamp: Date.now()
            });

            return technologies;
        } catch (error) {
            console.error('Error fetching technologies:', error);
            // Return cached data if available, even if expired
            if (this.cache.has(cacheKey)) {
                return this.cache.get(cacheKey)!.data;
            }
            return [];
        }
    }

    async getTechnologiesByCategory(category: string): Promise<Technology[]> {
        const technologies = await this.getTechnologies(category);
        return technologies.filter(tech => tech.category === category && tech.is_active);
    }

    // Dynamic category methods
    async getTechnologiesByCategoryValue(categoryValue: string): Promise<Technology[]> {
        return this.getTechnologiesByCategory(categoryValue);
    }

    // Get technologies for specific service pages - now dynamic
    async getWebTechnologies(): Promise<Technology[]> {
        // Check if we have 'web' category, otherwise use the first available category
        const categories = await this.getCategories();
        const webCategory = categories.find(cat => 
            cat.value.includes('web') || 
            cat.label.toLowerCase().includes('web')
        );
        
        if (webCategory) {
            return this.getTechnologiesByCategory(webCategory.value);
        }
        
        // Fallback to first available category
        return categories.length > 0 ? this.getTechnologiesByCategory(categories[0].value) : [];
    }

    async getMobileTechnologies(): Promise<Technology[]> {
        const categories = await this.getCategories();
        const mobileCategory = categories.find(cat => 
            cat.value.includes('mobile') || 
            cat.label.toLowerCase().includes('mobile')
        );
        
        return mobileCategory ? this.getTechnologiesByCategory(mobileCategory.value) : [];
    }

    async getUIUXTechnologies(): Promise<Technology[]> {
        const categories = await this.getCategories();
        const uiuxCategory = categories.find(cat => 
            cat.value.includes('uiux') || 
            cat.value.includes('design') || 
            cat.label.toLowerCase().includes('design')
        );
        
        return uiuxCategory ? this.getTechnologiesByCategory(uiuxCategory.value) : [];
    }

    async getGameTechnologies(): Promise<Technology[]> {
        const categories = await this.getCategories();
        const gameCategory = categories.find(cat => 
            cat.value.includes('game') || 
            cat.label.toLowerCase().includes('game')
        );
        
        return gameCategory ? this.getTechnologiesByCategory(gameCategory.value) : [];
    }

    async getSystemTechnologies(): Promise<Technology[]> {
        const categories = await this.getCategories();
        const systemCategory = categories.find(cat => 
            cat.value.includes('system') || 
            cat.label.toLowerCase().includes('system')
        );
        
        return systemCategory ? this.getTechnologiesByCategory(systemCategory.value) : [];
    }

    async getMarketingTechnologies(): Promise<Technology[]> {
        const categories = await this.getCategories();
        const marketingCategory = categories.find(cat => 
            cat.value.includes('marketing') || 
            cat.label.toLowerCase().includes('marketing')
        );
        
        return marketingCategory ? this.getTechnologiesByCategory(marketingCategory.value) : [];
    }

    // Helper to get category info by value
    async getCategoryInfo(categoryValue: string): Promise<Category | null> {
        const categories = await this.getCategories();
        return categories.find(cat => cat.value === categoryValue) || null;
    }

    // Clear cache
    clearCache(): void {
        this.cache.clear();
        this.categoriesCache = null;
    }

    // Clear specific category cache
    clearCategoryCache(category?: string): void {
        const cacheKey = category || 'all';
        this.cache.delete(cacheKey);
    }

    // Format description based on language
    getDescription(tech: Technology, language: 'en' | 'id' = 'id'): string {
        if (language === 'en') {
            return tech.description_en || tech.description_id || tech.name;
        }
        return tech.description_id || tech.description_en || tech.name;
    }

    // Convert to legacy format for backward compatibility
    toLegacyFormat(technologies: Technology[], language: 'en' | 'id' = 'id') {
        return technologies.map(tech => ({
            name: tech.name,
            icon: tech.icon,
            description: this.getDescription(tech, language),
            color: tech.color,
        }));
    }
}

// Export singleton instance
export const technologiesService = new TechnologiesService();
export default technologiesService; 