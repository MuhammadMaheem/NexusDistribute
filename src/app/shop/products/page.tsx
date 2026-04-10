"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Search, Plus, Minus, Package, Truck, MapPin, Phone, Clock } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const products = [
  { id: "P-001", name: "Sugar 1kg", unit: "bag", price: 120, stock: 500, minOrder: 1, category: "Grocery" },
  { id: "P-002", name: "Rice 5kg", unit: "bag", price: 850, stock: 200, minOrder: 1, category: "Grocery" },
  { id: "P-003", name: "Flour 10kg", unit: "bag", price: 650, stock: 150, minOrder: 1, category: "Grocery" },
  { id: "P-004", name: "Cooking Oil 5L", unit: "bottle", price: 1800, stock: 100, minOrder: 1, category: "Grocery" },
  { id: "P-005", name: "Tea 200g", unit: "box", price: 350, stock: 300, minOrder: 1, category: "Beverages" },
  { id: "P-006", name: "Juice 1L", unit: "bottle", price: 180, stock: 250, minOrder: 1, category: "Beverages" },
  { id: "P-007", name: "Water 1.5L", unit: "bottle", price: 70, stock: 1000, minOrder: 6, category: "Beverages" },
  { id: "P-008", name: "Chips 100g", unit: "piece", price: 120, stock: 400, minOrder: 1, category: "Snacks" },
  { id: "P-009", name: "Biscuit Pack", unit: "box", price: 85, stock: 350, minOrder: 1, category: "Snacks" },
  { id: "P-010", name: "Detergent 1kg", unit: "bag", price: 250, stock: 180, minOrder: 1, category: "Household" },
  { id: "P-011", name: "Soap Bar", unit: "piece", price: 95, stock: 500, minOrder: 1, category: "Personal Care" },
  { id: "P-012", name: "Shampoo 200ml", unit: "bottle", price: 280, stock: 150, minOrder: 1, category: "Personal Care" },
];

export default function ShopProductsPage() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const categories = ["All", "Grocery", "Beverages", "Snacks", "Household", "Personal Care"];

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) &&
    (selectedCategory === "All" || p.category === selectedCategory)
  );

  const cartCount = Object.values(cart).reduce((s, q) => s + q, 0);
  const cartTotal = Object.entries(cart).reduce((s, [id, qty]) => {
    const p = products.find(x => x.id === id);
    return s + (p ? p.price * qty : 0);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-in" data-delay="1">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Products</h1>
          <p className="text-sm text-text-secondary mt-1">{products.length} products available</p>
        </div>
        <Link href="/shop/cart">
          <Button variant="glow" className="relative gap-2">
            <ShoppingCart className="h-4 w-4" />
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-shop text-[10px] font-bold text-background shadow-[0_0_6px_hsl(var(--shop-glow)/0.6)]">
                {cartCount}
              </span>
            )}
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 animate-in" data-delay="2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
          <Input placeholder="Search products..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {categories.map(cat => (
            <Button key={cat} variant={selectedCategory === cat ? "glow" : "glass"} size="sm" onClick={() => setSelectedCategory(cat)}>
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((product, index) => {
          const qty = cart[product.id] || 0;
          return (
            <Card key={product.id} className={`glass group animate-in ${qty > 0 ? "border-shop/40" : ""}`} data-delay={index + 3}>
              <CardContent className="p-5">
                {/* Icon */}
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-2 mb-4">
                  <Package className="h-6 w-6 text-text-secondary" />
                </div>

                {/* Info */}
                <h3 className="font-semibold text-foreground text-sm mb-1">{product.name}</h3>
                <Badge variant="default" size="sm" className="mb-3">{product.category}</Badge>

                {/* Price */}
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-2xl font-bold font-mono tabular-nums text-primary">
                    Rs {product.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-text-tertiary">/{product.unit}</span>
                </div>

                {/* Stock & Min Order */}
                <div className="flex justify-between text-[10px] text-text-tertiary mb-4">
                  <span>Stock: {product.stock}</span>
                  <span>Min: {product.minOrder}</span>
                </div>

                {/* Add to Cart */}
                {qty > 0 ? (
                  <div className="flex items-center gap-2">
                    <Button variant="glass" size="icon-sm" onClick={() => setCart(prev => ({ ...prev, [product.id]: Math.max(0, qty - 1) }))}>
                      <Minus className="h-3.5 w-3.5" />
                    </Button>
                    <span className="flex-1 text-center font-bold font-mono text-foreground">{qty}</span>
                    <Button variant="glass" size="icon-sm" onClick={() => setCart(prev => ({ ...prev, [product.id]: qty + 1 }))}>
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ) : (
                  <Button variant="glow" className="w-full" onClick={() => setCart(prev => ({ ...prev, [product.id]: product.minOrder }))}>
                    <Plus className="mr-1.5 h-3.5 w-3.5" />
                    Add to Cart
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Floating Cart Summary */}
      {cartCount > 0 && (
        <div className="fixed bottom-6 right-6 z-50 animate-scale-in">
          <Link href="/shop/cart">
            <div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-shop to-shop/80 px-5 py-3 shadow-[0_8px_32px_hsl(var(--shop-glow)/0.3)] cursor-pointer hover:shadow-[0_8px_40px_hsl(var(--shop-glow)/0.5)] transition-shadow">
              <ShoppingCart className="h-5 w-5 text-white" />
              <div>
                <p className="text-xs text-white/70">{cartCount} items</p>
                <p className="text-sm font-bold text-white font-mono">Rs {cartTotal.toLocaleString()}</p>
              </div>
              <span className="text-white text-sm font-semibold">Checkout →</span>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
