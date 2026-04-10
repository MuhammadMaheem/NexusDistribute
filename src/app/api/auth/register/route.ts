import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { z } from "zod";

const registerSchema = z.object({
  shop_name: z.string().min(2, "Shop name must be at least 2 characters"),
  owner_name: z.string().min(2, "Owner name must be at least 2 characters"),
  phone: z.string().min(10, "Valid phone number required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  address_text: z.string().min(5, "Full address required"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { shop_name, owner_name, phone, email, password, address_text } = validation.data;

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password and create user + shop in a transaction
    const passwordHash = await hashPassword(password);

    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          name: owner_name,
          email,
          password_hash: passwordHash,
          role: "shop",
          is_active: true,
        },
      });

      // Create shop record
      const shop = await tx.shop.create({
        data: {
          userId: user.id,
          shopName: shop_name,
          ownerName: owner_name,
          phone,
          addressText: address_text,
          registrationStatus: "pending",
          balance: 0,
          creditLimit: 200000,
          isActive: false,
        },
      });

      return { user, shop };
    });

    return NextResponse.json(
      {
        success: true,
        message: "Registration submitted. Awaiting admin approval.",
        shop: {
          id: result.shop.id,
          shopName: result.shop.shopName,
          registrationStatus: result.shop.registrationStatus,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
