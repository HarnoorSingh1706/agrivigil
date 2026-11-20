"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { VoiceFieldMic } from "@/components/VoiceFieldMic";
import { ListenButton } from "@/components/ListenButton";
import { siteConfig } from "@/config/site";
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Send,
  CheckCircle2,
  AlertCircle,
  Map,
} from "lucide-react";

export default function ContactPage() {
  const { t, language } = useLanguage();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!phone || phone.trim().length < 8) {
      setError("Please provide a valid phone number so we can respond.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "farmer",
          name,
          phone,
          village: "General Contact Inquiry",
          state: "N/A",
          crop: "Contact Message",
          message,
          language,
          website_hp: honeypot,
          source: "Contact Page Form",
        }),
      });

      if (!res.ok) throw new Error("Could not send message");
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Failed to submit. Please call or WhatsApp us.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="flex justify-center mb-2">
          <ListenButton
            textToRead={`${t("contact_page.title")}. ${t("contact_page.subtitle")}`}
            sectionId="contact-header"
          />
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-emerald-950 font-serif">
          {t("contact_page.title")}
        </h1>
        <p className="text-lg text-stone-600 font-medium">
          {t("contact_page.subtitle")}
        </p>
      </div>

      {/* 4 Contact Channels Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Direct Call */}
        <a
          href={`tel:${siteConfig.phone}`}
          className="bg-white p-6 rounded-3xl border-2 border-stone-200 hover:border-emerald-600 transition-all shadow-sm space-y-3 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:bg-emerald-800 group-hover:text-amber-400 transition-colors">
            <Phone className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-emerald-950 font-serif">
            {t("contact_page.call_box_title")}
          </h3>
          <p className="text-stone-700 font-semibold">{siteConfig.phoneDisplay}</p>
          <span className="text-xs text-emerald-700 font-bold block">Tap to call directly →</span>
        </a>

        {/* WhatsApp */}
        <a
          href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(siteConfig.whatsappDefaultMsg)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white p-6 rounded-3xl border-2 border-stone-200 hover:border-emerald-600 transition-all shadow-sm space-y-3 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:bg-emerald-700 group-hover:text-white transition-colors">
            <MessageCircle className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-emerald-950 font-serif">
            {t("contact_page.whatsapp_box_title")}
          </h3>
          <p className="text-stone-700 font-semibold">+{siteConfig.whatsappNumber}</p>
          <span className="text-xs text-emerald-700 font-bold block">Start instant chat →</span>
        </a>

        {/* Email */}
        <a
          href={`mailto:${siteConfig.email}`}
          className="bg-white p-6 rounded-3xl border-2 border-stone-200 hover:border-emerald-600 transition-all shadow-sm space-y-3 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-stone-950 transition-colors">
            <Mail className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-emerald-950 font-serif">
            {t("contact_page.email_box_title")}
          </h3>
          <p className="text-stone-700 font-semibold">{siteConfig.email}</p>
          <span className="text-xs text-emerald-700 font-bold block">Send email inquiry →</span>
        </a>

        {/* R&D Lab / Office */}
        <div className="bg-white p-6 rounded-3xl border-2 border-stone-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-800 flex items-center justify-center">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-emerald-950 font-serif">
            {t("contact_page.office_box_title")}
          </h3>
          <p className="text-stone-600 text-xs leading-relaxed">{siteConfig.address}</p>
          <span className="text-[10px] uppercase font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded inline-block">
            PART 1 Placeholder
          </span>
        </div>
      </div>

      {/* Form & Map Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Form */}
        <div className="lg:col-span-7 bg-stone-50 rounded-3xl p-6 sm:p-8 border-2 border-emerald-800 shadow-lg">
          <h2 className="text-2xl font-bold font-serif text-emerald-950 mb-2">
            {t("contact_page.form_heading")}
          </h2>
          <p className="text-xs text-stone-600 mb-6">
            Type or tap the microphone to speak your query in your language.
          </p>

          {submitted ? (
            <div className="p-6 bg-emerald-100 rounded-2xl text-emerald-950 space-y-2 border border-emerald-300 text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-800 mx-auto" />
              <h3 className="font-bold text-lg">Message Sent Successfully</h3>
              <p className="text-sm">We will call or WhatsApp you within 24–48 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-rose-900 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Honeypot */}
              <div className="hidden" aria-hidden="true">
                <input
                  type="text"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Name / नाम / ਨਾਮ
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full p-3.5 border-2 border-stone-300 rounded-xl text-base text-stone-900 focus:border-emerald-700 bg-white min-h-[50px]"
                  />
                  <VoiceFieldMic fieldId="contact_name" fieldName="Name" onTextCaptured={setName} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-emerald-950 mb-1">
                  Phone Number (Required) *
                </label>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full p-3.5 border-2 border-stone-300 rounded-xl text-base text-stone-900 focus:border-emerald-700 bg-white min-h-[50px]"
                  />
                  <VoiceFieldMic fieldId="contact_phone" fieldName="Phone" onTextCaptured={setPhone} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Your Message or Question
                </label>
                <div className="flex gap-2 items-start">
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Speak or type your question..."
                    className="w-full p-3.5 border-2 border-stone-300 rounded-xl text-base text-stone-900 focus:border-emerald-700 bg-white"
                  />
                  <VoiceFieldMic
                    fieldId="contact_msg"
                    fieldName="Message"
                    onTextCaptured={(text) => setMessage((prev) => (prev ? prev + " " : "") + text)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-lg transition-colors flex items-center justify-center gap-2 shadow-md min-h-[56px]"
              >
                <Send className="w-5 h-5" />
                <span>{t("contact_page.send_btn", "Send Message")}</span>
              </button>
            </form>
          )}
        </div>

        {/* Lazy Map Embed Placeholder */}
        <div className="lg:col-span-5 bg-stone-100 rounded-3xl p-6 border-2 border-stone-300 space-y-4">
          <div className="flex items-center gap-2 text-stone-800 font-bold">
            <Map className="w-5 h-5 text-emerald-800" />
            <span>Field Lab & Trial Site Locator</span>
          </div>

          <div className="w-full aspect-[4/3] rounded-2xl bg-stone-200 border-2 border-dashed border-stone-400 flex flex-col items-center justify-center p-6 text-center text-stone-600">
            <MapPin className="w-10 h-10 text-emerald-700 mb-2 animate-bounce" />
            <p className="font-bold text-sm text-stone-800">Interactive Map Embed Placeholder</p>
            <p className="text-xs text-stone-500 mt-1">
              [PLACEHOLDER: Google Maps / OpenStreetMap iframe of R&D Center to be inserted before launch]
            </p>
          </div>

          <div className="text-xs text-stone-500 leading-snug">
            Visits by agricultural partners and research delegations are arranged by appointment.
          </div>
        </div>
      </div>
    </div>
  );
}
