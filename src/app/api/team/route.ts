import { NextResponse } from 'next/server';
import { API_BASE_URL } from '@/config/api';

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}?endpoint=team-members`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch team members: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Transform data sesuai dengan struktur yang diharapkan
    const transformedTeam = data.map((member: any) => ({
      id: member.id,
      name: member.name,
      role: member.role_en,
      roleId: member.role_id,
      bio: member.bio_en,
      bioId: member.bio_id,
      image: member.image_url || '/images/team/placeholder.jpg',
      social: {
        linkedin: member.linkedin_url || '',
        github: member.github_url || '',
        instagram: member.instagram_url || ''
      }
    }));
    
    return NextResponse.json(transformedTeam);
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team members' },
      { status: 500 }
    );
  }
} 