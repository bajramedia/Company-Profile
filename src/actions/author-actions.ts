"use server";

import { revalidatePath } from 'next/cache';
import { API_BASE_URL } from "@/utils/api-config";

export interface AuthorData {
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
}

// Get all authors
export async function getAuthors() {
  try {
    const response = await fetch(`${API_BASE_URL}?endpoint=authors`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const authors = await response.json();
    return Array.isArray(authors) ? authors : [];
  } catch (error) {
    console.error('Error fetching authors:', error);
    return [];
  }
}

// Create new author
export async function createAuthor(data: AuthorData) {
  try {
    const response = await fetch(`${API_BASE_URL}?endpoint=authors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Failed to create author');
    }

    revalidatePath('/admin/authors');
    revalidatePath('/blog');
    
    return { success: true, author: result.data };
  } catch (error) {
    console.error('Error creating author:', error);
    return { success: false, error: 'Failed to create author' };
  }
}

// Update author
export async function updateAuthor(id: string, data: AuthorData) {
  try {
    const response = await fetch(`${API_BASE_URL}?endpoint=authors&id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Failed to update author');
    }

    revalidatePath('/admin/authors');
    revalidatePath('/blog');
    
    return { success: true, author: result.data };
  } catch (error) {
    console.error('Error updating author:', error);
    return { success: false, error: 'Failed to update author' };
  }
}

// Delete author
export async function deleteAuthor(id: string) {
  try {
    // Check if author has posts
    const postsResponse = await fetch(`${API_BASE_URL}?endpoint=posts&authorId=${id}&limit=1`);
    if (postsResponse.ok) {
      const posts = await postsResponse.json();
      if (Array.isArray(posts) && posts.length > 0) {
        return { success: false, error: 'Cannot delete author with existing posts' };
      }
    }

    const response = await fetch(`${API_BASE_URL}?endpoint=authors&id=${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Failed to delete author');
    }

    revalidatePath('/admin/authors');
    revalidatePath('/blog');
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting author:', error);
    return { success: false, error: 'Failed to delete author' };
  }
}
