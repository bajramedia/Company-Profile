import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://bajramedia.com/api_bridge.php';

// GET /api/admin/settings - Get all settings
export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}?endpoint=settings`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-cache',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const settings = await response.json();
    
    // Format settings into key-value pairs
    const formattedSettings: Record<string, any> = {};
    
    if (Array.isArray(settings)) {
      settings.forEach((setting: any) => {
        if (setting.key && setting.value !== undefined) {
          // Parse value based on type
          let value = setting.value;
          if (setting.type === 'number') {
            value = parseFloat(setting.value);
          } else if (setting.type === 'boolean') {
            value = setting.value === 'true' || setting.value === '1';
          } else if (setting.type === 'json') {
            try {
              value = JSON.parse(setting.value);
            } catch (e) {
              value = setting.value;
            }
          }
          formattedSettings[setting.key] = value;
        }
      });
    }

    return NextResponse.json(formattedSettings);

  } catch (error) {
    console.error('Error fetching settings:', error);
    
    // Return default settings
    return NextResponse.json({
      site_title: 'Bajramedia',
      site_description: 'Creative Digital Agency',
      contact_email: 'hello@bajramedia.com',
      contact_phone: '+62 123 456 789',
      social_facebook: '',
      social_instagram: '',
      social_twitter: '',
      social_linkedin: '',
      seo_keywords: 'digital agency, web development, UI/UX design',
      error: 'Unable to fetch live settings'
    });
  }
}

// POST /api/admin/settings - Update settings
export async function POST(request: NextRequest) {
  try {
    const updates = await request.json();
    
    // DEBUG: Log what we're sending
    console.log('🔧 DEBUG: Original data from frontend:', updates);
    console.log('🔧 DEBUG: Data keys:', Object.keys(updates));
    console.log('🔧 DEBUG: Sample values:', {
      siteName: updates.siteName,
      contactEmail: updates.contactEmail,
      social_facebook: updates.social_facebook,
      'socialLinks.facebook': updates.socialLinks?.facebook
    });
    
    const response = await fetch(`${API_BASE_URL}?endpoint=settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates)
    });

    const responseText = await response.text();
    console.log('🔧 DEBUG: Raw response from api_bridge:', responseText);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}, response: ${responseText}`);
    }

    let result;
    try {
      result = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse response as JSON:', responseText);
      throw new Error('Invalid JSON response from database');
    }

    console.log('🔧 DEBUG: Parsed response:', result);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Settings updated successfully in database',
      updated: Object.keys(updates).length,
      data: result,
      debug: {
        sentKeys: Object.keys(updates),
        responseStatus: response.status,
        responseData: result
      }
    });

  } catch (error) {
    console.error('🔧 DEBUG: Error in settings save:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update settings',
        message: error instanceof Error ? error.message : 'Unknown error',
        debug: {
          errorType: error instanceof Error ? error.constructor.name : typeof error,
          errorMessage: error instanceof Error ? error.message : String(error)
        }
      },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/settings - Delete specific setting
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json(
        { error: 'Setting key is required' },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_BASE_URL}?endpoint=settings&key=${key}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Failed to delete setting');
    }

    return NextResponse.json({ 
      success: true, 
      message: `Setting '${key}' deleted successfully` 
    });

  } catch (error) {
    console.error('Error deleting setting:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete setting',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
