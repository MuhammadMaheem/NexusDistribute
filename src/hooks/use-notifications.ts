'use client';

import { useEffect, useState } from "react";
import { getPusherClient } from "@/lib/pusher-client";

export interface AppNotification {
  id: string;
  type: string;
  title: string;
  body: string;
  createdAt: string;
}

export function useNotifications(channelName: string) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!channelName) return;

    const pusher = getPusherClient();
    if (!pusher) return; // Pusher not configured

    const channel = pusher.subscribe(channelName);

    channel.bind("notification:new", (data: AppNotification) => {
      setNotifications((prev) => [data, ...prev]);
      setUnreadCount((prev) => prev + 1);

      // Browser notification (Client-side only)
      if (typeof window !== "undefined" && "Notification" in window) {
        const BrowserNotification = window.Notification;
        if (BrowserNotification.permission === "granted") {
          new BrowserNotification(data.title, { body: data.body });
        }
      }
    });

    return () => {
      pusher.unsubscribe(channelName);
    };
  }, [channelName]);

  const markAllRead = () => {
    setUnreadCount(0);
  };

  return {
    notifications,
    unreadCount,
    markAllRead,
  };
}
