"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Send, MessageSquare, Clock } from "lucide-react";
import { useState } from "react";

const messages = [
  { id: 1, senderRole: "admin", message: "Welcome to NexusDistribute! How can we help you?", time: "10:00 AM" },
  { id: 2, senderRole: "shop", message: "Hi, I have a question about my recent order #ORD-102.", time: "10:05 AM" },
  { id: 3, senderRole: "admin", message: "Of course! Your order is currently in review. We'll update you once it's approved.", time: "10:08 AM" },
  { id: 4, senderRole: "shop", message: "Thank you! Also, when is my next payment due?", time: "10:12 AM" },
  { id: 5, senderRole: "admin", message: "Your next payment deadline is April 20th. You can view this in your Balance section.", time: "10:15 AM" },
];

export default function ShopChatPage() {
  const [newMessage, setNewMessage] = useState("");
  const [msgs, setMsgs] = useState(messages);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    setMsgs(prev => [...prev, { id: Date.now(), senderRole: "shop", message: newMessage, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    setNewMessage("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-in" data-delay="1">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Chat with Admin</h1>
        <p className="text-sm text-text-secondary mt-1">Get support and ask questions</p>
      </div>

      {/* Chat Card */}
      <Card className="glass animate-in flex flex-col" data-delay="2" style={{ height: "calc(100vh - 280px)", minHeight: "500px" }}>
        <CardHeader className="border-b border-border/30 pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <MessageSquare className="h-4 w-4 text-shop" />
            Messages
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto space-y-4 p-5">
          {msgs.map((msg) => (
            <div key={msg.id} className={`flex ${msg.senderRole === "shop" ? "justify-end" : "justify-start"} animate-fade-in-up`}>
              <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                msg.senderRole === "shop"
                  ? "bg-gradient-to-br from-shop to-shop/80 text-white rounded-br-md"
                  : "bg-surface-2/60 text-foreground rounded-bl-md border border-border/30"
              }`}>
                <p className="text-sm leading-relaxed">{msg.message}</p>
                <p className={`text-[10px] mt-1.5 ${msg.senderRole === "shop" ? "text-white/60" : "text-text-tertiary"}`}>{msg.time}</p>
              </div>
            </div>
          ))}
        </CardContent>
        {/* Input */}
        <div className="border-t border-border/30 p-4">
          <div className="flex gap-2">
            <input
              className="flex-1 h-10 rounded-lg border border-border/50 bg-surface-2/50 px-4 text-sm text-foreground placeholder:text-text-tertiary focus:border-ring/60 focus:outline-none focus:ring-2 focus:ring-ring/10 transition-all"
              placeholder="Type a message..."
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
            />
            <Button variant="glow" size="icon" onClick={handleSend}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
