'use server';

import { prisma } from "@/lib/prisma";
import { getServerAuthSession } from "@/lib/auth";
import { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getShopOrders() {
  const session = await getServerAuthSession();
  if (!session || session.role !== "shop") {
    throw new Error("Unauthorized");
  }

  const shop = await prisma.shop.findUnique({
    where: { userId: session.userId },
  });

  if (!shop) throw new Error("Shop not found");

  const orders = await prisma.order.findMany({
    where: { shopId: shop.id },
    include: {
      _count: { select: { items: true } },
    },
    orderBy: { placedAt: "desc" },
  });

  return orders.map(o => ({
    ...o,
    totalAmount: Number(o.totalAmount),
  }));
}

export async function getShopOrderDetail(orderId: string) {
  const session = await getServerAuthSession();
  if (!session || session.role !== "shop") {
    throw new Error("Unauthorized");
  }

  const shop = await prisma.shop.findUnique({
    where: { userId: session.userId },
  });

  if (!shop) throw new Error("Shop not found");

  const order = await prisma.order.findUnique({
    where: { id: orderId, shopId: shop.id },
    include: {
      items: {
        include: {
          product: true,
        }
      },
    }
  });

  if (!order) return null;

  return {
    ...order,
    totalAmount: Number(order.totalAmount),
    items: order.items.map(i => ({
      ...i,
      unitPriceAtOrder: Number(i.unitPriceAtOrder),
      subtotal: Number(i.subtotal),
    })),
  };
}
