import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerAuthSession } from '@/lib/auth';

type RouteContext = {
  params: Promise<{ id: string }>;
};

async function resolveDeliveryPersonId(userId: string) {
  const deliveryPerson = await prisma.deliveryPerson.findUnique({
    where: { userId },
    select: { id: true },
  });

  return deliveryPerson?.id ?? null;
}

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const session = await getServerAuthSession();
    if (!session || session.role !== 'delivery') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const deliveryPersonId = await resolveDeliveryPersonId(session.userId);
    if (!deliveryPersonId) {
      return NextResponse.json({ error: 'Delivery account not found' }, { status: 404 });
    }

    const order = await prisma.order.findFirst({
      where: {
        id,
        deliveryAssignment: {
          is: {
            deliveryPersonId,
          },
        },
      },
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
        items: {
          include: {
            product: {
              select: { name: true },
            },
          },
        },
        deliveryAssignment: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Delivery order GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const session = await getServerAuthSession();
    if (!session || session.role !== 'delivery') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const deliveryPersonId = await resolveDeliveryPersonId(session.userId);
    if (!deliveryPersonId) {
      return NextResponse.json({ error: 'Delivery account not found' }, { status: 404 });
    }

    const body = await request.json().catch(() => ({}));
    const action = body.action as 'pickup' | 'deliver';
    const notes = typeof body.notes === 'string' ? body.notes : undefined;

    if (!action || !['pickup', 'deliver'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const order = await prisma.order.findFirst({
      where: {
        id,
        deliveryAssignment: {
          is: {
            deliveryPersonId,
          },
        },
      },
      include: {
        deliveryAssignment: true,
      },
    });

    if (!order || !order.deliveryAssignment) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (action === 'pickup') {
      await prisma.deliveryAssignment.update({
        where: { orderId: id },
        data: {
          status: 'picked_up',
          pickedUpAt: new Date(),
          deliveryNotes: notes ?? order.deliveryAssignment.deliveryNotes,
        },
      });

      await prisma.order.update({
        where: { id },
        data: { status: 'out_for_delivery' },
      });
    }

    if (action === 'deliver') {
      await prisma.deliveryAssignment.update({
        where: { orderId: id },
        data: {
          status: 'delivered',
          deliveredAt: new Date(),
          deliveryNotes: notes ?? order.deliveryAssignment.deliveryNotes,
        },
      });

      await prisma.order.update({
        where: { id },
        data: { status: 'delivered', deliveredAt: new Date() },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delivery order PATCH error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
