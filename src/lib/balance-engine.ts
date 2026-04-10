import { prisma } from "./prisma";
import { Decimal } from "@prisma/client/runtime/library";

export interface BalanceUpdate {
  shopId: string;
  type: "debit" | "credit";
  amount: number | Decimal;
  referenceType?: string;
  referenceId?: string;
  note?: string;
  recordedBy?: string;
}

/**
 * Update shop balance and write a permanent ledger entry.
 * All operations run in a transaction for consistency.
 */
export async function updateBalance({
  shopId,
  type,
  amount,
  referenceType,
  referenceId,
  note,
  recordedBy,
}: BalanceUpdate) {
  return prisma.$transaction(async (tx) => {
    // Get current balance
    const shop = await tx.shop.findUnique({
      where: { id: shopId },
      select: { balance: true },
    });

    if (!shop) {
      throw new Error(`Shop not found: ${shopId}`);
    }

    const currentBalance = parseFloat(shop.balance.toString());
    const updateAmount = parseFloat(amount.toString());

    // Calculate new balance
    const newBalance =
      type === "debit"
        ? currentBalance + updateAmount
        : currentBalance - updateAmount;

    // Update shop balance
    await tx.shop.update({
      where: { id: shopId },
      data: { balance: newBalance },
    });

    // Write permanent ledger entry
    const entry = await tx.balanceLedger.create({
      data: {
        shopId,
        type,
        amount: updateAmount,
        balanceAfter: newBalance,
        referenceType: referenceType || null,
        referenceId: referenceId || null,
        note: note || null,
        recordedBy: recordedBy || null,
      },
    });

    return {
      previousBalance: currentBalance,
      newBalance,
      entry,
    };
  });
}

/**
 * Get shop balance with credit utilization percentage
 */
export async function getShopBalance(shopId: string) {
  const shop = await prisma.shop.findUnique({
    where: { id: shopId },
    select: {
      balance: true,
      creditLimit: true,
      paymentDeadline: true,
      isActive: true,
    },
  });

  if (!shop) {
    throw new Error(`Shop not found: ${shopId}`);
  }

  const balance = parseFloat(shop.balance.toString());
  const creditLimit = parseFloat(shop.creditLimit.toString());
  const utilizationPercent = (balance / creditLimit) * 100;

  return {
    balance,
    creditLimit,
    utilizationPercent: Math.min(utilizationPercent, 999),
    paymentDeadline: shop.paymentDeadline,
    isActive: shop.isActive,
    isOverLimit: balance > creditLimit,
    isNearLimit: utilizationPercent >= 80,
  };
}

/**
 * Check if a shop can place a BNPL order
 */
export async function canPlaceOrder(
  shopId: string,
  orderTotal: number
): Promise<{
  canOrder: boolean;
  requiresReview: boolean;
  projectedBalance: number;
  reason?: string;
}> {
  const shop = await prisma.shop.findUnique({
    where: { id: shopId },
    select: {
      balance: true,
      creditLimit: true,
      isActive: true,
      orderMenuDisabled: true,
      disableReason: true,
      paymentDeadline: true,
    },
  });

  if (!shop) {
    return { canOrder: false, requiresReview: false, projectedBalance: 0, reason: "Shop not found" };
  }

  const { balance, creditLimit, isActive, orderMenuDisabled, disableReason, paymentDeadline } = shop;

  // Check if menu is disabled
  if (orderMenuDisabled) {
    return {
      canOrder: false,
      requiresReview: false,
      projectedBalance: 0,
      reason: disableReason || "Ordering is disabled by admin",
    };
  }

  // Check if shop is active
  if (!isActive) {
    return {
      canOrder: false,
      requiresReview: false,
      projectedBalance: 0,
      reason: "Account is suspended. Please clear your balance.",
    };
  }

  // Check payment deadline
  if (paymentDeadline && paymentDeadline < new Date()) {
    const currentBalance = parseFloat(balance.toString());
    if (currentBalance > 0) {
      return {
        canOrder: false,
        requiresReview: false,
        projectedBalance: 0,
        reason: "Payment deadline has passed. Please clear your balance.",
      };
    }
  }

  const currentBalance = parseFloat(balance.toString());
  const projectedBalance = currentBalance + orderTotal;

  // Check credit limit
  if (projectedBalance > parseFloat(creditLimit.toString())) {
    return {
      canOrder: true,
      requiresReview: true,
      projectedBalance,
    };
  }

  return {
    canOrder: true,
    requiresReview: false,
    projectedBalance,
  };
}
