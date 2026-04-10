"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Megaphone, Plus, Calendar, CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";

const announcements = [
  { id: 1, title: "Price Change Effective Tomorrow", body: "Sugar prices will increase by Rs 10/kg starting April 8th.", sendTo: "all", date: "Today" },
  { id: 2, title: "New Products Added", body: "We've added 5 new products to the catalogue. Check them out!", sendTo: "all", date: "Yesterday" },
  { id: 3, title: "Holiday Schedule", body: "We will be closed on April 14th for the holiday.", sendTo: "specific", date: "3 days ago" },
];

export default function AnnouncementsPage() {
  const [showCompose, setShowCompose] = useState(false);
  const [newAnn, setNewAnn] = useState({ title: "", body: "", sendTo: "all" });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-in" data-delay="1">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Announcements</h1>
          <p className="text-sm text-text-secondary mt-1">{announcements.length} announcements sent</p>
        </div>
        <Dialog open={showCompose} onOpenChange={setShowCompose}>
          <DialogTrigger asChild>
            <Button variant="glow" size="sm" className="gap-1.5"><Plus className="h-3.5 w-3.5" />Compose</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Send Announcement</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Title</Label><Input value={newAnn.title} onChange={e => setNewAnn({...newAnn, title: e.target.value})} placeholder="Announcement title" /></div>
              <div className="space-y-2"><Label>Message</Label><Textarea value={newAnn.body} onChange={e => setNewAnn({...newAnn, body: e.target.value})} placeholder="Write your announcement..." rows={4} /></div>
              <div className="space-y-2"><Label>Send To</Label>
                <Select value={newAnn.sendTo} onValueChange={v => setNewAnn({...newAnn, sendTo: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="all">All Shops</SelectItem><SelectItem value="specific">Specific Shops</SelectItem></SelectContent>
                </Select>
              </div>
              <Button variant="glow" className="w-full gap-1.5"><Megaphone className="h-4 w-4" />Send Announcement</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Announcement History */}
      <Card className="glass animate-in" data-delay="2">
        <CardHeader><CardTitle className="text-base">Announcement History</CardTitle></CardHeader>
        <CardContent>
          {announcements.length === 0 ? (
            <p className="text-center py-12 text-text-secondary">No announcements sent yet.</p>
          ) : (
            <div className="space-y-3">
              {announcements.map((ann) => (
                <div key={ann.id} className="rounded-lg border border-border/30 bg-surface-2/20 p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground text-sm">{ann.title}</h3>
                    <Badge variant="default" size="sm">{ann.sendTo === "all" ? "All Shops" : "Specific"}</Badge>
                  </div>
                  <p className="text-sm text-text-secondary mt-2">{ann.body}</p>
                  <div className="flex items-center gap-1.5 text-[10px] text-text-tertiary mt-2">
                    <Calendar className="h-3 w-3" />
                    {ann.date}
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
