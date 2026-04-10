import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// GET - List review queue
export async function GET() {
  try {
    const items = await prisma.adminReviewQueue.findMany({
      where: { status: "pending" },
      include: {
        order: {
          include: {
            shop: {
              select: {
                shopName: true,
                balance: true,
                creditLimit: true,
              },
            },
            items: {
              include: {
                product: {
                  select: { name: true },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("Review queue GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT - Approve or reject
const reviewSchema = z.object({
  action: z.enum(["approve", "reject"]),
  adminNote: z.string().optional(),
});

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const body = await request.json();
    const { action, adminNote } = reviewSchema.parse(body);

    const result = await prisma.$transaction(async (tx) => {
      const reviewItem = await tx.adminReviewQueue.findUnique({
        where: { id },
        include: { order: true },
      });

      if (!reviewItem) {
        throw new Error("Review item not found");
      }

      if (action === "approve") {
        // Approve order - update status, debit balance
        await tx.order.update({
          where: { id: reviewItem.order.id },
          data: { status: "approved" },
        });

        // Debit shop balance
        await tx.shop.update({
          where: { id: reviewItem.order.shopId },
          data: {
            balance: {
              increment: reviewItem.order.totalAmount,
            },
          },
        });

        // Write ledger entry
        await tx.balanceLedger.create({
          data: {
            shopId: reviewItem.order.shopId,
            type: "debit",
            amount: reviewItem.order.totalAmount,
            balanceAfter: reviewItem.projectedBalance,
            referenceType: "order",
            referenceId: reviewItem.order.id,
            note: "BNPL order approved (was over credit limit)",
          },
        });

        // Update review queue
        await tx.adminReviewQueue.update({
          where: { id },
          data: {
            status: "approved",
            adminNote: adminNote || null,
            reviewedAt: new Date(),
          },
        });

        return { success: true, action: "approved" };
      } else {
        // Reject order
        await tx.order.update({
          where: { id: reviewItem.order.id },
          data: { status: "rejected" },
        });

        // Release stock reservation
        const orderItems = await tx.orderItem.findMany({
          where: { orderId: reviewItem.order.id },
        });

        for (const item of orderItems) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stockQuantity: {
                increment: item.quantity,
              },
            },
          });
        }

        // Update review queue
        await tx.adminReviewQueue.update({
          where: { id },
          data: {
            status: "rejected",
            adminNote: adminNote || null,
            reviewedAt: new Date(),
          },
        });

        return { success: true, action: "rejected" };
      }
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Review queue PUT error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
