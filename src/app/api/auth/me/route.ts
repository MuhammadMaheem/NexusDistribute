import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerAuthSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerAuthSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: {
        shop: {
          select: {
            id: true,
            shopName: true,
            balance: true,
            creditLimit: true,
            paymentDeadline: true,
          },
        },
        deliveryPerson: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        shopId: user.shop?.id ?? null,
        shopName: user.shop?.shopName ?? null,
        shopBalance: user.shop?.balance?.toString() ?? null,
        shopCreditLimit: user.shop?.creditLimit?.toString() ?? null,
        shopPaymentDeadline: user.shop?.paymentDeadline
          ? user.shop.paymentDeadline.toISOString()
          : null,
        deliveryPersonId: user.deliveryPerson?.id ?? null,
      },
    });
  } catch (error) {
    console.error('Auth me error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
