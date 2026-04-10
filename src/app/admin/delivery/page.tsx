"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Truck, Plus, Phone, Loader2 } from "lucide-react";
import { useState } from "react";

const persons = [
  { id: "DP-001", name: "Ahmed Delivery", phone: "+92-300-9998888", vehicle: "Honda CD 70 - Red", available: true },
  { id: "DP-002", name: "Ali Rider", phone: "+92-321-8887777", vehicle: "Yamaha YBR - Blue", available: false },
];

const orders = [
  { id: "ORD-101", shop: "Al-Falah Store", status: "approved" },
  { id: "ORD-102", shop: "City Mart", status: "approved" },
];

export default function DeliveryPage() {
  const [showAdd, setShowAdd] = useState(false);
  const [newPerson, setNewPerson] = useState({ name: "", phone: "", vehicle: "" });
  const [assignOrder, setAssignOrder] = useState("");
  const [assignPerson, setAssignPerson] = useState("");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-in" data-delay="1">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Delivery Management</h1>
          <p className="text-sm text-text-secondary mt-1">{persons.length} delivery persons • {orders.length} orders awaiting assignment</p>
        </div>
        <Button variant="glow" size="sm" className="gap-1.5" onClick={() => setShowAdd(!showAdd)}>
          <Plus className="h-3.5 w-3.5" />
          Add Person
        </Button>
      </div>

      {/* Add Person Form */}
      {showAdd && (
        <Card className="glass animate-scale-in border-primary/30">
          <CardContent className="pt-6">
            <div className="grid gap-4 sm:grid-cols-4">
              <div className="space-y-2"><Label>Name</Label><Input value={newPerson.name} onChange={e => setNewPerson({...newPerson, name: e.target.value})} /></div>
              <div className="space-y-2"><Label>Phone</Label><Input value={newPerson.phone} onChange={e => setNewPerson({...newPerson, phone: e.target.value})} /></div>
              <div className="space-y-2"><Label>Vehicle</Label><Input value={newPerson.vehicle} onChange={e => setNewPerson({...newPerson, vehicle: e.target.value})} placeholder="e.g., Honda CD 70" /></div>
              <div className="flex items-end"><Button variant="glow" className="w-full" onClick={() => setShowAdd(false)}>Add</Button></div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Assign Order */}
      {orders.length > 0 && persons.some(p => p.available) && (
        <Card className="glass animate-in" data-delay="2">
          <CardHeader><CardTitle className="text-base">Assign Delivery</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 items-end">
              <div className="space-y-2 flex-1 min-w-[180px]">
                <Label>Order</Label>
                <Select value={assignOrder} onValueChange={setAssignOrder}>
                  <SelectTrigger><SelectValue placeholder="Select order" /></SelectTrigger>
                  <SelectContent>{orders.map(o => <SelectItem key={o.id} value={o.id}>#{o.id.slice(-6)} - {o.shop}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2 flex-1 min-w-[180px]">
                <Label>Person</Label>
                <Select value={assignPerson} onValueChange={setAssignPerson}>
                  <SelectTrigger><SelectValue placeholder="Select person" /></SelectTrigger>
                  <SelectContent>{persons.filter(p => p.available).map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <Button variant="glow">Assign</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delivery Persons */}
      <Card className="glass animate-in" data-delay="3">
        <CardHeader><CardTitle className="text-base">Delivery Persons</CardTitle></CardHeader>
        <CardContent>
          {persons.length === 0 ? (
            <p className="text-center py-12 text-text-secondary">No delivery persons added yet.</p>
          ) : (
            <div className="space-y-3">
              {persons.map((person) => (
                <div key={person.id} className="flex items-center justify-between rounded-lg border border-border/30 bg-surface-2/20 px-5 py-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-delivery/10">
                      <Truck className="h-5 w-5 text-delivery" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{person.name}</p>
                      <div className="flex items-center gap-3 text-xs text-text-secondary mt-0.5">
                        <span className="flex items-center gap-1"><Phone className="h-3 w-3 text-text-tertiary" />{person.phone}</span>
                        {person.vehicle && <span>{person.vehicle}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={person.available ? "success" : "error"}>{person.available ? "Available" : "Unavailable"}</Badge>
                    <Button variant="glass" size="sm" onClick={() => {}}>Toggle</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
