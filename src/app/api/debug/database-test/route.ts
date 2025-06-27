import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://bajramedia.com/api_bridge.php';

// Test endpoint untuk debug database operations
export async function POST(request: NextRequest) {
  try {
    const { testType = 'settings' } = await request.json();
    
    console.log('🧪 DATABASE TEST: Starting test type:', testType);
    
    if (testType === 'settings') {
      // Test 1: Simple setting insert
      const testData = {
        'test_key_' + Date.now(): 'test_value_' + Date.now(),
        'debug_timestamp': new Date().toISOString()
      };
      
      console.log('🧪 DATABASE TEST: Sending test data:', testData);
      
      const response = await fetch(`${API_BASE_URL}?endpoint=settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      });
      
      const responseText = await response.text();
      console.log('🧪 DATABASE TEST: Response:', responseText);
      
      // Verify immediately
      const verifyResponse = await fetch(`${API_BASE_URL}?endpoint=settings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const currentSettings = await verifyResponse.json();
      console.log('🧪 DATABASE TEST: Current settings:', currentSettings);
      
      // Check if our test keys exist
      const testKeys = Object.keys(testData);
      const foundKeys = testKeys.filter(key => key in currentSettings);
      
      return NextResponse.json({
        success: true,
        test: 'settings_write',
        sent_keys: testKeys,
        found_keys: foundKeys,
        test_passed: foundKeys.length === testKeys.length,
        api_response: responseText,
        current_settings: currentSettings,
        debug: {
          response_status: response.status,
          keys_sent: testKeys.length,
          keys_found: foundKeys.length,
          missing_keys: testKeys.filter(key => !(key in currentSettings))
        }
      });
    }
    
    // Test 2: Direct table check
    if (testType === 'table_check') {
      // Test basic database connectivity
      const response = await fetch(`${API_BASE_URL}?endpoint=stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const stats = await response.json();
      
      return NextResponse.json({
        success: true,
        test: 'table_check',
        database_accessible: response.ok,
        stats: stats,
        debug: {
          status: response.status,
          can_read: !!stats
        }
      });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Unknown test type',
      available_tests: ['settings', 'table_check']
    });
    
  } catch (error) {
    console.error('🧪 DATABASE TEST ERROR:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      debug: {
        error_type: error instanceof Error ? error.constructor.name : typeof error
      }
    });
  }
}

// GET untuk info
export async function GET() {
  return NextResponse.json({
    info: 'Database Test Endpoint',
    usage: 'POST with {"testType": "settings"} or {"testType": "table_check"}',
    purpose: 'Debug database write operations'
  });
} 