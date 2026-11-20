"use client";

import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopHeader } from "./TopHeader";
import { ToastNotification } from "./ToastNotification";
import { DetectionDetailModal } from "./DetectionDetailModal";
import { VoiceAssistantWidget } from "./VoiceAssistantWidget";

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8faf8] text-stone-900 flex flex-col font-sans antialiased">
      {/* Toast notifications */}
      <ToastNotification />

      {/* Voice Assistant floating agent */}
      <VoiceAssistantWidget />

      {/* Acoustic Spectrogram & Inspection Modal */}
      <DetectionDetailModal />

      {/* Persistent Sidebar */}
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <TopHeader onToggleMobile={() => setMobileMenuOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>

        {/* Dashboard Footer / R&D Notice */}
        <footer className="border-t border-stone-200 bg-white px-4 sm:px-6 py-3 text-xs text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-emerald-900 font-serif">AgriVigil Precision Bioacoustics</span>
            <span>&bull;</span>
            <span>DeepTech Acoustic Pest Detection & Microclimate IoT Platform</span>
          </div>
          <div className="text-[11px] text-stone-400 font-mono">
            Sensor telemetry and classifier confidence are mock outputs for incubator and field demonstration.
          </div>
        </footer>
      </div>
    </div>
  );
};
