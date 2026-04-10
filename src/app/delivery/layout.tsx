import { DeliveryShell } from "@/components/layout/delivery-shell";

export default function DeliveryLayout({ children }: { children: React.ReactNode }) {
  return <DeliveryShell>{children}</DeliveryShell>;
}
