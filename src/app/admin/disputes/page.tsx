"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertTriangle, CheckCircle2, XCircle, CreditCard, Loader2 } from "lucide-react";
import { useState } from "react";

const disputes: { id: string; shop: string; type: string; status: string; reason: string; orderAmount: number; filedAt: string; creditIssued?: number; resolutionNote?: string }[] = [
  { id: "D-001", shop: "Al-Falah Store", type: "wrong_items", status: "open", reason: "Received wrong product variant", orderAmount: 5620, filedAt: "Today" },
  { id: "D-002", shop: "City Mart", type: "damaged", status: "resolved", reason: "Packaging was damaged, items inside broken", orderAmount: 3200, filedAt: "Yesterday", creditIssued: 500 },
  { id: "D-003", shop: "Royal Traders", type: "missing", status: "open", reason: "2 items missing from order", orderAmount: 12400, filedAt: "2 days ago" },
];

export default function DisputesPage() {
  const [selectedDispute, setSelectedDispute] = useState<any>(null);
  const [resolutionNote, setResolutionNote] = useState("");
  const [creditAmount, setCreditAmount] = useState("");

  const openDisputes = disputes.filter(d => d.status === "open");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-in" data-delay="1">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Disputes</h1>
        <p className="text-sm text-text-secondary mt-1">{openDisputes.length} open • {disputes.length} total</p>
      </div>

      {/* Open Disputes */}
      {openDisputes.length > 0 && (
        <Card className="glass animate-in border-error/30" data-delay="2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-error text-base">
              <AlertTriangle className="h-4 w-4" />
              Open Disputes Requiring Action
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {openDisputes.map(dispute => (
                <div key={dispute.id} className="rounded-lg border border-border/30 bg-surface-2/20 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground text-sm">{dispute.shop}</span>
                        <Badge variant="error" size="sm">{dispute.type.replace(/_/g, " ")}</Badge>
                      </div>
                      <p className="text-sm text-text-secondary mt-1">{dispute.reason}</p>
                      <p className="text-xs text-text-tertiary mt-1">Order Rs {dispute.orderAmount.toLocaleString()} • Filed {dispute.filedAt}</p>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild><Button variant="glow" size="sm" onClick={() => setSelectedDispute(dispute)}>Review</Button></DialogTrigger>
                      <DialogContent>
                        <DialogHeader><DialogTitle>Resolve Dispute</DialogTitle></DialogHeader>
                        <div className="space-y-4">
                          <div className="rounded-lg bg-surface-2/50 p-3">
                            <p className="font-medium text-foreground text-sm">{selectedDispute?.shop}</p>
                            <p className="text-sm text-text-secondary">{selectedDispute?.reason}</p>
                            <p className="text-xs text-text-tertiary mt-1">Type: {selectedDispute?.type.replace(/_/g, " ")}</p>
                          </div>
                          <div className="space-y-2"><Label>Resolution Note</Label><Textarea value={resolutionNote} onChange={e => setResolutionNote(e.target.value)} placeholder="Explain your decision..." rows={3} /></div>
                          <div className="space-y-2"><Label>Credit Amount (Rs)</Label><Input type="number" value={creditAmount} onChange={e => setCreditAmount(e.target.value)} placeholder="Amount to credit back" /><p className="text-[10px] text-text-tertiary">Credit deducted from shop balance</p></div>
                          <div className="flex gap-2">
                            <Button variant="success" className="flex-1 gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" />Resolve + Credit</Button>
                            <Button variant="destructive" className="flex-1 gap-1.5"><XCircle className="h-3.5 w-3.5" />Reject</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Disputes */}
      <Card className="glass animate-in" data-delay="3">
        <CardHeader><CardTitle className="text-base">All Disputes</CardTitle></CardHeader>
        <CardContent>
          {disputes.length === 0 ? (
            <p className="text-center py-12 text-text-secondary">No disputes filed.</p>
          ) : (
            <div className="space-y-3">
              {disputes.map(dispute => (
                <div key={dispute.id} className="rounded-lg border border-border/30 bg-surface-2/20 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground text-sm">{dispute.shop}</span>
                        <Badge variant={dispute.status === "resolved" ? "success" : "error"} size="sm">{dispute.status}</Badge>
                        <Badge variant="default" size="sm">{dispute.type.replace(/_/g, " ")}</Badge>
                      </div>
                      <p className="text-sm text-text-secondary mt-1">{dispute.reason}</p>
                      {("resolutionNote" in dispute) && dispute.resolutionNote && <p className="text-xs text-text-tertiary mt-1 italic">Resolution: {dispute.resolutionNote}</p>}
                      {dispute.creditIssued && (
                        <div className="flex items-center gap-1.5 text-xs text-success mt-1">
                          <CreditCard className="h-3 w-3" />
                          Credit: Rs {dispute.creditIssued.toLocaleString()}
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-text-tertiary">{dispute.filedAt}</span>
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
