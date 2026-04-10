import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Package,
  Users,
  ShoppingCart,
  AlertTriangle,
  TrendingUp,
  Truck,
  Clock,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const stats = {
  revenueToday: 125000,
  revenueWeek: 780000,
  revenueMonth: 3200000,
  outstandingBalance: 1450000,
  activeOrders: 23,
  pendingReview: 5,
  lowStockItems: 8,
  expiringDeadlines: 3,
};

const recentActivity = [
  { id: 1, type: "order", message: "New order #ORD-001 from Al-Falah Store", time: "2 min ago", status: "pending" },
  { id: 2, type: "payment", message: "Payment of Rs 25,000 received from City Mart", time: "15 min ago", status: "credit" },
  { id: 3, type: "delivery", message: "Order #ORD-098 delivered by Ahmed", time: "1 hour ago", status: "delivered" },
  { id: 4, type: "review", message: "Order #ORD-102 flagged for review (over limit)", time: "2 hours ago", status: "warning" },
  { id: 5, type: "order", message: "Order #ORD-099 merged with #ORD-100", time: "3 hours ago", status: "info" },
];

const topShops = [
  { name: "Al-Falah Store", orders: 45, revenue: 280000, balance: 120000, limit: 200000 },
  { name: "City Mart", orders: 38, revenue: 245000, balance: 85000, limit: 200000 },
  { name: "Royal Traders", orders: 32, revenue: 198000, balance: 160000, limit: 200000 },
  { name: "Green Valley", orders: 28, revenue: 175000, balance: 45000, limit: 200000 },
  { name: "Metro Supplies", orders: 25, revenue: 162000, balance: 92000, limit: 200000 },
];

function ActivityIcon({ type }: { type: string }) {
  const icons: Record<string, React.ReactNode> = {
    order: <ShoppingCart className="h-4 w-4 text-primary" />,
    payment: <TrendingUp className="h-4 w-4 text-success" />,
    delivery: <Truck className="h-4 w-4 text-delivery" />,
    review: <AlertTriangle className="h-4 w-4 text-warning" />,
  };
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-2/50">
      {icons[type] || <Package className="h-4 w-4 text-text-tertiary" />}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    pending: "warning",
    credit: "success",
    delivered: "success",
    warning: "warning",
    info: "info",
  };
  return (
    <Badge variant={(variants[status] as any) || "default"}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-in" data-delay="1">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-sm text-text-secondary mt-1">Overview of your distribution platform</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Revenue Today */}
        <Card className="glass animate-in" data-delay="2" glow>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-text-secondary uppercase tracking-wider">Revenue Today</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono tabular-nums text-foreground">
              Rs {stats.revenueToday.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3 text-success" />
              <p className="text-xs text-success">12% from yesterday</p>
            </div>
          </CardContent>
        </Card>

        {/* Outstanding Balance */}
        <Card className="glass animate-in" data-delay="3" glow>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-text-secondary uppercase tracking-wider">Outstanding</CardTitle>
            <Users className="h-4 w-4 text-admin" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono tabular-nums text-foreground">
              Rs {stats.outstandingBalance.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <ArrowDownRight className="h-3 w-3 text-error" />
              <p className="text-xs text-error">5% from last week</p>
            </div>
          </CardContent>
        </Card>

        {/* Active Orders */}
        <Card className="glass animate-in" data-delay="4" glow>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-text-secondary uppercase tracking-wider">Active Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-shop" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono tabular-nums text-foreground">{stats.activeOrders}</div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="warning" size="sm">
                {stats.pendingReview} in review
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card className="glass animate-in" data-delay="5" glow>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-text-secondary uppercase tracking-wider">Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div>
                <div className="text-lg font-bold font-mono tabular-nums text-foreground">{stats.lowStockItems}</div>
                <p className="text-[10px] text-text-tertiary uppercase tracking-wider">Low Stock</p>
              </div>
              <div>
                <div className="text-lg font-bold font-mono tabular-nums text-foreground">{stats.expiringDeadlines}</div>
                <p className="text-[10px] text-text-tertiary uppercase tracking-wider">Expiring</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Activity */}
      <div className="grid gap-4 lg:grid-cols-7">
        {/* Placeholder Chart */}
        <Card className="glass lg:col-span-4 animate-in" data-delay="6">
          <CardHeader>
            <CardTitle className="text-base">Monthly Revenue</CardTitle>
            <CardDescription className="text-xs">Revenue per day for the current month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-[280px] items-end gap-1">
              {Array.from({ length: 28 }, (_, i) => {
                const height = 20 + Math.random() * 80;
                return (
                  <div
                    key={i}
                    className="flex-1 rounded-t-sm bg-gradient-to-t from-primary/60 to-primary/20 hover:from-primary hover:to-primary/40 transition-all duration-200 cursor-pointer"
                    style={{ height: `${height}%` }}
                    title={`Day ${i + 1}`}
                  />
                );
              })}
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-text-tertiary">
              <span>Week 1</span>
              <span>Week 2</span>
              <span>Week 3</span>
              <span>Week 4</span>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="glass lg:col-span-3 animate-in" data-delay="7">
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
            <CardDescription className="text-xs">Last 5 events across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((item) => (
                <div key={item.id} className="flex items-start gap-3">
                  <ActivityIcon type={item.type} />
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <p className="text-sm text-foreground truncate">{item.message}</p>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-text-tertiary" />
                      <span className="text-xs text-text-tertiary">{item.time}</span>
                    </div>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Shops */}
      <Card className="glass animate-in" data-delay="8">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Top Shops</CardTitle>
            <CardDescription className="text-xs">Shops ranked by monthly order volume</CardDescription>
          </div>
          <Button variant="glass" size="sm" className="gap-1">
            View All
            <ChevronRight className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topShops.map((shop, i) => {
              const utilization = (shop.balance / shop.limit) * 100;
              return (
                <div
                  key={shop.name}
                  className="flex items-center justify-between rounded-lg border border-border/30 bg-surface-2/20 p-3 hover:bg-surface-2/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-surface-2 text-xs font-bold text-text-secondary">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{shop.name}</p>
                      <p className="text-xs text-text-tertiary">{shop.orders} orders • Rs {shop.revenue.toLocaleString()} revenue</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold font-mono tabular-nums text-foreground">
                      Rs {shop.balance.toLocaleString()}
                    </p>
                    <Progress value={utilization} variant={utilization > 80 ? "warning" : "shop"} className="h-1 w-20 mt-1" />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
