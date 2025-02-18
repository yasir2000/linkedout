import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicPaths = ['/', '/login'];

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('auth_token');
  const isPublicPath = publicPaths.includes(request.nextUrl.pathname);

  console.log('Middleware check:', {
    path: request.nextUrl.pathname,
    isPublicPath,
    hasCookie: !!authCookie?.value,
    cookieValue: authCookie?.value?.substring(0, 10) + '...'
  });

  if (!authCookie?.value && !isPublicPath) {
    console.log('Redirecting to login - no cookie');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (authCookie?.value && request.nextUrl.pathname === '/login') {
    console.log('Redirecting to inbox - has cookie');
    return NextResponse.redirect(new URL('/inbox', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 