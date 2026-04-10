'use client';

import { useNotifications, type AppNotification } from "@/hooks/use-notifications";
import { Bell, ShoppingBag, CreditCard, AlertTriangle, Package, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface NotificationBellProps {
  channel: string;
}

export function NotificationBell({ channel }: NotificationBellProps) {
  const { notifications, unreadCount, markAllRead } = useNotifications(channel);

  const getIcon = (type: string) => {
    switch (type) {
      case "new_order":
      case "order_pending": return <ShoppingBag className="h-4 w-4 text-primary" />;
      case "order_delivered": return <Check className="h-4 w-4 text-success" />;
      case "order_review": return <AlertTriangle className="h-4 w-4 text-warning" />;
      case "credit_update": return <CreditCard className="h-4 w-4 text-delivery" />;
      default: return <Bell className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <DropdownMenu onOpenChange={(open) => open && markAllRead()}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full h-10 w-10 bg-background/50 border-border/50 hover:bg-muted transition-all">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center border-2 border-background animate-in zoom-in-50 duration-300">
               {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 rounded-2xl p-0 border-border/50 bg-background/80 backdrop-blur-xl shadow-2xl">
         <div className="p-4 border-b bg-muted/30">
            <h3 className="font-bold text-sm tracking-tight capitalize">Alerts & Notifications</h3>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-0.5">Distribution Network</p>
         </div>
         <div className="h-80 overflow-y-auto">
            {notifications.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-10 text-muted-foreground gap-2">
                  <Bell className="h-8 w-8 opacity-10" />
                  <p className="text-xs italic">No notifications yet.</p>
               </div>
            ) : (
               notifications.map((notif: AppNotification) => (
                 <DropdownMenuItem key={notif.id} className="p-4 focus:bg-muted/50 border-b last:border-0 cursor-default">
                    <div className="flex gap-4">
                       <div className="h-10 w-10 rounded-xl bg-background border flex items-center justify-center shrink-0 shadow-sm">
                          {getIcon(notif.type)}
                       </div>
                       <div className="space-y-1 overflow-hidden">
                          <p className="font-bold text-sm leading-tight text-foreground">{notif.title}</p>
                          <p className="text-xs text-muted-foreground line-clamp-2">{notif.body}</p>
                          <p className="text-[10px] text-muted-foreground/60 italic">
                             {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                       </div>
                    </div>
                 </DropdownMenuItem>
               ))
            )}
         </div>
         <div className="p-2 border-t bg-muted/10 text-center">
            <Button variant="ghost" className="text-[10px] uppercase font-black tracking-widest text-primary h-8 w-full hover:bg-transparent">
               View All Messages
            </Button>
         </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
