"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Phone, Truck, Lock } from "lucide-react";
import { useState } from "react";

export default function DeliveryProfilePage() {
  const [isAvailable, setIsAvailable] = useState(true);

  return (
    <div className="space-y-6">
      <div className="animate-in" data-delay="1">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Profile</h1>
        <p className="text-sm text-text-secondary mt-1">Manage your delivery profile</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Personal Info */}
        <Card className="glass animate-in" data-delay="2">
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><User className="h-4 w-4 text-delivery" />Personal Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-delivery to-delivery/60 text-white font-bold text-xl">A</div>
              <div>
                <p className="font-semibold text-foreground">Ahmed Delivery</p>
                <Badge variant={isAvailable ? "success" : "error"}>{isAvailable ? "Available" : "Unavailable"}</Badge>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm"><Phone className="h-4 w-4 text-text-tertiary" /><span className="text-foreground">+92-300-9998888</span></div>
              <div className="flex items-center gap-2 text-sm"><Truck className="h-4 w-4 text-text-tertiary" /><span className="text-foreground">Honda CD 70 - Red</span></div>
            </div>
            <div className="flex gap-2">
              <Button variant={isAvailable ? "glow" : "glass"} className="flex-1" onClick={() => setIsAvailable(true)}>Set Available</Button>
              <Button variant={!isAvailable ? "destructive" : "glass"} className="flex-1" onClick={() => setIsAvailable(false)}>Set Unavailable</Button>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="glass animate-in" data-delay="3">
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Lock className="h-4 w-4 text-delivery" />Security</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label className="text-xs">Email</Label><Input defaultValue="delivery@nexusdistribute.com" disabled /></div>
            <div className="space-y-2"><Label className="text-xs">Current Password</Label><Input type="password" placeholder="Enter current password" /></div>
            <div className="space-y-2"><Label className="text-xs">New Password</Label><Input type="password" placeholder="Enter new password" /></div>
            <div className="space-y-2"><Label className="text-xs">Confirm New Password</Label><Input type="password" placeholder="Confirm new password" /></div>
            <Button variant="glow" className="w-full">Update Password</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
