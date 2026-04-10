import { prisma } from "./prisma";

export interface OrderMergeResult {
  merged: boolean;
  orderId: string;
  reason?: string;
}

/**
 * Check if a new order should be merged with an existing pending order.
 * Two orders merge if:
 * 1. Previous order was placed within the configured merge window
 * 2. Previous order status is pending or processing (not dispatched or beyond)
 */
export async function checkAndMergeOrder(
  shopId: string,
  newOrderItems: { productId: string; quantity: number; unitPrice: number; subtotal: number }[],
  newTotalAmount: number,
  newOrderId: string
): Promise<OrderMergeResult> {
  // Get merge window from settings (default 60 minutes)
  const setting = await prisma.platformSetting.findUnique({
    where: { key: "order_merge_window_minutes" },
  });
  const windowMinutes = setting ? parseInt(setting.value) : 60;

  // Find the shop's most recent order that is still mergeable
  const cutoffTime = new Date(Date.now() - windowMinutes * 60 * 1000);

  const mergeableStatuses: import("@prisma/client").OrderStatus[] = ["pending", "processing"];

  const previousOrder = await prisma.order.findFirst({
    where: {
      shopId,
      placedAt: { gte: cutoffTime },
      status: { in: mergeableStatuses },
      id: { not: newOrderId },
      mergedInto: null,
    },
    orderBy: { placedAt: "desc" },
    include: { items: true },
  });

  if (!previousOrder) {
    return { merged: false, orderId: newOrderId };
  }

  // Merge: move items from new order to previous order
  await prisma.$transaction(async (tx) => {
    // Add new items to the previous order
    await tx.orderItem.createMany({
      data: newOrderItems.map((item) => ({
        orderId: previousOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPriceAtOrder: item.unitPrice,
        subtotal: item.subtotal,
      })),
    });

    // Update total amount
    const existingTotal = parseFloat(previousOrder.totalAmount.toString());
    await tx.order.update({
      where: { id: previousOrder.id },
      data: { totalAmount: existingTotal + newTotalAmount },
    });

    // Mark new order as merged
    await tx.order.update({
      where: { id: newOrderId },
      data: {
        mergedInto: previousOrder.id,
        isParentMerge: false,
        status: "cancelled",
      },
    });

    // Mark parent as merge parent
    await tx.order.update({
      where: { id: previousOrder.id },
      data: { isParentMerge: true },
    });

    // Log the merge
    await tx.orderMergeLog.create({
      data: {
        parentOrderId: previousOrder.id,
        childOrderId: newOrderId,
        windowMinutesUsed: windowMinutes,
      },
    });
  });

  return {
    merged: true,
    orderId: previousOrder.id,
    reason: `Merged with order #${previousOrder.id.slice(0, 8)}`,
  };
}
