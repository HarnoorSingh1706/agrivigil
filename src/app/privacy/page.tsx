"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { ShieldCheck, AlertCircle } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function PrivacyPage() {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8 text-stone-900">
      {/* Legal review flag */}
      <div className="p-4 bg-amber-50 border-2 border-amber-400 rounded-2xl flex items-start gap-3 text-amber-950 text-sm">
        <AlertCircle className="w-5 h-5 text-amber-800 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="block font-bold">Important Notice:</strong>
          {t("legal.legal_notice", "Template document – needs formal review by legal counsel before commercial launch.")}
        </div>
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-emerald-950 font-serif">
        {t("legal.privacy_title")}
      </h1>
      <p className="text-sm text-stone-500">Effective Date: November 2026 • AgriVigil Research & Development</p>

      {/* Voice Data Privacy Guarantee */}
      <div className="bg-emerald-50 border-2 border-emerald-600 rounded-2xl p-6 space-y-3">
        <div className="flex items-center gap-2 text-emerald-900 font-bold text-lg">
          <ShieldCheck className="w-6 h-6 text-emerald-700" />
          <span>{t("legal.voice_privacy_title")}</span>
        </div>
        <p className="text-base text-stone-700 leading-relaxed">
          {t("legal.voice_privacy_desc")}
        </p>
      </div>

      {/* Field Sensor Telemetry */}
      <div className="space-y-3">
        <h2 className="text-2xl font-bold font-serif text-emerald-950">
          {t("legal.field_data_title")}
        </h2>
        <p className="text-stone-700 leading-relaxed">
          {t("legal.field_data_desc")}
        </p>
      </div>

      {/* Contact info for privacy requests */}
      <div className="pt-6 border-t border-stone-200 text-sm text-stone-600">
        For privacy inquiries or data removal requests, contact:{" "}
        <a href={`mailto:${siteConfig.email}`} className="text-emerald-800 font-bold hover:underline">
          {siteConfig.email}
        </a>
      </div>
    </div>
  );
}
