import { NextResponse } from 'next/server';
import { API_BASE_URL } from "@/config/api";

// GET /api/team-members - Get all team members for public display
export async function GET() {
  try {
    console.log('Public Team Members API: Fetching from production database...');
    const response = await fetch(`${API_BASE_URL}?endpoint=team-members`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const teamMembers = await response.json();
    return Response.json(teamMembers);
  } catch (error) {
    console.error('Public Team Members API: Database connection failed:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch team members from database',
        message: 'Please check if team_members table exists in bajx7634_bajra database',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
} 
