"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Download, Filter, Lock, RefreshCw, AlertCircle, FileSpreadsheet } from "lucide-react";
import { LeadSubmission } from "@/lib/storage";

export default function AdminPage() {
  const { t } = useLanguage();
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [leads, setLeads] = useState<LeadSubmission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [roleFilter, setRoleFilter] = useState("all");
  const [langFilter, setLangFilter] = useState("all");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/leads", {
        headers: {
          Authorization: `Bearer ${password.trim()}`,
        },
      });

      if (!res.ok) {
        throw new Error("Invalid admin key. Please check AGRIVIGIL_ADMIN_PASSWORD.");
      }

      const json = await res.json();
      setLeads(json.leads || []);
      setIsAuthenticated(true);
      sessionStorage.setItem("agrivigil_admin_key", password.trim());
    } catch (err: any) {
      setError(err.message || "Failed to authenticate");
    } finally {
      setLoading(false);
    }
  };

  const reloadLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/leads", {
        headers: {
          Authorization: `Bearer ${password.trim()}`,
        },
      });
      if (res.ok) {
        const json = await res.json();
        setLeads(json.leads || []);
      }
    } catch (err) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedKey = sessionStorage.getItem("agrivigil_admin_key");
    if (savedKey) {
      setPassword(savedKey);
      fetch("/api/leads", {
        headers: { Authorization: `Bearer ${savedKey}` },
      })
        .then((r) => (r.ok ? r.json() : null))
        .then((json) => {
          if (json?.leads) {
            setLeads(json.leads);
            setIsAuthenticated(true);
          }
        })
        .catch(() => {});
    }
  }, []);

  const filteredLeads = leads.filter((l) => {
    if (roleFilter !== "all" && l.role !== roleFilter) return false;
    if (langFilter !== "all" && l.language !== langFilter) return false;
    return true;
  });

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-stone-50 rounded-3xl p-8 border-2 border-emerald-800 shadow-xl space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-amber-400 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-bold font-serif text-emerald-950">
              {t("admin.auth_title", "Admin Authentication")}
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Enter key configured in AGRIVIGIL_ADMIN_PASSWORD (default: agrivigil2026)
            </p>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-rose-900 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                {t("admin.password_label", "Admin Password")}
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password..."
                className="w-full p-3.5 border-2 border-stone-300 rounded-xl text-stone-900 focus:border-emerald-700 bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-base transition-colors"
            >
              {loading ? "Checking..." : t("admin.login_btn", "Access Portal")}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-300 shadow-sm">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-emerald-950">
            {t("admin.title", "Pilot Leads & Submissions")}
          </h1>
          <p className="text-xs text-stone-500">
            {t("admin.total_leads")}: <strong className="text-emerald-800">{filteredLeads.length}</strong> of {leads.length} total
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={reloadLeads}
            type="button"
            className="p-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 transition-colors"
            title="Refresh Leads"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          </button>

          <a
            href={`/api/admin/export?key=${encodeURIComponent(password)}`}
            download
            className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm flex items-center gap-2 shadow-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>{t("admin.export_csv", "Export CSV")}</span>
          </a>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 flex flex-wrap items-center gap-4 text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-emerald-800" />
          <span className="font-bold text-stone-700">{t("admin.filter_role")}:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="p-2 rounded-lg border border-stone-300 bg-white"
          >
            <option value="all">{t("admin.all_roles")}</option>
            <option value="farmer">Farmer</option>
            <option value="fpo">FPO</option>
            <option value="enterprise">Enterprise</option>
            <option value="research">Research</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-bold text-stone-700">{t("admin.filter_lang")}:</span>
          <select
            value={langFilter}
            onChange={(e) => setLangFilter(e.target.value)}
            className="p-2 rounded-lg border border-stone-300 bg-white"
          >
            <option value="all">{t("admin.all_langs")}</option>
            <option value="en">English (en)</option>
            <option value="hi">Hindi (hi)</option>
            <option value="pa">Punjabi (pa)</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-3xl border border-stone-300 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead className="bg-stone-100 text-stone-700 uppercase font-bold text-[11px] tracking-wider border-b border-stone-200">
              <tr>
                <th className="p-3 sm:p-4">{t("admin.col_date")}</th>
                <th className="p-3 sm:p-4">{t("admin.col_name")}</th>
                <th className="p-3 sm:p-4">{t("admin.col_phone")}</th>
                <th className="p-3 sm:p-4">{t("admin.col_village")}</th>
                <th className="p-3 sm:p-4">{t("admin.col_role")}</th>
                <th className="p-3 sm:p-4">{t("admin.col_crop")}</th>
                <th className="p-3 sm:p-4">{t("admin.col_acres")}</th>
                <th className="p-3 sm:p-4">{t("admin.col_lang")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 text-stone-800">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-stone-500">
                    {t("admin.no_leads")}
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-emerald-50/50 transition-colors">
                    <td className="p-3 sm:p-4 whitespace-nowrap text-stone-500">
                      {lead.createdAt ? lead.createdAt.slice(0, 10) : "-"}
                    </td>
                    <td className="p-3 sm:p-4 font-bold text-stone-900">{lead.name}</td>
                    <td className="p-3 sm:p-4 font-mono font-medium text-emerald-800">
                      <a href={`tel:${lead.phone}`} className="hover:underline">
                        {lead.phone}
                      </a>
                    </td>
                    <td className="p-3 sm:p-4">
                      {lead.village}
                      {lead.state && lead.state !== "N/A" ? `, ${lead.state}` : ""}
                    </td>
                    <td className="p-3 sm:p-4">
                      <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {lead.role}
                      </span>
                    </td>
                    <td className="p-3 sm:p-4 font-semibold">{lead.crop}</td>
                    <td className="p-3 sm:p-4">{lead.acres || "-"}</td>
                    <td className="p-3 sm:p-4 uppercase text-[10px] font-mono">{lead.language}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
