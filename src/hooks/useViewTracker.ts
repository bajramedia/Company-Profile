import { useEffect, useState } from 'react';

interface ViewTrackerOptions {
  type: 'portfolio' | 'blog';
  slug: string;
  title?: string;
}

export const useViewTracker = ({ type, slug, title }: ViewTrackerOptions) => {
  const [viewCount, setViewCount] = useState<number>(0);
  const [hasTracked, setHasTracked] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let hasViewed = false;

    const trackView = async () => {
      if (hasTracked || hasViewed) return;
      
      try {
        console.log(`📊 Tracking view untuk ${type}:`, slug);
        
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
            title: title
          })
        });

        if (response.ok) {
          const result = await response.json();
          console.log(`✅ View berhasil di-track untuk ${type}:`, slug);
          
          // Update view count if returned from API
          if (result.viewCount) {
            setViewCount(result.viewCount);
          }
          
          setHasTracked(true);
          hasViewed = true;
        } else {
          console.error(`❌ Gagal track view untuk ${type}:`, response.status);
        }
      } catch (error) {
        console.error(`💥 Error tracking view untuk ${type}:`, error);
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
  }, [type, slug, title, hasTracked]);

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
