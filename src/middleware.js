import { NextResponse } from 'next/server';
import { decodeJWT } from './lib/auth';

export async function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  const protectedRoutes = [
    '/admin',
    '/bendahara',
    '/sekretaris',
    '/api/private'
  ];

  const isProtected = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  if (isProtected) {
    if (!token) {
      if (pathname.startsWith('/api')) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return NextResponse.redirect(new URL('/authentication/sign-in', request.url));
    }

    const decoded = decodeJWT(token);
    if (!decoded) {
      const response = NextResponse.redirect(new URL('/authentication/sign-in', request.url));
      response.cookies.delete('token');
      return response;
    }

    if (decoded.exp && decoded.exp < Date.now() / 1000) {
      const response = NextResponse.redirect(new URL('/authentication/sign-in', request.url));
      response.cookies.delete('token');
      return response;
    }

    // Authorization check
    if (pathname.startsWith('/admin') && decoded.role_id !== 'ROLE000') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    // Allow ROLE000 to access /bendahara and /sekretaris, otherwise check specific roles
    if (pathname.startsWith('/bendahara') && decoded.role_id !== 'ROLE000' && decoded.role_id !== 'ROLE001') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    if (pathname.startsWith('/sekretaris') && decoded.role_id !== 'ROLE000' && decoded.role_id !== 'ROLE002') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    // Tambahkan header untuk API routes
    if (pathname.startsWith('/api')) {
      const response = NextResponse.next();
      response.headers.set('X-User-Role', decoded.role_id);
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|login|images|icons|fonts).*)',
  ],
};