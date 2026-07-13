import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow login page and API routes
  if (pathname === '/login' || pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Check for session cookie
  const session = request.cookies.get('admin_session');
  if (!session?.value) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Basic validation of the token
  try {
    const decoded = Buffer.from(session.value, 'base64').toString('utf-8');
    const secret = process.env.SESSION_SECRET || 'default-session-secret';
    if (!decoded.startsWith(`authenticated:${secret}:`)) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  } catch {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
