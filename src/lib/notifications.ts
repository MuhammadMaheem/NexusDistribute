import { prisma } from "./prisma";
import { triggerPusherEvent } from "./pusher";
import type { UserRole } from "./auth";

export type NotificationType =
  | "new_order"
  | "order_review"
  | "order_approved"
  | "order_rejected"
  | "order_merged"
  | "order_dispatched"
  | "order_out_for_delivery"
  | "order_delivered"
  | "order_cancelled"
  | "balance_warning"
  | "balance_over_limit"
  | "payment_deadline_reminder"
  | "payment_deadline_expired"
  | "account_suspended"
  | "account_reactivated"
  | "announcement"
  | "price_change_scheduled"
  | "price_change_applied"
  | "chat_message"
  | "dispute_filed"
  | "dispute_resolved"
  | "low_stock_alert"
  | "registration_pending"
  | "registration_approved"
  | "registration_rejected"
  | "delivery_assigned";

export interface CreateNotification {
  recipientRole: UserRole;
  recipientId: string;
  type: NotificationType;
  title: string;
  body: string;
  referenceType?: string;
  referenceId?: string;
  pusherChannel?: string;
}

/**
 * Create an in-app notification and optionally push via Pusher
 */
export async function createNotification({
  recipientRole,
  recipientId,
  type,
  title,
  body,
  referenceType,
  referenceId,
  pusherChannel,
}: CreateNotification) {
  // Save to database
  const notification = await prisma.notification.create({
    data: {
      recipientRole,
      recipientId,
      type,
      title,
      body,
      referenceType: referenceType || null,
      referenceId: referenceId || null,
    },
  });

  // Push to client if Pusher channel provided
  if (pusherChannel) {
    await triggerPusherEvent(pusherChannel, "notification:new", {
      id: notification.id,
      type,
      title,
      body,
      createdAt: notification.createdAt,
    });
  }

  return notification;
}

/**
 * Send notifications to all admins
 */
export async function notifyAllAdmins(
  data: Omit<CreateNotification, "recipientRole" | "recipientId">
) {
  const admins = await prisma.user.findMany({
    where: { role: "admin", isActive: true },
    select: { id: true },
  });

  return Promise.all(
    admins.map((admin) =>
      createNotification({
        ...data,
        recipientRole: "admin",
        recipientId: admin.id,
      })
    )
  );
}

/**
 * Send announcements to all active shops
 */
export async function broadcastToShops(
  data: Omit<CreateNotification, "recipientRole" | "recipientId">
) {
  const shops = await prisma.shop.findMany({
    where: { isActive: true },
    select: { userId: true },
  });

  return Promise.all(
    shops.map((shop) =>
      createNotification({
        ...data,
        recipientRole: "shop",
        recipientId: shop.userId,
      })
    )
  );
}
