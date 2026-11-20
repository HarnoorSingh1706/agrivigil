"use client";

import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { AlertTriangle, Droplets, Thermometer, ShieldAlert, CheckCircle2 } from "lucide-react";
import { ListenButton } from "./ListenButton";

export const SampleAlertMockup: React.FC = () => {
  const { t } = useLanguage();

  const alertText = t("how_page.sample_alert_body");

  return (
    <div className="bg-stone-50 rounded-3xl p-6 sm:p-8 border-2 border-amber-300 shadow-xl max-w-xl mx-auto my-6 text-stone-900">
      {/* Prominent Honesty Badge */}
      <div className="flex items-center justify-between gap-2 border-b border-stone-200 pb-3 mb-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-950 font-bold text-xs uppercase tracking-wider border border-amber-400">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
          {t("how_page.sample_alert_tag", "Illustration / Sample Alert Only")}
        </span>

        <span className="text-xs text-stone-500 font-medium">WhatsApp / SMS Advisory</span>
      </div>

      {/* Simulated Phone Message Card */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-200 space-y-4">
        {/* Message Header */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500 text-amber-950 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-base sm:text-lg text-emerald-950">
              AgriVigil Field Intelligence Alert
            </h4>
            <span className="text-xs text-stone-500">Sent Today • 06:45 AM (Dawn Activity)</span>
          </div>
        </div>

        {/* Advisory Message Text */}
        <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 text-base sm:text-lg font-medium text-stone-900 leading-relaxed">
          {alertText}
        </div>

        {/* Microclimate Telemetry Pill */}
        <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm font-semibold">
          <div className="bg-stone-100 p-2.5 rounded-lg flex items-center gap-2 text-stone-800">
            <Thermometer className="w-4 h-4 text-rose-600" />
            <span>Temp: 32°C (Heat Index High)</span>
          </div>
          <div className="bg-stone-100 p-2.5 rounded-lg flex items-center gap-2 text-stone-800">
            <Droplets className="w-4 h-4 text-sky-600" />
            <span>Humidity: 68% (VPD Stable)</span>
          </div>
        </div>

        {/* Farmer Recommended Action */}
        <div className="flex items-center gap-2 text-xs text-emerald-900 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
          <span>Preventive Action: Manual spot-check South zone; withhold calendar spray.</span>
        </div>
      </div>

      {/* Listen to this Alert button */}
      <div className="mt-4 flex justify-end">
        <ListenButton
          textToRead={alertText}
          sectionId="sample-alert"
          label={t("voice.listen_section", "Listen to Alert")}
        />
      </div>
    </div>
  );
};
