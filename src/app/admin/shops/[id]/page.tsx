"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, User, Phone, MapPin, Mail, AlertTriangle, TrendingUp } from "lucide-react";

interface ShopDetail {
  id: string;
  shopName: string;
  ownerName: string;
  phone: string;
  addressText: string;
  balance: number;
  creditLimit: number;
  paymentDeadline: string | null;
  isActive: boolean;
  orderMenuDisabled: boolean;
  disableReason: string | null;
  registrationStatus: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
    last_login_at: string | null;
  };
  orders: {
    id: string;
    status: string;
    totalAmount: number;
    placedAt: string;
    items: { product: { name: string }; quantity: number }[];
  }[];
  ledgerEntries: {
    id: string;
    type: string;
    amount: number;
    balanceAfter: number;
    note: string | null;
    recordedAt: string;
  }[];
  disputes: {
    id: string;
    type: string;
    status: string;
    reason: string;
    filedAt: string;
  }[];
}

export default function ShopDetailPage() {
  const params = useParams();
  const shopId = params.id as string;
  const [shop, setShop] = useState<ShopDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchShop();
  }, [shopId]);

  const fetchShop = async () => {
    try {
      const res = await fetch(`/api/admin/shops?id=${shopId}`);
      if (res.ok) {
        setShop(await res.json());
      } else {
        setError("Shop not found");
      }
    } catch (e) {
      setError("Failed to load shop");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !shop) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error || "Shop not found"}</AlertDescription>
      </Alert>
    );
  }

  const utilizationPercent = (
    (parseFloat(shop.balance.toString()) / parseFloat(shop.creditLimit.toString())) *
    100
  ).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{shop.shopName}</h1>
          <p className="text-muted-foreground">
            {shop.ownerName} • Registered {new Date(shop.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={shop.isActive ? "badge-success" : "bg-error-soft text-error"}>
            {shop.isActive ? "Active" : "Suspended"}
          </Badge>
          <Badge className={
            shop.registrationStatus === "approved" ? "badge-success" :
            shop.registrationStatus === "pending" ? "bg-warning-soft text-warning" :
            "bg-error-soft text-error"
          }>
            {shop.registrationStatus}
          </Badge>
        </div>
      </div>

      {/* Profile & Balance Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{shop.user.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{shop.phone}</span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
              <span>{shop.addressText}</span>
            </div>
            <div className="pt-2 text-xs text-muted-foreground">
              Last login: {shop.user.last_login_at ? new Date(shop.user.last_login_at).toLocaleString() : "Never"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Financial Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Current Balance</span>
              <span className="font-bold tabular-nums">
                Rs {parseFloat(shop.balance.toString()).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Credit Limit</span>
              <span className="font-bold tabular-nums">
                Rs {parseFloat(shop.creditLimit.toString()).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Utilization</span>
              <span className="font-bold tabular-nums">{utilizationPercent}%</span>
            </div>
            {shop.paymentDeadline && (
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Payment Deadline</span>
                <span className="font-medium">
                  {new Date(shop.paymentDeadline).toLocaleDateString()}
                </span>
              </div>
            )}
            {shop.orderMenuDisabled && (
              <Alert variant="destructive" className="mt-2">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Ordering disabled: {shop.disableReason || "No reason given"}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="orders">
        <TabsList>
          <TabsTrigger value="orders">Orders ({shop.orders.length})</TabsTrigger>
          <TabsTrigger value="ledger">Ledger ({shop.ledgerEntries.length})</TabsTrigger>
          <TabsTrigger value="disputes">Disputes ({shop.disputes.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-3 mt-4">
          {shop.orders.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No orders yet.</p>
          ) : (
            shop.orders.map((order) => (
              <div key={order.id} className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono text-sm">#{order.id.slice(0, 8)}</span>
                    <Badge className="ml-2">
                      {order.status.replace(/_/g, " ")}
                    </Badge>
                  </div>
                  <span className="font-semibold tabular-nums">
                    Rs {parseFloat(order.totalAmount.toString()).toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {order.items.map((i) => `${i.product.name} x${i.quantity}`).join(", ")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(order.placedAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </TabsContent>

        <TabsContent value="ledger" className="space-y-3 mt-4">
          {shop.ledgerEntries.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No ledger entries.</p>
          ) : (
            shop.ledgerEntries.map((entry) => (
              <div key={entry.id} className="rounded-lg border p-4 flex items-center justify-between">
                <div>
                  <Badge variant={entry.type === "debit" ? "error" : "secondary"}>
                    {entry.type.toUpperCase()}
                  </Badge>
                  {entry.note && (
                    <p className="text-xs text-muted-foreground mt-1">{entry.note}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {new Date(entry.recordedAt).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold tabular-nums">
                    Rs {parseFloat(entry.amount.toString()).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    After: Rs {parseFloat(entry.balanceAfter.toString()).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </TabsContent>

        <TabsContent value="disputes" className="space-y-3 mt-4">
          {shop.disputes.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No disputes filed.</p>
          ) : (
            shop.disputes.map((dispute) => (
              <div key={dispute.id} className="rounded-lg border p-4">
                <div className="flex items-center gap-2">
                  <Badge className={
                    dispute.status === "open" ? "bg-error-soft text-error" :
                    dispute.status === "resolved" ? "badge-success" :
                    "badge-info"
                  }>
                    {dispute.status}
                  </Badge>
                  <span className="text-sm font-medium">{dispute.type.replace(/_/g, " ")}</span>
                </div>
                <p className="text-sm mt-1">{dispute.reason}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Filed: {new Date(dispute.filedAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
