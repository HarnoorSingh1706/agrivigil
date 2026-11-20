import {
  PlantationZone,
  SensorNode,
  PestDetection,
  EnvironmentReading,
  SystemAlert,
  ThresholdSettings,
  ZoneId,
} from '@/types/agrivigil';

export const INITIAL_ZONES: PlantationZone[] = [
  {
    id: 'zone-a',
    name: 'Zone A - North Palm Grove',
    code: 'Zone A',
    areaHectares: 4.2,
    cropType: 'Canary Island Date & Coconut Palm',
    primaryNodeId: 'NODE-001',
    status: 'optimal',
    inspectionRequired: false,
    currentTemp: 28.6,
    currentHumidity: 68,
    pestActivityLevel: 'Low',
    lastDetection: 'Unknown insect activity (4h ago)',
    gridCoords: { row: 1, col: 1 },
  },
  {
    id: 'zone-b',
    name: 'Zone B - Central High-Density Canopy',
    code: 'Zone B',
    areaHectares: 5.8,
    cropType: 'Areca Palm & Mixed Commercial Orchard',
    primaryNodeId: 'NODE-002',
    status: 'alert',
    inspectionRequired: true,
    inspectionReason: 'Elevated acoustic bursts matching Target Pest A boring signature. Physical scout inspection recommended.',
    currentTemp: 31.4,
    currentHumidity: 78,
    pestActivityLevel: 'High',
    lastDetection: 'Target Pest A (18m ago)',
    gridCoords: { row: 1, col: 2 },
  },
  {
    id: 'zone-c',
    name: 'Zone C - Southern Nursery & Forest Buffer',
    code: 'Zone C',
    areaHectares: 3.1,
    cropType: 'Young Palm Nursery & Shade Buffer',
    primaryNodeId: 'NODE-003',
    status: 'warning',
    inspectionRequired: true,
    inspectionReason: 'Repeated high-frequency clicks in canopy boundary. Secondary acoustic validation needed.',
    currentTemp: 29.8,
    currentHumidity: 63,
    pestActivityLevel: 'Moderate',
    lastDetection: 'Target Pest B (1h 12m ago)',
    gridCoords: { row: 2, col: 1 },
  },
];

export const INITIAL_NODES: SensorNode[] = [
  {
    id: 'NODE-001',
    name: 'Bio-Acoustic Sentry 01',
    zoneId: 'zone-a',
    status: 'online',
    lastSeen: '2 minutes ago',
    batteryPercent: 94,
    signalDbm: -64,
    sensors: ['MEMS Mic (0.1–20 kHz)', 'Sensirion SHT31 Temp/RH', 'Solar Harvester + MPPT'],
    firmwareVersion: 'v2.4.1-edge-mcu',
    samplingIntervalMinutes: 5,
  },
  {
    id: 'NODE-002',
    name: 'Trunk Stethoscope Sensor 02',
    zoneId: 'zone-b',
    status: 'online',
    lastSeen: 'Just now',
    batteryPercent: 82,
    signalDbm: -72,
    sensors: ['Piezoelectric Acoustic Resonator', 'Sensirion SHT31 Temp/RH', 'Mesh LoRa RF'],
    firmwareVersion: 'v2.4.1-edge-mcu',
    samplingIntervalMinutes: 3,
  },
  {
    id: 'NODE-003',
    name: 'Perimeter Acoustic Sentinel 03',
    zoneId: 'zone-c',
    status: 'online',
    lastSeen: '4 minutes ago',
    batteryPercent: 76,
    signalDbm: -78,
    sensors: ['Dual MEMS Mic Array', 'Sensirion SHT31 Temp/RH', 'Solar Buffer'],
    firmwareVersion: 'v2.3.9-edge-mcu',
    samplingIntervalMinutes: 5,
  },
];

export const INITIAL_THRESHOLDS: ThresholdSettings = {
  tempMaxC: 34.0,
  tempMinC: 22.0,
  humidityMaxPct: 82.0,
  humidityMinPct: 45.0,
  confidenceAlertThreshold: 75,
  autoFlagInspectionThreshold: 80,
};

