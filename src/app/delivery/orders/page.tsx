'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Truck, MapPin, Phone, ChevronRight, Package, Clock, Loader2 } from 'lucide-react';
import Link from 'next/link';

type DeliveryOrder = {
  id: string;
  status: string;
  placedAt: string;
  shop: {
    id: string;
    shopName: string;
    ownerName: string;
    phone: string;
    addressText: string;
    addressLat: string | null;
    addressLng: string | null;
  };
  deliveryAssignment?: {
    status: string;
    assignedAt: string;
  } | null;
  _count: {
    items: number;
  };
};

export default function DeliveryOrdersPage() {
  const [deliveries, setDeliveries] = useState<DeliveryOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDeliveries = async () => {
      try {
        const res = await fetch('/api/delivery/orders', { cache: 'no-store' });
        if (!res.ok) {
          return;
        }

        const data = await res.json();
        setDeliveries(data.orders ?? []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadDeliveries();
  }, []);

  const pendingDeliveries = useMemo(
    () =>
      deliveries.filter(
        (delivery) => (delivery.deliveryAssignment?.status ?? delivery.status) === 'pending'
      ),
    [deliveries]
  );

  const inTransit = useMemo(
    () =>
      deliveries.filter((delivery) => {
        const deliveryStatus = delivery.deliveryAssignment?.status ?? delivery.status;
        return deliveryStatus === 'picked_up' || deliveryStatus === 'out_for_delivery';
      }),
    [deliveries]
  );

  const deliveredToday = useMemo(
    () =>
      deliveries.filter(
        (delivery) => (delivery.deliveryAssignment?.status ?? delivery.status) === 'delivered'
      ),
    [deliveries]
  );

  const getMapsUrl = (delivery: DeliveryOrder) => {
    const lat = delivery.shop.addressLat ? Number.parseFloat(delivery.shop.addressLat) : Number.NaN;
    const lng = delivery.shop.addressLng ? Number.parseFloat(delivery.shop.addressLng) : Number.NaN;

    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    }

    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(delivery.shop.addressText)}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="portal-page">
      <div className="portal-header">
        <h1 className="portal-title">My Deliveries</h1>
        <p className="portal-subtitle">
          {pendingDeliveries.length} pending • {inTransit.length} in transit
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingDeliveries.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
            <Truck className="h-4 w-4 text-delivery" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inTransit.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered Today</CardTitle>
            <Package className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deliveredToday.length}</div>
          </CardContent>
        </Card>
      </div>

      {deliveries.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No active deliveries assigned right now.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {deliveries.map((delivery) => {
            const deliveryStatus = delivery.deliveryAssignment?.status ?? delivery.status;

            return (
              <Card key={delivery.id}>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{delivery.shop.shopName}</h3>
                        <Badge
                          className={
                            deliveryStatus === 'pending'
                              ? 'bg-warning-soft text-warning'
                              : 'bg-delivery-soft text-delivery'
                          }
                        >
                          {deliveryStatus.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Package className="h-4 w-4" />
                          {delivery._count.items} items
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {new Date(
                            delivery.deliveryAssignment?.assignedAt ?? delivery.placedAt
                          ).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{delivery.shop.addressText}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:flex-col">
                      <Button size="sm"  asChild>
                        <a href={`tel:${delivery.shop.phone}`}>
                          <Phone className="mr-1 h-4 w-4" />
                          Call
                        </a>
                      </Button>
                      <Button size="sm"  asChild>
                        <a href={getMapsUrl(delivery)} target="_blank" rel="noreferrer">
                          <MapPin className="mr-1 h-4 w-4" />
                          Maps
                        </a>
                      </Button>
                      <Button size="sm" asChild>
                        <Link href={`/delivery/orders/${delivery.id}`}>
                          View Details
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
