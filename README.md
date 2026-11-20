# AgriVigil - DeepTech Precision Bio-Acoustic & Microclimate Platform

> **Tagline:** Early-Warning Acoustic Pest Detection & Microclimate Intelligence for High-Value Plantations.  
> **Target Deployments:** Palm Oil, Date Palm, Coconut, Orchard Estates, Agro-Forestry & FPO Collectives.

AgriVigil is an interactive, responsive web application for a DeepTech precision-agriculture startup. The product is an acoustic pest detection and environmental monitoring system for commercial plantations. Hardware nodes use microphones to capture internal insect sounds (trunk mastication, stridulation) and temperature/humidity sensors to monitor canopy microclimate. Signal processing and edge AI classifiers estimate likely pest types; the web app presents detections, confidence, activity, environmental readings, alerts, plantation zones, historical analytics, and recommended inspection steps.

---

## 🌟 Application Structure & Modules

The platform is designed as a professional SaaS dashboard with a persistent desktop sidebar, responsive mobile navigation, interactive charts, and real-time mock data simulation:

1. **Dashboard Overview (`/dashboard`)**:
   - Plantation & selected farm indicator: *Sundarban Palm & Agro-Estate / Block 4 High-Density Precision Canopy*.
   - Live date display: *Nov 16, 2026*.
   - Monitored zones count (Zone A, B, C) and online sensor fleet status.
   - Latest temperature (°C), relative humidity (%), overall pest activity index, and active alert counters.
   - Pest-activity trend chart (Hourly/Daily detections for Target Pest A, Target Pest B, and Unknown sounds).
   - Temperature & Humidity dual-axis microclimate chart.
   - Quick action: **"Simulate Detection"** button that ingests live mock acoustic events.
   - Recent detections table with one-click inspection triggers.

2. **Pest Detections (`/dashboard/detections`)**:
   - Searchable and filterable registry of all acoustic events.
   - Filters by query keyword, zone, pest category, verification status, and activity severity.
   - Detailed Detection Inspector Modal:
     - Bioacoustic summary: Dominant frequency band (e.g., 2.8 kHz), bandwidth, pulse cadence, peak acoustic energy (dBFS).
     - **Illustrative Mock Spectrogram**: Multi-frequency time-slice heat map with playback simulation.
     - Microclimate snapshot at the exact moment of acoustic capture.
     - **Integrated Pest Management (IPM) Protocol**: Clear recommendations (ground-truthing frass, checking palm crowns, deploying pheromone traps) without automatically prescribing chemical spraying.
     - **Ground Scout Verification**: Operators can mark events as *Unverified*, *Field Verified*, or *False Positive*, record field notes, and save them.

3. **Microclimate Monitoring (`/dashboard/environment`)**:
   - Real-time temperature (°C) and relative humidity (%) readings.
   - Interactive time-range filters: **Today (24h diurnal curve)**, **Past 7 Days**, and **Past 30 Days**.
   - Zone-specific microclimate filters (All Zones, Zone A, Zone B, Zone C).
   - Summary statistics: Historical Min, Max, and Average temperature and humidity.
   - Visual reference lines for high/low warning thresholds.
   - Agronomic correlation explaining how microclimate affects pest larval emergence.

4. **Plantation Map / Zones (`/dashboard/zones`)**:
   - **Schematic Field Grid Map**: Topological representation of Zone A (North Palm Grove - 4.2 ha), Zone B (Central High-Density Canopy - 5.8 ha), and Zone C (Southern Nursery & Buffer - 3.1 ha).
   - Real-time status for each block: Node connectivity, live microclimate, pest activity level, and latest detection.
   - Visual highlighting of zones with active alerts requiring field scout inspection.
   - Interactive selection: Clicking any zone focuses the detail panel and syncs across components.
   - Field Scout dispatch trigger with instant toast feedback.

5. **Alerts Desk (`/dashboard/alerts`)**:
   - Categorized by severity (*Critical*, *Warning*, *Info*).
   - Details: Time, affected zone, sensor node ID, trigger cause, and recommended IPM action.
   - Functional **Acknowledge** and **Resolve** workflow controls with audit timestamps.
   - Filters by status (*Active/Unread*, *Acknowledged*, *Resolved*) and severity.
   - Animated floating Toast Notification system triggered on simulated alert events.

