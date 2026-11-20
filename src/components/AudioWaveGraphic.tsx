"use client";

import React, { useState } from "react";
import { Activity, ShieldCheck, Waves, Filter } from "lucide-react";

export const AudioWaveGraphic: React.FC = () => {
  const [filterMode, setFilterMode] = useState<"raw" | "filtered">("filtered");

  return (
    <div className="bg-stone-900 text-stone-100 rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-800 relative overflow-hidden">
      {/* Visual Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase tracking-wider mb-1">
            <Activity className="w-4 h-4 animate-pulse" />
            <span>Bio-Acoustic Transducer Spectrum</span>
          </div>
          <h4 className="text-xl sm:text-2xl font-bold font-serif text-white">
            Insect Frequency Detection (50 Hz - 20 kHz)
          </h4>
        </div>

        {/* Filter Toggle Controls */}
        <div className="flex items-center gap-1.5 bg-stone-800 p-1.5 rounded-xl border border-stone-700">
          <button
            onClick={() => setFilterMode("filtered")}
            type="button"
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              filterMode === "filtered"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-stone-400 hover:text-stone-200"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Target Insect Pattern</span>
          </button>
          <button
            onClick={() => setFilterMode("raw")}
            type="button"
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              filterMode === "raw"
                ? "bg-amber-600 text-white shadow-sm"
                : "text-stone-400 hover:text-stone-200"
            }`}
          >
            <Waves className="w-3.5 h-3.5" />
            <span>Raw Field Signal</span>
          </button>
        </div>
      </div>

      {/* Acoustic Frequency Wave Canvas Simulation */}
      <div className="bg-stone-950 rounded-2xl p-4 sm:p-6 border border-stone-800 relative">
        {/* Grid lines */}
        <div className="absolute inset-0 grid grid-cols-6 grid-rows-3 opacity-15 pointer-events-none">
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} className="border border-stone-500" />
          ))}
        </div>

        <div className="relative h-28 sm:h-36 flex items-center justify-between gap-1 sm:gap-2 px-2">
          {Array.from({ length: 32 }).map((_, i) => {
            // Compute dynamic heights based on mode
            const isInsectSignatureZone = i >= 12 && i <= 20;
            let barHeight = "h-4";

            if (filterMode === "raw") {
              // High chaotic noise everywhere (wind, leaves)
              const heights = ["h-12", "h-20", "h-28", "h-16", "h-24", "h-32", "h-10", "h-26"];
              barHeight = heights[i % heights.length];
            } else {
              // Filtered: noise suppressed, insect signature accentuated in target band
              if (isInsectSignatureZone) {
                const signatureHeights = ["h-20", "h-28", "h-32", "h-24", "h-30", "h-22", "h-26", "h-34"];
                barHeight = signatureHeights[i % signatureHeights.length];
              } else {
                barHeight = "h-3 sm:h-4";
              }
            }

            return (
              <div key={i} className="flex-1 flex flex-col items-center justify-center gap-1">
                <div
                  className={`w-full max-w-[8px] rounded-full transition-all duration-300 ${
                    filterMode === "raw"
                      ? "bg-stone-600"
                      : isInsectSignatureZone
                      ? "bg-amber-400 animate-pulse"
                      : "bg-emerald-900/60"
                  } ${barHeight}`}
                />
              </div>
            );
          })}
        </div>

        {/* Legend / Frequency Markers */}
        <div className="flex justify-between text-[11px] text-stone-500 font-mono mt-3 border-t border-stone-800 pt-2">
          <span>50 Hz (Low Vibration)</span>
          <span className="text-amber-400 font-semibold">
            {filterMode === "filtered" ? "⚡ Insect Chewing & Burrowing Window" : "Broadband Noise"}
          </span>
          <span>20 kHz (Acoustic Ceiling)</span>
        </div>
      </div>

      {/* Explanatory Caption */}
      <div className="mt-4 flex items-start gap-2.5 text-xs sm:text-sm text-stone-400">
        <Filter className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
        <p>
          <strong className="text-stone-200">How our software separates sound:</strong> Insects make
          subtle, rhythmic vibrations when chewing crop tissue. AgriVigil applies digital filters to suppress
          wind and machinery hum while monitoring for biological acoustic patterns.
        </p>
      </div>
    </div>
  );
};
