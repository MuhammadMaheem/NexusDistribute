"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Wallet, TrendingUp, AlertTriangle, Calendar, CreditCard, Clock } from "lucide-react";

const balance = 145000;
const creditLimit = 200000;
const utilization = (balance / creditLimit) * 100;
const paymentDeadline = "2026-04-20";

const ledger = [
  { id: 1, type: "debit", amount: 5620, balanceAfter: 145000, note: "BNPL order #ORD-102", date: "07 Apr, 06:44 pm" },
  { id: 2, type: "credit", amount: 25000, balanceAfter: 139380, note: "Payment received", date: "06 Apr, 03:00 pm" },
  { id: 3, type: "debit", amount: 12400, balanceAfter: 164380, note: "BNPL order #ORD-098", date: "05 Apr, 11:30 am" },
  { id: 4, type: "credit", amount: 10000, balanceAfter: 151980, note: "Payment received", date: "04 Apr, 09:00 am" },
  { id: 5, type: "debit", amount: 8200, balanceAfter: 161980, note: "BNPL order #ORD-095", date: "03 Apr, 02:15 pm" },
];

export default function BalancePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-in" data-delay="1">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Balance & Payments</h1>
        <p className="text-sm text-text-secondary mt-1">Track your account balance and payment history</p>
      </div>

      {/* Balance Card */}
      <Card className="glass animate-in" data-delay="2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Wallet className="h-4 w-4 text-shop" />
            Account Balance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold font-mono tabular-nums text-foreground">Rs {balance.toLocaleString()}</p>
              <p className="text-sm text-text-tertiary mt-1">of Rs {creditLimit.toLocaleString()} credit limit</p>
            </div>
            <Badge variant={utilization >= 80 ? "warning" : "success"}>{utilization >= 80 ? "Near Limit" : "Healthy"}</Badge>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-text-tertiary">Credit Used</span>
              <span className="font-mono font-semibold text-shop">{utilization.toFixed(1)}%</span>
            </div>
            <Progress value={utilization} variant={utilization >= 80 ? "warning" : "shop"} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-border/30 bg-surface-2/30 p-3">
              <p className="text-[10px] uppercase tracking-wider text-text-tertiary font-semibold">Credit Remaining</p>
              <p className="text-lg font-bold font-mono tabular-nums text-foreground mt-1">Rs {(creditLimit - balance).toLocaleString()}</p>
            </div>
            <div className="rounded-lg border border-border/30 bg-surface-2/30 p-3">
              <p className="text-[10px] uppercase tracking-wider text-text-tertiary font-semibold">Payment Deadline</p>
              <p className="text-lg font-bold font-mono tabular-nums text-foreground mt-1">{new Date(paymentDeadline).toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ledger */}
      <Card className="glass animate-in" data-delay="3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-4 w-4 text-primary" />
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {ledger.length === 0 ? (
            <p className="text-center py-12 text-text-secondary">No transactions yet.</p>
          ) : (
            <div className="space-y-2">
              {ledger.map(entry => (
                <div key={entry.id} className="flex items-center justify-between rounded-lg border border-border/30 bg-surface-2/20 px-4 py-3">
                  <div>
                    <Badge variant={entry.type === "debit" ? "error" : "success"} size="sm">{entry.type.toUpperCase()}</Badge>
                    {entry.note && <p className="text-xs text-text-secondary mt-1">{entry.note}</p>}
                    <p className="text-[10px] text-text-tertiary mt-0.5 flex items-center gap-1"><Clock className="h-3 w-3" />{entry.date}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold font-mono tabular-nums text-sm ${entry.type === "debit" ? "text-error" : "text-success"}`}>
                      {entry.type === "debit" ? "+" : "-"}Rs {entry.amount.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-text-tertiary">After: Rs {entry.balanceAfter.toLocaleString()}</p>
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
