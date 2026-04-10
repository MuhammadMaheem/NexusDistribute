import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify, type JWTPayload } from 'jose';

type UserRole = 'admin' | 'shop' | 'delivery';

type MiddlewareTokenPayload = JWTPayload & {
  role: UserRole;
};

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-change-in-production'
);

const rolePaths: Record<string, UserRole[]> = {
  '/admin': ['admin'],
  '/shop': ['shop'],
  '/delivery': ['delivery'],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname === '/login' ||
    pathname === '/register'
  ) {
    return NextResponse.next();
  }

  const requiredRoles = getRequiredRoles(pathname);
  if (!requiredRoles) {
    return NextResponse.next();
  }

  const token = request.cookies.get('access_token')?.value;
  if (!token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  const payload = await verifyToken(token);
  if (!payload) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  if (!requiredRoles.includes(payload.role)) {
    const redirectPath = getRoleDashboard(payload.role);
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  return NextResponse.next();
}

async function verifyToken(token: string): Promise<MiddlewareTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as MiddlewareTokenPayload;
  } catch {
    return null;
  }
}

function getRequiredRoles(pathname: string): UserRole[] | null {
  for (const [path, roles] of Object.entries(rolePaths)) {
    if (pathname.startsWith(path)) {
      return roles;
    }
  }

  return null;
}

function getRoleDashboard(role: UserRole): string {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'shop':
      return '/shop';
    case 'delivery':
      return '/delivery';
    default:
      return '/login';
  }
}

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico|login|register).*)'],
};
