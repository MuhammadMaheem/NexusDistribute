import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerAuthSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerAuthSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (session.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const [shops, total] = await Promise.all([
      prisma.shop.findMany({
        include: {
          _count: {
            select: { orders: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.shop.count(),
    ]);

    return NextResponse.json({ shops, total });
  } catch (error) {
    console.error('Shops GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
