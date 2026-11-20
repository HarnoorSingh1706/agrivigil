"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  Layers,
  RotateCw,
  Cpu,
  Radio,
  Sun,
  Shield,
  Activity,
  Maximize2,
  Minimize2,
  TreePine,
  CheckCircle2,
  Info,
  Sparkles,
  Volume2
} from "lucide-react";

export interface ComponentSpec {
  id: string;
  name: string;
  techSpecs: string;
  role: string;
  positionDesc: string;
}

export const HARDWARE_COMPONENTS: ComponentSpec[] = [
  {
    id: "solar_mppt",
    name: "Monocrystalline Solar Harvest Top",
    techSpecs: "5V 250mA (1.25W Peak) with BQ25570 Nano-power MPPT Harvester",
    role: "Provides uninterrupted self-sustaining operation inside the canopy, charging dual LiFePO4 cells even under partial leaf shade.",
    positionDesc: "Mounted on top cover at a 20° tilt."
  },
  {
    id: "enclosure",
    name: "IP67 Weatherproof Bio-Casing",
    techSpecs: "UV-stabilized Polycarbonate & ABS Blend, Silicone O-Ring Gasket",
    role: "Shields internal precision electronics from monsoon tropical rains, high humidity, sap, and intense sunlight.",
    positionDesc: "Main outer protective shell."
  },
  {
    id: "mcu_edge_ai",
    name: "ESP32-S3 Dual-Core AI Microcontroller",
    techSpecs: "Xtensa 32-bit LX7 @ 240MHz, 8MB PSRAM, 512KB SRAM, Vector Instructions",
    role: "Runs on-edge TinyML 1D-CNN and FFT spectrogram inference on acoustic samples, classifying insect boring frequencies without needing continuous cloud connection.",
    positionDesc: "Central system PCB layer."
  },
  {
    id: "lora_antenna",
    name: "Sub-GHz LoRa Long-Range Transceiver",
    techSpecs: "Semtech SX1262 @ 868/915 MHz, +22dBm output, >5km plantation line-of-sight",
    role: "Transmits detection alerts, confidence scores, and microclimate telemetry to the central gateway node with minimal energy draw.",
    positionDesc: "Helical rubberized whip antenna on top right."
  },
  {
    id: "sht31_sensor",
    name: "Sensirion SHT31 Microclimate Array",
    techSpecs: "±1.5% RH accuracy, ±0.1°C temperature precision with PTFE dust filter",
    role: "Continuously tracks microclimate, temperature, and humidity, correlating conditions with insect oviposition and hatching cycles.",
    positionDesc: "Louvered ventilation capsule at base."
  },
  {
    id: "acoustic_probe",
    name: "Piezo-MEMS Bio-Acoustic Trunk Probe",
    techSpecs: "Knowles High-SNR Transducer + MAX9814 AGC Preamp (100Hz – 12kHz)",
    role: "Directly couples with tree trunk phloem and xylem fibers, picking up the faint internal crunching, chewing, and stridulation of boring larvae invisible to visual scouting.",
    positionDesc: "Hardened stainless steel acoustic waveguide probe at the rear base."
  },
  {
    id: "trunk_strap",
    name: "Silicone Tree-Safe Mounting Harness",
    techSpecs: "Non-invasive, UV-resistant elastic strap with spring tensioner",
    role: "Firmly attaches the sensor node to the tree trunk without damaging bark or inhibiting palm trunk growth.",
    positionDesc: "Wraps around tree bark."
  }
];

