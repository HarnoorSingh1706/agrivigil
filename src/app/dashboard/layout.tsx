import React from "react";
import { AgriVigilProvider } from "@/context/AgriVigilContext";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

export const metadata = {
  title: "AgriVigil | Precision Bio-Acoustic Pest & Microclimate Platform",
  description:
    "Early-warning bio-acoustic insect detection and microclimate monitoring system for commercial palm and orchard plantations.",
};

export default function AgriVigilDashboardAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AgriVigilProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </AgriVigilProvider>
  );
}
