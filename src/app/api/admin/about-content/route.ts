import { NextResponse } from "next/server";

import { API_BASE_URL } from '@/config/api';

export async function GET() {
  try {
    console.log('About Content API: Fetching from production database...');
    const response = await fetch(`${API_BASE_URL}?endpoint=about-content`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('About Content API: Database success');
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('About Content API: Database connection failed:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch about content from database', 
        message: 'Please check if about_content table exists in bajx7634_bajra database',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('About Content API: Creating new entry in database...');
    
    const response = await fetch(`${API_BASE_URL}?endpoint=about-content`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('About Content API: Server error:', errorData);
      throw new Error(`Server error: ${response.status} - ${errorData}`);
    }
    
    const data = await response.json();
    console.log('About Content API: Database entry created successfully');
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('About Content API: Database creation failed:', error);
    return NextResponse.json(
      { error: 'Failed to create about content in database', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "About content ID is required" }, { status: 400 });
    }

    console.log('About Content API: Updating entry in database...');
    
    const response = await fetch(`${API_BASE_URL}?endpoint=about-content&id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('About Content API: Server error:', errorData);
      throw new Error(`Server error: ${response.status} - ${errorData}`);
    }
    
    const data = await response.json();
    console.log('About Content API: Database entry updated successfully');
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('About Content API: Database update failed:', error);
    return NextResponse.json(
      { error: 'Failed to update about content in database', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 
