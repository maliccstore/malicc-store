import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Check if we're on an admin path
    if (request.nextUrl.pathname.startsWith('/admin')) {
        const token = request.cookies.get('auth-token');

        // If no token exists, redirect to login
        if (!token) {
            const loginUrl = new URL('/auth/login', request.url);
            // Optional: Add return URL parameter
            // loginUrl.searchParams.set('returnUrl', request.nextUrl.pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/admin/:path*',
};