// Seed Detections
export const INITIAL_DETECTIONS: PestDetection[] = [
  {
    id: 'DET-2026-1049',
    timestamp: '2026-11-16 11:32 AM',
    isoDate: '2026-11-16T11:32:00',
    zoneId: 'zone-b',
    zoneName: 'Zone B - Central High-Density Canopy',
    nodeId: 'NODE-002',
    pestLabel: 'Target Pest A (Red Palm Weevil - Rhynchophorus ferrugineus)',
    pestCategory: 'target_a',
    modelConfidence: 91,
    activitySeverity: 'High',
    verificationStatus: 'Unverified',
    scoutNotes: 'Scout dispatched to inspect crown and trunk fissures on rows 8-12.',
    acousticSummary: {
      dominantFrequencyKhz: 2.8,
      bandwidthKhz: '1.9 - 3.7 kHz',
      pulseRatePerSec: 14.2,
      peakEnergyDb: -42.6,
      stridulationPattern: 'Rhythmic rasping rasp-bursts consistent with internal trunk tissue mastication',
      durationSeconds: 4.8,
    },
    spectrogramPoints: [
      { timeSlice: '0.0s', freqLow: 18, freqMid: 35, freqHigh: 22, intensity: 48 },
      { timeSlice: '0.8s', freqLow: 25, freqMid: 88, freqHigh: 64, intensity: 86 },
      { timeSlice: '1.6s', freqLow: 30, freqMid: 94, freqHigh: 78, intensity: 92 },
      { timeSlice: '2.4s', freqLow: 22, freqMid: 65, freqHigh: 45, intensity: 62 },
      { timeSlice: '3.2s', freqLow: 28, freqMid: 91, freqHigh: 72, intensity: 89 },
      { timeSlice: '4.0s', freqLow: 20, freqMid: 54, freqHigh: 38, intensity: 52 },
      { timeSlice: '4.8s', freqLow: 15, freqMid: 28, freqHigh: 20, intensity: 30 },
    ],
    envAtDetection: {
      temperatureC: 31.4,
      relativeHumidityPct: 78,
    },
    recommendedAction: 'Physically inspect adjacent palm crowns and trunk bases within a 15m radius. Look for frass, oozing sap, or wilted central fronds. Confirm sample with qualified entomologist before chemical intervention.',
    scientificDisclaimer: 'Demonstration AI classification based on acoustic spectral matching. Acoustic signals and microclimate readings are indicative; physical ground-truth inspection is required to confirm pest presence.',
  },
  {
    id: 'DET-2026-1042',
    timestamp: '2026-11-16 10:41 AM',
    isoDate: '2026-11-16T10:41:00',
    zoneId: 'zone-c',
    zoneName: 'Zone C - Southern Nursery & Forest Buffer',
    nodeId: 'NODE-003',
    pestLabel: 'Target Pest B (Rhinoceros Beetle - Oryctes rhinoceros)',
    pestCategory: 'target_b',
    modelConfidence: 82,
    activitySeverity: 'Moderate',
    verificationStatus: 'Field Verified',
    scoutNotes: 'Verified by Agronomist R. Sharma. Physical pheromone bucket trap checked.',
    acousticSummary: {
      dominantFrequencyKhz: 1.4,
      bandwidthKhz: '0.8 - 2.2 kHz',
      pulseRatePerSec: 6.8,
      peakEnergyDb: -48.1,
      stridulationPattern: 'Low-frequency abdominal stridulation clicks occurring primarily during canopy ingress',
      durationSeconds: 3.5,
    },
    spectrogramPoints: [
      { timeSlice: '0.0s', freqLow: 35, freqMid: 24, freqHigh: 12, intensity: 40 },
      { timeSlice: '0.7s', freqLow: 78, freqMid: 55, freqHigh: 20, intensity: 75 },
      { timeSlice: '1.4s', freqLow: 84, freqMid: 62, freqHigh: 24, intensity: 81 },
      { timeSlice: '2.1s', freqLow: 62, freqMid: 40, freqHigh: 18, intensity: 58 },
      { timeSlice: '2.8s', freqLow: 79, freqMid: 58, freqHigh: 22, intensity: 76 },
      { timeSlice: '3.5s', freqLow: 32, freqMid: 20, freqHigh: 10, intensity: 34 },
    ],
    envAtDetection: {
      temperatureC: 29.8,
      relativeHumidityPct: 63,
    },
    recommendedAction: 'Inspect young nursery fronds for characteristic V-shaped clipping. Deploy or inspect pheromone aggregation traps in nursery perimeter. Avoid blanket spraying.',
    scientificDisclaimer: 'Demonstration AI classification based on acoustic spectral matching. Frequency alone does not confirm species identity.',
  },
  {
    id: 'DET-2026-1033',
    timestamp: '2026-11-16 07:15 AM',
    isoDate: '2026-11-16T07:15:00',
    zoneId: 'zone-a',
    zoneName: 'Zone A - North Palm Grove',
    nodeId: 'NODE-001',
    pestLabel: 'Unknown insect activity / Ambient bio-acoustic resonance',
    pestCategory: 'unknown',
    modelConfidence: 68,
    activitySeverity: 'Low',
    verificationStatus: 'Unverified',
    scoutNotes: 'Ambient dawn cicada and wind turbulence resonance noted.',
    acousticSummary: {
      dominantFrequencyKhz: 5.6,
      bandwidthKhz: '4.1 - 7.5 kHz',
      pulseRatePerSec: 28.4,
      peakEnergyDb: -56.3,
      stridulationPattern: 'Continuous broadband morning chorus; does not match primary pest acoustic templates',
      durationSeconds: 6.0,
    },
    spectrogramPoints: [
      { timeSlice: '0.0s', freqLow: 15, freqMid: 30, freqHigh: 55, intensity: 45 },
      { timeSlice: '1.2s', freqLow: 18, freqMid: 35, freqHigh: 68, intensity: 65 },
      { timeSlice: '2.4s', freqLow: 20, freqMid: 38, freqHigh: 72, intensity: 68 },
      { timeSlice: '3.6s', freqLow: 19, freqMid: 36, freqHigh: 70, intensity: 66 },
      { timeSlice: '4.8s', freqLow: 16, freqMid: 32, freqHigh: 64, intensity: 60 },
      { timeSlice: '6.0s', freqLow: 14, freqMid: 28, freqHigh: 50, intensity: 42 },
    ],
    envAtDetection: {
      temperatureC: 27.2,
      relativeHumidityPct: 82,
    },
    recommendedAction: 'Log as background biological noise. Re-evaluate if continuous pattern shifts towards trunk-boring frequency bands (1.5 - 3.5 kHz). No chemical or physical action required.',
    scientificDisclaimer: 'Demonstration AI classification. Classified as Uncertain/Unknown to prevent false treatment triggers.',
  },
  {
    id: 'DET-2026-1021',
    timestamp: '2026-11-15 04:30 PM',
    isoDate: '2026-11-15T16:30:00',
    zoneId: 'zone-b',
    zoneName: 'Zone B - Central High-Density Canopy',
    nodeId: 'NODE-002',
    pestLabel: 'Target Pest A (Red Palm Weevil - Rhynchophorus ferrugineus)',
    pestCategory: 'target_a',
    modelConfidence: 88,
    activitySeverity: 'High',
    verificationStatus: 'Field Verified',
    scoutNotes: 'Confirmed pupal chamber found in felled damaged frond base.',
    acousticSummary: {
      dominantFrequencyKhz: 2.7,
      bandwidthKhz: '2.0 - 3.6 kHz',
      pulseRatePerSec: 13.8,
      peakEnergyDb: -44.2,
      stridulationPattern: 'High-amplitude repetitive feeding sounds within vegetative crown sheath',
      durationSeconds: 5.2,
    },
    spectrogramPoints: [
      { timeSlice: '0.0s', freqLow: 20, freqMid: 40, freqHigh: 25, intensity: 50 },
      { timeSlice: '1.0s', freqLow: 26, freqMid: 82, freqHigh: 60, intensity: 82 },
      { timeSlice: '2.0s', freqLow: 31, freqMid: 92, freqHigh: 75, intensity: 90 },
      { timeSlice: '3.0s', freqLow: 28, freqMid: 89, freqHigh: 71, intensity: 87 },
      { timeSlice: '4.0s', freqLow: 24, freqMid: 70, freqHigh: 50, intensity: 72 },
      { timeSlice: '5.2s', freqLow: 18, freqMid: 35, freqHigh: 22, intensity: 40 },
    ],
    envAtDetection: {
      temperatureC: 32.1,
      relativeHumidityPct: 74,
    },
    recommendedAction: 'Targeted sanitation of infested frond. Mark tree GPS coordinates and quarantine immediate perimeter.',
    scientificDisclaimer: 'Demonstration AI classification based on acoustic spectral matching.',
  },
  {
    id: 'DET-2026-1010',
    timestamp: '2026-11-15 11:10 AM',
    isoDate: '2026-11-15T11:10:00',
    zoneId: 'zone-a',
    zoneName: 'Zone A - North Palm Grove',
    nodeId: 'NODE-001',
    pestLabel: 'Target Pest B (Rhinoceros Beetle - Oryctes rhinoceros)',
    pestCategory: 'target_b',
    modelConfidence: 78,
    activitySeverity: 'Moderate',
    verificationStatus: 'False Positive',
    scoutNotes: 'Scout inspection revealed windblown palm fronds scraping against node mounting arm.',
    acousticSummary: {
      dominantFrequencyKhz: 1.6,
      bandwidthKhz: '1.1 - 2.4 kHz',
      pulseRatePerSec: 4.5,
      peakEnergyDb: -52.0,
      stridulationPattern: 'Irregular friction rubbing noise caused by dry frond oscillation',
      durationSeconds: 4.0,
    },
    spectrogramPoints: [
      { timeSlice: '0.0s', freqLow: 40, freqMid: 30, freqHigh: 15, intensity: 45 },
      { timeSlice: '1.0s', freqLow: 65, freqMid: 45, freqHigh: 20, intensity: 62 },
      { timeSlice: '2.0s', freqLow: 72, freqMid: 52, freqHigh: 22, intensity: 70 },
      { timeSlice: '3.0s', freqLow: 55, freqMid: 38, freqHigh: 18, intensity: 54 },
      { timeSlice: '4.0s', freqLow: 30, freqMid: 20, freqHigh: 12, intensity: 32 },
    ],
    envAtDetection: {
      temperatureC: 28.9,
      relativeHumidityPct: 62,
    },
    recommendedAction: 'Trim loose dry foliage adjacent to NODE-001 mounting bracket to minimize mechanical microphonics.',
    scientificDisclaimer: 'Demonstration record illustrates classification sensitivity to physical mounting factors.',
  },
];

