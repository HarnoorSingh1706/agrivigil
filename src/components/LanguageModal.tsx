"use client";

import React from "react";
import { useLanguage, Language } from "../context/LanguageContext";
import { Check, Globe, Sparkles, X } from "lucide-react";

export const LanguageModal: React.FC = () => {
  const { showModal, setLanguage, dismissLanguageModal, language } = useLanguage();

  if (!showModal) return null;

  const handleSelect = (lang: Language) => {
    setLanguage(lang);
    dismissLanguageModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 text-stone-900 relative">
        {/* Subtle close button */}
        <button
          onClick={dismissLanguageModal}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="w-14 h-14 bg-emerald-50 text-emerald-800 rounded-2xl mx-auto flex items-center justify-center shadow-xs border border-emerald-200 mb-4">
          <Globe className="w-7 h-7 text-emerald-700" />
        </div>

        {/* Multilingual Titles */}
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 font-serif mb-1">
            Choose Your Language
          </h2>
          <div className="flex items-center justify-center gap-2 text-sm text-stone-500 font-medium">
            <span>अपनी भाषा चुनें</span>
            <span>•</span>
            <span>ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ</span>
          </div>
        </div>

        {/* 3 Modern Cards */}
        <div className="space-y-3 mb-6">
          {/* English */}
          <button
            onClick={() => handleSelect("en")}
            type="button"
            className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between group ${
              language === "en"
                ? "bg-emerald-800 text-white border-emerald-900 shadow-md ring-2 ring-emerald-600"
                : "bg-stone-50 text-stone-800 border-stone-200 hover:border-emerald-500 hover:bg-emerald-50/50"
            }`}
          >
            <div className="text-left">
              <div className="text-lg font-bold">English</div>
              <div className={`text-xs ${language === "en" ? "text-emerald-200" : "text-stone-500"}`}>
                Agricultural & Technical English
              </div>
            </div>
            {language === "en" ? (
              <Check className="w-5 h-5 text-amber-300" />
            ) : (
              <span className="w-5 h-5 rounded-full border border-stone-300 group-hover:border-emerald-500" />
            )}
          </button>

          {/* Hindi */}
          <button
            onClick={() => handleSelect("hi")}
            type="button"
            className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between group ${
              language === "hi"
                ? "bg-emerald-800 text-white border-emerald-900 shadow-md ring-2 ring-emerald-600"
                : "bg-stone-50 text-stone-800 border-stone-200 hover:border-emerald-500 hover:bg-emerald-50/50"
            }`}
          >
            <div className="text-left">
              <div className="text-lg font-bold font-hindi">हिन्दी</div>
              <div className={`text-xs ${language === "hi" ? "text-emerald-200" : "text-stone-500"}`}>
                सरल व स्पष्ट बोलचाल की हिन्दी
              </div>
            </div>
            {language === "hi" ? (
              <Check className="w-5 h-5 text-amber-300" />
            ) : (
              <span className="w-5 h-5 rounded-full border border-stone-300 group-hover:border-emerald-500" />
            )}
          </button>

          {/* Punjabi */}
          <button
            onClick={() => handleSelect("pa")}
            type="button"
            className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between group ${
              language === "pa"
                ? "bg-emerald-800 text-white border-emerald-900 shadow-md ring-2 ring-emerald-600"
                : "bg-stone-50 text-stone-800 border-stone-200 hover:border-emerald-500 hover:bg-emerald-50/50"
            }`}
          >
            <div className="text-left">
              <div className="text-lg font-bold font-gurmukhi">ਪੰਜਾਬੀ</div>
              <div className={`text-xs ${language === "pa" ? "text-emerald-200" : "text-stone-500"}`}>
                ਸਰਲ ਬੋਲਚਾਲ ਦੀ ਪੰਜਾਬੀ
              </div>
            </div>
            {language === "pa" ? (
              <Check className="w-5 h-5 text-amber-300" />
            ) : (
              <span className="w-5 h-5 rounded-full border border-stone-300 group-hover:border-emerald-500" />
            )}
          </button>
        </div>

        <button
          onClick={dismissLanguageModal}
          type="button"
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-800 to-emerald-700 hover:from-emerald-900 hover:to-emerald-800 text-white font-bold text-base transition-all shadow-md"
        >
          Continue to Website →
        </button>
      </div>
    </div>
  );
};
