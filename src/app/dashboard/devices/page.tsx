"use client";

import React, { useState, useEffect } from "react";
import { useAgriVigil } from "@/context/AgriVigilContext";
import { SensorNode, ZoneId, ThresholdSettings } from "@/types/agrivigil";
import {
  Radio,
  Settings,
  Battery,
  Wifi,
  Sliders,
  CheckCircle2,
  Edit2,
  Save,
  RotateCcw,
  Zap,
  Info,
  Layers,
  Thermometer,
  Droplets,
  ShieldAlert,
} from "lucide-react";

export default function DeviceSettingsPage() {
  const {
    nodes,
    zones,
    thresholds,
    plantationName,
    setPlantationName,
    selectedFarm,
    setSelectedFarm,
    updateNode,
    updateThresholds,
    resetDemoData,
    addToast,
    t,
  } = useAgriVigil();

  // Estate / Farm edit state
  const [estateInput, setEstateInput] = useState(plantationName);
  const [farmInput, setFarmInput] = useState(selectedFarm);
  const [estateSaved, setEstateSaved] = useState(false);

  useEffect(() => {
    setEstateInput(plantationName);
    setFarmInput(selectedFarm);
  }, [plantationName, selectedFarm]);

  const handleSaveEstate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!estateInput.trim()) return;
    setPlantationName(estateInput.trim());
    setSelectedFarm(farmInput.trim());
    setEstateSaved(true);
    addToast("Plantation Updated", `Active estate updated to "${estateInput.trim()}".`, "success");
    setTimeout(() => setEstateSaved(false), 3000);
  };

  // Threshold form state
  const [formThresholds, setFormThresholds] = useState<ThresholdSettings>(thresholds);
  const [thresholdSaved, setThresholdSaved] = useState(false);

  // Edit Node Modal/Inline state
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [editNodeName, setEditNodeName] = useState("");
  const [editNodeZone, setEditNodeZone] = useState<ZoneId>("zone-a");
  const [editSampling, setEditSampling] = useState(5);

  const startEditNode = (node: SensorNode) => {
    setEditingNodeId(node.id);
    setEditNodeName(node.name);
    setEditNodeZone(node.zoneId);
    setEditSampling(node.samplingIntervalMinutes);
  };

  const handleSaveNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNodeId) return;

    updateNode({
      id: editingNodeId,
      name: editNodeName,
      zoneId: editNodeZone,
      samplingIntervalMinutes: Number(editSampling),
    });

    setEditingNodeId(null);
  };

  const handleSaveThresholds = (e: React.FormEvent) => {
    e.preventDefault();
    updateThresholds(formThresholds);
    setThresholdSaved(true);
    setTimeout(() => setThresholdSaved(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
              IoT Hardware Configuration
            </span>
            <span className="text-xs text-stone-500 font-medium">
              3 Field Nodes Registered
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-emerald-950 font-serif mt-1">
            {t("devicesHeading", "Registered Sensor Nodes & Platform Settings")}
          </h2>
          <p className="text-xs text-stone-500 max-w-2xl">
            {t("devicesSub", "Configure bioacoustic hardware stethoscope nodes, update zone associations, and establish microclimatic alert threshold triggers.")}
          </p>
        </div>

        <button
          onClick={resetDemoData}
          type="button"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold transition-all shadow-xs self-start md:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t("resetDemoBtn", "Reset All Defaults")}</span>
        </button>
      </div>

      {/* 0. Plantation Estate & Farm Customizer */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <div>
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-700" />
              Plantation Estate & Commercial Farm Identity
            </h3>
            <p className="text-xs text-stone-500">
              Customize the plantation name and farm block shown on the top bar and reports.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveEstate} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-5">
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Plantation / Estate Name
            </label>
            <input
              type="text"
              value={estateInput}
              onChange={(e) => setEstateInput(e.target.value)}
              placeholder="e.g., Sundarban Palm & Agro-Estate"
              className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-white focus:ring-1 focus:ring-emerald-600 outline-none"
              required
            />
          </div>

          <div className="sm:col-span-5">
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Farm Block / Canopy Sector
            </label>
            <input
              type="text"
              value={farmInput}
              onChange={(e) => setFarmInput(e.target.value)}
              placeholder="e.g., Block 4 - High-Density Precision Canopy"
              className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-white focus:ring-1 focus:ring-emerald-600 outline-none"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-lg bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-xs transition-colors shadow-xs flex items-center justify-center gap-1.5"
            >
              {estateSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Name</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* 1. Sensor Nodes Fleet Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden space-y-4 p-5">
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <div>
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-700" />
              {t("deviceFleetTitle", "Bioacoustic Sensor Node Fleet")}
            </h3>
            <p className="text-xs text-stone-500">
              Solar-harvested acoustic MEMS microphones & Sensirion SHT31 microclimate sensor nodes.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            3 / 3 Nodes Online
          </span>
        </div>

        {/* Nodes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {nodes.map((node) => {
            const isEditing = editingNodeId === node.id;
            const assignedZone = zones.find((z) => z.id === node.zoneId);

            return (
              <div
                key={node.id}
                className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-950 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
                      {node.id}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                      {node.status.toUpperCase()}
                    </span>
                  </div>

                  <h4 className="font-bold text-stone-900 text-sm mt-2">
                    {node.name}
                  </h4>
                  <div className="text-xs text-emerald-800 font-semibold mt-0.5">
                    Assigned: {assignedZone?.name || node.zoneId}
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-stone-600 border-t border-stone-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-stone-400">Battery Level:</span>
                    <span className="font-mono font-semibold text-emerald-800 flex items-center gap-1">
                      <Battery className="w-3.5 h-3.5 text-emerald-600" />
                      {node.batteryPercent}% (Simulated)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Signal (LoRa):</span>
                    <span className="font-mono font-semibold text-stone-800 flex items-center gap-1">
                      <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                      {node.signalDbm} dBm
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Sampling Rate:</span>
                    <span className="font-mono text-stone-800">
                      Every {node.samplingIntervalMinutes} mins
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Firmware:</span>
                    <span className="font-mono text-[10px] text-stone-500">
                      {node.firmwareVersion}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Last Telemetry:</span>
                    <span className="text-stone-700 text-[11px]">{node.lastSeen}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-200 flex justify-end">
                  <button
                    type="button"
                    onClick={() => startEditNode(node)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 py-1 px-2.5 rounded-lg hover:bg-stone-200 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Node</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Node Modal Dialog */}
      {editingNodeId && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveNode}
            className="bg-white rounded-2xl p-6 border border-stone-200 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95"
          >
            <div className="border-b border-stone-200 pb-3">
              <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                {editingNodeId}
              </span>
              <h3 className="text-base font-bold text-stone-900 mt-1">
                Edit Sensor Node Configuration
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Device Alias / Label
                </label>
                <input
                  type="text"
                  value={editNodeName}
                  onChange={(e) => setEditNodeName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-stone-300 focus:ring-1 focus:ring-emerald-600 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Assigned Plantation Zone
                </label>
                <select
                  value={editNodeZone}
                  onChange={(e) => setEditNodeZone(e.target.value as ZoneId)}
                  className="w-full p-2.5 rounded-lg border border-stone-300 bg-white focus:ring-1 focus:ring-emerald-600 outline-none"
                >
                  <option value="zone-a">Zone A - North Palm Grove</option>
                  <option value="zone-b">Zone B - Central High-Density Canopy</option>
                  <option value="zone-c">Zone C - Southern Nursery & Forest Buffer</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Sampling Interval (Minutes)
                </label>
                <select
                  value={editSampling}
                  onChange={(e) => setEditSampling(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg border border-stone-300 bg-white focus:ring-1 focus:ring-emerald-600 outline-none"
                >
                  <option value={1}>1 Minute (High Precision Diagnostic)</option>
                  <option value={3}>3 Minutes (Elevated Monitoring)</option>
                  <option value={5}>5 Minutes (Standard Continuous)</option>
                  <option value={15}>15 Minutes (Power Conservation)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setEditingNodeId(null)}
                className="px-3 py-1.5 rounded-lg border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 2. Microclimate & AI Alert Thresholds Form */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-5 space-y-4">
        <div className="border-b border-stone-200 pb-3">
          <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-700" />
            {t("alertThresholdsTitle", "Configurable Microclimate & Classifier Alert Thresholds")}
          </h3>
          <p className="text-xs text-stone-500">
            Define boundaries for automated alert generation and automatic scouting inspection flags.
          </p>
        </div>

        <form onSubmit={handleSaveThresholds} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* High Temp Warning */}
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900">
                <Thermometer className="w-4 h-4 text-rose-600" />
                <span>Max Temperature Warning (°C)</span>
              </div>
              <p className="text-[11px] text-stone-500">
                Triggers warning when canopy temp promotes rapid weevil egg hatching.
              </p>
              <input
                type="number"
                step="0.5"
                value={formThresholds.tempMaxC}
                onChange={(e) =>
                  setFormThresholds({ ...formThresholds, tempMaxC: parseFloat(e.target.value) || 34.0 })
                }
                className="w-full p-2 rounded-lg border border-stone-300 text-xs font-mono font-bold bg-white"
                required
              />
            </div>

            {/* Low Temp Warning */}
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900">
                <Thermometer className="w-4 h-4 text-sky-600" />
                <span>Min Temperature Warning (°C)</span>
              </div>
              <p className="text-[11px] text-stone-500">
                Triggers warning if night temperature drops below vegetative growth floor.
              </p>
              <input
                type="number"
                step="0.5"
                value={formThresholds.tempMinC}
                onChange={(e) =>
                  setFormThresholds({ ...formThresholds, tempMinC: parseFloat(e.target.value) || 22.0 })
                }
                className="w-full p-2 rounded-lg border border-stone-300 text-xs font-mono font-bold bg-white"
                required
              />
            </div>

            {/* High Humidity Warning */}
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900">
                <Droplets className="w-4 h-4 text-sky-600" />
                <span>Max Relative Humidity (%)</span>
              </div>
              <p className="text-[11px] text-stone-500">
                High humidity favors fungal secondary infection at pest feeding puncture sites.
              </p>
              <input
                type="number"
                step="1"
                value={formThresholds.humidityMaxPct}
                onChange={(e) =>
                  setFormThresholds({ ...formThresholds, humidityMaxPct: parseInt(e.target.value) || 82 })
                }
                className="w-full p-2 rounded-lg border border-stone-300 text-xs font-mono font-bold bg-white"
                required
              />
            </div>

            {/* Low Humidity Warning */}
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900">
                <Droplets className="w-4 h-4 text-amber-600" />
                <span>Min Relative Humidity (%)</span>
              </div>
              <p className="text-[11px] text-stone-500">
                Drought stress threshold where palms suffer transpiration deficits.
              </p>
              <input
                type="number"
                step="1"
                value={formThresholds.humidityMinPct}
                onChange={(e) =>
                  setFormThresholds({ ...formThresholds, humidityMinPct: parseInt(e.target.value) || 45 })
                }
                className="w-full p-2 rounded-lg border border-stone-300 text-xs font-mono font-bold bg-white"
                required
              />
            </div>

            {/* AI Confidence Alert Threshold */}
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>AI Confidence Alert Threshold (%)</span>
              </div>
              <p className="text-[11px] text-stone-500">
                Minimum classifier confidence score to trigger an urgent system alert.
              </p>
              <input
                type="number"
                step="1"
                min="50"
                max="99"
                value={formThresholds.confidenceAlertThreshold}
                onChange={(e) =>
                  setFormThresholds({ ...formThresholds, confidenceAlertThreshold: parseInt(e.target.value) || 75 })
                }
                className="w-full p-2 rounded-lg border border-stone-300 text-xs font-mono font-bold bg-white"
                required
              />
            </div>

            {/* Auto-Flag Inspection Threshold */}
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Auto-Flag Inspection Threshold (%)</span>
              </div>
              <p className="text-[11px] text-stone-500">
                Confidence score above which zone is automatically marked "Inspection Required".
              </p>
              <input
                type="number"
                step="1"
                min="60"
                max="99"
                value={formThresholds.autoFlagInspectionThreshold}
                onChange={(e) =>
                  setFormThresholds({ ...formThresholds, autoFlagInspectionThreshold: parseInt(e.target.value) || 80 })
                }
                className="w-full p-2 rounded-lg border border-stone-300 text-xs font-mono font-bold bg-white"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-stone-500">
              Settings persist locally to browser storage.
            </span>

            <div className="flex items-center gap-3">
              {thresholdSaved && (
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4" />
                  Thresholds Saved!
                </span>
              )}
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{t("saveThresholdsBtn", "Save Alert Thresholds")}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* 3. DeepTech Hardware Roadmap Callout */}
      <div className="p-4 rounded-xl bg-stone-100 border border-stone-200 text-xs text-stone-600 space-y-2">
        <div className="flex items-center gap-2 font-bold text-stone-800">
          <Info className="w-4 h-4 text-emerald-800" />
          <span>Real-World Hardware Integration Specifications</span>
        </div>
        <p className="leading-relaxed">
          In commercial field deployment, each AgriVigil node consists of an ultra-low-power ESP32-S3 or Nordic nRF5340 MCU paired with a high-sensitivity Knowles MEMS acoustic transducer and an analog pre-amplifier. Onboard TinyML (TensorFlow Lite for Microcontrollers) performs on-edge 1D-CNN or spectrogram inference, transmitting detections via 915 MHz LoRaWAN back to an ag-gateway without requiring high-bandwidth cellular subscriptions on every tree.
        </p>
      </div>
    </div>
  );
}
