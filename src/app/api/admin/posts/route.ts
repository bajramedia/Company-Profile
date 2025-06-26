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
        id: post.authorId || "cmbf4aq8s0000tsa4kiz9m58q", // Valid author ID from database
        name: post.authorName || "Admin User",
        avatar: post.authorAvatar || "",
        bio: post.authorBio || ""
      },
      category: {
        id: post.categoryId || "cmbf4aq900001tsa4kx7e1sgo", // Valid category ID from database
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
    console.log("Creating post with data:", body);
    
    // Extract and format post data
    const postData = {
      title: body.title || "",
      slug: body.slug || "",
      excerpt: body.excerpt || "",
      content: body.content || "",
      featuredImage: body.featuredImage || "",
      published: body.published === true || body.published === "true" || body.published === 1,
      readTime: parseInt(body.readTime) || 5,
      authorId: body.authorId || body.author?.id || "cmbf4aq8s0000tsa4kiz9m58q", // Valid author ID from database
      categoryId: body.categoryId || body.category?.id || "cmbf4aq900001tsa4kx7e1sgo", // Valid category ID from database
      tags: body.tagIds || body.tags || []
    };

    console.log("Formatted post data:", postData);
    
    // Create post via API bridge
    const response = await fetch(`${API_BASE_URL}?endpoint=posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Bridge error response:", errorText);
      throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
    }

    const result = await response.json();
    console.log("API Bridge result:", result);

    if (!result.success) {
      throw new Error(result.error || "Failed to create post");
    }

    return NextResponse.json({ 
      success: true, 
      id: result.id,
      message: "Post created successfully"
    });
  } catch (error) {
    console.error("Error creating post:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to create post";
    const errorDetails = error instanceof Error ? error.toString() : String(error);
    return NextResponse.json(
      { 
        error: errorMessage,
        details: errorDetails
      }, 
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

    // Format update data
    const postData = {
      title: updateData.title || "",
      slug: updateData.slug || "",
      excerpt: updateData.excerpt || "",
      content: updateData.content || "",
      featuredImage: updateData.featuredImage || "",
      published: updateData.published === true || updateData.published === "true" || updateData.published === 1,
      readTime: parseInt(updateData.readTime) || 5,
      authorId: updateData.authorId || updateData.author?.id || "cmbf4aq8s0000tsa4kiz9m58q", // Valid author ID from database
      categoryId: updateData.categoryId || updateData.category?.id || "cmbf4aq900001tsa4kx7e1sgo", // Valid category ID from database
      tags: updateData.tagIds || updateData.tags || []
    };

    // Update post via API bridge
    const response = await fetch(`${API_BASE_URL}?endpoint=posts&id=${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData)
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
