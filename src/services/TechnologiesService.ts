export interface Technology {
    id: number;
    name: string;
    icon: string;
    description_en: string;
    description_id: string;
    category: 'web' | 'mobile' | 'uiux' | 'game' | 'system' | 'marketing' | 'general';
    color: string;
    sort_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

class TechnologiesService {
    private cache: Map<string, { data: Technology[]; timestamp: number }> = new Map();
    private cacheDuration = 5 * 60 * 1000; // 5 minutes

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

    async getTechnologiesByCategory(category: Technology['category']): Promise<Technology[]> {
        const technologies = await this.getTechnologies(category);
        return technologies.filter(tech => tech.category === category && tech.is_active);
    }

    // Get technologies for specific service pages
    async getWebTechnologies(): Promise<Technology[]> {
        return this.getTechnologiesByCategory('web');
    }

    async getMobileTechnologies(): Promise<Technology[]> {
        return this.getTechnologiesByCategory('mobile');
    }

    async getUIUXTechnologies(): Promise<Technology[]> {
        return this.getTechnologiesByCategory('uiux');
    }

    async getGameTechnologies(): Promise<Technology[]> {
        return this.getTechnologiesByCategory('game');
    }

    async getSystemTechnologies(): Promise<Technology[]> {
        return this.getTechnologiesByCategory('system');
    }

    async getMarketingTechnologies(): Promise<Technology[]> {
        return this.getTechnologiesByCategory('marketing');
    }

    // Clear cache
    clearCache(): void {
        this.cache.clear();
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