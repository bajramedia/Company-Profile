import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://bajramedia.com/api_bridge.php';

// Test endpoint untuk debug database operations
export async function POST(request: NextRequest) {
  try {
    const { testType = 'settings' } = await request.json();
    
    console.log('🧪 DATABASE TEST: Starting test type:', testType);
    
    if (testType === 'simple_test') {
      // Test dengan data minimal
      const testKey = 'debug_test_' + Date.now();
      const testValue = 'test_' + Date.now();
      const testData = { [testKey]: testValue };
      
      console.log('🧪 DATABASE TEST: Testing with:', testData);
      
      // Get current settings first
      const beforeResponse = await fetch(`${API_BASE_URL}?endpoint=settings`);
      const beforeSettings = await beforeResponse.json();
      const beforeCount = Object.keys(beforeSettings).length;
      
      // Send test data
      const postResponse = await fetch(`${API_BASE_URL}?endpoint=settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      });
      
      const postResult = await postResponse.text();
      
      // Get settings after
      const afterResponse = await fetch(`${API_BASE_URL}?endpoint=settings`);
      const afterSettings = await afterResponse.json();
      const afterCount = Object.keys(afterSettings).length;
      
      const keyExists = testKey in afterSettings;
      const valueMatches = afterSettings[testKey] === testValue;
      
      return NextResponse.json({
        test: 'simple_test',
        success: keyExists && valueMatches,
        details: {
          test_key: testKey,
          test_value: testValue,
          key_exists: keyExists,
          value_matches: valueMatches,
          before_count: beforeCount,
          after_count: afterCount,
          count_increased: afterCount > beforeCount,
          api_response: postResult,
          found_value: afterSettings[testKey] || null
        }
      });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Use testType: "simple_test"'
    });
    
  } catch (error) {
    console.error('🧪 DATABASE TEST ERROR:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

export async function GET() {
  return NextResponse.json({
    info: 'Database Test Endpoint',
    usage: 'POST with {"testType": "simple_test"}',
    purpose: 'Debug database write operations'
  });
} 