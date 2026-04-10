"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Package, Edit, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { useState } from "react";

const products = [
  { id: "P-001", name: "Sugar 1kg", unit: "bag", price: 120, stock: 500, threshold: 20, category: "Grocery", visible: true },
  { id: "P-002", name: "Rice 5kg", unit: "bag", price: 850, stock: 200, threshold: 20, category: "Grocery", visible: true },
  { id: "P-003", name: "Flour 10kg", unit: "bag", price: 650, stock: 150, threshold: 20, category: "Grocery", visible: true },
  { id: "P-004", name: "Cooking Oil 5L", unit: "bottle", price: 1800, stock: 100, threshold: 10, category: "Grocery", visible: true },
  { id: "P-005", name: "Tea 200g", unit: "box", price: 350, stock: 300, threshold: 20, category: "Beverages", visible: true },
  { id: "P-006", name: "Juice 1L", unit: "bottle", price: 180, stock: 250, threshold: 20, category: "Beverages", visible: true },
  { id: "P-007", name: "Water 1.5L", unit: "bottle", price: 70, stock: 1000, threshold: 50, category: "Beverages", visible: true },
  { id: "P-008", name: "Chips 100g", unit: "piece", price: 120, stock: 400, threshold: 30, category: "Snacks", visible: true },
  { id: "P-009", name: "Biscuit Pack", unit: "box", price: 85, stock: 350, threshold: 30, category: "Snacks", visible: true },
  { id: "P-010", name: "Detergent 1kg", unit: "bag", price: 250, stock: 180, threshold: 15, category: "Household", visible: true },
  { id: "P-011", name: "Soap Bar", unit: "piece", price: 95, stock: 500, threshold: 20, category: "Personal Care", visible: true },
  { id: "P-012", name: "Shampoo 200ml", unit: "bottle", price: 280, stock: 150, threshold: 15, category: "Personal Care", visible: true },
];

export default function ProductsPage() {
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-in" data-delay="1">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Products</h1>
          <p className="text-sm text-text-secondary mt-1">{products.length} products in catalogue</p>
        </div>
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild>
            <Button variant="glow" size="sm" className="gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Product Name</Label>
                  <Input placeholder="e.g., Sugar 1kg" />
                </div>
                <div className="space-y-2">
                  <Label>Unit</Label>
                  <Input placeholder="e.g., bag, kg" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Price (Rs)</Label>
                  <Input type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label>Stock Quantity</Label>
                  <Input type="number" placeholder="0" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grocery">Grocery</SelectItem>
                    <SelectItem value="beverages">Beverages</SelectItem>
                    <SelectItem value="snacks">Snacks</SelectItem>
                    <SelectItem value="household">Household</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="glow" className="w-full">Add Product</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card className="glass animate-in" data-delay="2">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
            <Input placeholder="Search products..." className="pl-10" />
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product, index) => {
          const isLow = product.stock <= product.threshold;
          return (
            <Card key={product.id} className="glass group animate-in" data-delay={index + 3}>
              <CardContent className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-2">
                    <Package className="h-5 w-5 text-text-secondary" />
                  </div>
                  <div className="flex gap-1">
                    {product.visible ? (
                      <Badge variant="success" size="sm">Visible</Badge>
                    ) : (
                      <Badge variant="error" size="sm">Hidden</Badge>
                    )}
                  </div>
                </div>

                {/* Info */}
                <h3 className="font-semibold text-foreground text-sm mb-1">{product.name}</h3>
                <Badge variant="default" size="sm" className="mb-3">{product.category}</Badge>

                {/* Price & Stock */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-text-tertiary">Price</span>
                    <span className="text-lg font-bold font-mono tabular-nums text-primary">
                      Rs {product.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-text-tertiary">Stock</span>
                    <span className={`text-sm font-mono font-semibold ${isLow ? "text-warning" : "text-foreground"}`}>
                      {product.stock} {product.unit}
                      {isLow && " ⚠️"}
                    </span>
                  </div>
                  {isLow && (
                    <div className="flex items-center gap-1 text-[10px] text-warning">
                      <AlertTriangle className="h-3 w-3" />
                      Below threshold ({product.threshold})
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-3 border-t border-border/30">
                  <Button variant="glass" size="sm" className="flex-1 text-xs">
                    <Edit className="mr-1 h-3 w-3" />
                    Edit
                  </Button>
                  <Button variant="glass" size="sm" className="flex-1 text-xs">
                    {product.visible ? <EyeOff className="mr-1 h-3 w-3" /> : <Eye className="mr-1 h-3 w-3" />}
                    {product.visible ? "Hide" : "Show"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
