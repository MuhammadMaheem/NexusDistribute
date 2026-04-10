import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, createAccessToken, createRefreshToken, setAuthCookies } from '@/lib/auth';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        shop: {
          select: {
            id: true,
            registrationStatus: true,
            isActive: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Verify password
    const validPassword = await verifyPassword(password, user.password_hash);
    if (!validPassword) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Check if shop registration is pending
    if (user.role === 'shop' && user.shop?.registrationStatus === 'pending') {
      return NextResponse.json(
        {
          error:
            'Your shop registration is still pending approval. Please wait for admin approval.',
        },
        { status: 403 }
      );
    }

    // Check if shop registration was rejected
    if (user.role === 'shop' && user.shop?.registrationStatus === 'rejected') {
      return NextResponse.json(
        { error: 'Your shop registration was rejected. Please contact support.' },
        { status: 403 }
      );
    }

    // Check if account is active
    if (!user.is_active) {
      return NextResponse.json(
        { error: 'Your account has been deactivated. Please contact support.' },
        { status: 403 }
      );
    }

    // Create tokens
    const tokenPayload = {
      userId: user.id,
      role: user.role as 'admin' | 'shop' | 'delivery',
      email: user.email,
      shopId: user.shop?.id,
    };

    const accessToken = await createAccessToken(tokenPayload);
    const refreshToken = await createRefreshToken(tokenPayload);

    // Set cookies
    await setAuthCookies(accessToken, refreshToken);

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { last_login_at: new Date() },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