export const Hardware3DViewer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedComp, setSelectedComp] = useState<ComponentSpec>(HARDWARE_COMPONENTS[0]);
  const [isExploded, setIsExploded] = useState<boolean>(false);
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(true);
  const [showTreeMount, setShowTreeMount] = useState<boolean>(true);
  const [simPulse, setSimPulse] = useState<boolean>(false);

  // References to 3D parts to animate
  const partsRef = useRef<{
    solarTop?: THREE.Group;
    enclosureTop?: THREE.Mesh;
    pcbCore?: THREE.Group;
    antenna?: THREE.Group;
    probe?: THREE.Group;
    sensorCapsule?: THREE.Group;
    treeTrunk?: THREE.Group;
    ledStatus?: THREE.Mesh;
    pulseRings?: THREE.Mesh[];
  }>({});

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0e1713); // Deep dark forest green-black

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(4, 3, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // Grid Floor
    const gridHelper = new THREE.GridHelper(10, 20, 0x15803d, 0x1f2937);
    gridHelper.position.y = -2.2;
    scene.add(gridHelper);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(5, 8, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x22c55e, 0.8);
    fillLight.position.set(-6, -2, -4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.0);
    rimLight.position.set(0, 5, -6);
    scene.add(rimLight);

    // Root model group
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // ==========================================
    // 1. Tree Trunk Simulation (Host plantation trunk)
    // ==========================================
    const treeGroup = new THREE.Group();
    const trunkGeo = new THREE.CylinderGeometry(1.6, 1.7, 5.5, 32);
    const trunkMat = new THREE.MeshStandardMaterial({
      color: 0x3d2b1f,
      roughness: 0.9,
      metalness: 0.1,
    });
    const trunkMesh = new THREE.Mesh(trunkGeo, trunkMat);
    trunkMesh.position.set(0, 0.2, -2.1);
    trunkMesh.receiveShadow = true;
    treeGroup.add(trunkMesh);

    // Trunk Bark Ridges
    for (let i = 0; i < 8; i++) {
      const ringGeo = new THREE.TorusGeometry(1.65, 0.04, 8, 32);
      const ringMat = new THREE.MeshStandardMaterial({ color: 0x2e1f16, roughness: 0.95 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(0, -1.8 + i * 0.65, -2.1);
      treeGroup.add(ring);
    }
    modelGroup.add(treeGroup);
    partsRef.current.treeTrunk = treeGroup;

    // ==========================================
    // 2. Main Enclosure Base (IP67 Body)
    // ==========================================
    const baseGeo = new THREE.BoxGeometry(1.4, 2.0, 0.8);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x1b2820,
      metalness: 0.2,
      roughness: 0.4,
    });
    const enclosureBase = new THREE.Mesh(baseGeo, baseMat);
    enclosureBase.castShadow = true;
    enclosureBase.receiveShadow = true;
    modelGroup.add(enclosureBase);

    // ==========================================
    // 3. Enclosure Top Lid (Transparent / Tinted Cover)
    // ==========================================
    const topLidGeo = new THREE.BoxGeometry(1.42, 2.02, 0.3);
    const topLidMat = new THREE.MeshPhysicalMaterial({
      color: 0x10b981,
      metalness: 0.1,
      roughness: 0.2,
      transmission: 0.65,
      opacity: 0.85,
      transparent: true,
      ior: 1.5,
    });
    const enclosureTop = new THREE.Mesh(topLidGeo, topLidMat);
    enclosureTop.position.set(0, 0, 0.45);
    modelGroup.add(enclosureTop);
    partsRef.current.enclosureTop = enclosureTop;

    // ==========================================
    // 4. Solar MPPT Harvest Top Cap
    // ==========================================
    const solarGroup = new THREE.Group();
    const solarPanelGeo = new THREE.BoxGeometry(1.3, 0.08, 0.9);
    const solarMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.2,
      metalness: 0.8,
    });
    const solarMesh = new THREE.Mesh(solarPanelGeo, solarMat);

    // Solar cells grid lines
    const solarLinesGeo = new THREE.PlaneGeometry(1.25, 0.85);
    const solarLinesMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });
    const solarLines = new THREE.Mesh(solarLinesGeo, solarLinesMat);
    solarLines.rotation.x = -Math.PI / 2;
    solarLines.position.y = 0.05;

    solarGroup.add(solarMesh);
    solarGroup.add(solarLines);
    solarGroup.position.set(0, 1.15, 0.1);
    solarGroup.rotation.x = 0.2; // tilted toward canopy sun
    modelGroup.add(solarGroup);
    partsRef.current.solarTop = solarGroup;

    // ==========================================
    // 5. Internal PCB & TinyML Chipset
    // ==========================================
    const pcbGroup = new THREE.Group();
    const pcbBoardGeo = new THREE.BoxGeometry(1.2, 1.7, 0.06);
    const pcbMat = new THREE.MeshStandardMaterial({
      color: 0x064e3b, // Circuit board emerald
      roughness: 0.3,
      metalness: 0.4,
    });
    const pcbMesh = new THREE.Mesh(pcbBoardGeo, pcbMat);
    pcbGroup.add(pcbMesh);

    // ESP32-S3 SoC Chip
    const mcuGeo = new THREE.BoxGeometry(0.45, 0.45, 0.08);
    const mcuMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      metalness: 0.85,
      roughness: 0.2,
    });
    const mcuMesh = new THREE.Mesh(mcuGeo, mcuMat);
    mcuMesh.position.set(0, 0.25, 0.05);
    pcbGroup.add(mcuMesh);

    // Status LED
    const ledGeo = new THREE.SphereGeometry(0.04, 16, 16);
    const ledMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const ledMesh = new THREE.Mesh(ledGeo, ledMat);
    ledMesh.position.set(0.4, 0.65, 0.05);
    pcbGroup.add(ledMesh);
    partsRef.current.ledStatus = ledMesh;

    // Dual 18650 / LiFePO4 Battery Cylinders
    const batGeo = new THREE.CylinderGeometry(0.16, 0.16, 1.1, 16);
    const batMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, metalness: 0.4, roughness: 0.4 });
    const bat1 = new THREE.Mesh(batGeo, batMat);
    bat1.position.set(-0.35, -0.25, 0.05);
    const bat2 = new THREE.Mesh(batGeo, batMat);
    bat2.position.set(0.35, -0.25, 0.05);
    pcbGroup.add(bat1);
    pcbGroup.add(bat2);

    pcbGroup.position.set(0, 0, 0.1);
    modelGroup.add(pcbGroup);
    partsRef.current.pcbCore = pcbGroup;

    // ==========================================
    // 6. LoRa Sub-GHz Antenna
    // ==========================================
    const antennaGroup = new THREE.Group();
    const antBaseGeo = new THREE.CylinderGeometry(0.06, 0.08, 0.15, 12);
    const antBaseMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.2 });
    const antBase = new THREE.Mesh(antBaseGeo, antBaseMat);
    antBase.position.y = 0.07;
    antennaGroup.add(antBase);

    const whipGeo = new THREE.CylinderGeometry(0.035, 0.045, 1.2, 12);
    const whipMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 });
    const whip = new THREE.Mesh(whipGeo, whipMat);
    whip.position.y = 0.7;
    antennaGroup.add(whip);

    antennaGroup.position.set(0.5, 1.0, -0.1);
    modelGroup.add(antennaGroup);
    partsRef.current.antenna = antennaGroup;

    // ==========================================
    // 7. Microclimate SHT31 Capsule (Louvered base)
    // ==========================================
    const sensorCapsuleGroup = new THREE.Group();
    const capsuleGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.35, 16);
    const capsuleMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.3,
      roughness: 0.3,
    });
    const capsuleMesh = new THREE.Mesh(capsuleGeo, capsuleMat);
    capsuleMesh.rotation.z = Math.PI / 2;
    sensorCapsuleGroup.add(capsuleMesh);
    sensorCapsuleGroup.position.set(-0.35, -1.15, 0);
    modelGroup.add(sensorCapsuleGroup);
    partsRef.current.sensorCapsule = sensorCapsuleGroup;

    // ==========================================
    // 8. Acoustic Stethoscope Trunk Waveguide Probe
    // ==========================================
    const probeGroup = new THREE.Group();
    const probeStemGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.7, 16);
    const probeMat = new THREE.MeshStandardMaterial({
      color: 0xc0c0c0,
      metalness: 0.95,
      roughness: 0.1,
    });
    const probeStem = new THREE.Mesh(probeStemGeo, probeMat);
    probeStem.rotation.x = Math.PI / 2;
    probeGroup.add(probeStem);

    // Tip conical probe that penetrates tree bark
    const probeTipGeo = new THREE.ConeGeometry(0.08, 0.25, 16);
    const probeTip = new THREE.Mesh(probeTipGeo, probeMat);
    probeTip.rotation.x = -Math.PI / 2;
    probeTip.position.z = -0.45;
    probeGroup.add(probeTip);

    // Piezo sound vibration visualizer rings
    const pulseRings: THREE.Mesh[] = [];
    for (let r = 0; r < 3; r++) {
      const ringGeo = new THREE.RingGeometry(0.09 + r * 0.08, 0.11 + r * 0.08, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xef4444,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7 - r * 0.2,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.z = -0.45;
      probeGroup.add(ringMesh);
      pulseRings.push(ringMesh);
    }
    partsRef.current.pulseRings = pulseRings;

    probeGroup.position.set(0, -0.6, -0.5);
    modelGroup.add(probeGroup);
    partsRef.current.probe = probeGroup;

    // ==========================================
    // Mouse Interactive Orbit Simulation
    // ==========================================
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let rotationSpeedX = 0;
    let rotationSpeedY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;

      rotationSpeedY = deltaX * 0.005;
      rotationSpeedX = deltaY * 0.005;

      modelGroup.rotation.y += rotationSpeedY;
      modelGroup.rotation.x += rotationSpeedX;

      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z = Math.max(3, Math.min(10, camera.position.z + e.deltaY * 0.005));
    };

    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    container.addEventListener("wheel", onWheel);

    // ==========================================
    // Animation Loop
    // ==========================================
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Slow idle auto-rotation if enabled
      if (isAutoRotate && !isDragging) {
        modelGroup.rotation.y += 0.004;
      }

      // LED Blinking Heartbeat (Green ok, Orange pulse)
      if (partsRef.current.ledStatus) {
        const pulse = (Math.sin(elapsedTime * 4) + 1) / 2;
        (partsRef.current.ledStatus.material as THREE.MeshBasicMaterial).color.setRGB(
          simPulse ? 0.95 : 0.06,
          simPulse ? 0.2 : 0.75 + pulse * 0.25,
          0.1
        );
      }

      // Acoustic vibration pulses at the probe
      if (partsRef.current.pulseRings) {
        partsRef.current.pulseRings.forEach((ring, idx) => {
          const s = 1 + ((elapsedTime * 3 + idx * 0.4) % 1) * 0.6;
          ring.scale.set(s, s, 1);
          (ring.material as THREE.MeshBasicMaterial).opacity = Math.max(
            0,
            1 - ((elapsedTime * 3 + idx * 0.4) % 1)
          );
        });
      }

      // Exploded View Interpolation
      const targetExplodeOffset = isExploded ? 1.0 : 0.0;
      if (partsRef.current.solarTop) {
        partsRef.current.solarTop.position.y = THREE.MathUtils.lerp(
          partsRef.current.solarTop.position.y,
          1.15 + targetExplodeOffset * 0.9,
          0.08
        );
      }
      if (partsRef.current.enclosureTop) {
        partsRef.current.enclosureTop.position.z = THREE.MathUtils.lerp(
          partsRef.current.enclosureTop.position.z,
          0.45 + targetExplodeOffset * 1.1,
          0.08
        );
      }
      if (partsRef.current.pcbCore) {
        partsRef.current.pcbCore.position.z = THREE.MathUtils.lerp(
          partsRef.current.pcbCore.position.z,
          0.1 + targetExplodeOffset * 0.4,
          0.08
        );
      }
      if (partsRef.current.probe) {
        partsRef.current.probe.position.z = THREE.MathUtils.lerp(
          partsRef.current.probe.position.z,
          -0.5 - targetExplodeOffset * 0.8,
          0.08
        );
      }

      // Toggle Tree Trunk Visibility
      if (partsRef.current.treeTrunk) {
        partsRef.current.treeTrunk.visible = showTreeMount;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      container.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, [isExploded, isAutoRotate, showTreeMount, simPulse]);

  return (
    <div className="space-y-6">
      {/* 3D Hardware Model Viewport Card */}
      <div className="relative rounded-2xl overflow-hidden border border-emerald-900/40 bg-radial from-emerald-950 via-stone-950 to-black shadow-2xl">
        {/* Interactive 3D Canvas */}
        <div
          ref={containerRef}
          className="w-full h-[520px] sm:h-[600px] cursor-grab active:cursor-grabbing select-none"
        />

        {/* Viewport Floating HUD Controls */}
        <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
          {/* Hardware Badge */}
          <div className="bg-stone-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-emerald-700/50 flex items-center gap-2 pointer-events-auto">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-mono text-xs font-bold text-emerald-300">
              AgriVigil Node v2.4 (Tree Stethoscope)
            </span>
          </div>

          {/* Quick HUD Action Buttons */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onClick={() => setIsExploded(!isExploded)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                isExploded
                  ? "bg-amber-500 text-stone-950 ring-2 ring-amber-300"
                  : "bg-stone-900/80 hover:bg-stone-800 text-stone-200 border border-stone-700"
              }`}
              title="Toggle Exploded Component Inspection"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{isExploded ? "Assemble Node" : "Exploded View"}</span>
            </button>

            <button
              onClick={() => setShowTreeMount(!showTreeMount)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                showTreeMount
                  ? "bg-emerald-800 text-white border border-emerald-500"
                  : "bg-stone-900/80 hover:bg-stone-800 text-stone-400 border border-stone-700"
              }`}
              title="Show Tree Trunk Mounting Contact"
            >
              <TreePine className="w-3.5 h-3.5" />
              <span>{showTreeMount ? "Tree Trunk Attached" : "Hide Trunk"}</span>
            </button>

            <button
              onClick={() => setIsAutoRotate(!isAutoRotate)}
              className={`p-2 rounded-xl text-xs transition-all shadow-md ${
                isAutoRotate
                  ? "bg-emerald-900 text-emerald-300 border border-emerald-700"
                  : "bg-stone-900/80 text-stone-400 border border-stone-700"
              }`}
              title="Toggle Auto-Rotation"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Viewport Bottom Interaction Hint */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2 text-[11px] text-stone-400 bg-stone-950/70 px-3 py-1.5 rounded-lg border border-stone-800 pointer-events-none">
          <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Click & Drag to rotate 360° &bull; Scroll to zoom &bull; Click components below to inspect engineering specs</span>
        </div>
      </div>

      {/* Component Specification Inspector Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Component Selector List */}
        <div className="md:col-span-1 bg-white rounded-xl border border-stone-200 p-4 shadow-xs space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5 mb-2">
            <Cpu className="w-4 h-4 text-emerald-700" />
            Sub-System Assembly
          </h4>
          <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
            {HARDWARE_COMPONENTS.map((comp) => {
              const isSelected = selectedComp.id === comp.id;
              return (
                <button
                  key={comp.id}
                  onClick={() => setSelectedComp(comp)}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-start justify-between gap-2 ${
                    isSelected
                      ? "bg-emerald-900 text-white border-emerald-900 shadow-xs font-semibold"
                      : "bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200"
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="font-bold">{comp.name}</div>
                    <div className={`text-[10px] truncate max-w-[210px] ${isSelected ? "text-emerald-200" : "text-stone-500"}`}>
                      {comp.positionDesc}
                    </div>
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Detailed Component Inspector Card */}
        <div className="md:col-span-2 bg-white rounded-xl border border-stone-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between gap-2 border-b border-stone-200 pb-3">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  {selectedComp.id.replace("_", " ").toUpperCase()}
                </span>
                <h3 className="text-lg font-bold text-emerald-950 font-serif mt-1">
                  {selectedComp.name}
                </h3>
              </div>
              <span className="text-xs text-stone-500 font-mono">
                Location: {selectedComp.positionDesc}
              </span>
            </div>

            {/* Technical Specifications */}
            <div className="mt-4 space-y-3">
              <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                  Hardware & Component Specifications
                </span>
                <p className="font-mono text-xs font-bold text-stone-900">
                  {selectedComp.techSpecs}
                </p>
              </div>

              <div className="bg-emerald-50/60 rounded-xl p-3.5 border border-emerald-200 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1 block">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                  Agronomic & Engineering Purpose
                </span>
                <p className="text-xs text-stone-700 leading-relaxed">
                  {selectedComp.role}
                </p>
              </div>
            </div>
          </div>

          {/* Academic / Pitch Presentation Tips */}
          <div className="bg-stone-100 border border-stone-200 rounded-xl p-3.5 text-xs text-stone-600 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Presentation Tip for Teachers / Judges: </strong>
              Explain why acoustic detection beats visual scouting: boring pests like the Red Palm Weevil (*Rhynchophorus ferrugineus*) feed deep within the vascular tissue of the trunk. Visual signs only appear when 80% of internal tissue is destroyed. The piezoelectric probe captures sound vibrations (1–6 kHz) directly through the wood fibers, allowing detection within 2–3 weeks of oviposition.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
