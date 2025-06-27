import { NextResponse } from 'next/server';

const API_BASE_URL = 'https://bajramedia.com/api_bridge.php';

// GET - Ambil public settings (tanpa admin settings)
export async function GET() {
  try {
    console.log('Settings API: Fetching from production database...');
    const response = await fetch(`${API_BASE_URL}?endpoint=settings`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const settings = await response.json();
    console.log('Settings API: Database success');
    return NextResponse.json(settings);
    
  } catch (error) {
    console.error('Settings API: Database connection failed:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch settings from database',
        message: 'Please check if setting table exists in bajx7634_bajra database',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
