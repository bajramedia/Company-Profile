import { NextRequest, NextResponse } from 'next/server';
import { translationService } from '@/services/TranslationService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, targetLang, sourceLang } = body;

    console.log('🌍 Translation request:', { sourceLang, targetLang, contentLength: content?.title?.length || 0 });

    // Validate input
    if (!content || !targetLang) {
      return NextResponse.json(
        { error: 'Content and target language are required' },
        { status: 400 }
      );
    }

    // Translate the blog content
    const translatedContent = await translationService.translateBlogContent(
      content,
      targetLang,
      sourceLang
    );

    console.log('✅ Translation completed successfully');

    return NextResponse.json({
      success: true,
      translatedContent,
      originalContent: content,
      sourceLang: sourceLang || 'auto-detected',
      targetLang
    });

  } catch (error) {
    console.error('❌ Translation error:', error);
    return NextResponse.json(
      { 
        error: 'Translation failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get supported languages
    const languages = await translationService.getSupportedLanguages();
    
    return NextResponse.json({
      success: true,
      languages
    });

  } catch (error) {
    console.error('❌ Error fetching languages:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch supported languages',
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
} 
