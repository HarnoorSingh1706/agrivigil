"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { ListenButton } from "@/components/ListenButton";
import { AudioWaveGraphic } from "@/components/AudioWaveGraphic";
import { SampleAlertMockup } from "@/components/SampleAlertMockup";
import { ChallengesAccordion } from "@/components/ChallengesAccordion";
import {
  Radio,
  Cpu,
  Smartphone,
  Droplets,
  Thermometer,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  FileCode,
  CheckCircle2,
  Activity,
} from "lucide-react";

export default function HowItWorksPage() {
  const { t } = useLanguage();
  const [researcherOpen, setResearcherOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-16">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="flex justify-center mb-2">
          <ListenButton
            textToRead={`${t("how_page.title")}. ${t("how_page.subtitle")}`}
            sectionId="how-header"
          />
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-emerald-950 font-serif">
          {t("how_page.title")}
        </h1>
        <p className="text-lg sm:text-xl text-stone-600 font-medium">
          {t("how_page.subtitle")}
        </p>
      </div>

      {/* 5-Step End-to-End Pipeline Card */}
      <section className="bg-stone-50 rounded-3xl p-6 sm:p-10 border-2 border-stone-200 shadow-sm space-y-8">
        <h2 className="text-2xl sm:text-3xl font-bold font-serif text-emerald-950 text-center">
          The End-to-End Field Intelligence Pipeline
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {/* Step 1 */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="font-bold text-lg text-emerald-950">Field Device</h3>
            <p className="text-xs text-stone-600">
              Solar-powered, weather-sealed unit mounted near the crop canopy.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="font-bold text-lg text-emerald-950">Multi-Sensors</h3>
            <p className="text-xs text-stone-600">
              Acoustic transducers listen for insect vibrations; sensors measure temp & humidity.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="font-bold text-lg text-emerald-950">Edge & ML Analysis</h3>
            <p className="text-xs text-stone-600">
              Noise cancellation separates wind/tractors from rhythmic feeding signals.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              4
            </div>
            <h3 className="font-bold text-lg text-emerald-950">Action Advisory</h3>
            <p className="text-xs text-stone-600">
              Clear SMS / WhatsApp voice alerts sent to the farmer with microclimate data.
            </p>
          </div>

          {/* Step 5 */}
          <div className="bg-white p-5 rounded-2xl border-2 border-emerald-600 shadow-sm space-y-2 bg-emerald-50/50">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 text-amber-400 flex items-center justify-center font-bold">
              5
            </div>
            <h3 className="font-bold text-lg text-emerald-950">Farmer Acts</h3>
            <p className="text-xs text-stone-600">
              Targeted spot-inspection or micro-spraying only where threats exist.
            </p>
          </div>
        </div>
      </section>

      {/* Acoustic Sensing Deep Dive + Interactive Wave Graphic */}
      <section className="space-y-6">
        <div className="max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 font-serif mb-2">
            {t("how_page.acoustic_title")}
          </h2>
          <p className="text-base sm:text-lg text-stone-700 leading-relaxed mb-3">
            {t("how_page.acoustic_desc")}
          </p>
          <div className="text-xs text-amber-900 bg-amber-50 p-3 rounded-xl border border-amber-300">
            {t("how_page.acoustic_disclaimer")}
          </div>
        </div>

        {/* Audio Wave Visualizer Component */}
        <AudioWaveGraphic />
      </section>

      {/* Irrigation Optimization Explainer */}
      <section className="bg-emerald-50 rounded-3xl p-6 sm:p-10 border border-emerald-200 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-200/60 px-3 py-1 rounded-full">
              Water Stewardship
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 font-serif mt-2">
              {t("how_page.irrigation_title")}
            </h2>
          </div>
          <ListenButton
            textToRead={`${t("how_page.irrigation_title")}. ${t("how_page.irrigation_desc")}`}
            sectionId="irrigation-explainer"
          />
        </div>

        <p className="text-base sm:text-lg text-stone-800 leading-relaxed max-w-4xl">
          {t("how_page.irrigation_desc")}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-white p-4 rounded-2xl border border-emerald-200 flex items-center gap-3">
            <Thermometer className="w-8 h-8 text-rose-600 flex-shrink-0" />
            <div>
              <div className="font-bold text-stone-900 text-sm">Temperature Tracking</div>
              <div className="text-xs text-stone-500">Detecting midday peak evaporative stress</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-emerald-200 flex items-center gap-3">
            <Droplets className="w-8 h-8 text-sky-600 flex-shrink-0" />
            <div>
              <div className="font-bold text-stone-900 text-sm">Relative Humidity</div>
              <div className="text-xs text-stone-500">Evaluating canopy moisture retention</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-emerald-200 flex items-center gap-3">
            <Activity className="w-8 h-8 text-emerald-700 flex-shrink-0" />
            <div>
              <div className="font-bold text-stone-900 text-sm">Vapor Pressure Deficit</div>
              <div className="text-xs text-stone-500">Guiding irrigation before plant wilting</div>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Alert Mockup Section */}
      <section className="space-y-4">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 font-serif mb-2">
            {t("how_page.sample_alert_title")}
          </h2>
          <p className="text-sm text-stone-600">
            Clear, actionable alerts delivered straight to basic mobile phones in local dialects.
          </p>
        </div>

        <SampleAlertMockup />
      </section>

      {/* Challenges We're Solving (Accordion) */}
      <section className="space-y-6 pt-4">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 font-serif mb-2">
            {t("how_page.challenges_title")}
          </h2>
          <p className="text-base text-stone-600">
            {t("how_page.challenges_subtitle")}
          </p>
        </div>

        <ChallengesAccordion />
      </section>

      {/* Collapsible Technical Section for Researchers & Agronomists */}
      <section className="border-2 border-stone-300 rounded-3xl overflow-hidden bg-white">
        <button
          onClick={() => setResearcherOpen(!researcherOpen)}
          type="button"
          className="w-full p-6 text-left flex items-center justify-between gap-4 bg-stone-100 hover:bg-stone-200/70 transition-colors focus:outline-none min-h-[56px]"
          aria-expanded={researcherOpen}
        >
          <div className="flex items-center gap-3">
            <FileCode className="w-6 h-6 text-emerald-800 flex-shrink-0" />
            <span className="font-bold text-lg sm:text-xl text-emerald-950 font-serif">
              {t("how_page.researcher_toggle")}
            </span>
          </div>
          {researcherOpen ? (
            <ChevronUp className="w-6 h-6 text-stone-700" />
          ) : (
            <ChevronDown className="w-6 h-6 text-stone-700" />
          )}
        </button>

        {researcherOpen && (
          <div className="p-6 sm:p-8 space-y-4 text-sm text-stone-700 bg-stone-50 border-t border-stone-200">
            <p className="leading-relaxed font-mono text-xs sm:text-sm bg-stone-900 text-stone-100 p-4 rounded-xl">
              {t("how_page.researcher_note")}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-white p-4 rounded-xl border border-stone-200">
                <h4 className="font-bold text-stone-900 mb-1">Acoustic Signal Processing</h4>
                <p className="text-xs text-stone-600">
                  Continuous discrete Fourier transform (DFT) windowing with spectral gating to isolate repetitive chewing transients from turbulent aerodynamic baseline signals.
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-stone-200">
                <h4 className="font-bold text-stone-900 mb-1">Microclimate Modeling</h4>
                <p className="text-xs text-stone-600">
                  Allen-Faulkner Penman-Monteith derived calculations for hourly potential evapotranspiration (PET) alongside real-time degree-day accumulation for pest phenology modeling.
                </p>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
