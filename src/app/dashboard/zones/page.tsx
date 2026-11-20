"use client";

import React, { useState } from "react";
import { useAgriVigil } from "@/context/AgriVigilContext";
import { ZoneId, PlantationZone } from "@/types/agrivigil";
import {
  Grid,
  MapPin,
  Radio,
  Thermometer,
  Droplets,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Info,
  Clock,
  Battery,
  Wifi,
  ExternalLink,
  ClipboardList,
} from "lucide-react";

export default function PlantationZonesMapPage() {
  const {
    zones,
    selectedZoneId,
    setSelectedZoneId,
    nodes,
    detections,
    simulateDetection,
    setSelectedDetection,
    addToast,
    t,
  } = useAgriVigil();

  const [activeTab, setActiveTab] = useState<"schematic" | "list">("schematic");

  // The currently focused zone in the inspector
  const activeZone: PlantationZone =
    (selectedZoneId !== "all"
      ? zones.find((z) => z.id === selectedZoneId)
      : null) || zones[1]; // default to Zone B (the highlighted alert zone)

  const activeNode = nodes.find((n) => n.zoneId === activeZone.id);
  const zoneDetections = detections.filter((d) => d.zoneId === activeZone.id);

  const handleDispatchScout = (zone: PlantationZone) => {
    addToast(
      "Scout Dispatched",
      `Agronomic field scout dispatched to ${zone.name}. Tablet sync checklist active.`,
      "info"
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
              Spatial Field Grid &bull; 13.1 Hectares
            </span>
            <span className="text-xs text-stone-500">
              Schematic Microclimate & Bio-Acoustic Topology
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-emerald-950 font-serif mt-1">
            {t("zonesHeading", "Plantation Schematic Zones & Spatial Grid Map")}
          </h2>
          <p className="text-xs text-stone-500 max-w-2xl">
            {t("zonesSub", "Clean schematic representation of plantation management blocks. Click any zone block to focus telemetry, inspect attached hardware nodes, and track localized insect sound bursts.")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => simulateDetection(activeZone.id)}
            type="button"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold transition-all shadow-xs active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 fill-stone-950" />
            <span>{t("simulateBtn", "Simulate")} in {activeZone.code}</span>
          </button>
        </div>
      </div>

      {/* Schematic Layout vs Detailed Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Schematic Plantation Diagram (Grid representation) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div>
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <Grid className="w-4 h-4 text-emerald-700" />
                {t("schematicTitle", "Schematic Plantation Field Diagram")}
              </h3>
              <p className="text-[11px] text-stone-500">
                Grid layout reflects topological canopy blocks and IoT acoustic sensor deployment positions.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-[11px] text-stone-600 font-medium">
                {t("inspectionReq", "Inspection Flagged")}
              </span>
            </div>
          </div>

          {/* Schematic Field Map (2x2 Grid with Buffer) */}
          <div className="bg-[#f2efe9] rounded-xl p-4 sm:p-6 border border-stone-300 relative space-y-4">
            {/* Compass Orientation Indicator */}
            <div className="flex justify-between items-center text-[10px] font-mono text-stone-500 uppercase px-1">
              <span>North Canopy Border (Windward)</span>
              <span className="bg-white/80 px-2 py-0.5 rounded border border-stone-300 font-bold">
                N ↑
              </span>
            </div>

            {/* Grid of Plantation Blocks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {zones.map((zone) => {
                const isSelected = activeZone.id === zone.id;
                const node = nodes.find((n) => n.zoneId === zone.id);

                return (
                  <div
                    key={zone.id}
                    onClick={() => setSelectedZoneId(zone.id)}
                    className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer bg-white flex flex-col justify-between min-h-[170px] ${
                      isSelected
                        ? "border-emerald-700 shadow-md ring-2 ring-emerald-600/30"
                        : "border-stone-200 hover:border-emerald-400 hover:shadow-xs"
                    } ${
                      zone.status === "alert"
                        ? "border-rose-400 bg-rose-50/20"
                        : zone.status === "warning"
                        ? "border-amber-300 bg-amber-50/20"
                        : ""
                    }`}
                  >
                    {/* Top Row: Zone code, Name & Status Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs font-bold text-white bg-emerald-900 px-2 py-0.5 rounded">
                            {zone.code}
                          </span>
                          <span className="text-[10px] text-stone-500 font-mono">
                            {zone.areaHectares} ha
                          </span>
                        </div>
                        <h4 className="font-bold text-stone-900 text-sm mt-1">
                          {zone.name.split("-")[1]?.trim() || zone.name}
                        </h4>
                        <div className="text-[10px] text-stone-500 truncate max-w-[180px]">
                          {zone.cropType}
                        </div>
                      </div>

                      {zone.inspectionRequired && (
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300 text-[10px] font-bold animate-pulse">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Inspect</span>
                        </div>
                      )}
                    </div>

                    {/* Sensor Node Placement Badge */}
                    <div className="bg-stone-50 p-2 rounded-lg border border-stone-200 my-2 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <Radio className="w-3.5 h-3.5 text-emerald-700" />
                        <span className="font-mono font-semibold text-stone-800">
                          {zone.primaryNodeId}
                        </span>
                      </div>
                      <span className="text-[10px] text-emerald-700 font-medium">
                        Online &bull; 915 MHz
                      </span>
                    </div>

                    {/* Footer Stats inside block */}
                    <div className="flex items-center justify-between text-xs text-stone-600 pt-2 border-t border-stone-100">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-0.5 font-medium">
                          <Thermometer className="w-3 h-3 text-rose-600" />
                          {zone.currentTemp}°C
                        </span>
                        <span className="flex items-center gap-0.5 font-medium">
                          <Droplets className="w-3 h-3 text-sky-600" />
                          {zone.currentHumidity}%
                        </span>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                          zone.pestActivityLevel === "High" || zone.pestActivityLevel === "Critical"
                            ? "bg-rose-100 text-rose-800"
                            : zone.pestActivityLevel === "Moderate"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {zone.pestActivityLevel}
                      </span>
                    </div>

                    {/* Selected Ring Pointer */}
                    {isSelected && (
                      <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-emerald-800 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs uppercase tracking-wider">
                        Active Focus
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Buffer & Canal Section in Schematic */}
              <div className="p-4 rounded-xl border border-dashed border-stone-300 bg-stone-100/60 flex flex-col justify-center items-center text-center text-xs text-stone-500">
                <div className="font-semibold text-stone-700 mb-1">
                  Buffer Zone & Irrigation Canal
                </div>
                <p className="text-[11px] text-stone-400 max-w-xs leading-tight">
                  Natural biodiversity windbreak corridor. Potential wild host vegetation boundary.
                </p>
                <span className="mt-2 text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-stone-200">
                  Perimeter Acoustic Mesh Gateway
                </span>
              </div>
            </div>

            <div className="text-[10px] text-stone-500 flex justify-between px-1">
              <span>South Forest Margin (Leeward)</span>
              <span>Elevation: 18m MSL</span>
            </div>
          </div>

          {/* Schematic Diagram Legend */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-stone-600 pt-1">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-rose-500" />
                <span>Critical / Inspection Required</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-amber-400" />
                <span>Elevated Activity Watch</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-500" />
                <span>Optimal Bio-Acoustic State</span>
              </span>
            </div>
            <span className="text-[11px] text-stone-400">
              Click any block to focus
            </span>
          </div>
        </div>

        {/* Right Column: Active Zone Telemetry & Inspection Inspector */}
        <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-4">
          <div className="border-b border-stone-200 pb-3 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-white bg-emerald-900 px-2 py-0.5 rounded">
                  {activeZone.code}
                </span>
                <span className="text-xs text-stone-500 font-mono">
                  {activeZone.primaryNodeId}
                </span>
              </div>
              <h3 className="text-base font-bold text-stone-900 mt-1">
                {activeZone.name}
              </h3>
              <p className="text-xs text-stone-500">{activeZone.cropType}</p>
            </div>

            <span
              className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase ${
                activeZone.status === "alert"
                  ? "bg-rose-100 text-rose-800 border border-rose-300"
                  : activeZone.status === "warning"
                  ? "bg-amber-100 text-amber-800 border border-amber-300"
                  : "bg-emerald-100 text-emerald-800 border border-emerald-300"
              }`}
            >
              {activeZone.status === "alert"
                ? t("inspectionReq", "Inspection Required")
                : activeZone.status === "warning"
                ? t("attention", "Elevated")
                : t("stable", "Optimal")}
            </span>
          </div>

          {/* Inspection Alert Callout if required */}
          {activeZone.inspectionRequired && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-rose-900">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Ground Scout Action Triggered</span>
              </div>
              <p className="text-rose-900 leading-relaxed text-xs">
                {activeZone.inspectionReason ||
                  "Acoustic threshold exceeded. Ground verification recommended before chemical treatment."}
              </p>
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => handleDispatchScout(activeZone)}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <ClipboardList className="w-3.5 h-3.5" />
                  <span>{t("dispatchScout", "Dispatch Scout")} ({activeZone.code})</span>
                </button>
              </div>
            </div>
          )}

          {/* Zone Microclimate & Hardware State */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-stone-50 p-3 rounded-lg border border-stone-200">
              <span className="text-[10px] text-stone-500 uppercase block">
                Zone Temperature
              </span>
              <span className="text-lg font-bold text-stone-900 font-mono">
                {activeZone.currentTemp}°C
              </span>
              <span className="text-[10px] text-stone-400 block mt-0.5">
                Canopy microclimate
              </span>
            </div>

            <div className="bg-stone-50 p-3 rounded-lg border border-stone-200">
              <span className="text-[10px] text-stone-500 uppercase block">
                Relative Humidity
              </span>
              <span className="text-lg font-bold text-stone-900 font-mono">
                {activeZone.currentHumidity}%
              </span>
              <span className="text-[10px] text-stone-400 block mt-0.5">
                SHT31 sensor reading
              </span>
            </div>

            <div className="bg-stone-50 p-3 rounded-lg border border-stone-200">
              <span className="text-[10px] text-stone-500 uppercase block">
                Acoustic Node Battery
              </span>
              <span className="text-lg font-bold text-emerald-800 font-mono flex items-center gap-1">
                <Battery className="w-4 h-4 text-emerald-600" />
                {activeNode?.batteryPercent || 85}%
              </span>
              <span className="text-[10px] text-stone-400 block mt-0.5">
                Solar MPPT float
              </span>
            </div>

            <div className="bg-stone-50 p-3 rounded-lg border border-stone-200">
              <span className="text-[10px] text-stone-500 uppercase block">
                RF Link Strength
              </span>
              <span className="text-lg font-bold text-stone-900 font-mono flex items-center gap-1">
                <Wifi className="w-4 h-4 text-emerald-600" />
                {activeNode?.signalDbm || -68} dBm
              </span>
              <span className="text-[10px] text-stone-400 block mt-0.5">
                Sub-GHz LoRa relay
              </span>
            </div>
          </div>

          {/* Recent Zone Detections */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wide">
              Recent Acoustic Detections in {activeZone.code}
            </h4>

            {zoneDetections.length === 0 ? (
              <p className="text-xs text-stone-400 py-3 text-center">
                No detections recorded in this zone yet.
              </p>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {zoneDetections.slice(0, 4).map((det) => (
                  <div
                    key={det.id}
                    onClick={() => setSelectedDetection(det)}
                    className="p-2.5 rounded-lg border border-stone-200 bg-stone-50/50 hover:bg-emerald-50 hover:border-emerald-300 cursor-pointer transition-colors text-xs flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-stone-900">
                        {det.pestLabel.split("(")[0].trim()}
                      </div>
                      <div className="text-[10px] text-stone-500">
                        {det.timestamp} &bull; {det.modelConfidence}% confidence
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      Inspect &rarr;
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
