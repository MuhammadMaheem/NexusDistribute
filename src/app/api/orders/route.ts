import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { getServerAuthSession } from '@/lib/auth';

// GET - Shop's orders
export async function GET(request: NextRequest) {
  try {
    const session = await getServerAuthSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    let shopId = searchParams.get('shopId');

    if (session.role === 'shop') {
      if (session.shopId) {
        shopId = session.shopId;
      } else {
        const shop = await prisma.shop.findUnique({
          where: { userId: session.userId },
          select: { id: true },
        });

        if (!shop) {
          return NextResponse.json({ error: 'Shop account not found' }, { status: 404 });
        }

        shopId = shop.id;
      }
    }

    if (!shopId) {
      return NextResponse.json({ error: 'Shop ID required' }, { status: 400 });
    }

    const orders = await prisma.order.findMany({
      where: { shopId },
      include: {
        items: {
          include: {
            product: {
              select: { name: true },
            },
          },
        },
      },
      orderBy: { placedAt: 'desc' },
    });

    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Place order
const orderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().positive(),
      })
    )
    .min(1),
  paymentType: z.enum(['pay_now', 'bnpl']),
  discountCode: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerAuthSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.role !== 'shop') {
      return NextResponse.json({ error: 'Only shops can place orders' }, { status: 403 });
    }

    const body = await request.json();
    const { items, paymentType, discountCode } = orderSchema.parse(body);

    const shop = session.shopId
      ? await prisma.shop.findUnique({ where: { id: session.shopId } })
      : await prisma.shop.findUnique({ where: { userId: session.userId } });

    if (!shop) {
      return NextResponse.json({ error: 'Shop account not found' }, { status: 404 });
    }

    const shopId = shop.id;

    // Check if shop can order
    const { canPlaceOrder } = await import('@/lib/balance-engine');
    // Calculate order total
    let total = 0;
    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (product) {
        total += parseFloat(product.currentPrice.toString()) * item.quantity;
      }
    }

    const orderCheck = await canPlaceOrder(shopId, total);

    if (!orderCheck.canOrder) {
      return NextResponse.json({ error: orderCheck.reason }, { status: 403 });
    }

    // Create order in transaction
    const order = await prisma.$transaction(async (tx) => {
      const status = orderCheck.requiresReview ? 'admin_review' : 'pending';

      const newOrder = await tx.order.create({
        data: {
          shopId,
          status,
          paymentType,
          totalAmount: total,
        },
      });

      // Create order items
      for (const item of items) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        if (!product) continue;

        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPriceAtOrder: product.currentPrice,
            subtotal: parseFloat(product.currentPrice.toString()) * item.quantity,
          },
        });

        // Reserve stock
        await tx.product.update({
          where: { id: item.productId },
          data: { stockQuantity: { decrement: item.quantity } },
        });
      }

      // If BNPL and approved, update balance
      if (paymentType === 'bnpl' && !orderCheck.requiresReview) {
        await tx.shop.update({
          where: { id: shopId },
          data: { balance: { increment: total } },
        });

        await tx.balanceLedger.create({
          data: {
            shopId,
            type: 'debit',
            amount: total,
            balanceAfter: parseFloat(shop.balance.toString()) + total,
            referenceType: 'order',
            referenceId: newOrder.id,
          },
        });
      }

      // If requires review, create review queue entry
      if (orderCheck.requiresReview) {
        await tx.adminReviewQueue.create({
          data: {
            orderId: newOrder.id,
            shopId,
            reason: `Order total Rs ${total.toLocaleString()} would exceed credit limit`,
            balanceAtRequest: parseFloat(shop.balance.toString()),
            orderTotal: total,
            projectedBalance: orderCheck.projectedBalance,
          },
        });
      }

      return {
        ...newOrder,
        requiresReview: orderCheck.requiresReview,
        projectedBalance: orderCheck.projectedBalance,
      };
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.issues }, { status: 400 });
    }
    console.error('Order POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
