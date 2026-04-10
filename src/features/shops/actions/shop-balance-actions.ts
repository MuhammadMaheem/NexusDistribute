'use server';

import { prisma } from "@/lib/prisma";
import { getServerAuthSession } from "@/lib/auth";
import { getShopBalance } from "@/lib/balance-engine";

export async function getShopLedger() {
  const session = await getServerAuthSession();
  if (!session || session.role !== "shop") {
    throw new Error("Unauthorized");
  }

  const shop = await prisma.shop.findUnique({
    where: { userId: session.userId },
  });

  if (!shop) throw new Error("Shop not found");

  const [balance, ledgerEntries] = await Promise.all([
    getShopBalance(shop.id),
    prisma.balanceLedger.findMany({
      where: { shopId: shop.id },
      orderBy: { recordedAt: "desc" },
      take: 50,
    }),
  ]);

  return {
    balance,
    ledgerEntries: ledgerEntries.map(e => ({
      ...e,
      amount: Number(e.amount),
      balanceAfter: Number(e.balanceAfter),
    })),
  };
}
