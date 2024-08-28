import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = await fetch(`${request.nextUrl.origin}/api/auth`, {
    headers: {
      Cookie: request.headers.get('cookie') || '',
    },
  });

  const data = await response.json();

  if (!data.isAuthenticated) {
    return NextResponse.redirect(new URL('/member-login', request.url));
  }

  // Add role-based routing logic here if needed

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/seller/:path*', '/account/:path*'],
};