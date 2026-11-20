"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { ListenButton } from "@/components/ListenButton";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

export default function FAQPage() {
  const { t } = useLanguage();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const faqs = [
    { q: t("faq_page.q1"), a: t("faq_page.a1"), id: "faq-1" },
    { q: t("faq_page.q2"), a: t("faq_page.a2"), id: "faq-2" },
    { q: t("faq_page.q3"), a: t("faq_page.a3"), id: "faq-3" },
    { q: t("faq_page.q4"), a: t("faq_page.a4"), id: "faq-4" },
    { q: t("faq_page.q5"), a: t("faq_page.a5"), id: "faq-5" },
    { q: t("faq_page.q6"), a: t("faq_page.a6"), id: "faq-6" },
    { q: t("faq_page.q7"), a: t("faq_page.a7"), id: "faq-7" },
    { q: t("faq_page.q8"), a: t("faq_page.a8"), id: "faq-8" },
    { q: t("faq_page.q9"), a: t("faq_page.a9"), id: "faq-9" },
  ];

  const toggle = (i: number) => {
    setExpandedIndex(expandedIndex === i ? null : i);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="flex justify-center mb-2">
          <ListenButton
            textToRead={`${t("faq_page.title")}. ${t("faq_page.subtitle")}`}
            sectionId="faq-header"
          />
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-emerald-950 font-serif">
          {t("faq_page.title")}
        </h1>
        <p className="text-lg text-stone-600 font-medium">
          {t("faq_page.subtitle")}
        </p>
      </div>

      {/* Accordion List with Dedicated Listen Buttons */}
      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = expandedIndex === idx;

          return (
            <div
              key={faq.id}
              className={`rounded-2xl border-2 transition-all overflow-hidden ${
                isOpen
                  ? "bg-white border-emerald-700 shadow-md ring-1 ring-emerald-700"
                  : "bg-stone-50 border-stone-200 hover:border-stone-300"
              }`}
            >
              {/* Question toggle header */}
              <button
                onClick={() => toggle(idx)}
                type="button"
                className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 font-bold text-lg sm:text-xl text-stone-900 focus:outline-none min-h-[56px]"
                aria-expanded={isOpen}
              >
                <div className="flex items-start gap-3">
                  <HelpCircle className="w-6 h-6 text-emerald-800 flex-shrink-0 mt-0.5" />
                  <span className="font-serif leading-snug">{faq.q}</span>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-6 h-6 text-emerald-800 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-stone-500 flex-shrink-0" />
                )}
              </button>

              {/* Answer content + Listen button */}
              {isOpen && (
                <div className="px-6 pb-6 pt-2 border-t border-stone-200 bg-stone-50/50 space-y-4">
                  <p className="text-base sm:text-lg text-stone-700 leading-relaxed font-normal">
                    {faq.a}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-200/60">
                    <span className="text-xs text-stone-500 font-medium">
                      Press speaker to listen to this answer aloud
                    </span>
                    <ListenButton
                      textToRead={`${faq.q}. ${faq.a}`}
                      sectionId={faq.id}
                      compact={false}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
