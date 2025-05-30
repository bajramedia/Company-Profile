import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface Params {
  params: Promise<{
    slug: string;
  }>
}

export async function POST(
  request: NextRequest,
  { params }: Params
) {
  try {
    const { slug } = await params;
    
    // Get client IP and user agent for basic tracking
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : request.headers.get("x-real-ip") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    // Find the post by slug
    const post = await prisma.post.findUnique({
      where: { slug },
      select: { id: true }
    });

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    // Check if this IP has viewed this post in the last hour to prevent spam
    const recentView = await prisma.postView.findFirst({
      where: {
        postId: post.id,
        ipAddress: ip,
        viewedAt: {
          gte: new Date(Date.now() - 60 * 60 * 1000) // 1 hour ago
        }
      }
    });

    // Only count if no recent view from same IP
    if (!recentView) {
      // Create view record
      await prisma.postView.create({
        data: {
          postId: post.id,
          ipAddress: ip,
          userAgent: userAgent
        }
      });

      // Increment post view counter
      await prisma.post.update({
        where: { id: post.id },
        data: {
          views: {
            increment: 1
          }
        }
      });
    }

    // Get updated view count
    const updatedPost = await prisma.post.findUnique({
      where: { slug },
      select: { views: true }
    });

    return NextResponse.json({
      success: true,
      views: updatedPost?.views || 0
    });
  } catch (error) {
    console.error("Error tracking post view:", error);
    return NextResponse.json(
      { error: "Failed to track view" },
      { status: 500 }
    );
  }
}