// Seed Alerts
export const INITIAL_ALERTS: SystemAlert[] = [
  {
    id: 'ALT-2026-041',
    timestamp: '2026-11-16 11:34 AM',
    severity: 'critical',
    zoneId: 'zone-b',
    zoneName: 'Zone B - Central High-Density Canopy',
    nodeId: 'NODE-002',
    title: 'Cluster Detection: Potential Target Pest A Boring Activity',
    cause: 'Sensor NODE-002 recorded 3 consecutive acoustic bursts above 85% confidence in 45 minutes.',
    recommendedAction: 'Dispatch field scout to Zone B (Rows 8-12) for physical palm crown inspection and frass verification. Do NOT apply broadcast chemical spray.',
    status: 'active',
  },
  {
    id: 'ALT-2026-039',
    timestamp: '2026-11-16 09:15 AM',
    severity: 'warning',
    zoneId: 'zone-c',
    zoneName: 'Zone C - Southern Nursery & Forest Buffer',
    nodeId: 'NODE-003',
    title: 'Moderate Insect Activity at Nursery Boundary',
    cause: 'Acoustic activity in 1.2–2.0 kHz range elevated by 40% compared to baseline ambient.',
    recommendedAction: 'Inspect nursery netting and physical pheromone lures. Review audio snippet before field team deployment.',
    status: 'acknowledged',
    acknowledgedAt: '2026-11-16 09:40 AM',
  },
  {
    id: 'ALT-2026-035',
    timestamp: '2026-11-15 02:20 PM',
    severity: 'warning',
    zoneId: 'zone-b',
    zoneName: 'Zone B - Central High-Density Canopy',
    nodeId: 'NODE-002',
    title: 'Microclimate Alert: Elevated Temperature & Humidity Favorable for Larval Development',
    cause: 'Canopy temperature reached 32.8°C with 81% relative humidity, exceeding optimal bio-risk threshold.',
    recommendedAction: 'Check micro-sprinkler misting lines and soil moisture sensors. Monitor acoustic trend closely during evening peak emergence window.',
    status: 'resolved',
    acknowledgedAt: '2026-11-15 02:45 PM',
    resolvedAt: '2026-11-15 05:00 PM',
  },
];

