"use server";

import { revalidatePath } from 'next/cache';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://bajramedia.com/api_bridge.php';

export interface TagData {
  name: string;
  slug: string;
}

// Get all tags
export async function getTags() {
  try {
    const response = await fetch(`${API_BASE_URL}?endpoint=tags`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const tags = await response.json();
    return Array.isArray(tags) ? tags : [];
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
}

// Create new tag
export async function createTag(data: TagData) {
  try {
    const response = await fetch(`${API_BASE_URL}?endpoint=tags`, {
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
      throw new Error(result.message || 'Failed to create tag');
    }

    revalidatePath('/admin/tags');
    revalidatePath('/blog');
    
    return { success: true, tag: result.data };
  } catch (error) {
    console.error('Error creating tag:', error);
    return { success: false, error: 'Failed to create tag' };
  }
}

// Update tag
export async function updateTag(id: string, data: TagData) {
  try {
    const response = await fetch(`${API_BASE_URL}?endpoint=tags&id=${id}`, {
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
      throw new Error(result.message || 'Failed to update tag');
    }

    revalidatePath('/admin/tags');
    revalidatePath('/blog');
    
    return { success: true, tag: result.data };
  } catch (error) {
    console.error('Error updating tag:', error);
    return { success: false, error: 'Failed to update tag' };
  }
}

// Delete tag
export async function deleteTag(id: string) {
  try {
    const response = await fetch(`${API_BASE_URL}?endpoint=tags&id=${id}`, {
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
      throw new Error(result.message || 'Failed to delete tag');
    }

    revalidatePath('/admin/tags');
    revalidatePath('/blog');
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting tag:', error);
    return { success: false, error: 'Failed to delete tag' };
  }
}
