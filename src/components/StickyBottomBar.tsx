"use client";

import React from "react";
import Link from "next/link";
import { Home, Volume2, VolumeX, PhoneCall, MessageCircle } from "lucide-react";
import { useVoice } from "../context/VoiceContext";
import { useLanguage } from "../context/LanguageContext";
import { siteConfig } from "../config/site";

export const StickyBottomBar: React.FC = () => {
  const { t } = useLanguage();
  const { isSpeaking, stopSpeaking, speak } = useVoice();

  const handleListenAction = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isSpeaking) {
      stopSpeaking();
    } else {
      // Find main visible text or hero title to read
      const heroTitle = document.querySelector("h1")?.innerText || "";
      const heroDesc = document.querySelector("p")?.innerText || "";
      speak(`${heroTitle}. ${heroDesc}`);
    }
  };

  return (
    <nav
      aria-label="Quick mobile actions"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t-2 border-emerald-800 shadow-[0_-4px_16px_rgba(0,0,0,0.1)] md:hidden"
    >
      <div className="grid grid-cols-4 h-16 max-w-md mx-auto items-stretch">
        {/* 1. Home */}
        <Link
          href="/"
          className="flex flex-col items-center justify-center text-stone-700 hover:text-emerald-800 active:bg-emerald-50 transition-colors min-h-[56px] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-700"
        >
          <Home className="w-6 h-6 text-emerald-800 mb-0.5" />
          <span className="text-[11px] font-bold tracking-tight">{t("nav.home", "Home")}</span>
        </Link>

        {/* 2. Listen Aloud */}
        <button
          onClick={handleListenAction}
          type="button"
          className={`flex flex-col items-center justify-center transition-colors min-h-[56px] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-700 ${
            isSpeaking ? "bg-amber-100 text-amber-950 font-bold animate-pulse" : "text-stone-700 hover:text-emerald-800 active:bg-emerald-50"
          }`}
          aria-label={isSpeaking ? t("voice.stop_speaking", "Stop reading") : t("nav.listen", "Listen aloud")}
        >
          {isSpeaking ? (
            <VolumeX className="w-6 h-6 text-amber-900 mb-0.5" />
          ) : (
            <Volume2 className="w-6 h-6 text-emerald-800 mb-0.5" />
          )}
          <span className="text-[11px] font-bold tracking-tight">
            {isSpeaking ? t("voice.stop_speaking", "Stop") : t("nav.listen", "Listen")}
          </span>
        </button>

        {/* 3. Call Us */}
        <a
          href={`tel:${siteConfig.phone}`}
          className="flex flex-col items-center justify-center text-stone-700 hover:text-emerald-800 active:bg-emerald-50 transition-colors min-h-[56px] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-700"
          aria-label={t("nav.call_us", "Call Us")}
        >
          <PhoneCall className="w-6 h-6 text-emerald-700 mb-0.5" />
          <span className="text-[11px] font-bold tracking-tight">{t("nav.call_us", "Call")}</span>
        </a>

        {/* 4. WhatsApp Us */}
        <a
          href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(siteConfig.whatsappDefaultMsg)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center bg-emerald-700 text-white hover:bg-emerald-800 active:bg-emerald-900 transition-colors min-h-[56px] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-400"
          aria-label={t("nav.whatsapp", "WhatsApp Us")}
        >
          <MessageCircle className="w-6 h-6 text-white mb-0.5" />
          <span className="text-[11px] font-bold tracking-tight">{t("nav.whatsapp", "WhatsApp")}</span>
        </a>
      </div>
    </nav>
  );
};
