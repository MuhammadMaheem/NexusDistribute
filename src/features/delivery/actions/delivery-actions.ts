'use server';

import { prisma } from "@/lib/prisma";
import { getServerAuthSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { createNotification } from "@/lib/notifications";

export async function getAssignedOrders() {
  const session = await getServerAuthSession();
  if (!session || session.role !== "delivery") {
    throw new Error("Unauthorized");
  }

  return prisma.order.findMany({
    where: {
      status: { in: ["processing", "dispatched", "out_for_delivery"] },
      // In a real app, we'd filter by driverId
    },
    include: {
      shop: true,
      _count: { select: { items: true } },
    },
    orderBy: { placedAt: "asc" },
  });
}

export async function markAsDelivered(orderId: string) {
  const session = await getServerAuthSession();
  if (!session || session.role !== "delivery") {
    throw new Error("Unauthorized");
  }

  const order = await prisma.$transaction(async (tx) => {
    const updatedOrder = await tx.order.update({
      where: { id: orderId },
      data: {
        status: "delivered",
        deliveredAt: new Date(),
      },
      include: {
        shop: true,
      }
    });

    // Notify the shop
    await createNotification({
      recipientRole: "shop",
      recipientId: updatedOrder.shop.userId,
      type: "order_delivered",
      title: "Order Delivered",
      body: `Your order #${orderId.slice(0, 8)} has been successfully delivered.`,
      referenceType: "order",
      referenceId: orderId,
      pusherChannel: `shop-${updatedOrder.shopId}`,
    });

    return updatedOrder;
  });

  revalidatePath("/delivery/dashboard");
  revalidatePath("/shop/orders");
  revalidatePath("/admin/orders");

  return { success: true };
}
