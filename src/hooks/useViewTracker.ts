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

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let hasViewed = false;

    const trackView = async () => {
      if (hasTracked || hasViewed || typeof window === 'undefined') return;
      
      try {
        // Client-side view tracking using localStorage
        const storageKey = `${type}_views_${slug}`;
        const viewsKey = `${type}_viewed_${slug}`;
        
        // Check if already viewed this session
        const alreadyViewed = sessionStorage.getItem(viewsKey);
        if (alreadyViewed) {
          // Get stored view count
          const storedViews = localStorage.getItem(storageKey);
          if (storedViews) {
            setViewCount(parseInt(storedViews));
          }
          setHasTracked(true);
          return;
        }

        // Get current view count from localStorage or start with initial
        let currentViews = initialViews;
        const storedViews = localStorage.getItem(storageKey);
        if (storedViews) {
          currentViews = parseInt(storedViews);
        }

        // Increment view count
        const newViewCount = currentViews + 1;
        
        // Store in localStorage (persistent)
        localStorage.setItem(storageKey, newViewCount.toString());
        
        // Mark as viewed this session (prevents double counting)
        sessionStorage.setItem(viewsKey, 'true');
        
        // Update state
        setViewCount(newViewCount);
        setHasTracked(true);
        hasViewed = true;

        // Also try to track on server (optional, fails silently)
        try {
          const endpoint = type === 'portfolio' 
            ? `/api/portfolio/${slug}/views` 
            : `/api/posts/${slug}/views`;
          
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

          if (response.ok) {
            const result = await response.json();
            // Use server count if available and higher than client count
            if (result.viewCount && result.viewCount > newViewCount) {
              setViewCount(result.viewCount);
              localStorage.setItem(storageKey, result.viewCount.toString());
            }
          }
        } catch (serverError) {
          // Server tracking failed, but client tracking still works
          console.log(`Server tracking unavailable for ${type}: ${slug}`);
        }
        
      } catch (error) {
        // Even if error, try to show some view count
        const fallbackViews = initialViews || 1;
        setViewCount(fallbackViews);
        setHasTracked(true);
      }
    };

    // Track view after user stays on page for 3 seconds
    timeoutId = setTimeout(() => {
      trackView();
    }, 3000);

    // Cleanup
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [type, slug, title, hasTracked, initialViews]);

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
