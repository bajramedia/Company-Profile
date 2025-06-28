// API Client utility with backup URL fallback
const PRIMARY_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://www.bajramedia.com/api_bridge.php';
const BACKUP_API_URL = process.env.NEXT_PUBLIC_API_BACKUP_URL || 'https://bajramedia.com/api_bridge.php';

interface ApiRequestOptions extends RequestInit {
  timeout?: number;
}

/**
 * Enhanced fetch with backup URL fallback
 * Tries primary URL first, falls back to backup URL if primary fails
 */
export async function fetchWithFallback(
  endpoint: string, 
  options: ApiRequestOptions = {}
): Promise<Response> {
  const { timeout = 10000, ...fetchOptions } = options;
  
  // Helper function to create fetch with timeout
  const fetchWithTimeout = async (url: string, options: RequestInit) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  };

  // Try primary URL first
  try {
    console.log(`🔄 Trying primary API: ${PRIMARY_API_URL}`);
    const response = await fetchWithTimeout(endpoint.startsWith('http') ? endpoint : `${PRIMARY_API_URL}${endpoint.startsWith('?') ? endpoint : `?${endpoint}`}`, fetchOptions);
    
    if (response.ok) {
      console.log(`✅ Primary API success: ${response.status}`);
      return response;
    } else {
      console.warn(`⚠️ Primary API returned ${response.status}, trying backup...`);
      throw new Error(`Primary API failed with status ${response.status}`);
    }
  } catch (primaryError) {
    console.warn(`❌ Primary API failed:`, primaryError);
    
    // Try backup URL
    try {
      console.log(`🔄 Trying backup API: ${BACKUP_API_URL}`);
      const backupEndpoint = endpoint.replace(PRIMARY_API_URL, '').replace(/^\?/, '');
      const backupUrl = endpoint.startsWith('http') 
        ? endpoint.replace(PRIMARY_API_URL, BACKUP_API_URL)
        : `${BACKUP_API_URL}${backupEndpoint.startsWith('?') ? backupEndpoint : `?${backupEndpoint}`}`;
        
      const response = await fetchWithTimeout(backupUrl, fetchOptions);
      
      if (response.ok) {
        console.log(`✅ Backup API success: ${response.status}`);
        return response;
      } else {
        console.error(`❌ Backup API also failed: ${response.status}`);
        throw new Error(`Both primary and backup APIs failed. Backup status: ${response.status}`);
      }
    } catch (backupError) {
      console.error(`❌ Backup API failed:`, backupError);
      throw new Error(`Both APIs failed. Primary: ${primaryError}. Backup: ${backupError}`);
    }
  }
}

/**
 * GET request with fallback
 */
export async function apiGet(endpoint: string, options: ApiRequestOptions = {}) {
  return fetchWithFallback(endpoint, { ...options, method: 'GET' });
}

/**
 * POST request with fallback
 */
export async function apiPost(endpoint: string, data?: any, options: ApiRequestOptions = {}) {
  return fetchWithFallback(endpoint, {
    ...options,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    body: data ? JSON.stringify(data) : undefined
  });
}

/**
 * PUT request with fallback
 */
export async function apiPut(endpoint: string, data?: any, options: ApiRequestOptions = {}) {
  return fetchWithFallback(endpoint, {
    ...options,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    body: data ? JSON.stringify(data) : undefined
  });
}

/**
 * DELETE request with fallback
 */
export async function apiDelete(endpoint: string, options: ApiRequestOptions = {}) {
  return fetchWithFallback(endpoint, { ...options, method: 'DELETE' });
}

// Legacy compatibility - for quick migration
export const API_BASE_URL = PRIMARY_API_URL;
export const API_BACKUP_URL = BACKUP_API_URL; 