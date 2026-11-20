"use client";

import React from "react";
import { LanguageProvider } from "../context/LanguageContext";
import { VoiceProvider, useVoice } from "../context/VoiceContext";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { StickyBottomBar } from "./StickyBottomBar";
import { LanguageModal } from "./LanguageModal";
import { VoiceAssistantModal } from "./VoiceAssistantModal";
import { CookieConsent } from "./CookieConsent";
import { Mic } from "lucide-react";

// Sleek Modern Floating Voice Button
const FloatingMicButton: React.FC = () => {
  const { openVoiceModal, isListening } = useVoice();

  return (
    <button
      onClick={openVoiceModal}
      type="button"
      className={`fixed bottom-20 md:bottom-8 right-5 z-40 px-4 py-3 rounded-full shadow-lg shadow-emerald-950/20 transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none flex items-center gap-2.5 ${
        isListening
          ? "bg-amber-400 text-stone-950 ring-4 ring-amber-300 animate-pulse"
          : "bg-emerald-800 hover:bg-emerald-900 text-white border border-emerald-700/80"
      }`}
      aria-label="Activate voice assistant or dictate text"
      title="Speak to the website"
    >
      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
        <Mic className={`w-4 h-4 text-amber-300 ${isListening ? "animate-bounce text-stone-950" : ""}`} />
      </div>
      <span className="text-xs font-bold tracking-tight pr-1 hidden sm:inline">
        Voice Assist / बोलें
      </span>
    </button>
  );
};

import { usePathname } from "next/navigation";

export const ClientProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isDashboard = !pathname || pathname === "/" || pathname?.startsWith("/dashboard");

  React.useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch((err) => {
        console.warn("ServiceWorker registration failed:", err);
      });
    }
  }, []);

  if (isDashboard) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <LanguageProvider>
      <VoiceProvider>
        <div className="flex flex-col min-h-screen selection:bg-amber-200 selection:text-emerald-950">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <StickyBottomBar />
          <FloatingMicButton />
          <LanguageModal />
          <VoiceAssistantModal />
          <CookieConsent />
        </div>
      </VoiceProvider>
    </LanguageProvider>
  );
};
