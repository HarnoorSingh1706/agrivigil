"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAgriVigil } from "@/context/AgriVigilContext";
import {
  LayoutDashboard,
  ShieldAlert,
  Thermometer,
  Grid,
  Bell,
  FileSpreadsheet,
  Settings,
  Radio,
  Zap,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Globe,
} from "lucide-react";

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const pathname = usePathname();
  const {
    language,
    setLanguage,
    t,
    activeAlertCount,
    simulateDetection,
    resetDemoData,
    onlineNodeCount,
    nodes,
  } = useAgriVigil();

  const navItems = [
    {
      name: t("navDashboard"),
      href: "/dashboard",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      name: t("navDetections"),
      href: "/dashboard/detections",
      icon: ShieldAlert,
      badge: null,
    },
    {
      name: t("navMicroclimate"),
      href: "/dashboard/environment",
      icon: Thermometer,
      badge: null,
    },
    {
      name: t("navZones"),
      href: "/dashboard/zones",
      icon: Grid,
      badge: null,
    },
    {
      name: t("navAlerts"),
      href: "/dashboard/alerts",
      icon: Bell,
      badge: activeAlertCount > 0 ? activeAlertCount : null,
      badgeColor: "bg-rose-500 text-white",
    },
    {
      name: t("navReports"),
      href: "/dashboard/reports",
      icon: FileSpreadsheet,
      badge: null,
    },
    {
      name: t("navDevices"),
      href: "/dashboard/devices",
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-stone-900/50 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-stone-200 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-900 flex items-center justify-center text-emerald-300 shadow-sm shadow-emerald-900/30">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-emerald-950 font-serif">
                  {t("brandTitle")}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-900 font-bold border border-emerald-300">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium truncate">
                {t("brandSubtitle")}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-stone-400">
            {t("platformModules")}
          </div>

          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? "bg-emerald-900 text-white shadow-xs"
                    : "text-stone-700 hover:bg-stone-100 hover:text-emerald-950"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-emerald-300" : "text-stone-500"
                    }`}
                  />
                  <span>{item.name}</span>
                </div>

                {item.badge !== null && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      item.badgeColor || "bg-emerald-200 text-emerald-900"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Quick Simulation Action */}
          <div className="pt-4 px-1">
            <button
              onClick={() => {
                simulateDetection();
                if (onCloseMobile) onCloseMobile();
              }}
              type="button"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold transition-all shadow-sm active:scale-98"
            >
              <Zap className="w-3.5 h-3.5 text-stone-950 fill-stone-950" />
              <span>{t("simulateBtn")}</span>
            </button>
            <p className="text-[10px] text-stone-500 text-center mt-1">
              {language === "hi" ? "लाइव कृत्रिम कीट ध्वनि इनपुट" : "Injects live mock acoustic event"}
            </p>
          </div>
        </nav>

        {/* Hardware Status & Language Switcher Footer */}
        <div className="p-3 border-t border-stone-200 bg-stone-50/80 space-y-2">
          {/* Language Switcher Buttons in Sidebar */}
          <div className="p-2 rounded-lg bg-white border border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-stone-600 font-medium">
              <Globe className="w-3.5 h-3.5 text-emerald-700" />
              <span>{language === "hi" ? "भाषा" : "Language"}:</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`px-2 py-0.5 rounded font-bold transition-all ${
                  language === "en"
                    ? "bg-emerald-900 text-white"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage("hi")}
                className={`px-2 py-0.5 rounded font-bold transition-all ${
                  language === "hi"
                    ? "bg-emerald-900 text-white"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                हिन्दी
              </button>
            </div>
          </div>

          {/* Node Health Status */}
          <div className="p-2.5 rounded-lg bg-white border border-stone-200">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-stone-500 font-medium">{t("sensorsOnline")}</span>
              <span className="font-bold text-emerald-800 font-mono">
                {onlineNodeCount} / {nodes.length} {language === "hi" ? "सक्रिय" : "Active"}
              </span>
            </div>
            <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full"
                style={{ width: `${(onlineNodeCount / nodes.length) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-[9px] text-stone-400 mt-1 font-mono">
              <span>915 MHz LoRa Mesh</span>
              <span>100% {language === "hi" ? "सिग्नल" : "Signal"}</span>
            </div>
          </div>

          {/* Reset Demo Button */}
          <button
            onClick={resetDemoData}
            type="button"
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-200/60 text-[11px] font-medium transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{t("resetDemoBtn")}</span>
          </button>
        </div>
      </aside>
    </>
  );
};
