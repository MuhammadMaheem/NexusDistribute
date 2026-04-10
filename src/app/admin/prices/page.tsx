"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tag, TrendingUp, Calendar, Clock, Plus, Loader2 } from "lucide-react";
import { useState } from "react";

const priceHistory = [
  { id: 1, product: "Sugar 1kg", oldPrice: 110, newPrice: 120, reason: "Market increase", date: "07 Apr, 10:00 am" },
  { id: 2, product: "Rice 5kg", oldPrice: 800, newPrice: 850, reason: "Supplier change", date: "06 Apr, 03:00 pm" },
  { id: 3, product: "Tea 200g", oldPrice: 320, newPrice: 350, reason: "Seasonal adjustment", date: "05 Apr, 09:00 am" },
];

const currentPrices = [
  { id: "P-001", name: "Sugar 1kg", price: 120 },
  { id: "P-002", name: "Rice 5kg", price: 850 },
  { id: "P-003", name: "Flour 10kg", price: 650 },
  { id: "P-004", name: "Cooking Oil 5L", price: 1800 },
  { id: "P-005", name: "Tea 200g", price: 350 },
  { id: "P-006", name: "Juice 1L", price: 180 },
];

export default function PricesPage() {
  const [showUpdate, setShowUpdate] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [newPrice, setNewPrice] = useState("");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-in" data-delay="1">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Price Management</h1>
          <p className="text-sm text-text-secondary mt-1">Update prices and view history</p>
        </div>
        <Button variant="glow" size="sm" className="gap-1.5" onClick={() => setShowUpdate(!showUpdate)}>
          <Tag className="h-3.5 w-3.5" />
          Update Price
        </Button>
      </div>

      {/* Update Price Form */}
      {showUpdate && (
        <Card className="glass animate-scale-in border-primary/30">
          <CardContent className="pt-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Product</Label>
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger>
                  <SelectContent>
                    {currentPrices.map(p => <SelectItem key={p.id} value={p.id}>{p.name} (Rs {p.price})</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>New Price (Rs)</Label>
                <Input type="number" value={newPrice} onChange={e => setNewPrice(e.target.value)} placeholder="Enter new price" />
              </div>
              <div className="flex items-end">
                <Button variant="glow" className="w-full">Update Price</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Price History */}
      <Card className="glass animate-in" data-delay="2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-4 w-4 text-primary" />
            Price History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {priceHistory.length === 0 ? (
            <p className="text-center py-8 text-text-secondary">No price changes yet.</p>
          ) : (
            <div className="space-y-3">
              {priceHistory.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between rounded-lg border border-border/30 bg-surface-2/20 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-2">
                      <Tag className="h-4 w-4 text-text-tertiary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{entry.product}</p>
                      {entry.reason && <p className="text-xs text-text-tertiary">{entry.reason}</p>}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-text-tertiary line-through">Rs {entry.oldPrice.toLocaleString()}</span>
                      <span className="text-text-tertiary">→</span>
                      <span className="font-semibold font-mono text-primary">Rs {entry.newPrice.toLocaleString()}</span>
                    </div>
                    <p className="text-[10px] text-text-tertiary flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3" />
                      {entry.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Prices */}
      <Card className="glass animate-in" data-delay="3">
        <CardHeader><CardTitle className="text-base">Current Prices</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {currentPrices.map(product => (
              <div key={product.id} className="flex items-center justify-between rounded-lg border border-border/30 bg-surface-2/20 px-4 py-3">
                <span className="text-sm font-medium text-foreground">{product.name}</span>
                <span className="font-bold font-mono tabular-nums text-primary">Rs {product.price.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
