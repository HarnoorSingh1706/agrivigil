"use client";

import React from "react";
import { Hardware3DViewer } from "@/components/dashboard/Hardware3DViewer";
import { useAgriVigil } from "@/context/AgriVigilContext";
import {
  Box,
  Layers,
  Cpu,
  Radio,
  Sparkles,
  TreePine,
  Download,
  Share2,
  CheckCircle2,
  BookOpen
} from "lucide-react";

export default function Hardware3DPage() {
  const { t } = useAgriVigil();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
              Interactive 3D Hardware Simulation
            </span>
            <span className="text-xs text-stone-500 font-medium">
              Academic & Investor Showcase Edition
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-emerald-950 font-serif mt-1">
            AgriVigil Bio-Acoustic Stethoscope Node (3D Architecture)
          </h2>
          <p className="text-xs text-stone-500 max-w-2xl">
            Explore the physical engineering, MEMS acoustic waveguide, on-edge TinyML microcontroller, and solar harvesting mechanism that enables non-destructive early insect detection inside tree trunks.
          </p>
        </div>
      </div>

      {/* Main 3D Model Explorer */}
      <Hardware3DViewer />

      {/* Hardware Architecture & Explanatory Cards for Teachers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800">
            <Cpu className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-stone-900">
            Edge AI (TinyML on ESP32-S3)
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            The node computes 512-point FFT spectrograms and feeds spectral energy distributions to an on-device 1D-CNN. Audio is processed directly at the tree—no costly raw audio is uploaded over cellular networks.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center text-sky-800">
            <Radio className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-stone-900">
            Sub-GHz LoRaWAN Relay
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Operating at 868/915 MHz allows signals to penetrate dense canopy foliage across several kilometers. Transmission duty cycles stay under 1% to conserve battery power for up to 3 years without maintenance.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800">
            <TreePine className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-stone-900">
            Acoustic Waveguide Penetration
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Direct physical contact with trunk fibers acts as an acoustic stethoscope. It bypasses wind noise and birdsong in the air, picking up sound pulses transmitted through the tree’s rigid vascular bundles.
          </p>
        </div>
      </div>
    </div>
  );
}
