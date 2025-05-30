import { useEffect, useState } from 'react';

interface UseViewTrackerOptions {
  slug: string;
  delay?: number; // Delay before tracking view (default 3 seconds)
}

interface ViewTrackerReturn {
  views: number;
  isTracking: boolean;
}

export const useViewTracker = ({ 
  slug, 
  delay = 3000 
}: UseViewTrackerOptions): ViewTrackerReturn => {
  const [views, setViews] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [hasTracked, setHasTracked] = useState(false);

  useEffect(() => {
    if (!slug || hasTracked) return;

    const trackView = async () => {
      try {
        setIsTracking(true);
        
        const response = await fetch(`/api/posts/${slug}/views`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setViews(data.views);
          setHasTracked(true);
        }
      } catch (error) {
        console.error('Failed to track view:', error);
      } finally {
        setIsTracking(false);
      }
    };

    // Track view after specified delay
    const timer = setTimeout(trackView, delay);

    return () => clearTimeout(timer);
  }, [slug, delay, hasTracked]);

  return { views, isTracking };
};

// Hook for real-time view updates (optional)
export const useViewCounter = (initialViews: number = 0) => {
  const [views, setViews] = useState(initialViews);

  const updateViews = (newViews: number) => {
    setViews(newViews);
  };

  return { views, updateViews };
};
