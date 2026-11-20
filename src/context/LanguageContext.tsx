"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import enData from "../locales/en.json";
import hiData from "../locales/hi.json";
import paData from "../locales/pa.json";

export type Language = "en" | "hi" | "pa";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: string, fallback?: string) => string;
  isFirstVisit: boolean;
  dismissLanguageModal: () => void;
  openLanguageModal: () => void;
  showModal: boolean;
}

const translations: Record<Language, any> = {
  en: enData,
  hi: hiData,
  pa: paData,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("en");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(false);

  useEffect(() => {
    // Check stored language preference
    const stored = localStorage.getItem("agrivigil_lang") as Language | null;
    const selectedFlag = localStorage.getItem("agrivigil_lang_selected");

    if (stored && ["en", "hi", "pa"].includes(stored)) {
      setLanguageState(stored);
      document.documentElement.lang = stored;
    } else {
      // Auto-detect browser language
      const browserLang = (navigator.language || "").toLowerCase();
      let defaultLang: Language = "en";
      if (browserLang.startsWith("hi")) {
        defaultLang = "hi";
      } else if (browserLang.startsWith("pa")) {
        defaultLang = "pa";
      }
      setLanguageState(defaultLang);
      document.documentElement.lang = defaultLang;
    }

    if (!selectedFlag) {
      setShowModal(true);
      setIsFirstVisit(true);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("agrivigil_lang", lang);
    localStorage.setItem("agrivigil_lang_selected", "true");
    document.cookie = `agrivigil_lang=${lang}; path=/; max-age=31536000`;
    document.documentElement.lang = lang;
  };

  const dismissLanguageModal = () => {
    localStorage.setItem("agrivigil_lang_selected", "true");
    setShowModal(false);
  };

  const openLanguageModal = () => {
    setShowModal(true);
  };

  // Safe nested translation lookup: e.g. t("hero.title")
  const t = (path: string, fallback?: string): string => {
    const keys = path.split(".");
    let current = translations[language];

    for (const key of keys) {
      if (current && typeof current === "object" && key in current) {
        current = current[key];
      } else {
        // Fallback to English
        let enCurrent = translations.en;
        for (const enKey of keys) {
          if (enCurrent && typeof enCurrent === "object" && enKey in enCurrent) {
            enCurrent = enCurrent[enKey];
          } else {
            return fallback || path;
          }
        }
        return typeof enCurrent === "string" ? enCurrent : fallback || path;
      }
    }

    return typeof current === "string" ? current : fallback || path;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        isFirstVisit,
        dismissLanguageModal,
        openLanguageModal,
        showModal,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
