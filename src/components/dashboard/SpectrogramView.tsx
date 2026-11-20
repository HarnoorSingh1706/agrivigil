"use client";

import React, { useState, useEffect } from "react";
import { AcousticSummary, SpectrogramPoint } from "@/types/agrivigil";
import { Play, Pause, Volume2, Activity, Info, ShieldAlert } from "lucide-react";

interface SpectrogramViewProps {
  summary: AcousticSummary;
  spectrogramPoints: SpectrogramPoint[];
  pestLabel: string;
}

export const SpectrogramView: React.FC<SpectrogramViewProps> = ({
  summary,
  spectrogramPoints,
  pestLabel,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playProgress, setPlayProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlayProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 5;
        });
      }, 150);
    } else {
      setPlayProgress(0);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="bg-stone-900 text-stone-100 rounded-xl p-4 sm:p-5 border border-stone-800 space-y-4">
      {/* Header and Disclaimers */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-900/60 border border-emerald-700/50 flex items-center justify-center text-emerald-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold tracking-tight text-white flex items-center gap-2">
              Bio-Acoustic Spectrogram Analysis
              <span className="text-[10px] font-mono uppercase bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded">
                MEMS Telemetry
              </span>
            </h4>
            <p className="text-xs text-stone-400">
              Fourier Transform Spectral Profile (0.5 kHz - 10.0 kHz)
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-950/60 border border-amber-800/60 text-amber-300 text-[11px]">
          <Info className="w-3.5 h-3.5 shrink-0" />
          <span>Illustrative Mock Visualization</span>
        </div>
      </div>

      {/* Spectrogram Grid Visualizer */}
      <div className="relative bg-stone-950 rounded-lg p-3 border border-stone-800/80 overflow-hidden">
        {/* Frequency Y-Axis Labels */}
        <div className="absolute left-2 top-3 bottom-8 flex flex-col justify-between text-[10px] font-mono text-stone-500 pointer-events-none select-none">
          <span>8.0 kHz</span>
          <span>4.0 kHz</span>
          <span>2.0 kHz</span>
          <span>0.5 kHz</span>
        </div>

        {/* Heatmap Bars Canvas Simulation */}
        <div className="ml-14 mr-2 h-36 flex items-end gap-1.5 sm:gap-2">
          {spectrogramPoints.map((pt, idx) => {
            const isCurrent = isPlaying && Math.floor((playProgress / 100) * spectrogramPoints.length) === idx;
            return (
              <div key={idx} className="flex-1 h-full flex flex-col justify-end gap-1 group relative">
                {/* Tooltip */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center bg-stone-800 border border-stone-700 text-stone-200 text-[10px] py-1 px-2 rounded shadow-lg whitespace-nowrap z-20">
                  <span>Time: {pt.timeSlice}</span>
                  <span>Energy: {pt.intensity} dB</span>
                </div>

                {/* Spectral Heat Columns */}
                <div
                  className={`w-full rounded-t transition-all duration-200 ${
                    isCurrent ? "ring-2 ring-emerald-400" : ""
                  }`}
                  style={{
                    height: `${Math.max(15, pt.intensity)}%`,
                    background: pt.intensity > 80
                      ? "linear-gradient(to top, #065f46, #eab308, #ef4444)"
                      : pt.intensity > 55
                      ? "linear-gradient(to top, #064e3b, #10b981, #f59e0b)"
                      : "linear-gradient(to top, #022c22, #047857, #10b981)",
                  }}
                />
                <span className="text-[9px] font-mono text-stone-500 text-center block truncate">
                  {pt.timeSlice}
                </span>
              </div>
            );
          })}
        </div>

        {/* Playhead indicator */}
        {isPlaying && (
          <div
            className="absolute top-0 bottom-7 w-0.5 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] transition-all duration-150 pointer-events-none"
            style={{ left: `calc(3.5rem + ${playProgress * 0.88}%)` }}
          />
        )}

        <div className="ml-14 mt-1 flex justify-between text-[10px] font-mono text-stone-500">
          <span>0.0s (Trigger)</span>
          <span>Sample Duration: {summary.durationSeconds}s</span>
        </div>
      </div>

      {/* Audio Playback Simulator & Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center bg-stone-950/60 p-3 rounded-lg border border-stone-800">
        <div className="sm:col-span-4 flex items-center gap-3">
          <button
            onClick={togglePlay}
            type="button"
            className="w-9 h-9 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center transition-transform active:scale-95 shadow-md shadow-emerald-950/40"
            aria-label={isPlaying ? "Pause simulated sample" : "Play simulated acoustic sample"}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>
          <div>
            <div className="text-xs font-medium text-stone-200">
              {isPlaying ? "Simulating Audio Stream..." : "Preview Acoustic Capture"}
            </div>
            <div className="text-[10px] text-stone-400 flex items-center gap-1.5">
              <Volume2 className="w-3 h-3 text-emerald-400" />
              <span>Synthesized Bandpass Filter</span>
            </div>
          </div>
        </div>

        {/* Feature Extraction Metrics */}
        <div className="sm:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="bg-stone-900/90 p-2 rounded border border-stone-800">
            <span className="text-[10px] text-stone-400 block">Dominant Freq</span>
            <span className="font-mono font-bold text-emerald-400 text-sm">
              {summary.dominantFrequencyKhz} kHz
            </span>
          </div>
          <div className="bg-stone-900/90 p-2 rounded border border-stone-800">
            <span className="text-[10px] text-stone-400 block">Passband</span>
            <span className="font-mono font-medium text-stone-200 text-xs">
              {summary.bandwidthKhz}
            </span>
          </div>
          <div className="bg-stone-900/90 p-2 rounded border border-stone-800">
            <span className="text-[10px] text-stone-400 block">Pulse Cadence</span>
            <span className="font-mono font-medium text-amber-300 text-xs">
              {summary.pulseRatePerSec} / sec
            </span>
          </div>
          <div className="bg-stone-900/90 p-2 rounded border border-stone-800">
            <span className="text-[10px] text-stone-400 block">Peak Acoustic Energy</span>
            <span className="font-mono font-medium text-stone-200 text-xs">
              {summary.peakEnergyDb} dBFS
            </span>
          </div>
        </div>
      </div>

      {/* Scientific Cautionary Notice */}
      <div className="p-2.5 rounded-lg bg-stone-950/80 border border-stone-800/80 text-[11px] text-stone-400 flex items-start gap-2">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-stone-300">Acoustic Signal Processing Context: </strong>
          {summary.stridulationPattern}. Frequency resonance alone is not a taxonomic proof; microclimatic context and on-site physical entomological scout verification are required before remedial agronomic treatment.
        </p>
      </div>
    </div>
  );
};
