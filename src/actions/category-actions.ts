"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Interface for category creation/update
interface CategoryFormData {
  name: string;
  slug?: string;
}

// Generate a slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, '-');
}

// Create a new category
export async function createCategory(formData: CategoryFormData) {
  try {
    const { name } = formData;
    const slug = formData.slug || generateSlug(name);

    const category = await prisma.category.create({
      data: {
        name,
        slug
      }
    });

    revalidatePath('/admin/categories');
    
    return { success: true, category };
  } catch (error) {
    console.error("Error creating category:", error);
    return { success: false, error: "Failed to create category" };
  }
}

// Update an existing category
export async function updateCategory(categoryId: string, formData: CategoryFormData) {
  try {
    const { name } = formData;
    const slug = formData.slug || generateSlug(name);

    const category = await prisma.category.update({
      where: { id: categoryId },
      data: {
        name,
        slug
      }
    });

    revalidatePath('/admin/categories');
    
    return { success: true, category };
  } catch (error) {
    console.error("Error updating category:", error);
    return { success: false, error: "Failed to update category" };
  }
}

// Delete a category
export async function deleteCategory(categoryId: string) {
  try {
    // Check if the category has any posts
    const postCount = await prisma.post.count({
      where: { categoryId }
    });

    if (postCount > 0) {
      return { 
        success: false, 
        error: "Cannot delete category that has posts. Reassign or delete the posts first." 
      };
    }

    await prisma.category.delete({
      where: { id: categoryId }
    });

    revalidatePath('/admin/categories');
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { success: false, error: "Failed to delete category" };
  }
}
