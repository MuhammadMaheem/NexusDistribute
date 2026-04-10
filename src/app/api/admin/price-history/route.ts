import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const history = await prisma.priceHistory.findMany({
      include: {
        product: {
          select: { name: true },
        },
      },
      orderBy: { changedAt: "desc" },
      take: 50,
    });
    return NextResponse.json(history);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
