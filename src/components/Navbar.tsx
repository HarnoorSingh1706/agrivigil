"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { WordmarkLogo } from "./WordmarkLogo";
import { useLanguage, Language } from "../context/LanguageContext";
import { useVoice } from "../context/VoiceContext";
import { siteConfig } from "../config/site";
import { Phone, MessageCircle, Mic, Menu, X, Globe, Sparkles } from "lucide-react";

export const Navbar: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { openVoiceModal, isListening } = useVoice();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: t("nav.home", "Home") },
    { href: "/how-it-works", label: t("nav.how_it_works", "How It Works") },
    { href: "/benefits", label: t("nav.benefits", "Benefits") },
    { href: "/roadmap", label: t("nav.roadmap", "Roadmap") },
    { href: "/pilot", label: t("nav.pilot", "Join Pilot") },
    { href: "/about", label: t("nav.about", "About") },
    { href: "/contact", label: t("nav.contact", "Contact") },
    { href: "/faq", label: t("nav.faq", "FAQ") },
  ];

  const handleLangChange = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      {/* Top Micro-Bar: Three Prominent Language Buttons & Quick Contact */}
      <div className="bg-stone-900 text-stone-200 px-3 sm:px-6 py-1.5 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* 3 Prominent Language Switcher Buttons (No hidden dropdown) */}
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider hidden sm:inline-flex items-center gap-1 mr-1">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              Language:
            </span>
            <div className="inline-flex p-0.5 rounded-lg bg-stone-800 border border-stone-700">
              <button
                onClick={() => handleLangChange("en")}
                type="button"
                className={`px-3 py-1 rounded-md text-xs sm:text-sm font-bold transition-all ${
                  language === "en"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-stone-300 hover:text-white"
                }`}
                aria-label="Switch to English"
              >
                English
              </button>
              <button
                onClick={() => handleLangChange("hi")}
                type="button"
                className={`px-3 py-1 rounded-md text-xs sm:text-sm font-bold transition-all font-hindi ${
                  language === "hi"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-stone-300 hover:text-white"
                }`}
                aria-label="हिन्दी में बदलें"
              >
                हिन्दी
              </button>
              <button
                onClick={() => handleLangChange("pa")}
                type="button"
                className={`px-3 py-1 rounded-md text-xs sm:text-sm font-bold transition-all font-gurmukhi ${
                  language === "pa"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-stone-300 hover:text-white"
                }`}
                aria-label="ਪੰਜਾਬੀ ਵਿੱਚ ਬਦਲੋ"
              >
                ਪੰਜਾਬੀ
              </button>
            </div>
          </div>

          {/* Quick Direct Actions */}
          <div className="flex items-center gap-2">
            <a
              href={`tel:${siteConfig.phone}`}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-800 hover:bg-stone-700 text-xs font-semibold text-stone-200 transition-colors"
              aria-label={t("nav.call_us", "Call Us")}
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">{siteConfig.phoneDisplay}</span>
              <span className="md:hidden">Call</span>
            </a>

            <a
              href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(siteConfig.whatsappDefaultMsg)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-600/90 hover:bg-emerald-600 text-xs font-bold text-white transition-colors"
              aria-label={t("nav.whatsapp", "WhatsApp Us")}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Sleek Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between gap-4">
        {/* Brand Wordmark */}
        <WordmarkLogo />

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-emerald-50 text-emerald-950 font-bold shadow-xs border border-emerald-200"
                    : "text-stone-600 hover:text-emerald-900 hover:bg-stone-50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2.5">
          {/* Sleek Voice Assistant Pill */}
          <button
            onClick={openVoiceModal}
            type="button"
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-full border text-xs sm:text-sm font-bold transition-all shadow-xs ${
              isListening
                ? "bg-amber-400 text-stone-950 border-amber-500 animate-pulse"
                : "bg-stone-100 text-stone-800 border-stone-200 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-900"
            }`}
            aria-label="Voice assistance"
            title="Speak into website"
          >
            <Mic className={`w-4 h-4 text-emerald-700 ${isListening ? "animate-bounce text-stone-950" : ""}`} />
            <span className="hidden sm:inline">{t("voice.mic_label", "Voice")}</span>
          </button>

          {/* Join Pilot Button */}
          <Link
            href="/pilot"
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-full bg-gradient-to-r from-emerald-800 to-emerald-700 hover:from-emerald-900 hover:to-emerald-800 text-white font-bold text-sm shadow-sm transition-all transform hover:-translate-y-0.5"
          >
            {t("nav.pilot", "Join Pilot")}
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
            className="lg:hidden p-2 rounded-xl text-stone-700 hover:bg-stone-100 focus:outline-none"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-stone-200 p-4 shadow-xl animate-fade-in">
          <nav className="flex flex-col space-y-1.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`p-3 rounded-xl text-base font-semibold flex items-center justify-between ${
                    isActive
                      ? "bg-emerald-800 text-white font-bold"
                      : "text-stone-800 hover:bg-emerald-50"
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="text-xs text-amber-300">●</span>}
                </Link>
              );
            })}

            {/* Mobile Voice Button */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openVoiceModal();
              }}
              type="button"
              className="p-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-base flex items-center justify-center gap-2 shadow-xs mt-2"
            >
              <Mic className="w-5 h-5 text-stone-950" />
              <span>{t("voice.mic_label", "Voice Assistant")}</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};
