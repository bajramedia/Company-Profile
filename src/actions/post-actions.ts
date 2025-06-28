"use server";

import { revalidatePath } from "next/cache";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://www.bajramedia.com/api_bridge.php";

// Interface for blog post creation/update
export interface PostFormData {
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  published: boolean;
  readTime?: number;
  authorId: string;
  categoryId: string;
  tags?: string[];
}

// Generate a slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, "-");
}

// Create a new blog post using API bridge
export async function createPost(formData: PostFormData) {
  try {
    const {
      title,
      excerpt,
      content,
      featuredImage,
      published,
      readTime,
      authorId,
      categoryId,
      tags = [],
    } = formData;

    // Generate a slug if not provided
    const slug = formData.slug || generateSlug(title);

    // Create the post via API bridge
    const response = await fetch(`${API_BASE_URL}?endpoint=posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        slug,
        excerpt,
        content,
        featuredImage,
        published,
        readTime: readTime || 5,
        authorId,
        categoryId,
        tags
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error("Failed to create post");
    }

    // Revalidate paths to update cached data
    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);
    revalidatePath("/admin/posts");
    
    return { success: true, post: { id: result.id } };
  } catch (error) {
    console.error("Error creating post:", error);
    return { success: false, error: "Failed to create post" };
  }
}

// Update an existing blog post using API bridge
export async function updatePost(postId: string, formData: PostFormData) {
  try {
    const {
      title,
      excerpt,
      content,
      featuredImage,
      published,
      readTime,
      authorId,
      categoryId,
      tags = [],
    } = formData;

    // Generate a slug if not provided
    const slug = formData.slug || generateSlug(title);

    // Update the post via API bridge
    const response = await fetch(`${API_BASE_URL}?endpoint=posts&id=${postId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        slug,
        excerpt,
        content,
        featuredImage,
        published,
        readTime: readTime || 5,
        authorId,
        categoryId,
        tags
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error("Failed to update post");
    }

    // Revalidate paths to update cached data
    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);
    revalidatePath("/admin/posts");
    
    return { success: true, post: { id: postId } };
  } catch (error) {
    console.error("Error updating post:", error);
    return { success: false, error: "Failed to update post" };
  }
}

// Delete a blog post using API bridge
export async function deletePost(postId: string) {
  try {
    // Delete the post via API bridge
    const response = await fetch(`${API_BASE_URL}?endpoint=posts&id=${postId}`, {
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

    // Revalidate the blog path
    revalidatePath("/blog");
    revalidatePath("/admin/posts");
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting post:", error);
    return { success: false, error: "Failed to delete post" };
  }
}

// Publish or unpublish a post using API bridge
export async function togglePublishPost(postId: string) {
  try {
    // First get the current post to check its publish status
    const getResponse = await fetch(`${API_BASE_URL}?endpoint=posts&id=${postId}`);
    
    if (!getResponse.ok) {
      throw new Error(`HTTP error! status: ${getResponse.status}`);
    }

    const post = await getResponse.json();

    if (!post) {
      return { success: false, error: "Post not found" };
    }

    // Toggle publish status
    const newPublished = !post.published;

    // Update the post with new publish status
    const updateResponse = await fetch(`${API_BASE_URL}?endpoint=posts&id=${postId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...post,
        published: newPublished
      })
    });

    if (!updateResponse.ok) {
      throw new Error(`HTTP error! status: ${updateResponse.status}`);
    }

    const result = await updateResponse.json();

    if (!result.success) {
      throw new Error("Failed to update post");
    }

    // Revalidate paths to update cached data
    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);
    revalidatePath("/admin/posts");
    
    return { success: true, post: { ...post, published: newPublished } };
  } catch (error) {
    console.error("Error toggling post publish status:", error);
    return { success: false, error: "Failed to update post" };
  }
}
