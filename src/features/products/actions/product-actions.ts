'use server';

import { prisma } from "@/lib/prisma";

export async function getProducts(options: {
  categoryId?: string;
  search?: string;
  limit?: number;
  offset?: number;
} = {}) {
  const { categoryId, search, limit = 20, offset = 0 } = options;

  const where: any = {
    isVisible: true,
  };

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (search) {
    where.name = {
      contains: search,
      mode: "insensitive",
    };
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
      },
      take: limit,
      skip: offset,
      orderBy: { name: "asc" },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products: products.map(p => ({
      ...p,
      currentPrice: Number(p.currentPrice),
    })),
    total,
  };
}

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
  });
}
