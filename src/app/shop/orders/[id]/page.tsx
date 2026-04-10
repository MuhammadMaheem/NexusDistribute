import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Package, Truck, CheckCircle2, Clock, AlertTriangle } from "lucide-react";

const order = {
  id: "ORD-001",
  status: "processing",
  totalAmount: 12500,
  placedAt: "2026-04-07T14:00:00",
  paymentType: "bnpl",
  items: [
    { product: { name: "Sugar 1kg" }, quantity: 10, unitPriceAtOrder: 120, subtotal: 1200 },
    { product: { name: "Rice 5kg" }, quantity: 3, unitPriceAtOrder: 850, subtotal: 2550 },
    { product: { name: "Tea 200g" }, quantity: 5, unitPriceAtOrder: 350, subtotal: 1750 },
  ],
};

const statusSteps = ["pending", "approved", "processing", "dispatched", "out_for_delivery", "delivered"];
const currentStep = statusSteps.indexOf(order.status);

export default function OrderDetailPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-in" data-delay="1">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Order #{order.id.slice(-6)}</h1>
        <p className="text-sm text-text-secondary mt-1">Placed {new Date(order.placedAt).toLocaleString()}</p>
      </div>

      {/* Status Timeline */}
      <Card className="glass animate-in" data-delay="2">
        <CardHeader><CardTitle className="text-base">Order Status</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            {statusSteps.map((step, i) => {
              const isActive = i <= currentStep;
              const isCurrent = i === currentStep;
              return (
                <div key={step} className="flex flex-col items-center flex-1">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${isActive ? "bg-shop text-white shadow-[0_0_12px_hsl(var(--shop-glow)/0.3)]" : "bg-surface-2 text-text-tertiary"} ${isCurrent ? "ring-2 ring-shop ring-offset-2 ring-offset-background" : ""}`}>
                    {isActive ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                  </div>
                  <span className="text-[10px] mt-1.5 capitalize text-center text-text-secondary">{step.replace(/_/g, " ")}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card className="glass animate-in" data-delay="3">
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Package className="h-4 w-4 text-shop" />Order Items</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-border/30 bg-surface-2/20 px-4 py-3">
                <div>
                  <p className="font-medium text-foreground text-sm">{item.product.name}</p>
                  <p className="text-xs text-text-secondary">{item.quantity} × Rs {item.unitPriceAtOrder.toLocaleString()}</p>
                </div>
                <span className="font-semibold font-mono tabular-nums text-foreground">Rs {item.subtotal.toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-border/30 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="font-mono tabular-nums text-primary">Rs {order.totalAmount.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      {/* Cancel Button */}
      {["pending", "admin_review", "approved", "processing"].includes(order.status) && (
        <div className="animate-in" data-delay="4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>You can cancel this order. Once dispatched, cancellation is not possible.</AlertDescription>
          </Alert>
          <Button variant="destructive" className="mt-3">Cancel Order</Button>
        </div>
      )}
    </div>
  );
}
