import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const disputes = await prisma.dispute.findMany({
      include: {
        shop: {
          select: { shopName: true },
        },
        order: {
          select: { id: true, totalAmount: true },
        },
      },
      orderBy: { filedAt: "desc" },
    });
    return NextResponse.json(disputes);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const body = await request.json();
    const { action, resolutionNote, creditIssued } = body;

    const dispute = await prisma.$transaction(async (tx) => {
      const d = await tx.dispute.update({
        where: { id },
        data: {
          status: action === "resolve" ? "resolved" : "rejected",
          resolutionNote,
          creditIssued: creditIssued ? parseFloat(creditIssued) : null,
          resolvedAt: new Date(),
        },
      });

      if (action === "resolve" && creditIssued) {
        const shop = await tx.dispute.findUnique({
          where: { id },
          select: { shopId: true },
        });

        if (shop) {
          const currentShop = await tx.shop.findUnique({
            where: { id: shop.shopId },
            select: { balance: true },
          });

          await tx.shop.update({
            where: { id: shop.shopId },
            data: {
              balance: {
                decrement: parseFloat(creditIssued),
              },
            },
          });

          await tx.balanceLedger.create({
            data: {
              shopId: shop.shopId,
              type: "credit",
              amount: parseFloat(creditIssued),
              balanceAfter: currentShop ? parseFloat(currentShop.balance.toString()) - parseFloat(creditIssued) : 0,
              referenceType: "dispute_resolution",
              referenceId: id,
              note: "Credit issued for dispute resolution",
            },
          });
        }
      }

      return d;
    });

    return NextResponse.json(dispute);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
