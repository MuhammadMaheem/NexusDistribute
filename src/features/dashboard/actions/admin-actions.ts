'use server';

import { prisma } from "@/lib/prisma";

export interface AdminStats {
  revenueToday: number;
  revenueWeek: number;
  revenueMonth: number;
  outstandingBalance: number;
  activeOrders: number;
  pendingReview: number;
  lowStockItems: number;
  expiringDeadlines: number;
}

export async function getAdminDashboardStats(): Promise<AdminStats> {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

  const [
    revenueToday,
    revenueWeek,
    revenueMonth,
    outstandingBalance,
    activeOrders,
    pendingReview,
    lowStockItems,
    expiringDeadlines,
  ] = await Promise.all([
    // Revenue Today
    prisma.order.aggregate({
      where: {
        placedAt: { gte: today },
        status: { notIn: ["cancelled", "rejected"] },
      },
      _sum: { totalAmount: true },
    }),
    // Revenue Week
    prisma.order.aggregate({
      where: {
        placedAt: { gte: oneWeekAgo },
        status: { notIn: ["cancelled", "rejected"] },
      },
      _sum: { totalAmount: true },
    }),
    // Revenue Month
    prisma.order.aggregate({
      where: {
        placedAt: { gte: oneMonthAgo },
        status: { notIn: ["cancelled", "rejected"] },
      },
      _sum: { totalAmount: true },
    }),
    // Outstanding Balance
    prisma.shop.aggregate({
      _sum: { balance: true },
    }),
    // Active Orders
    prisma.order.count({
      where: {
        status: { in: ["pending", "processing", "dispatched", "out_for_delivery"] },
      },
    }),
    // Pending Review
    prisma.order.count({
      where: {
        status: "admin_review",
      },
    }),
    // Low Stock Items
    prisma.product.count({
      where: {
        stockQuantity: { lte: 10 },
        isVisible: true,
      },
    }),
    // Expiring Deadlines (Shops with balance > 0 and deadline < 3 days)
    prisma.shop.count({
      where: {
        balance: { gt: 0 },
        paymentDeadline: { lte: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000) },
      },
    }),
  ]);

  return {
    revenueToday: Number(revenueToday._sum.totalAmount || 0),
    revenueWeek: Number(revenueWeek._sum.totalAmount || 0),
    revenueMonth: Number(revenueMonth._sum.totalAmount || 0),
    outstandingBalance: Number(outstandingBalance._sum.balance || 0),
    activeOrders,
    pendingReview,
    lowStockItems,
    expiringDeadlines,
  };
}

export async function getRecentActivity() {
  const orders = await prisma.order.findMany({
    take: 10,
    orderBy: { placedAt: "desc" },
    include: { shop: true },
  });

  return orders.map(order => ({
    id: order.id,
    type: "order" as const,
    message: `Order #${order.id.slice(0, 8)} from ${order.shop.shopName}`,
    time: formatRelativeTime(order.placedAt),
    status: mapOrderStatusToActivityStatus(order.status),
  }));
}

export async function getTopShops() {
  const shops = await prisma.shop.findMany({
    take: 5,
    orderBy: { balance: "desc" }, // Or by order volume, but currently sorting by balance for demo
    select: {
      shopName: true,
      balance: true,
      _count: {
        select: { orders: true },
      },
    },
  });

  return (shops as any).map((shop: any) => ({
    name: shop.shopName,
    orders: shop._count?.orders || 0,
    revenue: Number(shop.balance),
  }));
}

// Utility to map order status to activity UI status
function mapOrderStatusToActivityStatus(status: string) {
  switch (status) {
    case "pending":
    case "admin_review":
      return "pending";
    case "delivered":
      return "delivered";
    case "cancelled":
    case "rejected":
      return "warning";
    default:
      return "info";
  }
}

// Simple relative time formatter
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
