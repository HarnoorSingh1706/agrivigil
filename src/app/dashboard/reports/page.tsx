"use client";

import React, { useState } from "react";
import { useAgriVigil } from "@/context/AgriVigilContext";
import { PestDetection, ZoneId } from "@/types/agrivigil";
import {
  FileSpreadsheet,
  Printer,
  Download,
  Filter,
  Calendar,
  Search,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Info,
} from "lucide-react";

export default function HistoryAndReportsPage() {
  const { detections, zones, selectedZoneId, setSelectedZoneId, addToast, t } = useAgriVigil();

  const [dateRange, setDateRange] = useState<"24h" | "7d" | "30d" | "all">("all");
  const [pestFilter, setPestFilter] = useState<string>("all");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPrintMode, setIsPrintMode] = useState(false);
  const [generatedDateStr, setGeneratedDateStr] = useState("Nov 16, 2026 11:55 AM");

  React.useEffect(() => {
    setGeneratedDateStr(new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString());
  }, []);

  // Filter records
  const filteredRecords = detections.filter((d) => {
    if (selectedZoneId !== "all" && d.zoneId !== selectedZoneId) return false;
    if (pestFilter !== "all" && d.pestCategory !== pestFilter) return false;
    if (severityFilter !== "all" && d.activitySeverity !== severityFilter) return false;
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const match =
        d.id.toLowerCase().includes(q) ||
        d.pestLabel.toLowerCase().includes(q) ||
        d.nodeId.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // Functional CSV Export
  const handleExportCSV = () => {
    if (filteredRecords.length === 0) {
      addToast("Export Empty", "No records to export under current filters.", "warning");
      return;
    }

    const headers = [
      "Event_ID",
      "Timestamp",
      "Zone_ID",
      "Zone_Name",
      "Hardware_Node",
      "Pest_Classification",
      "Model_Confidence_Pct",
      "Activity_Severity",
      "Dominant_Freq_kHz",
      "Peak_Energy_dB",
      "Temperature_C",
      "Humidity_RH_Pct",
      "Verification_Status",
      "Scout_Notes",
    ];

    const rows = filteredRecords.map((r) => [
      `"${r.id}"`,
      `"${r.timestamp}"`,
      `"${r.zoneId}"`,
      `"${r.zoneName}"`,
      `"${r.nodeId}"`,
      `"${r.pestLabel.replace(/"/g, '""')}"`,
      r.modelConfidence,
      `"${r.activitySeverity}"`,
      r.acousticSummary.dominantFrequencyKhz,
      r.acousticSummary.peakEnergyDb,
      r.envAtDetection.temperatureC,
      r.envAtDetection.relativeHumidityPct,
      `"${r.verificationStatus}"`,
      `"${(r.scoutNotes || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `AgriVigil_Bioacoustic_Report_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast(
      "CSV Report Exported",
      `Successfully exported ${filteredRecords.length} acoustic records.`,
      "success"
    );
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
              Compliance & Scouting Archive
            </span>
            <span className="text-xs text-stone-500 font-medium">
              Audit-Ready CSV & Print Export
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-emerald-950 font-serif mt-1">
            {t("reportsHeading", "Historical Bio-Acoustic Analytics & Scouting Reports")}
          </h2>
          <p className="text-xs text-stone-500 max-w-2xl">
            {t("reportsSub", "Query long-term acoustic event records, correlate microclimatic triggers, and generate agronomic verification summaries for audit or plantation management.")}
          </p>
        </div>

        {/* Action buttons: Export CSV & Print */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-bold transition-all shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t("exportCsv", "Export CSV")} ({filteredRecords.length})</span>
          </button>
          <button
            onClick={handlePrint}
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 text-xs font-semibold transition-all shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{t("printReport", "Print Report")}</span>
          </button>
        </div>
      </div>

      {/* Printable Report Header (Visible when printed) */}
      <div className="hidden print:block border-b-2 border-emerald-900 pb-4 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-emerald-950 font-serif">AgriVigil Precision Agriculture</h1>
            <p className="text-sm text-stone-600">Bioacoustic Pest Detection & Microclimate Platform Audit Report</p>
            <p className="text-xs text-stone-500 mt-1">Sundarban Palm & Agro-Estate &bull; Block 4 High-Density Canopy</p>
          </div>
          <div className="text-right text-xs text-stone-500">
            <p>Generated: {generatedDateStr}</p>
            <p className="font-mono text-[10px]">Filter: {selectedZoneId.toUpperCase()} &bull; {filteredRecords.length} records</p>
          </div>
        </div>
      </div>

      {/* Filter Toolbar (Hidden during print) */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs space-y-3 print:hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          {/* Search */}
          <div className="lg:col-span-3 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search event ID or keyword..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-stone-300 focus:ring-1 focus:ring-emerald-600 outline-none"
            />
          </div>

          {/* Time Range */}
          <div className="lg:col-span-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="w-full py-2 px-2.5 text-xs rounded-lg border border-stone-300 bg-white text-stone-800 focus:ring-1 focus:ring-emerald-600 outline-none"
            >
              <option value="all">All Available Historical Logs</option>
              <option value="24h">Past 24 Hours</option>
              <option value="7d">Past 7 Days</option>
              <option value="30d">Past 30 Days</option>
            </select>
          </div>

          {/* Zone Selector */}
          <div className="lg:col-span-2">
            <select
              value={selectedZoneId}
              onChange={(e) => setSelectedZoneId(e.target.value as ZoneId | "all")}
              className="w-full py-2 px-2.5 text-xs rounded-lg border border-stone-300 bg-white text-stone-800 focus:ring-1 focus:ring-emerald-600 outline-none"
            >
              <option value="all">All Zones</option>
              <option value="zone-a">Zone A (North)</option>
              <option value="zone-b">Zone B (Central)</option>
              <option value="zone-c">Zone C (Nursery)</option>
            </select>
          </div>

          {/* Pest Class */}
          <div className="lg:col-span-2">
            <select
              value={pestFilter}
              onChange={(e) => setPestFilter(e.target.value)}
              className="w-full py-2 px-2.5 text-xs rounded-lg border border-stone-300 bg-white text-stone-800 focus:ring-1 focus:ring-emerald-600 outline-none"
            >
              <option value="all">All Pest Classes</option>
              <option value="target_a">Target Pest A</option>
              <option value="target_b">Target Pest B</option>
              <option value="unknown">Unknown Sound</option>
            </select>
          </div>

          {/* Severity */}
          <div className="lg:col-span-2">
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full py-2 px-2.5 text-xs rounded-lg border border-stone-300 bg-white text-stone-800 focus:ring-1 focus:ring-emerald-600 outline-none"
            >
              <option value="all">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Moderate">Moderate</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-stone-200">
          <span className="text-[10px] text-stone-500 uppercase block font-semibold">Filtered Detections</span>
          <span className="text-xl font-bold font-mono text-stone-900">{filteredRecords.length}</span>
          <span className="text-[10px] text-stone-400 block">Total query matches</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-stone-200">
          <span className="text-[10px] text-stone-500 uppercase block font-semibold">Field Verified</span>
          <span className="text-xl font-bold font-mono text-emerald-800">
            {filteredRecords.filter((r) => r.verificationStatus === "Field Verified").length}
          </span>
          <span className="text-[10px] text-stone-400 block">Scout confirmed</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-stone-200">
          <span className="text-[10px] text-stone-500 uppercase block font-semibold">High / Critical Flags</span>
          <span className="text-xl font-bold font-mono text-rose-600">
            {filteredRecords.filter((r) => r.activitySeverity === "Critical" || r.activitySeverity === "High").length}
          </span>
          <span className="text-[10px] text-stone-400 block">High acoustic severity</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-stone-200">
          <span className="text-[10px] text-stone-500 uppercase block font-semibold">Avg Classifier Confidence</span>
          <span className="text-xl font-bold font-mono text-stone-800">
            {filteredRecords.length > 0
              ? Math.round(
                  filteredRecords.reduce((acc, r) => acc + r.modelConfidence, 0) / filteredRecords.length
                )
              : 0}%
          </span>
          <span className="text-[10px] text-stone-400 block">Simulated output</span>
        </div>
      </div>

      {/* Historical Records Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        {filteredRecords.length === 0 ? (
          <div className="p-10 text-center text-xs text-stone-500">
            No records found matching current query parameters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-200 text-stone-600 text-[11px] uppercase tracking-wider bg-stone-50">
                  <th className="py-3 px-3 font-semibold">ID</th>
                  <th className="py-3 px-3 font-semibold">Date & Time</th>
                  <th className="py-3 px-3 font-semibold">Zone & Node</th>
                  <th className="py-3 px-3 font-semibold">Pest Classification</th>
                  <th className="py-3 px-3 font-semibold">Confidence</th>
                  <th className="py-3 px-3 font-semibold">Frequency</th>
                  <th className="py-3 px-3 font-semibold">Microclimate</th>
                  <th className="py-3 px-3 font-semibold">Verification</th>
                  <th className="py-3 px-3 font-semibold">Scout Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-stone-50/80">
                    <td className="py-3 px-3 font-mono font-bold text-emerald-900 whitespace-nowrap">
                      {record.id}
                    </td>
                    <td className="py-3 px-3 text-stone-600 whitespace-nowrap">
                      {record.timestamp}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="font-semibold text-stone-800">{record.zoneId.toUpperCase()}</span>
                      <span className="text-[10px] text-stone-400 ml-1 font-mono">({record.nodeId})</span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-stone-900">
                        {record.pestLabel.split("(")[0].trim()}
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-stone-800">
                      {record.modelConfidence}%
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-stone-600 whitespace-nowrap">
                      {record.acousticSummary.dominantFrequencyKhz} kHz ({record.acousticSummary.peakEnergyDb} dB)
                    </td>
                    <td className="py-3 px-3 text-[11px] font-mono text-stone-600 whitespace-nowrap">
                      {record.envAtDetection.temperatureC}°C &bull; {record.envAtDetection.relativeHumidityPct}%
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                          record.verificationStatus === "Field Verified"
                            ? "bg-emerald-100 text-emerald-800"
                            : record.verificationStatus === "False Positive"
                            ? "bg-stone-200 text-stone-700"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {record.verificationStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[11px] text-stone-600 max-w-xs truncate">
                      {record.scoutNotes || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Regulatory & Scientific Notice for Reports */}
      <div className="p-4 rounded-xl bg-stone-100 border border-stone-200 text-xs text-stone-500 space-y-1 print:border-t print:mt-6">
        <p className="font-semibold text-stone-700">Agronomic Audit Compliance Notice:</p>
        <p className="leading-relaxed">
          This historical telemetry report contains mock data generated by the AgriVigil demonstration platform. Spectral acoustic classifier estimates and sensor telemetry are simulated for early-stage startup validation and field trials.
        </p>
      </div>
    </div>
  );
}
