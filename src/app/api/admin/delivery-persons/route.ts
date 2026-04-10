import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export async function GET() {
  try {
    const persons = await prisma.deliveryPerson.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(persons);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

const personSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  vehicleInfo: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = personSchema.parse(body);

    // Create a delivery user
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: `delivery-${Date.now()}@nexusdistribute.com`,
        password_hash: "$2a$12$LJ3m4ys3Ly3W5m5m5m5m5.5m5m5m5m5m5m5m5m5m5m5m5m5m5m5", // placeholder
        role: "delivery",
        is_active: true,
      },
    });

    const person = await prisma.deliveryPerson.create({
      data: {
        userId: user.id,
        name: data.name,
        phone: data.phone,
        vehicleInfo: data.vehicleInfo || null,
      },
    });

    return NextResponse.json(person, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const body = await request.json();
    const person = await prisma.deliveryPerson.update({
      where: { id },
      data: {
        isAvailable: body.isAvailable,
        ...(body.phone && { phone: body.phone }),
        ...(body.vehicleInfo !== undefined && { vehicleInfo: body.vehicleInfo }),
      },
    });

    return NextResponse.json(person);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
