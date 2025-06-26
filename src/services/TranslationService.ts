// Translation Service for Bajramedia

import { Translate } from '@google-cloud/translate/build/src/v2';

// Interface untuk translation result
interface TranslationResult {
  originalText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
}

// Interface untuk blog content yang akan ditranslate
interface BlogContent {
  title: string;
  excerpt: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  socialShareText?: string;
}

class TranslationService {
  private translate: Translate;

  constructor() {
    // Initialize Google Translate client
    // Note: In production, you'll need to set up proper authentication
    this.translate = new Translate({
      // For now, we'll use a simple approach
      // In production, set GOOGLE_APPLICATION_CREDENTIALS environment variable
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID || 'bajramedia-translate',
    });
  }

  /**
   * Detect language of text
   */
  async detectLanguage(text: string): Promise<string> {
    try {
      const [detection] = await this.translate.detect(text);
      return Array.isArray(detection) ? detection[0].language : detection.language;
    } catch (error) {
      console.error('Language detection error:', error);
      // Default fallback
      return 'id'; // Assume Indonesian if detection fails
    }
  }

  /**
   * Translate single text
   */
  async translateText(
    text: string, 
    targetLang: string, 
    sourceLang?: string
  ): Promise<TranslationResult> {
    try {
      if (!text || text.trim() === '') {
        return {
          originalText: text,
          translatedText: text,
          sourceLang: sourceLang || 'id',
          targetLang
        };
      }

      const [translation] = await this.translate.translate(text, {
        from: sourceLang,
        to: targetLang,
      });

      return {
        originalText: text,
        translatedText: translation,
        sourceLang: sourceLang || await this.detectLanguage(text),
        targetLang
      };
    } catch (error) {
      console.error('Translation error:', error);
      // Return original text if translation fails
      return {
        originalText: text,
        translatedText: text,
        sourceLang: sourceLang || 'id',
        targetLang
      };
    }
  }

  /**
   * Translate entire blog content
   */
  async translateBlogContent(
    content: BlogContent,
    targetLang: string,
    sourceLang?: string
  ): Promise<BlogContent> {
    try {
      // Auto-detect source language if not provided
      if (!sourceLang) {
        sourceLang = await this.detectLanguage(content.title || content.excerpt || content.content);
      }

      // If source and target are the same, return original
      if (sourceLang === targetLang) {
        return content;
      }

      // Translate each field in parallel for better performance
      const [
        titleResult,
        excerptResult,
        contentResult,
        metaTitleResult,
        metaDescriptionResult,
        socialShareResult
      ] = await Promise.all([
        this.translateText(content.title, targetLang, sourceLang),
        this.translateText(content.excerpt, targetLang, sourceLang),
        this.translateText(content.content, targetLang, sourceLang),
        content.metaTitle ? this.translateText(content.metaTitle, targetLang, sourceLang) : null,
        content.metaDescription ? this.translateText(content.metaDescription, targetLang, sourceLang) : null,
        content.socialShareText ? this.translateText(content.socialShareText, targetLang, sourceLang) : null,
      ]);

      return {
        title: titleResult.translatedText,
        excerpt: excerptResult.translatedText,
        content: contentResult.translatedText,
        metaTitle: metaTitleResult?.translatedText || content.metaTitle,
        metaDescription: metaDescriptionResult?.translatedText || content.metaDescription,
        socialShareText: socialShareResult?.translatedText || content.socialShareText,
      };
    } catch (error) {
      console.error('Blog content translation error:', error);
      // Return original content if translation fails
      return content;
    }
  }

  /**
   * Get supported languages
   */
  async getSupportedLanguages(): Promise<Array<{code: string, name: string}>> {
    try {
      const [languages] = await this.translate.getLanguages();
      return languages.map(lang => ({
        code: lang.code,
        name: lang.name
      }));
    } catch (error) {
      console.error('Error fetching supported languages:', error);
      // Return common languages as fallback
      return [
        { code: 'id', name: 'Indonesian' },
        { code: 'en', name: 'English' },
        { code: 'ms', name: 'Malay' },
        { code: 'zh', name: 'Chinese' },
        { code: 'ja', name: 'Japanese' },
        { code: 'ko', name: 'Korean' },
      ];
    }
  }

  /**
   * Batch translate multiple texts
   */
  async batchTranslate(
    texts: string[],
    targetLang: string,
    sourceLang?: string
  ): Promise<TranslationResult[]> {
    try {
      const results = await Promise.all(
        texts.map(text => this.translateText(text, targetLang, sourceLang))
      );
      return results;
    } catch (error) {
      console.error('Batch translation error:', error);
      // Return original texts if batch translation fails
      return texts.map(text => ({
        originalText: text,
        translatedText: text,
        sourceLang: sourceLang || 'id',
        targetLang
      }));
    }
  }
}

// Export singleton instance
export const translationService = new TranslationService();
export default TranslationService;
export type { TranslationResult, BlogContent };
