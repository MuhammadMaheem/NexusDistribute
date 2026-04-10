import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Shop ID required" }, { status: 400 });
    }

    const shop = await prisma.shop.findUnique({
      where: { id },
      include: {
        user: {
          select: { name: true, email: true, last_login_at: true },
        },
        orders: {
          take: 10,
          orderBy: { placedAt: "desc" },
          include: {
            items: {
              include: { product: { select: { name: true } } },
            },
          },
        },
        ledgerEntries: {
          take: 10,
          orderBy: { recordedAt: "desc" },
        },
        disputes: {
          take: 5,
          orderBy: { filedAt: "desc" },
        },
      },
    });

    if (!shop) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    return NextResponse.json(shop);
  } catch (error) {
    console.error("Shop detail GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
