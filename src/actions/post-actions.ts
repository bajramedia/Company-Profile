"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

// Interface for blog post creation/update
interface PostFormData {
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
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, '-');
}

// Create a new blog post
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

    // Create the post with prisma
    const post = await prisma.post.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        featuredImage,
        published,
        readTime,
        authorId,
        categoryId,
        tags: {
          create: tags.map(tagId => ({
            tag: {
              connect: { id: tagId }
            }
          }))
        }
      }
    });

    // Revalidate paths to update cached data
    revalidatePath('/blog');
    revalidatePath(`/blog/${slug}`);
    
    return { success: true, post };
  } catch (error) {
    console.error("Error creating post:", error);
    return { success: false, error: "Failed to create post" };
  }
}

// Update an existing blog post
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

    // First, delete existing tag relations
    await prisma.postTags.deleteMany({
      where: { postId }
    });

    // Update the post with prisma
    const post = await prisma.post.update({
      where: { id: postId },
      data: {
        title,
        slug,
        excerpt,
        content,
        featuredImage,
        published,
        readTime,
        authorId,
        categoryId,
        tags: {
          create: tags.map(tagId => ({
            tag: {
              connect: { id: tagId }
            }
          }))
        }
      }
    });

    // Revalidate paths to update cached data
    revalidatePath('/blog');
    revalidatePath(`/blog/${slug}`);
    
    return { success: true, post };
  } catch (error) {
    console.error("Error updating post:", error);
    return { success: false, error: "Failed to update post" };
  }
}

// Delete a blog post
export async function deletePost(postId: string) {
  try {
    // First delete all related data in the correct order
    
    // 1. Delete related post views (analytics data)
    await prisma.postView.deleteMany({
      where: { postId }
    });
    
    // 2. Delete related tags (many-to-many relationship)
    await prisma.postTags.deleteMany({
      where: { postId }
    });
    
    // 3. Finally delete the post itself
    await prisma.post.delete({
      where: { id: postId }
    });

    // Revalidate the blog path
    revalidatePath('/blog');
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting post:", error);
    return { success: false, error: "Failed to delete post" };
  }
}

// Publish or unpublish a post
export async function togglePublishPost(postId: string) {
  try {
    // Get the current post
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { published: true, slug: true }
    });

    if (!post) {
      return { success: false, error: "Post not found" };
    }

    // Toggle publish status
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { published: !post.published }
    });

    // Revalidate paths to update cached data
    revalidatePath('/blog');
    revalidatePath(`/blog/${post.slug}`);
    
    return { success: true, post: updatedPost };
  } catch (error) {
    console.error("Error toggling post publish status:", error);
    return { success: false, error: "Failed to update post" };
  }
}
