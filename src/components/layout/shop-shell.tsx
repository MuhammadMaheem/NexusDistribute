"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "./theme-toggle";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Wallet,
  MessageSquare,
  Megaphone,
  User,
  Menu,
  X,
  LogOut,
  Bell,
  Store,
} from "lucide-react";

const navItems = [
  { href: "/shop", label: "Dashboard", icon: LayoutDashboard },
  { href: "/shop/products", label: "Products", icon: Package },
  { href: "/shop/cart", label: "Cart", icon: ShoppingCart },
  { href: "/shop/orders", label: "My Orders", icon: ShoppingCart },
  { href: "/shop/balance", label: "Balance", icon: Wallet },
  { href: "/shop/chat", label: "Chat", icon: MessageSquare },
  { href: "/shop/announcements", label: "Announcements", icon: Megaphone },
  { href: "/shop/profile", label: "Profile", icon: User },
];

export function ShopShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/shop") return pathname === "/shop" || pathname === "/shop/dashboard";
    return pathname?.startsWith(href);
  };

  return (
    <div className="flex min-h-screen bg-background">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 glass-panel transition-transform duration-300 lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b border-border/30 px-5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-shop to-shop/60 shadow-[0_0_8px_hsl(var(--shop-glow)/0.2)]">
                <Store className="h-4 w-4 text-white" />
              </div>
              <div>
                <span className="font-heading text-sm font-bold tracking-tight text-foreground">Nexus</span>
                <span className="block text-[10px] font-medium uppercase tracking-widest text-text-tertiary">Shop</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 lg:hidden text-text-secondary"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                    active
                      ? "bg-shop/10 text-shop"
                      : "text-text-secondary hover:bg-surface-2/50 hover:text-foreground"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  {active && (
                    <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-shop shadow-[0_0_8px_hsl(var(--shop-glow)/0.6)]" />
                  )}
                  <item.icon className={cn("h-4 w-4 flex-shrink-0", active ? "text-shop" : "text-text-tertiary group-hover:text-text-secondary")} />
                  <span className="flex-1">{item.label}</span>
                  {item.href === "/shop/cart" && (
                    <Badge variant="shop" size="sm" className="ml-auto">
                      2
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-border/30 p-4">
            <Button variant="ghost" size="sm" className="w-full justify-start text-text-secondary hover:text-foreground gap-2">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/30 bg-background/80 backdrop-blur-xl px-4 lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 lg:hidden text-text-secondary"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-3 ml-auto">
            <Button variant="ghost" size="icon" className="relative h-9 w-9 text-text-secondary hover:text-foreground">
              <Bell className="h-4 w-4" />
              <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-shop text-[8px] font-bold text-background shadow-[0_0_6px_hsl(var(--shop-glow)/0.6)]">
                2
              </span>
            </Button>
            <ThemeToggle />
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-shop to-shop/60 shadow-[0_0_8px_hsl(var(--shop-glow)/0.2)]">
              <span className="text-xs font-bold text-white">S</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6 animate-in" data-delay="1">
          {children}
        </main>
      </div>
    </div>
  );
}
