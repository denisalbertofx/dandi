import { NextResponse } from 'next/server';

export function middleware(request) {
  if (request.nextUrl.pathname.startsWith('/dashboard/protected')) {
    const apiKey = request.cookies.get('apiKey')?.value || request.headers.get('x-api-key');

    if (!apiKey) {
      return NextResponse.redirect(new URL('/dashboard/playground', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/dashboard/protected/:path*'
};
