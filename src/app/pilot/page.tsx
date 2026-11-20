"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { VoiceFieldMic } from "@/components/VoiceFieldMic";
import { ListenButton } from "@/components/ListenButton";
import { siteConfig } from "@/config/site";
import {
  Users,
  Building,
  TreePine,
  GraduationCap,
  Send,
  CheckCircle2,
  PhoneCall,
  MessageCircle,
  ShieldAlert,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function PilotPage() {
  const { t, language } = useLanguage();

  const [role, setRole] = useState<"farmer" | "fpo" | "enterprise" | "research">("farmer");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [village, setVillage] = useState("");
  const [state, setState] = useState("");
  const [crop, setCrop] = useState("");
  const [acres, setAcres] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!phone || phone.trim().length < 8) {
      setErrorMessage("Please enter a valid mobile number so we can reach you.");
      return;
    }
    if (!village || village.trim() === "") {
      setErrorMessage("Please enter your village/town and district.");
      return;
    }
    if (!crop || crop.trim() === "") {
      setErrorMessage("Please specify the primary crops you grow.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          name,
          phone,
          village,
          state,
          crop,
          acres,
          email,
          message,
          language,
          website_hp: honeypot, // Honeypot field
          source: "2026 Field Pilot Application",
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Submission failed");
      }

      setIsSubmitted(true);
    } catch (err: any) {
      setErrorMessage(err.message || "Something went wrong. Please call or WhatsApp us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="flex justify-center mb-2">
          <ListenButton
            textToRead={`${t("pilot_page.title")}. ${t("pilot_page.subtitle")}. ${t("pilot_page.pricing_notice")}`}
            sectionId="pilot-header"
          />
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-emerald-950 font-serif">
          {t("pilot_page.title")}
        </h1>
        <p className="text-lg text-stone-600 font-medium">
          {t("pilot_page.subtitle")}
        </p>

        {/* Pricing notice badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-100 text-amber-950 text-xs sm:text-sm font-bold border border-amber-300">
          <ShieldAlert className="w-4 h-4 text-amber-700 flex-shrink-0" />
          <span>{t("pilot_page.pricing_notice")}</span>
        </div>
      </div>

      {isSubmitted ? (
        /* =====================================================
           SUCCESS SCREEN
           ===================================================== */
        <div className="bg-emerald-900 text-white rounded-3xl p-8 sm:p-12 text-center shadow-2xl border-4 border-amber-400 space-y-6 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center mx-auto shadow-lg">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold font-serif">
            {t("pilot_page.success_title")}
          </h2>

          <p className="text-base sm:text-lg text-emerald-100 max-w-xl mx-auto leading-relaxed">
            {t("pilot_page.success_body")}
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <a
              href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
                `Hello AgriVigil, I just submitted the pilot form for my field in ${village} (${crop}).`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold text-lg flex items-center gap-2 shadow-lg min-h-[56px]"
            >
              <MessageCircle className="w-6 h-6" />
              <span>{t("pilot_page.success_whatsapp_btn")}</span>
            </a>

            <a
              href={`tel:${siteConfig.phone}`}
              className="px-6 py-4 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-lg flex items-center gap-2 border border-white/40 min-h-[56px]"
            >
              <PhoneCall className="w-5 h-5 text-amber-400" />
              <span>Call Hotline Directly</span>
            </a>
          </div>
        </div>
      ) : (
        /* =====================================================
           PILOT APPLICATION FORM
           ===================================================== */
        <form
          onSubmit={handleSubmit}
          className="bg-stone-50 rounded-3xl p-6 sm:p-10 border-2 border-emerald-800 shadow-xl space-y-6"
        >
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-emerald-950">
              {t("pilot_page.form_title")}
            </h2>
            <span className="text-xs text-emerald-800 font-semibold bg-emerald-100 px-3 py-1 rounded-full">
              Voice Dictation Enabled
            </span>
          </div>

          {/* Error notification if any */}
          {errorMessage && (
            <div className="p-4 bg-rose-50 border border-rose-300 rounded-2xl text-rose-900 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-700 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Honeypot field (hidden from genuine users) */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="website_hp">Leave blank</label>
            <input
              type="text"
              id="website_hp"
              name="website_hp"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {/* Role Selector Tabs */}
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-2">
              {t("pilot_page.role_selector_label")}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: "farmer", label: t("pilot_page.role_farmer"), icon: Users },
                { id: "fpo", label: t("pilot_page.role_fpo"), icon: Building },
                { id: "enterprise", label: t("pilot_page.role_enterprise"), icon: TreePine },
                { id: "research", label: t("pilot_page.role_research"), icon: GraduationCap },
              ].map((r) => {
                const Icon = r.icon;
                const active = role === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id as any)}
                    className={`p-3 rounded-xl border text-xs sm:text-sm font-bold flex flex-col items-center justify-center gap-1.5 transition-all min-h-[56px] ${
                      active
                        ? "bg-emerald-800 text-white border-emerald-900 shadow-md"
                        : "bg-white text-stone-700 border-stone-300 hover:bg-emerald-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{r.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Fields with Voice Dictation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label htmlFor="pilot_name" className="block text-sm font-bold text-stone-700 mb-1">
                {t("pilot_page.name_label")}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="pilot_name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Patel"
                  className="w-full p-3.5 border-2 border-stone-300 rounded-xl text-base text-stone-900 focus:border-emerald-700 bg-white min-h-[50px]"
                />
                <VoiceFieldMic fieldId="pilot_name" fieldName="Full Name" onTextCaptured={setName} />
              </div>
            </div>

            {/* Mobile Phone (Required) */}
            <div>
              <label htmlFor="pilot_phone" className="block text-sm font-bold text-emerald-950 mb-1">
                {t("pilot_page.phone_label")} *
              </label>
              <div className="flex gap-2">
                <input
                  type="tel"
                  id="pilot_phone"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full p-3.5 border-2 border-stone-300 rounded-xl text-base text-stone-900 focus:border-emerald-700 bg-white min-h-[50px]"
                />
                <VoiceFieldMic fieldId="pilot_phone" fieldName="Phone number" onTextCaptured={setPhone} />
              </div>
            </div>

            {/* Village / Town & District (Required) */}
            <div>
              <label htmlFor="pilot_village" className="block text-sm font-bold text-emerald-950 mb-1">
                {t("pilot_page.village_label")} *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="pilot_village"
                  required
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder="e.g. Anandpur, Wardha District"
                  className="w-full p-3.5 border-2 border-stone-300 rounded-xl text-base text-stone-900 focus:border-emerald-700 bg-white min-h-[50px]"
                />
                <VoiceFieldMic fieldId="pilot_village" fieldName="Village and District" onTextCaptured={setVillage} />
              </div>
            </div>

            {/* State */}
            <div>
              <label htmlFor="pilot_state" className="block text-sm font-bold text-stone-700 mb-1">
                {t("pilot_page.state_label")}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="pilot_state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. Maharashtra / Punjab / Gujarat"
                  className="w-full p-3.5 border-2 border-stone-300 rounded-xl text-base text-stone-900 focus:border-emerald-700 bg-white min-h-[50px]"
                />
                <VoiceFieldMic fieldId="pilot_state" fieldName="State" onTextCaptured={setState} />
              </div>
            </div>

            {/* Primary Crop (Required) */}
            <div>
              <label htmlFor="pilot_crop" className="block text-sm font-bold text-emerald-950 mb-1">
                {t("pilot_page.crop_label")} *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="pilot_crop"
                  required
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  placeholder="e.g. Cotton, Paddy, Sugarcane, Pulses"
                  className="w-full p-3.5 border-2 border-stone-300 rounded-xl text-base text-stone-900 focus:border-emerald-700 bg-white min-h-[50px]"
                />
                <VoiceFieldMic fieldId="pilot_crop" fieldName="Crop name" onTextCaptured={setCrop} />
              </div>
            </div>

            {/* Total Acres */}
            <div>
              <label htmlFor="pilot_acres" className="block text-sm font-bold text-stone-700 mb-1">
                {t("pilot_page.acres_label")}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="pilot_acres"
                  value={acres}
                  onChange={(e) => setAcres(e.target.value)}
                  placeholder="e.g. 5 acres"
                  className="w-full p-3.5 border-2 border-stone-300 rounded-xl text-base text-stone-900 focus:border-emerald-700 bg-white min-h-[50px]"
                />
                <VoiceFieldMic fieldId="pilot_acres" fieldName="Total acres" onTextCaptured={setAcres} />
              </div>
            </div>
          </div>

          {/* Email (Optional) */}
          <div>
            <label htmlFor="pilot_email" className="block text-sm font-bold text-stone-700 mb-1">
              {t("pilot_page.email_label")}
            </label>
            <input
              type="email"
              id="pilot_email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. farmer@example.com (optional)"
              className="w-full p-3.5 border-2 border-stone-300 rounded-xl text-base text-stone-900 focus:border-emerald-700 bg-white min-h-[50px]"
            />
          </div>

          {/* Specific Message / Pest Question */}
          <div>
            <label htmlFor="pilot_message" className="block text-sm font-bold text-stone-700 mb-1">
              {t("pilot_page.message_label")}
            </label>
            <div className="flex gap-2 items-start">
              <textarea
                id="pilot_message"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Mention pests causing damage or specific water conditions..."
                className="w-full p-3.5 border-2 border-stone-300 rounded-xl text-base text-stone-900 focus:border-emerald-700 bg-white"
              />
              <VoiceFieldMic
                fieldId="pilot_message"
                fieldName="Message"
                onTextCaptured={(text) => setMessage((prev) => (prev ? prev + " " : "") + text)}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-950 font-extrabold text-xl transition-all shadow-lg flex items-center justify-center gap-2 min-h-[56px] disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>{t("pilot_page.submitting", "Submitting details...")}</span>
              </>
            ) : (
              <>
                <Send className="w-6 h-6" />
                <span>{t("pilot_page.submit_btn", "Submit Pilot Application")}</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
