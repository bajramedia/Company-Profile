import { NextResponse } from 'next/server';

const API_BASE_URL = 'https://www.bajramedia.com/api_bridge.php';

// GET /api/team-members - Get all team members for public display
export async function GET() {
  try {
    console.log('Public Team Members API: Fetching from production database...');
    const response = await fetch(`${API_BASE_URL}?endpoint=team-members`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const teamMembers = await response.json();
    
    // Format team members for public display - match API bridge response structure
    const formattedMembers = teamMembers.map((member: any) => ({
      id: member.id,
      name: member.name,
      role: member.roleEn || member.role_en || member.role || "Team Member",
      roleId: member.roleId || member.role_id || member.roleEn || member.role_en || member.role || "Team Member",
      bio: member.bioEn || member.bio_en || member.bio || "",
      bioId: member.bioId || member.bio_id || member.bioEn || member.bio_en || member.bio || "",
      image: member.imageUrl || member.image_url || member.image || "/images/team-meeting.jpg",
      social: {
        linkedin: member.linkedinUrl || member.linkedin_url || member.linkedin || "",
        github: member.githubUrl || member.github_url || member.github || "",
        instagram: member.instagramUrl || member.instagram_url || member.instagram || "",
        behance: member.behanceUrl || member.behance_url || member.behance || "",
        tiktok: member.tiktokUrl || member.tiktok_url || member.tiktok || "",
        youtube: member.youtubeUrl || member.youtube_url || member.youtube || ""
      },
      order: member.sort_order || member.order || 0 // API bridge uses sort_order
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