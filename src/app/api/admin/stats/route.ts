import { NextRequest, NextResponse } from 'next/server';

import { API_BASE_URL } from '@/config/api';

// GET /api/admin/stats - Get admin dashboard statistics
export async function GET() {
  try {
    console.log('📊 Stats API: Fetching comprehensive stats dari database...');
    
    // Fetch basic stats dari API bridge
    const statsResponse = await fetch(`${API_BASE_URL}?endpoint=stats`);
    let basicStats = {};
    
    if (statsResponse.ok) {
      basicStats = await statsResponse.json();
      console.log('✅ Basic stats berhasil diambil');
    } else {
      console.warn('⚠️ Basic stats gagal, akan fetch manual');
    }

    // Fetch authors count
    let authorsCount = 0;
    try {
      const authorsResponse = await fetch(`${API_BASE_URL}?endpoint=authors`);
      if (authorsResponse.ok) {
        const authorsData = await authorsResponse.json();
        authorsCount = Array.isArray(authorsData) ? authorsData.length : 0;
        console.log('✅ Authors count:', authorsCount);
      }
    } catch (error) {
      console.error('❌ Error fetching authors:', error);
    }

    // Fetch portfolios count
    let portfoliosCount = 0;
    try {
      const portfoliosResponse = await fetch(`${API_BASE_URL}?endpoint=portfolio`);
      if (portfoliosResponse.ok) {
        const portfoliosData = await portfoliosResponse.json();
        const portfolios = portfoliosData.portfolios || portfoliosData || [];
        portfoliosCount = Array.isArray(portfolios) ? portfolios.length : 0;
        console.log('✅ Portfolios count:', portfoliosCount);
      }
    } catch (error) {
      console.error('❌ Error fetching portfolios:', error);
    }

    // Fetch posts count
    let postsCount = 0;
    try {
      const postsResponse = await fetch(`${API_BASE_URL}?endpoint=posts`);
      if (postsResponse.ok) {
        const postsData = await postsResponse.json();
        postsCount = Array.isArray(postsData) ? postsData.length : 0;
        console.log('✅ Posts count:', postsCount);
      }
    } catch (error) {
      console.error('❌ Error fetching posts:', error);
    }

    // Combine all stats
    const comprehensiveStats = {
      ...basicStats,
      authors: authorsCount,
      portfolios: portfoliosCount,
      posts: postsCount,
      totalContent: authorsCount + portfoliosCount + postsCount,
      lastUpdated: new Date().toISOString()
    };

    console.log('📊 Comprehensive stats:', comprehensiveStats);
    return NextResponse.json(comprehensiveStats);
    
  } catch (error) {
    console.error('💥 Stats API: Database connection failed:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch stats from database',
        message: 'Please check database connection and stats tables',
        details: error instanceof Error ? error.message : 'Unknown error occurred',
        // Fallback stats
        authors: 0,
        portfolios: 0,
        posts: 0,
        totalContent: 0
      },
      { status: 500 }
    );
  }
}
