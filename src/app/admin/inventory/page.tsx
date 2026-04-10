"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Package, AlertTriangle, TrendingUp, Plus, Loader2 } from "lucide-react";
import { useState } from "react";

const products = [
  { id: "P-001", name: "Sugar 1kg", stock: 500, threshold: 20, unit: "bag", visible: true, category: "Grocery" },
  { id: "P-002", name: "Rice 5kg", stock: 200, threshold: 20, unit: "bag", visible: true, category: "Grocery" },
  { id: "P-003", name: "Flour 10kg", stock: 150, threshold: 20, unit: "bag", visible: true, category: "Grocery" },
  { id: "P-004", name: "Cooking Oil 5L", stock: 100, threshold: 10, unit: "bottle", visible: true, category: "Grocery" },
  { id: "P-005", name: "Tea 200g", stock: 300, threshold: 20, unit: "box", visible: true, category: "Beverages" },
  { id: "P-006", name: "Juice 1L", stock: 250, threshold: 20, unit: "bottle", visible: true, category: "Beverages" },
  { id: "P-007", name: "Water 1.5L", stock: 1000, threshold: 50, unit: "bottle", visible: true, category: "Beverages" },
  { id: "P-008", name: "Chips 100g", stock: 400, threshold: 30, unit: "piece", visible: true, category: "Snacks" },
  { id: "P-009", name: "Biscuit Pack", stock: 350, threshold: 30, unit: "box", visible: true, category: "Snacks" },
  { id: "P-010", name: "Detergent 1kg", stock: 180, threshold: 15, unit: "bag", visible: true, category: "Household" },
  { id: "P-011", name: "Soap Bar", stock: 500, threshold: 20, unit: "piece", visible: true, category: "Personal Care" },
  { id: "P-012", name: "Shampoo 200ml", stock: 150, threshold: 15, unit: "bottle", visible: true, category: "Personal Care" },
];

export default function InventoryPage() {
  const [adjustId, setAdjustId] = useState<string | null>(null);
  const [adjustQty, setAdjustQty] = useState("");
  const [adjustReason, setAdjustReason] = useState("");

  const lowStock = products.filter(p => p.stock <= p.threshold);
  const totalStock = products.reduce((s, p) => s + p.stock, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-in" data-delay="1">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Inventory</h1>
        <p className="text-sm text-text-secondary mt-1">{products.length} products • {totalStock.toLocaleString()} total units</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3 animate-in" data-delay="2">
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-text-tertiary uppercase tracking-wider">Total Products</CardTitle>
            <Package className="h-4 w-4 text-text-tertiary" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold font-mono text-foreground">{products.length}</div></CardContent>
        </Card>
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-text-tertiary uppercase tracking-wider">Total Units</CardTitle>
            <TrendingUp className="h-4 w-4 text-text-tertiary" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold font-mono tabular-nums text-foreground">{totalStock.toLocaleString()}</div></CardContent>
        </Card>
        <Card className={`glass ${lowStock.length > 0 ? "border-warning/40" : ""}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-text-tertiary uppercase tracking-wider">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold font-mono text-foreground">{lowStock.length}</div></CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {lowStock.length > 0 && (
        <Card className="glass animate-in border-warning/30" data-delay="3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning text-base">
              <AlertTriangle className="h-4 w-4" />
              Low Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStock.map(product => (
                <div key={product.id} className="flex items-center justify-between rounded-lg border border-warning/20 bg-warning/5 px-4 py-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground text-sm">{product.name}</span>
                      <Badge variant="warning" size="sm">Low</Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-xs text-text-secondary">{product.stock} / {product.threshold} min</span>
                      <Progress value={(product.stock / (product.threshold * 3)) * 100} variant="warning" className="h-1.5 w-24" />
                    </div>
                  </div>
                  <Button variant="glass" size="sm" onClick={() => setAdjustId(product.id)}>Adjust</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Products */}
      <Card className="glass animate-in" data-delay="4">
        <CardHeader><CardTitle className="text-base">All Products Stock</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {products.map(product => {
              const isLow = product.stock <= product.threshold;
              return (
                <div key={product.id} className={`flex items-center justify-between rounded-lg border px-4 py-3 ${isLow ? "border-warning/30 bg-warning/5" : "border-border/30 bg-surface-2/20"}`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground text-sm">{product.name}</span>
                      {isLow && <Badge variant="warning" size="sm">Low</Badge>}
                      {!product.visible && <Badge variant="default" size="sm">Hidden</Badge>}
                    </div>
                    <p className="text-[10px] text-text-tertiary mt-0.5">{product.stock} {product.unit} • Threshold: {product.threshold}</p>
                  </div>
                  <Button variant="glass" size="sm" onClick={() => setAdjustId(product.id)}>Edit</Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Adjust Dialog */}
      <Dialog open={!!adjustId} onOpenChange={open => !open && setAdjustId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Adjust Stock</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>New Stock Quantity</Label><Input type="number" value={adjustQty} onChange={e => setAdjustQty(e.target.value)} placeholder="Enter quantity" /></div>
            <div className="space-y-2"><Label>Reason</Label><Input value={adjustReason} onChange={e => setAdjustReason(e.target.value)} placeholder="e.g., New shipment received" /></div>
            <Button variant="glow" className="w-full" onClick={() => setAdjustId(null)}>Update Stock</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
