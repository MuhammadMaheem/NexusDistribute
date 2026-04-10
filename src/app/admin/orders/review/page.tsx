"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, Loader2, AlertTriangle, Package, Users, Clock, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";

const reviewItems = [
  {
    id: "REV-001",
    orderId: "ORD-102",
    shopName: "Al-Falah Store",
    owner: "Ahmed Khan",
    reason: "Order total exceeds credit limit",
    balance: 185000,
    creditLimit: 200000,
    orderTotal: 25000,
    projectedBalance: 210000,
    utilization: 92.5,
    items: [
      { name: "Sugar 1kg", qty: 20, price: 120, subtotal: 2400 },
      { name: "Rice 5kg", qty: 5, price: 850, subtotal: 4250 },
      { name: "Cooking Oil 5L", qty: 8, price: 1800, subtotal: 14400 },
    ],
    createdAt: "2 hours ago",
  },
  {
    id: "REV-002",
    orderId: "ORD-105",
    shopName: "Royal Traders",
    owner: "Bilal Ahmed",
    reason: "BNPL order flagged for review",
    balance: 190000,
    creditLimit: 200000,
    orderTotal: 15000,
    projectedBalance: 205000,
    utilization: 85,
    items: [
      { name: "Flour 10kg", qty: 10, price: 650, subtotal: 6500 },
      { name: "Tea 200g", qty: 15, price: 350, subtotal: 5250 },
    ],
    createdAt: "4 hours ago",
  },
];

export default function ReviewQueuePage() {
  const [items, setItems] = useState(reviewItems);
  const [processing, setProcessing] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({});

  const handleAction = async (id: string, action: "approve" | "reject") => {
    setProcessing(id);
    await new Promise((r) => setTimeout(r, 800));
    setItems((prev) => prev.filter((item) => item.id !== id));
    setProcessing(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-in" data-delay="1">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Review Queue</h1>
        <p className="text-sm text-text-secondary mt-1">{items.length} orders awaiting your decision</p>
      </div>

      {/* Empty State */}
      {items.length === 0 ? (
        <Card className="glass animate-scale-in">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
              <CheckCircle2 className="h-10 w-10 text-success" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-semibold text-foreground">All caught up!</h3>
              <p className="text-sm text-text-secondary mt-1">No orders pending review.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => (
            <Card key={item.id} className="glass animate-in border-warning/30" data-delay={index + 2}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                      <AlertTriangle className="h-5 w-5 text-warning" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{item.shopName}</CardTitle>
                      <CardDescription className="text-xs">{item.owner} • {item.createdAt}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="warning">
                    Over Limit
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Financial Overview */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="rounded-lg border border-border/30 bg-surface-2/30 p-3">
                    <p className="text-[10px] uppercase tracking-wider text-text-tertiary font-semibold">Current Balance</p>
                    <p className="text-lg font-bold font-mono tabular-nums text-foreground mt-1">
                      Rs {item.balance.toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border/30 bg-surface-2/30 p-3">
                    <p className="text-[10px] uppercase tracking-wider text-text-tertiary font-semibold">Credit Limit</p>
                    <p className="text-lg font-bold font-mono tabular-nums text-foreground mt-1">
                      Rs {item.creditLimit.toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-lg border border-delivery/30 bg-delivery-soft/30 p-3">
                    <p className="text-[10px] uppercase tracking-wider text-delivery font-semibold">Order Total</p>
                    <p className="text-lg font-bold font-mono tabular-nums text-delivery mt-1">
                      Rs {item.orderTotal.toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-lg border border-error/30 bg-error-soft/30 p-3">
                    <p className="text-[10px] uppercase tracking-wider text-error font-semibold">Projected</p>
                    <p className="text-lg font-bold font-mono tabular-nums text-error mt-1">
                      Rs {item.projectedBalance.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-error/70 mt-0.5">{item.utilization}% utilization</p>
                  </div>
                </div>

                {/* Credit Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-text-tertiary">Credit Utilization</span>
                    <span className="font-mono font-semibold text-error">{item.utilization}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-surface-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-warning to-error transition-all duration-500"
                      style={{ width: `${Math.min(item.utilization, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-2 flex items-center gap-2">
                    <Package className="h-3.5 w-3.5" />
                    Order Items ({item.items.length})
                  </h4>
                  <div className="rounded-lg border border-border/30 divide-y divide-border/20">
                    {item.items.map((orderItem, i) => (
                      <div key={i} className="flex items-center justify-between px-4 py-2.5">
                        <span className="text-sm font-medium text-foreground">{orderItem.name}</span>
                        <span className="text-xs text-text-secondary font-mono">
                          {orderItem.qty} × Rs {orderItem.price.toLocaleString()}
                        </span>
                        <span className="text-sm font-semibold font-mono tabular-nums text-foreground">
                          Rs {orderItem.subtotal.toLocaleString()}
                        </span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between px-4 py-3 bg-surface-2/30">
                      <span className="text-sm font-semibold text-foreground">Total</span>
                      <span className="text-sm font-bold font-mono tabular-nums text-foreground">
                        Rs {item.orderTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Admin Note */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">Admin Note (optional)</label>
                  <textarea
                    className="w-full h-16 rounded-lg border border-border/50 bg-surface-2/50 px-3 py-2 text-sm text-foreground placeholder:text-text-tertiary focus:border-ring/60 focus:outline-none focus:ring-2 focus:ring-ring/10 resize-none transition-all"
                    placeholder="Add a note for the shop owner..."
                    value={adminNotes[item.id] || ""}
                    onChange={(e) => setAdminNotes((prev) => ({ ...prev, [item.id]: e.target.value }))}
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-1">
                  <Button
                    variant="success"
                    className="flex-1 h-10"
                    onClick={() => handleAction(item.id, "approve")}
                    disabled={processing === item.id}
                  >
                    {processing === item.id ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="mr-2 h-4 w-4" />
                    )}
                    Approve & Debit Balance
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1 h-10"
                    onClick={() => handleAction(item.id, "reject")}
                    disabled={processing === item.id}
                  >
                    {processing === item.id ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <XCircle className="mr-2 h-4 w-4" />
                    )}
                    Reject Order
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
