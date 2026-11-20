import React from "react";
import { AgriVigilProvider } from "@/context/AgriVigilContext";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import DashboardOverviewPage from "./dashboard/page";

export default function RootIndexPage() {
  return (
    <AgriVigilProvider>
      <DashboardLayout>
        <DashboardOverviewPage />
      </DashboardLayout>
    </AgriVigilProvider>
  );
}
