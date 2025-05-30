import { NextRequest, NextResponse } from 'next/server';

// This is a simple middleware to protect admin routes with basic authentication
// In a production environment, you would want to use a more secure authentication system
export function middleware(request: NextRequest) {
  const adminLoginPath = '/admin/login';
  const currentPath = request.nextUrl.pathname;
  
  // Skip middleware for login page
  if (currentPath === adminLoginPath) {
    return NextResponse.next();
  }
  
  // Simple check for auth cookie
  const authCookie = request.cookies.get('admin_auth');
  
  // If no auth cookie and trying to access admin page, redirect to login
  if (!authCookie && currentPath.startsWith('/admin')) {
    const url = request.nextUrl.clone();
    url.pathname = adminLoginPath;
    url.searchParams.set('returnUrl', currentPath);
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

// Only run this middleware on admin routes
export const config = {
  matcher: '/admin/:path*',
};
