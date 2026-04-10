import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Truck, Phone, MapPin, Clock, Package, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

const deliveries = [
  { id: "DEL-001", shopName: "Al-Falah Store", shopPhone: "+92-300-1234567", address: "Shop 12, Main Bazaar, Lahore", items: 5, status: "pending", priority: "urgent", assignedAt: "30 min ago" },
  { id: "DEL-002", shopName: "City Mart", shopPhone: "+92-321-7654321", address: "Plot 45, Commercial Area, Karachi", items: 3, status: "pending", priority: "normal", assignedAt: "1 hour ago" },
  { id: "DEL-003", shopName: "Royal Traders", shopPhone: "+92-333-9876543", address: "Lane 7, Sector F-8, Islamabad", items: 8, status: "picked_up", priority: "normal", assignedAt: "2 hours ago" },
];

const stats = { pending: 2, inTransit: 1, deliveredToday: 4 };

export default function DeliveryDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-in" data-delay="1">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">My Deliveries</h1>
        <p className="text-sm text-text-secondary mt-1">{stats.pending} pending • {stats.inTransit} in transit</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3 animate-in" data-delay="2">
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-text-tertiary uppercase tracking-wider">Pending</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono text-foreground">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-text-tertiary uppercase tracking-wider">In Transit</CardTitle>
            <Truck className="h-4 w-4 text-delivery" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono text-foreground">{stats.inTransit}</div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-text-tertiary uppercase tracking-wider">Delivered Today</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono text-foreground">{stats.deliveredToday}</div>
          </CardContent>
        </Card>
      </div>

      {/* Delivery Cards */}
      <div className="space-y-4">
        {deliveries.map((delivery, index) => (
          <Card key={delivery.id} className="glass animate-in" data-delay={index + 3}>
            <CardContent className="p-5">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Left: Info */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-foreground">{delivery.shopName}</h3>
                    <Badge variant={delivery.priority === "urgent" ? "error" : "info"} size="sm">
                      {delivery.priority === "urgent" ? "Urgent" : "Normal"}
                    </Badge>
                    <Badge variant={delivery.status === "pending" ? "warning" : "delivery"} size="sm">
                      {delivery.status === "pending" ? "Pending" : "Picked Up"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-text-secondary">
                    <span className="flex items-center gap-1.5">
                      <Package className="h-3.5 w-3.5 text-text-tertiary" />
                      {delivery.items} items
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-text-tertiary" />
                      {delivery.assignedAt}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                    <MapPin className="h-3.5 w-3.5 text-text-tertiary" />
                    {delivery.address}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex flex-col sm:flex-row gap-2 lg:flex-col">
                  <a href={`tel:${delivery.shopPhone}`}>
                    <Button variant="glass" size="sm" className="w-full gap-1.5">
                      <Phone className="h-3.5 w-3.5" />
                      Call
                    </Button>
                  </a>
                  <Button variant="glass" size="sm" className="w-full gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    Maps
                  </Button>
                  <Link href={`/delivery/orders/${delivery.id}`}>
                    <Button variant="glow" size="sm" className="w-full gap-1.5">
                      View Details
                      <Truck className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
