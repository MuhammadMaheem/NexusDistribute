"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Wallet, ShoppingCart, Clock, AlertTriangle, Megaphone, ChevronRight, TrendingUp, Package } from "lucide-react";
import Link from "next/link";

const balance = { current: 145000, limit: 200000, utilization: 72.5, deadline: "2026-04-20" };
const activeOrders = [
  { id: "ORD-001", status: "processing", items: 5, total: 12500, placedAt: "2 hours ago" },
  { id: "ORD-002", status: "dispatched", items: 3, total: 8200, placedAt: "1 day ago" },
  { id: "ORD-003", status: "pending", items: 8, total: 23400, placedAt: "30 min ago" },
];
const announcements = [
  { id: 1, title: "Price Change Effective Tomorrow", date: "Today", unread: true },
  { id: 2, title: "New Products Added to Catalogue", date: "Yesterday", unread: false },
];

function getStatusColor(status: string) {
  if (status === "delivered") return "success";
  if (status === "processing" || status === "dispatched") return "info";
  if (status === "pending") return "warning";
  if (status === "out_for_delivery") return "delivery";
  return "default";
}

export default function ShopDashboard() {
  return (
    <div className="space-y-6">
      <div className="animate-in" data-delay="1">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-sm text-text-secondary mt-1">Welcome back! Here&apos;s your account overview.</p>
      </div>

      {/* Balance Card */}
      <Card className="glass animate-in border-shop/20" data-delay="2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <Wallet className="h-5 w-5 text-shop" />
              Account Balance
            </CardTitle>
            <CardDescription className="text-xs mt-1">Your credit utilization</CardDescription>
          </div>
          <Badge variant="success">Healthy</Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold font-mono tabular-nums text-foreground">
                Rs {balance.current.toLocaleString()}
              </p>
              <p className="text-sm text-text-tertiary mt-1">
                of Rs {balance.limit.toLocaleString()} credit limit
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-text-tertiary uppercase tracking-wider font-semibold">Payment Deadline</p>
              <p className="text-lg font-bold font-mono tabular-nums text-foreground mt-1">
                {new Date(balance.deadline).toLocaleDateString("en-PK", { day: "2-digit", month: "short", year: "numeric" })}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-text-tertiary">Credit Used</span>
              <span className="font-mono font-semibold text-shop">{balance.utilization.toFixed(1)}%</span>
            </div>
            <Progress value={balance.utilization} variant="shop" className="h-2" />
          </div>
          <Badge variant="shop">Credit Remaining: Rs {(balance.limit - balance.current).toLocaleString()}</Badge>
        </CardContent>
      </Card>

      {/* Active Orders & Announcements */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Active Orders */}
        <Card className="glass animate-in" data-delay="3">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <ShoppingCart className="h-4 w-4 text-shop" />
                Active Orders
              </CardTitle>
              <CardDescription className="text-xs">{activeOrders.length} orders in progress</CardDescription>
            </div>
            <Link href="/shop/orders">
              <Button variant="glass" size="sm">
                View All
                <ChevronRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-2.5">
              {activeOrders.map((order) => (
                <Link key={order.id} href={`/shop/orders/${order.id}`}>
                  <div className="rounded-lg border border-border/30 bg-surface-2/20 p-3 hover:bg-surface-2/40 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-text-secondary">{order.id}</span>
                        <Badge variant={getStatusColor(order.status) as any}>
                          {order.status.replace(/_/g, " ")}
                        </Badge>
                      </div>
                      <span className="font-mono font-semibold text-sm tabular-nums text-foreground">
                        Rs {order.total.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-[10px] text-text-tertiary mt-1.5">
                      {order.items} items &bull; Placed {order.placedAt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Announcements */}
        <Card className="glass animate-in" data-delay="4">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <Megaphone className="h-4 w-4 text-shop" />
                Announcements
              </CardTitle>
              <CardDescription className="text-xs">Latest updates</CardDescription>
            </div>
            <Link href="/shop/announcements">
              <Button variant="glass" size="sm">
                View All
                <ChevronRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-2.5">
              {announcements.map((item) => (
                <div key={item.id} className="rounded-lg border border-border/30 bg-surface-2/20 p-3">
                  <div className="flex items-center gap-2">
                    {item.unread && <span className="h-1.5 w-1.5 rounded-full bg-shop shadow-[0_0_6px_hsl(var(--shop-glow)/0.6)]" />}
                    <p className="text-sm font-medium text-foreground">{item.title}</p>
                  </div>
                  <p className="text-[10px] text-text-tertiary mt-1">{item.date}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="glass animate-in" data-delay="5">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link href="/shop/products">
              <div className="group flex flex-col items-center gap-2 rounded-xl border border-border/30 bg-surface-2/20 p-4 hover:bg-surface-2/40 hover:border-border-glow/40 transition-all duration-300 cursor-pointer">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-shop/10 group-hover:shadow-[0_0_12px_hsl(var(--shop-glow)/0.2)] transition-shadow">
                  <ShoppingCart className="h-5 w-5 text-shop" />
                </div>
                <span className="text-xs font-medium text-text-secondary group-hover:text-foreground transition-colors">Order Now</span>
              </div>
            </Link>
            <Link href="/shop/orders">
              <div className="group flex flex-col items-center gap-2 rounded-xl border border-border/30 bg-surface-2/20 p-4 hover:bg-surface-2/40 hover:border-border-glow/40 transition-all duration-300 cursor-pointer">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10 group-hover:shadow-[0_0_12px_hsl(var(--info-glow)/0.2)] transition-shadow">
                  <Clock className="h-5 w-5 text-info" />
                </div>
                <span className="text-xs font-medium text-text-secondary group-hover:text-foreground transition-colors">My Orders</span>
              </div>
            </Link>
            <Link href="/shop/balance">
              <div className="group flex flex-col items-center gap-2 rounded-xl border border-border/30 bg-surface-2/20 p-4 hover:bg-surface-2/40 hover:border-border-glow/40 transition-all duration-300 cursor-pointer">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-admin/10 group-hover:shadow-[0_0_12px_hsl(var(--admin-glow)/0.2)] transition-shadow">
                  <Wallet className="h-5 w-5 text-admin" />
                </div>
                <span className="text-xs font-medium text-text-secondary group-hover:text-foreground transition-colors">Balance</span>
              </div>
            </Link>
            <Link href="/shop/chat">
              <div className="group flex flex-col items-center gap-2 rounded-xl border border-border/30 bg-surface-2/20 p-4 hover:bg-surface-2/40 hover:border-border-glow/40 transition-all duration-300 cursor-pointer">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-delivery/10 group-hover:shadow-[0_0_12px_hsl(var(--delivery-glow)/0.2)] transition-shadow">
                  <Megaphone className="h-5 w-5 text-delivery" />
                </div>
                <span className="text-xs font-medium text-text-secondary group-hover:text-foreground transition-colors">Chat</span>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
