import { NextResponse } from 'next/server';

const API_BASE_URL = 'https://bajramedia.com/api_bridge.php';

// Fallback team data in case database is empty
const fallbackTeamMembers = [
  {
    id: 1,
    name: "Tim Bajramedia",
    role: "Development Team", 
    roleId: "Tim Development",
    bio: "We are passionate developers and designers dedicated to creating amazing digital solutions.",
    bioId: "Kami adalah developer dan desainer yang berdedikasi untuk menciptakan solusi digital yang luar biasa.",
    image: "/images/team-meeting.jpg",
    social: {
      linkedin: "https://linkedin.com/company/bajramedia",
      github: "https://github.com/bajramedia",
      instagram: "https://instagram.com/bajramedia",
      behance: "",
      tiktok: "",
      youtube: ""
    },
    order: 1
  }
];

// GET /api/team-members - Get all team members for public display
export async function GET() {
  try {
    console.log('[BAJRA API] 👥 Fetching team members from production database...');
    
    const response = await fetch(`${API_BASE_URL}?endpoint=team-members`, {
      method: 'GET',
      headers: {
        'User-Agent': 'BajramediaApp/1.0',
        'Accept': 'application/json',
      },
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });
    
    console.log('[BAJRA API] 📡 Team API response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }
    
    const teamMembers = await response.json();
    console.log('[BAJRA API] 📊 Raw team data received:', typeof teamMembers, Array.isArray(teamMembers) ? teamMembers.length : 'not array');
    
    // Handle different response formats
    let teamArray = [];
    
    if (Array.isArray(teamMembers)) {
      teamArray = teamMembers;
    } else if (teamMembers && typeof teamMembers === 'object' && teamMembers.data) {
      teamArray = Array.isArray(teamMembers.data) ? teamMembers.data : [];
    } else if (teamMembers && typeof teamMembers === 'object') {
      // Single object, wrap in array
      teamArray = [teamMembers];
    }
    
    // If no data from API, use fallback
    if (!teamArray || teamArray.length === 0) {
      console.log('[BAJRA API] ⚠️ No team data from API, using fallback data');
      const formattedMembers = fallbackTeamMembers.map(member => ({
        ...member,
        id: String(member.id)
      }));
      return NextResponse.json(formattedMembers);
    }
    
    // Format team members for public display - match API bridge response structure
    const formattedMembers = teamArray.map((member: any, index: number) => ({
      id: member.id || String(index + 1),
      name: member.name || `Team Member ${index + 1}`,
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
      order: member.sort_order || member.order || index
    }));

    // Sort by order field
    formattedMembers.sort((a: any, b: any) => a.order - b.order);

    console.log('[BAJRA API] ✅ Team members processed successfully:', formattedMembers.length);
    return NextResponse.json(formattedMembers);
    
  } catch (error) {
    console.error('[BAJRA API] ❌ Team members API error:', error);
    
    // Return fallback data instead of error
    console.log('[BAJRA API] 🛡️ Using fallback team data due to error');
    const formattedMembers = fallbackTeamMembers.map(member => ({
      ...member,
      id: String(member.id)
    }));
    
    return NextResponse.json(formattedMembers);
  }
} 