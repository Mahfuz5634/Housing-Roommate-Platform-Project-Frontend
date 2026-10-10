import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/request';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('role')?.value;

  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register');
  const isAdminRoute = pathname.startsWith('/admin');
  const isLandlordRoute = pathname.startsWith('/landlord');
  const isTenantRoute = pathname.startsWith('/dashboard');

  // 1. If already logged in and visiting login/register, redirect to appropriate role dashboard
  if (isAuthRoute && token && role) {
    if (role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    if (role === 'LANDLORD') {
      return NextResponse.redirect(new URL('/landlord', request.url));
    }
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 2. Admin routes protection
  if (isAdminRoute) {
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (role !== 'ADMIN') {
      // Landlord or Tenant trying to access admin
      const targetUrl = role === 'LANDLORD' ? '/landlord' : '/dashboard';
      return NextResponse.redirect(new URL(targetUrl, request.url));
    }
  }

  // 3. Landlord routes protection
  if (isLandlordRoute) {
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (role !== 'LANDLORD' && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // 4. Tenant dashboard routes protection
  if (isTenantRoute) {
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/landlord/:path*',
    '/dashboard/:path*',
    '/login',
    '/register',
  ],
};
