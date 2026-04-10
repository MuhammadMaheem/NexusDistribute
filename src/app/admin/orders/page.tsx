import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Filter,
  ChevronRight,
  Eye,
  ArrowUpDown,
  Download,
  Package,
  Clock,
} from "lucide-react";

const orders = [
  { id: "#53ab14d0", shop: "Al-Falah Store", owner: "Ahmed Khan", items: 3, amount: 5620, placedAt: "07 Apr, 06:44 pm", status: "pending", paymentType: "bnpl" },
  { id: "#fb3ef01d", shop: "Al-Falah Store", owner: "Ahmed Khan", items: 3, amount: 5620, placedAt: "07 Apr, 05:21 pm", status: "pending", paymentType: "bnpl" },
  { id: "#a2c4e8f1", shop: "City Mart", owner: "Sara Ali", items: 5, amount: 12400, placedAt: "07 Apr, 03:15 pm", status: "processing", paymentType: "pay_now" },
  { id: "#d7b9c3e2", shop: "Royal Traders", owner: "Bilal Ahmed", items: 2, amount: 3200, placedAt: "06 Apr, 11:30 am", status: "dispatched", paymentType: "bnpl" },
  { id: "#e1f5a8d3", shop: "Green Valley", owner: "Fatima Noor", items: 7, amount: 18900, placedAt: "06 Apr, 09:00 am", status: "delivered", paymentType: "bnpl" },
];

const statusCounts = { all: 47, pending: 12, processing: 8, dispatched: 5, out_for_delivery: 3, delivered: 15, cancelled: 2, rejected: 2 };

function getStatusBadge(status: string) {
  const map: Record<string, string> = {
    pending: "warning",
    admin_review: "warning",
    approved: "info",
    processing: "info",
    dispatched: "delivery",
    out_for_delivery: "delivery",
    delivered: "success",
    cancelled: "error",
    rejected: "error",
  };
  return map[status] || "default";
}

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-in" data-delay="1">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Order Management</h1>
          <p className="text-sm text-text-secondary mt-1">{statusCounts.all} orders total</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="glass" size="sm" className="gap-1.5">
            <Download className="h-3.5 w-3.5" />
            Export
          </Button>
          <Button variant="glass" size="sm" className="gap-1.5">
            <Filter className="h-3.5 w-3.5" />
            Filters
          </Button>
        </div>
      </div>

      {/* Stats Pills */}
      <div className="flex flex-wrap gap-2 animate-in" data-delay="2">
        {Object.entries(statusCounts).map(([key, count]) => (
          <Button
            key={key}
            variant={key === "all" ? "glow" : "glass"}
            size="sm"
            className="gap-1.5"
          >
            {key === "all" ? "All" : key.replace(/_/g, " ")}
            <span className="text-[10px] opacity-60">{count}</span>
          </Button>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <Card className="glass animate-in" data-delay="3">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
              <Input placeholder="Search orders..." className="pl-10" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="dispatched">Dispatched</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="newest">
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="amount-high">Amount: High → Low</SelectItem>
                <SelectItem value="amount-low">Amount: Low → High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="glass animate-in" data-delay="4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Orders</CardTitle>
              <CardDescription className="text-xs">Showing {orders.length} of {statusCounts.all} orders</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="h-11 px-5 text-left text-xs font-semibold uppercase tracking-wider text-text-tertiary">Order ID</th>
                  <th className="h-11 px-5 text-left text-xs font-semibold uppercase tracking-wider text-text-tertiary">Shop</th>
                  <th className="h-11 px-5 text-left text-xs font-semibold uppercase tracking-wider text-text-tertiary">Items</th>
                  <th className="h-11 px-5 text-right text-xs font-semibold uppercase tracking-wider text-text-tertiary">Amount</th>
                  <th className="h-11 px-5 text-left text-xs font-semibold uppercase tracking-wider text-text-tertiary">Placed At</th>
                  <th className="h-11 px-5 text-center text-xs font-semibold uppercase tracking-wider text-text-tertiary">Status</th>
                  <th className="h-11 px-5 text-center text-xs font-semibold uppercase tracking-wider text-text-tertiary">Type</th>
                  <th className="h-11 px-5 text-right text-xs font-semibold uppercase tracking-wider text-text-tertiary"></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="table-row-glass">
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-xs text-text-secondary">{order.id}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-foreground text-sm">{order.shop}</p>
                      <p className="text-xs text-text-tertiary">{order.owner}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant="default" size="sm">
                        <Package className="h-3 w-3 mr-1" />
                        {order.items} Products
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="font-mono font-semibold text-foreground text-sm">Rs {order.amount.toLocaleString()}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="flex items-center gap-1.5 text-xs text-text-secondary">
                        <Clock className="h-3 w-3" />
                        {order.placedAt}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <Badge variant={getStatusBadge(order.status) as any}>
                        {order.status.replace(/_/g, " ")}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <Badge variant={order.paymentType === "bnpl" ? "admin" : "default"}>
                        {order.paymentType === "bnpl" ? "BNPL" : "Pay Now"}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Button variant="ghost" size="icon-sm" className="text-text-tertiary hover:text-foreground">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
