"use client";

import React, { useState, useEffect } from "react";
import { useAgriVigil } from "@/context/AgriVigilContext";
import { ZoneId } from "@/types/agrivigil";
import {
  generateHourlyReadings,
  generate7DayReadings,
  generate30DayReadings,
} from "@/data/seedData";
import {
  Thermometer,
  Droplets,
  Calendar,
  AlertTriangle,
  Info,
  Sliders,
  TrendingDown,
  TrendingUp,
  MapPin,
  Clock,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function EnvironmentMonitoringPage() {
  const { zones, selectedZoneId, setSelectedZoneId, thresholds, t } = useAgriVigil();
  const [timeRange, setTimeRange] = useState<"today" | "7d" | "30d">("today");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Seed telemetry datasets
  const hourlyData = React.useMemo(() => generateHourlyReadings(), []);
  const sevenDayData = React.useMemo(() => generate7DayReadings(), []);
  const thirtyDayData = React.useMemo(() => generate30DayReadings(), []);

  // Filter hourly data based on selectedZoneId
  const filteredHourly = React.useMemo(() => {
    if (selectedZoneId === "all") {
      // Aggregate average per hour
      const grouped: { [hour: string]: { tempSum: number; humidSum: number; count: number } } = {};
      hourlyData.forEach((item) => {
        if (!grouped[item.timeLabel]) {
          grouped[item.timeLabel] = { tempSum: 0, humidSum: 0, count: 0 };
        }
        grouped[item.timeLabel].tempSum += item.temperatureC;
        grouped[item.timeLabel].humidSum += item.relativeHumidityPct;
        grouped[item.timeLabel].count += 1;
      });

      return Object.keys(grouped).map((time) => ({
        time,
        temperature: Math.round((grouped[time].tempSum / grouped[time].count) * 10) / 10,
        humidity: Math.round(grouped[time].humidSum / grouped[time].count),
      }));
    } else {
      return hourlyData
        .filter((d) => d.zoneId === selectedZoneId)
        .map((d) => ({
          time: d.timeLabel,
          temperature: d.temperatureC,
          humidity: d.relativeHumidityPct,
        }));
    }
  }, [hourlyData, selectedZoneId]);

  // Calculate statistics (Min, Max, Average) based on active timeRange
  const stats = React.useMemo(() => {
    if (timeRange === "today") {
      const temps = filteredHourly.map((d) => d.temperature);
      const humids = filteredHourly.map((d) => d.humidity);
      return {
        minTemp: Math.min(...temps),
        maxTemp: Math.max(...temps),
        avgTemp: Math.round((temps.reduce((a, b) => a + b, 0) / temps.length) * 10) / 10,
        minHumid: Math.min(...humids),
        maxHumid: Math.max(...humids),
        avgHumid: Math.round(humids.reduce((a, b) => a + b, 0) / humids.length),
      };
    } else if (timeRange === "7d") {
      const temps = sevenDayData.map((d) => d.avgTempB);
      const humids = sevenDayData.map((d) => d.avgHumidB);
      return {
        minTemp: Math.min(...temps),
        maxTemp: Math.max(...temps),
        avgTemp: Math.round((temps.reduce((a, b) => a + b, 0) / temps.length) * 10) / 10,
        minHumid: Math.min(...humids),
        maxHumid: Math.max(...humids),
        avgHumid: Math.round(humids.reduce((a, b) => a + b, 0) / humids.length),
      };
    } else {
      const temps = thirtyDayData.map((d) => d.avgTemp);
      const humids = thirtyDayData.map((d) => d.avgHumidity);
      return {
        minTemp: Math.min(...temps),
        maxTemp: Math.max(...temps),
        avgTemp: Math.round((temps.reduce((a, b) => a + b, 0) / temps.length) * 10) / 10,
        minHumid: Math.min(...humids),
        maxHumid: Math.max(...humids),
        avgHumid: Math.round(humids.reduce((a, b) => a + b, 0) / humids.length),
      };
    }
  }, [timeRange, filteredHourly, sevenDayData, thirtyDayData]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
              {t("navMicroclimate", "Microclimate Telemetry")}
            </span>
            <span className="text-xs text-stone-500">
              Sensirion SHT31 Environmental Sensor Arrays
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-emerald-950 font-serif mt-1">
            {t("envHeading", "Plantation Microclimate & Environmental Monitoring")}
          </h2>
          <p className="text-xs text-stone-500 max-w-2xl">
            {t("envSub", "Correlating temperature and canopy relative humidity with insect larval hatch curves and peak stridulation windows.")}
          </p>
        </div>

        {/* Time-Range Filter Buttons */}
        <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs font-medium self-start md:self-auto">
          <button
            type="button"
            onClick={() => setTimeRange("today")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              timeRange === "today"
                ? "bg-white text-emerald-950 font-bold shadow-xs border border-stone-200"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            {t("todayDiurnal", "Today (24h Diurnal)")}
          </button>
          <button
            type="button"
            onClick={() => setTimeRange("7d")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              timeRange === "7d"
                ? "bg-white text-emerald-950 font-bold shadow-xs border border-stone-200"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            {t("past7Days", "Past 7 Days")}
          </button>
          <button
            type="button"
            onClick={() => setTimeRange("30d")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              timeRange === "30d"
                ? "bg-white text-emerald-950 font-bold shadow-xs border border-stone-200"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            {t("past30Days", "Past 30 Days")}
          </button>
        </div>
      </div>

      {/* Zone Selector Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-stone-200">
        <div className="flex items-center gap-2 text-xs font-semibold text-stone-700">
          <MapPin className="w-4 h-4 text-emerald-700" />
          <span>Filter Zone Microclimate:</span>
        </div>
        <div className="flex items-center gap-1.5">
          {(
            [
              { id: "all", label: "All Zones (Composite)" },
              { id: "zone-a", label: "Zone A (North)" },
              { id: "zone-b", label: "Zone B (Central)" },
              { id: "zone-c", label: "Zone C (Nursery)" },
            ] as Array<{ id: ZoneId | "all"; label: string }>
          ).map((zone) => (
            <button
              key={zone.id}
              onClick={() => setSelectedZoneId(zone.id)}
              className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                selectedZoneId === zone.id
                  ? "bg-emerald-900 text-white font-semibold"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {zone.label}
            </button>
          ))}
        </div>
      </div>

      {/* Historical Min / Max / Average Statistics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-[10px] font-medium text-stone-500 uppercase block">
            {t("minTemp", "Min Temperature")}
          </span>
          <span className="text-xl font-bold text-stone-900 font-mono">
            {stats.minTemp}°C
          </span>
          <span className="text-[10px] text-stone-400 block mt-0.5">
            Night minimum
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-[10px] font-medium text-stone-500 uppercase block">
            {t("avgTemp", "Avg Temperature")}
          </span>
          <span className="text-xl font-bold text-emerald-800 font-mono">
            {stats.avgTemp}°C
          </span>
          <span className="text-[10px] text-stone-400 block mt-0.5">
            Selected window
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-[10px] font-medium text-stone-500 uppercase block">
            {t("maxTemp", "Max Temperature")}
          </span>
          <span className="text-xl font-bold text-rose-600 font-mono">
            {stats.maxTemp}°C
          </span>
          <span className="text-[10px] text-stone-400 block mt-0.5">
            Peak solar load
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-[10px] font-medium text-stone-500 uppercase block">
            {t("minHumidity", "Min Humidity")}
          </span>
          <span className="text-xl font-bold text-stone-900 font-mono">
            {stats.minHumid}%
          </span>
          <span className="text-[10px] text-stone-400 block mt-0.5">
            Afternoon low
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-[10px] font-medium text-stone-500 uppercase block">
            {t("avgHumidity", "Avg Humidity")}
          </span>
          <span className="text-xl font-bold text-sky-700 font-mono">
            {stats.avgHumid}%
          </span>
          <span className="text-[10px] text-stone-400 block mt-0.5">
            Moisture average
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-[10px] font-medium text-stone-500 uppercase block">
            {t("maxHumidity", "Max Humidity")}
          </span>
          <span className="text-xl font-bold text-sky-900 font-mono">
            {stats.maxHumid}%
          </span>
          <span className="text-[10px] text-stone-400 block mt-0.5">
            Dawn condensation
          </span>
        </div>
      </div>

      {/* Main Microclimate Telemetry Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Temperature Chart */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-rose-600" />
              {t("tempProfile", "Canopy Temperature Profile (°C)")}
            </h3>
            <span className="text-[11px] font-mono text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
              High Warning: &gt; {thresholds.tempMaxC}°C
            </span>
          </div>

          <div className="h-72 w-full">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                {timeRange === "today" ? (
                  <AreaChart
                    data={filteredHourly}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="time" tick={{ fontSize: 11, fill: "#64748b" }} />
                    <YAxis domain={[20, 36]} tick={{ fontSize: 11, fill: "#64748b" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        borderColor: "#334155",
                        borderRadius: "8px",
                        color: "#fff",
                        fontSize: "12px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="temperature"
                      name="Temperature (°C)"
                      stroke="#ef4444"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorTemp)"
                    />
                  </AreaChart>
                ) : timeRange === "7d" ? (
                  <LineChart
                    data={sevenDayData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="dayLabel" tick={{ fontSize: 11, fill: "#64748b" }} />
                    <YAxis domain={[24, 35]} tick={{ fontSize: 11, fill: "#64748b" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        borderColor: "#334155",
                        borderRadius: "8px",
                        color: "#fff",
                        fontSize: "12px",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px" }} />
                    <Line type="monotone" dataKey="avgTempA" name="Zone A" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="avgTempB" name="Zone B" stroke="#ef4444" strokeWidth={2} />
                    <Line type="monotone" dataKey="avgTempC" name="Zone C" stroke="#f59e0b" strokeWidth={2} />
                  </LineChart>
                ) : (
                  <LineChart
                    data={thirtyDayData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#64748b" }} interval={4} />
                    <YAxis domain={[22, 36]} tick={{ fontSize: 11, fill: "#64748b" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        borderColor: "#334155",
                        borderRadius: "8px",
                        color: "#fff",
                        fontSize: "12px",
                      }}
                    />
                    <Line type="monotone" dataKey="avgTemp" name="Avg Temp (°C)" stroke="#ef4444" strokeWidth={2} dot={false} />
                  </LineChart>
                )}
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-stone-400">
                Loading temperature telemetry...
              </div>
            )}
          </div>
        </div>

        {/* Relative Humidity Chart */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <Droplets className="w-4 h-4 text-sky-600" />
              {t("humidityProfile", "Relative Humidity Profile (%)")}
            </h3>
            <span className="text-[11px] font-mono text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded">
              High Warning: &gt; {thresholds.humidityMaxPct}%
            </span>
          </div>

          <div className="h-72 w-full">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                {timeRange === "today" ? (
                  <AreaChart
                    data={filteredHourly}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorHumid" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0284c7" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#0284c7" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="time" tick={{ fontSize: 11, fill: "#64748b" }} />
                    <YAxis domain={[40, 100]} tick={{ fontSize: 11, fill: "#64748b" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        borderColor: "#334155",
                        borderRadius: "8px",
                        color: "#fff",
                        fontSize: "12px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="humidity"
                      name="Relative Humidity (%)"
                      stroke="#0284c7"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorHumid)"
                    />
                  </AreaChart>
                ) : timeRange === "7d" ? (
                  <LineChart
                    data={sevenDayData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="dayLabel" tick={{ fontSize: 11, fill: "#64748b" }} />
                    <YAxis domain={[50, 95]} tick={{ fontSize: 11, fill: "#64748b" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        borderColor: "#334155",
                        borderRadius: "8px",
                        color: "#fff",
                        fontSize: "12px",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px" }} />
                    <Line type="monotone" dataKey="avgHumidA" name="Zone A" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="avgHumidB" name="Zone B" stroke="#ef4444" strokeWidth={2} />
                    <Line type="monotone" dataKey="avgHumidC" name="Zone C" stroke="#0284c7" strokeWidth={2} />
                  </LineChart>
                ) : (
                  <LineChart
                    data={thirtyDayData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#64748b" }} interval={4} />
                    <YAxis domain={[45, 95]} tick={{ fontSize: 11, fill: "#64748b" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        borderColor: "#334155",
                        borderRadius: "8px",
                        color: "#fff",
                        fontSize: "12px",
                      }}
                    />
                    <Line type="monotone" dataKey="avgHumidity" name="Avg Humidity (%)" stroke="#0284c7" strokeWidth={2} dot={false} />
                  </LineChart>
                )}
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-stone-400">
                Loading humidity telemetry...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Agronomic Context & Threshold Reference Card */}
      <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600 space-y-2">
        <div className="flex items-center gap-2 font-semibold text-stone-800">
          <Info className="w-4 h-4 text-emerald-800 shrink-0" />
          <span>Microclimate Decision-Support Logic (Agronomic Context)</span>
        </div>
        <p className="leading-relaxed">
          High temperatures (above 30°C) coupled with elevated humidity (above 75%) significantly accelerate the incubation period of weevil larvae within palm tissues. When microclimatic conditions align with elevated acoustic detection bursts, the system automatically escalates the zone to <strong>Inspection Required</strong> status.
        </p>
        <div className="text-[11px] text-stone-500 font-mono">
          Current Alert Thresholds: High Temp &gt; {thresholds.tempMaxC}°C &bull; Low Temp &lt; {thresholds.tempMinC}°C &bull; High Humidity &gt; {thresholds.humidityMaxPct}% &bull; Low Humidity &lt; {thresholds.humidityMinPct}%.
          Configurable in Device Settings.
        </div>
      </div>
    </div>
  );
}
