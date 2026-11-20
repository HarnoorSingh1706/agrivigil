"use client";

import React, { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  icon: LucideIcon;
  variant?: "default" | "emerald" | "amber" | "rose";
  badgeText?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  subtitle,
  icon: Icon,
  variant = "default",
  badgeText,
  onClick,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "emerald":
        return {
          border: "border-emerald-200",
          iconBg: "bg-emerald-100 text-emerald-800",
          badge: "bg-emerald-50 text-emerald-800 border-emerald-200",
        };
      case "amber":
        return {
          border: "border-amber-200",
          iconBg: "bg-amber-100 text-amber-800",
          badge: "bg-amber-50 text-amber-800 border-amber-200",
        };
      case "rose":
        return {
          border: "border-rose-200",
          iconBg: "bg-rose-100 text-rose-800",
          badge: "bg-rose-50 text-rose-800 border-rose-200",
        };
      default:
        return {
          border: "border-stone-200",
          iconBg: "bg-stone-100 text-stone-700",
          badge: "bg-stone-100 text-stone-700 border-stone-200",
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl p-4 sm:p-5 border ${styles.border} shadow-xs transition-all ${
        onClick ? "cursor-pointer hover:border-emerald-400 hover:shadow-md" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            {title}
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 font-sans">
              {value}
            </span>
            {unit && <span className="text-sm font-semibold text-stone-500">{unit}</span>}
          </div>
        </div>

        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${styles.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-stone-500">
        <span>{subtitle}</span>
        {badgeText && (
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${styles.badge}`}>
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
};
