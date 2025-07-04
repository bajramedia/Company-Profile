import { useEffect, useState } from 'react';

interface ViewTrackerOptions {
  type: 'portfolio' | 'blog';
  slug: string;
  title?: string;
  initialViews?: number;
}

export const useViewTracker = ({ type, slug, title, initialViews = 0 }: ViewTrackerOptions) => {
  const [viewCount, setViewCount] = useState<number>(initialViews);
  const [hasTracked, setHasTracked] = useState(false);

  // Update viewCount when initialViews changes (from database)
  useEffect(() => {
    if (initialViews > 0 && initialViews !== viewCount && !hasTracked) {
      console.log(`🔄 [DEBUG] Updating initial views for ${type}:${slug} from ${viewCount} to ${initialViews}`);
      setViewCount(initialViews);
    }
  }, [initialViews, type, slug, viewCount, hasTracked]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let timeoutId: NodeJS.Timeout;
    let hasViewed = false;

    // Immediate localStorage check
    const storageKey = `${type}_views_${slug}`;
    const viewsKey = `${type}_viewed_${slug}`;
    
    console.log(`🚀 [DEBUG] View tracking init for ${type}:${slug}`);
    console.log(`📦 [DEBUG] Storage keys: ${storageKey}, ${viewsKey}`);
    console.log(`🎯 [DEBUG] Initial values: initialViews=${initialViews}, current viewCount=${viewCount}`);

    // Check existing values immediately
    const existingViews = localStorage.getItem(storageKey);
    const alreadyViewed = sessionStorage.getItem(viewsKey);

    console.log(`💾 [DEBUG] Existing localStorage: ${existingViews}`);
    console.log(`🎭 [DEBUG] Session viewed: ${alreadyViewed}`);

    if (existingViews) {
      const storedCount = parseInt(existingViews);
      console.log(`📊 [DEBUG] Found stored views: ${storedCount}, setting immediately`);
      setViewCount(storedCount);
    }

    const trackView = async () => {
      if (hasTracked || hasViewed || typeof window === 'undefined') {
        console.log(`⏹️ [DEBUG] Skipping track view: hasTracked=${hasTracked}, hasViewed=${hasViewed}`);
        return;
      }
      
      console.log(`🎯 [DEBUG] Starting view tracking for ${type}:${slug} (initialViews: ${initialViews})`);
      
      try {
        // Check if already viewed this session
        const alreadyViewed = sessionStorage.getItem(viewsKey);
        if (alreadyViewed) {
          console.log(`✅ [DEBUG] Already viewed this session for ${type}:${slug}`);
          // Get stored view count
          const storedViews = localStorage.getItem(storageKey);
          if (storedViews) {
            const parsedViews = parseInt(storedViews);
            console.log(`📊 [DEBUG] Using stored view count: ${parsedViews}`);
            setViewCount(parsedViews);
          }
          setHasTracked(true);
          return;
        }

        // Get current view count from localStorage or start with initial
        let currentViews = Math.max(initialViews, 0);
        const storedViews = localStorage.getItem(storageKey);
        if (storedViews) {
          const storedCount = parseInt(storedViews);
          currentViews = Math.max(storedCount, initialViews);
          console.log(`📊 [DEBUG] Found stored views: ${storedViews}, using: ${currentViews}`);
        } else {
          console.log(`📊 [DEBUG] No stored views, starting with initial: ${initialViews}`);
        }

        // Always increment by 1 for new view
        const newViewCount = currentViews + 1;
        console.log(`📈 [DEBUG] Incrementing views from ${currentViews} to ${newViewCount}`);
        
        // Store in localStorage (persistent)
        localStorage.setItem(storageKey, newViewCount.toString());
        console.log(`💾 [DEBUG] Stored to localStorage: ${newViewCount}`);
        
        // Mark as viewed this session (prevents double counting)
        sessionStorage.setItem(viewsKey, 'true');
        console.log(`🎭 [DEBUG] Marked as viewed in session`);
        
        // Update state
        setViewCount(newViewCount);
        setHasTracked(true);
        hasViewed = true;

        console.log(`✅ [DEBUG] View tracked successfully for ${type}:${slug} - New count: ${newViewCount}`);

        // Optional server tracking (fails silently)
        try {
          const endpoint = type === 'portfolio' 
            ? `/api/portfolio/${slug}/views` 
            : `/api/posts/${slug}/views`;
          
          console.log(`🌐 [DEBUG] Attempting server track to: ${endpoint}`);
          
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userAgent: navigator.userAgent,
              timestamp: new Date().toISOString(),
              title: title,
              clientViewCount: newViewCount
            })
          });

          console.log(`🌐 [DEBUG] Server response: ${response.status}`);

          if (response.ok) {
            const result = await response.json();
            console.log(`🌐 [DEBUG] Server result:`, result);
            // Use server count if available and higher than client count
            if (result.viewCount && result.viewCount > newViewCount) {
              console.log(`🔄 [DEBUG] Server has higher count: ${result.viewCount}, updating`);
              setViewCount(result.viewCount);
              localStorage.setItem(storageKey, result.viewCount.toString());
            }
          }
        } catch (serverError) {
          // Server tracking failed, but client tracking still works
          console.log(`⚠️ [DEBUG] Server tracking unavailable for ${type}: ${slug}`, serverError);
        }
        
      } catch (error) {
        console.error(`❌ [DEBUG] Error in view tracking for ${type}:${slug}:`, error);
        // Even if error, try to show some view count
        const fallbackViews = Math.max(initialViews, 1);
        console.log(`🆘 [DEBUG] Using fallback views: ${fallbackViews}`);
        setViewCount(fallbackViews);
        setHasTracked(true);
      }
    };

    // Track view after user stays on page for 2 seconds (reduced from 3)
    console.log(`⏰ [DEBUG] Setting timeout for 2 seconds`);
    timeoutId = setTimeout(() => {
      console.log(`⏰ [DEBUG] Timeout triggered, calling trackView`);
      trackView();
    }, 2000);

    // Cleanup
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        console.log(`🧹 [DEBUG] Cleaned up timeout for ${type}:${slug}`);
      }
    };
  }, [type, slug, title, initialViews, hasTracked]);

  // Debug current state
  useEffect(() => {
    console.log(`🔍 [DEBUG] Current state - viewCount: ${viewCount}, hasTracked: ${hasTracked}`);
  }, [viewCount, hasTracked]);

  return {
    viewCount,
    hasTracked
  };
};

// Hook for real-time view updates (optional)
export const useViewCounter = (initialViews: number = 0) => {
  const [views, setViews] = useState(initialViews);

  const updateViews = (newViews: number) => {
    setViews(newViews);
  };

  return { views, updateViews };
};
