"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Interface for tag creation/update
interface TagFormData {
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

// Create a new tag
export async function createTag(formData: TagFormData) {
  try {
    const { name } = formData;
    const slug = formData.slug || generateSlug(name);

    const tag = await prisma.tag.create({
      data: {
        name,
        slug
      }
    });

    revalidatePath('/admin/tags');
    
    return { success: true, tag };
  } catch (error) {
    console.error("Error creating tag:", error);
    return { success: false, error: "Failed to create tag" };
  }
}

// Update an existing tag
export async function updateTag(tagId: string, formData: TagFormData) {
  try {
    const { name } = formData;
    const slug = formData.slug || generateSlug(name);

    const tag = await prisma.tag.update({
      where: { id: tagId },
      data: {
        name,
        slug
      }
    });

    revalidatePath('/admin/tags');
    
    return { success: true, tag };
  } catch (error) {
    console.error("Error updating tag:", error);
    return { success: false, error: "Failed to update tag" };
  }
}

// Delete a tag
export async function deleteTag(tagId: string) {
  try {
    // First delete the post-tag relations
    await prisma.postTags.deleteMany({
      where: { tagId }
    });

    // Then delete the tag
    await prisma.tag.delete({
      where: { id: tagId }
    });

    revalidatePath('/admin/tags');
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting tag:", error);
    return { success: false, error: "Failed to delete tag" };
  }
}
