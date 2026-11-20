"use client";

import React, { useState } from "react";
import { useAgriVigil } from "@/context/AgriVigilContext";
import { AlertSeverity, AlertStatus } from "@/types/agrivigil";
import {
  Bell,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Filter,
  Zap,
  Info,
  Check,
  RotateCcw,
} from "lucide-react";

export default function SystemAlertsPage() {
  const { alerts, acknowledgeAlert, resolveAlert, simulateDetection, t } = useAgriVigil();

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [severityFilter, setSeverityFilter] = useState<string>("all");

  const filteredAlerts = alerts.filter((a) => {
    if (statusFilter !== "all" && a.status !== statusFilter) return false;
    if (severityFilter !== "all" && a.severity !== severityFilter) return false;
    return true;
  });

  const activeCount = alerts.filter((a) => a.status === "active").length;
  const acknowledgedCount = alerts.filter((a) => a.status === "acknowledged").length;
  const resolvedCount = alerts.filter((a) => a.status === "resolved").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-rose-800 bg-rose-100 border border-rose-300 px-2 py-0.5 rounded">
              Bioacoustic & Microclimate Alert Manager
            </span>
            <span className="text-xs text-stone-500 font-medium">
              {activeCount} {t("activeAlerts", "active incidents")}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-emerald-950 font-serif mt-1">
            {t("alertsHeading", "System Alerts & Operational Incident Desk")}
          </h2>
          <p className="text-xs text-stone-500 max-w-2xl">
            {t("alertsSub", "Real-time notifications triggered when acoustic frequency pulses match classified boring profiles or microclimate conditions exceed risk thresholds.")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => simulateDetection()}
            type="button"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold transition-all shadow-xs active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 fill-stone-950" />
            <span>{t("simulateBtn", "Simulate Alert Event")}</span>
          </button>
        </div>
      </div>

      {/* Demonstration Transparency Notice */}
      <div className="bg-stone-100 border border-stone-200 rounded-xl p-3.5 text-xs text-stone-600 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>In-App Alert System (Demonstration Mode): </strong>
          Alerts reflect algorithmic triggers on mock telemetry. This prototype operates entirely in-browser with simulated notifications; it does not issue external SMS, cellular telemetry, or carrier push notifications.
        </div>
      </div>

      {/* KPI Status Counter Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setStatusFilter("all")}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === "all"
              ? "bg-emerald-900 text-white border-emerald-900 shadow-xs"
              : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider block opacity-80">
            {t("totalLogged", "Total Logged")}
          </span>
          <span className="text-2xl font-bold font-mono">{alerts.length}</span>
          <span className="text-[10px] block mt-0.5 opacity-70">All incident logs</span>
        </button>

        <button
          onClick={() => setStatusFilter("active")}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === "active"
              ? "bg-rose-700 text-white border-rose-700 shadow-xs"
              : "bg-white text-stone-700 border-stone-200 hover:bg-rose-50"
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider block opacity-80">
            {t("activeUnread", "Active / Unread")}
          </span>
          <span className="text-2xl font-bold font-mono text-rose-600">
            {activeCount}
          </span>
          <span className="text-[10px] block mt-0.5 opacity-70">{t("actionRequired", "Action required")}</span>
        </button>

        <button
          onClick={() => setStatusFilter("acknowledged")}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === "acknowledged"
              ? "bg-amber-600 text-white border-amber-600 shadow-xs"
              : "bg-white text-stone-700 border-stone-200 hover:bg-amber-50"
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider block opacity-80">
            {t("acknowledged", "Acknowledged")}
          </span>
          <span className="text-2xl font-bold font-mono text-amber-600">
            {acknowledgedCount}
          </span>
          <span className="text-[10px] block mt-0.5 opacity-70">Scout en-route</span>
        </button>

        <button
          onClick={() => setStatusFilter("resolved")}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === "resolved"
              ? "bg-emerald-700 text-white border-emerald-700 shadow-xs"
              : "bg-white text-stone-700 border-stone-200 hover:bg-emerald-50"
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider block opacity-80">
            {t("resolved", "Resolved")}
          </span>
          <span className="text-2xl font-bold font-mono text-emerald-700">
            {resolvedCount}
          </span>
          <span className="text-[10px] block mt-0.5 opacity-70">Closed incidents</span>
        </button>
      </div>

      {/* Severity Filter & Table / Cards */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 bg-stone-50/50">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-stone-500" />
            <span className="text-xs font-bold text-stone-800">Filter Severity:</span>
            <div className="flex items-center gap-1">
              {(["all", "critical", "warning", "info"] as Array<AlertSeverity | "all">).map((sev) => (
                <button
                  key={sev}
                  onClick={() => setSeverityFilter(sev)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold capitalize transition-colors ${
                    severityFilter === sev
                      ? "bg-stone-800 text-white"
                      : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-100"
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          <span className="text-xs text-stone-500 font-mono">
            Showing {filteredAlerts.length} of {alerts.length} alerts
          </span>
        </div>

        {/* Alerts List */}
        {filteredAlerts.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h4 className="text-sm font-semibold text-stone-800">
              No alerts matching current filters
            </h4>
            <p className="text-xs text-stone-500">
              All microclimate and bio-acoustic telemetry are nominal for the selected filter set.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-stone-200">
            {filteredAlerts.map((alert) => {
              const isCritical = alert.severity === "critical";
              const isWarning = alert.severity === "warning";
              const isActive = alert.status === "active";
              const isAcknowledged = alert.status === "acknowledged";
              const isResolved = alert.status === "resolved";

              return (
                <div
                  key={alert.id}
                  className={`p-4 sm:p-5 transition-colors ${
                    isActive
                      ? isCritical
                        ? "bg-rose-50/30 hover:bg-rose-50/50"
                        : "bg-amber-50/30 hover:bg-amber-50/50"
                      : "bg-white hover:bg-stone-50/70"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    {/* Left: Icon, Title, and Context */}
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                          isCritical
                            ? "bg-rose-100 text-rose-700"
                            : isWarning
                            ? "bg-amber-100 text-amber-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {isCritical ? (
                          <AlertCircle className="w-5 h-5 animate-pulse" />
                        ) : isWarning ? (
                          <AlertTriangle className="w-5 h-5" />
                        ) : (
                          <Bell className="w-5 h-5" />
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-stone-900">
                            {alert.id}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                              isCritical
                                ? "bg-rose-100 text-rose-800 border border-rose-300"
                                : isWarning
                                ? "bg-amber-100 text-amber-800 border border-amber-300"
                                : "bg-stone-100 text-stone-700 border border-stone-300"
                            }`}
                          >
                            {alert.severity}
                          </span>
                          <span className="text-xs text-stone-500 font-medium">
                            {alert.zoneName} ({alert.nodeId})
                          </span>
                          <span className="text-xs text-stone-400">&bull;</span>
                          <span className="text-xs text-stone-500 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-stone-400" />
                            {alert.timestamp}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-stone-900">
                          {alert.title}
                        </h4>

                        <p className="text-xs text-stone-700 leading-relaxed">
                          <strong className="text-stone-900">Cause: </strong>
                          {alert.cause}
                        </p>

                        <div className="bg-white/80 p-2.5 rounded-lg border border-stone-200 text-xs text-stone-700 space-y-1">
                          <div className="flex items-center gap-1.5 font-semibold text-emerald-900">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Recommended IPM Action:</span>
                          </div>
                          <p className="text-stone-600 leading-relaxed text-[11px]">
                            {alert.recommendedAction}
                          </p>
                        </div>

                        {/* Audit Log Timestamp */}
                        {isAcknowledged && (
                          <div className="text-[11px] text-amber-700 font-mono">
                            Acknowledged by Scout Desk at {alert.acknowledgedAt}
                          </div>
                        )}
                        {isResolved && (
                          <div className="text-[11px] text-emerald-700 font-mono flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Incident resolved at {alert.resolvedAt}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Action Buttons */}
                    <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 pt-2 sm:pt-0">
                      {isActive && (
                        <>
                          <button
                            type="button"
                            onClick={() => acknowledgeAlert(alert.id)}
                            className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Acknowledge</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => resolveAlert(alert.id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Resolve</span>
                          </button>
                        </>
                      )}

                      {isAcknowledged && (
                        <button
                          type="button"
                          onClick={() => resolveAlert(alert.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark Resolved</span>
                        </button>
                      )}

                      {isResolved && (
                        <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-full">
                          Closed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
