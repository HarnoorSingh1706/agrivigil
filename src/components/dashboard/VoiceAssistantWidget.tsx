"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAgriVigil } from "@/context/AgriVigilContext";
import { useRouter } from "next/navigation";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  X,
  Play,
  RotateCcw,
  Zap,
} from "lucide-react";

interface SpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

export const VoiceAssistantWidget: React.FC = () => {
  const { language, setLanguage, zones, detections, alerts, simulateDetection, addToast, t } =
    useAgriVigil();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [assistantReply, setAssistantReply] = useState("");
  const [supported, setSupported] = useState(true);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check Web Speech Recognition support
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = language === "hi" ? "hi-IN" : "en-US";

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          const text = event.results[0][0].transcript;
          setTranscript(text);
          setIsListening(false);
          handleVoiceCommand(text);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } else {
        setSupported(false);
      }
    }
  }, [language]);

  // Text to Speech synthesis helper
  const speakText = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === "hi" ? "hi-IN" : "en-US";
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleListening = () => {
    stopSpeaking();
    if (!recognitionRef.current) {
      addToast(
        "Voice Assistant",
        "Microphone recognition is not supported in this browser.",
        "warning"
      );
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript("");
      try {
        recognitionRef.current.lang = language === "hi" ? "hi-IN" : "en-US";
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        setIsListening(false);
      }
    }
  };

  // Natural Language Command Interpreter
  const handleVoiceCommand = (rawText: string) => {
    const text = rawText.toLowerCase().trim();
    let reply = "";

    // 1. Language switching
    if (text.includes("hindi") || text.includes("हिन्दी") || text.includes("हिंदी")) {
      setLanguage("hi");
      reply = "भाषा बदलकर हिन्दी कर दी गई है। आप बागान की स्थिति या अलर्ट पूछ सकते हैं।";
      setAssistantReply(reply);
      speakText(reply);
      return;
    } else if (text.includes("english") || text.includes("अंग्रेजी")) {
      setLanguage("en");
      reply = "Switched interface to English. How can I assist you with the plantation?";
      setAssistantReply(reply);
      speakText(reply);
      return;
    }

    // 2. Navigation commands
    if (text.includes("map") || text.includes("zone") || text.includes("मानचित्र") || text.includes("ज़ोन") || text.includes("नक्शा")) {
      router.push("/dashboard/zones");
      reply = language === "hi" 
        ? "बागान ज़ोन मानचित्र खोला जा रहा है। ज़ोन A, B और C की निगरानी उपलब्ध है।"
        : "Navigating to Plantation Schematic Zones Map.";
    } else if (text.includes("alert") || text.includes("अलर्ट") || text.includes("चेतावनी")) {
      router.push("/dashboard/alerts");
      const activeCount = alerts.filter((a) => a.status === "active").length;
      reply = language === "hi"
        ? `अलर्ट डेस्क खोला गया। वर्तमान में ${activeCount} सक्रिय अलर्ट कार्रवाई की प्रतीक्षा में हैं।`
        : `Opening Alerts Desk. There are currently ${activeCount} active incidents requiring attention.`;
    } else if (text.includes("pest") || text.includes("detection") || text.includes("कीट") || text.includes("पहचान")) {
      router.push("/dashboard/detections");
      reply = language === "hi"
        ? "कीट ध्वनिक पहचान पंजी खोली गई है। नवीनतम बोरिंग स्पेक्ट्रोग्राम उपलब्ध हैं।"
        : "Opening Pest Detections Registry with acoustic spectrograms.";
    } else if (text.includes("climate") || text.includes("temperature") || text.includes("humidity") || text.includes("मौसम") || text.includes("तापमान") || text.includes("नमी")) {
      router.push("/dashboard/environment");
      reply = language === "hi"
        ? "सूक्ष्म जलवायु और तापमान आर्द्रता टेलीमेट्री खोली गई है।"
        : "Opening Plantation Microclimate Telemetry.";
    } else if (text.includes("report") || text.includes("csv") || text.includes("रिपोर्ट")) {
      router.push("/dashboard/reports");
      reply = language === "hi"
        ? "इतिहास और रिपोर्ट पृष्ठ खोला गया। आप CSV डाउनलोड कर सकते हैं।"
        : "Opening Historical Bio-Acoustic Scouting Reports.";
    } else if (text.includes("dashboard") || text.includes("home") || text.includes("डैशबोर्ड") || text.includes("मुख्य")) {
      router.push("/dashboard");
      reply = language === "hi"
        ? "एग्रीविजिल मुख्य डैशबोर्ड पर वापस आ गए हैं।"
        : "Returned to AgriVigil Main Overview Dashboard.";
    } else if (text.includes("simulate") || text.includes("test") || text.includes("सिमुलेट") || text.includes("परीक्षण") || text.includes("कीट घटना")) {
      simulateDetection();
      reply = language === "hi"
        ? "एक नई कीट ध्वनिक घटना सिमुलेट की गई है और अलर्ट दर्ज किया गया है।"
        : "Simulated a new acoustic pest detection event in the canopy.";
    } else if (text.includes("status") || text.includes("स्थिति") || text.includes("हालत") || text.includes("update")) {
      const activeCount = alerts.filter((a) => a.status === "active").length;
      const zoneB = zones.find((z) => z.id === "zone-b");
      reply = language === "hi"
        ? `बागान की स्थिति: 3 ज़ोन सक्रिय हैं। ज़ोन B में ${zoneB?.pestActivityLevel || 'मध्यम'} कीट गतिविधि है और ${activeCount} अलर्ट दर्ज हैं।`
        : `Estate status: 3 zones monitored. Zone B shows elevated pest activity with ${activeCount} active alerts. Scout inspection is recommended.`;
    } else {
      reply = language === "hi"
        ? `मैंने सुना: "${rawText}". आप कह सकते हैं: 'अलर्ट दिखाओ', 'नक्शा खोलो', 'कीट सिमुलेट करो', या 'स्थिति बताओ'।`
        : `Heard: "${rawText}". You can say: 'Show alerts', 'Open map', 'Simulate pest', or 'Field status'.`;
    }

    setAssistantReply(reply);
    speakText(reply);
  };

  // Quick prompt buttons
  const samplePrompts =
    language === "hi"
      ? [
          "बागान की स्थिति बताओ",
          "अलर्ट दिखाओ",
          "कीट घटना सिमुलेट करो",
          "ज़ोन नक्शा खोलो",
          "Switch to English",
        ]
      : [
          "Plantation status",
          "Show active alerts",
          "Simulate pest event",
          "Open zones map",
          "हिन्दी में बदलो",
        ];

  return (
    <>
      {/* Floating Trigger Pill */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
        {!isOpen && (
          <button
            onClick={() => {
              setIsOpen(true);
              if (!assistantReply) {
                const greeting =
                  language === "hi"
                    ? "नमस्ते, मैं एग्रीविजिल वॉयस असिस्टेंट हूँ। आप बोलकर अलर्ट, ज़ोन या कीट स्थिति जान सकते हैं।"
                    : "Hello, I am your AgriVigil Voice Assistant. Speak or click to inspect alerts, map, or status.";
                setAssistantReply(greeting);
                speakText(greeting);
              }
            }}
            className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-900 hover:bg-emerald-950 text-white font-semibold text-xs shadow-xl border border-emerald-700/60 transition-all hover:scale-105 active:scale-95 group"
            title="Open Voice Assistant (बोलकर पूछें)"
          >
            <div className="relative">
              <Mic className="w-4 h-4 text-emerald-300 group-hover:text-emerald-100" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <span>{language === "hi" ? "वॉयस असिस्टेंट (बोलें)" : "Voice Assistant"}</span>
          </button>
        )}
      </div>

      {/* Floating Voice Dialog Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="p-4 bg-emerald-950 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-800 flex items-center justify-center">
                <Bot className="w-4 h-4 text-emerald-300" />
              </div>
              <div>
                <h4 className="font-bold text-xs font-serif">
                  {language === "hi" ? "एग्रीविजिल ध्वनिक वॉयस असिस्टेंट" : "AgriVigil Voice Assistant"}
                </h4>
                <span className="text-[10px] text-emerald-300 font-mono">
                  {language === "hi" ? "द्विभाषी हिंदी एवं अंग्रेज़ी" : "Bilingual EN / हिन्दी Audio"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {isSpeaking && (
                <button
                  onClick={stopSpeaking}
                  className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-900"
                  title="Mute speech audio"
                >
                  <VolumeX className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => {
                  stopSpeaking();
                  setIsOpen(false);
                }}
                className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-900"
                aria-label="Close voice assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Assistant Conversation Box */}
          <div className="p-4 space-y-4 max-h-72 overflow-y-auto bg-stone-50 text-xs">
            {transcript && (
              <div className="flex justify-end">
                <div className="bg-emerald-100 text-emerald-950 px-3 py-2 rounded-xl rounded-tr-none max-w-[80%] font-medium">
                  {transcript}
                </div>
              </div>
            )}

            {assistantReply && (
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-900 text-emerald-200 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-white border border-stone-200 text-stone-800 p-3 rounded-xl rounded-tl-none shadow-xs leading-relaxed">
                  {assistantReply}
                </div>
              </div>
            )}

            {/* Quick Sample Voice Prompts */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wide">
                {language === "hi" ? "त्वरित आदेश (क्लिक करें या बोलें):" : "Suggested Commands (Tap or Speak):"}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {samplePrompts.map((cmd) => (
                  <button
                    key={cmd}
                    onClick={() => {
                      setTranscript(cmd);
                      handleVoiceCommand(cmd);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 hover:border-emerald-600 hover:text-emerald-900 text-[11px] text-stone-700 transition-colors"
                  >
                    {cmd}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Mic Action Bar */}
          <div className="p-3 bg-white border-t border-stone-200 flex items-center justify-between gap-3">
            <span className="text-[11px] text-stone-500">
              {isListening
                ? language === "hi"
                  ? "सुन रहा हूँ... बोलिए"
                  : "Listening... speak now"
                : isSpeaking
                ? language === "hi"
                  ? "बोल रहा हूँ..."
                  : "Speaking response..."
                : language === "hi"
                ? "माइक दबाकर बोलें"
                : "Tap mic and speak command"}
            </span>

            <button
              onClick={toggleListening}
              className={`p-3 rounded-full transition-all shadow-md active:scale-95 flex items-center justify-center ${
                isListening
                  ? "bg-rose-600 text-white animate-pulse ring-4 ring-rose-200"
                  : "bg-emerald-900 hover:bg-emerald-950 text-white"
              }`}
              title={isListening ? "Stop listening" : "Start speaking"}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
