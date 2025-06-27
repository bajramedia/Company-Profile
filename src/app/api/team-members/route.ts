import { NextResponse } from 'next/server';

const API_BASE_URL = 'https://bajramedia.com/api_bridge.php';

// GET /api/team-members - Get all team members for public display
export async function GET() {
  try {
    console.log('Public Team Members API: Fetching from production database...');
    const response = await fetch(`${API_BASE_URL}?endpoint=team-members`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const teamMembers = await response.json();
    
    // Format team members for public display
    const formattedMembers = teamMembers.map((member: any) => ({
      id: member.id,
      name: member.name,
      role: member.role,
      roleId: member.roleId || member.role, // Fallback to role if roleId doesn't exist
      bio: member.bio || "",
      bioId: member.bioId || member.bio || "", // Fallback chain
      image: member.image || "/images/team-meeting.jpg", // Default image
      social: {
        linkedin: member.linkedin || "",
        github: member.github || "",
        instagram: member.instagram || "",
        behance: member.behance || "",
        tiktok: member.tiktok || "",
        youtube: member.youtube || ""
      },
      order: member.order || 0 // For sorting team members
    }));

    // Sort by order field
    formattedMembers.sort((a: any, b: any) => a.order - b.order);

    console.log('Public Team Members API: Database success');
    return NextResponse.json(formattedMembers);
    
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