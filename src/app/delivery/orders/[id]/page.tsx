"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, MapPin, Package, Camera, CheckCircle2, AlertTriangle, Loader2, Clock } from "lucide-react";
import { useState } from "react";

export default function DeliveryOrderDetailPage() {
  const [status, setStatus] = useState<"pending" | "picked_up" | "delivered">("pending");
  const [loading, setLoading] = useState(false);
  const [showProof, setShowProof] = useState(false);

  const order = {
    id: "DEL-001",
    shopName: "Al-Falah Store",
    shopPhone: "+92-300-1234567",
    address: "Shop 12, Main Bazaar, Lahore",
    items: [
      { name: "Sugar 1kg", quantity: 10 },
      { name: "Rice 5kg", quantity: 3 },
      { name: "Tea 200g", quantity: 5 },
    ],
  };

  const handlePickup = async () => { setLoading(true); await new Promise(r => setTimeout(r, 800)); setStatus("picked_up"); setLoading(false); };
  const handleDeliver = async () => { setLoading(true); await new Promise(r => setTimeout(r, 800)); setStatus("delivered"); setLoading(false); };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-in" data-delay="1">
        <div className="flex items-center gap-3">
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Delivery #{order.id}</h1>
          <Badge variant={status === "pending" ? "warning" : status === "picked_up" ? "delivery" : "success"}>
            {status === "pending" ? "Pending Pickup" : status === "picked_up" ? "In Transit" : "Delivered"}
          </Badge>
        </div>
      </div>

      {/* Shop Info */}
      <Card className="glass animate-in" data-delay="2">
        <CardHeader><CardTitle className="text-base">Delivery Details</CardTitle></CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-shop/10">
              <Package className="h-6 w-6 text-shop" />
            </div>
            <div>
              <p className="font-semibold text-foreground">{order.shopName}</p>
              <a href={`tel:${order.shopPhone}`} className="text-sm text-shop flex items-center gap-1.5 hover:underline">
                <Phone className="h-3.5 w-3.5" />
                {order.shopPhone}
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-text-tertiary mt-0.5" />
            <div>
              <p className="font-medium text-foreground">{order.address}</p>
              <Button variant="glass" size="sm" className="mt-2 gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                Open in Maps
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Items */}
      <Card className="glass animate-in" data-delay="3">
        <CardHeader><CardTitle className="text-base">Items ({order.items.length})</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-border/30 bg-surface-2/20 px-4 py-3">
                <span className="font-medium text-foreground text-sm">{item.name}</span>
                <Badge variant="default" size="sm">×{item.quantity}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      {status === "pending" && (
        <div className="space-y-3 animate-in" data-delay="4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-sm">Verify all items before marking as picked up.</AlertDescription>
          </Alert>
          <Button variant="glow" size="lg" className="w-full" onClick={handlePickup} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
            Mark as Picked Up
          </Button>
        </div>
      )}

      {status === "picked_up" && (
        <div className="space-y-3 animate-in" data-delay="4">
          {!showProof ? (
            <Button variant="glow" size="lg" className="w-full gap-2" onClick={() => setShowProof(true)}>
              <Camera className="h-4 w-4" />
              Upload Proof Photo
            </Button>
          ) : (
            <Card className="glass">
              <CardContent className="space-y-4 pt-6">
                <div className="rounded-xl border-2 border-dashed border-border/40 p-10 text-center">
                  <Camera className="h-10 w-10 mx-auto text-text-tertiary" />
                  <p className="text-sm text-text-secondary mt-3">Camera would open here</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Delivery Notes (optional)</Label>
                  <Input placeholder="e.g., Left at counter" />
                </div>
                <Button variant="success" size="lg" className="w-full gap-2" onClick={handleDeliver} disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                  Mark as Delivered
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {status === "delivered" && (
        <Alert className="bg-success-soft/30 border-success/30 animate-scale-in">
          <CheckCircle2 className="h-4 w-4 text-success" />
          <AlertDescription className="text-success text-sm font-medium">Delivery completed successfully!</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
