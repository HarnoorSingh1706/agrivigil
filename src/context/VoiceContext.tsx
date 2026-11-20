"use client";

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { useLanguage, Language } from "./LanguageContext";
import { useRouter } from "next/navigation";

interface VoiceContextType {
  // Text-To-Speech (Listen aloud)
  speak: (text: string) => void;
  stopSpeaking: () => void;
  isSpeaking: boolean;
  currentlySpeakingId: string | null;
  setCurrentlySpeakingId: (id: string | null) => void;

  // Speech-To-Text (Voice input)
  isListening: boolean;
  transcript: string;
  setTranscript: (text: string) => void;
  startListening: (options?: {
    fieldId?: string;
    onTextCaptured?: (text: string) => void;
    autoInsert?: boolean;
  }) => void;
  stopListening: () => void;
  isVoiceSupported: boolean;
  hasPermissionDenied: boolean;
  isPunjabiFallback: boolean;
  isModalOpen: boolean;
  openVoiceModal: () => void;
  closeVoiceModal: () => void;
  insertTranscriptToField: () => void;
  activeFieldId: string | null;
  statusMessage: string | null;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export const VoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language, t } = useLanguage();
  const router = useRouter();

  // TTS State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<string | null>(null);

  // STT State
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isVoiceSupported, setIsVoiceSupported] = useState(true);
  const [hasPermissionDenied, setHasPermissionDenied] = useState(false);
  const [isPunjabiFallback, setIsPunjabiFallback] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const onTextCapturedCallbackRef = useRef<((text: string) => void) | null>(null);

  // Initialize Speech Support
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRec) {
        setIsVoiceSupported(false);
      }
    }
  }, []);

  // Text to Speech
  const speak = useCallback(
    (text: string) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) {
        return;
      }

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95; // slightly slower for better farmer comprehension
      utterance.pitch = 1.0;

      // Select voice based on current language
      const voices = window.speechSynthesis.getVoices();
      const langCode = language === "hi" ? "hi-IN" : language === "pa" ? "pa-IN" : "en-IN";
      utterance.lang = langCode;

      const matchingVoice = voices.find((v) => v.lang.toLowerCase().includes(langCode.toLowerCase()));
      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setCurrentlySpeakingId(null);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        setCurrentlySpeakingId(null);
      };

      window.speechSynthesis.speak(utterance);
    },
    [language]
  );

  const stopSpeaking = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentlySpeakingId(null);
    }
  }, []);

  // Speech Recognition Navigation Helper
  const handleVoiceNavigation = (phrase: string): boolean => {
    const text = phrase.toLowerCase().trim();
    if (text.includes("home") || text.includes("होम") || text.includes("ਹੋਮ") || text.includes("main")) {
      router.push("/");
      return true;
    }
    if (text.includes("how it works") || text.includes("काम कैसे") || text.includes("ਕੰਮ ਕਿਵੇਂ") || text.includes("technology")) {
      router.push("/how-it-works");
      return true;
    }
    if (text.includes("benefit") || text.includes("फायदे") || text.includes("ਲਾਭ")) {
      router.push("/benefits");
      return true;
    }
    if (text.includes("roadmap") || text.includes("प्रगति") || text.includes("ਤਰੱਕੀ") || text.includes("stage")) {
      router.push("/roadmap");
      return true;
    }
    if (text.includes("pilot") || text.includes("पायलट") || text.includes("ਪਾਇਲਟ") || text.includes("join") || text.includes("form")) {
      router.push("/pilot");
      return true;
    }
    if (text.includes("about") || text.includes("हमारे बारे") || text.includes("ਸਾਡੇ ਬਾਰੇ") || text.includes("team")) {
      router.push("/about");
      return true;
    }
    if (text.includes("contact") || text.includes("संपर्क") || text.includes("ਸੰਪਰਕ") || text.includes("phone") || text.includes("call")) {
      router.push("/contact");
      return true;
    }
    if (text.includes("faq") || text.includes("सवाल") || text.includes("ਸਵਾਲ") || text.includes("question")) {
      router.push("/faq");
      return true;
    }
    return false;
  };

  // Start Speech to Text
  const startListening = useCallback(
    (options?: {
      fieldId?: string;
      onTextCaptured?: (text: string) => void;
      autoInsert?: boolean;
    }) => {
      if (typeof window === "undefined") return;

      const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRec) {
        setIsVoiceSupported(false);
        return;
      }

      stopSpeaking();

      if (options?.fieldId) {
        setActiveFieldId(options.fieldId);
      } else {
        setActiveFieldId(null);
      }

      if (options?.onTextCaptured) {
        onTextCapturedCallbackRef.current = options.onTextCaptured;
      } else {
        onTextCapturedCallbackRef.current = null;
      }

      setTranscript("");
      setStatusMessage(null);
      setIsModalOpen(true);

      const recognition = new SpeechRec();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = true;

      // Punjabi browser support fallback
      let recLang = "en-IN";
      if (language === "hi") {
        recLang = "hi-IN";
        setIsPunjabiFallback(false);
      } else if (language === "pa") {
        // Many mobile browsers lack pa-IN, try pa-IN first or fallback
        recLang = "pa-IN";
      }

      recognition.lang = recLang;

      recognition.onstart = () => {
        setIsListening(true);
        setHasPermissionDenied(false);
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        if (event.error === "not-allowed" || event.error === "permission-denied") {
          setHasPermissionDenied(true);
        } else if (language === "pa" && (event.error === "language-not-supported" || event.error === "no-speech")) {
          // Fallback to hi-IN
          setIsPunjabiFallback(true);
          try {
            recognition.lang = "hi-IN";
            recognition.start();
            return;
          } catch (e) {
            // ignore
          }
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      try {
        recognition.start();
      } catch (err) {
        console.error("Could not start recognition:", err);
        setIsListening(false);
      }
    },
    [language, stopSpeaking]
  );

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
    setIsListening(false);
  }, []);

  const openVoiceModal = () => {
    startListening();
  };

  const closeVoiceModal = () => {
    stopListening();
    setIsModalOpen(false);
    setStatusMessage(null);
  };

  const insertTranscriptToField = () => {
    if (!transcript) return;

    // Check if it's a voice navigation command
    const navigated = handleVoiceNavigation(transcript);
    if (navigated) {
      closeVoiceModal();
      return;
    }

    // Insert into field if available
    if (onTextCapturedCallbackRef.current) {
      onTextCapturedCallbackRef.current(transcript);
    } else if (activeFieldId) {
      const el = document.getElementById(activeFieldId) as HTMLInputElement | HTMLTextAreaElement;
      if (el) {
        el.value = (el.value ? el.value + " " : "") + transcript;
        el.dispatchEvent(new Event("input", { bubbles: true }));
      }
    }

    closeVoiceModal();
  };

  return (
    <VoiceContext.Provider
      value={{
        speak,
        stopSpeaking,
        isSpeaking,
        currentlySpeakingId,
        setCurrentlySpeakingId,
        isListening,
        transcript,
        setTranscript,
        startListening,
        stopListening,
        isVoiceSupported,
        hasPermissionDenied,
        isPunjabiFallback,
        isModalOpen,
        openVoiceModal,
        closeVoiceModal,
        insertTranscriptToField,
        activeFieldId,
        statusMessage,
      }}
    >
      {children}
    </VoiceContext.Provider>
  );
};

export const useVoice = (): VoiceContextType => {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error("useVoice must be used within a VoiceProvider");
  }
  return context;
};
