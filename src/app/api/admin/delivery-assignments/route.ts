import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, deliveryPersonId } = body;

    const assignment = await prisma.$transaction(async (tx) => {
      // Create assignment
      const a = await tx.deliveryAssignment.create({
        data: {
          orderId,
          deliveryPersonId,
        },
      });

      // Update order status
      await tx.order.update({
        where: { id: orderId },
        data: { status: "dispatched" },
      });

      return a;
    });

    return NextResponse.json(assignment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
