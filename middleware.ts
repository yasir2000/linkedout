import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicPaths = ['/', '/login'];
// Add a pattern for static files
const staticFilePattern = /\.(jpg|jpeg|png|gif|svg|ico|css|js)$/;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for static files
  if (staticFilePattern.test(pathname)) {
    return NextResponse.next();
  }
  
  const authCookie = request.cookies.get('auth_token');
  const isPublicPath = publicPaths.includes(pathname);

  if (!authCookie?.value && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (authCookie?.value && pathname === '/login') {
    return NextResponse.redirect(new URL('/inbox', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 