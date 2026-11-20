"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { ShieldCheck } from "lucide-react";

export const CookieConsent: React.FC = () => {
  const [accepted, setAccepted] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const hasConsent = localStorage.getItem("agrivigil_cookie_consent");
    if (!hasConsent) {
      setAccepted(false);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("agrivigil_cookie_consent", "true");
    setAccepted(true);
  };

  if (accepted) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-40 bg-stone-900 text-stone-100 p-4 rounded-2xl shadow-2xl border border-stone-700 animate-fade-in">
      <div className="flex items-start gap-3 mb-3">
        <ShieldCheck className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs sm:text-sm text-stone-300 leading-snug">
          We use local cookies strictly to remember your language preference and ensure voice accessibility. No personal telemetry is sold.
        </p>
      </div>
      <div className="flex justify-end gap-2">
        <button
          onClick={handleAccept}
          type="button"
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors min-h-[44px]"
        >
          {t("lang_modal.continue", "Got it / समझ गए")}
        </button>
      </div>
    </div>
  );
};
