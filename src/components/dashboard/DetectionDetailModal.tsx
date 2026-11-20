"use client";

import React, { useState, useEffect } from "react";
import { useAgriVigil } from "@/context/AgriVigilContext";
import { VerificationStatus } from "@/types/agrivigil";
import { SpectrogramView } from "./SpectrogramView";
import {
  X,
  Thermometer,
  Droplets,
  Radio,
  MapPin,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  FileText,
  ShieldCheck,
  HelpCircle,
  Sparkles,
} from "lucide-react";

export const DetectionDetailModal: React.FC = () => {
  const { selectedDetection, setSelectedDetection, updateDetectionVerification, t } = useAgriVigil();
  const [currentStatus, setCurrentStatus] = useState<VerificationStatus>("Unverified");
  const [scoutNotes, setScoutNotes] = useState("");

  useEffect(() => {
    if (selectedDetection) {
      setCurrentStatus(selectedDetection.verificationStatus);
      setScoutNotes(selectedDetection.scoutNotes || "");
    }
  }, [selectedDetection]);

  if (!selectedDetection) return null;

  const handleSaveVerification = (e: React.FormEvent) => {
    e.preventDefault();
    updateDetectionVerification(selectedDetection.id, currentStatus, scoutNotes);
  };

  const isUnknown = selectedDetection.pestCategory === "unknown";

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-detection-title"
    >
      <div className="relative bg-white rounded-2xl shadow-2xl border border-stone-200 max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-5 border-b border-stone-200 bg-stone-50 flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
                {selectedDetection.id}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded font-medium border ${
                  selectedDetection.activitySeverity === "Critical"
                    ? "bg-rose-100 text-rose-800 border-rose-300"
                    : selectedDetection.activitySeverity === "High"
                    ? "bg-amber-100 text-amber-800 border-amber-300"
                    : selectedDetection.activitySeverity === "Moderate"
                    ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                    : "bg-emerald-100 text-emerald-800 border-emerald-300"
                }`}
              >
                Severity: {selectedDetection.activitySeverity}
              </span>
              <span className="text-xs text-stone-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {selectedDetection.timestamp}
              </span>
            </div>

            <h3 id="modal-detection-title" className="text-lg font-bold text-emerald-950">
              {selectedDetection.pestLabel}
            </h3>
          </div>

          <button
            onClick={() => setSelectedDetection(null)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
            aria-label="Close detection inspector"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-6 text-stone-800 text-sm">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
              <div className="text-[11px] font-medium text-stone-500 uppercase flex items-center gap-1 mb-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" /> Zone
              </div>
              <div className="font-semibold text-stone-900 truncate">
                {selectedDetection.zoneName.split("-")[0].trim()}
              </div>
              <div className="text-[11px] text-stone-500">
                {selectedDetection.zoneId.toUpperCase()}
              </div>
            </div>

            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
              <div className="text-[11px] font-medium text-stone-500 uppercase flex items-center gap-1 mb-1">
                <Radio className="w-3.5 h-3.5 text-emerald-700" /> Sensor Node
              </div>
              <div className="font-semibold text-stone-900">
                {selectedDetection.nodeId}
              </div>
              <div className="text-[11px] text-emerald-700 font-mono">
                Hardware Online
              </div>
            </div>

            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
              <div className="text-[11px] font-medium text-stone-500 uppercase flex items-center gap-1 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" /> {t("modelConfidence", "Model Confidence")}
              </div>
              <div className="text-xl font-extrabold text-stone-900">
                {selectedDetection.modelConfidence}%
              </div>
              <div className="text-[10px] text-stone-500">
                Mock classifier estimate
              </div>
            </div>

            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
              <div className="text-[11px] font-medium text-stone-500 uppercase flex items-center gap-1 mb-1">
                <Thermometer className="w-3.5 h-3.5 text-rose-600" /> Microclimate
              </div>
              <div className="font-semibold text-stone-900">
                {selectedDetection.envAtDetection.temperatureC}°C &bull; {selectedDetection.envAtDetection.relativeHumidityPct}% RH
              </div>
              <div className="text-[10px] text-stone-500">
                At capture moment
              </div>
            </div>
          </div>

          {/* Illustrative Bio-Acoustic Spectrogram View */}
          <SpectrogramView
            summary={selectedDetection.acousticSummary}
            spectrogramPoints={selectedDetection.spectrogramPoints}
            pestLabel={selectedDetection.pestLabel}
          />

          {/* Recommended Next Step / Responsible IPM Card */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-emerald-950 font-semibold text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Recommended Agronomic Action (IPM Protocol)</span>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed">
              {selectedDetection.recommendedAction}
            </p>
            <div className="pt-2 border-t border-emerald-200/60 flex items-start gap-2 text-[11px] text-emerald-900/80">
              <HelpCircle className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
              <span>
                <strong>Responsible Precision Decision Support:</strong> Acoustic classifier signatures and microclimate readings provide early-warning scouting queues, not proof of infestation. Never apply chemical pesticides without physical scout confirmation by a certified crop protection advisor.
              </span>
            </div>
          </div>

          {/* Ground Truth Verification Workflow Form */}
          <form onSubmit={handleSaveVerification} className="bg-stone-50 rounded-xl p-4 border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-stone-900 text-xs uppercase tracking-wide flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                Field Scout Verification & Audit
              </h4>
              <span className="text-[11px] text-stone-500">Persists to Local Session</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {(["Unverified", "Field Verified", "False Positive"] as VerificationStatus[]).map((status) => {
                const label =
                  status === "Unverified"
                    ? t("unverified", "Unverified")
                    : status === "Field Verified"
                    ? t("fieldVerified", "Field Verified")
                    : t("falsePositive", "False Positive");
                return (
                  <label
                    key={status}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                      currentStatus === status
                        ? "bg-emerald-100/70 border-emerald-500 text-emerald-950 font-semibold"
                        : "bg-white border-stone-200 text-stone-700 hover:bg-stone-100"
                    }`}
                  >
                    <input
                      type="radio"
                      name="verificationStatus"
                      value={status}
                      checked={currentStatus === status}
                      onChange={() => setCurrentStatus(status)}
                      className="accent-emerald-700"
                    />
                    <span>{label}</span>
                  </label>
                );
              })}
            </div>

            <div>
              <label htmlFor="scoutNotes" className="block text-xs font-medium text-stone-700 mb-1">
                {t("scoutNotesLabel", "Ground Scout Field Notes / Inspection Observations")}
              </label>
              <textarea
                id="scoutNotes"
                rows={2}
                value={scoutNotes}
                onChange={(e) => setScoutNotes(e.target.value)}
                placeholder="e.g., Scout examined tree trunk #142; frass observed at frond sheath collar. Trap deployed."
                className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 outline-none bg-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setSelectedDetection(null)}
                className="px-3 py-1.5 rounded-lg border border-stone-300 text-stone-700 text-xs font-medium hover:bg-stone-100"
              >
                Close
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs"
              >
                {t("saveVerification", "Save Verification Record")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
