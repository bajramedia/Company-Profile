import { NextRequest, NextResponse } from "next/server";

// Try multiple API endpoints
const API_ENDPOINTS = [
    'https://bajramedia.com',
    'https://www.bajramedia.com',
];

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = searchParams.get('page') || '1';
        const limit = searchParams.get('limit') || '10';
        const search = searchParams.get('search');
        const category = searchParams.get('category');
        const status = searchParams.get('status');

        // Try each endpoint until one works
        for (const baseUrl of API_ENDPOINTS) {
            try {
                let url = `${baseUrl}/api_bridge.php/posts`;
                const params = new URLSearchParams();
                
                params.append('page', page);
                params.append('limit', limit);
                if (search) params.append('search', search);
                if (category) params.append('category', category);
                if (status) params.append('status', status);
                
                url += `?${params.toString()}`;

                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'User-Agent': 'BajramediaAdmin/1.0',
                    },
                    cache: 'no-store',
                    signal: AbortSignal.timeout(10000),
                });

                if (response.ok) {
                    const data = await response.json();
                    if (!data.error) {
                        return NextResponse.json(data);
                    }
                }
            } catch (endpointError) {
                console.error(`Failed with ${baseUrl}:`, endpointError);
                continue;
            }
        }

        // If all endpoints fail, return fallback data
        console.log('All posts API endpoints failed, returning fallback data');
        
        const fallbackPosts = {
            posts: [
                {
                    id: 1,
                    title: 'Welcome to Bajramedia Blog',
                    slug: 'welcome-to-bajramedia-blog',
                    excerpt: 'Selamat datang di blog resmi Bajramedia. Tempat berbagi insight teknologi terbaru.',
                    content: 'Content will be loaded from database...',
                    status: 'published',
                    featured_image: '/images/placeholder.jpg',
                    author_id: 1,
                    author_name: 'Admin',
                    category_id: 1,
                    category_name: 'Technology',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    views: 0
                }
            ],
            pagination: {
                total: 1,
                page: 1,
                limit: 10,
                total_pages: 1
            }
        };

        return NextResponse.json(fallbackPosts);

    } catch (error) {
        console.error('Error in posts API:', error);
        return NextResponse.json(
            { error: 'Failed to fetch posts', fallback: true },
            { status: 200 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
        // Validate required fields
        if (!body.title || !body.content) {
            return NextResponse.json(
                { error: 'Title and content are required' },
                { status: 400 }
            );
        }

        // Try each endpoint until one works
        for (const baseUrl of API_ENDPOINTS) {
            try {
                const response = await fetch(`${baseUrl}/api_bridge.php/posts`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'User-Agent': 'BajramediaAdmin/1.0',
                    },
                    body: JSON.stringify(body),
                    signal: AbortSignal.timeout(10000),
                });

                if (response.ok) {
                    const data = await response.json();
                    if (!data.error) {
                        return NextResponse.json(data);
                    }
                }
            } catch (endpointError) {
                console.error(`POST failed with ${baseUrl}:`, endpointError);
                continue;
            }
        }

        return NextResponse.json(
            { error: 'Failed to create post - server unavailable' },
            { status: 503 }
        );

    } catch (error) {
        console.error('Error creating post:', error);
        return NextResponse.json(
            { error: 'Failed to create post' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    console.log('Posts API: Updating entry in database...');
    
    const postData = {
      title: updateData.title || "",
      slug: updateData.slug || "",
      excerpt: updateData.excerpt || "",
      content: updateData.content || "",
      featuredImage: updateData.featuredImage || "",
      published: updateData.published === true || updateData.published === "true" || updateData.published === 1,
      readTime: parseInt(updateData.readTime) || 5,
      authorId: updateData.authorId || updateData.author?.id,
      categoryId: updateData.categoryId || updateData.category?.id,
      tags: updateData.tagIds || updateData.tags || []
    };

    const response = await fetch(`${API_BASE_URL}?endpoint=posts&id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Posts API: Database entry updated successfully');
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Posts API: Database update failed:', error);
    return NextResponse.json({ error: "Failed to update post in database" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    console.log('Posts API: Deleting entry from database...');
    
    const response = await fetch(`${API_BASE_URL}?endpoint=posts&id=${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Posts API: Database entry deleted successfully');
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Posts API: Database deletion failed:', error);
    return NextResponse.json({ error: "Failed to delete post from database" }, { status: 500 });
  }
}
