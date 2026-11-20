"use client";

import React from "react";
import { Mic, X, Check, AlertCircle, Volume2, Navigation } from "lucide-react";
import { useVoice } from "../context/VoiceContext";
import { useLanguage } from "../context/LanguageContext";

export const VoiceAssistantModal: React.FC = () => {
  const {
    isModalOpen,
    closeVoiceModal,
    isListening,
    transcript,
    setTranscript,
    insertTranscriptToField,
    stopListening,
    startListening,
    hasPermissionDenied,
    isVoiceSupported,
    isPunjabiFallback,
    activeFieldId,
  } = useVoice();
  const { t, language } = useLanguage();

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border-2 border-emerald-700 relative text-stone-900">
        {/* Close Button */}
        <button
          onClick={closeVoiceModal}
          className="absolute top-4 right-4 p-2 text-stone-500 hover:text-stone-800 rounded-full hover:bg-stone-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label={t("nav.close", "Close")}
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isListening ? "bg-amber-100 text-amber-700 animate-pulse" : "bg-emerald-100 text-emerald-800"
            }`}
          >
            <Mic className={`w-7 h-7 ${isListening ? "animate-bounce" : ""}`} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-emerald-950 font-serif">
              {t("voice.mic_label", "Voice Assistant")}
            </h3>
            <p className="text-sm text-stone-600">
              {isListening
                ? t("voice.listening", "Listening... Speak now")
                : t("voice.transcript_label", "You said:")}
            </p>
          </div>
        </div>

        {/* Punjabi Fallback Banner if applicable */}
        {language === "pa" && isPunjabiFallback && (
          <div className="mb-3 p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
            <span>{t("voice.punjabi_fallback", "Browser fallback active for voice recognition.")}</span>
          </div>
        )}

        {/* Permission Denied Notice */}
        {hasPermissionDenied && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-300 rounded-xl text-sm text-rose-900 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-rose-700 flex-shrink-0 mt-0.5" />
            <span>{t("voice.permission_denied", "Microphone access denied.")}</span>
          </div>
        )}

        {/* Not Supported Notice */}
        {!isVoiceSupported && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-300 rounded-xl text-sm text-amber-900">
            {t("voice.unsupported", "Voice recognition is not supported in this browser.")}
          </div>
        )}

        {/* Animated Sound Wave Indicator while listening */}
        {isListening && (
          <div className="my-6 flex items-center justify-center gap-1.5 h-12 bg-emerald-50 rounded-xl border border-emerald-200">
            <div className="w-1.5 bg-emerald-700 h-4 rounded-full animate-pulse" />
            <div className="w-1.5 bg-emerald-700 h-8 rounded-full animate-bounce delay-75" />
            <div className="w-1.5 bg-emerald-700 h-12 rounded-full animate-bounce delay-150" />
            <div className="w-1.5 bg-emerald-700 h-7 rounded-full animate-bounce delay-100" />
            <div className="w-1.5 bg-emerald-700 h-10 rounded-full animate-bounce delay-200" />
            <div className="w-1.5 bg-emerald-700 h-4 rounded-full animate-pulse" />
          </div>
        )}

        {/* Spoken Text Transcript (Editable) */}
        <div className="mb-4">
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
            {t("voice.transcript_label", "Spoken Input (Editable)")}:
          </label>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            rows={3}
            placeholder={
              isListening
                ? "Listening to your voice..."
                : t("voice.listening_hint", "Speak clearly into your microphone...")
            }
            className="w-full p-3 border-2 border-stone-300 rounded-xl text-lg font-medium text-stone-900 focus:border-emerald-600 focus:outline-none bg-stone-50"
          />
        </div>

        {/* Helpful speech hints */}
        <div className="mb-5 bg-stone-100 p-3 rounded-xl text-xs text-stone-600 flex items-start gap-2">
          <Navigation className="w-4 h-4 text-emerald-800 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block text-stone-700 mb-0.5">Quick voice commands:</span>
            <span>Say &quot;Home&quot;, &quot;How it works&quot;, &quot;Pilot&quot;, &quot;Contact&quot;, &quot;FAQ&quot;, or speak your crop and village name.</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2.5 justify-end">
          {isListening ? (
            <button
              onClick={stopListening}
              type="button"
              className="px-5 py-3 rounded-xl bg-stone-200 text-stone-800 font-semibold text-base hover:bg-stone-300 transition-colors min-h-[50px]"
            >
              Done Speaking
            </button>
          ) : (
            <button
              onClick={() => startListening({ fieldId: activeFieldId || undefined })}
              type="button"
              className="px-5 py-3 rounded-xl bg-amber-500 text-amber-950 font-semibold text-base hover:bg-amber-600 transition-colors flex items-center gap-2 min-h-[50px]"
            >
              <Mic className="w-5 h-5" />
              Speak Again
            </button>
          )}

          {transcript.trim() && (
            <button
              onClick={insertTranscriptToField}
              type="button"
              className="px-6 py-3 rounded-xl bg-emerald-800 text-white font-semibold text-base hover:bg-emerald-900 transition-colors flex items-center gap-2 min-h-[50px] shadow-md"
            >
              <Check className="w-5 h-5" />
              {activeFieldId ? t("voice.insert_text", "Insert into form") : "Apply Command"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
