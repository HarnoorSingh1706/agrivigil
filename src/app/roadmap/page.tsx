"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { ListenButton } from "@/components/ListenButton";
import { roadmapStages, CURRENT_STAGE, pilotMetricsToMeasure } from "@/config/roadmap";
import {
  CheckCircle2,
  Clock,
  CircleDashed,
  Target,
  ShieldAlert,
  EyeOff,
  Droplets,
  Sparkles,
  TrendingDown,
  BadgeIndianRupee,
  Layers,
} from "lucide-react";

export default function RoadmapPage() {
  const { t } = useLanguage();

  const iconMap: Record<string, any> = {
    Target,
    ShieldAlert,
    EyeOff,
    Droplets,
    Sparkles,
    TrendingDown,
    BadgeIndianRupee,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="flex justify-center mb-2">
          <ListenButton
            textToRead={`${t("roadmap_page.title")}. ${t("roadmap_page.subtitle")}`}
            sectionId="roadmap-header"
          />
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-emerald-950 font-serif">
          {t("roadmap_page.title")}
        </h1>
        <p className="text-lg text-stone-600 font-medium">
          {t("roadmap_page.subtitle")}
        </p>

        {/* Current Active Milestone Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-400 text-stone-950 font-extrabold text-sm sm:text-base shadow-md border-2 border-amber-500 animate-pulse">
          <Clock className="w-5 h-5 text-stone-950" />
          <span>{t("roadmap_page.current_stage_badge")}</span>
        </div>
      </div>

      {/* 9-Stage Visual Timeline */}
      <section className="bg-stone-50 rounded-3xl p-6 sm:p-10 border-2 border-stone-200 shadow-sm space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-emerald-950">
            9-Stage DeepTech Development Track
          </h2>
          <span className="text-xs text-stone-500 font-mono">
            Configured in: src/config/roadmap.ts
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {roadmapStages.map((st) => {
            const isCurrent = st.stage === CURRENT_STAGE;
            const isCompleted = st.stage < CURRENT_STAGE;
            const isPlanned = st.stage > CURRENT_STAGE;

            const title = t(`roadmap_stages.${st.titleKey}`);
            const desc = t(`roadmap_stages.${st.descKey}`);

            return (
              <div
                key={st.stage}
                className={`rounded-2xl p-6 border-2 transition-all relative flex flex-col justify-between ${
                  isCurrent
                    ? "bg-amber-50/70 border-amber-500 shadow-md ring-2 ring-amber-400"
                    : isCompleted
                    ? "bg-white border-emerald-600 text-stone-900"
                    : "bg-white/80 border-stone-200 text-stone-500"
                }`}
              >
                <div>
                  {/* Status header & Stage number */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        isCurrent
                          ? "bg-amber-400 text-stone-950"
                          : isCompleted
                          ? "bg-emerald-100 text-emerald-900"
                          : "bg-stone-100 text-stone-600"
                      }`}
                    >
                      {t("roadmap_page.stage_label")} {st.stage}
                    </span>

                    {isCurrent && (
                      <span className="flex items-center gap-1 text-xs font-bold text-amber-900">
                        <Clock className="w-3.5 h-3.5 animate-spin" />
                        In Progress
                      </span>
                    )}
                    {isCompleted && (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Completed
                      </span>
                    )}
                    {isPlanned && (
                      <span className="flex items-center gap-1 text-xs font-medium text-stone-400">
                        <CircleDashed className="w-3.5 h-3.5" />
                        Planned
                      </span>
                    )}
                  </div>

                  {/* Stage Title */}
                  <h3
                    className={`text-lg font-bold font-serif mb-2 ${
                      isCurrent ? "text-emerald-950" : isCompleted ? "text-emerald-900" : "text-stone-700"
                    }`}
                  >
                    {title}
                  </h3>

                  {/* Stage Description */}
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-4">
                    {desc}
                  </p>
                </div>

                <div className="flex justify-end pt-2 border-t border-stone-100">
                  <ListenButton textToRead={`${title}. ${desc}`} sectionId={`stage-${st.stage}`} compact />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Pilot Metrics We WILL Measure */}
      <section className="bg-emerald-950 text-white rounded-3xl p-6 sm:p-12 shadow-2xl border-4 border-amber-400 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-4xl font-extrabold font-serif text-white">
            {t("roadmap_page.metrics_title")}
          </h2>
          <p className="text-emerald-200 text-sm sm:text-base">
            {t("roadmap_page.metrics_subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pilotMetricsToMeasure.map((metric) => {
            const Icon = iconMap[metric.icon] || Target;
            const title = t(`metrics.${metric.metricKey}`);
            const desc = t(`metrics.${metric.descKey}`);

            return (
              <div
                key={metric.id}
                className="bg-emerald-900/80 p-5 rounded-2xl border border-emerald-700/80 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-lg text-white font-serif">{title}</h3>
                  <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">{desc}</p>
                </div>

                <div className="flex justify-end pt-3">
                  <ListenButton textToRead={`${title}. ${desc}`} sectionId={`metric-${metric.id}`} compact />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
