"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { siteConfig } from "@/config/site";
import { WifiOff, PhoneCall, RefreshCw, Home } from "lucide-react";

export default function OfflinePage() {
  const { t } = useLanguage();

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6">
      <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-md">
        <WifiOff className="w-10 h-10" />
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 font-serif">
        {t("offline.title")}
      </h1>

      <p className="text-base text-stone-600 leading-relaxed">
        {t("offline.desc")}
      </p>

      {/* Emergency Hotline Button */}
      <a
        href={`tel:${siteConfig.phone}`}
        className="w-full py-4 rounded-2xl bg-emerald-800 text-white font-bold text-lg flex items-center justify-center gap-2 shadow-lg min-h-[56px]"
      >
        <PhoneCall className="w-6 h-6 text-amber-400" />
        <span>{t("offline.emergency_call")}</span>
      </a>

      {/* Retry connection */}
      <div className="flex gap-3">
        <button
          onClick={() => window.location.reload()}
          type="button"
          className="flex-1 py-3.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-base flex items-center justify-center gap-2 min-h-[50px]"
        >
          <RefreshCw className="w-5 h-5" />
          <span>{t("offline.retry_btn")}</span>
        </button>

        <Link
          href="/"
          className="flex-1 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-stone-950 font-bold text-base flex items-center justify-center gap-2 min-h-[50px]"
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </Link>
      </div>
    </div>
  );
}
