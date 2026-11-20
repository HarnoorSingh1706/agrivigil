export type ZoneId = 'zone-a' | 'zone-b' | 'zone-c';

export type PestCategory = 'target_a' | 'target_b' | 'unknown';

export type ActivitySeverity = 'Low' | 'Moderate' | 'High' | 'Critical';

export type VerificationStatus = 'Unverified' | 'Field Verified' | 'False Positive';

export type AlertSeverity = 'critical' | 'warning' | 'info';

export type AlertStatus = 'active' | 'acknowledged' | 'resolved';

export interface PlantationZone {
  id: ZoneId;
  name: string;
  code: string; // e.g. "Zone A"
  areaHectares: number;
  cropType: string;
  primaryNodeId: string;
  status: 'optimal' | 'warning' | 'alert';
  inspectionRequired: boolean;
  inspectionReason?: string;
  currentTemp: number;
  currentHumidity: number;
  pestActivityLevel: ActivitySeverity;
  lastDetection: string;
  gridCoords: { row: number; col: number };
}

export interface SensorNode {
  id: string; // e.g. "NODE-001"
  name: string;
  zoneId: ZoneId;
  status: 'online' | 'offline' | 'degraded';
  lastSeen: string;
  batteryPercent: number;
  signalDbm: number;
  sensors: string[];
  firmwareVersion: string;
  samplingIntervalMinutes: number;
}

export interface AcousticSummary {
  dominantFrequencyKhz: number;
  bandwidthKhz: string;
  pulseRatePerSec: number;
  peakEnergyDb: number;
  stridulationPattern: string;
  durationSeconds: number;
}

export interface SpectrogramPoint {
  timeSlice: string;
  freqLow: number;
  freqMid: number;
  freqHigh: number;
  intensity: number;
}

export interface PestDetection {
  id: string;
  timestamp: string;
  isoDate: string;
  zoneId: ZoneId;
  zoneName: string;
  nodeId: string;
  pestLabel: string;
  pestCategory: PestCategory;
  modelConfidence: number; // e.g. 82 (mock output)
  activitySeverity: ActivitySeverity;
  verificationStatus: VerificationStatus;
  scoutNotes?: string;
  acousticSummary: AcousticSummary;
  spectrogramPoints: SpectrogramPoint[];
  envAtDetection: {
    temperatureC: number;
    relativeHumidityPct: number;
  };
  recommendedAction: string;
  scientificDisclaimer: string;
}

export interface EnvironmentReading {
  timestamp: string;
  dateKey: string; // YYYY-MM-DD
  timeLabel: string; // HH:00
  zoneId: ZoneId;
  temperatureC: number;
  relativeHumidityPct: number;
  isSimulated: boolean;
}

export interface SystemAlert {
  id: string;
  timestamp: string;
  severity: AlertSeverity;
  zoneId: ZoneId;
  zoneName: string;
  nodeId: string;
  title: string;
  cause: string;
  recommendedAction: string;
  status: AlertStatus;
  acknowledgedAt?: string;
  resolvedAt?: string;
}

export interface ThresholdSettings {
  tempMaxC: number;
  tempMinC: number;
  humidityMaxPct: number;
  humidityMinPct: number;
  confidenceAlertThreshold: number;
  autoFlagInspectionThreshold: number;
}

export interface ToastMessage {
  id: string;
  title: string;
  description: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  timestamp: string;
}
