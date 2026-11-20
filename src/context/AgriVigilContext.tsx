"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import {
  PlantationZone,
  SensorNode,
  PestDetection,
  SystemAlert,
  ThresholdSettings,
  ZoneId,
  ToastMessage,
  VerificationStatus,
  PestCategory,
  ActivitySeverity,
  SpectrogramPoint,
} from "@/types/agrivigil";
import {
  INITIAL_ZONES,
  INITIAL_NODES,
  INITIAL_DETECTIONS,
  INITIAL_ALERTS,
  INITIAL_THRESHOLDS,
} from "@/data/seedData";

import { dashboardTranslations, Language } from "@/locales/dashboardTranslations";

interface AgriVigilContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
  plantationName: string;
  setPlantationName: (name: string) => void;
  selectedFarm: string;
  setSelectedFarm: (farm: string) => void;
  zones: PlantationZone[];
  selectedZoneId: ZoneId | 'all';
  setSelectedZoneId: (zoneId: ZoneId | 'all') => void;
  nodes: SensorNode[];
  detections: PestDetection[];
  alerts: SystemAlert[];
  thresholds: ThresholdSettings;
  selectedDetection: PestDetection | null;
  setSelectedDetection: (detection: PestDetection | null) => void;
  toasts: ToastMessage[];
  dismissToast: (id: string) => void;
  addToast: (title: string, description: string, type?: ToastMessage['type']) => void;
  simulateDetection: (customZone?: ZoneId) => PestDetection;
  acknowledgeAlert: (alertId: string) => void;
  resolveAlert: (alertId: string) => void;
  updateDetectionVerification: (detectionId: string, status: VerificationStatus, scoutNotes?: string) => void;
  updateNode: (updatedNode: Partial<SensorNode> & { id: string }) => void;
  updateThresholds: (newThresholds: ThresholdSettings) => void;
  resetDemoData: () => void;
  activeAlertCount: number;
  onlineNodeCount: number;
  offlineNodeCount: number;
}

const AgriVigilContext = createContext<AgriVigilContextType | undefined>(undefined);

const STORAGE_KEYS = {
  LANG: 'agrivigil_lang',
  ESTATE: 'agrivigil_estate_name',
  FARM: 'agrivigil_farm_name',
  ZONES: 'agrivigil_zones_v1',
  NODES: 'agrivigil_nodes_v1',
  DETECTIONS: 'agrivigil_detections_v1',
  ALERTS: 'agrivigil_alerts_v1',
  THRESHOLDS: 'agrivigil_thresholds_v1',
};

