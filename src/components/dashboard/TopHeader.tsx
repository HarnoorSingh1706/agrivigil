"use client";

import React from "react";
import { useAgriVigil } from "@/context/AgriVigilContext";
import { ZoneId } from "@/types/agrivigil";
import {
  Menu,
  Zap,
  MapPin,
  Calendar,
  Globe,
} from "lucide-react";

interface TopHeaderProps {
  onToggleMobile: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onToggleMobile }) => {
  const {
    language,
    setLanguage,
    t,
    plantationName,
    selectedFarm,
    selectedZoneId,
    setSelectedZoneId,
    simulateDetection,
  } = useAgriVigil();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200">
      {/* Top Banner / Disclaimer */}
      <div className="bg-emerald-950 text-emerald-200 px-4 py-1.5 text-[11px] flex flex-wrap items-center justify-between gap-2 border-b border-emerald-900">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
          <span>
            <strong>{language === "hi" ? "एग्रीविजिल प्रोटोटाइप: " : "AgriVigil Bio-Acoustic Prototype: "}</strong>
            {t("prototypeNotice")}
          </span>
          <span className="hidden sm:inline text-emerald-400/60">&bull;</span>
          <span className="hidden sm:inline text-emerald-300 font-mono">
            {t("demoDataNotice")}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-300">
          <span>{language === "hi" ? "लक्षित कीट: लाल पाम वीविल • राइनो बीटल" : "Target Pests: Red Palm Weevil • Rhinoceros Beetle"}</span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        {/* Left: Mobile Toggle & Plantation Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobile}
            className="p-2 -ml-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 lg:hidden"
            aria-label="Toggle Navigation Drawer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-emerald-950 truncate font-serif">
                {plantationName}
              </h1>
              <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                <MapPin className="w-3 h-3 text-emerald-600" />
                {selectedFarm}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <span className="flex items-center gap-1 text-[11px]">
                <Calendar className="w-3 h-3 text-stone-400" />
                {language === "hi" ? "16 नवम्बर, 2026" : "Nov 16, 2026"}
              </span>
              <span>&bull;</span>
              <span className="text-[11px] text-emerald-800 font-medium">
                {t("monitoredZonesSummary")}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Language Switcher, Zone Switcher & Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher Pill (English / हिन्दी) */}
          <div className="flex items-center bg-stone-100 p-0.5 rounded-xl border border-stone-200 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                language === "en"
                  ? "bg-white text-emerald-950 font-bold shadow-xs border border-stone-200"
                  : "text-stone-600 hover:text-stone-900"
              }`}
              title="Switch platform language to English"
            >
              <span>EN</span>
            </button>
            <button
              type="button"
              onClick={() => setLanguage("hi")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                language === "hi"
                  ? "bg-emerald-900 text-white font-bold shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
              title="प्लेटफ़ॉर्म भाषा हिन्दी में बदलें"
            >
              <span>हिन्दी</span>
            </button>
          </div>

          {/* Global Zone Selector */}
          <div className="hidden md:flex items-center bg-stone-100 p-0.5 rounded-xl border border-stone-200 text-xs font-medium">
            {(
              [
                { id: "all", label: t("allZones") },
                { id: "zone-a", label: t("zoneA") },
                { id: "zone-b", label: t("zoneB") },
                { id: "zone-c", label: t("zoneC") },
              ] as Array<{ id: ZoneId | "all"; label: string }>
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedZoneId(item.id)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  selectedZoneId === item.id
                    ? "bg-white text-emerald-950 font-bold shadow-xs border border-stone-200"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Quick Simulate Detection Action */}
          <button
            onClick={() => simulateDetection()}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold transition-all shadow-xs active:scale-95"
            title={language === "hi" ? "कीट ध्वनिक घटना सिमुलेट करें" : "Generate a simulated insect acoustic detection"}
          >
            <Zap className="w-3.5 h-3.5 text-stone-950 fill-stone-950" />
            <span className="hidden sm:inline">{t("simulateBtn")}</span>
            <span className="sm:hidden">{language === "hi" ? "सिमुलेट" : "Simulate"}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