// Generate Realistic Hourly Readings for Today (24 hours)
export function generateHourlyReadings(): EnvironmentReading[] {
  const readings: EnvironmentReading[] = [];
  const hours = [
    '00:00', '01:00', '02:00', '03:00', '04:00', '05:00',
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
  ];

  const zones: ZoneId[] = ['zone-a', 'zone-b', 'zone-c'];

  hours.forEach((timeLabel, idx) => {
    // Diurnal variation: cool at 04:00-06:00 (~24-25°C), warmest at 13:00-15:00 (~31-33°C)
    // Humidity inversely varies: highest early morning (~80-86%), lowest mid-afternoon (~58-64%)
    const hourFactor = Math.sin(((idx - 8) / 24) * 2 * Math.PI); // peaks around 14:00
    const baseTemp = 28.5 + hourFactor * 3.8;
    const baseHumid = 70.0 - hourFactor * 13.0;

    zones.forEach((zoneId, zIdx) => {
      // slight zone variation
      const zoneTempOffset = zIdx === 0 ? -0.8 : zIdx === 1 ? 0.9 : 0.1;
      const zoneHumidOffset = zIdx === 0 ? 2.5 : zIdx === 1 ? 3.0 : -3.5;

      const temp = Math.round((baseTemp + zoneTempOffset + (Math.sin(idx * 1.5) * 0.4)) * 10) / 10;
      const humid = Math.round(Math.max(50, Math.min(88, baseHumid + zoneHumidOffset + (Math.cos(idx) * 1.2))));

      readings.push({
        timestamp: `2026-11-16 ${timeLabel}`,
        dateKey: '2026-11-16',
        timeLabel,
        zoneId,
        temperatureC: temp,
        relativeHumidityPct: humid,
        isSimulated: true,
      });
    });
  });

  return readings;
}

