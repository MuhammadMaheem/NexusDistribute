"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Settings as SettingsIcon, CheckCircle, Loader2, Truck, Megaphone, AlertTriangle } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    mergeWindow: "60",
    creditLimit: "200000",
    paymentDays: "30",
    lowStockThreshold: "20",
    platformName: "NexusDistribute",
    discountCodes: "true",
    twoFactor: "false",
  });

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-in" data-delay="1">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Settings</h1>
          <p className="text-sm text-text-secondary mt-1">Platform configuration and preferences</p>
        </div>
        {saved && (
          <Alert className="w-auto border-success/30 bg-success-soft/20">
            <CheckCircle className="h-4 w-4 text-success" />
            <AlertDescription className="text-success text-sm">Settings saved!</AlertDescription>
          </Alert>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Order Settings */}
        <Card className="glass animate-in" data-delay="2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <SettingsIcon className="h-4 w-4 text-primary" />
              Order Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs">Order Merge Window (minutes)</Label>
              <Input value={settings.mergeWindow} onChange={e => setSettings({...settings, mergeWindow: e.target.value})} type="number" />
              <p className="text-[10px] text-text-tertiary">Orders from the same shop within this window auto-merge</p>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Default Credit Limit (Rs)</Label>
              <Input value={settings.creditLimit} onChange={e => setSettings({...settings, creditLimit: e.target.value})} type="number" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Default Payment Days</Label>
              <Input value={settings.paymentDays} onChange={e => setSettings({...settings, paymentDays: e.target.value})} type="number" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Low Stock Default Threshold</Label>
              <Input value={settings.lowStockThreshold} onChange={e => setSettings({...settings, lowStockThreshold: e.target.value})} type="number" />
            </div>
          </CardContent>
        </Card>

        {/* Platform Settings */}
        <Card className="glass animate-in" data-delay="3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <SettingsIcon className="h-4 w-4 text-primary" />
              Platform Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs">Platform Name</Label>
              <Input value={settings.platformName} onChange={e => setSettings({...settings, platformName: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Discount Codes</Label>
              <div className="flex gap-2">
                <Button variant={settings.discountCodes === "true" ? "glow" : "glass"} size="sm" onClick={() => setSettings({...settings, discountCodes: "true"})}>Enabled</Button>
                <Button variant={settings.discountCodes === "false" ? "glow" : "glass"} size="sm" onClick={() => setSettings({...settings, discountCodes: "false"})}>Disabled</Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Two-Factor Authentication</Label>
              <div className="flex gap-2">
                <Button variant={settings.twoFactor === "true" ? "glow" : "glass"} size="sm" onClick={() => setSettings({...settings, twoFactor: "true"})}>Enabled</Button>
                <Button variant={settings.twoFactor === "false" ? "glow" : "glass"} size="sm" onClick={() => setSettings({...settings, twoFactor: "false"})}>Disabled</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end animate-in" data-delay="4">
        <Button variant="glow" onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Settings
        </Button>
      </div>
    </div>
  );
}
