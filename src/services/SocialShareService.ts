export interface ShareOptions {
  url: string;
  title: string;
  description?: string;
  hashtags?: string[];
}

export class SocialShareService {
  
  // URL Generation Methods (used by SocialShare component)
  static generateFacebookShareUrl(url: string, title?: string): string {
    const shareUrl = encodeURIComponent(url);
    return `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
  }

  static generateTwitterShareUrl(url: string, title: string, hashtags: string[] = []): string {
    const text = encodeURIComponent(title);
    const shareUrl = encodeURIComponent(url);
    const tags = hashtags.length > 0 ? `&hashtags=${hashtags.join(',')}` : '';
    return `https://twitter.com/intent/tweet?text=${text}&url=${shareUrl}${tags}`;
  }

  static generateLinkedInShareUrl(url: string, title: string, description?: string): string {
    const shareUrl = encodeURIComponent(url);
    const shareTitle = encodeURIComponent(title);
    const summary = description ? encodeURIComponent(description) : '';
    return `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}&title=${shareTitle}&summary=${summary}`;
  }

  static generateEmailShareUrl(url: string, title: string, description?: string): string {
    const subject = encodeURIComponent(`Check out: ${title}`);
    const body = encodeURIComponent(`${description ? description + '\n\n' : ''}Read more: ${url}`);
    return `mailto:?subject=${subject}&body=${body}`;
  }

  // Share to Twitter/X
  static shareToTwitter(options: ShareOptions): void {
    const { url, title, hashtags = [] } = options;
    const text = encodeURIComponent(title);
    const shareUrl = encodeURIComponent(url);
    const tags = hashtags.length > 0 ? `&hashtags=${hashtags.join(',')}` : '';
    
    const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${shareUrl}${tags}`;
    this.openShareWindow(twitterUrl, 'Twitter');
  }

  // Share to LinkedIn
  static shareToLinkedIn(options: ShareOptions): void {
    const { url, title, description = '' } = options;
    const shareUrl = encodeURIComponent(url);
    const summary = encodeURIComponent(description);
    const shareTitle = encodeURIComponent(title);
    
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}&title=${shareTitle}&summary=${summary}`;
    this.openShareWindow(linkedInUrl, 'LinkedIn');
  }

  // Share to Facebook
  static shareToFacebook(options: ShareOptions): void {
    const { url } = options;
    const shareUrl = encodeURIComponent(url);
    
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
    this.openShareWindow(facebookUrl, 'Facebook');
  }

  // Copy link to clipboard
  static async copyToClipboard(url: string): Promise<boolean> {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
        return true;
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const result = document.execCommand('copy');
        textArea.remove();
        return result;
      }
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  }

  // Generic share function using Web Share API if available
  static async nativeShare(options: ShareOptions): Promise<boolean> {
    if (navigator.share) {
      try {
        await navigator.share({
          title: options.title,
          text: options.description,
          url: options.url,
        });
        return true;
      } catch (error) {
        console.error('Native share failed:', error);
        return false;
      }
    }
    return false;
  }

  // Open share window
  private static openShareWindow(url: string, name: string): void {
    const width = 600;
    const height = 400;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    
    const features = `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`;
    
    window.open(url, `share-${name}`, features);
  }

  // Get share analytics data
  static trackShare(platform: string, postSlug: string): void {
    // Send analytics event (you can integrate with your analytics service)
    try {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'share', {
          method: platform,
          content_type: 'blog_post',
          content_id: postSlug,
        });
      }
      
      // You can also send to your own analytics endpoint
      fetch('/api/analytics/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platform,
          postSlug,
          timestamp: new Date().toISOString(),
        }),
      }).catch(error => console.error('Analytics tracking failed:', error));
    } catch (error) {
      console.error('Share tracking failed:', error);
    }
  }
}
