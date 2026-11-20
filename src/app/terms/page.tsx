"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { AlertCircle, Scale } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function TermsPage() {
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
        {t("legal.terms_title")}
      </h1>
      <p className="text-sm text-stone-500">Effective Date: November 2026 • AgriVigil Precision Agriculture</p>

      {/* R&D Pilot Collaboration Terms */}
      <div className="space-y-4 text-stone-700 leading-relaxed">
        <h2 className="text-2xl font-bold font-serif text-emerald-950">1. Pilot Stage Participation</h2>
        <p>
          AgriVigil devices and algorithmic recommendations are provided for research, validation, and pilot advisory purposes. As an early-stage DeepTech venture, targets such as 500 m² coverage per sensing unit and species-specific acoustic classification are undergoing active field evaluation.
        </p>

        <h2 className="text-2xl font-bold font-serif text-emerald-950">2. Farmer Advisory & Discretion</h2>
        <p>
          Alerts delivered via WhatsApp, SMS, or voice are intended to assist farmers with timely field inspection. Farmers retain full discretion regarding the application of chemical pesticides and irrigation pump operations.
        </p>

        <h2 className="text-2xl font-bold font-serif text-emerald-950">3. Commercial Pricing</h2>
        <p>
          Commercial pricing models and maintenance service agreements are not finalized and are being established during pilot partnerships.
        </p>
      </div>

      <div className="pt-6 border-t border-stone-200 text-sm text-stone-600">
        Inquiries regarding terms:{" "}
        <a href={`mailto:${siteConfig.email}`} className="text-emerald-800 font-bold hover:underline">
          {siteConfig.email}
        </a>
      </div>
    </div>
  );
}
