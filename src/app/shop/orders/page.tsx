import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Package, TrendingUp } from "lucide-react";
import Link from "next/link";

const orders = [
  { id: "ORD-001", status: "processing", items: 5, total: 12500, placedAt: "2 hours ago" },
  { id: "ORD-002", status: "dispatched", items: 3, total: 8200, placedAt: "1 day ago" },
  { id: "ORD-003", status: "pending", items: 8, total: 23400, placedAt: "30 min ago" },
  { id: "ORD-004", status: "delivered", items: 2, total: 5600, placedAt: "3 days ago" },
];

function statusVariant(status: string): "warning" | "info" | "delivery" | "success" | "error" | "default" {
  const map: Record<string, "warning" | "info" | "delivery" | "success" | "error" | "default"> = { pending: "warning", processing: "info", dispatched: "delivery", delivered: "success", cancelled: "error", rejected: "error" };
  return map[status] || "default";
}

export default function ShopOrdersPage() {
  return (
    <div className="space-y-6">
      <div className="animate-in" data-delay="1">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">My Orders</h1>
        <p className="text-sm text-text-secondary mt-1">{orders.length} orders</p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-3 animate-in" data-delay="2">
        <Card className="glass"><CardContent className="p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10"><Clock className="h-5 w-5 text-warning" /></div><div><p className="text-2xl font-bold font-mono text-foreground">{orders.filter(o => o.status === "pending").length}</p><p className="text-xs text-text-tertiary">Pending</p></div></div></CardContent></Card>
        <Card className="glass"><CardContent className="p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10"><Package className="h-5 w-5 text-info" /></div><div><p className="text-2xl font-bold font-mono text-foreground">{orders.filter(o => ["processing","dispatched"].includes(o.status)).length}</p><p className="text-xs text-text-tertiary">In Progress</p></div></div></CardContent></Card>
        <Card className="glass"><CardContent className="p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10"><TrendingUp className="h-5 w-5 text-success" /></div><div><p className="text-2xl font-bold font-mono text-foreground">{orders.filter(o => o.status === "delivered").length}</p><p className="text-xs text-text-tertiary">Delivered</p></div></div></CardContent></Card>
      </div>

      {/* Orders List */}
      <Card className="glass animate-in" data-delay="3">
        <CardHeader><CardTitle className="text-base">Order History</CardTitle></CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-text-secondary">No orders yet.</p>
              <Button variant="glow" className="mt-4" asChild><Link href="/shop/products">Browse Products</Link></Button>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map(order => (
                <Link key={order.id} href={`/shop/orders/${order.id}`}>
                  <div className="rounded-lg border border-border/30 bg-surface-2/20 p-4 hover:bg-surface-2/40 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-text-secondary">#{order.id.slice(-6)}</span>
                          <Badge variant={statusVariant(order.status)} size="sm">{order.status.replace(/_/g, " ")}</Badge>
                        </div>
                        <p className="text-sm text-text-secondary mt-1">{order.items} items • {order.placedAt}</p>
                      </div>
                      <p className="font-bold font-mono tabular-nums text-foreground">Rs {order.total.toLocaleString()}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
