"use server";

import { revalidatePath } from "next/cache";
import { fetchWithFallback, apiPost, apiPut, apiDelete } from '@/utils/api-client';

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

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  published: boolean;
  featured: boolean;
  authorId: string;
  categoryId: string;
  tags: string[];
  date: string;
  readTime: number;
  views: number;
}

// Generate a slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, "-");
}

export async function getAllPosts(): Promise<Post[]> {
  try {
    const response = await fetchWithFallback('?endpoint=posts');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const response = await fetchWithFallback(`?endpoint=posts&slug=${slug}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return Array.isArray(data) ? data[0] : data;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

// Create a new blog post using API bridge
export async function createPost(postData: Omit<Post, 'id' | 'date' | 'views'>): Promise<{ success: boolean; post?: Post; error?: string }> {
  try {
    const response = await apiPost('?endpoint=posts', {
      ...postData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    revalidatePath('/admin/posts');
    revalidatePath('/blog');
    
    return { success: true, post: result.data || result };
  } catch (error) {
    console.error('Error creating post:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create post' 
    };
  }
}

// Update an existing blog post using API bridge
export async function updatePost(id: string, postData: Partial<Post>): Promise<{ success: boolean; post?: Post; error?: string }> {
  try {
    const response = await apiPut(`?endpoint=posts&id=${id}`, {
      ...postData,
      updatedAt: new Date().toISOString()
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    revalidatePath('/admin/posts');
    revalidatePath('/blog');
    revalidatePath(`/blog/${postData.slug}`);
    
    return { success: true, post: result.data || result };
  } catch (error) {
    console.error('Error updating post:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update post' 
    };
  }
}

// Delete a blog post using API bridge
export async function deletePost(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await apiDelete(`?endpoint=posts&id=${id}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    revalidatePath('/admin/posts');
    revalidatePath('/blog');
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting post:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete post' 
    };
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