// Generate 7-day daily summary telemetry
export function generate7DayReadings(): Array<{
  date: string;
  dayLabel: string;
  avgTempA: number;
  avgTempB: number;
  avgTempC: number;
  avgHumidA: number;
  avgHumidB: number;
  avgHumidC: number;
  pestEvents: number;
}> {
  const days = [
    { date: '2026-11-10', dayLabel: 'Tue' },
    { date: '2026-11-11', dayLabel: 'Wed' },
    { date: '2026-11-12', dayLabel: 'Thu' },
    { date: '2026-11-13', dayLabel: 'Fri' },
    { date: '2026-11-14', dayLabel: 'Sat' },
    { date: '2026-11-15', dayLabel: 'Sun' },
    { date: '2026-11-16', dayLabel: 'Today' },
  ];

  return days.map((d, i) => ({
    date: d.date,
    dayLabel: d.dayLabel,
    avgTempA: Math.round((27.8 + Math.sin(i) * 1.1) * 10) / 10,
    avgTempB: Math.round((30.4 + Math.cos(i) * 1.2) * 10) / 10,
    avgTempC: Math.round((28.9 + Math.sin(i * 0.8) * 0.9) * 10) / 10,
    avgHumidA: Math.round(66 + Math.cos(i) * 5),
    avgHumidB: Math.round(76 + Math.sin(i) * 6),
    avgHumidC: Math.round(62 + Math.cos(i * 0.5) * 4),
    pestEvents: [3, 2, 5, 4, 8, 9, 6][i],
  }));
}

// Generate 30-day daily telemetry
export function generate30DayReadings(): Array<{
  date: string;
  avgTemp: number;
  minTemp: number;
  maxTemp: number;
  avgHumidity: number;
  pestDetections: number;
}> {
  const points = [];
  for (let i = 29; i >= 0; i--) {
    const day = 16 - i;
    const dateStr = day > 0 ? `Nov ${day}` : `Oct ${31 + day}`;
    const baseT = 29.2 + Math.sin(i * 0.4) * 1.6;
    const baseH = 69 + Math.cos(i * 0.35) * 8;
    const events = Math.max(1, Math.round(4 + Math.sin(i * 0.6) * 3 + (i < 5 ? 3 : 0)));

    points.push({
      date: dateStr,
      avgTemp: Math.round(baseT * 10) / 10,
      minTemp: Math.round((baseT - 3.4) * 10) / 10,
      maxTemp: Math.round((baseT + 3.8) * 10) / 10,
      avgHumidity: Math.round(baseH),
      pestDetections: events,
    });
  }
  return points;
}

// Activity Trend Points for Dashboard
export const ACTIVITY_TREND_HOURLY = [
  { time: '04:00', targetA: 0, targetB: 1, unknown: 2, total: 3 },
  { time: '06:00', targetA: 1, targetB: 2, unknown: 4, total: 7 },
  { time: '08:00', targetA: 2, targetB: 1, unknown: 3, total: 6 },
  { time: '10:00', targetA: 4, targetB: 2, unknown: 2, total: 8 },
  { time: '12:00', targetA: 6, targetB: 3, unknown: 1, total: 10 },
  { time: '14:00', targetA: 5, targetB: 2, unknown: 2, total: 9 },
  { time: '16:00', targetA: 3, targetB: 1, unknown: 3, total: 7 },
  { time: '18:00', targetA: 4, targetB: 2, unknown: 5, total: 11 },
];
