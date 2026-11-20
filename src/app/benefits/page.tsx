"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { ListenButton } from "@/components/ListenButton";
import Link from "next/link";
import {
  Users,
  Building2,
  TreePine,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";

export default function BenefitsPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"farmer" | "fpo" | "enterprise" | "research">("farmer");

  const tabData = {
    farmer: {
      title: t("benefits_page.farmer_tab"),
      quote: t("benefits_page.farmer_quote"),
      icon: Users,
      points: [
        "Acoustic alert target: Early warnings before visible leaf damage spreads.",
        "Preventive chemical use: Advice to spray only when pest pressure exceeds actionable thresholds.",
        "Smarter water pumping: Less electricity or diesel wasted pumping water in midday heat.",
        "Voice alerts: Regional language WhatsApp audio notes and SMS—no high-tech literacy barrier.",
      ],
    },
    fpo: {
      title: t("benefits_page.fpo_tab"),
      quote: t("benefits_page.fpo_quote"),
      icon: Building2,
      points: [
        "Cluster-level surveillance: Multi-plot early warning across member acreage.",
        "Coordinated pest defense: Timely advisories prevent outbreaks from jumping between adjoining fields.",
        "Bulk input optimization: Helping members reduce wasteful pesticide purchases.",
        "Traceability & sustainability data: Better market linkages with certified eco-friendly produce.",
      ],
    },
    enterprise: {
      title: t("benefits_page.enterprise_tab"),
      quote: t("benefits_page.enterprise_quote"),
      icon: TreePine,
      points: [
        "High-value crop protection: Tailored monitoring for orchards, cotton, tea, coffee, and polyhouses.",
        "Automated continuous scouting: 24/7 night and dawn acoustic listening when scouting crews are absent.",
        "Microclimate VPD logging: Data-driven precision irrigation schedules.",
        "Audit trail for compliance: Documented reduction in chemical runoff and groundwater conservation.",
      ],
    },
    research: {
      title: t("benefits_page.research_tab"),
      quote: t("benefits_page.research_quote"),
      icon: GraduationCap,
      points: [
        "Calibrated bio-acoustic datasets: High-fidelity audio frequency recordings for entomology.",
        "Ground-truth correlation: Real-world insect phenology correlated with microclimate time-series.",
        "Open collaborative R&D: Joint pilot publication opportunities with agricultural universities.",
        "IP & validation rigor: Testing species differentiation models across multi-varietal trial plots.",
      ],
    },
  };

  const current = tabData[activeTab];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="flex justify-center mb-2">
          <ListenButton
            textToRead={`${t("benefits_page.title")}. ${t("benefits_page.subtitle")}`}
            sectionId="benefits-header"
          />
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-emerald-950 font-serif">
          {t("benefits_page.title")}
        </h1>
        <p className="text-lg text-stone-600 font-medium">
          {t("benefits_page.subtitle")}
        </p>

        {/* Honest R&D Note */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-950 text-xs font-bold border border-amber-300">
          <ShieldCheck className="w-4 h-4 text-amber-700" />
          <span>Objectives being validated in ongoing pilot trials; not verified commercial guarantees.</span>
        </div>
      </div>

      {/* Stakeholder Switcher Buttons */}
      <div className="flex flex-wrap justify-center gap-3">
        {(["farmer", "fpo", "enterprise", "research"] as const).map((tabKey) => {
          const tab = tabData[tabKey];
          const isActive = activeTab === tabKey;
          const TabIcon = tab.icon;

          return (
            <button
              key={tabKey}
              onClick={() => setActiveTab(tabKey)}
              type="button"
              className={`px-5 py-3.5 rounded-2xl font-bold text-base sm:text-lg transition-all flex items-center gap-2.5 min-h-[56px] ${
                isActive
                  ? "bg-emerald-800 text-white shadow-lg ring-2 ring-emerald-600"
                  : "bg-white text-stone-700 border border-stone-300 hover:bg-stone-50"
              }`}
            >
              <TabIcon className={`w-5 h-5 ${isActive ? "text-amber-400" : "text-emerald-700"}`} />
              <span>{tab.title}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tab Showcase Card */}
      <div className="bg-stone-50 rounded-3xl p-6 sm:p-10 border-2 border-emerald-700 shadow-xl max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              Target Value Proposition
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 font-serif mt-2">
              {current.title}
            </h2>
          </div>

          <ListenButton
            textToRead={`${current.title}. ${current.quote}. ${current.points.join(". ")}`}
            sectionId={`benefits-${activeTab}`}
          />
        </div>

        {/* Goal Quote */}
        <blockquote className="p-4 rounded-2xl bg-white border-l-4 border-amber-500 text-stone-800 text-lg sm:text-xl font-medium italic shadow-sm">
          &quot;{current.quote}&quot;
        </blockquote>

        {/* Objective Points */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {current.points.map((pt, i) => (
            <div key={i} className="bg-white p-4 rounded-xl border border-stone-200 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
              <span className="text-stone-800 text-sm sm:text-base leading-snug">{pt}</span>
            </div>
          ))}
        </div>

        {/* Pilot CTA link */}
        <div className="pt-4 flex justify-end">
          <Link
            href="/pilot"
            className="px-6 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-base transition-colors flex items-center gap-2 shadow-sm min-h-[50px]"
          >
            <span>Apply as {current.title}</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
