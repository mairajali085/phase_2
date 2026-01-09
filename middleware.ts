import { NextRequest, NextResponse } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Define public routes that don't require authentication
  const publicPaths = ['/login', '/register'];
  const isPublicPath = publicPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  );

  // Get the auth token from cookies
  const token = request.cookies.get('auth-token')?.value;

  // If user is not authenticated and trying to access a protected route
  if (!token && !isPublicPath) {
    // Redirect to login page
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If user is authenticated and trying to access login/register pages, redirect to todos
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL('/todos', request.url));
  }

  // Continue with the request
  return NextResponse.next();
}

// See "Matching Paths" to learn more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matching-paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}