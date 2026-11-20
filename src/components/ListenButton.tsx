"use client";

import React from "react";
import { Volume2, VolumeX, Mic } from "lucide-react";
import { useVoice } from "../context/VoiceContext";
import { useLanguage } from "../context/LanguageContext";

interface ListenButtonProps {
  textToRead: string;
  sectionId?: string;
  label?: string;
  className?: string;
  compact?: boolean;
}

export const ListenButton: React.FC<ListenButtonProps> = ({
  textToRead,
  sectionId,
  label,
  className = "",
  compact = false,
}) => {
  const { speak, stopSpeaking, isSpeaking, currentlySpeakingId, setCurrentlySpeakingId } = useVoice();
  const { t } = useLanguage();

  const isCurrentSection = Boolean(sectionId && currentlySpeakingId === sectionId);
  const active = Boolean(isSpeaking && isCurrentSection);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (active) {
      stopSpeaking();
    } else {
      if (sectionId) {
        setCurrentlySpeakingId(sectionId);
      }
      speak(textToRead);
    }
  };

  const buttonText = active
    ? t("voice.stop_speaking", "Stop reading")
    : label || t("voice.listen_section", "Listen to this section");

  if (compact) {
    return (
      <button
        onClick={handleToggle}
        type="button"
        className={`inline-flex items-center justify-center p-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
          active
            ? "bg-amber-500 text-stone-900 animate-pulse shadow-md"
            : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200"
        } ${className}`}
        aria-label={buttonText}
        title={buttonText}
      >
        {active ? <VolumeX className="w-5 h-5 text-amber-950" /> : <Volume2 className="w-5 h-5" />}
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      type="button"
      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full font-medium text-base transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 min-h-[48px] ${
        active
          ? "bg-amber-400 text-amber-950 font-semibold ring-2 ring-amber-600 animate-pulse"
          : "bg-emerald-100 text-emerald-900 hover:bg-emerald-200 border border-emerald-300"
      } ${className}`}
      aria-pressed={active}
    >
      {active ? (
        <>
          <VolumeX className="w-5 h-5 text-amber-950 flex-shrink-0" />
          <span>{t("voice.stop_speaking", "Stop")}</span>
          <span className="flex gap-0.5 items-end h-4 ml-1">
            <span className="w-1 bg-amber-950 h-2 animate-bounce" />
            <span className="w-1 bg-amber-950 h-4 animate-bounce delay-75" />
            <span className="w-1 bg-amber-950 h-3 animate-bounce delay-150" />
          </span>
        </>
      ) : (
        <>
          <Volume2 className="w-5 h-5 text-emerald-800 flex-shrink-0" />
          <span>{buttonText}</span>
        </>
      )}
    </button>
  );
};
