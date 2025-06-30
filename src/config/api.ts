/**
 * Centralized API Configuration
 * Update URL API di sini untuk semua file sekaligus
 */

// Main API Base URL
// Main API Base URL - prioritize environment variable for production
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://balimoonartandspeace.com/api_bridge.php';

// API Endpoints Helper Functions
export const apiEndpoints = {
  // Blog & Posts
  posts: (params?: Record<string, string | number>) => {
    const url = new URL(`${API_BASE_URL}?endpoint=posts`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }
    return url.toString();
  },

  postBySlug: (slug: string) => `${API_BASE_URL}?endpoint=posts&slug=${slug}&published=true`,
  
  postById: (id: string) => `${API_BASE_URL}?endpoint=posts&id=${id}`,

  // Categories
  categories: () => `${API_BASE_URL}?endpoint=categories`,
  
  categoryById: (id: string) => `${API_BASE_URL}?endpoint=categories&id=${id}`,
  
  categoryBySlug: (slug: string) => `${API_BASE_URL}?endpoint=categories&slug=${slug}`,

  // Authors
  authors: () => `${API_BASE_URL}?endpoint=authors`,
  
  authorById: (id: string) => `${API_BASE_URL}?endpoint=authors&id=${id}`,

  // Tags
  tags: () => `${API_BASE_URL}?endpoint=tags`,
  
  tagById: (id: string) => `${API_BASE_URL}?endpoint=tags&id=${id}`,

  // Portfolio
  portfolio: (params?: Record<string, string | number>) => {
    const url = new URL(`${API_BASE_URL}?endpoint=portfolio`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }
    return url.toString();
  },

  portfolioById: (id: string) => `${API_BASE_URL}?endpoint=portfolio&id=${id}`,

  // Team Members
  teamMembers: () => `${API_BASE_URL}?endpoint=team-members`,
  
  teamMemberById: (id: string) => `${API_BASE_URL}?endpoint=team-members&id=${id}`,

  // Partners
  partners: () => `${API_BASE_URL}?endpoint=partners`,
  
  partnerById: (id: string) => `${API_BASE_URL}?endpoint=partners&id=${id}`,

  // Settings
  settings: () => `${API_BASE_URL}?endpoint=settings`,

  // Stats
  stats: () => `${API_BASE_URL}?endpoint=stats`,

  // About Content
  aboutContent: () => `${API_BASE_URL}?endpoint=about-content`,
  
  aboutContentById: (id: string) => `${API_BASE_URL}?endpoint=about-content&id=${id}`,

  // Technologies
  technologies: () => `${API_BASE_URL}?endpoint=technologies`,
  
  technologyById: (id: string) => `${API_BASE_URL}?endpoint=technologies&id=${id}`,

  // Generic endpoint helper
  custom: (endpoint: string, params?: Record<string, string | number>) => {
    const url = new URL(`${API_BASE_URL}?endpoint=${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }
    return url.toString();
  }
};

// HTTP Methods Helper
export const apiMethods = {
  GET: 'GET',
  POST: 'POST', 
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH'
} as const;

// Default fetch options
export const defaultFetchOptions: RequestInit = {
  headers: {
    'Content-Type': 'application/json',
  },
  cache: 'no-cache' as RequestCache,
};

// Helper function untuk POST requests
export const createPostOptions = (body: any): RequestInit => ({
  ...defaultFetchOptions,
  method: 'POST',
  body: JSON.stringify(body),
});

// Helper function untuk PUT requests  
export const createPutOptions = (body: any): RequestInit => ({
  ...defaultFetchOptions,
  method: 'PUT',
  body: JSON.stringify(body),
});

// Helper function untuk DELETE requests
export const createDeleteOptions = (): RequestInit => ({
  ...defaultFetchOptions,
  method: 'DELETE',
});

export default API_BASE_URL; 