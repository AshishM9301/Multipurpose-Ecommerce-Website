import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getUserRole, verifyToken } from './app/api/auth/route';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('authToken')?.value;
  const adminToken = request.cookies.get('adminToken')?.value;

  // Admin and seller routes
  if (request.nextUrl.pathname.startsWith('/admin') || request.nextUrl.pathname.startsWith('/seller')) {
    if (!adminToken) {
      return NextResponse.redirect(new URL('/admin-login', request.url));
    }

    try {
      const userId = await verifyToken(adminToken);
      const role = await getUserRole(userId?.toString() || '');

      if (!['admin', 'super_admin', 'seller'].includes(role)) {
        return NextResponse.redirect(new URL('/', request.url));
      }

      // Add role to request headers for use in API routes
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('X-User-Role', role);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      return NextResponse.redirect(new URL('/admin-login', request.url));
    }
  }

  // Customer routes that require authentication
  if (request.nextUrl.pathname.startsWith('/account') || request.nextUrl.pathname.startsWith('/orders')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const userId = await verifyToken(token);
      const role = await getUserRole(userId?.toString() || '');

      // Add role to request headers for use in API routes
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('X-User-Role', role);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}



export const config = {
  matcher: ['/admin/:path*', '/seller/:path*', '/account/:path*', '/orders/:path*'],
};