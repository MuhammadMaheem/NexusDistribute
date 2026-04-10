import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Hash password
  const hashedPassword = await bcrypt.hash("password123", 12);

  // Create Admin
  const admin = await prisma.user.upsert({
    where: { email: "admin@nexusdistribute.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@nexusdistribute.com",
      password_hash: hashedPassword,
      role: "admin",
      is_active: true,
    },
  });
  console.log("✅ Admin user created");

  // Create Shop Users
  const shops = [
    { shopName: "Al-Falah Store", owner: "Ahmed Khan", phone: "+92-300-1234567", email: "shop1@test.com", address: "Shop 12, Main Bazaar, Lahore" },
    { shopName: "City Mart", owner: "Sara Ali", phone: "+92-321-7654321", email: "shop2@test.com", address: "Plot 45, Commercial Area, Karachi" },
    { shopName: "Royal Traders", owner: "Bilal Ahmed", phone: "+92-333-9876543", email: "shop3@test.com", address: "Lane 7, Sector F-8, Islamabad" },
    { shopName: "Green Valley", owner: "Fatima Noor", phone: "+92-345-1112222", email: "shop4@test.com", address: "Street 5, G-9 Markaz, Islamabad" },
    { shopName: "Metro Supplies", owner: "Hassan Raza", phone: "+92-312-3334444", email: "shop5@test.com", address: "Block C, Model Town, Multan" },
  ];

  const shopRecords = [];
  for (const s of shops) {
    const user = await prisma.user.upsert({
      where: { email: s.email },
      update: {},
      create: {
        name: s.owner,
        email: s.email,
        password_hash: hashedPassword,
        role: "shop",
        is_active: true,
      },
    });

    const shop = await prisma.shop.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        shopName: s.shopName,
        ownerName: s.owner,
        phone: s.phone,
        addressText: s.address,
        registrationStatus: "approved",
        approvedBy: admin.id,
        approvedAt: new Date(),
        isActive: true,
        balance: Math.floor(Math.random() * 100000),
        creditLimit: 200000,
        paymentDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    shopRecords.push(shop);
  }
  console.log("✅ 5 shop users created");

  // Create Delivery Person
  const deliveryUser = await prisma.user.upsert({
    where: { email: "delivery@nexusdistribute.com" },
    update: {},
    create: {
      name: "Ahmed Delivery",
      email: "delivery@nexusdistribute.com",
      password_hash: hashedPassword,
      role: "delivery",
      is_active: true,
    },
  });

  await prisma.deliveryPerson.upsert({
    where: { userId: deliveryUser.id },
    update: {},
    create: {
      userId: deliveryUser.id,
      name: "Ahmed Delivery",
      phone: "+92-300-9998888",
      vehicleInfo: "Honda CD 70 - Red",
      isAvailable: true,
    },
  });
  console.log("✅ Delivery person created");

  // Create Categories
  const categories = await Promise.all([
    prisma.category.create({ data: { name: "Grocery", sortOrder: 1, createdBy: admin.id } }),
    prisma.category.create({ data: { name: "Beverages", sortOrder: 2, createdBy: admin.id } }),
    prisma.category.create({ data: { name: "Snacks", sortOrder: 3, createdBy: admin.id } }),
    prisma.category.create({ data: { name: "Household", sortOrder: 4, createdBy: admin.id } }),
    prisma.category.create({ data: { name: "Personal Care", sortOrder: 5, createdBy: admin.id } }),
  ]);
  console.log("✅ 5 categories created");

  // Create Products
  const products = [
    { name: "Sugar 1kg", unit: "bag", price: 120, stock: 500, category: categories[0].id },
    { name: "Rice 5kg", unit: "bag", price: 850, stock: 200, category: categories[0].id },
    { name: "Flour 10kg", unit: "bag", price: 650, stock: 150, category: categories[0].id },
    { name: "Cooking Oil 5L", unit: "bottle", price: 1800, stock: 100, category: categories[0].id },
    { name: "Tea 200g", unit: "box", price: 350, stock: 300, category: categories[1].id },
    { name: "Juice 1L", unit: "bottle", price: 180, stock: 250, category: categories[1].id },
    { name: "Water 1.5L", unit: "bottle", price: 70, stock: 1000, category: categories[1].id },
    { name: "Chips 100g", unit: "piece", price: 120, stock: 400, category: categories[2].id },
    { name: "Biscuit Pack", unit: "box", price: 85, stock: 350, category: categories[2].id },
    { name: "Detergent 1kg", unit: "bag", price: 250, stock: 180, category: categories[3].id },
    { name: "Soap Bar", unit: "piece", price: 95, stock: 500, category: categories[4].id },
    { name: "Shampoo 200ml", unit: "bottle", price: 280, stock: 150, category: categories[4].id },
  ];

  const createdProducts = [];
  for (const p of products) {
    const product = await prisma.product.create({
      data: {
        name: p.name,
        unit: p.unit,
        currentPrice: p.price,
        stockQuantity: p.stock,
        lowStockThreshold: 20,
        isVisible: true,
        categoryId: p.category,
        createdBy: admin.id,
      },
    });
    createdProducts.push(product);
  }
  console.log(`✅ ${createdProducts.length} products created`);

  // Create Priorities
  await Promise.all([
    prisma.priority.create({ data: { label: "Normal", durationValue: 48, durationUnit: "hours", sortOrder: 1, colorHex: "#0EA5E9", createdBy: admin.id } }),
    prisma.priority.create({ data: { label: "Urgent", durationValue: 24, durationUnit: "hours", sortOrder: 2, colorHex: "#DC2626", createdBy: admin.id } }),
    prisma.priority.create({ data: { label: "Express", durationValue: 6, durationUnit: "hours", sortOrder: 3, colorHex: "#F59E0B", createdBy: admin.id } }),
  ]);
  console.log("✅ 3 priorities created");

  // Create Platform Settings
  const settings = [
    { key: "order_merge_window_minutes", value: "60" },
    { key: "default_credit_limit", value: "200000" },
    { key: "default_payment_days", value: "30" },
    { key: "platform_name", value: "NexusDistribute" },
    { key: "platform_logo_url", value: "" },
    { key: "low_stock_default_threshold", value: "20" },
    { key: "discount_codes_enabled", value: "true" },
    { key: "two_factor_enabled", value: "false" },
  ];

  for (const s of settings) {
    await prisma.platformSetting.upsert({
      where: { key: s.key },
      update: {},
      create: { key: s.key, value: s.value },
    });
  }
  console.log("✅ Platform settings created");

  // Create Sample Order
  const sampleShop = shopRecords[0];
  if (sampleShop) {
    const order = await prisma.order.create({
      data: {
        shopId: sampleShop.id,
        status: "pending",
        paymentType: "bnpl",
        totalAmount: 5620,
        placedAt: new Date(),
      },
    });

    await prisma.orderItem.createMany({
      data: [
        { orderId: order.id, productId: createdProducts[0].id, quantity: 10, unitPriceAtOrder: 120, subtotal: 1200 },
        { orderId: order.id, productId: createdProducts[1].id, quantity: 3, unitPriceAtOrder: 850, subtotal: 2550 },
        { orderId: order.id, productId: createdProducts[4].id, quantity: 5, unitPriceAtOrder: 350, subtotal: 1750 },
      ],
    });

    console.log("✅ Sample order created");
  }

  console.log("🌱 Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
