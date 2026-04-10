import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const shopId = searchParams.get("shopId");

    const where: Record<string, unknown> = {};
    if (status && status !== "all") where.status = status;
    if (shopId) where.shopId = shopId;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          shop: {
            select: {
              shopName: true,
              ownerName: true,
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
        orderBy: { placedAt: "desc" },
        take: 50,
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({ orders, total });
  } catch (error) {
    console.error("Orders GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
