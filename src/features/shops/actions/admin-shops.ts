'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAdminShops() {
  const shops = await prisma.shop.findMany({
    include: {
      user: true,
      _count: { select: { orders: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return shops.map(s => ({
    ...s,
    balance: Number(s.balance),
    creditLimit: Number(s.creditLimit),
  }));
}

export async function updateShopSettings(shopId: string, data: {
  creditLimit?: number;
  isActive?: boolean;
  orderMenuDisabled?: boolean;
  paymentDeadline?: Date | null;
}) {
  const updateData: any = { ...data };
  
  if (data.creditLimit !== undefined) {
    updateData.creditLimit = data.creditLimit;
  }

  await prisma.shop.update({
    where: { id: shopId },
    data: updateData,
  });

  revalidatePath("/admin/shops");
  revalidatePath("/admin/dashboard");
  revalidatePath("/shop/dashboard");

  return { success: true };
}

export async function getShopDetails(shopId: string) {
  const shop = await prisma.shop.findUnique({
    where: { id: shopId },
    include: {
      user: true,
      orders: {
        take: 10,
        orderBy: { placedAt: "desc" },
      },
      payments: {
        take: 10,
        orderBy: { createdAt: "desc" },
      },
    }
  });

  if (!shop) return null;

  return {
    ...shop,
    balance: Number(shop.balance),
    creditLimit: Number(shop.creditLimit),
  };
}
