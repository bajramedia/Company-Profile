import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { blogService, BlogPost } from '@/services/BlogService';
import { SEO } from '@/components';
import BlogPostClient from '@/components/BlogPostClient';

// Generate dynamic metadata for each blog post
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  try {
    // Fetch the blog post data
    const { slug } = await params;
    const post = await blogService.getPostBySlug(slug);

    if (!post) {
      return {
        title: 'Post Not Found',
        description: 'The requested blog post could not be found.'
      };
    }

    // Structure the metadata for optimal SEO
    return {
      title: post.title,
      description: post.excerpt,
      keywords: post.tags?.join(', ') || '',
      authors: post.author ? [{ name: typeof post.author === 'object' ? post.author.name : 'Bajramedia' }] : [],
      openGraph: {
        title: post.title,
        description: post.excerpt,
        url: `https://bajramedia.com/blog/${post.slug}`,
        type: 'article',
        publishedTime: post.date,
        authors: typeof post.author === 'object' ? [post.author.name] : ['Bajramedia'],
        tags: post.tags,
        images: [
          {
            url: post.featuredImage,
            width: 1200,
            height: 630,
            alt: post.title,
          }
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.excerpt,
        images: [post.featuredImage],
      },
      alternates: {
        canonical: `https://bajramedia.com/blog/${post.slug}`,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Blog Post | Bajramedia',
      description: 'Read our latest blog post on Bajramedia.'
    };
  }
}

// Pre-render specific blog posts at build time (Static Generation)
export async function generateStaticParams() {
  try {
    const posts = await blogService.getAllPosts();
    return posts.slice(0, 100).map((post: BlogPost) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// The blog post page component (Server Component)
export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let post: BlogPost | null = null;

  try {
    post = await blogService.getPostBySlug(slug);
      } catch (error) {
    console.error('Error fetching blog post:', error);
  }

  if (!post) {
    notFound();
  }

  return (
    <>
      {/* SEO Component for dynamic meta tags */}
      <SEO
        title={post.title}
        description={post.excerpt}
        image={post.featuredImage}
        url={`/blog/${post.slug}`}
        type="article"
        publishedTime={post.date}
        author={typeof post.author === 'object' ? post.author.name : 'Bajramedia'}
        section={typeof post.category === 'object' ? post.category.name : post.category}
        tags={Array.isArray(post.tags) ? post.tags : []}
      />

      {/* Client Component untuk semua interactivity */}
      <BlogPostClient initialPost={post} slug={slug} />
    </>
  );
}
