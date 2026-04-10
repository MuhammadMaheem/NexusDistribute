"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShoppingCart, Trash2, Minus, Plus, Tag, Loader2, AlertTriangle } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const cartItems = [
  { id: "P-001", name: "Sugar 1kg", price: 120, unit: "bag", qty: 10, minOrder: 1 },
  { id: "P-002", name: "Rice 5kg", price: 850, unit: "bag", qty: 3, minOrder: 1 },
  { id: "P-005", name: "Tea 200g", price: 350, unit: "box", qty: 5, minOrder: 1 },
];

export default function CartPage() {
  const [items, setItems] = useState(cartItems);
  const [paymentType, setPaymentType] = useState<"pay_now" | "bnpl">("bnpl");
  const [placing, setPlacing] = useState(false);
  const [discount, setDiscount] = useState("");

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);

  if (items.length === 0) {
    return (
      <div className="space-y-6 animate-in">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Shopping Cart</h1>
        <Card className="glass">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-surface-2">
              <ShoppingCart className="h-10 w-10 text-text-tertiary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Your cart is empty</p>
              <p className="text-sm text-text-secondary mt-1">Browse products and add items to get started</p>
            </div>
            <Button variant="glow" asChild><Link href="/shop/products">Browse Products</Link></Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-in" data-delay="1">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Shopping Cart</h1>
        <p className="text-sm text-text-secondary mt-1">{items.length} items</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item, index) => (
            <Card key={item.id} className="glass animate-in" data-delay={index + 2}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{item.name}</h3>
                    <p className="text-sm text-text-secondary mt-0.5">
                      Rs {item.price.toLocaleString()} / {item.unit}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <Button variant="glass" size="icon-sm" onClick={() => {
                        if (item.qty <= 1) setItems(prev => prev.filter(i => i.id !== item.id));
                        else setItems(prev => prev.map(i => i.id === item.id ? { ...i, qty: i.qty - 1 } : i));
                      }}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center font-bold font-mono text-foreground">{item.qty}</span>
                      <Button variant="glass" size="icon-sm" onClick={() => setItems(prev => prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i))}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <span className="font-bold font-mono tabular-nums text-foreground w-24 text-right">
                      Rs {(item.price * item.qty).toLocaleString()}
                    </span>
                    <Button variant="ghost" size="icon-sm" className="text-text-tertiary hover:text-error" onClick={() => setItems(prev => prev.filter(i => i.id !== item.id))}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="space-y-4">
          <Card className="glass animate-in sticky top-20" data-delay="5">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-text-tertiary">Subtotal</span>
                  <span className="font-mono tabular-nums text-foreground">Rs {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-border/30">
                  <span>Total</span>
                  <span className="font-mono tabular-nums text-primary">Rs {subtotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Discount */}
              <div className="space-y-2">
                <Label className="text-xs">Discount Code</Label>
                <div className="flex gap-2">
                  <Input value={discount} onChange={e => setDiscount(e.target.value)} placeholder="Enter code" className="h-9" />
                  <Button variant="glass" size="sm">Apply</Button>
                </div>
              </div>

              {/* Payment Type */}
              <div className="space-y-2">
                <Label className="text-xs">Payment Type</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant={paymentType === "pay_now" ? "glow" : "glass"} size="sm" onClick={() => setPaymentType("pay_now")}>Pay Now</Button>
                  <Button variant={paymentType === "bnpl" ? "glow" : "glass"} size="sm" onClick={() => setPaymentType("bnpl")}>BNPL</Button>
                </div>
              </div>

              <Button variant="glow" size="lg" className="w-full" disabled={placing} onClick={() => setPlacing(true)}>
                {placing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Placing Order...</> : `Place Order — Rs ${subtotal.toLocaleString()}`}
              </Button>

              {paymentType === "bnpl" && (
                <p className="text-[10px] text-text-tertiary text-center">
                  Amount will be added to your balance. Admin approval if over limit.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
