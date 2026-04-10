import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Phone, Mail, MapPin, Lock } from "lucide-react";

export default function ShopProfilePage() {
  return (
    <div className="space-y-6">
      <div className="animate-in" data-delay="1">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Profile</h1>
        <p className="text-sm text-text-secondary mt-1">Manage your account settings</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Shop Info */}
        <Card className="glass animate-in" data-delay="2">
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><User className="h-4 w-4 text-shop" />Shop Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-shop to-shop/60 text-white font-bold text-xl">A</div>
              <div><p className="font-semibold text-foreground">Al-Falah Store</p><p className="text-sm text-text-secondary">Ahmed Khan</p></div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm"><Phone className="h-4 w-4 text-text-tertiary" /><span className="text-foreground">+92-300-1234567</span></div>
              <div className="flex items-center gap-2 text-sm"><Mail className="h-4 w-4 text-text-tertiary" /><span className="text-foreground">shop1@test.com</span></div>
              <div className="flex items-start gap-2 text-sm"><MapPin className="h-4 w-4 text-text-tertiary mt-0.5" /><span className="text-foreground">Shop 12, Main Bazaar, Lahore</span></div>
            </div>
            <Button variant="glass" className="w-full">Edit Profile</Button>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="glass animate-in" data-delay="3">
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Lock className="h-4 w-4 text-shop" />Security</CardTitle></CardHeader>
          <CardContent className="space-y-4">
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