6. **History & Reports (`/dashboard/reports`)**:
   - Historical archive with multi-variable filters (date range, zone, pest category, severity).
   - **Functional CSV Export**: Instantly exports filtered detection records with timestamps, frequencies, decibel energy, and microclimate data as a real `.csv` download.
   - **Print-Friendly Audit Report**: Formatted print sheet with plantation headers, summary metrics, and record table (`window.print()`).

7. **Device Settings (`/dashboard/devices`)**:
   - Registered sensor nodes registry (NODE-001 in Zone A, NODE-002 in Zone B, NODE-003 in Zone C).
   - Displays device alias, connectivity status, last-seen time, simulated battery level (%), LoRa signal (dBm), and firmware version.
   - Working modal form to edit device names, reassign zones, and adjust sampling intervals.
   - Configurable alert threshold form: Max/Min Temperature, Max/Min Relative Humidity, Classifier Confidence Threshold, and Auto-Flag Inspection Threshold.
   - Complete persistence to `localStorage`.
   - **Reset Demo Data** button to quickly restore pristine state anytime.

---

## 🛠️ Technology Stack

- **Framework**: React 19 + Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Data Visualization**: Recharts (Area charts, Line charts)
- **Icons**: Lucide React
- **State & Storage**: React Context + `localStorage` for cross-page persistence
- **External Dependencies**: Zero paid APIs, no external backend required for demonstration.

---

## 🏃 Running the Application Locally

### 1. Installation
Clone the repository and enter the directory:
```bash
cd agrivigil-app
npm install
```

### 2. Development Mode
Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser. The root URL automatically routes directly to `/dashboard`.

### 3. Production Build & Run
To test the optimized production build:
```bash
npm run build
npm run start
```
The application will serve at `http://localhost:3000`.

---

## 🧪 Demonstration vs. Production Architecture

### What is Simulated in this Prototype:
- **Acoustic Waveforms & Spectrograms**: The spectral heat profiles, pulse cadence (8-14 pulses/sec), and spectrogram bars are mathematically simulated based on empirical bioacoustic research on *Rhynchophorus ferrugineus* and *Oryctes rhinoceros*.
- **Classifier Confidence Scores**: Confidence percentages (e.g., 91%, 82%, 68%) are heuristic mock outputs to demonstrate the UI triage flow.
- **Sensor Telemetry**: Temperature (27–32°C) and Relative Humidity (55–85%) follow realistic diurnal cycles.
- **In-App Alerts**: Floating toast notifications simulate alerts locally without sending real cellular SMS or push messages.

### Requirements for Connecting Real Hardware in Production:
1. **Physical Sensor Nodes**:
   - **Microcontroller**: ESP32-S3 or Nordic nRF5340 dual-core MCU with sleep current $< 15\,\mu\text{A}$.
   - **Acoustic Transducer**: Knowles SPH0645LM4H-B or piezoelectric contact transducer coupled to the tree trunk with a stainless-steel acoustic waveguide probe.
   - **Environmental Sensor**: Sensirion SHT31-DIS-F or SHT40 for high-accuracy temperature and relative humidity.
   - **Power**: 2W Monocrystalline solar panel + 18650 LiFePO4 battery with integrated MPPT charge controller.
2. **On-Edge Signal Processing & TinyML**:
   - 16 kHz audio sampling window (e.g. 3-second buffer every 5 minutes).
   - Fast Fourier Transform (FFT) or Mel-frequency cepstral coefficients (MFCC) feature extraction.
   - Quantized TensorFlow Lite for Microcontrollers (TFLite Micro) model executing 1D-CNN inference on-device to minimize transmit power.
3. **Connectivity & Backend Gateway**:
   - **Radio**: SX1262 LoRa transceiver (868/915 MHz) transmitting lightweight 16-byte detection packets (Pest Class, Confidence, Temp, RH, Battery).
   - **Gateway**: LoRaWAN field gateway with 4G/LTE backhaul.
   - **Cloud Ingestion**: MQTT / WebSockets broker (e.g. EMQX / AWS IoT Core) piping telemetry into a time-series database (TimescaleDB / InfluxDB) and REST API.

---

## 📋 IPM & Responsible Agronomic Advisory

AgriVigil strictly enforces responsible Integrated Pest Management (IPM) guidelines:
- Acoustic detections flag locations where physical ground-truthing by scouts should occur.
- Environmental readings provide biological context (higher temperatures accelerate larval development) rather than direct proof of infestation.
- The platform **never automatically prescribes or recommends chemical pesticides** based solely on acoustic classification, preventing unwarranted chemical exposure and preserving beneficial entomofauna.
