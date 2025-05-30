"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Interface for author creation/update
interface AuthorFormData {
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
}

// Create a new author
export async function createAuthor(formData: AuthorFormData) {
  try {
    const { name, email, avatar, bio } = formData;

    const author = await prisma.author.create({
      data: {
        name,
        email,
        avatar,
        bio
      }
    });

    revalidatePath('/admin/authors');
    
    return { success: true, author };
  } catch (error) {
    console.error("Error creating author:", error);
    return { success: false, error: "Failed to create author" };
  }
}

// Update an existing author
export async function updateAuthor(authorId: string, formData: AuthorFormData) {
  try {
    const { name, email, avatar, bio } = formData;

    const author = await prisma.author.update({
      where: { id: authorId },
      data: {
        name,
        email,
        avatar,
        bio
      }
    });

    revalidatePath('/admin/authors');
    
    return { success: true, author };
  } catch (error) {
    console.error("Error updating author:", error);
    return { success: false, error: "Failed to update author" };
  }
}

// Delete an author
export async function deleteAuthor(authorId: string) {
  try {
    // Check if the author has any posts
    const postCount = await prisma.post.count({
      where: { authorId }
    });

    if (postCount > 0) {
      return { 
        success: false, 
        error: "Cannot delete author who has posts. Reassign or delete the posts first." 
      };
    }

    await prisma.author.delete({
      where: { id: authorId }
    });

    revalidatePath('/admin/authors');
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting author:", error);
    return { success: false, error: "Failed to delete author" };
  }
}
