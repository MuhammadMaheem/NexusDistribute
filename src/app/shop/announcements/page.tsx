import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Megaphone, Calendar, CheckCircle2, Bell } from "lucide-react";

const announcements = [
  { id: 1, title: "Price Change Effective Tomorrow", body: "Sugar prices will increase by Rs 10/kg starting April 8th.", date: "Today", read: false },
  { id: 2, title: "New Products Added", body: "We've added 5 new products to the catalogue. Check them out!", date: "Yesterday", read: true },
  { id: 3, title: "Holiday Schedule", body: "We will be closed on April 14th for the holiday. Orders placed before April 13th will be processed.", date: "3 days ago", read: true },
];

export default function ShopAnnouncementsPage() {
  return (
    <div className="space-y-6">
      <div className="animate-in" data-delay="1">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Announcements</h1>
        <p className="text-sm text-text-secondary mt-1">{announcements.filter(a => !a.read).length} unread</p>
      </div>

      <Card className="glass animate-in" data-delay="2">
        <CardHeader><CardTitle className="text-base">All Announcements</CardTitle></CardHeader>
        <CardContent>
          {announcements.length === 0 ? (
            <p className="text-center py-12 text-text-secondary">No announcements.</p>
          ) : (
            <div className="space-y-3">
              {announcements.map(ann => (
                <div key={ann.id} className={`rounded-lg border p-4 transition-colors ${!ann.read ? "border-shop/40 bg-shop/5" : "border-border/30 bg-surface-2/20"}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {!ann.read && <span className="h-2 w-2 rounded-full bg-shop shadow-[0_0_6px_hsl(var(--shop-glow)/0.6)]" />}
                      <h3 className="font-semibold text-foreground text-sm">{ann.title}</h3>
                    </div>
                    {ann.read && <CheckCircle2 className="h-4 w-4 text-success" />}
                  </div>
                  <p className="text-sm text-text-secondary mt-2">{ann.body}</p>
                  <div className="flex items-center gap-1.5 text-[10px] text-text-tertiary mt-2"><Calendar className="h-3 w-3" />{ann.date}</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
