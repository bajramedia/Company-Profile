"use server";

import { revalidatePath } from 'next/cache';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://bajramedia.com/api_bridge.php';

export interface CategoryData {
  name: string;
  slug: string;
}

// Get all categories
export async function getCategories() {
  try {
    const response = await fetch(`${API_BASE_URL}?endpoint=categories`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const categories = await response.json();
    return Array.isArray(categories) ? categories : [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// Create new category
export async function createCategory(data: CategoryData) {
  try {
    const response = await fetch(`${API_BASE_URL}?endpoint=categories`, {
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
      throw new Error(result.message || 'Failed to create category');
    }

    revalidatePath('/admin/categories');
    revalidatePath('/blog');
    
    return { success: true, category: result.data };
  } catch (error) {
    console.error('Error creating category:', error);
    return { success: false, error: 'Failed to create category' };
  }
}

// Update category
export async function updateCategory(id: string, data: CategoryData) {
  try {
    const response = await fetch(`${API_BASE_URL}?endpoint=categories&id=${id}`, {
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
      throw new Error(result.message || 'Failed to update category');
    }

    revalidatePath('/admin/categories');
    revalidatePath('/blog');
    
    return { success: true, category: result.data };
  } catch (error) {
    console.error('Error updating category:', error);
    return { success: false, error: 'Failed to update category' };
  }
}

// Delete category
export async function deleteCategory(id: string) {
  try {
    // Check if category has posts
    const postsResponse = await fetch(`${API_BASE_URL}?endpoint=posts&categoryId=${id}&limit=1`);
    if (postsResponse.ok) {
      const posts = await postsResponse.json();
      if (Array.isArray(posts) && posts.length > 0) {
        return { success: false, error: 'Cannot delete category with existing posts' };
      }
    }

    const response = await fetch(`${API_BASE_URL}?endpoint=categories&id=${id}`, {
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
      throw new Error(result.message || 'Failed to delete category');
    }

    revalidatePath('/admin/categories');
    revalidatePath('/blog');
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting category:', error);
    return { success: false, error: 'Failed to delete category' };
  }
}
