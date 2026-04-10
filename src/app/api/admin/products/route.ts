import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { getServerAuthSession } from '@/lib/auth';

// GET - List products
export async function GET(request: NextRequest) {
  try {
    const session = await getServerAuthSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (session.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const visible = searchParams.get('visible');

    const where: Record<string, unknown> = {};
    if (category) where.categoryId = category;
    if (visible !== null && visible !== undefined) where.isVisible = visible === 'true';

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: { name: true },
          },
        },
        orderBy: { name: 'asc' },
      }),
      prisma.product.count({ where }),
    ]);

    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json({ products, total, categories });
  } catch (error) {
    console.error('Products GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create product
const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  unit: z.string().min(1),
  currentPrice: z.number().positive(),
  stockQuantity: z.number().int().min(0),
  lowStockThreshold: z.number().int().min(0).default(5),
  minOrderQty: z.number().int().min(1).default(1),
  isVisible: z.boolean().default(true),
  categoryId: z.string().nullable(),
  imageUrl: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerAuthSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const data = productSchema.parse(body);

    const product = await prisma.product.create({
      data: {
        ...data,
        currentPrice: data.currentPrice,
        createdBy: session.userId,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update product
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerAuthSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (session.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const body = await request.json();
    const { isVisible, stockQuantity, lowStockThreshold, ...rest } = body;

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...rest,
        ...(isVisible !== undefined && { isVisible }),
        ...(stockQuantity !== undefined && { stockQuantity }),
        ...(lowStockThreshold !== undefined && { lowStockThreshold }),
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
