import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerAuthSession } from '@/lib/auth';

async function resolveDeliveryPersonId(userId: string) {
  const deliveryPerson = await prisma.deliveryPerson.findUnique({
    where: { userId },
    select: { id: true },
  });

  return deliveryPerson?.id ?? null;
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerAuthSession();
    if (!session || session.role !== 'delivery') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const deliveryPersonId = await resolveDeliveryPersonId(session.userId);
    if (!deliveryPersonId) {
      return NextResponse.json({ error: 'Delivery account not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where: Record<string, unknown> = {
      deliveryAssignment: {
        is: {
          deliveryPersonId,
        },
      },
    };

    if (status && status !== 'all') {
      where.status = status;
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        shop: {
          select: {
            id: true,
            shopName: true,
            ownerName: true,
            phone: true,
            addressText: true,
            addressLat: true,
            addressLng: true,
          },
        },
        deliveryAssignment: true,
        _count: {
          select: { items: true },
        },
      },
      orderBy: { placedAt: 'asc' },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Delivery orders GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
