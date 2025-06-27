import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = 'https://bajramedia.com/api_bridge.php';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    console.log('Posts API: Fetching from production database...');
    const response = await fetch(`${API_BASE_URL}?endpoint=posts&page=${page}&limit=${limit}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const posts = await response.json();
    
    // Filter posts based on search if provided
    let filteredPosts = posts;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredPosts = posts.filter((post: any) => 
        post.title?.toLowerCase().includes(searchLower) ||
        post.excerpt?.toLowerCase().includes(searchLower) ||
        post.content?.toLowerCase().includes(searchLower)
      );
    }

    // Format the posts to match admin panel expectations - NO FALLBACK DATA
    const formattedPosts = filteredPosts.map((post: any) => ({
      id: post.id,
      title: post.title || "",
      slug: post.slug || "",
      excerpt: post.excerpt || "",
      content: post.content || "",
      featuredImage: post.featuredImage || "",
      date: post.createdAt || post.date,
      readTime: post.readTime || 5,
      published: post.published === "1" || post.published === 1 || post.published === true,
      author: {
        id: post.authorId,
        name: post.authorName || "",
        avatar: post.authorAvatar || "",
        bio: post.authorBio || ""
      },
      category: {
        id: post.categoryId,
        name: post.categoryName || "",
        slug: post.categorySlug || ""
      },
      tags: post.tags || []
    }));

    console.log('Posts API: Database success');
    return NextResponse.json({ 
      posts: formattedPosts, 
      total: filteredPosts.length,
      page,
      limit,
      totalPages: Math.ceil(filteredPosts.length / limit)
    });
    
  } catch (error) {
    console.error("Posts API: Database connection failed:", error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch posts from database',
        message: 'Please check if post table exists in bajx7634_bajra database',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Posts API: Creating new entry in database...');
    
    // Validate required fields
    if (!body.title || !body.slug || !body.content) {
      return NextResponse.json(
        { error: 'Title, slug, and content are required' },
        { status: 400 }
      );
    }

    if (!body.authorId || !body.categoryId) {
      return NextResponse.json(
        { error: 'Author and category are required' },
        { status: 400 }
      );
    }
    
    const postData = {
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt || "",
      content: body.content,
      featuredImage: body.featuredImage || "",
      published: body.published === true || body.published === "true" || body.published === 1,
      readTime: parseInt(body.readTime) || 5,
      authorId: body.authorId || body.author?.id,
      categoryId: body.categoryId || body.category?.id,
      tags: body.tagIds || body.tags || []
    };

    const response = await fetch(`${API_BASE_URL}?endpoint=posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData)
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Posts API: Server error:', errorData);
      throw new Error(`Server error: ${response.status} - ${errorData}`);
    }

    const result = await response.json();
    console.log('Posts API: Database entry created successfully');
    return NextResponse.json({ 
      success: true, 
      id: result.id,
      message: "Post created successfully"
    });
    
  } catch (error) {
    console.error('Posts API: Database creation failed:', error);
    return NextResponse.json(
      { error: "Failed to create post in database", details: error.message }, 
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
