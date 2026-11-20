"use client";

import React, { useState } from "react";
import { useAgriVigil } from "@/context/AgriVigilContext";
import { PestDetection, PestCategory, VerificationStatus, ActivitySeverity, ZoneId } from "@/types/agrivigil";
import {
  ShieldAlert,
  Search,
  Filter,
  Zap,
  Eye,
  Calendar,
  MapPin,
  Radio,
  Sparkles,
  Info,
  CheckCircle,
  HelpCircle,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";

export default function PestDetectionPage() {
  const {
    language,
    t,
    detections,
    selectedZoneId,
    setSelectedZoneId,
    setSelectedDetection,
    simulateDetection,
    zones,
  } = useAgriVigil();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");

  // Multi-criteria filtering
  const filteredDetections = detections.filter((d) => {
    // Zone filter
    if (selectedZoneId !== "all" && d.zoneId !== selectedZoneId) {
      return false;
    }
    // Search query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matchLabel = d.pestLabel.toLowerCase().includes(q);
      const matchId = d.id.toLowerCase().includes(q);
      const matchNode = d.nodeId.toLowerCase().includes(q);
      const matchNotes = d.scoutNotes?.toLowerCase().includes(q) || false;
      if (!matchLabel && !matchId && !matchNode && !matchNotes) return false;
    }
    // Pest Category
    if (filterCategory !== "all" && d.pestCategory !== filterCategory) {
      return false;
    }
    // Verification Status
    if (filterStatus !== "all" && d.verificationStatus !== filterStatus) {
      return false;
    }
    // Severity
    if (filterSeverity !== "all" && d.activitySeverity !== filterSeverity) {
      return false;
    }
    return true;
  });

  const resetFilters = () => {
    setSearchQuery("");
    setFilterCategory("all");
    setFilterStatus("all");
    setFilterSeverity("all");
    setSelectedZoneId("all");
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
              {language === "hi" ? "जैव-ध्वनिक क्लासिफायर फीड" : "Bio-Acoustic Classifier Feeds"}
            </span>
            <span className="text-xs text-stone-500">
              {filteredDetections.length} {language === "hi" ? "दर्ज घटनाएं" : "recorded events"}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-emerald-950 font-serif mt-1">
            {t("detectionsHeading")}
          </h2>
          <p className="text-xs text-stone-500 max-w-2xl">
            {t("detectionsSub")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => simulateDetection()}
            type="button"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold transition-all shadow-xs active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 fill-stone-950" />
            <span>{t("simulateBtn")}</span>
          </button>
        </div>
      </div>

      {/* Scientific & Operational Guidance Notice */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>{language === "hi" ? "फील्ड एडवाइजरी एवं ग्राउंड-ट्रूथिंग प्रोटोकॉल: " : "Demonstration Advisory & Ground-Truthing Protocol: "}</strong>
            {language === "hi"
              ? "मॉडल विश्वास स्कोर (जैसे 91%, 82%, 68%) सिम्युलेटेड क्लासिफायर परिणाम हैं, न कि अंतिम टैक्सोनोमिक प्रमाण। रासायनिक छिड़काव से पहले तने और पत्तों का भौतिक निरीक्षण अनिवार्य है।"
              : "Model confidence scores (e.g. 91%, 82%, 68%) represent simulated acoustic classifier outputs, not validated laboratory certainty. Sound resonance patterns alone do not prove species taxonomy. Physical inspection of tree crowns and trunks is essential before executing any intervention."}
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="lg:col-span-4 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-stone-300 focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 outline-none"
            />
          </div>

          {/* Zone Selector */}
          <div className="lg:col-span-2">
            <select
              value={selectedZoneId}
              onChange={(e) => setSelectedZoneId(e.target.value as ZoneId | "all")}
              className="w-full py-2 px-2.5 text-xs rounded-lg border border-stone-300 bg-white text-stone-800 focus:ring-1 focus:ring-emerald-600 outline-none"
            >
              <option value="all">{t("allZones")}</option>
              <option value="zone-a">{t("zoneA")}</option>
              <option value="zone-b">{t("zoneB")}</option>
              <option value="zone-c">{t("zoneC")}</option>
            </select>
          </div>

          {/* Pest Category Filter */}
          <div className="lg:col-span-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full py-2 px-2.5 text-xs rounded-lg border border-stone-300 bg-white text-stone-800 focus:ring-1 focus:ring-emerald-600 outline-none"
            >
              <option value="all">{t("filterAllPests")}</option>
              <option value="target_a">{t("targetPestA")}</option>
              <option value="target_b">{t("targetPestB")}</option>
              <option value="unknown">{t("unknownPest")}</option>
            </select>
          </div>

          {/* Verification Status Filter */}
          <div className="lg:col-span-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full py-2 px-2.5 text-xs rounded-lg border border-stone-300 bg-white text-stone-800 focus:ring-1 focus:ring-emerald-600 outline-none"
            >
              <option value="all">{t("allVerification")}</option>
              <option value="Unverified">{t("unverified")}</option>
              <option value="Field Verified">{t("fieldVerified")}</option>
              <option value="False Positive">{t("falsePositive")}</option>
            </select>
          </div>

          {/* Severity Filter */}
          <div className="lg:col-span-2 flex items-center gap-2">
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="w-full py-2 px-2.5 text-xs rounded-lg border border-stone-300 bg-white text-stone-800 focus:ring-1 focus:ring-emerald-600 outline-none"
            >
              <option value="all">{t("allSeverities")}</option>
              <option value="Critical">{language === "hi" ? "गंभीर (Critical)" : "Critical"}</option>
              <option value="High">{language === "hi" ? "उच्च (High)" : "High"}</option>
              <option value="Moderate">{language === "hi" ? "मध्यम (Moderate)" : "Moderate"}</option>
            </select>

            <button
              onClick={resetFilters}
              title="Reset all search filters"
              type="button"
              className="p-2 rounded-lg border border-stone-200 text-stone-500 hover:text-stone-800 hover:bg-stone-100"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Detections Table / Card List */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        {filteredDetections.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-stone-800">
              No matching acoustic detections found
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Try adjusting your search terms or filter criteria, or generate a new mock detection using the simulation button.
            </p>
            <div className="flex justify-center gap-2 pt-2">
              <button
                onClick={resetFilters}
                className="px-3 py-1.5 rounded-lg border border-stone-300 text-xs text-stone-700 hover:bg-stone-50"
              >
                Clear Filters
              </button>
              <button
                onClick={() => simulateDetection()}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold"
              >
                Simulate Detection
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 text-[11px] uppercase tracking-wider bg-stone-50/80">
                  <th className="py-3 px-4 font-semibold">Event ID</th>
                  <th className="py-3 px-4 font-semibold">Timestamp</th>
                  <th className="py-3 px-4 font-semibold">Acoustic Classification</th>
                  <th className="py-3 px-4 font-semibold">Zone & Sensor Node</th>
                  <th className="py-3 px-4 font-semibold">Model Confidence</th>
                  <th className="py-3 px-4 font-semibold">Severity</th>
                  <th className="py-3 px-4 font-semibold">Environment</th>
                  <th className="py-3 px-4 font-semibold">Verification Status</th>
                  <th className="py-3 px-4 text-right font-semibold">Inspection</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredDetections.map((detection) => {
                  const isCritical = detection.activitySeverity === "Critical";
                  const isHigh = detection.activitySeverity === "High";
                  const isModerate = detection.activitySeverity === "Moderate";

                  return (
                    <tr
                      key={detection.id}
                      onClick={() => setSelectedDetection(detection)}
                      className="hover:bg-emerald-50/40 cursor-pointer transition-colors group"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-900 whitespace-nowrap">
                        {detection.id}
                      </td>

                      <td className="py-3.5 px-4 text-stone-600 whitespace-nowrap">
                        {detection.timestamp}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-stone-900">
                          {detection.pestLabel.split("(")[0].trim()}
                        </div>
                        <div className="text-[10px] text-stone-500 max-w-xs truncate">
                          {detection.acousticSummary.dominantFrequencyKhz} kHz &bull; {detection.acousticSummary.stridulationPattern}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-medium text-stone-900">
                          {detection.zoneName.split("-")[0].trim()}
                        </div>
                        <div className="text-[10px] text-emerald-700 font-mono">
                          {detection.nodeId}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-stone-900">
                            {detection.modelConfidence}%
                          </span>
                          <span className="text-[10px] text-stone-400">
                            (mock)
                          </span>
                        </div>
                        <div className="w-16 h-1.5 bg-stone-200 rounded-full overflow-hidden mt-1">
                          <div
                            className={`h-full rounded-full ${
                              detection.modelConfidence >= 85
                                ? "bg-emerald-600"
                                : detection.modelConfidence >= 75
                                ? "bg-amber-500"
                                : "bg-stone-500"
                            }`}
                            style={{ width: `${detection.modelConfidence}%` }}
                          />
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                            isCritical
                              ? "bg-rose-100 text-rose-800 border-rose-300"
                              : isHigh
                              ? "bg-amber-100 text-amber-800 border-amber-300"
                              : isModerate
                              ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                              : "bg-emerald-100 text-emerald-800 border-emerald-300"
                          }`}
                        >
                          {detection.activitySeverity}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap text-stone-600 font-mono text-[11px]">
                        {detection.envAtDetection.temperatureC}°C &bull; {detection.envAtDetection.relativeHumidityPct}%
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                            detection.verificationStatus === "Field Verified"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                              : detection.verificationStatus === "False Positive"
                              ? "bg-stone-100 text-stone-600 border-stone-300"
                              : "bg-amber-50 text-amber-800 border-amber-300"
                          }`}
                        >
                          {detection.verificationStatus === "Field Verified" && (
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                          )}
                          {detection.verificationStatus === "False Positive" && (
                            <HelpCircle className="w-3 h-3 text-stone-400" />
                          )}
                          {detection.verificationStatus === "Unverified" && (
                            <AlertTriangle className="w-3 h-3 text-amber-500" />
                          )}
                          <span>{detection.verificationStatus}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDetection(detection);
                          }}
                          type="button"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-stone-100 hover:bg-emerald-100 hover:text-emerald-900 text-stone-700 font-semibold transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Spectrogram</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
