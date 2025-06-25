import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://bajramedia.com/api_bridge.php";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    // Get posts from external API
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

    // Format the posts to match admin panel expectations
    const formattedPosts = filteredPosts.map((post: any) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      featuredImage: post.featuredImage,
      date: post.createdAt || post.date,
      readTime: post.readTime || 5,
      published: post.published === "1" || post.published === 1 || post.published === true,
      author: {
        id: post.authorId || "1",
        name: post.authorName || "Admin User",
        avatar: post.authorAvatar || "",
        bio: post.authorBio || ""
      },
      category: {
        id: post.categoryId || "1",
        name: post.categoryName || "Uncategorized",
        slug: post.categorySlug || "uncategorized"
      },
      tags: post.tags || []
    }));

    return NextResponse.json({ 
      posts: formattedPosts, 
      total: filteredPosts.length,
      page,
      limit,
      totalPages: Math.ceil(filteredPosts.length / limit)
    });
  } catch (error) {
    console.error("Error fetching admin posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Create post via API bridge
    const response = await fetch(`${API_BASE_URL}?endpoint=posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error("Failed to create post");
    }

    return NextResponse.json({ success: true, id: result.id });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" }, 
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Post ID is required" }, 
        { status: 400 }
      );
    }

    // Update post via API bridge
    const response = await fetch(`${API_BASE_URL}?endpoint=posts&id=${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error("Failed to update post");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Failed to update post" }, 
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Post ID is required" }, 
        { status: 400 }
      );
    }

    // Delete post via API bridge
    const response = await fetch(`${API_BASE_URL}?endpoint=posts&id=${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error("Failed to delete post");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" }, 
      { status: 500 }
    );
  }
}
