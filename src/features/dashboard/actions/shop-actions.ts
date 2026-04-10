'use server';

import { prisma } from "@/lib/prisma";
import { getShopBalance } from "@/lib/balance-engine";
import { getServerAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function getShopDashboardData() {
  const session = await getServerAuthSession();
  
  if (!session || session.role !== "shop") {
    redirect("/login");
  }

  const shop = await prisma.shop.findUnique({
    where: { userId: session.userId },
  });

  if (!shop) {
    return null;
  }

  const shopId = shop.id;

  const [balance, activeOrders, announcements] = await Promise.all([
    getShopBalance(shopId),
    prisma.order.findMany({
      where: {
        shopId,
        status: { in: ["pending", "processing", "dispatched", "out_for_delivery"] },
      },
      orderBy: { placedAt: "desc" },
      take: 5,
    }),
    // Announcements (can be from a separate Announcement model or filtered notifications)
    prisma.notification.findMany({
      where: {
        recipientId: shop.userId,
        type: "announcement",
      },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
  ]);

  return {
    balance,
    activeOrders: activeOrders.map(order => ({
      id: order.id,
      status: order.status,
      items: 0, // Would need to count items
      total: Number(order.totalAmount),
      placedAt: formatRelativeTime(order.placedAt),
    })),
    announcements: announcements.map(ann => ({
      id: ann.id,
      title: ann.title,
      date: formatRelativeTime(ann.createdAt),
      unread: !ann.readAt,
    })),
  };
}

// Simple relative time formatter (duplicated from admin for simplicity in this file)
function formatRelativeTime(date: Date) {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMins = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMins < 1) return "Just now";
  if (diffInMins < 60) return `${diffInMins} min ago`;
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
}
