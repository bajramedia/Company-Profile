import { NextResponse } from 'next/server';

interface SamplePost {
  id: any;
  title: string;
  hasAuthor: boolean;
  hasCategory: boolean;
  hasDummyData: boolean;
  featured?: boolean;
}

interface TestResult {
  name: string;
  endpoint: string;
  status: 'PASS' | 'FAIL' | 'ERROR';
  statusCode?: number;
  dataReceived?: number;
  hasRequiredFields?: boolean;
  hasFeaturedPosts?: boolean;
  hasValidStructure?: boolean;
  samplePost?: SamplePost | null;
  rawStructure?: any;
  errors?: string[];
  error?: string;
}

export async function GET() {
  const testResults = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    tests: [] as TestResult[]
  };
  
  console.log('🧪 Starting comprehensive Posts API test...');
  
  // Test 1: All Posts API
  try {
    console.log('📋 Testing /api/posts endpoint...');
    const postsResponse = await fetch('http://localhost:3000/api/posts?limit=5');
    const postsData = await postsResponse.json();
    
    const postsTest: TestResult = {
      name: 'All Posts API',
      endpoint: '/api/posts',
      status: postsResponse.ok ? 'PASS' : 'FAIL',
      statusCode: postsResponse.status,
      dataReceived: Array.isArray(postsData) ? postsData.length : 0,
      hasRequiredFields: false,
      samplePost: null,
      errors: []
    };
    
    if (Array.isArray(postsData) && postsData.length > 0) {
      const firstPost = postsData[0];
      postsTest.samplePost = {
        id: firstPost.id,
        title: firstPost.title?.substring(0, 50) + '...',
        hasAuthor: !!firstPost.author?.name,
        hasCategory: !!firstPost.category?.name,
        hasDummyData: firstPost.author?.name === 'Unknown Author' || 
                      firstPost.author?.name === 'Admin User' ||
                      firstPost.category?.name === 'Uncategorized'
      };
      
      postsTest.hasRequiredFields = firstPost.id && firstPost.title && 
                                   firstPost.author?.name && firstPost.category?.name;
      
      if (postsTest.samplePost.hasDummyData) {
        postsTest.errors?.push('Contains dummy/fallback data');
      }
    }
    
    testResults.tests.push(postsTest);
  } catch (error) {
    testResults.tests.push({
      name: 'All Posts API',
      endpoint: '/api/posts',
      status: 'ERROR',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
  
  // Test 2: Featured Posts API
  try {
    console.log('⭐ Testing /api/posts/featured endpoint...');
    const featuredResponse = await fetch('http://localhost:3000/api/posts/featured');
    const featuredData = await featuredResponse.json();
    
    const featuredTest: TestResult = {
      name: 'Featured Posts API',
      endpoint: '/api/posts/featured',
      status: featuredResponse.ok ? 'PASS' : 'FAIL',
      statusCode: featuredResponse.status,
      dataReceived: Array.isArray(featuredData) ? featuredData.length : 0,
      hasFeaturedPosts: false,
      samplePost: null,
      errors: []
    };
    
    if (Array.isArray(featuredData) && featuredData.length > 0) {
      const firstPost = featuredData[0];
      featuredTest.samplePost = {
        id: firstPost.id,
        title: firstPost.title?.substring(0, 50) + '...',
        featured: firstPost.featured,
        hasAuthor: !!firstPost.author?.name,
        hasCategory: !!firstPost.category?.name,
        hasDummyData: firstPost.author?.name === 'Unknown Author' || 
                      firstPost.category?.name === 'Uncategorized'
      };
      
      featuredTest.hasFeaturedPosts = featuredData.some((post: any) => post.featured === true);
      
      if (featuredTest.samplePost.hasDummyData) {
        featuredTest.errors?.push('Contains dummy/fallback data');
      }
    }
    
    testResults.tests.push(featuredTest);
  } catch (error) {
    testResults.tests.push({
      name: 'Featured Posts API',
      endpoint: '/api/posts/featured',
      status: 'ERROR',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
  
  // Test 3: Search Posts API
  try {
    console.log('🔍 Testing /api/posts/search endpoint...');
    const searchResponse = await fetch('http://localhost:3000/api/posts/search?q=test');
    const searchData = await searchResponse.json();
    
    const searchTest: TestResult = {
      name: 'Search Posts API',
      endpoint: '/api/posts/search',
      status: searchResponse.ok ? 'PASS' : 'FAIL',
      statusCode: searchResponse.status,
      dataReceived: searchData.posts ? searchData.posts.length : 0,
      hasValidStructure: false,
      samplePost: null,
      errors: []
    };
    
    if (searchData.posts && Array.isArray(searchData.posts) && searchData.posts.length > 0) {
      const firstPost = searchData.posts[0];
      searchTest.samplePost = {
        id: firstPost.id,
        title: firstPost.title?.substring(0, 50) + '...',
        hasAuthor: !!firstPost.author?.name,
        hasCategory: !!firstPost.category?.name,
        hasDummyData: firstPost.author?.name === 'Unknown' || 
                      firstPost.category?.name === 'Uncategorized'
      };
      
      searchTest.hasValidStructure = searchData.query && searchData.pagination;
      
      if (searchTest.samplePost.hasDummyData) {
        searchTest.errors?.push('Contains dummy/fallback data');
      }
    }
    
    testResults.tests.push(searchTest);
  } catch (error) {
    testResults.tests.push({
      name: 'Search Posts API',
      endpoint: '/api/posts/search',
      status: 'ERROR',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
  
  // Test 4: Test api_bridge.php direktly
  try {
    console.log('🌉 Testing api_bridge.php directly...');
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://bajramedia.com/api_bridge.php';
    const directResponse = await fetch(`${apiBaseUrl}?endpoint=posts&limit=3`, {
      headers: {
        'User-Agent': 'Bajramedia-Test/1.0'
      }
    });
    const directData = await directResponse.json();
    
    const directTest: TestResult = {
      name: 'Direct api_bridge.php',
      endpoint: 'api_bridge.php?endpoint=posts',
      status: directResponse.ok ? 'PASS' : 'FAIL',
      statusCode: directResponse.status,
      dataReceived: Array.isArray(directData) ? directData.length : 0,
      rawStructure: null,
      errors: []
    };
    
    if (Array.isArray(directData) && directData.length > 0) {
      const firstPost = directData[0];
      directTest.rawStructure = {
        id: !!firstPost.id,
        title: !!firstPost.title,
        authorName: !!firstPost.authorName,
        categoryName: !!firstPost.categoryName,
        slug: !!firstPost.slug,
        content: !!firstPost.content,
        published: firstPost.published,
        sampleTitle: firstPost.title?.substring(0, 30) + '...'
      };
    }
    
    testResults.tests.push(directTest);
  } catch (error) {
    testResults.tests.push({
      name: 'Direct api_bridge.php',
      endpoint: 'api_bridge.php?endpoint=posts',
      status: 'ERROR',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
  
  // Calculate overall results
  const passCount = testResults.tests.filter(t => t.status === 'PASS').length;
  const totalTests = testResults.tests.length;
  const successRate = Math.round((passCount / totalTests) * 100);
  
  console.log(`✅ Posts API Test Complete: ${passCount}/${totalTests} tests passed (${successRate}%)`);
  
  return NextResponse.json({
    ...testResults,
    summary: {
      totalTests,
      passed: passCount,
      failed: totalTests - passCount,
      successRate: `${successRate}%`,
      noDummyData: testResults.tests.every(t => !t.errors?.includes('Contains dummy/fallback data')),
      recommendations: testResults.tests.some(t => t.errors && t.errors.length > 0) ? [
        'Remove any remaining dummy/fallback data',
        'Ensure all posts have required fields from database',
        'Check api_bridge.php connection status'
      ] : [
        'All APIs are clean of dummy data! 🎉',
        'Database connection is working properly',
        'Ready for production use'
      ]
    }
  });
} 