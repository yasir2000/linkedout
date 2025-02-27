import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicPaths = ['/', '/login'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
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