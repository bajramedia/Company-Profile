import { NextResponse } from "next/server";

const API_BASE_URL = 'https://bajramedia.com/api_bridge.php';

export async function GET() {
  try {
    console.log('Team Members API: Fetching from production database...');
    const response = await fetch(`${API_BASE_URL}?endpoint=team-members`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Team Members API: Database success');
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Team Members API: Database connection failed:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch team members from database',
        message: 'Please check if team_members table exists in bajx7634_bajra database',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Team Members API: Creating new entry in database...');
    
    const response = await fetch(`${API_BASE_URL}?endpoint=team-members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Team Members API: Database entry created successfully');
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Team Members API: Database creation failed:', error);
    return NextResponse.json(
      { error: 'Failed to create team member in database' },
      { status: 500 }
    );
  }
}