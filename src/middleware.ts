import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createSlug } from './lib/utils';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only handle category pages
  if (pathname.startsWith('/category/')) {
    const categoryName = pathname.split('/')[2];
    const normalizedSlug = createSlug(decodeURIComponent(categoryName));

    // If the URL isn't properly slugified, redirect to the correct format
    if (categoryName !== normalizedSlug) {
      const url = request.nextUrl.clone();
      url.pathname = `/category/${normalizedSlug}`;
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/category/:path*',
}; 