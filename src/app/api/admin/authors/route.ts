import { NextResponse } from "next/server";
import { API_BASE_URL } from '@/config/api';

export async function GET() {
  try {
    console.log('Authors API: Fetching from production database...');
    const response = await fetch(`${API_BASE_URL}?endpoint=authors`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(10000)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const authors = await response.json();
    
    // Format for frontend compatibility
    const formattedAuthors = authors.map((author: any) => ({
      ...author,
      postCount: author.postCount || 0,
      avatar: author.avatar || '/images/team/admin-avatar.jpg'
    }));
    
    console.log('Authors API: Database success');
    return NextResponse.json(formattedAuthors);
  } catch (error) {
    console.error('Authors API: Database connection failed:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch authors from database',
        message: 'Please check if author table exists in bajx7634_bajra database',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, bio, avatar } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    console.log("Authors API: Creating author with data:", { name, email, bio, avatar });
    
    const response = await fetch(`${API_BASE_URL}?endpoint=authors`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, bio, avatar }),
      signal: AbortSignal.timeout(15000)
    });

    console.log("Authors API: Response status:", response.status);
    
    const responseText = await response.text();
    console.log("Authors API: Raw response:", responseText);

    if (!response.ok) {
      console.error("Authors API: HTTP error:", response.status, responseText);
      return NextResponse.json(
        { 
          error: "Failed to create author", 
          details: `HTTP ${response.status}: ${responseText}`,
          status: response.status
        },
        { status: 500 }
      );
    }

    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Authors API: JSON parse error:", parseError);
      return NextResponse.json(
        { 
          error: "Invalid response from server", 
          details: "Server returned invalid JSON",
          rawResponse: responseText
        },
        { status: 500 }
      );
    }

    console.log("Authors API: Parsed result:", result);

    // Check if the response indicates success
    if (result.success) {
      console.log("Authors API: Author created successfully with ID:", result.id);
      
      // Return response that matches frontend expectations
      return NextResponse.json({ 
        success: true, 
        author: { 
          id: result.id,
          name: name,
          email: email,
          bio: bio || "",
          avatar: avatar || "/images/team/admin-avatar.jpg",
          postCount: 0
        }
      }, { status: 201 });
    } else {
      // Handle case where API returns error
      console.error("Authors API: Server returned error:", result);
      return NextResponse.json(
        { 
          error: result.error || "Unknown error from API",
          details: result
        },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error("Authors API: Exception during creation:", error);
    return NextResponse.json(
      { 
        error: "Failed to create author in database", 
        details: error instanceof Error ? error.message : "Unknown error",
        suggestion: "Please check database connection and table structure"
      },
      { status: 500 }
    );
  }
}
