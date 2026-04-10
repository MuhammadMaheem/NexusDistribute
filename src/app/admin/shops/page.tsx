import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Search, Eye, Plus, Mail, Phone, MapPin } from "lucide-react";

const shops = [
  { id: "SHP-001", name: "Al-Falah Store", owner: "Ahmed Khan", phone: "+92-300-1234567", balance: 120000, limit: 200000, status: "approved", orders: 45, active: true },
  { id: "SHP-002", name: "City Mart", owner: "Sara Ali", phone: "+92-321-7654321", balance: 85000, limit: 200000, status: "approved", orders: 38, active: true },
  { id: "SHP-003", name: "Royal Traders", owner: "Bilal Ahmed", phone: "+92-333-9876543", balance: 190000, limit: 200000, status: "approved", orders: 32, active: true },
  { id: "SHP-004", name: "Green Valley", owner: "Fatima Noor", phone: "+92-345-1112222", balance: 45000, limit: 200000, status: "pending", orders: 0, active: false },
  { id: "SHP-005", name: "Metro Supplies", owner: "Hassan Raza", phone: "+92-312-3334444", balance: 92000, limit: 200000, status: "approved", orders: 25, active: true },
];

export default function ShopsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-in" data-delay="1">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Shops</h1>
          <p className="text-sm text-text-secondary mt-1">{shops.length} registered shops</p>
        </div>
        <Button variant="glow" size="sm" className="gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          Add Shop
        </Button>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2 animate-in" data-delay="2">
        <Button variant="glow" size="sm">All ({shops.length})</Button>
        <Button variant="glass" size="sm">Active ({shops.filter(s => s.active).length})</Button>
        <Button variant="glass" size="sm">Pending ({shops.filter(s => s.status === "pending").length})</Button>
        <Button variant="glass" size="sm">Over Limit ({shops.filter(s => s.balance > s.limit * 0.8).length})</Button>
      </div>

      {/* Search */}
      <Card className="glass animate-in" data-delay="3">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
            <Input placeholder="Search by shop name, owner, or phone..." className="pl-10" />
          </div>
        </CardContent>
      </Card>

      {/* Shop Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shops.map((shop, index) => {
          const utilization = (shop.balance / shop.limit) * 100;
          return (
            <Card key={shop.id} className="glass animate-in group hover:border-admin/30 transition-all duration-300" data-delay={index + 4}>
              <CardContent className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-shop to-shop/60 text-white font-bold text-sm">
                      {shop.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm">{shop.name}</h3>
                      <p className="text-xs text-text-tertiary">{shop.owner}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Badge variant={shop.status === "approved" ? "success" : "warning"} size="sm">
                      {shop.status}
                    </Badge>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <Phone className="h-3 w-3 text-text-tertiary" />
                    {shop.phone}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <MapPin className="h-3 w-3 text-text-tertiary" />
                    {shop.orders} orders
                  </div>
                </div>

                {/* Credit Utilization */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-text-tertiary">Balance</span>
                    <span className="font-mono font-semibold text-foreground">Rs {shop.balance.toLocaleString()}</span>
                  </div>
                  <Progress value={utilization} variant={utilization > 80 ? "warning" : "shop"} className="h-1.5" />
                  <div className="flex justify-between text-[10px]">
                    <span className="text-text-tertiary">{utilization.toFixed(0)}% utilized</span>
                    <span className="text-text-tertiary">Limit: Rs {shop.limit.toLocaleString()}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="glass" size="sm" className="flex-1 text-xs">
                    <Eye className="mr-1.5 h-3 w-3" />
                    View
                  </Button>
                  <Button variant="glass" size="sm" className="flex-1 text-xs">
                    <Mail className="mr-1.5 h-3 w-3" />
                    Message
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
