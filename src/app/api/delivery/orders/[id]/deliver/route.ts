import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerAuthSession } from '@/lib/auth';
import { uploadImage } from '@/lib/storage';

type RouteContext = {
  params: Promise<{ id: string }>;
};

function parseCoordinate(value: FormDataEntryValue | null, min: number, max: number) {
  if (typeof value !== 'string') {
    return null;
  }

  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed) || parsed < min || parsed > max) {
    return null;
  }

  return parsed;
}

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

    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json(
        { error: 'Invalid payload. Use multipart/form-data.' },
        { status: 400 }
      );
    }

    const proofImage = formData.get('proofImage');
    const proofGpsLat = parseCoordinate(formData.get('proofGpsLat'), -90, 90);
    const proofGpsLng = parseCoordinate(formData.get('proofGpsLng'), -180, 180);
    const notesValue = formData.get('notes');
    const notes = typeof notesValue === 'string' ? notesValue.trim() : '';

    if (!(proofImage instanceof File) || proofImage.size === 0) {
      return NextResponse.json({ error: 'Proof image is required' }, { status: 400 });
    }

    if (proofGpsLat === null || proofGpsLng === null) {
      return NextResponse.json({ error: 'Valid GPS coordinates are required' }, { status: 400 });
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

    const assignment = order.deliveryAssignment;

    if (assignment.status !== 'picked_up') {
      return NextResponse.json(
        { error: 'Order must be picked up before delivery' },
        { status: 409 }
      );
    }

    const fileBuffer = Buffer.from(await proofImage.arrayBuffer());
    const proofImageUrl = await uploadImage(fileBuffer, 'nexus-distribute/delivery-proofs');

    await prisma.$transaction(async (tx) => {
      await tx.deliveryAssignment.update({
        where: { orderId: id },
        data: {
          status: 'delivered',
          deliveredAt: new Date(),
          proofImageUrl,
          proofGpsLat,
          proofGpsLng,
          deliveryNotes: notes.length > 0 ? notes : assignment.deliveryNotes,
        },
      });

      await tx.order.update({
        where: { id },
        data: {
          status: 'delivered',
          deliveredAt: new Date(),
        },
      });
    });

    return NextResponse.json({ success: true, proofImageUrl });
  } catch (error) {
    console.error('Delivery deliver PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
