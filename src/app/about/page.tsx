"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { ListenButton } from "@/components/ListenButton";
import { siteConfig } from "@/config/site";
import { ShieldCheck, Compass, HeartHandshake, User, Award, ExternalLink } from "lucide-react";

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="flex justify-center mb-2">
          <ListenButton
            textToRead={`${t("about_page.title")}. ${t("about_page.subtitle")}. ${t("about_page.mission_desc")}`}
            sectionId="about-header"
          />
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-emerald-950 font-serif">
          {t("about_page.title")}
        </h1>
        <p className="text-lg text-stone-600 font-medium">
          {t("about_page.subtitle")}
        </p>
      </div>

      {/* Mission & Vision Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Mission */}
        <div className="bg-emerald-900 text-white rounded-3xl p-8 border-2 border-emerald-700 shadow-xl space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center">
            <Compass className="w-7 h-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-serif">
            {t("about_page.mission_title")}
          </h2>
          <p className="text-base sm:text-lg text-emerald-100 leading-relaxed">
            {t("about_page.mission_desc")}
          </p>
        </div>

        {/* Vision */}
        <div className="bg-stone-50 rounded-3xl p-8 border-2 border-emerald-800 shadow-xl space-y-4 text-stone-900">
          <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-amber-400 flex items-center justify-center">
            <HeartHandshake className="w-7 h-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 font-serif">
            {t("about_page.vision_title")}
          </h2>
          <p className="text-base sm:text-lg text-stone-700 leading-relaxed">
            {t("about_page.vision_desc")}
          </p>
        </div>
      </div>

      {/* 3 Founding Principles */}
      <section className="bg-stone-100 rounded-3xl p-6 sm:p-10 border border-stone-300 space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold font-serif text-emerald-950 text-center">
          {t("about_page.honesty_title")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="font-bold text-lg text-emerald-950">Scientific Rigor</h3>
            <p className="text-sm text-stone-600 leading-relaxed">{t("about_page.h1")}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="font-bold text-lg text-emerald-950">Farmer-First UX</h3>
            <p className="text-sm text-stone-600 leading-relaxed">{t("about_page.h2")}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-900 flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="font-bold text-lg text-emerald-950">Ecological Balance</h3>
            <p className="text-sm text-stone-600 leading-relaxed">{t("about_page.h3")}</p>
          </div>
        </div>
      </section>

      {/* Leadership & Agronomy Team (PART 1 Placeholders clearly marked) */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 font-serif">
            {t("about_page.team_title")}
          </h2>
          <p className="text-stone-600 text-sm">{t("about_page.team_subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {siteConfig.team.map((member, idx) => (
            <div
              key={idx}
              className="bg-stone-50 rounded-2xl p-6 border-2 border-stone-200 flex items-start gap-4 shadow-sm"
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0">
                <User className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-stone-900 font-serif">{member.name}</h3>
                  {member.placeholder && (
                    <span className="text-[10px] uppercase font-bold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded border border-amber-300">
                      PART 1 Placeholder
                    </span>
                  )}
                </div>
                <div className="text-xs font-bold text-emerald-700">{member.role}</div>
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="inline-block text-xs text-stone-500 hover:text-emerald-800 transition-colors font-mono"
                  >
                    ✉ {member.email}
                  </a>
                )}
                <p className="text-xs text-stone-600 leading-relaxed pt-1">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Advisors & Mentors */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 font-serif">
            {t("about_page.advisors_title")}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {siteConfig.advisors.map((adv: any, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-stone-300 flex items-start gap-4 shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center flex-shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-stone-900">{adv.name}</h3>
                  {adv.placeholder && (
                    <span className="text-[10px] uppercase font-bold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded">
                      PART 1 Placeholder
                    </span>
                  )}
                </div>
                <div className="text-xs font-semibold text-emerald-800">{adv.role}</div>
                {adv.email && (
                  <a
                    href={`mailto:${adv.email}`}
                    className="inline-block text-xs text-stone-500 hover:text-emerald-800 transition-colors font-mono"
                  >
                    ✉ {adv.email}
                  </a>
                )}
                <div className="text-xs text-stone-500">{adv.affiliation}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
