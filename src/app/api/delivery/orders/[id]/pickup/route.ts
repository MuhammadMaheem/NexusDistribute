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

export async function PUT(request: NextRequest, context: RouteContext) {
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
    const notes = typeof body.notes === 'string' ? body.notes.trim() : '';

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

    const assignment = order.deliveryAssignment;

    if (assignment.status === 'delivered') {
      return NextResponse.json({ error: 'Order already delivered' }, { status: 409 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.deliveryAssignment.update({
        where: { orderId: id },
        data: {
          status: 'picked_up',
          pickedUpAt: assignment.pickedUpAt ?? new Date(),
          deliveryNotes: notes.length > 0 ? notes : assignment.deliveryNotes,
        },
      });

      await tx.order.update({
        where: { id },
        data: {
          status: 'out_for_delivery',
        },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delivery pickup PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
