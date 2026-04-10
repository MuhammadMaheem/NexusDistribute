'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from './theme-toggle';
import {
  LayoutDashboard,
  ShoppingCart,
  AlertTriangle,
  Users,
  Package,
  Tag,
  Warehouse,
  Truck,
  Megaphone,
  Settings,
  Menu,
  X,
  LogOut,
  Bell,
  Zap,
} from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, section: 'overview' },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart, section: 'operations' },
  {
    href: '/admin/orders/review',
    label: 'Review Queue',
    icon: AlertTriangle,
    section: 'operations',
    badge: true,
  },
  { href: '/admin/shops', label: 'Shops', icon: Users, section: 'operations' },
  { href: '/admin/products', label: 'Products', icon: Package, section: 'catalog' },
  { href: '/admin/prices', label: 'Pricing', icon: Tag, section: 'catalog' },
  { href: '/admin/inventory', label: 'Inventory', icon: Warehouse, section: 'catalog' },
  { href: '/admin/delivery', label: 'Delivery', icon: Truck, section: 'logistics' },
  { href: '/admin/announcements', label: 'Announcements', icon: Megaphone, section: 'logistics' },
  { href: '/admin/disputes', label: 'Disputes', icon: AlertTriangle, section: 'logistics' },
  { href: '/admin/settings', label: 'Settings', icon: Settings, section: 'system' },
];

const sections = [
  { key: 'overview', label: 'Overview' },
  { key: 'operations', label: 'Operations' },
  { key: 'catalog', label: 'Catalog' },
  { key: 'logistics', label: 'Logistics' },
  { key: 'system', label: 'System' },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin' || pathname === '/admin/dashboard';
    return pathname?.startsWith(href);
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Floating glass sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 glass-panel transition-transform duration-300 lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b border-border/30 px-5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/60 shadow-glow-sm">
                <Zap className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <span className="font-heading text-sm font-bold tracking-tight text-foreground">
                  Nexus
                </span>
                <span className="block text-[10px] font-medium uppercase tracking-widest text-text-tertiary">
                  Admin
                </span>
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
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
            {sections.map((section) => {
              const sectionItems = navItems.filter((item) => item.section === section.key);
              if (sectionItems.length === 0) return null;

              return (
                <div key={section.key}>
                  <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-text-tertiary">
                    {section.label}
                  </p>
                  <div className="space-y-0.5">
                    {sectionItems.map((item) => {
                      const active = isActive(item.href);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                            active
                              ? 'bg-primary/10 text-primary'
                              : 'text-text-secondary hover:bg-surface-2/50 hover:text-foreground'
                          )}
                          onClick={() => setSidebarOpen(false)}
                        >
                          {active && (
                            <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--admin-glow)/0.6)]" />
                          )}
                          <item.icon
                            className={cn(
                              'h-4 w-4 flex-shrink-0 transition-colors',
                              active
                                ? 'text-primary'
                                : 'text-text-tertiary group-hover:text-text-secondary'
                            )}
                          />
                          <span className="flex-1">{item.label}</span>
                          {item.badge && (
                            <Badge variant="warning" size="sm" className="ml-auto">
                              3
                            </Badge>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-border/30 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="sm"
                className="text-text-secondary hover:text-foreground gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
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
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9 text-text-secondary hover:text-foreground"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-warning text-[8px] font-bold text-background shadow-[0_0_6px_hsl(var(--warning-glow)/0.6)]">
                3
              </span>
            </Button>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-admin to-admin/60 shadow-[0_0_8px_hsl(var(--admin-glow)/0.2)]">
              <span className="text-xs font-bold text-primary-foreground">A</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 animate-in" data-delay="1">
          {children}
        </main>
      </div>
    </div>
  );
}
