'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Zap, Loader2, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    shop_name: '',
    owner_name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    address_text: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shop_name: formData.shop_name,
          owner_name: formData.owner_name,
          phone: formData.phone,
          email: formData.email,
          password: formData.password,
          address_text: formData.address_text,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed');
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push('/login'), 3000);
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4 mesh-bg">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-shop/5 rounded-full blur-3xl animate-float" />
          <div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-float"
            style={{ animationDelay: '3s' }}
          />
        </div>

        <Card className="relative z-10 w-full max-w-md glass animate-scale-in">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-4">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10 animate-in"
              data-delay="1"
            >
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
            <div className="space-y-2 animate-in" data-delay="2">
              <h2 className="font-heading text-xl font-bold text-foreground">
                Registration Submitted!
              </h2>
              <p className="text-sm text-text-secondary">
                Your shop registration is pending admin approval. You will be notified once
                reviewed.
              </p>
            </div>
            <p className="text-xs text-text-tertiary animate-in" data-delay="3">
              Redirecting to login...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 mesh-bg">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-shop/5 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '3s' }}
        />
      </div>

      <div className="relative z-10 w-full max-w-lg animate-in" data-delay="2">
        {/* Logo */}
        <div className="flex justify-center mb-8 animate-in" data-delay="1">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-shop to-shop/60 shadow-[0_0_20px_hsl(var(--shop-glow)/0.2)]">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-heading text-xl font-bold tracking-tight text-foreground">
                NexusDistribute
              </h1>
              <p className="text-xs text-text-tertiary uppercase tracking-widest">
                Register Your Shop
              </p>
            </div>
          </div>
        </div>

        <Card className="glass animate-in" data-delay="3">
          <CardHeader className="space-y-3 text-center pb-6">
            <CardTitle className="text-2xl font-heading">Create your account</CardTitle>
            <CardDescription>Fill in your shop details to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="animate-scale-in">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 animate-in" data-delay="4">
                <Input
                  name="shop_name"
                  label="Shop Name"
                  value={formData.shop_name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="e.g., Al-Falah Store"
                />
                <Input
                  name="owner_name"
                  label="Owner Name"
                  value={formData.owner_name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="e.g., Ahmed Khan"
                />
              </div>

              <div className="animate-in" data-delay="5">
                <Input
                  name="phone"
                  label="Phone Number"
                  type="tel"
                  placeholder="+92-XXX-XXXXXXX"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="animate-in" data-delay="6">
                <Input
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="animate-in" data-delay="7">
                <Input
                  name="address_text"
                  label="Address"
                  placeholder="Street address, city, province"
                  value={formData.address_text}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 animate-in" data-delay="8">
                <Input
                  name="password"
                  label="Password"
                  type="password"
                  placeholder="Min. 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <Input
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <Button
                type="submit"
                variant="glow"
                className="w-full h-11 text-sm font-semibold tracking-wide animate-in"
                data-delay="9"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>
                    Submit Registration
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm animate-in" data-delay="10">
              <span className="text-text-secondary">Already have an account? </span>
              <Link
                href="/login"
                className="font-medium text-primary hover:underline underline-offset-4"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
