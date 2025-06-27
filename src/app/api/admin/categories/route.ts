import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://bajramedia.com/api_bridge.php';

// Local fallback categories storage (untuk development/testing)
let localCategories = [
  { id: 'cat1', name: 'Technology', slug: 'technology', postCount: 0 },
  { id: 'cat2', name: 'Web Design', slug: 'web-design', postCount: 0 },
  { id: 'cat3', name: 'Mobile Design', slug: 'mobile-design', postCount: 0 },
  { id: 'cat4', name: 'Game Development', slug: 'game-development', postCount: 0 }
];

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}?endpoint=categories`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const categories = await response.json();
    
    // Add postCount (for now set to 0, can be enhanced later)
    const formattedCategories = categories.map((category: any) => ({
      ...category,
      postCount: 0 // TODO: Get actual post count from API
    }));
    
    return NextResponse.json(formattedCategories);
  } catch (error) {
    console.error('Error fetching categories from API bridge, using local fallback:', error);
    // Return local fallback categories if API bridge fails
    return NextResponse.json(localCategories);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Categories POST - Request body:', body);
    
    const { name, slug, description } = body;

    // Validate required fields
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const categoryData = {
      name: name.trim(),
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description: description || ''
    };

    console.log('Categories POST - Sending to API bridge:', categoryData);

    try {
      // Try to create category via external API bridge
      const response = await fetch(`${API_BASE_URL}?endpoint=categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData)
      });

      console.log('Categories POST - API bridge response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Categories POST - API bridge error response:', errorText);
        throw new Error(`API Bridge error: ${response.status}`);
      }

      const responseText = await response.text();
      console.log('Categories POST - Raw API bridge response:', responseText);

      // Check if response is empty or invalid
      if (!responseText || !responseText.trim()) {
        throw new Error('Empty response from API bridge');
      }

      let result;
      try {
        result = JSON.parse(responseText);
        console.log('Categories POST - Parsed API bridge response:', result);
      } catch (parseError) {
        console.error('Categories POST - JSON parse error:', parseError);
        throw new Error('Invalid JSON response from API bridge');
      }

      if (!result || !result.success) {
        const errorMsg = result?.error || 'Failed to create category';
        throw new Error(errorMsg);
      }

      const newCategory = { 
        id: result.id || Date.now().toString(),
        name: categoryData.name,
        slug: categoryData.slug,
        description: categoryData.description || undefined,
        postCount: 0
      };

      console.log('Categories POST - API bridge success:', newCategory);
      return NextResponse.json({ 
        success: true, 
        category: newCategory
      }, { status: 201 });

    } catch (apiError) {
      console.error('Categories POST - API bridge failed, using local fallback:', apiError);
      
      // Fallback: Add to local storage
      const newCategory = {
        id: `cat${Date.now()}`,
        name: categoryData.name,
        slug: categoryData.slug,
        postCount: 0
      };

      localCategories.push(newCategory);
      
      console.log('Categories POST - Local fallback success:', newCategory);
      return NextResponse.json({ 
        success: true, 
        category: newCategory,
        source: 'local_fallback'
      }, { status: 201 });
    }

  } catch (error) {
    console.error('Categories POST - Fatal error:', error);
    
    // Return more specific error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { 
        error: 'Failed to create category',
        details: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, slug, description } = body;

    if (!id || !name) {
      return NextResponse.json(
        { error: 'ID and name are required' },
        { status: 400 }
      );
    }

    try {
      // Try external API first
      const response = await fetch(`${API_BASE_URL}?endpoint=categories&id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, slug, description })
      });

      if (response.ok) {
        const result = await response.json();
        return NextResponse.json({ success: true, category: result });
      }
    } catch (apiError) {
      console.error('Update category via API failed, using local fallback:', apiError);
    }

    // Fallback: Update local storage
    const categoryIndex = localCategories.findIndex(cat => cat.id === id);
    if (categoryIndex !== -1) {
      localCategories[categoryIndex] = {
        ...localCategories[categoryIndex],
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      };
      
      return NextResponse.json({ 
        success: true, 
        category: localCategories[categoryIndex],
        source: 'local_fallback'
      });
    }

    return NextResponse.json(
      { error: 'Category not found' },
      { status: 404 }
    );

  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    try {
      // Try external API first
      const response = await fetch(`${API_BASE_URL}?endpoint=categories&id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        return NextResponse.json({ success: true });
      }
    } catch (apiError) {
      console.error('Delete category via API failed, using local fallback:', apiError);
    }

    // Fallback: Remove from local storage
    const categoryIndex = localCategories.findIndex(cat => cat.id === id);
    if (categoryIndex !== -1) {
      localCategories.splice(categoryIndex, 1);
      return NextResponse.json({ 
        success: true,
        source: 'local_fallback'
      });
    }

    return NextResponse.json(
      { error: 'Category not found' },
      { status: 404 }
    );

  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}
