"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { AlertCircle, Home, PhoneCall } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function NotFoundPage() {
  const { t } = useLanguage();

  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
      <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-md">
        <AlertCircle className="w-10 h-10" />
      </div>

      <h1 className="text-3xl font-extrabold text-emerald-950 font-serif">
        {t("not_found.title", "Page Not Found")}
      </h1>

      <p className="text-base text-stone-600 leading-relaxed">
        {t("not_found.desc", "The page you are looking for does not exist or has been moved.")}
      </p>

      <div className="space-y-3 pt-2">
        <Link
          href="/"
          className="w-full py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-extrabold text-lg flex items-center justify-center gap-2 shadow-lg min-h-[56px]"
        >
          <Home className="w-6 h-6" />
          <span>{t("not_found.home_btn", "Back to Home Page")}</span>
        </Link>

        <a
          href={`tel:${siteConfig.phone}`}
          className="w-full py-3.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-base flex items-center justify-center gap-2 min-h-[50px]"
        >
          <PhoneCall className="w-5 h-5 text-emerald-800" />
          <span>Call Support Line</span>
        </a>
      </div>
    </div>
  );
}
