'use client';

import { useEffect, useState } from 'react';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'shop' | 'delivery';
  shopId: string | null;
  shopName: string | null;
  shopBalance: string | null;
  shopCreditLimit: string | null;
  shopPaymentDeadline: string | null;
  deliveryPersonId: string | null;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' });

        if (!mounted) return;

        if (!res.ok) {
          setUser(null);
          return;
        }

        const data = await res.json();
        setUser(data.user ?? null);
      } catch (error) {
        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadSession();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user,
  };
}
