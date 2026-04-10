import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-change-in-production'
);

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

export type UserRole = 'admin' | 'shop' | 'delivery';

export interface TokenPayload extends JWTPayload {
  userId: string;
  role: UserRole;
  email: string;
  shopId?: string;
}

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// JWT Token creation
export async function createAccessToken(payload: TokenPayload): Promise<string> {
  const token = await new SignJWT({
    userId: payload.userId,
    role: payload.role,
    email: payload.email,
    shopId: payload.shopId,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRY)
    .setSubject(payload.userId)
    .sign(JWT_SECRET);

  return token;
}

export async function createRefreshToken(payload: TokenPayload): Promise<string> {
  const token = await new SignJWT({
    userId: payload.userId,
    role: payload.role,
    email: payload.email,
    shopId: payload.shopId,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_EXPIRY)
    .setSubject(payload.userId)
    .sign(JWT_SECRET);

  return token;
}

// JWT Token verification
export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as TokenPayload;
  } catch {
    return null;
  }
}

// Cookie management
export async function setAuthCookies(accessToken: string, refreshToken: string) {
  const cookieStore = await cookies();

  cookieStore.set('access_token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60, // 15 minutes
    path: '/',
  });

  cookieStore.set('refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();

  cookieStore.set('access_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });

  cookieStore.set('refresh_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });
}

// Get current user from request (Middleware / API)
export async function getCurrentUser(request: NextRequest): Promise<TokenPayload | null> {
  const token = request.cookies.get('access_token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

// Get current user from cookies (Server Components / Actions)
export async function getServerAuthSession(): Promise<TokenPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;
    if (!token) return null;
    return verifyToken(token);
  } catch (error) {
    console.error('Error getting server auth session:', error);
    return null;
  }
}

// Role-based authorization helper
export function requireRole(user: TokenPayload | null, roles: UserRole[]): UserRole {
  if (!user) {
    throw new Error('Unauthorized');
  }
  if (!roles.includes(user.role as UserRole)) {
    throw new Error('Forbidden');
  }
  return user.role;
}
