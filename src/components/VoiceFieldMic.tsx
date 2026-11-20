"use client";

import React from "react";
import { Mic } from "lucide-react";
import { useVoice } from "../context/VoiceContext";

interface VoiceFieldMicProps {
  fieldId: string;
  fieldName?: string;
  onTextCaptured?: (text: string) => void;
  className?: string;
}

export const VoiceFieldMic: React.FC<VoiceFieldMicProps> = ({
  fieldId,
  fieldName,
  onTextCaptured,
  className = "",
}) => {
  const { startListening, isListening, activeFieldId } = useVoice();

  const isCurrentField = isListening && activeFieldId === fieldId;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    startListening({
      fieldId,
      onTextCaptured,
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Speak to fill ${fieldName || fieldId}`}
      title={`Speak to fill ${fieldName || fieldId}`}
      className={`p-2.5 rounded-lg border transition-all flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-emerald-600 min-h-[48px] min-w-[48px] ${
        isCurrentField
          ? "bg-amber-400 text-stone-900 border-amber-500 animate-pulse ring-2 ring-amber-400"
          : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border-emerald-300"
      } ${className}`}
    >
      <Mic className={`w-5 h-5 ${isCurrentField ? "text-stone-900 animate-bounce" : ""}`} />
    </button>
  );
};
