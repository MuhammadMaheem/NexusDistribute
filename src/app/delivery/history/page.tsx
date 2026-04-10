import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Camera, Calendar, Truck } from "lucide-react";
import Link from "next/link";

const deliveries = [
  { id: "DEL-001", shopName: "Al-Falah Store", items: 5, date: "Today", proofUrl: "#" },
  { id: "DEL-002", shopName: "City Mart", items: 3, date: "Today", proofUrl: "#" },
  { id: "DEL-003", shopName: "Royal Traders", items: 8, date: "Yesterday", proofUrl: "#" },
  { id: "DEL-004", shopName: "Green Valley", items: 2, date: "Yesterday", proofUrl: "#" },
];

export default function DeliveryHistoryPage() {
  return (
    <div className="space-y-6">
      <div className="animate-in" data-delay="1">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Delivery History</h1>
        <p className="text-sm text-text-secondary mt-1">{deliveries.length} deliveries completed</p>
      </div>

      <Card className="glass animate-in" data-delay="2">
        <CardHeader><CardTitle className="text-base">Completed Deliveries</CardTitle></CardHeader>
        <CardContent>
          {deliveries.length === 0 ? (
            <p className="text-center py-12 text-text-secondary">No deliveries yet.</p>
          ) : (
            <div className="space-y-3">
              {deliveries.map(d => (
                <Link key={d.id} href={`/delivery/orders/${d.id}`}>
                  <div className="rounded-lg border border-border/30 bg-surface-2/20 p-4 hover:bg-surface-2/40 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                          <CheckCircle2 className="h-5 w-5 text-success" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-sm">{d.shopName}</p>
                          <div className="flex items-center gap-3 text-xs text-text-secondary mt-0.5">
                            <span>{d.items} items</span>
                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3 text-text-tertiary" />{d.date}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="success">Delivered</Badge>
                        <Camera className="h-4 w-4 text-text-tertiary" />
                      </div>
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
