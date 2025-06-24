'use client';

import { useState } from 'react';
import { usePublicSettings } from '@/hooks/useSettings';
import { FiFacebook, FiTwitter, FiLinkedin, FiShare2, FiCopy, FiMail } from 'react-icons/fi';
import { SocialShareService } from '@/services/SocialShareService';

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
  image?: string;
  hashtags?: string[];
  className?: string;
}

export default function SocialShare({
  url,
  title,
  description = '',
  image = '',
  hashtags = [],
  className = ''
}: SocialShareProps) {
  const { settings } = usePublicSettings();
  const [copied, setCopied] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Check if social sharing is enabled
  if (!settings?.enableSocialShare) {
    return null;
  }

  const shareUrl = `${settings?.siteUrl || 'https://bajramedia.com'}${url}`;
  const shareTitle = title;
  const shareDescription = description;
  const shareImage = image || settings?.seoSettings?.ogImage || '/images/logo.png';
  const fullImageUrl = shareImage.startsWith('http') ? shareImage : `${settings?.siteUrl || 'https://bajramedia.com'}${shareImage}`;

  const handleFacebookShare = () => {
    const facebookUrl = SocialShareService.generateFacebookShareUrl(shareUrl, shareTitle);
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };

  const handleTwitterShare = () => {
    const twitterUrl = SocialShareService.generateTwitterShareUrl(shareUrl, shareTitle, hashtags);
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  const handleLinkedInShare = () => {
    const linkedinUrl = SocialShareService.generateLinkedInShareUrl(shareUrl, shareTitle, shareDescription);
    window.open(linkedinUrl, '_blank', 'width=600,height=400');
  };

  const handleEmailShare = () => {
    const emailUrl = SocialShareService.generateEmailShareUrl(shareUrl, shareTitle, shareDescription);
    window.location.href = emailUrl;
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareDescription,
          url: shareUrl,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      setShowDropdown(!showDropdown);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Mobile Native Share Button */}
      <div className="md:hidden">
        <button
          onClick={handleNativeShare}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FiShare2 size={18} />
          Share
        </button>
      </div>

      {/* Desktop Share Buttons */}
      <div className="hidden md:flex items-center gap-3">
        <span className="text-sm text-gray-600 font-medium">Share:</span>
        
        <button
          onClick={handleFacebookShare}
          className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
          title="Share on Facebook"
        >
          <FiFacebook size={18} />
        </button>

        <button
          onClick={handleTwitterShare}
          className="flex items-center justify-center w-10 h-10 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors"
          title="Share on Twitter"
        >
          <FiTwitter size={18} />
        </button>

        <button
          onClick={handleLinkedInShare}
          className="flex items-center justify-center w-10 h-10 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-colors"
          title="Share on LinkedIn"
        >
          <FiLinkedin size={18} />
        </button>

        <button
          onClick={handleEmailShare}
          className="flex items-center justify-center w-10 h-10 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors"
          title="Share via Email"
        >
          <FiMail size={18} />
        </button>

        <button
          onClick={handleCopyLink}
          className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
            copied 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          title={copied ? 'Link Copied!' : 'Copy Link'}
        >
          <FiCopy size={18} />
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {showDropdown && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 md:hidden">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleFacebookShare}
              className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50"
            >
              <FiFacebook size={24} className="text-blue-600" />
              <span className="text-sm">Facebook</span>
            </button>

            <button
              onClick={handleTwitterShare}
              className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50"
            >
              <FiTwitter size={24} className="text-sky-500" />
              <span className="text-sm">Twitter</span>
            </button>

            <button
              onClick={handleLinkedInShare}
              className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50"
            >
              <FiLinkedin size={24} className="text-blue-700" />
              <span className="text-sm">LinkedIn</span>
            </button>

            <button
              onClick={handleEmailShare}
              className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50"
            >
              <FiMail size={24} className="text-gray-600" />
              <span className="text-sm">Email</span>
            </button>
          </div>

          <div className="mt-3 pt-3 border-t">
            <button
              onClick={handleCopyLink}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                copied 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FiCopy size={18} />
              {copied ? 'Link Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>
      )}

      {/* Overlay to close dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
}
