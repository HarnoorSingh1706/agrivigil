"use client";

import React from "react";
import Link from "next/link";
import { WordmarkLogo } from "./WordmarkLogo";
import { useLanguage, Language } from "../context/LanguageContext";
import { siteConfig } from "../config/site";
import { Phone, MessageCircle, Mail, MapPin, ShieldAlert, Heart } from "lucide-react";

export const Footer: React.FC = () => {
  const { t, setLanguage, language } = useLanguage();

  return (
    <footer className="bg-emerald-950 text-stone-200 pt-12 pb-24 md:pb-12 border-t-4 border-amber-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Column 1: Brand & R&D Honesty */}
          <div>
            <div className="bg-white/10 p-2 rounded-2xl inline-block mb-3">
              <WordmarkLogo />
            </div>
            <p className="text-sm text-stone-300 leading-relaxed mb-4">
              {t("footer.about_text")}
            </p>

            {/* R&D Honesty Badge */}
            <div className="p-3 bg-emerald-900/80 rounded-xl border border-emerald-700/80 text-xs text-amber-200 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>{t("footer.rd_note")}</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-white font-serif mb-4 pb-1 border-b border-emerald-800">
              {t("footer.quick_links", "Quick Links")}
            </h4>
            <ul className="space-y-2.5 text-base">
              <li>
                <Link href="/" className="hover:text-amber-400 transition-colors">
                  {t("nav.home", "Home")}
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-amber-400 transition-colors">
                  {t("nav.how_it_works", "How It Works")}
                </Link>
              </li>
              <li>
                <Link href="/benefits" className="hover:text-amber-400 transition-colors">
                  {t("nav.benefits", "Benefits")}
                </Link>
              </li>
              <li>
                <Link href="/roadmap" className="hover:text-amber-400 transition-colors">
                  {t("nav.roadmap", "Roadmap & Progress")}
                </Link>
              </li>
              <li>
                <Link href="/pilot" className="hover:text-amber-400 transition-colors">
                  {t("nav.pilot", "Join 2026 Pilot")}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-amber-400 transition-colors">
                  {t("nav.faq", "Frequently Asked Questions")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Details (PART 1 placeholders clearly presented) */}
          <div>
            <h4 className="text-lg font-bold text-white font-serif mb-4 pb-1 border-b border-emerald-800">
              {t("footer.contact_heading", "Contact Us")}
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="flex items-center gap-2 hover:text-amber-400 transition-colors"
                >
                  <Phone className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>{siteConfig.phoneDisplay}</span>
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(siteConfig.whatsappDefaultMsg)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-amber-400 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>WhatsApp: +{siteConfig.whatsappNumber}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="flex items-center gap-2 hover:text-amber-400 transition-colors"
                >
                  <Mail className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>{siteConfig.email}</span>
                </a>
              </li>
              <li className="flex items-start gap-2 text-stone-300">
                <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{siteConfig.address}</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Language Switcher & Legal */}
          <div>
            <h4 className="text-lg font-bold text-white font-serif mb-4 pb-1 border-b border-emerald-800">
              {t("nav.language", "Language Selection")}
            </h4>
            <div className="flex flex-col gap-2 mb-6">
              <button
                onClick={() => setLanguage("en")}
                type="button"
                className={`w-full py-2.5 px-3 rounded-lg text-sm font-bold text-left transition-colors flex items-center justify-between ${
                  language === "en" ? "bg-amber-400 text-emerald-950" : "bg-emerald-900/60 hover:bg-emerald-800"
                }`}
              >
                <span>English</span>
                {language === "en" && <span className="text-xs">✓ Active</span>}
              </button>
              <button
                onClick={() => setLanguage("hi")}
                type="button"
                className={`w-full py-2.5 px-3 rounded-lg text-sm font-bold text-left transition-colors flex items-center justify-between font-hindi ${
                  language === "hi" ? "bg-amber-400 text-emerald-950" : "bg-emerald-900/60 hover:bg-emerald-800"
                }`}
              >
                <span>हिन्दी (Hindi)</span>
                {language === "hi" && <span className="text-xs">✓ सक्रिय</span>}
              </button>
              <button
                onClick={() => setLanguage("pa")}
                type="button"
                className={`w-full py-2.5 px-3 rounded-lg text-sm font-bold text-left transition-colors flex items-center justify-between font-gurmukhi ${
                  language === "pa" ? "bg-amber-400 text-emerald-950" : "bg-emerald-900/60 hover:bg-emerald-800"
                }`}
              >
                <span>ਪੰਜਾਬੀ (Punjabi)</span>
                {language === "pa" && <span className="text-xs">✓ ਚਾਲੂ</span>}
              </button>
            </div>

            <div className="text-xs text-stone-400 space-x-3">
              <Link href="/privacy" className="hover:underline">
                {t("footer.privacy", "Privacy")}
              </Link>
              <span>•</span>
              <Link href="/terms" className="hover:underline">
                {t("footer.terms", "Terms")}
              </Link>
              <span>•</span>
              <Link href="/admin" className="hover:underline text-amber-400">
                {t("footer.admin_link", "Admin")}
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="border-t border-emerald-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>© 2026 AgriVigil Precision Agriculture. {t("footer.copyright")}</p>
          <p className="flex items-center gap-1">
            Built with science for our farmers
          </p>
        </div>
      </div>
    </footer>
  );
};