export const AgriVigilProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [plantationName, setPlantationNameState] = useState<string>("Sundarban Palm & Agro-Estate");
  const [selectedFarm, setSelectedFarmState] = useState<string>("Block 4 - High-Density Precision Canopy");

  const [language, setLanguageState] = useState<Language>("en");
  const [zones, setZones] = useState<PlantationZone[]>(INITIAL_ZONES);
  const [nodes, setNodes] = useState<SensorNode[]>(INITIAL_NODES);
  const [detections, setDetections] = useState<PestDetection[]>(INITIAL_DETECTIONS);
  const [alerts, setAlerts] = useState<SystemAlert[]>(INITIAL_ALERTS);
  const [thresholds, setThresholds] = useState<ThresholdSettings>(INITIAL_THRESHOLDS);
  const [selectedZoneId, setSelectedZoneId] = useState<ZoneId | 'all'>('all');
  const [selectedDetection, setSelectedDetection] = useState<PestDetection | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const setPlantationName = useCallback((name: string) => {
    setPlantationNameState(name);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEYS.ESTATE, name);
      } catch (e) {}
    }
  }, []);

  const setSelectedFarm = useCallback((farm: string) => {
    setSelectedFarmState(farm);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEYS.FARM, farm);
      } catch (e) {}
    }
  }, []);

  // Set and persist language
  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEYS.LANG, lang);
        document.documentElement.lang = lang;
      } catch (e) {
        console.warn("Failed to store language:", e);
      }
    }
  }, []);

  // Translation lookup
  const t = useCallback((key: string, fallback?: string): string => {
    const dict = dashboardTranslations[language] || dashboardTranslations.en;
    return dict[key] || fallback || key;
  }, [language]);

  // Load persisted state from localStorage on client mount
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const savedLang = localStorage.getItem(STORAGE_KEYS.LANG) as Language | null;
        if (savedLang && (savedLang === "en" || savedLang === "hi")) {
          setLanguageState(savedLang);
          document.documentElement.lang = savedLang;
        }

        const savedEstate = localStorage.getItem(STORAGE_KEYS.ESTATE);
        if (savedEstate) setPlantationNameState(savedEstate);

        const savedFarm = localStorage.getItem(STORAGE_KEYS.FARM);
        if (savedFarm) setSelectedFarmState(savedFarm);

        const savedZones = localStorage.getItem(STORAGE_KEYS.ZONES);
        const savedNodes = localStorage.getItem(STORAGE_KEYS.NODES);
        const savedDetections = localStorage.getItem(STORAGE_KEYS.DETECTIONS);
        const savedAlerts = localStorage.getItem(STORAGE_KEYS.ALERTS);
        const savedThresholds = localStorage.getItem(STORAGE_KEYS.THRESHOLDS);

        if (savedZones) setZones(JSON.parse(savedZones));
        if (savedNodes) setNodes(JSON.parse(savedNodes));
        if (savedDetections) setDetections(JSON.parse(savedDetections));
        if (savedAlerts) setAlerts(JSON.parse(savedAlerts));
        if (savedThresholds) setThresholds(JSON.parse(savedThresholds));
      }
    } catch (e) {
      console.warn("Failed to read AgriVigil state from localStorage:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save changes to localStorage after initial load
  useEffect(() => {
    if (!isLoaded || typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.ZONES, JSON.stringify(zones));
      localStorage.setItem(STORAGE_KEYS.NODES, JSON.stringify(nodes));
      localStorage.setItem(STORAGE_KEYS.DETECTIONS, JSON.stringify(detections));
      localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
      localStorage.setItem(STORAGE_KEYS.THRESHOLDS, JSON.stringify(thresholds));
    } catch (e) {
      console.warn("Failed to persist AgriVigil state:", e);
    }
  }, [zones, nodes, detections, alerts, thresholds, isLoaded]);

  const addToast = useCallback((title: string, description: string, type: ToastMessage['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastMessage = {
      id,
      title,
      description,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setToasts((prev) => [newToast, ...prev].slice(0, 4));

    // Auto dismiss after 6 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 6000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Simulation Action: Ingests a new mock acoustic detection
  const simulateDetection = useCallback((customZone?: ZoneId): PestDetection => {
    const targetZoneId: ZoneId = customZone || (selectedZoneId !== 'all' ? selectedZoneId : (['zone-a', 'zone-b', 'zone-c'][Math.floor(Math.random() * 3)] as ZoneId));
    const zoneObj = zones.find((z) => z.id === targetZoneId) || zones[0];
    const nodeObj = nodes.find((n) => n.zoneId === targetZoneId) || nodes[0];

    const pestOptions: Array<{
      category: PestCategory;
      label: string;
      confidence: number;
      severity: ActivitySeverity;
      freq: number;
      bandwidth: string;
      action: string;
    }> = [
      {
        category: 'target_a',
        label: 'Target Pest A (Red Palm Weevil - Rhynchophorus ferrugineus)',
        confidence: 91,
        severity: 'Critical',
        freq: 2.8,
        bandwidth: '1.9 - 3.7 kHz',
        action: 'Dispatch field scout to inspect palm crowns and trunk fissure margins within a 15m radius of the node. Verify frass signs prior to chemical application.',
      },
      {
        category: 'target_b',
        label: 'Target Pest B (Rhinoceros Beetle - Oryctes rhinoceros)',
        confidence: 82,
        severity: 'Moderate',
        freq: 1.4,
        bandwidth: '0.8 - 2.2 kHz',
        action: 'Inspect central upright spears for characteristic wedge cut marks. Check and replenish pheromone bucket traps in perimeter rows.',
      },
      {
        category: 'unknown',
        label: 'Unknown insect activity / Ambient bio-acoustic resonance',
        confidence: 68,
        severity: 'Low',
        freq: 4.8,
        bandwidth: '3.6 - 6.2 kHz',
        action: 'Log as ambient biological noise. Continue acoustic monitoring; no physical plant intervention required.',
      },
    ];

    const selectedOption = pestOptions[Math.floor(Math.random() * pestOptions.length)];
    const now = new Date();
    const timeFormatted = now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }) + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Slight temperature and humidity perturbation
    const tempReading = Math.round((28.5 + (Math.random() * 4.0)) * 10) / 10;
    const humidReading = Math.round(60 + Math.random() * 25);

    // Dynamic mock spectrogram data points
    const specPoints: SpectrogramPoint[] = [
      { timeSlice: '0.0s', freqLow: Math.round(15 + Math.random() * 15), freqMid: Math.round(25 + Math.random() * 20), freqHigh: Math.round(15 + Math.random() * 10), intensity: 45 },
      { timeSlice: '0.8s', freqLow: Math.round(25 + Math.random() * 20), freqMid: Math.round(70 + Math.random() * 25), freqHigh: Math.round(40 + Math.random() * 30), intensity: 85 },
      { timeSlice: '1.6s', freqLow: Math.round(30 + Math.random() * 25), freqMid: Math.round(80 + Math.random() * 18), freqHigh: Math.round(55 + Math.random() * 35), intensity: 94 },
      { timeSlice: '2.4s', freqLow: Math.round(20 + Math.random() * 15), freqMid: Math.round(60 + Math.random() * 20), freqHigh: Math.round(35 + Math.random() * 20), intensity: 65 },
      { timeSlice: '3.2s', freqLow: Math.round(28 + Math.random() * 20), freqMid: Math.round(75 + Math.random() * 20), freqHigh: Math.round(45 + Math.random() * 25), intensity: 88 },
      { timeSlice: '4.0s', freqLow: Math.round(18 + Math.random() * 10), freqMid: Math.round(45 + Math.random() * 15), freqHigh: Math.round(25 + Math.random() * 15), intensity: 48 },
    ];

    const newDetectionId = `DET-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newDetection: PestDetection = {
      id: newDetectionId,
      timestamp: timeFormatted,
      isoDate: now.toISOString(),
      zoneId: targetZoneId,
      zoneName: zoneObj.name,
      nodeId: nodeObj.id,
      pestLabel: selectedOption.label,
      pestCategory: selectedOption.category,
      modelConfidence: selectedOption.confidence,
      activitySeverity: selectedOption.severity,
      verificationStatus: 'Unverified',
      acousticSummary: {
        dominantFrequencyKhz: selectedOption.freq,
        bandwidthKhz: selectedOption.bandwidth,
        pulseRatePerSec: Math.round((8 + Math.random() * 10) * 10) / 10,
        peakEnergyDb: Math.round((-48 + Math.random() * 10) * 10) / 10,
        stridulationPattern: selectedOption.category === 'unknown'
          ? 'Broadband acoustic signature without dominant single-pest rhythmic cadence'
          : `Acoustic signature with high harmonic correlation in the ${selectedOption.bandwidth} range`,
        durationSeconds: 4.2,
      },
      spectrogramPoints: specPoints,
      envAtDetection: {
        temperatureC: tempReading,
        relativeHumidityPct: humidReading,
      },
      recommendedAction: selectedOption.action,
      scientificDisclaimer: 'Demonstration AI acoustic prediction for simulated trial demonstration. Does not constitute guaranteed species taxonomy.',
    };

    // Update Detections list
    setDetections((prev) => [newDetection, ...prev]);

    // Update Zone live stats
    setZones((prevZones) =>
      prevZones.map((z) => {
        if (z.id === targetZoneId) {
          const requiresInspect =
            selectedOption.severity === 'Critical' ||
            selectedOption.confidence >= thresholds.autoFlagInspectionThreshold;
          return {
            ...z,
            currentTemp: tempReading,
            currentHumidity: humidReading,
            pestActivityLevel: selectedOption.severity,
            lastDetection: `${selectedOption.category === 'target_a' ? 'Target Pest A' : selectedOption.category === 'target_b' ? 'Target Pest B' : 'Unknown insect'} (Just now)`,
            status: selectedOption.severity === 'Critical' ? 'alert' : selectedOption.severity === 'High' ? 'alert' : selectedOption.severity === 'Moderate' ? 'warning' : 'optimal',
            inspectionRequired: requiresInspect ? true : z.inspectionRequired,
            inspectionReason: requiresInspect
              ? `Real-time detection: ${selectedOption.label} (${selectedOption.confidence}% confidence). Ground-truth inspection advised.`
              : z.inspectionReason,
          };
        }
        return z;
      })
    );

    // Generate Alert if high severity or confidence exceeds threshold
    if (selectedOption.confidence >= thresholds.confidenceAlertThreshold || selectedOption.severity === 'Critical' || selectedOption.severity === 'High') {
      const alertId = `ALT-${now.getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
      const newAlert: SystemAlert = {
        id: alertId,
        timestamp: timeFormatted,
        severity: selectedOption.severity === 'Critical' ? 'critical' : 'warning',
        zoneId: targetZoneId,
        zoneName: zoneObj.name,
        nodeId: nodeObj.id,
        title: `Simulated Alert: ${selectedOption.label.split('(')[0].trim()} Detected`,
        cause: `Acoustic classifier matched signature with ${selectedOption.confidence}% confidence at node ${nodeObj.id}. Temp: ${tempReading}°C, RH: ${humidReading}%.`,
        recommendedAction: selectedOption.action,
        status: 'active',
      };

      setAlerts((prev) => [newAlert, ...prev]);

      addToast(
        `🚨 New ${newAlert.severity.toUpperCase()} Alert`,
        `${selectedOption.label.split('(')[0].trim()} detected in ${zoneObj.code} (${selectedOption.confidence}% mock confidence).`,
        newAlert.severity === 'critical' ? 'alert' : 'warning'
      );
    } else {
      addToast(
        `📡 Acoustic Event Recorded`,
        `${selectedOption.label.split('(')[0].trim()} logged in ${zoneObj.code}. Ambient conditions normal.`,
        'info'
      );
    }

    return newDetection;
  }, [selectedZoneId, zones, nodes, thresholds, addToast]);

  const acknowledgeAlert = useCallback((alertId: string) => {
    const timeFormatted = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'acknowledged', acknowledgedAt: timeFormatted } : a))
    );
    addToast('Alert Acknowledged', `Alert ${alertId} has been acknowledged by operator.`, 'info');
  }, [addToast]);

  const resolveAlert = useCallback((alertId: string) => {
    const timeFormatted = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'resolved', resolvedAt: timeFormatted } : a))
    );
    addToast('Alert Resolved', `Alert ${alertId} marked as resolved following scout inspection.`, 'success');
  }, [addToast]);

  const updateDetectionVerification = useCallback((detectionId: string, status: VerificationStatus, scoutNotes?: string) => {
    setDetections((prev) =>
      prev.map((d) =>
        d.id === detectionId
          ? { ...d, verificationStatus: status, scoutNotes: scoutNotes !== undefined ? scoutNotes : d.scoutNotes }
          : d
      )
    );
    if (selectedDetection && selectedDetection.id === detectionId) {
      setSelectedDetection((prev) =>
        prev ? { ...prev, verificationStatus: status, scoutNotes: scoutNotes !== undefined ? scoutNotes : prev.scoutNotes } : null
      );
    }
    addToast('Verification Updated', `Detection ${detectionId} set to "${status}".`, 'success');
  }, [selectedDetection, addToast]);

  const updateNode = useCallback((updatedNode: Partial<SensorNode> & { id: string }) => {
    setNodes((prev) =>
      prev.map((n) => (n.id === updatedNode.id ? { ...n, ...updatedNode } : n))
    );
    addToast('Device Updated', `Sensor node ${updatedNode.id} configuration saved.`, 'success');
  }, [addToast]);

  const updateThresholds = useCallback((newThresholds: ThresholdSettings) => {
    setThresholds(newThresholds);
    addToast('Thresholds Saved', 'Microclimate and acoustic alert thresholds updated.', 'success');
  }, [addToast]);

  const resetDemoData = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.ZONES);
      localStorage.removeItem(STORAGE_KEYS.NODES);
      localStorage.removeItem(STORAGE_KEYS.DETECTIONS);
      localStorage.removeItem(STORAGE_KEYS.ALERTS);
      localStorage.removeItem(STORAGE_KEYS.THRESHOLDS);
    }
    setZones(INITIAL_ZONES);
    setNodes(INITIAL_NODES);
    setDetections(INITIAL_DETECTIONS);
    setAlerts(INITIAL_ALERTS);
    setThresholds(INITIAL_THRESHOLDS);
    setSelectedZoneId('all');
    setSelectedDetection(null);
    addToast('Demo State Reset', 'Initial simulated telemetry and demo records restored.', 'info');
  }, [addToast]);

  const activeAlertCount = alerts.filter((a) => a.status === 'active').length;
  const onlineNodeCount = nodes.filter((n) => n.status === 'online').length;
  const offlineNodeCount = nodes.filter((n) => n.status === 'offline').length;

  return (
    <AgriVigilContext.Provider
      value={{
        language,
        setLanguage,
        t,
        plantationName,
        setPlantationName,
        selectedFarm,
        setSelectedFarm,
        zones,
        selectedZoneId,
        setSelectedZoneId,
        nodes,
        detections,
        alerts,
        thresholds,
        selectedDetection,
        setSelectedDetection,
        toasts,
        dismissToast,
        addToast,
        simulateDetection,
        acknowledgeAlert,
        resolveAlert,
        updateDetectionVerification,
        updateNode,
        updateThresholds,
        resetDemoData,
        activeAlertCount,
        onlineNodeCount,
        offlineNodeCount,
      }}
    >
      {children}
    </AgriVigilContext.Provider>
  );
};

export const useAgriVigil = () => {
  const context = useContext(AgriVigilContext);
  if (!context) {
    throw new Error("useAgriVigil must be used within an AgriVigilProvider");
  }
  return context;
};
