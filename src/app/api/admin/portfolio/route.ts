import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = 'https://www.bajramedia.com/api_bridge.php';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    console.log('Portfolio API: Fetching from production database...'); 
    const response = await fetch(`${API_BASE_URL}?endpoint=portfolio&page=${page}&limit=${limit}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

      const portfolio = await response.json();

    // Format portfolio items with proper structure
    const formattedPortfolio = portfolio.map((item: any) => ({
          id: item.id,
          title: item.title,
          slug: item.slug,
          description: item.description,
          content: item.content,
          featuredImage: item.featuredImage,
      projectUrl: item.projectUrl || item.project_url,
      githubUrl: item.githubUrl || item.github_url,
      technologies: item.technologies || [],
      client: item.client,
      duration: item.duration,
      published: item.published === "1" || item.published === 1 || item.published === true,
          featured: item.featured === "1" || item.featured === 1 || item.featured === true,
          category: {
        id: item.categoryId,
            name: item.categoryName || "Uncategorized",
            slug: item.categorySlug || "uncategorized"
          },
      tags: item.tags || [],
      createdAt: item.createdAt || item.date,
      updatedAt: item.updatedAt
        }));

        console.log('Portfolio API: Database success');
        return NextResponse.json({
          portfolio: formattedPortfolio,
          total: formattedPortfolio.length,
          page,
      limit,
      totalPages: Math.ceil(formattedPortfolio.length / limit)
    });
    
  } catch (error) {
    console.error('Portfolio API: Database connection failed:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch portfolio from database',
        message: 'Please check if portfolio table exists in bajx7634_bajra database',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Portfolio API: Creating new entry in database...');

    const portfolioData = {
      title: body.title || "",
      slug: body.slug || "",
      description: body.description || "",
      content: body.content || "",
      featuredImage: body.featuredImage || "",
      projectUrl: body.projectUrl || "",
      githubUrl: body.githubUrl || "",
      technologies: body.technologies || [],
      client: body.client || "",
      duration: body.duration || "",
      published: body.published === true || body.published === "true" || body.published === 1,
      featured: body.featured === true || body.featured === "true" || body.featured === 1,
      categoryId: body.categoryId || body.category?.id,
      tags: body.tagIds || body.tags || []
    };

      const response = await fetch(`${API_BASE_URL}?endpoint=portfolio`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
        body: JSON.stringify(portfolioData)
      });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Portfolio API: Database entry created successfully');
    return NextResponse.json({ 
      success: true, 
      id: result.id,
      message: "Portfolio created successfully"
    });

  } catch (error) {
    console.error('Portfolio API: Database creation failed:', error);
    return NextResponse.json(
      { error: "Failed to create portfolio in database" },
      { status: 500 }
    );
  }
} 
