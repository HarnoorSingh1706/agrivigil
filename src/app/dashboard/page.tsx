"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAgriVigil } from "@/context/AgriVigilContext";
import { StatCard } from "@/components/dashboard/StatCard";
import { ACTIVITY_TREND_HOURLY } from "@/data/seedData";
import {
  ShieldAlert,
  Thermometer,
  Droplets,
  Radio,
  Bell,
  Zap,
  ArrowRight,
  TrendingUp,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  Info,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function DashboardOverviewPage() {
  const {
    language,
    t,
    zones,
    selectedZoneId,
    setSelectedZoneId,
    detections,
    alerts,
    nodes,
    setSelectedDetection,
    simulateDetection,
    activeAlertCount,
    onlineNodeCount,
  } = useAgriVigil();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter zones and calculations based on selectedZoneId
  const activeZones =
    selectedZoneId === "all"
      ? zones
      : zones.filter((z) => z.id === selectedZoneId);

  // Latest microclimate average or selected zone readings
  const currentTemp =
    activeZones.length > 0
      ? Math.round(
          (activeZones.reduce((acc, z) => acc + z.currentTemp, 0) /
            activeZones.length) *
            10
        ) / 10
      : 29.8;

  const currentHumidity =
    activeZones.length > 0
      ? Math.round(
          activeZones.reduce((acc, z) => acc + z.currentHumidity, 0) /
            activeZones.length
        )
      : 70;

  // Most critical activity level among active zones
  const hasHighOrCritical = activeZones.some(
    (z) => z.pestActivityLevel === "Critical" || z.pestActivityLevel === "High"
  );
  const hasModerate = activeZones.some((z) => z.pestActivityLevel === "Moderate");
  const overallActivity = hasHighOrCritical
    ? "Elevated / High"
    : hasModerate
    ? "Moderate"
    : "Low / Baseline";

  // Filtered recent detections (limit to 5)
  const recentDetections = detections
    .filter(
      (d) => selectedZoneId === "all" || d.zoneId === selectedZoneId
    )
    .slice(0, 5);

  // Microclimate line chart series for today
  const microclimateSeries = [
    { time: "00:00", temp: 24.8, humidity: 84 },
    { time: "03:00", temp: 24.2, humidity: 86 },
    { time: "06:00", temp: 25.4, humidity: 81 },
    { time: "09:00", temp: 28.6, humidity: 73 },
    { time: "12:00", temp: 31.8, humidity: 62 },
    { time: "15:00", temp: 32.4, humidity: 59 },
    { time: "18:00", temp: 29.5, humidity: 71 },
    { time: "21:00", temp: 27.1, humidity: 78 },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Header & Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-stone-900 rounded-2xl p-5 sm:p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-800 text-emerald-200 text-xs font-mono font-bold uppercase tracking-wider">
              Telemetry Active
            </span>
            <span className="text-stone-300 text-xs">
              Zone Filter:{" "}
              <strong className="text-emerald-300">
                {selectedZoneId === "all"
                  ? "All Zones (Whole Plantation)"
                  : zones.find((z) => z.id === selectedZoneId)?.name}
              </strong>
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight font-serif text-white">
            {t("overviewHeading")}
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
            {t("overviewSub")}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => simulateDetection()}
            type="button"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-stone-950 text-xs font-bold transition-all shadow-md active:scale-95"
          >
            <Zap className="w-4 h-4 fill-stone-950" />
            <span>{t("simulatingAudio")}</span>
          </button>
          <Link
            href="/dashboard/detections"
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all border border-white/10"
          >
            <span>{t("viewAllDetections")}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t("pestActivityIndex")}
          value={overallActivity}
          subtitle={
            hasHighOrCritical
              ? (language === "hi" ? "ज़ोन B में तुरंत जांच की सिफारिश" : "Inspection recommended in Zone B")
              : (language === "hi" ? "सामान्य जैव-ध्वनिक सीमा में" : "Within normal bioacoustic range")
          }
          icon={ShieldAlert}
          variant={hasHighOrCritical ? "amber" : "emerald"}
          badgeText={hasHighOrCritical ? t("actionRequired") : t("stable")}
          onClick={() => setSelectedZoneId("zone-b")}
        />

        <StatCard
          title={t("latestTemp")}
          value={currentTemp}
          unit="°C"
          subtitle={language === "hi" ? "आदर्श सीमा: 24.0 – 32.0°C" : "Optimal range: 24.0 – 32.0°C"}
          icon={Thermometer}
          variant={currentTemp > 31.0 ? "amber" : "emerald"}
          badgeText="SHT31 Sensor"
        />

        <StatCard
          title={t("relativeHumidity")}
          value={currentHumidity}
          unit="%"
          subtitle={language === "hi" ? "वृक्ष छत्र सूक्ष्म जलवायु नमी" : "Canopy microclimate moisture"}
          icon={Droplets}
          variant={currentHumidity > 75 ? "amber" : "emerald"}
          badgeText="Ambient RH"
        />

        <StatCard
          title={t("activeAlerts")}
          value={activeAlertCount}
          subtitle={
            activeAlertCount > 0
              ? (language === "hi" ? `${activeAlertCount} अलर्ट पर ध्यान आवश्यक` : `${activeAlertCount} require acknowledgement`)
              : (language === "hi" ? "सभी सिस्टम चेतावनियां सामान्य" : "All system warnings clear")
          }
          icon={Bell}
          variant={activeAlertCount > 0 ? "rose" : "emerald"}
          badgeText={activeAlertCount > 0 ? t("attention") : t("nominal")}
        />
      </div>

      {/* Charts Section: Activity Trends & Microclimate */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pest Activity Frequency Trend Chart */}
        <div className="lg:col-span-7 bg-white rounded-xl p-5 border border-stone-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-700" />
                {t("trendChartTitle")}
              </h3>
              <span className="text-[11px] font-mono text-stone-400">
                12h Moving Window
              </span>
            </div>
            <p className="text-xs text-stone-500 mb-4">
              {t("trendChartSub")}
            </p>
          </div>

          <div className="h-64 w-full">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={ACTIVITY_TREND_HOURLY}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorTargetA" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="colorTargetB" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="colorUnknown" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                  />
                  <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#334155",
                      borderRadius: "8px",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="targetA"
                    name="Target Pest A (Palm Weevil)"
                    stroke="#ef4444"
                    fillOpacity={1}
                    fill="url(#colorTargetA)"
                  />
                  <Area
                    type="monotone"
                    dataKey="targetB"
                    name="Target Pest B (Rhino Beetle)"
                    stroke="#f59e0b"
                    fillOpacity={1}
                    fill="url(#colorTargetB)"
                  />
                  <Area
                    type="monotone"
                    dataKey="unknown"
                    name="Unknown / Bio-Resonance"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#colorUnknown)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-stone-400">
                Loading telemetry chart...
              </div>
            )}
          </div>
        </div>

        {/* Microclimate Temperature & Humidity Dual Chart */}
        <div className="lg:col-span-5 bg-white rounded-xl p-5 border border-stone-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-rose-600" />
                {t("microclimateChartTitle")}
              </h3>
              <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                {language === "hi" ? "दैनिक चक्र" : "Diurnal Curve"}
              </span>
            </div>
            <p className="text-xs text-stone-500 mb-4">
              {t("microclimateChartSub")}
            </p>
          </div>

          <div className="h-64 w-full">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={microclimateSeries}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                  />
                  <YAxis
                    yAxisId="temp"
                    orientation="left"
                    domain={[20, 36]}
                    tick={{ fontSize: 11, fill: "#ef4444" }}
                  />
                  <YAxis
                    yAxisId="humidity"
                    orientation="right"
                    domain={[40, 100]}
                    tick={{ fontSize: 11, fill: "#0284c7" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#334155",
                      borderRadius: "8px",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
                  />
                  <Line
                    yAxisId="temp"
                    type="monotone"
                    dataKey="temp"
                    name="Temp (°C)"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                  <Line
                    yAxisId="humidity"
                    type="monotone"
                    dataKey="humidity"
                    name="Humidity (%)"
                    stroke="#0284c7"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-stone-400">
                Loading microclimate chart...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Plantation Zones Quick Status Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-700" />
            {t("zonesSummaryTitle")}
          </h3>
          <Link
            href="/dashboard/zones"
            className="text-xs text-emerald-800 hover:text-emerald-950 font-semibold flex items-center gap-1"
          >
            <span>{t("openInteractiveMap")}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {zones.map((zone) => {
            const isSelected = selectedZoneId === zone.id;
            return (
              <div
                key={zone.id}
                onClick={() =>
                  setSelectedZoneId(selectedZoneId === zone.id ? "all" : zone.id)
                }
                className={`p-4 rounded-xl border transition-all cursor-pointer bg-white ${
                  zone.status === "alert"
                    ? "border-rose-300 hover:border-rose-400 ring-1 ring-rose-200"
                    : zone.status === "warning"
                    ? "border-amber-300 hover:border-amber-400 ring-1 ring-amber-200"
                    : "border-stone-200 hover:border-emerald-400"
                } ${isSelected ? "ring-2 ring-emerald-600 bg-emerald-50/20" : ""}`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="font-mono text-xs font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                      {zone.code}
                    </span>
                    <h4 className="font-bold text-stone-900 text-sm mt-1">
                      {zone.name.split("-")[1]?.trim() || zone.name}
                    </h4>
                    <p className="text-[11px] text-stone-500">{zone.cropType}</p>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      zone.status === "alert"
                        ? "bg-rose-100 text-rose-800"
                        : zone.status === "warning"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {zone.status === "alert"
                      ? "Inspection Req."
                      : zone.status === "warning"
                      ? "Watch"
                      : "Optimal"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs py-2 border-t border-b border-stone-100 my-2">
                  <div>
                    <span className="text-[10px] text-stone-400 block">Microclimate</span>
                    <span className="font-semibold text-stone-800">
                      {zone.currentTemp}°C &bull; {zone.currentHumidity}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block">Activity Level</span>
                    <span
                      className={`font-semibold ${
                        zone.pestActivityLevel === "High" ||
                        zone.pestActivityLevel === "Critical"
                          ? "text-rose-700"
                          : zone.pestActivityLevel === "Moderate"
                          ? "text-amber-700"
                          : "text-emerald-700"
                      }`}
                    >
                      {zone.pestActivityLevel}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-stone-500">
                  <span className="truncate">Latest: {zone.lastDetection}</span>
                  <span className="text-emerald-800 font-medium shrink-0">
                    {zone.primaryNodeId}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Detections List with Detailed View Action */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-700" />
              {t("recentDetectionsTitle")}
            </h3>
            <p className="text-xs text-stone-500">
              {t("recentDetectionsSub")}
            </p>
          </div>

          <Link
            href="/dashboard/detections"
            className="text-xs text-emerald-800 hover:text-emerald-950 font-semibold flex items-center gap-1 self-start sm:self-auto"
          >
            <span>{t("fullRegistry")}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentDetections.length === 0 ? (
          <div className="text-center py-8 text-stone-400 text-xs">
            No detections recorded for the selected zone. Click "Simulate Insect Event" above to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 text-[11px] uppercase tracking-wider bg-stone-50/50">
                  <th className="py-2.5 px-3 font-semibold">Detection ID</th>
                  <th className="py-2.5 px-3 font-semibold">Timestamp</th>
                  <th className="py-2.5 px-3 font-semibold">Pest Classification</th>
                  <th className="py-2.5 px-3 font-semibold">Zone & Node</th>
                  <th className="py-2.5 px-3 font-semibold">Confidence (Mock)</th>
                  <th className="py-2.5 px-3 font-semibold">Severity</th>
                  <th className="py-2.5 px-3 font-semibold">Verification</th>
                  <th className="py-2.5 px-3 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {recentDetections.map((detection) => (
                  <tr
                    key={detection.id}
                    onClick={() => setSelectedDetection(detection)}
                    className="hover:bg-emerald-50/40 cursor-pointer transition-colors group"
                  >
                    <td className="py-3 px-3 font-mono font-bold text-emerald-900">
                      {detection.id}
                    </td>
                    <td className="py-3 px-3 text-stone-600 whitespace-nowrap">
                      {detection.timestamp}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-stone-900">
                        {detection.pestLabel.split("(")[0].trim()}
                      </div>
                      <div className="text-[10px] text-stone-400 truncate max-w-xs">
                        {detection.pestLabel.includes("(")
                          ? detection.pestLabel.substring(detection.pestLabel.indexOf("("))
                          : ""}
                      </div>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="font-medium text-stone-800">
                        {detection.zoneId.toUpperCase()}
                      </span>
                      <span className="text-stone-400 text-[10px] ml-1">
                        ({detection.nodeId})
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-stone-900 font-mono">
                          {detection.modelConfidence}%
                        </span>
                        <div className="w-12 h-1.5 bg-stone-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              detection.modelConfidence > 85
                                ? "bg-emerald-600"
                                : detection.modelConfidence > 70
                                ? "bg-amber-500"
                                : "bg-stone-500"
                            }`}
                            style={{ width: `${detection.modelConfidence}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          detection.activitySeverity === "Critical"
                            ? "bg-rose-100 text-rose-800"
                            : detection.activitySeverity === "High"
                            ? "bg-amber-100 text-amber-800"
                            : detection.activitySeverity === "Moderate"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {detection.activitySeverity}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          detection.verificationStatus === "Field Verified"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : detection.verificationStatus === "False Positive"
                            ? "bg-stone-200 text-stone-700"
                            : "bg-amber-50 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {detection.verificationStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDetection(detection);
                        }}
                        type="button"
                        className="text-xs text-emerald-800 font-semibold hover:underline group-hover:text-emerald-950 inline-flex items-center gap-1"
                      >
                        <span>Inspect</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Startup & Investor Demonstration Callout */}
      <div className="p-4 rounded-xl bg-stone-100 border border-stone-200 text-xs text-stone-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-emerald-800 shrink-0" />
          <span>
            <strong>Prototype Demo Context:</strong> Acoustic signals are simulated from pre-recorded field stethoscopes and synthetic sound profiles. Model confidence scores are demo heuristics.
          </span>
        </div>
        <button
          onClick={() => simulateDetection()}
          type="button"
          className="text-xs text-emerald-900 font-bold hover:underline shrink-0"
        >
          Inject Test Ingress Event &rarr;
        </button>
      </div>
    </div>
  );
}
