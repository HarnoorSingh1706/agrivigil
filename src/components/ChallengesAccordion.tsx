"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Wind, Tractor, Bug, Trees, CloudSun, FlaskConical } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { ListenButton } from "./ListenButton";

export const ChallengesAccordion: React.FC = () => {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const challenges = [
    {
      id: "c1",
      icon: Wind,
      title: t("challenges.c1_title"),
      desc: t("challenges.c1_desc"),
    },
    {
      id: "c2",
      icon: Tractor,
      title: t("challenges.c2_title"),
      desc: t("challenges.c2_desc"),
    },
    {
      id: "c3",
      icon: Bug,
      title: t("challenges.c3_title"),
      desc: t("challenges.c3_desc"),
    },
    {
      id: "c4",
      icon: Trees,
      title: t("challenges.c4_title"),
      desc: t("challenges.c4_desc"),
    },
    {
      id: "c5",
      icon: CloudSun,
      title: t("challenges.c5_title"),
      desc: t("challenges.c5_desc"),
    },
    {
      id: "c6",
      icon: FlaskConical,
      title: t("challenges.c6_title"),
      desc: t("challenges.c6_desc"),
    },
  ];

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-3 max-w-4xl mx-auto">
      {challenges.map((item, index) => {
        const isOpen = openIndex === index;
        const IconComponent = item.icon;

        return (
          <div
            key={item.id}
            className={`rounded-2xl border transition-all ${
              isOpen
                ? "bg-white border-emerald-700 shadow-md ring-1 ring-emerald-700"
                : "bg-stone-50 border-stone-300 hover:bg-stone-100/80"
            }`}
          >
            {/* Header button */}
            <button
              onClick={() => toggle(index)}
              type="button"
              className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left font-bold text-lg text-stone-900 min-h-[56px] focus:outline-none focus:ring-2 focus:ring-emerald-600 rounded-2xl"
              aria-expanded={isOpen}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isOpen ? "bg-emerald-800 text-amber-400" : "bg-stone-200 text-stone-700"
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                </div>
                <span className="text-base sm:text-lg font-bold text-emerald-950 font-serif">
                  {item.title}
                </span>
              </div>

              {isOpen ? (
                <ChevronUp className="w-6 h-6 text-emerald-800 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-6 h-6 text-stone-500 flex-shrink-0" />
              )}
            </button>

            {/* Expanded Content */}
            {isOpen && (
              <div className="px-5 pb-5 pt-1 text-base text-stone-700 border-t border-stone-200 mt-1">
                <p className="leading-relaxed mb-4">{item.desc}</p>
                <div className="flex justify-end">
                  <ListenButton
                    textToRead={`${item.title}. ${item.desc}`}
                    sectionId={`challenge-${item.id}`}
                    compact
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
