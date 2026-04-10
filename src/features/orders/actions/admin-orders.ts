'use server';

import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { updateBalance } from "@/lib/balance-engine";
import { createNotification } from "@/lib/notifications";

export async function getAdminOrders(options: {
  status?: OrderStatus;
  shopId?: string;
  limit?: number;
  offset?: number;
} = {}) {
  const { status, shopId, limit = 20, offset = 0 } = options;

  const where: any = {};
  if (status) where.status = status;
  if (shopId) where.shopId = shopId;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        shop: true,
        _count: { select: { items: true } },
      },
      orderBy: { placedAt: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.order.count({ where }),
  ]);

  return {
    orders: orders.map(o => ({
      ...o,
      totalAmount: Number(o.totalAmount),
    })),
    total,
  };
}

export async function updateOrderStatus(orderId: string, status: OrderStatus, note?: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { shop: true },
  });

  if (!order) throw new Error("Order not found");

  const oldStatus = order.status;

  // Transaction for status update and related side effects
  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: orderId },
      data: { 
        status,
        notes: note ? `${order.notes || ""}\nUpdate: ${note}` : order.notes,
      },
    });

    // Special logic for Approvals (Transitioning from admin_review to pending)
    if (oldStatus === "admin_review" && status === "pending") {
       await updateBalance({
         shopId: order.shopId,
         type: "debit",
         amount: order.totalAmount,
         referenceType: "order",
         referenceId: order.id,
         note: `Order #${order.id.slice(0, 8)} approved by admin.`,
       });
    }

    // Notify the shop
    await createNotification({
      recipientRole: "shop",
      recipientId: order.shop.userId,
      type: `order_${status.toLowerCase()}` as any,
      title: `Order Status Updated`,
      body: `Your order #${order.id.slice(0, 8)} is now ${status.replace(/_/g, " ")}.`,
      referenceType: "order",
      referenceId: order.id,
      pusherChannel: `shop-${order.shopId}`,
    });
  });

  revalidatePath("/admin/orders");
  revalidatePath("/admin/dashboard");
  revalidatePath("/shop/dashboard");
  revalidatePath("/shop/orders");

  return { success: true };
}
