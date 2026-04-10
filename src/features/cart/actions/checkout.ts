'use server';

import { prisma } from "@/lib/prisma";
import { getServerAuthSession } from "@/lib/auth";
import { canPlaceOrder, updateBalance } from "@/lib/balance-engine";
import { checkAndMergeOrder } from "@/lib/order-merge";
import { createNotification, notifyAllAdmins } from "@/lib/notifications";
import { revalidatePath } from "next/cache";

interface CheckoutItem {
  id: string;
  quantity: number;
  price: number;
}

export async function checkout(items: CheckoutItem[]) {
  const session = await getServerAuthSession();
  if (!session || session.role !== "shop") {
    throw new Error("Unauthorized");
  }

  const shop = await prisma.shop.findUnique({
    where: { userId: session.userId },
  });

  if (!shop) {
    throw new Error("Shop profile not found");
  }

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // 1. Check if order can be placed (Balance & Credit Limit)
  const orderCheck = await canPlaceOrder(shop.id, totalAmount);

  if (!orderCheck.canOrder) {
    return { 
      success: false, 
      error: orderCheck.reason || "Unable to place order due to credit limits or account status." 
    };
  }

  // 2. Create the order
  const order = await prisma.$transaction(async (tx) => {
    // Determine initial status
    const status = orderCheck.requiresReview ? "admin_review" : "pending";

    const newOrder = await tx.order.create({
      data: {
        shopId: shop.id,
        totalAmount,
        status,
        paymentType: "bnpl",
        notes: orderCheck.requiresReview ? "Order exceeds credit limit, pending admin review." : null,
        items: {
          create: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            unitPriceAtOrder: item.price,
            subtotal: item.price * item.quantity,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // 3. If no review required, update balance and check for merge
    if (status === "pending") {
      // Update shop balance (debit)
      await updateBalance({
        shopId: shop.id,
        type: "debit",
        amount: totalAmount,
        referenceType: "order",
        referenceId: newOrder.id,
        note: `Order #${newOrder.id.slice(0, 8)}`,
      });

      // We'll run merge check outside the transaction or as part of it
      // For simplicity and safety in RSC, let's return and handle core first
    }

    return newOrder;
  });

  // 4. Post-transaction logic
  if (order.status === "admin_review") {
     // Notify Admins about the review
     await notifyAllAdmins({
       type: "order_review",
       title: "New Order for Review",
       body: `Shop ${shop.shopName} has placed an order of Rs ${totalAmount.toLocaleString()} which requires review.`,
       referenceType: "order",
       referenceId: order.id,
       pusherChannel: "admin-events",
     });
  } else {
     // Notify Shop about successful order
     await createNotification({
       recipientRole: "shop",
       recipientId: session.userId,
       type: "new_order",
       title: "Order Placed Successfully",
       body: `Your order #${order.id.slice(0, 8)} for Rs ${totalAmount.toLocaleString()} has been placed.`,
       referenceType: "order",
       referenceId: order.id,
       pusherChannel: `shop-${shop.id}`,
     });

     // Check for merging (Auto-merge logic)
     try {
       const mergeResult = await checkAndMergeOrder(
         shop.id,
         order.items.map(i => ({ 
           productId: i.productId, 
           quantity: i.quantity, 
           unitPrice: Number(i.unitPriceAtOrder), 
           subtotal: Number(i.subtotal) 
         })),
         totalAmount,
         order.id
       );

       if (mergeResult.merged) {
         console.log(`Order ${order.id} merged into ${mergeResult.orderId}`);
       }
     } catch (mergeError) {
       console.error("Order merge failed:", mergeError);
       // Silent fail for merge - it's an optimization, the original order stands
     }
  }

  revalidatePath("/shop/orders");
  revalidatePath("/shop/dashboard");
  revalidatePath("/admin/dashboard");

  return { 
    success: true, 
    orderId: order.id, 
    status: order.status,
    requiresReview: order.status === "admin_review"
  };
}
